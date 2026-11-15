import { useEffect, useRef, useState } from 'react';
import {
  Clock,
  Infinity as InfinityIcon,
  Layers,
  Repeat,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { AdminPanel } from './components/AdminPanel.tsx';
import { AttentionCtaButton, useCountdownTimer } from './components/CountdownCta.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
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
  const { formatted } = useCountdownTimer();

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isAdminRoute = pathname.startsWith('/admin');
  const isConfirmationRoute =
    pathname.startsWith('/confirmacao') || pathname.startsWith('/obrigado');

  useEffect(() => {
    let active = true;
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteConfig | null) => {
        if (active && data) {
          setConfig(data);
        }
      })
      .catch(() => {
        // Keeps DEFAULT_SITE_CONFIG fallback
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
      <Header
        courseName={config.courseName}
        logoUrl={config.logoUrl}
        checkoutUrl={config.checkoutUrl}
        onCheckoutClick={handleCheckoutAction}
      />

      <main className="flex-1">
        {/* FAIXA DE CONTAGEM DE URGÊNCIA NO TOPO */}
        <div className="bg-[#230F17] text-white py-2.5 px-4 text-center border-b border-[#3E1C2A]">
          <p className="text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-center gap-2">
            <span>Inscrições com acesso vitalício por {config.priceText}</span>
            <span className="inline-flex items-center gap-1.5 bg-[#C21F5E] px-2.5 py-0.5 rounded-md font-bold tabular-nums">
              <Clock className="w-3.5 h-3.5" />
              Termina em {formatted}
            </span>
          </p>
        </div>

        {/* 1. HERO — FUNDO ROSA ENVOLVENTE E CTA DE CONTAGEM */}
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
                  Aprenda maquiagem do zero ao avançado com aulas gravadas, práticas e fáceis de
                  acompanhar. Domine a preparação da pele, olhos marcantes e acabamentos perfeitos
                  para fazer em si ou atender clientes com segurança.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <AttentionCtaButton
                    label="QUERO APRENDER MAQUIAGEM"
                    checkoutUrl={config.checkoutUrl}
                    onClick={handleCheckoutAction}
                    showCountdown
                  />

                  <a
                    href="#demonstracao"
                    className="inline-flex items-center justify-center px-6 py-4 rounded-xl border-2 border-[#C21F5E]/30 bg-white/90 hover:bg-white text-[#230F17] text-sm font-bold transition-colors whitespace-nowrap"
                  >
                    Ver demonstração em vídeo
                  </a>
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
                    alt="Mulher com maquiagem elegante e acabamento luminoso"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                  {config.logoUrl && (
                    <div className="absolute bottom-4 right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-xl bg-[#F9B4CD]">
                      <SafeImage
                        src={config.logoUrl}
                        alt={`Logotipo ${config.courseName}`}
                        loading="eager"
                        className="w-full h-full object-cover scale-105"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CONHEÇA O UNIVERSO MAQUIAGEM + APRENDA DO ZERO (COM CTA DE DESTAQUE) */}
        <section id="curso" className="py-16 sm:py-22 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-14">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="rounded-3xl overflow-hidden border-2 border-[#F2C9D8] bg-[#FCE8F0] shadow-lg aspect-[4/3]">
                  <SafeImage
                    src={config.courseImageUrl}
                    alt="Demonstração prática de maquiagem no curso Universo Maquiagem"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#C21F5E] mb-3">
                  Como Funciona o Curso
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.1] text-[#230F17] text-balance">
                  Conheça o Universo Maquiagem e aprenda passo a passo
                </h2>
                <div className="mt-5 space-y-4 text-base sm:text-lg text-[#4A2835] leading-relaxed">
                  <p>
                    O <strong>{config.courseName}</strong> é uma formação digital com aulas gravadas
                    em vídeo, criada para lhe ensinar do básico ao acabamento profissional de forma
                    simples e prática.
                  </p>
                  <p>
                    Pode assistir pelo seu <strong>telemóvel</strong> ou{' '}
                    <strong>computador</strong>, pausar quando quiser e praticar cada técnica no
                    conforto da sua casa.
                  </p>
                </div>

                <div className="mt-7">
                  <AttentionCtaButton
                    label="QUERO COMEÇAR AGORA"
                    checkoutUrl={config.checkoutUrl}
                    onClick={handleCheckoutAction}
                    showCountdown
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'Aprenda desde o zero',
                  desc: 'Mesmo sem experiência, acompanha cada etapa da maquiagem sem complicação.',
                },
                {
                  icon: Layers,
                  title: 'Aulas gravadas e organizadas',
                  desc: 'Conteúdo estruturado na ordem certa para ver evolução rápida.',
                },
                {
                  icon: Clock,
                  title: 'Estude quando quiser',
                  desc: 'Sem horários rígidos: assista no momento livre do seu dia.',
                },
                {
                  icon: Smartphone,
                  title: 'Acompanhe pelo telemóvel',
                  desc: 'Funciona perfeitamente no telemóvel, tablet ou computador.',
                },
                {
                  icon: Repeat,
                  title: 'Reveja os conteúdos',
                  desc: 'Repita as aulas quantas vezes quiser até dominar cada detalhe.',
                },
                {
                  icon: InfinityIcon,
                  title: 'Acesso vitalício',
                  desc: 'Investimento único com acesso permanente às aulas.',
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
                  Você identifica-se?
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.12] text-[#230F17] text-balance">
                  Já quiseste fazer maquiagens bonitas, mas não sabes por onde começar?
                </h2>
                <p className="mt-4 text-base text-[#4A2835] leading-relaxed">
                  Muitas mulheres compram produtos caros, tentam copiar vídeos rápidos e mesmo assim
                  sentem que o resultado não fica como queriam.
                </p>
                <div className="mt-6">
                  <AttentionCtaButton
                    label="GARANTIR O MEU ACESSO"
                    checkoutUrl={config.checkoutUrl}
                    onClick={handleCheckoutAction}
                    showCountdown
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                {[
                  'Não saber escolher a base e os produtos certos para o seu tom de pele.',
                  'Ter dificuldades na preparação da pele, deixando a maquiagem marcada ou oleosa.',
                  'Não conseguir fazer um esfumado limpo, harmonioso e bem acabado.',
                  'Não conhecer a ordem correta de aplicação para a maquiagem durar horas.',
                  'Ter vontade de aprender e até trabalhar com beleza, mas faltar um método claro.',
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
                      No <strong className="text-white">{config.courseName}</strong>, aprende cada
                      técnica na sequência certa — sem segredos, direto ao ponto e fácil de aplicar
                      já nos primeiros dias.
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

        {/* 5. VÍDEO DEMONSTRATIVO (VSL) */}
        <VideoSection
          videoUrl={config.videoUrl}
          posterUrl={config.videoPosterUrl}
          checkoutUrl={config.checkoutUrl}
          onVideoPlay={() =>
            trackViewContent(config.courseName, config.priceNumeric, config.currencyCode)
          }
          onCheckoutClick={handleCheckoutAction}
        />

        {/* MÓDULOS REAIS (EXIBIDO QUANDO CONFIGURADO) */}
        <ModulesSection modules={config.modules} />

        {/* 6. OFERTA ESPECIAL + FAQ */}
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

      <FloatingWhatsApp
        phoneNumber={config.whatsappNumber}
        message={config.whatsappMessage}
      />
    </div>
  );
}
