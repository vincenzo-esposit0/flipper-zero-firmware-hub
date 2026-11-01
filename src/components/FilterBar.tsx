import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { Category, Difficulty, Status } from '../data/types';
import { useI18n } from '../lib/i18n';
import { useSettings } from '../lib/settings';

export type SortKey = 'curated' | 'stars' | 'updated' | 'name';

export interface Filters {
  categories: Category[];
  difficulties: Difficulty[];
  statuses: Status[];
  sort: SortKey;
}

export const EMPTY_FILTERS: Filters = { categories: [], difficulties: [], statuses: [], sort: 'curated' };

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function Group<T extends string>({
  label,
  options,
  active,
  counts,
  onToggle,
}: {
  label: string;
  options: Record<T, string>;
  active: T[];
  counts?: Partial<Record<T, number>>;
  onToggle: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mb-1.5 w-full text-xs uppercase tracking-widest text-dim sm:float-left sm:mb-0 sm:w-28">{label}</legend>
      {(Object.keys(options) as T[]).map((k) => (
        <button
          key={k}
          onClick={() => onToggle(k)}
          aria-pressed={active.includes(k)}
          className={`chip ${active.includes(k) ? 'chip-on' : 'chip-off'}`}
        >
          {options[k]}
          {counts?.[k] !== undefined && <span className="ml-1.5 opacity-60">{counts[k]}</span>}
        </button>
      ))}
    </fieldset>
  );
}

export function FilterBar({
  filters,
  onChange,
  counts,
  total,
  shown,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  counts: Partial<Record<Category, number>>;
  total: number;
  shown: number;
}) {
  const { click } = useSettings();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const set = (f: Filters) => {
    click(520);
    onChange(f);
  };
  const active = filters.categories.length + filters.difficulties.length + filters.statuses.length;

  return (
    <div className="panel mb-6">
      {/* Su mobile i filtri sono comprimibili per non occupare tutto lo schermo */}
      <button
        className="flex w-full items-center gap-2 p-4 text-base sm:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <SlidersHorizontal size={18} className="text-neon" /> {t.filters.toggle}
        {active > 0 && <span className="bg-neon px-1.5 text-sm font-semibold text-void">{active}</span>}
        <ChevronDown size={18} className={`ml-auto text-dim transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`${open ? 'block' : 'hidden'} space-y-4 border-t border-line p-4 sm:block sm:border-0`}>
        <Group
          label={t.filters.category}
          options={t.categories}
          active={filters.categories}
          counts={counts}
          onToggle={(v) => set({ ...filters, categories: toggle(filters.categories, v) })}
        />
        <Group
          label={t.filters.level}
          options={t.difficulties}
          active={filters.difficulties}
          onToggle={(v) => set({ ...filters, difficulties: toggle(filters.difficulties, v) })}
        />
        <Group
          label={t.filters.status}
          options={t.statuses}
          active={filters.statuses}
          onToggle={(v) => set({ ...filters, statuses: toggle(filters.statuses, v) })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3 text-sm text-dim">
        <span aria-live="polite">
          <span className="font-semibold text-neon">{shown}</span>{t.filters.results(total)}
        </span>
        <label className="ml-auto flex items-center gap-2">
          {t.filters.sortBy}
          <select
            value={filters.sort}
            onChange={(e) => set({ ...filters, sort: e.target.value as SortKey })}
            className="h-10 border border-line bg-void px-2 text-base text-ink focus:border-neon focus:outline-none"
          >
            <option value="curated">{t.filters.sortCurated}</option>
            <option value="stars">{t.filters.sortStars}</option>
            <option value="updated">{t.filters.sortUpdated}</option>
            <option value="name">{t.filters.sortName}</option>
          </select>
        </label>
        {active > 0 && (
          <button className="btn btn-ghost" onClick={() => set({ ...EMPTY_FILTERS, sort: filters.sort })}>
            <RotateCcw size={15} /> {t.filters.reset}
          </button>
        )}
      </div>
    </div>
  );
}
