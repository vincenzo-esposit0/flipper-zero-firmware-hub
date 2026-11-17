import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useMotion } from '../lib/motion';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();
  const { scrollTo } = useMotion();
  useEffect(() => {
    const on = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => scrollTo(0)}
      className="btn btn-neon fixed bottom-5 right-5 z-40 bg-void/90 shadow-neon"
      aria-label={t.common.backToTop}
    >
      <ArrowUp size={16} />
    </button>
  );
}
