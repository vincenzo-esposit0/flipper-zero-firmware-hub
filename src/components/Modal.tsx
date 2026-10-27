import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
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
          <button className="text-dim hover:text-warn" onClick={onClose} aria-label="Chiudi">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
