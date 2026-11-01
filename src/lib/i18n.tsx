import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ENTRIES } from '../data/firmwares';
import { localizeEntry } from '../data/firmwares.en';
import { STRINGS, type Lang, type Strings } from '../data/strings';
import type { Entry } from '../data/types';
import { timeAgo } from './format';

interface I18n {
  lang: Lang;
  toggleLang: () => void;
  t: Strings;
  /** Schede nella lingua attiva */
  entries: Entry[];
  firmwares: Entry[];
  /** timeAgo nella lingua attiva */
  ago: (iso?: string) => string;
}

const I18nContext = createContext<I18n | null>(null);
const STORAGE_KEY = 'fzhub:lang';

/** Preferenza salvata, altrimenti la lingua del browser (inglese se non è italiano) */
function initialLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'it' || v === 'en') return v;
  } catch {
    /* ignora */
  }
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.querySelector('meta[name="description"]')?.setAttribute('content', STRINGS[lang].metaDescription);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignora */
    }
  }, [lang]);

  const value = useMemo<I18n>(() => {
    const t = STRINGS[lang];
    const entries = ENTRIES.map((e) => localizeEntry(e, lang));
    return {
      lang,
      toggleLang: () => setLang((l) => (l === 'it' ? 'en' : 'it')),
      t,
      entries,
      firmwares: entries.filter((e) => e.category === 'firmware'),
      ago: (iso) => timeAgo(iso, t.locale, t.common.justNow),
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n fuori da I18nProvider');
  return ctx;
}
