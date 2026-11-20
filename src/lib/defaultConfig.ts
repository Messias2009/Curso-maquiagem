import type { SiteConfig } from '../types/config.ts';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  courseName: 'Universo Maquiagem',
  logoUrl: '/assets/aistudio/file_000000006b7471f4956a18565d37ddfd_81b6ace5.png',
  comparePriceText: '15.000 Kz',
  priceText: '2.500 Kz',
  priceNumeric: 2500,
  currencyCode: 'AOA',
  checkoutUrl: 'https://pay.kursinha.com/c/6a95ce587f8896e596b31fde',
  whatsappNumber: '244900000000',
  whatsappMessage:
    'Olá! Tenho interesse no curso Universo Maquiagem e gostaria de esclarecer algumas dúvidas.',
  supportEmail: 'suporte@universomaquiagem.com',
  heroImageUrl: '/src/assets/images/hero_makeup_model_1794755648886.jpg',
  courseImageUrl: '/src/assets/images/course_demo_black_women_1794763985917.jpg',
  videoUrl: '/assets/aistudio/demo_1cd600ca.mp4',
  videoPosterUrl: '/src/assets/images/video_poster_black_model_1794763988454.jpg',
  metaPixelId: '1865139711590522',
  modules: [],
  beforeAfterImages: [
    {
      id: 'ba-1',
      url: '/assets/aistudio/make1_8992cf44.jpg',
      caption: 'Transformação completa: preparação de pele e acabamento elegante',
    },
    {
      id: 'ba-2',
      url: '/assets/aistudio/make2_af253646.jpg',
      caption: 'Realce natural dos olhos, iluminação e lábios definidos',
    },
    {
      id: 'ba-3',
      url: '/assets/aistudio/make3_440202f1.jpg',
      caption: 'Pele uniforme, contorno suave e olhar marcante',
    },
    {
      id: 'ba-4',
      url: '/assets/aistudio/make4_e11534b6.jpg',
      caption: 'Maquiagem luminosa com técnica profissional passo a passo',
    },
    {
      id: 'ba-5',
      url: '/assets/aistudio/make5_5d65807e.jpg',
      caption: 'Acabamento impecável com harmonia de cores e durabilidade',
    },
  ],
  galleryImages: [
    {
      id: 'gal-1',
      url: '/src/assets/images/gallery_brushes_flatlay_1794755650242.jpg',
      caption: 'Pincéis e acabamento profissional',
    },
    {
      id: 'gal-2',
      url: '/src/assets/images/gallery_glam_portrait_1794755650172.jpg',
      caption: 'Preparação de pele luminosa e natural',
    },
    {
      id: 'gal-3',
      url: '/src/assets/images/gallery_studio_products_1794755650648.jpg',
      caption: 'Seleção de produtos e tonalidades',
    },
  ],
  testimonials: [
    {
      id: 'dep-1',
      url: '/assets/aistudio/file_000000002280820a9da949e185a741d6_f38ae8d3.png',
      alt: 'Depoimento real de aluna sobre resultados no 2.º dia',
      order: 1,
    },
    {
      id: 'dep-2',
      url: '/assets/aistudio/file_000000006db081f48863f4b1de35fe95_eef2a88d.png',
      alt: 'Depoimento real de aluna após receber o material e aulas em vídeo',
      order: 2,
    },
    {
      id: 'dep-3',
      url: '/assets/aistudio/file_00000000215481f4bf73791eb2355421_6741ead7.png',
      alt: 'Depoimento real de aluna confirmando acesso às aulas do curso',
      order: 3,
    },
    {
      id: 'dep-4',
      url: '/assets/aistudio/file_00000000c8a8824387d9698161ef30ec_ce278b3a.png',
      alt: 'Depoimento real de aluna confirmando receção do guia digital',
      order: 4,
    },
    {
      id: 'dep-5',
      url: '/assets/aistudio/file_00000000bccc821086c8ab5d6530e718_c37f9ae5.png',
      alt: 'Depoimento real da aluna Maria Helena após confirmação',
      order: 5,
    },
    {
      id: 'dep-6',
      url: '/assets/aistudio/Screenshot_20260909-165103_f0e1eba1.png',
      alt: 'Comprovativo real de envio e confirmação de material digital',
      order: 6,
    },
  ],
  updatedAt: new Date().toISOString(),
};
