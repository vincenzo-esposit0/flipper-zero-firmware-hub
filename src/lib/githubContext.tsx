import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { ENTRIES } from '../data/firmwares';
import { clearGithubCache, getRepos, type RepoInfo } from './github';

type SyncState = 'idle' | 'loading' | 'ok' | 'rate-limited';

interface GithubState {
  repos: Record<string, RepoInfo>;
  state: SyncState;
  resetAt: number | null;
  refresh: () => void;
}

const GithubContext = createContext<GithubState | null>(null);
const ALL_REPOS = ENTRIES.map((e) => e.repo);

export function GithubProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<Record<string, RepoInfo>>({});
  const [state, setState] = useState<SyncState>('idle');
  const [resetAt, setResetAt] = useState<number | null>(null);

  const load = useCallback(async (force: boolean) => {
    setState('loading');
    if (force) clearGithubCache();
    const { rateLimited } = await getRepos(ALL_REPOS, {
      force,
      onItem: (info) => setRepos((prev) => ({ ...prev, [info.repo]: info })),
    });
    setResetAt(rateLimited);
    setState(rateLimited ? 'rate-limited' : 'ok');
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  return (
    <GithubContext.Provider value={{ repos, state, resetAt, refresh: () => load(true) }}>
      {children}
    </GithubContext.Provider>
  );
}

export function useGithub() {
  const ctx = useContext(GithubContext);
  if (!ctx) throw new Error('useGithub fuori da GithubProvider');
  return ctx;
}
