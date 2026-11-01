import { useGithub } from '../lib/githubContext';
import { useI18n } from '../lib/i18n';

export function Footer() {
  const { state, resetAt } = useGithub();
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-6 text-xs text-dim">
        <p>{t.footer.disclaimer}</p>
        <p>
          github sync:{' '}
          {state === 'rate-limited' ? (
            <span className="text-warn">
              {t.footer.rateLimit} {resetAt ? t.footer.at(new Date(resetAt).toLocaleTimeString(t.locale)) : t.footer.later}
            </span>
          ) : (
            <span className="text-neon">{state}</span>
          )}
        </p>
      </div>
    </footer>
  );
}
