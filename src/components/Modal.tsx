import { X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, type ReactNode } from 'react';
import { useI18n } from '../lib/i18n';
import { EASE, MOTION_OK, useMotion } from '../lib/motion';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const { t } = useI18n();
  const { lock } = useMotion();
  const backdrop = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    lock(true);
    return () => {
      document.removeEventListener('keydown', onKey);
      lock(false);
    };
  }, [onClose, lock]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(backdrop.current, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' });
        gsap.from('[role=dialog]', { y: 40, autoAlpha: 0, scale: 0.97, duration: 0.6, ease: EASE });
      });
      return () => mm.revert();
    },
    { scope: backdrop },
  );

  return (
    <div ref={backdrop} className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="panel flex max-h-[92vh] w-full max-w-3xl flex-col shadow-neon"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs">
          <span className="flex items-center gap-2 text-dim">
            <span className="h-2 w-2 bg-warn" />
            <span className="h-2 w-2 bg-flipper" />
            <span className="h-2 w-2 bg-neon" />
            <span className="ml-2 truncate">~/{title.toLowerCase().replace(/\s+/g, '-')}</span>
          </span>
          <button className="text-dim hover:text-warn" onClick={onClose} aria-label={t.common.close}>
            <X size={16} />
          </button>
        </div>
        <div data-lenis-prevent className="overflow-y-auto overscroll-contain p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
