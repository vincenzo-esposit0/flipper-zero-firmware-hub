import { useMemo, useState } from 'react';
import { CompareTable } from './components/CompareTable';
import { DetailModal } from './components/DetailModal';
import { EMPTY_FILTERS, FilterBar, type Filters } from './components/FilterBar';
import { EmptyState, FirmwareCard, effectiveStatus } from './components/FirmwareCard';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InstallationModal } from './components/InstallationModal';
import { LabGuide } from './components/LabGuide';
import { SectionTitle } from './components/ui';
import { ENTRIES } from './data/firmwares';
import type { Category } from './data/types';
import { go, useHashRoute } from './hooks/useHashRoute';
import { useGithub } from './lib/githubContext';
import { useSettings } from './lib/settings';

export default function App() {
  const route = useHashRoute();
  const { crt } = useSettings();
  const { repos, state: syncState } = useGithub();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [installId, setInstallId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Partial<Record<Category, number>> = {};
    ENTRIES.forEach((e) => (c[e.category] = (c[e.category] ?? 0) + 1));
    return c;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ENTRIES.filter((e) => {
      const status = effectiveStatus(e, repos[e.repo]);
      if (filters.categories.length && !filters.categories.includes(e.category)) return false;
      if (filters.difficulties.length && !filters.difficulties.includes(e.difficulty)) return false;
      if (filters.statuses.length && !filters.statuses.includes(status)) return false;
      if (!q) return true;
      return [e.name, e.repo, e.summary, ...e.tags].join(' ').toLowerCase().includes(q);
    });
    const by = {
      curated: () => 0,
      stars: (a: (typeof list)[0], b: (typeof list)[0]) => (repos[b.repo]?.stars ?? -1) - (repos[a.repo]?.stars ?? -1),
      updated: (a: (typeof list)[0], b: (typeof list)[0]) =>
        (repos[b.repo]?.pushedAt ?? '').localeCompare(repos[a.repo]?.pushedAt ?? ''),
      name: (a: (typeof list)[0], b: (typeof list)[0]) => a.name.localeCompare(b.name),
    }[filters.sort];
    return [...list].sort(by);
  }, [query, filters, repos]);

  const detail = route.view === 'directory' && route.detail ? ENTRIES.find((e) => e.id === route.detail) : undefined;
  const install = installId ? ENTRIES.find((e) => e.id === installId) : undefined;

  return (
    <div className={crt ? 'crt min-h-screen' : 'min-h-screen'}>
      <Header route={route} query={query} onQuery={setQuery} />

      <main id="main" className="mx-auto max-w-7xl px-4 py-8">
        {route.view === 'directory' && <Hero />}
        {route.view === 'directory' && (
          <section id="catalogo" className="scroll-mt-28">
            <SectionTitle
              prompt="ls -la ./firmware ./apps ./scripts"
              title="Catalogo firmware e repository"
              sub="Firmware completi, app native, script e risorse per Flipper Zero, catalogati per uso didattico. Dati live da GitHub con cache locale."
            />
            <FilterBar
              filters={filters}
              onChange={setFilters}
              counts={counts}
              total={ENTRIES.length}
              shown={visible.length}
            />
            {visible.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((e) => (
                  <FirmwareCard
                    key={e.id}
                    entry={e}
                    info={repos[e.repo]}
                    missing={syncState !== 'loading' && syncState !== 'idle' && !repos[e.repo]}
                    onDetail={() => go(`/repo/${e.id}`)}
                    onInstall={() => setInstallId(e.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                onReset={() => {
                  setQuery('');
                  setFilters(EMPTY_FILTERS);
                }}
              />
            )}
          </section>
        )}
        {route.view === 'compare' && <CompareTable />}
        {route.view === 'lab' && <LabGuide />}
      </main>

      <Footer />
      <BackToTop />

      {detail && <DetailModal entry={detail} info={repos[detail.repo]} onClose={() => go('/')} />}
      {install && <InstallationModal entry={install} onClose={() => setInstallId(null)} />}
    </div>
  );
}
