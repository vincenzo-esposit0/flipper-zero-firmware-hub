import { Download, ExternalLink, FolderGit2, Scale, ShieldAlert, Star } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES, DIFFICULTIES } from '../data/firmwares';
import type { Entry } from '../data/types';
import { formatStars, timeAgo } from '../lib/format';
import type { RepoInfo } from '../lib/github';
import { useSettings } from '../lib/settings';
import { effectiveStatus } from './FirmwareCard';
import { InstallGuide } from './InstallationModal';
import { Modal } from './Modal';
import { Emblem, StatusBadge, Tag } from './ui';

type Tab = 'overview' | 'diff' | 'ethics' | 'install';

export function DetailModal({ entry, info, onClose }: { entry: Entry; info?: RepoInfo; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const { click } = useSettings();
  const tabs: [Tab, string][] = [
    ['overview', 'Panoramica'],
    ...(entry.differences ? ([['diff', 'Differenze']] as [Tab, string][]) : []),
    ['ethics', 'Sicurezza & Etica'],
    ['install', 'Installazione'],
  ];

  return (
    <Modal title={entry.id} onClose={onClose}>
      <div className="flex items-start gap-4">
        <Emblem text={entry.emblem} accent={entry.accent} avatar={info?.avatar} size={64} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-2xl text-ink">{entry.name}</h3>
            <StatusBadge status={effectiveStatus(entry, info)} />
          </div>
          <p className="text-xs text-cyan">
            {CATEGORIES[entry.category]} · {DIFFICULTIES[entry.difficulty]}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dim">
            <span className="flex items-center gap-1 text-flipper">
              <Star size={12} /> {formatStars(info?.stars)}
            </span>
            <span>push {timeAgo(info?.pushedAt)}</span>
            {info?.release && (
              <span>
                release <span className="text-neon">{info.release.tag}</span> ({timeAgo(info.release.publishedAt)})
              </span>
            )}
            {info?.license && (
              <span className="flex items-center gap-1">
                <Scale size={12} /> {info.license}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <a className="btn btn-ghost" href={`https://github.com/${entry.repo}`} target="_blank" rel="noreferrer">
          <FolderGit2 size={12} /> GitHub
        </a>
        {entry.homepage && (
          <a className="btn btn-cyan" href={entry.homepage} target="_blank" rel="noreferrer">
            <ExternalLink size={12} /> sito
          </a>
        )}
        {info?.release && (
          <a className="btn btn-flipper" href={info.release.asset?.url ?? info.release.htmlUrl} target="_blank" rel="noreferrer">
            <Download size={12} /> {info.release.asset ? info.release.asset.name : 'release'}
          </a>
        )}
      </div>

      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => {
              click(600);
              setTab(k);
            }}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-xs uppercase tracking-wider ${
              tab === k ? 'border-neon text-neon' : 'border-transparent text-dim hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pt-5 font-sans text-base leading-relaxed">
        {tab === 'overview' && (
          <div className="space-y-3 text-ink/85">
            {entry.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {info?.description && <p className="border-l-2 border-cyan/50 pl-3 text-xs text-dim">GitHub: {info.description}</p>}
            <div className="flex flex-wrap gap-1 pt-2">
              {entry.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        )}
        {tab === 'diff' && (
          <ul className="space-y-2">
            {entry.differences?.map((d) => (
              <li key={d} className="flex gap-2 text-ink/85">
                <span className="text-neon">+</span> {d}
              </li>
            ))}
          </ul>
        )}
        {tab === 'ethics' && (
          <ul className="space-y-2">
            {entry.ethics.map((d) => (
              <li key={d} className="flex gap-2.5 border border-warn/30 bg-warn/5 p-3 text-ink/90">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-warn" /> {d}
              </li>
            ))}
          </ul>
        )}
        {tab === 'install' && <InstallGuide entry={entry} />}
      </div>
    </Modal>
  );
}
