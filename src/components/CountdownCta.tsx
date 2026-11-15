import { useEffect, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';

const DURATION_MS = 14 * 60 * 1000 + 59 * 1000;
const STORAGE_KEY = 'um_offer_deadline';

export function useCountdownTimer() {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (typeof window === 'undefined') return Math.floor(DURATION_MS / 1000);
    const saved = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
    const now = Date.now();
    if (saved > now) {
      return Math.max(0, Math.floor((saved - now) / 1000));
    }
    const nextDeadline = now + DURATION_MS;
    sessionStorage.setItem(STORAGE_KEY, String(nextDeadline));
    return Math.floor(DURATION_MS / 1000);
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      const saved = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
      const now = Date.now();
      if (!saved || saved <= now) {
        const nextDeadline = now + DURATION_MS;
        sessionStorage.setItem(STORAGE_KEY, String(nextDeadline));
        setRemainingSeconds(Math.floor(DURATION_MS / 1000));
        return;
      }
      setRemainingSeconds(Math.max(0, Math.floor((saved - now) / 1000)));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');

  return {
    minutes: mins,
    seconds: secs,
    formatted: `${mins}:${secs}`,
  };
}

interface AttentionCtaButtonProps {
  label: string;
  checkoutUrl: string;
  onClick: () => void;
  showCountdown?: boolean;
  fullWidth?: boolean;
  compact?: boolean;
}

export function AttentionCtaButton({
  label,
  checkoutUrl,
  onClick,
  showCountdown = false,
  fullWidth = false,
  compact = false,
}: AttentionCtaButtonProps) {
  const { formatted } = useCountdownTimer();

  const classes = `btn-cta-attention inline-flex items-center justify-center gap-2.5 ${
    compact
      ? 'px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg'
      : 'px-7 sm:px-8 py-4 text-sm sm:text-base rounded-xl'
  } ${
    fullWidth ? 'w-full' : ''
  } bg-gradient-to-r from-[#C21F5E] via-[#D8276B] to-[#A8164E] hover:from-[#AE1A53] hover:to-[#911142] text-white font-bold transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C21F5E]`;

  const inner = (
    <>
      <span>{label}</span>
      {showCountdown && (
        <span className="inline-flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-md text-xs font-bold tabular-nums tracking-wide">
          <Clock className="w-3.5 h-3.5" />
          {formatted}
        </span>
      )}
      <ArrowRight className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} shrink-0`} />
    </>
  );

  if (checkoutUrl) {
    return (
      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <a href="#oferta" onClick={onClick} className={classes}>
      {inner}
    </a>
  );
}
