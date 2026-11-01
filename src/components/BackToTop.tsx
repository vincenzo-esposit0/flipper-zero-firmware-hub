import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();
  useEffect(() => {
    const on = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="btn btn-neon fixed bottom-5 right-5 z-40 bg-void/90 shadow-neon"
      aria-label={t.common.backToTop}
    >
      <ArrowUp size={16} />
    </button>
  );
}
