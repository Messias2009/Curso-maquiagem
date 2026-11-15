export interface CourseModule {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  contents: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface TestimonialImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface SiteConfig {
  courseName: string;
  logoUrl: string;
  priceText: string;
  priceNumeric: number;
  currencyCode: string;
  checkoutUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  supportEmail: string;
  heroImageUrl: string;
  courseImageUrl: string;
  videoUrl: string;
  videoPosterUrl: string;
  metaPixelId: string;
  modules: CourseModule[];
  beforeAfterImages: GalleryImage[];
  galleryImages: GalleryImage[];
  testimonials: TestimonialImage[];
  updatedAt: string;
}
