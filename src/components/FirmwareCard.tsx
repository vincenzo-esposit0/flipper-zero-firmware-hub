import { AlertTriangle, ArrowRight, Download, FolderGit2, Star, Terminal, Wrench } from 'lucide-react';
import type { Entry } from '../data/types';
import { formatStars } from '../lib/format';
import type { RepoInfo } from '../lib/github';
import { useI18n } from '../lib/i18n';
import { useSettings } from '../lib/settings';
import { Emblem, StatusBadge, Tag } from './ui';

export function effectiveStatus(entry: Entry, info?: RepoInfo) {
  return info?.archived ? 'archiviato' : entry.status;
}

export function FirmwareCard({
  entry,
  info,
  onDetail,
  onInstall,
  missing = false,
}: {
  entry: Entry;
  info?: RepoInfo;
  onDetail: () => void;
  onInstall: () => void;
  /** true se la sync è finita e GitHub non ha restituito la repo (rimossa, rinominata o privata) */
  missing?: boolean;
}) {
  const { click } = useSettings();
  const { t, ago } = useI18n();
  const download = info?.release?.asset?.url ?? info?.release?.htmlUrl;
  const openDetail = () => {
    click(900);
    onDetail();
  };

  return (
    <article className="panel group flex min-w-0 flex-col p-5 transition hover:border-neon/50 hover:shadow-neon">
      <div className="flex items-start gap-3">
        <Emblem text={entry.emblem} accent={entry.accent} avatar={info?.avatar} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl leading-tight">
              <button onClick={openDetail} className="text-left text-ink hover:text-neon hover:underline">
                {entry.name}
              </button>
            </h3>
            <StatusBadge status={effectiveStatus(entry, info)} />
          </div>
          <p className="truncate text-sm text-dim">{entry.repo}</p>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-cyan">
            {t.categories[entry.category]} · {t.difficulties[entry.difficulty]}
          </p>
        </div>
      </div>

      <p className="mt-4 flex-1 font-sans text-base leading-relaxed text-ink/85">{entry.summary}</p>

      {missing && (
        <p className="mt-3 flex items-center gap-2 border border-warn/40 bg-warn/5 px-2.5 py-1.5 text-sm text-warn">
          <AlertTriangle size={15} className="shrink-0" /> {t.card.missing}
        </p>
      )}

      <dl className="mt-4 grid grid-cols-3 gap-px border border-line bg-line text-center text-sm">
        <div className="bg-void px-1 py-2">
          <dt className="text-xs text-dim">{t.card.stars}</dt>
          <dd className="flex items-center justify-center gap-1 text-flipper">
            <Star size={13} /> {formatStars(info?.stars)}
          </dd>
        </div>
        <div className="bg-void px-1 py-2">
          <dt className="text-xs text-dim">{t.card.lastPush}</dt>
          <dd className="truncate text-ink">{ago(info?.pushedAt)}</dd>
        </div>
        <div className="bg-void px-1 py-2">
          <dt className="text-xs text-dim">{t.card.release}</dt>
          <dd className="truncate text-neon" title={info?.release?.tag}>
            {info || missing ? (info?.release?.tag ?? t.card.na) : '…'}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {entry.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5">
        <a href={`https://github.com/${entry.repo}`} target="_blank" rel="noreferrer" className="btn btn-ghost justify-center" title={t.card.openRepo}>
          <FolderGit2 size={15} /> GitHub
        </a>
        <button
          onClick={() => {
            click(700);
            onInstall();
          }}
          className="btn btn-cyan justify-center"
        >
          <Wrench size={15} /> {t.card.install}
        </button>
        {download ? (
          <a href={download} target="_blank" rel="noreferrer" className="btn btn-flipper justify-center" title={info?.release?.asset?.name ?? t.card.releasePage}>
            <Download size={15} /> {t.card.download}
          </a>
        ) : (
          <span className="btn btn-ghost cursor-not-allowed justify-center opacity-40" title={t.card.noRelease}>
            <Download size={15} /> {t.card.download}
          </span>
        )}
      </div>
      <button onClick={openDetail} className="btn btn-neon mt-1.5 w-full justify-center">
        {t.card.details} <ArrowRight size={15} />
      </button>
    </article>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="panel p-10 text-center text-base text-dim">
      <Terminal className="mx-auto mb-3 text-warn" />
      <p>
        <span className="text-warn">grep:</span> {t.card.emptyPrefix}
      </p>
      <button className="btn btn-neon mt-4" onClick={onReset}>
        {t.card.emptyReset}
      </button>
    </div>
  );
}
