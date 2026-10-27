import type { Difficulty } from './types';

export interface Lab {
  id: string;
  /** Codice breve mostrato nella scheda, es. "LAB-01" */
  code: string;
  title: string;
  /** Modulo del Flipper coinvolto: Sub-GHz, NFC, RFID, Infrarossi, GPIO, BadUSB... */
  module: string;
  difficulty: Difficulty;
  duration: string;
  firmware: string;
  goals: string[];
  materials: string[];
  steps: string[];
  discussion: string[];
  safety: string;
}

/*
 * Esercitazioni da compilare a cura del docente.
 * Aggiungi un oggetto per ogni laboratorio seguendo lo schema qui sotto:
 *
 * {
 *   id: 'slug-univoco',
 *   code: 'LAB-01',
 *   title: 'Titolo dell\'esercitazione',
 *   module: 'Modulo',
 *   difficulty: 'base',            // 'base' | 'intermedio' | 'avanzato'
 *   duration: '60 min',
 *   firmware: 'Official Firmware',
 *   goals: ['Obiettivo 1'],
 *   materials: ['Materiale 1'],
 *   steps: ['Passo 1'],
 *   discussion: ['Domanda di verifica 1'],
 *   safety: 'Regole di sicurezza e autorizzazioni richieste.',
 * }
 */
export const LABS: Lab[] = [];
