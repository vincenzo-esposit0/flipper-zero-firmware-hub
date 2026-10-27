import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { beep } from './sound';

interface Settings {
  crt: boolean;
  sound: boolean;
  toggleCrt: () => void;
  toggleSound: () => void;
  /** Feedback sonoro, attivo solo se l'utente ha acceso l'audio */
  click: (freq?: number) => void;
}

const SettingsContext = createContext<Settings | null>(null);

function stored(key: string, fallback: boolean) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === '1';
  } catch {
    return fallback;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [crt, setCrt] = useState(() => stored('fzhub:crt', true));
  const [sound, setSound] = useState(() => stored('fzhub:sound', false));

  useEffect(() => {
    try {
      localStorage.setItem('fzhub:crt', crt ? '1' : '0');
      localStorage.setItem('fzhub:sound', sound ? '1' : '0');
    } catch {
      /* ignora */
    }
  }, [crt, sound]);

  const click = useCallback((freq?: number) => sound && beep(freq), [sound]);

  return (
    <SettingsContext.Provider
      value={{
        crt,
        sound,
        toggleCrt: () => setCrt((v) => !v),
        toggleSound: () => {
          if (!sound) beep(1200);
          setSound((v) => !v);
        },
        click,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings fuori da SettingsProvider');
  return ctx;
}
