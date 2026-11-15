import { SafeImage } from './SafeImage.tsx';

interface FooterProps {
  courseName: string;
  logoUrl: string;
}

export function Footer({ courseName, logoUrl }: FooterProps) {
  return (
    <footer className="bg-[#230F17] text-[#F7D7E3] border-t border-[#3E1C2A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          {logoUrl && (
            <span className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F59AB9] bg-[#F9B4CD]">
              <SafeImage
                src={logoUrl}
                alt={courseName}
                className="w-full h-full object-cover scale-105"
              />
            </span>
          )}
          <div className="font-display text-2xl sm:text-3xl font-bold text-white">
            {courseName}
          </div>
          <p className="text-sm text-[#EAC2D1]">
            Curso Online de Maquiagem · Aulas Gravadas · Acesso Vitalício
          </p>
        </div>

        <div className="mt-7 pt-6 border-t border-[#3E1C2A] text-center">
          <p className="text-xs sm:text-sm text-[#D8AAB9]">
            © {new Date().getFullYear()} {courseName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
