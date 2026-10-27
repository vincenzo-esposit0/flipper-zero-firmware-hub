import { FEATURES, FIRMWARES } from '../data/firmwares';
import type { FeatureKey } from '../data/types';
import { formatStars, timeAgo } from '../lib/format';
import { useGithub } from '../lib/githubContext';
import { useSettings } from '../lib/settings';
import { useState } from 'react';
import { effectiveStatus } from './FirmwareCard';
import { Emblem, LevelIcon, SectionTitle, StatusBadge } from './ui';

const MAX = 3;

export function CompareTable() {
  const { repos } = useGithub();
  const { click } = useSettings();
  const [selected, setSelected] = useState<string[]>(['official', 'unleashed', 'momentum']);
  const cols = FIRMWARES.filter((f) => selected.includes(f.id));

  const toggle = (id: string) => {
    click(560);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < MAX ? [...s, id] : s));
  };

  return (
    <section>
      <SectionTitle
        prompt="diff --side-by-side --max=3"
        title="Compare Matrix"
        sub="Seleziona fino a tre firmware da confrontare. Le righe live (stelle, ultimo push, release) arrivano dall'API di GitHub."
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {FIRMWARES.map((f) => {
          const on = selected.includes(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              disabled={!on && selected.length >= MAX}
              className={`chip ${on ? 'chip-on' : 'chip-off'} disabled:opacity-30`}
            >
              {on ? '[x]' : '[ ]'} {f.name}
            </button>
          );
        })}
      </div>

      {cols.length === 0 ? (
        <p className="panel p-8 text-center text-sm text-dim">Seleziona almeno un firmware.</p>
      ) : (
        <>
        <p className="mb-2 text-sm text-dim md:hidden">Scorri la tabella in orizzontale →</p>
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="sticky left-0 z-10 w-56 bg-panel p-3 text-left text-xs font-normal uppercase tracking-widest text-dim">Caratteristica</th>
                {cols.map((f) => (
                  <th key={f.id} className="p-3 text-left font-normal">
                    <div className="flex items-center gap-2">
                      <Emblem text={f.emblem} accent={f.accent} avatar={repos[f.repo]?.avatar} size={32} />
                      <div>
                        <a href={`#/repo/${f.id}`} className="font-display text-base text-ink hover:text-neon">
                          {f.name}
                        </a>
                        <div>
                          <StatusBadge status={effectiveStatus(f, repos[f.repo])} />
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(FEATURES) as FeatureKey[]).map((k) => (
                <tr key={k} className="border-b border-line/60 hover:bg-neon/[0.03]">
                  <th className="sticky left-0 z-10 bg-panel p-3 text-left text-sm font-normal text-cyan">{FEATURES[k]}</th>
                  {cols.map((f) => {
                    const v = f.features?.[k];
                    return (
                      <td key={f.id} className="p-3 align-top">
                        {v ? (
                          <div className="flex gap-2">
                            <LevelIcon level={v.level} />
                            <span className="font-sans text-sm text-ink/85">{v.note}</span>
                          </div>
                        ) : (
                          <span className="text-dim">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <LiveRow label="★ Stelle GitHub" cols={cols.map((f) => formatStars(repos[f.repo]?.stars))} />
              <LiveRow label="Ultimo push" cols={cols.map((f) => timeAgo(repos[f.repo]?.pushedAt))} />
              <LiveRow label="Ultima release" cols={cols.map((f) => repos[f.repo]?.release?.tag ?? '—')} />
              <LiveRow label="Issue aperte" cols={cols.map((f) => String(repos[f.repo]?.openIssues ?? '—'))} />
            </tbody>
          </table>
        </div>
        </>
      )}

      <p className="mt-3 flex flex-wrap gap-4 text-xs text-dim">
        <span className="flex items-center gap-1"><LevelIcon level="yes" /> supportato</span>
        <span className="flex items-center gap-1"><LevelIcon level="partial" /> parziale</span>
        <span className="flex items-center gap-1"><LevelIcon level="no" /> assente</span>
        <span className="flex items-center gap-1"><LevelIcon level="na" /> n/d</span>
      </p>
    </section>
  );
}

function LiveRow({ label, cols }: { label: string; cols: string[] }) {
  return (
    <tr className="border-b border-line/60 bg-flipper/[0.03]">
      <th className="sticky left-0 z-10 bg-panel p-3 text-left text-sm font-normal text-flipper">{label}</th>
      {cols.map((c, i) => (
        <td key={i} className="p-3 text-sm text-ink">
          {c}
        </td>
      ))}
    </tr>
  );
}
