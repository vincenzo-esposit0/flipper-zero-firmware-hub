import { ChevronDown, Clock, Cpu, FilePlus2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { LABS, type Lab } from '../data/labs';
import { useI18n } from '../lib/i18n';
import { SectionTitle } from './ui';

function List({ title, items, mark }: { title: string; items: string[]; mark: string }) {
  if (!items.length) return null;
  return (
    <div>
      <h5 className="mb-1 text-xs uppercase tracking-widest text-cyan">{title}</h5>
      <ul className="space-y-1.5 font-sans text-base text-ink/85">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-neon">{mark === '#' ? `${i + 1}.` : mark}</span> {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LabCard({ lab }: { lab: Lab }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <article className="panel">
      <button className="flex w-full items-start gap-3 p-4 text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="border border-flipper px-1.5 py-0.5 font-display text-xs text-flipper">{lab.code}</span>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-lg text-ink">{lab.title}</h4>
          <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-dim">
            <span className="flex items-center gap-1"><Cpu size={11} /> {lab.module}</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {lab.duration}</span>
            <span>{t.difficulties[lab.difficulty]}</span>
            <span>fw: {lab.firmware}</span>
          </p>
        </div>
        <ChevronDown size={16} className={`mt-1 text-dim transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="grid gap-4 border-t border-line p-4 md:grid-cols-2">
          <List title={t.lab.goals} items={lab.goals} mark=">" />
          <List title={t.lab.materials} items={lab.materials} mark="-" />
          <div className="md:col-span-2">
            <List title={t.lab.steps} items={lab.steps} mark="#" />
          </div>
          <List title={t.lab.discussion} items={lab.discussion} mark="?" />
          <p className="flex gap-2 self-start border border-warn/30 bg-warn/5 p-3 text-xs text-ink/90">
            <ShieldAlert size={16} className="shrink-0 text-warn" /> {lab.safety}
          </p>
        </div>
      )}
    </article>
  );
}

export function LabGuide() {
  const { t } = useI18n();
  return (
    <section>
      <SectionTitle
        prompt="cat /lab/README.md"
        title="Student Lab Guide"
        sub={t.lab.sub}
      />

      <div className="mb-6 grid gap-3 text-xs sm:grid-cols-3">
        {t.lab.rules.map(([rule, d]) => (
          <div key={rule} className="panel border-warn/30 p-3">
            <p className="mb-1 flex items-center gap-1.5 font-display text-base text-warn">
              <ShieldAlert size={13} /> {rule}
            </p>
            <p className="font-sans text-base text-dim">{d}</p>
          </div>
        ))}
      </div>

      {LABS.length ? (
        <div className="space-y-3">
          {LABS.map((l) => (
            <LabCard key={l.id} lab={l} />
          ))}
        </div>
      ) : (
        <div className="panel p-8 text-center">
          <FilePlus2 className="mx-auto mb-3 text-cyan" />
          <p className="font-display text-lg text-ink">{t.lab.emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-lg font-sans text-base text-dim">
            {t.lab.emptyBefore}<code className="text-neon">src/data/labs.ts</code>{t.lab.emptyAfter}
          </p>
        </div>
      )}
    </section>
  );
}
