import { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Mail, ShieldAlert } from 'lucide-react';
import { trackConfirmedPurchase } from '../lib/metaPixel.ts';
import type { SiteConfig } from '../types/config.ts';

interface PaymentConfirmationPageProps {
  config: SiteConfig;
}

export function PaymentConfirmationPage({ config }: PaymentConfirmationPageProps) {
  const params = new URLSearchParams(window.location.search);
  const status = (params.get('payment_status') || params.get('status') || '').toLowerCase();
  const confirmedParam = params.get('confirmed');
  const orderId = params.get('order_id') || params.get('tx_ref') || params.get('transaction_id') || '';

  const isConfirmed =
    status === 'confirmed' ||
    status === 'paid' ||
    status === 'approved' ||
    confirmedParam === 'true' ||
    confirmedParam === '1';

  useEffect(() => {
    if (isConfirmed && config.metaPixelId) {
      const effectiveOrderId = orderId || 'confirmed_session';
      trackConfirmedPurchase(
        effectiveOrderId,
        config.courseName,
        config.priceNumeric,
        config.currencyCode,
      );
    }
  }, [isConfirmed, orderId, config.metaPixelId, config.courseName, config.priceNumeric, config.currencyCode]);

  const supportMailHref = config.supportEmail
    ? `mailto:${config.supportEmail}?subject=${encodeURIComponent(
        `Suporte - ${config.courseName}`,
      )}`
    : '';

  return (
    <main className="min-h-screen bg-[#FCF9F7] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E7D8D2] shadow-lg p-8 sm:p-10 text-center">
        {isConfirmed ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#EAF7EE] text-[#1E7E3E] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C21F5E] mb-2">
              Inscrição Confirmada
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#230F17] mb-4">
              Pagamento confirmado com sucesso!
            </h1>
            <p className="text-base text-[#4A2835] leading-relaxed mb-6">
              Obrigada por escolher o <strong>{config.courseName}</strong>. As instruções para
              aceder às aulas gravadas digitais são enviadas imediatamente após a confirmação do seu
              pagamento.
            </p>

            {orderId && (
              <div className="mb-6 rounded-xl bg-[#FCE8F0] border border-[#EBB9CB] px-4 py-3 text-sm text-[#230F17]">
                Referência do pedido: <span className="font-semibold tabular-nums">{orderId}</span>
              </div>
            )}

            <div className="space-y-3">
              {supportMailHref && (
                <a
                  href={supportMailHref}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-[#C21F5E] hover:bg-[#9F164B] text-white font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Falar com o Suporte por Email
                </a>
              )}
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl border border-[#EBB9CB] hover:bg-[#FCE8F0] text-[#230F17] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à página do curso
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#FCE8F0] text-[#C21F5E] flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-[#230F17] mb-3">
              Aguardando confirmação do pagamento
            </h1>
            <p className="text-base text-[#4A2835] leading-relaxed mb-6">
              Esta página confirma o acesso digital apenas após a validação do pagamento pelo
              checkout oficial. Se já realizou o pagamento e precisa de ajuda, contacte o nosso
              suporte.
            </p>
            <div className="space-y-3">
              {supportMailHref && (
                <a
                  href={supportMailHref}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-[#C21F5E] hover:bg-[#9F164B] text-white font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contactar Suporte por Email
                </a>
              )}
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl border border-[#EBB9CB] hover:bg-[#FCE8F0] text-[#230F17] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à página principal
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
