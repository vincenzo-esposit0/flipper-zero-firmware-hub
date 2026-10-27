import { ExternalLink, ShieldAlert } from 'lucide-react';
import type { Entry } from '../data/types';
import { Modal } from './Modal';

export function InstallGuide({ entry }: { entry: Entry }) {
  return (
    <div className="space-y-5">
      <p className="flex gap-2.5 border border-flipper/40 bg-flipper/5 p-3 font-sans text-sm text-flipper">
        <ShieldAlert size={16} className="shrink-0" />
        Prima di ogni installazione esegui un backup con qFlipper. Cambiare firmware non cancella la SD, ma un
        downgrade o un passaggio tra fork può richiedere di reimpostare alcune preferenze.
      </p>
      {entry.install.map((m, i) => (
        <section key={m.title}>
          <header className="mb-2 flex flex-wrap items-baseline gap-x-3">
            <h4 className="font-display text-lg text-neon">
              [{String(i + 1).padStart(2, '0')}] {m.title}
            </h4>
            <span className="text-xs text-dim">tool: {m.tool}</span>
            {m.url && (
              <a href={m.url} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1 text-xs text-cyan hover:underline">
                apri <ExternalLink size={11} />
              </a>
            )}
          </header>
          <ol className="space-y-2 border-l border-line pl-5 font-sans text-base leading-relaxed">
            {m.steps.map((s, j) => (
              <li key={j} className="relative text-ink/85">
                <span className="absolute -left-[1.9rem] font-mono text-sm text-dim">{j + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

export function InstallationModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  return (
    <Modal title={`install ${entry.id}`} onClose={onClose}>
      <h3 className="mb-4 font-display text-2xl">
        Installazione: <span className="text-neon">{entry.name}</span>
      </h3>
      <InstallGuide entry={entry} />
    </Modal>
  );
}
