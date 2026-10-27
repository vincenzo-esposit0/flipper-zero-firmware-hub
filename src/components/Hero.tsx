import { ArrowDown, BookOpen, Columns3, Info, LayoutGrid, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { ENTRIES, FIRMWARES } from '../data/firmwares';
import { LABS } from '../data/labs';
import { useSettings } from '../lib/settings';

const FLIPPER_IMG = `${import.meta.env.BASE_URL}flipper.webp`;
const STORAGE_KEY = 'fzhub:hero-hidden';

/** Frequenze che "orbitano" attorno al dispositivo */
const SIGNALS = [
  { label: '433.92 MHz', className: 'left-[2%] top-[12%] text-neon border-neon/50', delay: '0s' },
  { label: 'NFC 13.56 MHz', className: 'right-[0%] top-[4%] text-cyan border-cyan/50', delay: '1.2s' },
  { label: 'RFID 125 kHz', className: 'right-[4%] bottom-[10%] text-flipper border-flipper/60', delay: '2.4s' },
  { label: 'IR 38 kHz', className: 'left-[6%] bottom-[4%] text-warn border-warn/50', delay: '3.6s' },
];

function FlipperArt() {
  return (
    <div className="relative mx-auto aspect-[720/520] w-full max-w-md select-none" aria-hidden="true">
      {/* onde radio che partono dal dispositivo */}
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/40 motion-safe:animate-radar"
            style={{ animationDelay: `${i * 1}s` }}
          />
        ))}
      </div>

      {/* dispositivo fluttuante con riflesso "scan" mascherato sulla sagoma */}
      <div className="absolute inset-x-[4%] top-[6%] motion-safe:animate-float">
        <div className="relative">
          <img
            src={FLIPPER_IMG}
            alt=""
            width={720}
            height={458}
            className="w-full drop-shadow-[0_0_24px_rgba(255,102,0,0.35)] [image-rendering:pixelated]"
          />
          <div
            className="pointer-events-none absolute inset-0 motion-safe:animate-sweep"
            style={{
              WebkitMaskImage: `url(${FLIPPER_IMG})`,
              maskImage: `url(${FLIPPER_IMG})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              background: 'linear-gradient(105deg, transparent 40%, rgba(0,255,102,0.35) 50%, transparent 60%)',
              backgroundSize: '250% 100%',
            }}
          />
        </div>
      </div>

      {/* ombra a terra che respira insieme al dispositivo */}
      <div className="absolute bottom-[3%] left-1/2 h-4 w-2/3 -translate-x-1/2 rounded-[50%] bg-neon/20 blur-md motion-safe:animate-shadow" />

      {SIGNALS.map((s) => (
        <span
          key={s.label}
          className={`absolute border bg-void/80 px-2 py-0.5 text-xs backdrop-blur motion-safe:animate-blip ${s.className}`}
          style={{ animationDelay: s.delay }}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  const { click } = useSettings();
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const setHiddenStored = (v: boolean) => {
    click(v ? 440 : 880);
    setHidden(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? '1' : '0');
    } catch {
      /* ignora */
    }
  };

  if (hidden) {
    return (
      <button
        onClick={() => setHiddenStored(false)}
        className="mb-6 flex items-center gap-2 text-sm text-dim hover:text-neon"
      >
        <Info size={15} /> Cos'è Flipper Zero Firmware Hub? Mostra introduzione
      </button>
    );
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="panel relative mb-10 grid items-center gap-6 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr]"
    >
      <button
        onClick={() => setHiddenStored(true)}
        className="absolute right-3 top-3 p-1.5 text-dim hover:text-warn"
        aria-label="Nascondi introduzione"
        title="Nascondi introduzione"
      >
        <X size={18} />
      </button>

      <div className="relative z-10">
        <p className="text-sm text-dim">
          <span className="text-neon">root@fz-hub</span>:<span className="text-cyan">~</span>$ cat MISSION.md
        </p>
        <h1 id="hero-title" className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
          Tutto il software per <span className="text-flipper glow">Flipper Zero</span>, spiegato per chi studia.
        </h1>
        <p className="mt-4 max-w-xl font-sans text-lg leading-relaxed text-ink/85">
          Una piattaforma didattica che raccoglie i firmware e le repository più valide della community, le confronta
          in modo trasparente e spiega come installarle e usarle <strong className="text-neon">in modo legale e responsabile</strong>.
        </p>

        <ul className="mt-5 grid gap-2 font-sans text-base text-ink/85 sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <LayoutGrid size={16} className="shrink-0 text-neon" /> Esplora il catalogo
          </li>
          <li className="flex items-center gap-2">
            <Columns3 size={16} className="shrink-0 text-cyan" /> Confronta i firmware
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0 text-flipper" /> Impara con le regole
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              click(700);
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-neon"
          >
            <ArrowDown size={15} /> Esplora il catalogo
          </button>
          <a href="#/compare" onClick={() => click(700)} className="btn btn-cyan">
            <Columns3 size={15} /> Confronta firmware
          </a>
          <a href="#/lab" onClick={() => click(700)} className="btn btn-flipper">
            <BookOpen size={15} /> Lab Guide
          </a>
        </div>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4">
          {[
            [FIRMWARES.length, 'firmware'],
            [ENTRIES.length - FIRMWARES.length, 'app e risorse'],
            [LABS.length, 'laboratori'],
          ].map(([n, label]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-widest text-dim">{label}</dt>
              <dd className="font-display text-3xl text-neon glow">{String(n).padStart(2, '0')}</dd>
            </div>
          ))}
        </dl>
      </div>

      <FlipperArt />
    </section>
  );
}
