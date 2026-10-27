import { useEffect, useState } from 'react';

/** Cicla una lista di comandi scrivendoli carattere per carattere. */
export function TypingText({ lines, speed = 45, pause = 1800 }: { lines: string[]; speed?: number; pause?: number }) {
  const [i, setI] = useState(0);
  const [len, setLen] = useState(0);

  useEffect(() => {
    const line = lines[i % lines.length];
    const done = len >= line.length;
    const t = setTimeout(
      () => {
        if (done) {
          setLen(0);
          setI((n) => n + 1);
        } else setLen((n) => n + 1);
      },
      done ? pause : speed,
    );
    return () => clearTimeout(t);
  }, [i, len, lines, speed, pause]);

  return (
    <span>
      {lines[i % lines.length].slice(0, len)}
      <span className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[2px] animate-blink bg-neon" />
    </span>
  );
}
