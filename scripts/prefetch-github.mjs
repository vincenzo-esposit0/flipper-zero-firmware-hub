#!/usr/bin/env node
/**
 * Genera public/github-cache.json in fase di build (SSG dei dati GitHub).
 * In GitHub Actions usa GITHUB_TOKEN per avere 1000+ richieste/ora.
 * Se qualcosa va storto non fa fallire la build: il client ripiega sull'API live.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const source = await readFile(new URL('src/data/firmwares.ts', root), 'utf8');
const repos = [...new Set([...source.matchAll(/repo:\s*'([^']+)'/g)].map((m) => m[1]))];

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'flipper-hub-prefetch' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const dest = fileURLToPath(new URL('public/github-cache.json', root));
// Snapshot precedente: se una richiesta fallisce (es. rate limit) si conservano i dati vecchi
const previous = await readFile(dest, 'utf8').then(JSON.parse).catch(() => ({ repos: {} }));
const out = { generatedAt: new Date().toISOString(), repos: {} };

for (const repo of repos) {
  try {
    const [r, rel] = await Promise.all([gh(`/repos/${repo}`), gh(`/repos/${repo}/releases/latest`)]);
    if (!r) {
      console.warn(`! ${repo}: non trovato`);
      continue;
    }
    const tgzs = (rel?.assets ?? []).filter((a) => a.name.endsWith('.tgz') && !/scripts|sdk|debug/i.test(a.name));
    const tgz = tgzs.find((a) => /update/i.test(a.name)) ?? tgzs[0];
    out.repos[repo] = {
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
    console.log(`✓ ${repo} ★${r.stargazers_count}`);
  } catch (err) {
    const old = previous.repos?.[repo];
    if (old) out.repos[repo] = old;
    console.warn(`! ${repo}: ${err.message}${old ? ' (mantengo il dato precedente)' : ''}`);
  }
}

await writeFile(dest, JSON.stringify(out, null, 2));
console.log(`Snapshot: ${Object.keys(out.repos).length}/${repos.length} repo → ${dest}`);
