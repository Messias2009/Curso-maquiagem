import { useState } from 'react';
import { Clock, Menu, X } from 'lucide-react';
import { useCountdownTimer } from './CountdownCta.tsx';
import { SafeImage } from './SafeImage.tsx';

interface HeaderProps {
  courseName: string;
  logoUrl: string;
  onCheckoutClick: () => void;
  checkoutUrl: string;
}

export function Header({ courseName, logoUrl, onCheckoutClick, checkoutUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { formatted } = useCountdownTimer();

  const navItems = [
    { href: '#curso', label: 'O Curso' },
    { href: '#resultados', label: 'Antes e Depois' },
    { href: '#demonstracao', label: 'Vídeo' },
    { href: '#depoimentos', label: 'Depoimentos' },
    { href: '#duvidas', label: 'Dúvidas' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2C9D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-8">
        <a
          href="#topo"
          className="flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C21F5E]"
        >
          {logoUrl && (
            <span className="w-9 h-9 rounded-full overflow-hidden border border-[#E89EB9] shrink-0 bg-[#F9B4CD]">
              <SafeImage
                src={logoUrl}
                alt={courseName}
                className="w-full h-full object-cover scale-105"
                loading="eager"
              />
            </span>
          )}
          <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-[#230F17]">
            {courseName}
          </span>
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#5A3945]"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 hover:text-[#C21F5E] underline-offset-4 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C21F5E]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onCheckoutClick}
              className="btn-cta-attention inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#C21F5E] via-[#D8276B] to-[#A8164E] hover:from-[#AE1A53] hover:to-[#911142] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C21F5E]"
            >
              <span>Garantir Acesso</span>
              <span className="inline-flex items-center gap-1 bg-black/25 px-1.5 py-0.5 rounded text-[11px] font-bold tabular-nums">
                <Clock className="w-3 h-3" />
                {formatted}
              </span>
            </a>
          ) : (
            <a
              href="#oferta"
              onClick={onCheckoutClick}
              className="btn-cta-attention inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#C21F5E] via-[#D8276B] to-[#A8164E] hover:from-[#AE1A53] hover:to-[#911142] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C21F5E]"
            >
              <span>Garantir Acesso</span>
              <span className="inline-flex items-center gap-1 bg-black/25 px-1.5 py-0.5 rounded text-[11px] font-bold tabular-nums">
                <Clock className="w-3 h-3" />
                {formatted}
              </span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#230F17] hover:bg-[#FCE8F0] transition-colors focus-visible:outline-2 focus-visible:outline-[#C21F5E]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F2C9D8] bg-white px-4 py-4">
          <nav className="flex flex-col gap-1" aria-label="Menu móvel">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-3 text-base font-medium text-[#230F17] hover:bg-[#FCE8F0] rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
