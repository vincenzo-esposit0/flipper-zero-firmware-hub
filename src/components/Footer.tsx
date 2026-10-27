import { useGithub } from '../lib/githubContext';

export function Footer() {
  const { state, resetAt } = useGithub();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-6 text-xs text-dim">
        <p>
          Progetto didattico non affiliato a Flipper Devices Inc. Usa il dispositivo nel rispetto della legge e solo su
          sistemi per cui hai autorizzazione.
        </p>
        <p>
          github sync:{' '}
          {state === 'rate-limited' ? (
            <span className="text-warn">
              rate limit, riprova {resetAt ? `alle ${new Date(resetAt).toLocaleTimeString('it-IT')}` : 'più tardi'}
            </span>
          ) : (
            <span className="text-neon">{state}</span>
          )}
        </p>
      </div>
    </footer>
  );
}
