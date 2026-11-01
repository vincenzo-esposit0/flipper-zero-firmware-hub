import { BookOpen, Columns3, Cpu, ExternalLink, LayoutGrid, MonitorDot, RefreshCw, Search, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { go, type Route } from '../hooks/useHashRoute';
import { EMULATOR_URL } from '../data/strings';
import { useGithub } from '../lib/githubContext';
import { useI18n } from '../lib/i18n';
import { useSettings } from '../lib/settings';
import { TypingText } from './TypingText';

const NAV = [
  { path: '/', view: 'directory', label: 'catalog', Icon: LayoutGrid },
  { path: '/compare', view: 'compare', label: 'compare', Icon: Columns3 },
  { path: '/lab', view: 'lab', label: 'lab', Icon: BookOpen },
] as const;

const COMMANDS = [
  './scan --target=firmware --sort=stars',
  'git clone github.com/DarkFlippers/unleashed-firmware',
  'diff official/ momentum/ --features',
  'cat ETHICS.md | less',
  'ufbt launch APPID=hello_lab',
];

export function Header({ route, query, onQuery }: { route: Route; query: string; onQuery: (q: string) => void }) {
  const { crt, sound, toggleCrt, toggleSound, click } = useSettings();
  const { state, refresh } = useGithub();
  const { lang, toggleLang, t } = useI18n();
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" porta il focus sulla ricerca, come su GitHub
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const iconBtn = 'btn min-w-[2.5rem] justify-center px-2';

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/90 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-neon focus:px-3 focus:py-1 focus:text-void">
        {t.header.skip}
      </a>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <a href="#/" className="flex items-center gap-2 font-display text-xl" onClick={() => click()} aria-label={t.header.homeLabel}>
          <span className="border border-flipper px-1.5 text-flipper glow">FZ</span>
          <span className="text-ink">
            ::<span className="text-neon glow">HUB</span>
          </span>
        </a>

        <nav className="order-4 flex w-full flex-wrap gap-1 lg:order-none lg:w-auto lg:flex-nowrap" aria-label={t.header.sections}>
          {NAV.map(({ path, view, label, Icon }) => (
            <a
              key={view}
              href={`#${path}`}
              onClick={() => click(660)}
              aria-current={route.view === view ? 'page' : undefined}
              className={`chip flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-1 text-xs sm:px-3 sm:text-sm lg:flex-none ${route.view === view ? 'chip-on' : 'chip-off'}`}
            >
              <Icon size={16} className="hidden xl:block" /> {t.header[label]}
            </a>
          ))}
          <a
            href={EMULATOR_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => click(660)}
            className="chip chip-off flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-1 text-xs sm:px-3 sm:text-sm lg:flex-none"
          >
            <Cpu size={16} className="hidden xl:block" /> {t.header.emulator}
            <ExternalLink size={12} className="hidden sm:block" aria-hidden="true" />
            <span className="sr-only">{t.common.newTab}</span>
          </a>
        </nav>

        <div className="relative order-3 flex w-full min-w-0 items-center sm:order-none sm:ml-auto sm:w-auto sm:max-w-sm sm:flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 text-neon" />
          <input
            ref={searchRef}
            type="search"
            aria-label={t.header.searchLabel}
            value={query}
            onChange={(e) => {
              onQuery(e.target.value);
              if (route.view !== 'directory') go('/');
            }}
            onKeyDown={(e) => e.key === 'Escape' && onQuery('')}
            placeholder={t.header.searchPlaceholder}
            className="h-10 w-full border border-line bg-panel pl-9 pr-16 text-base text-ink placeholder:text-dim/80 focus:border-neon focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              onClick={() => {
                onQuery('');
                searchRef.current?.focus();
              }}
              className="absolute right-2 p-1 text-dim hover:text-warn"
              aria-label={t.header.clearSearch}
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2 hidden border border-line px-1.5 text-xs text-dim sm:block">/</kbd>
          )}
        </div>

        <div className="order-2 ml-auto flex gap-1 sm:order-none sm:ml-0">
          <button
            title={t.header.refresh}
            aria-label={t.header.refresh}
            onClick={refresh}
            disabled={state === 'loading'}
            className={`${iconBtn} ${state === 'rate-limited' ? 'border-warn/60 text-warn' : 'btn-ghost'}`}
          >
            <RefreshCw size={16} className={state === 'loading' ? 'animate-spin' : ''} />
          </button>
          <button
            title={t.header.crt}
            aria-label={t.header.crt}
            aria-pressed={crt}
            onClick={toggleCrt}
            className={`${iconBtn} ${crt ? 'btn-neon' : 'btn-ghost'}`}
          >
            <MonitorDot size={16} />
          </button>
          <button
            title={t.header.sound}
            aria-label={t.header.sound}
            aria-pressed={sound}
            onClick={toggleSound}
            className={`${iconBtn} ${sound ? 'btn-neon' : 'btn-ghost'}`}
          >
            {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            title={t.header.language}
            aria-label={t.header.language}
            onClick={() => {
              click(660);
              toggleLang();
            }}
            className={`${iconBtn} btn-ghost whitespace-nowrap font-normal`}
          >
            <span className={lang === 'it' ? 'font-semibold text-neon' : ''}>IT</span>
            <span className="-mx-1 opacity-60">/</span>
            <span className={lang === 'en' ? 'font-semibold text-neon' : ''}>EN</span>
          </button>
        </div>
      </div>
      <div className="hidden border-t border-line/60 bg-panel/60 sm:block">
        <p className="mx-auto max-w-7xl truncate px-4 py-1 text-xs text-dim" aria-hidden="true">
          <span className="text-neon">root@flipper-hub</span>:<span className="text-cyan">~</span>${' '}
          <TypingText lines={COMMANDS} />
        </p>
      </div>
    </header>
  );
}
