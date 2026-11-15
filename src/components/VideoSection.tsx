import { useMemo, useState } from 'react';
import { Film, Play, RotateCcw } from 'lucide-react';
import { AttentionCtaButton } from './CountdownCta.tsx';
import { SafeImage } from './SafeImage.tsx';

interface VideoSectionProps {
  videoUrl: string;
  posterUrl: string;
  checkoutUrl: string;
  onVideoPlay?: () => void;
  onCheckoutClick: () => void;
}

function getEmbedUrl(rawUrl: string): { type: 'video' | 'iframe' | 'empty'; src: string } {
  const url = rawUrl.trim();
  if (!url) return { type: 'empty', src: '' };

  if (
    url.startsWith('/uploads/') ||
    url.startsWith('/') ||
    /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
  ) {
    return { type: 'video', src: url };
  }

  const ytMatch =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/) ||
    url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    };
  }

  return { type: 'iframe', src: url };
}

export function VideoSection({
  videoUrl,
  posterUrl,
  checkoutUrl,
  onVideoPlay,
  onCheckoutClick,
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const media = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);

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
            Demonstração Exclusiva
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.1] text-[#230F17] text-balance">
            VEJA O QUE VAIS APRENDER NO UNIVERSO MAQUIAGEM!
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4A2835] leading-relaxed">
            Assista a uma pequena demonstração e descubra na prática a clareza do nosso método de
            ensino.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-[#230F17] border-4 border-white shadow-2xl aspect-video w-full">
          {!isPlaying ? (
            <div className="relative w-full h-full group">
              <SafeImage
                src={posterUrl}
                alt="Capa do vídeo demonstrativo do curso Universo Maquiagem"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#230F17]/80 via-[#230F17]/30 to-[#230F17]/15" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <button
                  type="button"
                  onClick={handleStartPlay}
                  aria-label="Reproduzir vídeo demonstrativo do curso"
                  className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#C21F5E] hover:bg-[#9F164B] text-white shadow-2xl ring-4 ring-white/50 transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
                </button>
                <span className="mt-4 text-sm sm:text-base font-semibold text-white tracking-wide">
                  Toque para assistir à demonstração
                </span>
              </div>
            </div>
          ) : media.type === 'video' ? (
            <video
              src={media.src}
              poster={posterUrl}
              controls
              playsInline
              autoPlay
              className="w-full h-full object-contain bg-black"
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
                O vídeo oficial será reproduzido diretamente aqui assim que for vinculado nas
                configurações.
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

        <div className="mt-8 flex justify-center">
          <AttentionCtaButton
            label="QUERO APRENDER MAQUIAGEM"
            checkoutUrl={checkoutUrl}
            onClick={onCheckoutClick}
            showCountdown
          />
        </div>
      </div>
    </section>
  );
}
