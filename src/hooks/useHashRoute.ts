import { useEffect, useState } from 'react';

/**
 * Routing basato sull'hash (#/compare, #/repo/unleashed...):
 * funziona su GitHub Pages senza fallback 404 e su qualsiasi hosting statico.
 */
export type Route =
  | { view: 'directory'; detail?: string }
  | { view: 'compare' }
  | { view: 'lab' };

function parse(hash: string): Route {
  const [, a, b] = hash.replace(/^#/, '').split('/');
  if (a === 'compare') return { view: 'compare' };
  if (a === 'lab') return { view: 'lab' };
  if (a === 'repo' && b) return { view: 'directory', detail: decodeURIComponent(b) };
  return { view: 'directory' };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState(() => parse(location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const go = (path: string) => {
  location.hash = path;
};
