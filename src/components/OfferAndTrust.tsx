import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Clock, Lock } from 'lucide-react';
import type { SiteConfig } from '../types/config.ts';
import { useOfferCountdown } from './CountdownHook.ts';
import { SafeImage } from './SafeImage.tsx';

interface OfferAndTrustProps {
  config: SiteConfig;
  onCheckoutClick: () => void;
  checkoutPendingNotice: boolean;
}

export function OfferAndTrust({
  config,
  onCheckoutClick,
  checkoutPendingNotice,
}: OfferAndTrustProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const countdown = useOfferCountdown();

  const faqItems = [
    {
      q: '1. Preciso ter experiência para começar?',
      a: 'Não. O curso ensina desde os fundamentos básicos até técnicas avançadas, permitindo que comece do zero e evolua passo a passo.',
    },
    {
      q: '2. Como funcionam as aulas gravadas?',
      a: 'As aulas ficam gravadas para assistir no seu ritmo, pausar enquanto pratica e acompanhar cada detalhe das demonstrações.',
    },
    {
      q: '3. Posso estudar pelo telemóvel?',
      a: 'Sim. Todo o conteúdo funciona perfeitamente no telemóvel, tablet ou computador.',
    },
    {
      q: '4. Durante quanto tempo terei acesso?',
      a: 'O acesso é vitalício. Faz o pagamento uma única vez e pode voltar às aulas sempre que precisar.',
    },
    {
      q: '5. Como recebo o curso depois do pagamento?',
      a: 'É um produto 100% digital. Assim que o pagamento é confirmado no checkout oficial, recebe as instruções para aceder imediatamente.',
    },
    {
      q: '6. Posso assistir às aulas mais de uma vez?',
      a: 'Sim. Pode rever cada aula quantas vezes quiser até dominar todas as técnicas.',
    },
    {
      q: '7. Como posso entrar em contacto com o suporte?',
      a: `Caso tenha alguma dúvida sobre o seu acesso, pode escrever para o nosso email oficial de suporte: ${config.supportEmail}.`,
    },
    {
      q: '8. Como funciona o pagamento?',
      a: 'Ao clicar no botão de compra, é direcionada para o checkout oficial onde finaliza a inscrição de forma segura.',
    },
  ];

  return (
    <>
      {/* OFERTA ESPECIAL COM CTA CONTADO */}
      <section id="oferta" className="py-16 sm:py-24 bg-[#FADCE8] border-y border-[#EAB7CA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-white border-2 border-[#EBB9CB] shadow-2xl overflow-hidden">
            <div className="bg-[#230F17] text-white px-6 sm:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {config.logoUrl && (
                  <span className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F59AB9] shrink-0">
                    <SafeImage
                      src={config.logoUrl}
                      alt={config.courseName}
                      className="w-full h-full object-cover scale-105"
                    />
                  </span>
                )}
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F59AB9]">
                    Oferta Especial
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {config.courseName.toUpperCase()}
                  </h2>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#C21F5E] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tabular-nums self-start sm:self-auto">
                <Clock className="w-4 h-4" />
                <span>Termina em {countdown}</span>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-5">
                <p className="text-base sm:text-lg text-[#432631] leading-relaxed">
                  Formação online completa de maquiagem com aulas gravadas para aprender do zero ao
                  acabamento profissional no seu telemóvel ou computador.
                </p>

                <ul className="space-y-3 pt-1">
                  {[
                    'Acesso completo às aulas gravadas passo a passo',
                    'Acesso vitalício — estude quando quiser e reveja sempre',
                    'Compatível com telemóvel, tablet e computador',
                    'Receba o acesso digital logo após a confirmação',
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-base text-[#230F17]"
                    >
                      <Check className="w-5 h-5 text-[#C21F5E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-5 rounded-2xl bg-[#FCEBF2] border border-[#EBB9CB] p-6 sm:p-7 text-center">
                {config.comparePriceText && (
                  <p className="text-sm font-semibold text-[#7E5463] tabular-nums mb-1">
                    Antes:{' '}
                    <span className="line-through text-[#9A687A]">{config.comparePriceText}</span>
                  </p>
                )}

                <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#C21F5E] mb-2">
                  Agora por apenas
                </p>

                <div className="font-display text-5xl sm:text-[54px] font-bold text-[#230F17] tabular-nums leading-none">
                  {config.priceText}
                </div>
                <p className="mt-2 text-sm font-medium text-[#5A3945]">
                  Acesso vitalício ao conteúdo digital
                </p>

                <div className="mt-6">
                  <a
                    href={config.checkoutUrl || '#oferta'}
                    target={config.checkoutUrl ? '_blank' : undefined}
                    rel={config.checkoutUrl ? 'noopener noreferrer' : undefined}
                    onClick={onCheckoutClick}
                    className="inline-flex flex-col items-center justify-center gap-1 w-full py-4 px-5 rounded-xl bg-[#C21F5E] hover:bg-[#9F164B] text-white font-bold shadow-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C21F5E]"
                  >
                    <span className="inline-flex items-center gap-2 text-base">
                      <span>QUERO GARANTIR O MEU ACESSO</span>
                      <ArrowRight className="w-5 h-5 shrink-0" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Oferta expira em {countdown}</span>
                    </span>
                  </a>
                </div>

                {checkoutPendingNotice && !config.checkoutUrl && (
                  <p className="mt-3 text-xs text-[#9F164B] bg-white rounded-lg p-3 border border-[#EBB9CB]">
                    O link do checkout oficial está a ser atualizado.
                  </p>
                )}

                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#5A3945]">
                  <Lock className="w-3.5 h-3.5 text-[#C21F5E]" />
                  <span>Checkout oficial com acesso digital imediato</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES */}
      <section id="duvidas" className="py-16 sm:py-22 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#C21F5E] mb-3">
              Tire as Suas Dúvidas
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#230F17] text-balance">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#FCEBF2]/70 rounded-xl border border-[#F0C8D7] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left hover:bg-[#FCEBF2] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C21F5E]"
                  >
                    <span className="font-sans text-base sm:text-lg font-semibold text-[#230F17]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#C21F5E] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-2 text-sm sm:text-base text-[#432631] leading-relaxed bg-white border-t border-[#F0C8D7]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
