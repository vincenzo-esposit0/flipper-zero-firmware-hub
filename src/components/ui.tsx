import { Archive, CheckCircle2, CircleDashed, FlaskConical, MinusCircle, XCircle } from 'lucide-react';
import type { Accent, FeatureLevel, Status } from '../data/types';
import { STATUSES } from '../data/firmwares';

export const ACCENT_TEXT: Record<Accent, string> = {
  neon: 'text-neon border-neon/50',
  flipper: 'text-flipper border-flipper/60',
  cyan: 'text-cyan border-cyan/50',
  warn: 'text-warn border-warn/50',
};

export function StatusBadge({ status }: { status: Status }) {
  const style = {
    attivo: 'border-neon/50 text-neon',
    archiviato: 'border-warn/60 text-warn',
    sperimentale: 'border-flipper/60 text-flipper',
  }[status];
  const Icon = { attivo: CheckCircle2, archiviato: Archive, sperimentale: FlaskConical }[status];
  return (
    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${style}`}>
      <Icon size={11} /> {STATUSES[status]}
    </span>
  );
}

export function Tag({ children }: { children: string }) {
  return (
    <span className="border border-line bg-void/60 px-2 py-0.5 text-sm text-dim">#{children.replace(/\s+/g, '_')}</span>
  );
}

export function Emblem({ text, accent, avatar, size = 48 }: { text: string; accent: Accent; avatar?: string; size?: number }) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center border bg-void font-display ${ACCENT_TEXT[accent]}`}
      style={{ width: size, height: size }}
    >
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full object-cover opacity-80 grayscale-[40%]" loading="lazy" />
      ) : (
        <span className="glow text-sm">{text}</span>
      )}
      {avatar && (
        <span className="absolute -bottom-1.5 -right-1.5 border border-current bg-void px-1 text-[11px] leading-tight">{text}</span>
      )}
    </div>
  );
}

export function LevelIcon({ level }: { level: FeatureLevel }) {
  switch (level) {
    case 'yes':
      return <CheckCircle2 size={16} className="text-neon" aria-label="Sì" />;
    case 'partial':
      return <CircleDashed size={16} className="text-flipper" aria-label="Parziale" />;
    case 'no':
      return <XCircle size={16} className="text-warn" aria-label="No" />;
    default:
      return <MinusCircle size={16} className="text-dim" aria-label="Non applicabile" />;
  }
}

export function SectionTitle({ prompt, title, sub }: { prompt: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-dim">        <span className="text-neon">root@fz-hub</span>:<span className="text-cyan">~</span>$ {prompt}
      </p>
      <h2 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      {sub && <p className="mt-2 max-w-3xl font-sans text-lg text-dim">{sub}</p>}
    </div>
  );
}
