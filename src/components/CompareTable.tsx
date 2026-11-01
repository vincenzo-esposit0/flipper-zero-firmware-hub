import type { FeatureKey } from '../data/types';
import { formatStars } from '../lib/format';
import { useGithub } from '../lib/githubContext';
import { useI18n } from '../lib/i18n';
import { useSettings } from '../lib/settings';
import { useState } from 'react';
import { effectiveStatus } from './FirmwareCard';
import { Emblem, LevelIcon, SectionTitle, StatusBadge } from './ui';

const MAX = 3;

export function CompareTable() {
  const { repos } = useGithub();
  const { click } = useSettings();
  const { t, firmwares, ago } = useI18n();
  const [selected, setSelected] = useState<string[]>(['official', 'unleashed', 'momentum']);
  const cols = firmwares.filter((f) => selected.includes(f.id));

  const toggle = (id: string) => {
    click(560);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < MAX ? [...s, id] : s));
  };

  return (
    <section>
      <SectionTitle
        prompt="diff --side-by-side --max=3"
        title="Compare Matrix"
        sub={t.compare.sub}
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {firmwares.map((f) => {
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
        <p className="panel p-8 text-center text-sm text-dim">{t.compare.selectOne}</p>
      ) : (
        <>
        <p className="mb-2 text-sm text-dim md:hidden">{t.compare.scroll}</p>
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="sticky left-0 z-10 w-56 bg-panel p-3 text-left text-xs font-normal uppercase tracking-widest text-dim">{t.compare.feature}</th>
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
              {(Object.keys(t.features) as FeatureKey[]).map((k) => (
                <tr key={k} className="border-b border-line/60 hover:bg-neon/[0.03]">
                  <th className="sticky left-0 z-10 bg-panel p-3 text-left text-sm font-normal text-cyan">{t.features[k]}</th>
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
              <LiveRow label={t.compare.stars} cols={cols.map((f) => formatStars(repos[f.repo]?.stars))} />
              <LiveRow label={t.compare.lastPush} cols={cols.map((f) => ago(repos[f.repo]?.pushedAt))} />
              <LiveRow label={t.compare.lastRelease} cols={cols.map((f) => repos[f.repo]?.release?.tag ?? '—')} />
              <LiveRow label={t.compare.openIssues} cols={cols.map((f) => String(repos[f.repo]?.openIssues ?? '—'))} />
            </tbody>
          </table>
        </div>
        </>
      )}

      <p className="mt-3 flex flex-wrap gap-4 text-xs text-dim">
        <span className="flex items-center gap-1"><LevelIcon level="yes" /> {t.compare.supported}</span>
        <span className="flex items-center gap-1"><LevelIcon level="partial" /> {t.compare.partial}</span>
        <span className="flex items-center gap-1"><LevelIcon level="no" /> {t.compare.absent}</span>
        <span className="flex items-center gap-1"><LevelIcon level="na" /> {t.compare.na}</span>
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
