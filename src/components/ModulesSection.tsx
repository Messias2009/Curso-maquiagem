import { Check } from 'lucide-react';
import type { CourseModule } from '../types/config.ts';
import { SafeImage } from './SafeImage.tsx';

interface ModulesSectionProps {
  modules: CourseModule[];
}

export function ModulesSection({ modules }: ModulesSectionProps) {
  if (modules.length === 0) {
    return null;
  }

  return (
    <section id="modulos" className="py-16 sm:py-22 bg-white border-t border-[#F3DCE4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C21F5E] mb-3">
            Conteúdo do Curso
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.12] text-[#1E1316] text-balance">
            TUDO O QUE PRECISAS PARA COMEÇAR A APRENDER MAQUIAGEM
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#5E484F] leading-relaxed">
            Aulas gravadas e organizadas passo a passo para acompanhar com clareza ao seu ritmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {modules.map((mod, idx) => (
            <article
              key={mod.id}
              className="flex flex-col bg-[#FDF3F6]/40 rounded-2xl border border-[#F3DCE4] overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200"
            >
              {mod.imageUrl && (
                <div className="aspect-[4/3] w-full bg-[#FDF3F6] overflow-hidden">
                  <SafeImage
                    src={mod.imageUrl}
                    alt={mod.title}
                    fallbackTitle={mod.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#C21F5E] mb-1.5">
                  Módulo {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#1E1316] leading-snug mb-2">
                  {mod.title}
                </h3>
                {mod.description && (
                  <p className="text-sm text-[#5E484F] leading-relaxed mb-4">
                    {mod.description}
                  </p>
                )}
                {mod.contents.length > 0 && (
                  <ul className="mt-auto pt-4 border-t border-[#F3DCE4] space-y-2">
                    {mod.contents.map((item, cIdx) => (
                      <li
                        key={cIdx}
                        className="flex items-start gap-2.5 text-sm text-[#1E1316] leading-snug"
                      >
                        <Check className="w-4 h-4 text-[#C21F5E] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
