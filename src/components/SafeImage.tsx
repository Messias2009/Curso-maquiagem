import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { resolveAssetUrl } from '../lib/assetResolver.ts';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  loading?: 'lazy' | 'eager';
  priority?: 'high' | 'auto' | 'low';
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Universo Maquiagem',
  loading = 'lazy',
  priority = 'auto',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const resolvedSrc = resolveAssetUrl(src);

  if (!resolvedSrc || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FCE8F0] via-[#F7D7E3] to-[#F2C3D4] text-[#5E484F] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-7 h-7 text-[#C21F5E] mb-2" strokeWidth={1.5} />
        <span className="font-display text-lg font-semibold text-[#230F17]">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      decoding={priority === 'high' ? 'sync' : 'async'}
      fetchPriority={priority}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setHasError(true)}
      className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-95'}`}
    />
  );
}
