import { useEffect, useState } from 'react';

const DURATION_MS = 14 * 60 * 1000 + 59 * 1000;
const STORAGE_KEY = 'um_offer_deadline';

export function useOfferCountdown() {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (typeof window === 'undefined') return Math.floor(DURATION_MS / 1000);
    try {
      const saved = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
      const now = Date.now();
      if (saved > now) {
        return Math.max(0, Math.floor((saved - now) / 1000));
      }
      const nextDeadline = now + DURATION_MS;
      sessionStorage.setItem(STORAGE_KEY, String(nextDeadline));
      return Math.floor(DURATION_MS / 1000);
    } catch {
      return Math.floor(DURATION_MS / 1000);
    }
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      try {
        const saved = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
        const now = Date.now();
        if (!saved || saved <= now) {
          const nextDeadline = now + DURATION_MS;
          sessionStorage.setItem(STORAGE_KEY, String(nextDeadline));
          setRemainingSeconds(Math.floor(DURATION_MS / 1000));
          return;
        }
        setRemainingSeconds(Math.max(0, Math.floor((saved - now) / 1000)));
      } catch {
        setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : Math.floor(DURATION_MS / 1000)));
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');

  return `${mins}:${secs}`;
}
