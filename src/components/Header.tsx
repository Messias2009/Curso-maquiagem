import { SafeImage } from './SafeImage.tsx';

interface HeaderProps {
  courseName: string;
  logoUrl: string;
}

export function Header({ courseName, logoUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2C9D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-center">
        <a
          href="#topo"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C21F5E]"
        >
          {logoUrl && (
            <span className="w-10 h-10 rounded-full overflow-hidden border border-[#E89EB9] shrink-0 bg-[#F9B4CD]">
              <SafeImage
                src={logoUrl}
                alt={courseName}
                className="w-full h-full object-cover scale-105"
                loading="eager"
                priority="high"
              />
            </span>
          )}
          <span className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-[#230F17]">
            {courseName}
          </span>
        </a>
      </div>
    </header>
  );
}
