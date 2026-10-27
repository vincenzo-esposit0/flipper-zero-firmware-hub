export type Category = 'firmware' | 'apps' | 'badusb' | 'subghz' | 'gpio' | 'resources';
export type Difficulty = 'base' | 'intermedio' | 'avanzato';
export type Status = 'attivo' | 'archiviato' | 'sperimentale';
export type Accent = 'neon' | 'flipper' | 'cyan' | 'warn';

export type FeatureKey =
  | 'regionUnlock'
  | 'customThemes'
  | 'subghzExtra'
  | 'nfcExtra'
  | 'bundledApps'
  | 'webInstaller'
  | 'officialApi'
  | 'stability'
  | 'updates';

export type FeatureLevel = 'yes' | 'partial' | 'no' | 'na';

export interface FeatureValue {
  level: FeatureLevel;
  note: string;
}

export interface InstallMethod {
  title: string;
  /** Strumento usato: Web Updater, qFlipper, scheda SD, app mobile... */
  tool: string;
  url?: string;
  steps: string[];
}

export interface Entry {
  id: string;
  name: string;
  /** "owner/repo" su GitHub: usato per arricchire i dati via API */
  repo: string;
  homepage?: string;
  category: Category;
  difficulty: Difficulty;
  /** Stato curato a mano; se GitHub segnala "archived" prevale quello */
  status: Status;
  /** Sigla mostrata quando non c'è un avatar */
  emblem: string;
  accent: Accent;
  tags: string[];
  summary: string;
  overview: string[];
  differences?: string[];
  ethics: string[];
  install: InstallMethod[];
  features?: Record<FeatureKey, FeatureValue>;
}
