import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { GalleryImage, TestimonialImage } from '../types/config.ts';
import { resolveAssetUrl } from '../lib/assetResolver.ts';
import { SafeImage } from './SafeImage.tsx';

interface GalleryAndTestimonialsProps {
  beforeAfterImages: GalleryImage[];
  galleryImages: GalleryImage[];
  testimonials: TestimonialImage[];
}

interface LightboxState {
  items: { src: string; alt: string; caption?: string }[];
  index: number;
}

export function GalleryAndTestimonials({
  beforeAfterImages,
  galleryImages,
  testimonials,
}: GalleryAndTestimonialsProps) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const pointerStartX = useRef<number | null>(null);

  const sortedTestimonials = [...testimonials].sort((a, b) => a.order - b.order);
  const totalTestimonials = sortedTestimonials.length;

  const goToNext = useCallback(() => {
    if (totalTestimonials <= 1) return;
    setActiveTestimonial((prev) => (prev + 1) % totalTestimonials);
  }, [totalTestimonials]);

  const goToPrev = useCallback(() => {
    if (totalTestimonials <= 1) return;
    setActiveTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
  }, [totalTestimonials]);

  // Auto-rotate testimonials ("passar a rodar")
  useEffect(() => {
    if (totalTestimonials <= 1 || isPaused || lightbox) return;
    const timer = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % totalTestimonials);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [totalTestimonials, isPaused, lightbox]);

  useEffect(() => {
    if (activeTestimonial >= totalTestimonials && totalTestimonials > 0) {
      setActiveTestimonial(0);
    }
  }, [activeTestimonial, totalTestimonials]);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null);
      } else if (e.key === 'ArrowRight') {
        setLightbox((prev) =>
          prev ? { ...prev, index: (prev.index + 1) % prev.items.length } : null,
        );
      } else if (e.key === 'ArrowLeft') {
        setLightbox((prev) =>
          prev
            ? { ...prev, index: (prev.index - 1 + prev.items.length) % prev.items.length }
            : null,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  const openGalleryLightbox = (items: GalleryImage[], index: number) => {
    setLightbox({
      items: items.map((img) => ({
        src: img.url,
        alt: img.caption || 'Transformação Universo Maquiagem',
        caption: img.caption,
      })),
      index,
    });
  };

  const openTestimonialLightbox = (index: number) => {
    setLightbox({
      items: sortedTestimonials.map((item) => ({
        src: item.url,
        alt: item.alt || 'Depoimento real de aluna Universo Maquiagem',
      })),
      index,
    });
  };

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - clientX;
      if (Math.abs(diff) > 36) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const handlePointerDown = (clientX: number) => {
    pointerStartX.current = clientX;
    setIsPaused(true);
  };

  const handlePointerUp = (clientX: number) => {
    if (pointerStartX.current !== null) {
      const diff = pointerStartX.current - clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    }
    pointerStartX.current = null;
    setIsPaused(false);
  };

  return (
    <>
      {/* RESULTADOS REAIS — ANTES E DEPOIS */}
      {beforeAfterImages.length > 0 && (
        <section id="resultados" className="py-16 sm:py-22 bg-white border-t border-[#F3DCE4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C21F5E] mb-3">
                Antes e Depois
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.12] text-[#1E1316] text-balance">
                Resultados reais que mostram o poder da técnica certa
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#5E484F] leading-relaxed">
                Veja a diferença na preparação da pele, iluminação, contorno e acabamento profissional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
              {beforeAfterImages.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => openGalleryLightbox(beforeAfterImages, index)}
                  aria-label={`Ampliar antes e depois ${index + 1}`}
                  className="group relative rounded-2xl overflow-hidden bg-[#FDF3F6] border border-[#F3DCE4] shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C21F5E]"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden">
                    <SafeImage
                      src={img.url}
                      alt={img.caption || `Antes e depois maquiagem ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1E1316]/85 via-[#1E1316]/35 to-transparent flex items-end justify-between gap-2">
                    <span className="text-xs font-semibold text-white tracking-wide">
                      Antes & Depois
                    </span>
                    <Expand className="w-4 h-4 text-white/90 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALERIA DE ESTÚDIO */}
      {galleryImages.length > 0 && (
        <section className="py-12 sm:py-16 bg-[#FCE8F0] border-t border-[#EBB9CB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {galleryImages.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => openGalleryLightbox(galleryImages, index)}
                  aria-label={`Ampliar fotografia: ${img.caption || 'Universo Maquiagem'}`}
                  className="group relative text-left rounded-2xl overflow-hidden bg-white border border-[#EBB9CB] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C21F5E] cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#FCE8F0]">
                    <SafeImage
                      src={img.url}
                      alt={img.caption || 'Fotografia profissional de maquiagem'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[#230F17] line-clamp-1">
                      {img.caption || 'Universo Maquiagem'}
                    </span>
                    <Expand className="w-4 h-4 text-[#C21F5E] shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DEPOIMENTOS — CARROSSEL ÚNICO ROTATIVO E DESLIZÁVEL */}
      <section
        id="depoimentos"
        className="py-16 sm:py-24 bg-white border-t border-[#EBB9CB]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C21F5E] mb-3">
              Depoimentos Reais
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-semibold leading-[1.12] text-[#1E1316] text-balance">
              VEJA O QUE DIZEM AS NOSSAS ALUNAS!
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#5E484F] leading-relaxed">
              Deslize para o lado ou toque nas setas para ver cada mensagem real recebida no nosso
              atendimento.
            </p>
          </div>

          {totalTestimonials > 0 ? (
            <div
              className="relative max-w-sm mx-auto select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
              onPointerDown={(e) => handlePointerDown(e.clientX)}
              onPointerUp={(e) => handlePointerUp(e.clientX)}
            >
              {/* Single active slide container */}
              <div className="relative overflow-hidden rounded-3xl bg-[#191416] border-4 border-[#FCE9F0] shadow-xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                >
                  {sortedTestimonials.map((item, idx) => (
                    <div key={item.id} className="w-full shrink-0">
                      <button
                        type="button"
                        onClick={() => openTestimonialLightbox(idx)}
                        aria-label={`Ampliar depoimento ${idx + 1}`}
                        className="relative block w-full aspect-[9/15] overflow-hidden cursor-pointer focus-visible:outline-none"
                      >
                        <SafeImage
                          src={item.url}
                          alt={item.alt || `Depoimento real ${idx + 1}`}
                          loading="eager"
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-black/55 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                          <Expand className="w-3.5 h-3.5" />
                          Ampliar
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Prev / Next buttons */}
                {totalTestimonials > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrev();
                      }}
                      aria-label="Depoimento anterior"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1E1316] shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      aria-label="Próximo depoimento"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1E1316] shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Dots + Counter */}
              {totalTestimonials > 1 && (
                <div className="mt-5 flex flex-col items-center gap-2.5">
                  <div className="flex items-center justify-center gap-2">
                    {sortedTestimonials.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTestimonial(idx)}
                        aria-label={`Ver depoimento ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                          idx === activeTestimonial
                            ? 'w-7 bg-[#C21F5E]'
                            : 'w-2.5 bg-[#E6C5D1] hover:bg-[#D29BB0]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-[#6F5860] tabular-nums">
                    Deslize para trocar · {activeTestimonial + 1} de {totalTestimonials}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E6C5D1] bg-[#FDF3F6] p-10 text-center text-sm text-[#5E484F]">
              Espaço preparado para depoimentos reais de alunas.
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && lightbox.items[lightbox.index] && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1014]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Fechar ampliação"
              className="self-end mb-3 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full flex items-center justify-center">
              {lightbox.items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: (prev.index - 1 + prev.items.length) % prev.items.length,
                          }
                        : null,
                    )
                  }
                  aria-label="Imagem anterior"
                  className="absolute left-2 sm:-left-14 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/55 hover:bg-black/80 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img
                src={resolveAssetUrl(lightbox.items[lightbox.index].src)}
                alt={lightbox.items[lightbox.index].alt}
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-[78vh] w-auto max-w-full rounded-xl shadow-2xl object-contain bg-[#110B0D]"
              />

              {lightbox.items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev ? { ...prev, index: (prev.index + 1) % prev.items.length } : null,
                    )
                  }
                  aria-label="Próxima imagem"
                  className="absolute right-2 sm:-right-14 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/55 hover:bg-black/80 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm text-white/90 text-center">
              {lightbox.items[lightbox.index].caption && (
                <span>{lightbox.items[lightbox.index].caption}</span>
              )}
              <span className="text-white/60 tabular-nums">
                {lightbox.index + 1} / {lightbox.items.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
