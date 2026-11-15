import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface PurchaseNotificationsProps {
  courseName: string;
  priceText: string;
}

const RECENT_PURCHASES = [
  { name: 'Ana M.', timeText: 'comprou agora' },
  { name: 'João P.', timeText: 'acabou de comprar há 5 minutos' },
  { name: 'Carla S.', timeText: 'garantiu o acesso há 2 minutos' },
  { name: 'Beatriz L.', timeText: 'comprou agora' },
  { name: 'Maria H.', timeText: 'acabou de comprar há 3 minutos' },
  { name: 'Sofia R.', timeText: 'garantiu o acesso há 4 minutos' },
  { name: 'Helena C.', timeText: 'comprou agora' },
];

export function PurchaseNotifications({ courseName, priceText }: PurchaseNotificationsProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dismissed) return;

    const initialTimer = window.setTimeout(() => {
      setVisible(true);
    }, 2500);

    return () => window.clearTimeout(initialTimer);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;

    const cycleInterval = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
        setVisible(true);
      }, 650);
    }, 6000);

    return () => window.clearInterval(cycleInterval);
  }, [dismissed]);

  if (dismissed) return null;

  const current = RECENT_PURCHASES[index];

  return (
    <div
      className="fixed bottom-4 left-4 right-22 sm:right-auto sm:max-w-xs z-30 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#EBB9CB] rounded-2xl shadow-xl px-3.5 py-3 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-[#FCE8F0] text-[#C21F5E] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-[#230F17] leading-snug truncate">
                {current.name} {current.timeText}
              </p>
              <p className="text-[11px] text-[#5E484F] truncate">
                {courseName} · {priceText}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Fechar notificação"
              className="p-1 rounded-md text-[#8A6D77] hover:text-[#230F17] hover:bg-[#FCE8F0] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
