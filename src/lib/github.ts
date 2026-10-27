/**
 * Arricchimento dati da GitHub, interamente lato client.
 *
 * Ordine delle fonti per ogni repository:
 *   1. cache localStorage (se più recente di CACHE_TTL)
 *   2. snapshot generato in build (public/github-cache.json, vedi scripts/prefetch-github.mjs)
 *   3. API REST pubblica di GitHub (60 richieste/ora senza token)
 */

export interface RepoInfo {
  repo: string;
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  pushedAt: string;
  description: string | null;
  avatar: string;
  htmlUrl: string;
  license: string | null;
  release: ReleaseInfo | null;
  fetchedAt: number;
}

export interface ReleaseInfo {
  tag: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
  /** Primo asset .tgz se presente: è il pacchetto installabile da qFlipper */
  asset: { name: string; url: string } | null;
}

interface Snapshot {
  generatedAt: string;
  repos: Record<string, RepoInfo>;
}

const API = 'https://api.github.com';
const CACHE_PREFIX = 'fzhub:gh:';
const CACHE_TTL = 6 * 60 * 60 * 1000;

let snapshotPromise: Promise<Snapshot | null> | null = null;

export function loadSnapshot(): Promise<Snapshot | null> {
  snapshotPromise ??= fetch(`${import.meta.env.BASE_URL}github-cache.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Snapshot>) : null))
    .catch(() => null);
  return snapshotPromise;
}

function readCache(repo: string): RepoInfo | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + repo);
    if (!raw) return null;
    const info = JSON.parse(raw) as RepoInfo;
    return Date.now() - info.fetchedAt < CACHE_TTL ? info : null;
  } catch {
    return null;
  }
}

const MISS_PREFIX = `${CACHE_PREFIX}miss:`;

function isKnownMissing(repo: string) {
  try {
    return Date.now() - Number(localStorage.getItem(MISS_PREFIX + repo) ?? 0) < CACHE_TTL;
  } catch {
    return false;
  }
}

function markMissing(repo: string) {
  try {
    localStorage.setItem(MISS_PREFIX + repo, String(Date.now()));
  } catch {
    /* ignora */
  }
}

function writeCache(info: RepoInfo) {
  try {
    localStorage.setItem(CACHE_PREFIX + info.repo, JSON.stringify(info));
  } catch {
    /* storage pieno o bloccato: si lavora senza cache */
  }
}

export class RateLimitError extends Error {
  constructor(public resetAt: number) {
    super('GitHub API rate limit raggiunto');
  }
}

async function gh<T>(path: string): Promise<T | null> {
  const res = await fetch(API + path, { headers: { Accept: 'application/vnd.github+json' } });
  if (res.status === 404) return null;
  if (res.status === 403 || res.status === 429) {
    const reset = Number(res.headers.get('x-ratelimit-reset') ?? 0) * 1000;
    throw new RateLimitError(reset);
  }
  if (!res.ok) throw new Error(`GitHub ${res.status} su ${path}`);
  return res.json() as Promise<T>;
}

/* Tipi minimi delle risposte GitHub */
interface GhRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  archived: boolean;
  pushed_at: string;
  description: string | null;
  html_url: string;
  owner: { avatar_url: string };
  license: { spdx_id: string } | null;
}
interface GhRelease {
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
  assets: { name: string; browser_download_url: string }[];
}

/** Sceglie il pacchetto installabile: preferisce "*update*.tgz", scarta script, SDK e build di debug */
function pickFirmwareAsset<T extends { name: string }>(assets: T[]): T | undefined {
  const tgz = assets.filter((a) => a.name.endsWith('.tgz') && !/scripts|sdk|debug/i.test(a.name));
  return tgz.find((a) => /update/i.test(a.name)) ?? tgz[0];
}

export function toRepoInfo(repo: string, r: GhRepo, rel: GhRelease | null): RepoInfo {
  const tgz = pickFirmwareAsset(rel?.assets ?? []);
  return {
    repo,
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    archived: r.archived,
    pushedAt: r.pushed_at,
    description: r.description,
    avatar: r.owner.avatar_url,
    htmlUrl: r.html_url,
    license: r.license?.spdx_id ?? null,
    release: rel
      ? {
          tag: rel.tag_name,
          name: rel.name || rel.tag_name,
          publishedAt: rel.published_at,
          htmlUrl: rel.html_url,
          asset: tgz ? { name: tgz.name, url: tgz.browser_download_url } : null,
        }
      : null,
    fetchedAt: Date.now(),
  };
}

export async function fetchRepoLive(repo: string): Promise<RepoInfo | null> {
  const [r, rel] = await Promise.all([
    gh<GhRepo>(`/repos/${repo}`),
    gh<GhRelease>(`/repos/${repo}/releases/latest`),
  ]);
  if (!r) {
    markMissing(repo);
    return null;
  }
  const info = toRepoInfo(repo, r, rel);
  writeCache(info);
  return info;
}

/**
 * Restituisce le info per tutte le repo. Con `force` ignora snapshot
 * (ma non la cache fresca) e interroga l'API live.
 */
export async function getRepos(
  repos: string[],
  { force = false, onItem }: { force?: boolean; onItem?: (info: RepoInfo) => void } = {},
): Promise<{ data: Record<string, RepoInfo>; rateLimited: number | null }> {
  const data: Record<string, RepoInfo> = {};
  const snapshot = force ? null : await loadSnapshot();
  const missing: string[] = [];

  for (const repo of repos) {
    const hit = readCache(repo) ?? snapshot?.repos[repo] ?? null;
    if (hit) {
      data[repo] = hit;
      onItem?.(hit);
    } else if (!isKnownMissing(repo)) missing.push(repo);
  }

  let rateLimited: number | null = null;
  // Richieste sequenziali a piccoli lotti per essere gentili con il rate limit
  for (let i = 0; i < missing.length && rateLimited === null; i += 4) {
    const batch = missing.slice(i, i + 4);
    const results = await Promise.allSettled(batch.map(fetchRepoLive));
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) {
        data[res.value.repo] = res.value;
        onItem?.(res.value);
      } else if (res.status === 'rejected' && res.reason instanceof RateLimitError) {
        rateLimited = res.reason.resetAt;
      }
    }
  }
  return { data, rateLimited };
}

export function clearGithubCache() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignora */
  }
}
