import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Clock,
  Infinity as InfinityIcon,
  Layers,
  Repeat,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { AdminPanel } from './components/AdminPanel.tsx';
import { useOfferCountdown } from './components/CountdownHook.ts';
import { Footer } from './components/Footer.tsx';
import { GalleryAndTestimonials } from './components/GalleryAndTestimonials.tsx';
import { Header } from './components/Header.tsx';
import { ModulesSection } from './components/ModulesSection.tsx';
import { OfferAndTrust } from './components/OfferAndTrust.tsx';
import { PaymentConfirmationPage } from './components/PaymentConfirmationPage.tsx';
import { PurchaseNotifications } from './components/PurchaseNotifications.tsx';
import { SafeImage } from './components/SafeImage.tsx';
import { VideoSection } from './components/VideoSection.tsx';
import { DEFAULT_SITE_CONFIG } from './lib/defaultConfig.ts';
import { initMetaPixel, trackInitiateCheckout, trackViewContent } from './lib/metaPixel.ts';
import type { SiteConfig } from './types/config.ts';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [checkoutPendingNotice, setCheckoutPendingNotice] = useState(false);
  const offerRef = useRef<HTMLDivElement | null>(null);
  const countdown = useOfferCountdown();

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isAdminRoute = pathname.startsWith('/admin');
  const isConfirmationRoute =
    pathname.startsWith('/confirmacao') || pathname.startsWith('/obrigado');

  useEffect(() => {
    let active = true;
    fetch('/api/config')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        if (!res.ok || !ct.includes('application/json')) return null;
        return res.json();
      })
      .then((data: SiteConfig | null) => {
        if (active && data && typeof data.courseName === 'string') {
          setConfig(data);
        }
      })
      .catch(() => {
        // Keeps DEFAULT_SITE_CONFIG fallback seamlessly on static hosts (Vercel)
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (config.metaPixelId) {
      initMetaPixel(config.metaPixelId);
    }
  }, [config.metaPixelId]);

  useEffect(() => {
    if (isAdminRoute || isConfirmationRoute || !config.metaPixelId) return;
    const target = offerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackViewContent(config.courseName, config.priceNumeric, config.currencyCode);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    isAdminRoute,
    isConfirmationRoute,
    config.metaPixelId,
    config.courseName,
    config.priceNumeric,
    config.currencyCode,
  ]);

  const handleCheckoutAction = () => {
    trackInitiateCheckout(config.courseName, config.priceNumeric, config.currencyCode);
    if (!config.checkoutUrl) {
      setCheckoutPendingNotice(true);
    }
  };

  if (isAdminRoute) {
    return <AdminPanel initialConfig={config} onConfigSaved={setConfig} />;
  }

  if (isConfirmationRoute) {
    return <PaymentConfirmationPage config={config} />;
  }

  return (
    <div id="topo" className="min-h-screen flex flex-col bg-white text-[#230F17]">
      <Header courseName={config.courseName} logoUrl={config.logoUrl} />

      <div className="bg-[#230F17] text-white border-b border-[#C21F5E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.12em] uppercase text-[#F9B4CD]">Oferta termina em</span>
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#C21F5E] px-3 py-1.5 text-sm sm:text-base font-extrabold tabular-nums" aria-live="off">
            <Clock className="w-4 h-4" />
            {countdown}
          </span>
          <a href="#oferta" className="text-xs sm:text-sm font-bold underline underline-offset-4 decoration-[#F9B4CD] hover:text-[#F9B4CD] transition-colors">VER OFERTA</a>
        </div>
      </div>

      <main className="flex-1">
        {/* 1. HERO — COM CTA CONTADO NO INÍCIO DA PÁGINA */}
        <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F9D2E1] via-[#FCE8F0] to-[#FFF5F8] border-b border-[#EBB9CB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#A3154B] mb-3">
                  Beleza · Conhecimento · Confiança
                </p>

                <h1 className="font-display text-[34px] sm:text-5xl lg:text-[54px] font-bold leading-[1.06] tracking-tight text-[#230F17] text-balance">
                  TRANSFORME A SUA PAIXÃO PELA MAQUIAGEM NUMA NOVA HABILIDADE!
                </h1>

                <p className="mt-5 text-base sm:text-lg text-[#4A2835] leading-relaxed max-w-2xl">
                  Aprenda maquiagem na pele negra do zero ao acabamento profissional com aulas
                  gravadas, diretas e fáceis de acompanhar — para se maquilhar com segurança ou
                  atender as suas primeiras clientes.
                </p>

                {/* CTA inicial sem exibição de preços; valores aparecem apenas na secção da oferta */}
                <div className="mt-7 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <a
                      href="#demonstracao"
                      className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white border-2 border-[#C21F5E]/30 hover:border-[#C21F5E] text-[#230F17] text-sm font-bold transition-colors whitespace-nowrap"
                    >
                      Ver aula demonstrativa
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E5B3C6] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm font-semibold text-[#4A2835]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C21F5E]" aria-hidden="true">
                      •
                    </span>
                    <span>Curso 100% online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C21F5E]" aria-hidden="true">
                      •
                    </span>
                    <span>Aulas gravadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C21F5E]" aria-hidden="true">
                      •
                    </span>
                    <span>Acesso vitalício</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C21F5E]" aria-hidden="true">
                      •
                    </span>
                    <span>No seu próprio ritmo</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative h-full min-h-[380px] sm:min-h-[460px] rounded-3xl overflow-hidden border-4 border-white bg-[#F9D2E1] shadow-2xl">
                  <SafeImage
                    src={config.heroImageUrl}
                    alt="Mulher negra com maquiagem elegante e pele luminosa"
                    loading="eager"
                    priority="high"
                    className="w-full h-full object-cover"
                  />
                  {config.logoUrl && (
                    <div className="absolute bottom-4 right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-xl bg-[#F9B4CD]">
                      <SafeImage
                        src={config.logoUrl}
                        alt={`Logotipo ${config.courseName}`}
                        loading="eager"
                        priority="high"
                        className="w-full h-full object-cover scale-105"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CONHEÇA O UNIVERSO MAQUIAGEM */}
        <section id="curso" className="py-16 sm:py-22 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-14">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="rounded-3xl overflow-hidden border-2 border-[#F2C9D8] bg-[#FCE8F0] shadow-lg aspect-[4/3]">
                  <SafeImage
                    src={config.courseImageUrl}
                    alt="Maquiadora negra aplicando iluminação em modelo negra no estúdio"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#C21F5E] mb-3">
                  Sobre a Formação
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.1] text-[#230F17] text-balance">
                  Conheça o Universo Maquiagem e domine cada técnica passo a passo
                </h2>
                <div className="mt-5 space-y-4 text-base sm:text-lg text-[#4A2835] leading-relaxed">
                  <p>
                    Uma formação digital prática com aulas gravadas que mostram, ao pormenor, como
                    preparar a pele negra sem acinzentar, acertar no subtom da base e criar um
                    acabamento limpo e duradouro.
                  </p>
                  <p>
                    Assista diretamente pelo seu <strong>telemóvel</strong> ou{' '}
                    <strong>computador</strong>, pause cada demonstração e pratique à frente do
                    espelho no seu ritmo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'Aprenda desde o zero',
                  desc: 'Comece sem medo mesmo que nunca tenha feito uma maquiagem completa antes.',
                },
                {
                  icon: Layers,
                  title: 'Aulas gravadas e organizadas',
                  desc: 'Passo a passo claro para acompanhar da preparação da pele até ao batom.',
                },
                {
                  icon: Clock,
                  title: 'Estude quando quiser',
                  desc: 'Sem horários fixos: assista no tempo livre do seu dia.',
                },
                {
                  icon: Smartphone,
                  title: 'Acompanhe pelo telemóvel',
                  desc: 'Veja as aulas com qualidade no seu telemóvel ou computador.',
                },
                {
                  icon: Repeat,
                  title: 'Reveja sempre que precisar',
                  desc: 'Volte às técnicas de contorno, olhos ou pele quantas vezes quiser.',
                },
                {
                  icon: InfinityIcon,
                  title: 'Acesso vitalício',
                  desc: 'Investimento único sem mensalidades, para sempre disponível para si.',
                },
              ].map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#FCE8F0] rounded-2xl p-6 border border-[#F0C3D4] flex flex-col"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#F0C3D4] text-[#C21F5E] flex items-center justify-center mb-4 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#230F17] mb-1.5">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#4A2835] leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. IDENTIFICAÇÃO DO PROBLEMA */}
        <section className="py-16 sm:py-22 bg-[#FCE8F0] border-y border-[#EBB9CB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3154B] mb-3">
                  Identificação
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] text-[#230F17] text-balance">
                  Já quiseste fazer uma maquiagem impecável, mas sentes que falta técnica?
                </h2>
                <p className="mt-4 text-base text-[#4A2835] leading-relaxed">
                  Sem saber a ordem e os segredos certos para a sua pele, até bons produtos acabam
                  por não dar o brilho que merece.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-3">
                {[
                  'Dificuldade em escolher a base certa sem deixar o rosto acinzentado ou escuro demais.',
                  'Preparação de pele que craquela na zona dos olhos ou fica oleosa rapidamente.',
                  'Sombra marcada e dificuldade em conseguir um esfumado limpo e elegante.',
                  'Dúvidas sobre onde aplicar o corretor, o contorno, o blush e o iluminador.',
                  'Vontade de aprender para se sentir mais confiante ou começar a atender clientes.',
                ].map((situation, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl px-6 py-4 border border-[#EBB9CB] shadow-xs flex items-baseline gap-4"
                  >
                    <span className="font-display text-xl font-bold text-[#C21F5E] tabular-nums shrink-0">
                      0{index + 1}.
                    </span>
                    <p className="text-sm sm:text-base text-[#230F17] leading-relaxed">
                      {situation}
                    </p>
                  </div>
                ))}

                <div className="pt-3">
                  <div className="rounded-2xl bg-[#230F17] text-white p-6 sm:p-7">
                    <p className="text-base sm:text-lg leading-relaxed text-[#FCE8F0]">
                      O <strong className="text-white">{config.courseName}</strong> entrega-lhe o
                      método completo e organizado para transformar qualquer rosto com naturalidade,
                      brilho e acabamento profissional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ANTES E DEPOIS + GALERIA + DEPOIMENTOS EM CARROSSEL ROTATIVO */}
        <GalleryAndTestimonials
          beforeAfterImages={config.beforeAfterImages}
          galleryImages={config.galleryImages}
          testimonials={config.testimonials}
        />

        {/* 5. VÍDEO DEMONSTRATIVO (VSL REAL) */}
        <VideoSection
          videoUrl={config.videoUrl}
          posterUrl={config.videoPosterUrl}
          onVideoPlay={() =>
            trackViewContent(config.courseName, config.priceNumeric, config.currencyCode)
          }
        />

        {/* MÓDULOS REAIS (EXIBIDO QUANDO CONFIGURADO) */}
        <ModulesSection modules={config.modules} />

        {/* 6. OFERTA ESPECIAL COM CTA CONTADO + FAQ */}
        <div ref={offerRef}>
          <OfferAndTrust
            config={config}
            onCheckoutClick={handleCheckoutAction}
            checkoutPendingNotice={checkoutPendingNotice}
          />
        </div>
      </main>

      <Footer courseName={config.courseName} logoUrl={config.logoUrl} />

      <PurchaseNotifications
        courseName={config.courseName}
        priceText={config.priceText}
      />
    </div>
  );
}
