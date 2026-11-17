import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin);

/** Le animazioni partono solo se l'utente non ha chiesto di ridurre il movimento */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Easing comune a tutto il sito: parte deciso e si posa piano */
export const EASE = 'expo.out';

export function prefersReducedMotion() {
  return typeof matchMedia === 'function' && !matchMedia(MOTION_OK).matches;
}

interface Motion {
  /** Scroll morbido verso un elemento o una posizione; senza Lenis usa lo scroll del browser */
  scrollTo: (target: HTMLElement | number, opts?: { immediate?: boolean; offset?: number }) => void;
  /** Blocca lo scroll della pagina, per le finestre modali */
  lock: (locked: boolean) => void;
}

const MotionContext = createContext<Motion | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    // Lenis gira sul ticker di GSAP, così ScrollTrigger legge sempre la stessa posizione
    l.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(raf);
      l.destroy();
      setLenis(null);
    };
  }, []);

  const value = useMemo<Motion>(
    () => ({
      scrollTo: (target, opts = {}) => {
        // Lo header è sticky: si lascia un margine perché non copra il titolo
        const offset = opts.offset ?? -96;
        if (lenis) {
          lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : offset, immediate: opts.immediate });
          return;
        }
        const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY + offset;
        scrollTo({ top, behavior: opts.immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
      },
      lock: (locked) => {
        if (lenis) (locked ? lenis.stop() : lenis.start());
        document.body.style.overflow = locked ? 'hidden' : '';
      },
    }),
    [lenis],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotion fuori da MotionProvider');
  return ctx;
}

/**
 * Fa comparire i figli di `scope` che hanno `data-reveal` quando entrano nello schermo.
 * Gli elementi già mostrati sono marcati, quindi filtri e ordinamenti non li fanno ripartire.
 * Lo stato nascosto viene impostato solo da JavaScript: senza animazioni il contenuto è subito visibile.
 */
export function useReveal(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils
          .toArray<HTMLElement>('[data-reveal]', scope.current)
          .filter((el) => !el.dataset.revealed);
        // Chi è già sopra lo schermo (filtri cambiati più in basso) resta visibile senza animazione
        const pending = items.filter((el) => {
          if (el.getBoundingClientRect().bottom > 0) return true;
          el.dataset.revealed = '1';
          return false;
        });
        if (!pending.length) return;
        gsap.set(pending, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(pending, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => {
            batch.forEach((el) => ((el as HTMLElement).dataset.revealed = '1'));
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.07, overwrite: true });
          },
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: deps },
  );
}

/** Scrive il testo come un terminale che decodifica i caratteri, una volta sola, quando entra nello schermo */
export function useScramble(ref: RefObject<HTMLElement>) {
  const done = useRef(false);
  useGSAP(() => {
    const el = ref.current;
    if (!el || done.current) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.to(el, {
        duration: 1.1,
        ease: 'none',
        scrambleText: { text: el.textContent ?? '', chars: '01<>/\\|_-=+*#', speed: 0.6, revealDelay: 0.15 },
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
        onComplete: () => {
          done.current = true;
        },
      });
    });
    return () => mm.revert();
  });
}
