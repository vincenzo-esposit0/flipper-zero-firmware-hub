import { ArrowDown, BookOpen, Columns3, Cpu, Info, LayoutGrid, ShieldCheck, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { ENTRIES, FIRMWARES } from '../data/firmwares';
import { LABS } from '../data/labs';
import { EMULATOR_URL } from '../data/strings';
import { useI18n } from '../lib/i18n';
import { EASE, MOTION_OK, useMotion } from '../lib/motion';
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

/** Parole del titolo, ognuna dentro una maschera per l'entrata dal basso */
function Words({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((w, i) =>
        /^\s+$/.test(w) || !w ? (
          w
        ) : (
          <span key={i} data-mask className="-mb-[0.12em] inline-block pb-[0.12em] align-bottom">
            <span data-word className={`inline-block ${className}`}>
              {w}
            </span>
          </span>
        ),
      )}
    </>
  );
}

function FlipperArt() {
  return (
    <div data-art className="relative mx-auto aspect-[720/520] w-full max-w-md select-none" aria-hidden="true">
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
          data-signal
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
  const { t } = useI18n();
  const { scrollTo } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);
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

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const art = section.querySelector<HTMLElement>('[data-art]');

        // Entrata: prompt, titolo parola per parola, poi il resto e il dispositivo
        const tl = gsap.timeline({ defaults: { ease: EASE } });
        tl.set('[data-mask]', { overflow: 'hidden' })
          .from('[data-hero="prompt"]', { autoAlpha: 0, x: -12, duration: 0.6 })
          .from('[data-word]', { yPercent: 110, duration: 1.1, stagger: 0.05 }, '<0.1')
          .set('[data-mask]', { clearProps: 'overflow' })
          .from('[data-hero="fade"]', { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.08 }, '-=0.8')
          .from(art, { autoAlpha: 0, scale: 0.9, duration: 1.4 }, 0.2)
          .from('[data-signal]', { autoAlpha: 0, scale: 0.6, duration: 0.6, stagger: 0.1, ease: 'back.out(2)' }, 0.9);

        // I contatori salgono fino al valore reale
        section.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
          const n = Number(el.dataset.count);
          const v = { n: 0 };
          tl.to(v, {
            n,
            duration: 1.4,
            ease: 'power3.out',
            onUpdate: () => (el.textContent = String(Math.round(v.n)).padStart(2, '0')),
          }, 0.6);
        });

        // Parallasse: uscendo dallo schermo il dispositivo resta un po' indietro
        gsap.to(art, {
          y: 90,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        });

        // Inclinazione 3D che segue il mouse, solo con un puntatore preciso
        if (art && matchMedia('(pointer: fine)').matches) {
          gsap.set(art, { transformPerspective: 900 });
          const rx = gsap.quickTo(art, 'rotationX', { duration: 0.8, ease: 'power3' });
          const ry = gsap.quickTo(art, 'rotationY', { duration: 0.8, ease: 'power3' });
          const move = (e: PointerEvent) => {
            const r = section.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 14);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          section.addEventListener('pointermove', move);
          section.addEventListener('pointerleave', leave);
          return () => {
            section.removeEventListener('pointermove', move);
            section.removeEventListener('pointerleave', leave);
          };
        }
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [hidden], revertOnUpdate: true },
  );

  if (hidden) {
    return (
      <button
        onClick={() => setHiddenStored(false)}
        className="mb-6 flex items-center gap-2 text-sm text-dim hover:text-neon"
      >
        <Info size={15} /> {t.hero.show}
      </button>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="panel relative mb-10 grid items-center gap-6 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr]"
    >
      <button
        onClick={() => setHiddenStored(true)}
        className="absolute right-3 top-3 p-1.5 text-dim hover:text-warn"
        aria-label={t.hero.hide}
        title={t.hero.hide}
      >
        <X size={18} />
      </button>

      <div className="relative z-10">
        <p data-hero="prompt" className="text-sm text-dim">
          <span className="text-neon">root@fz-hub</span>:<span className="text-cyan">~</span>$ cat MISSION.md
        </p>
        <h1 id="hero-title" className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
          <Words text={t.hero.titleBefore} />
          <Words text="Flipper Zero" className="text-flipper glow" />
          <Words text={t.hero.titleAfter} />
        </h1>
        <p data-hero="fade" className="mt-4 max-w-xl font-sans text-lg leading-relaxed text-ink/85">
          {t.hero.introBefore}<strong className="text-neon">{t.hero.introStrong}</strong>{t.hero.introAfter}
        </p>

        <ul data-hero="fade" className="mt-5 grid gap-2 font-sans text-base text-ink/85 sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <LayoutGrid size={16} className="shrink-0 text-neon" /> {t.hero.pointCatalog}
          </li>
          <li className="flex items-center gap-2">
            <Columns3 size={16} className="shrink-0 text-cyan" /> {t.hero.pointCompare}
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0 text-flipper" /> {t.hero.pointRules}
          </li>
        </ul>

        <div data-hero="fade" className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              click(700);
              const el = document.getElementById('catalogo');
              if (el) scrollTo(el);
            }}
            className="btn btn-neon"
          >
            <ArrowDown size={15} /> {t.hero.ctaCatalog}
          </button>
          <a href="#/compare" onClick={() => click(700)} className="btn btn-cyan">
            <Columns3 size={15} /> {t.hero.ctaCompare}
          </a>
          <a href="#/lab" onClick={() => click(700)} className="btn btn-flipper">
            <BookOpen size={15} /> {t.hero.ctaLab}
          </a>
          <a href={EMULATOR_URL} target="_blank" rel="noreferrer" onClick={() => click(700)} className="btn btn-ghost">
            <Cpu size={15} /> {t.hero.ctaEmulator}
            <span className="sr-only">{t.common.newTab}</span>
          </a>
        </div>
        <p data-hero="fade" className="mt-3 max-w-xl font-sans text-sm text-dim">{t.hero.emulatorNote}</p>

        <dl data-hero="fade" className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4">
          {[
            [FIRMWARES.length, t.hero.statFirmware],
            [ENTRIES.length - FIRMWARES.length, t.hero.statApps],
            [LABS.length, t.hero.statLabs],
          ].map(([n, label]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-widest text-dim">{label}</dt>
              <dd data-count={n} className="font-display text-3xl tabular-nums text-neon glow">
                {String(n).padStart(2, '0')}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <FlipperArt />
    </section>
  );
}
