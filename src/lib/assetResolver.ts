import courseDemoBlackImg from '../assets/optimized/course_demo_black_women.webp';
import dep1Img from '../assets/optimized/dep1.webp';
import dep2Img from '../assets/optimized/dep2.webp';
import dep3Img from '../assets/optimized/dep3.webp';
import dep4Img from '../assets/optimized/dep4.webp';
import dep5Img from '../assets/optimized/dep5.webp';
import dep6Img from '../assets/optimized/dep6.webp';
import galleryBrushesImg from '../assets/optimized/gallery_brushes_flatlay.webp';
import galleryGlamImg from '../assets/optimized/gallery_glam_portrait.webp';
import galleryStudioImg from '../assets/optimized/gallery_studio_products.webp';
import heroModelImg from '../assets/optimized/hero_makeup_model.webp';
import logoImg from '../assets/optimized/logo.webp';
import make1Img from '../assets/optimized/make1.webp';
import make2Img from '../assets/optimized/make2.webp';
import make3Img from '../assets/optimized/make3.webp';
import make4Img from '../assets/optimized/make4.webp';
import make5Img from '../assets/optimized/make5.webp';
import videoPosterBlackImg from '../assets/optimized/video_poster_black_model.webp';

const ASSET_MAP: Record<string, string> = {
  '/assets/aistudio/file_000000006b7471f4956a18565d37ddfd_81b6ace5.png': logoImg,
  '/src/assets/images/hero_makeup_model_1794755648886.jpg': heroModelImg,
  '/src/assets/images/course_demo_black_women_1794763985917.jpg': courseDemoBlackImg,
  '/src/assets/images/video_poster_black_model_1794763988454.jpg': videoPosterBlackImg,
  '/src/assets/images/gallery_brushes_flatlay_1794755650242.jpg': galleryBrushesImg,
  '/src/assets/images/gallery_glam_portrait_1794755650172.jpg': galleryGlamImg,
  '/src/assets/images/gallery_studio_products_1794755650648.jpg': galleryStudioImg,
  '/assets/aistudio/make1_8992cf44.jpg': make1Img,
  '/assets/aistudio/make2_af253646.jpg': make2Img,
  '/assets/aistudio/make3_440202f1.jpg': make3Img,
  '/assets/aistudio/make4_e11534b6.jpg': make4Img,
  '/assets/aistudio/make5_5d65807e.jpg': make5Img,
  '/assets/aistudio/file_000000002280820a9da949e185a741d6_f38ae8d3.png': dep1Img,
  '/assets/aistudio/file_000000006db081f48863f4b1de35fe95_eef2a88d.png': dep2Img,
  '/assets/aistudio/file_00000000215481f4bf73791eb2355421_6741ead7.png': dep3Img,
  '/assets/aistudio/file_00000000c8a8824387d9698161ef30ec_ce278b3a.png': dep4Img,
  '/assets/aistudio/file_00000000bccc821086c8ab5d6530e718_c37f9ae5.png': dep5Img,
  '/assets/aistudio/Screenshot_20260909-165103_f0e1eba1.png': dep6Img,
};

export function resolveAssetUrl(url: string): string {
  if (!url) return '';
  return ASSET_MAP[url] || url;
}
