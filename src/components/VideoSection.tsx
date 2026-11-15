import { useMemo, useState } from 'react';
import { Film, Play, RotateCcw } from 'lucide-react';
import { resolveAssetUrl } from '../lib/assetResolver.ts';
import { SafeImage } from './SafeImage.tsx';

interface VideoSectionProps {
  videoUrl: string;
  posterUrl: string;
  onVideoPlay?: () => void;
}

function getEmbedUrl(rawUrl: string): {
  type: 'video' | 'iframe' | 'empty';
  src: string;
  isVertical: boolean;
} {
  const url = rawUrl.trim();
  if (!url) return { type: 'empty', src: '', isVertical: false };

  if (
    url.startsWith('/uploads/') ||
    url.startsWith('/assets/') ||
    url.startsWith('/') ||
    /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
  ) {
    return { type: 'video', src: url, isVertical: true };
  }

  const ytShorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (ytShorts && ytShorts[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${ytShorts[1]}?autoplay=1&rel=0`,
      isVertical: true,
    };
  }

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/,
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      isVertical: false,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      isVertical: false,
    };
  }

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      isVertical: false,
    };
  }

  return { type: 'iframe', src: url, isVertical: false };
}

export function VideoSection({ videoUrl, posterUrl, onVideoPlay }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [detectedVertical, setDetectedVertical] = useState<boolean | null>(null);
  const media = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);

  const useVerticalFrame = detectedVertical ?? media.isVertical;

  const handleStartPlay = () => {
    setIsPlaying(true);
    onVideoPlay?.();
  };

  return (
    <section
      id="demonstracao"
      className="py-16 sm:py-24 bg-[#FADCE8] border-y border-[#EAB7CA]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-9 sm:mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#A3154B] mb-3">
            Demonstração na Prática
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.1] text-[#230F17] text-balance">
            VEJA O QUE VAIS APRENDER NO UNIVERSO MAQUIAGEM!
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4A2835] leading-relaxed">
            Assista a esta demonstração real e veja como cada passo é fácil de acompanhar.
          </p>
        </div>

        <div
          className={`relative rounded-3xl overflow-hidden bg-[#230F17] border-4 border-white shadow-2xl mx-auto ${
            useVerticalFrame ? 'max-w-[360px] aspect-[9/16]' : 'w-full aspect-video'
          }`}
        >
          {!isPlaying ? (
            <div className="relative w-full h-full group">
              <SafeImage
                src={posterUrl}
                alt="Capa do vídeo demonstrativo do curso Universo Maquiagem"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#230F17]/80 via-[#230F17]/25 to-[#230F17]/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <button
                  type="button"
                  onClick={handleStartPlay}
                  aria-label="Reproduzir vídeo demonstrativo do curso"
                  className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#C21F5E] hover:bg-[#9F164B] text-white shadow-2xl ring-4 ring-white/60 transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
                </button>
                <span className="mt-4 text-sm sm:text-base font-semibold text-white tracking-wide">
                  Toque para assistir à aula demonstrativa
                </span>
              </div>
            </div>
          ) : media.type === 'video' ? (
            <video
              src={media.src}
              poster={resolveAssetUrl(posterUrl)}
              controls
              playsInline
              autoPlay
              preload="metadata"
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                if (v.videoWidth && v.videoHeight) {
                  setDetectedVertical(v.videoHeight > v.videoWidth);
                }
              }}
              className="w-full h-full object-cover bg-black"
            />
          ) : media.type === 'iframe' ? (
            <iframe
              src={media.src}
              title="Demonstração Universo Maquiagem"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-[#230F17] text-white">
              <Film className="w-12 h-12 text-[#F59AB9] mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2">
                Vídeo Demonstrativo (VSL)
              </h3>
              <p className="text-sm sm:text-base text-[#F5D8E2] max-w-md leading-relaxed mb-6">
                O vídeo oficial será reproduzido diretamente aqui assim que for vinculado.
              </p>
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Voltar à capa
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
