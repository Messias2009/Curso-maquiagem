import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_SITE_CONFIG } from './src/lib/defaultConfig.ts';
import type { SiteConfig } from './src/types/config.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json');
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Universo2026!';
const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET ||
  crypto.createHash('sha256').update(`universo-maquiagem-${ADMIN_PASSWORD}`).digest('hex');

async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

async function readSiteConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      modules: Array.isArray(parsed.modules) ? parsed.modules : DEFAULT_SITE_CONFIG.modules,
      beforeAfterImages: Array.isArray(parsed.beforeAfterImages)
        ? parsed.beforeAfterImages
        : DEFAULT_SITE_CONFIG.beforeAfterImages,
      galleryImages: Array.isArray(parsed.galleryImages)
        ? parsed.galleryImages
        : DEFAULT_SITE_CONFIG.galleryImages,
      testimonials: Array.isArray(parsed.testimonials)
        ? parsed.testimonials
        : DEFAULT_SITE_CONFIG.testimonials,
    };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

async function writeSiteConfig(config: SiteConfig): Promise<SiteConfig> {
  await ensureDirectories();
  const nextConfig: SiteConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(CONFIG_FILE, JSON.stringify(nextConfig, null, 2), 'utf-8');
  return nextConfig;
}

function signToken(payload: { role: string; exp: number }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [body, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Autenticação necessária.' });
    return;
  }
  const token = auth.slice('Bearer '.length).trim();
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Sessão expirada ou inválida.' });
    return;
  }
  next();
}

async function startServer() {
  await ensureDirectories();

  const app = express();
  app.use(express.json({ limit: '35mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/config', async (_req, res) => {
    const config = await readSiteConfig();
    res.json(config);
  });

  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body as { password?: string };
    if (typeof password !== 'string') {
      res.status(400).json({ error: 'Informe a palavra-passe.' });
      return;
    }

    const inputBuf = Buffer.from(password);
    const expectedBuf = Buffer.from(ADMIN_PASSWORD);
    const matches =
      inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf);

    if (!matches) {
      res.status(401).json({ error: 'Palavra-passe incorreta.' });
      return;
    }

    const token = signToken({
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 24,
    });
    res.json({ token });
  });

  app.get('/api/admin/verify', requireAdmin, (_req, res) => {
    res.json({ valid: true });
  });

  app.put('/api/config', requireAdmin, async (req, res) => {
    const incoming = req.body as Partial<SiteConfig>;
    const current = await readSiteConfig();

    const sanitized: SiteConfig = {
      courseName:
        typeof incoming.courseName === 'string' && incoming.courseName.trim()
          ? incoming.courseName.trim()
          : current.courseName,
      logoUrl:
        typeof incoming.logoUrl === 'string' && incoming.logoUrl.trim()
          ? incoming.logoUrl.trim()
          : current.logoUrl,
      comparePriceText:
        typeof incoming.comparePriceText === 'string'
          ? incoming.comparePriceText.trim()
          : current.comparePriceText,
      priceText:
        typeof incoming.priceText === 'string' && incoming.priceText.trim()
          ? incoming.priceText.trim()
          : current.priceText,
      priceNumeric:
        typeof incoming.priceNumeric === 'number' && Number.isFinite(incoming.priceNumeric)
          ? incoming.priceNumeric
          : current.priceNumeric,
      currencyCode:
        typeof incoming.currencyCode === 'string' && incoming.currencyCode.trim()
          ? incoming.currencyCode.trim().toUpperCase()
          : current.currencyCode,
      checkoutUrl:
        typeof incoming.checkoutUrl === 'string' ? incoming.checkoutUrl.trim() : current.checkoutUrl,
      whatsappNumber:
        typeof incoming.whatsappNumber === 'string'
          ? incoming.whatsappNumber.replace(/\D/g, '')
          : current.whatsappNumber,
      whatsappMessage:
        typeof incoming.whatsappMessage === 'string'
          ? incoming.whatsappMessage.trim()
          : current.whatsappMessage,
      supportEmail:
        typeof incoming.supportEmail === 'string'
          ? incoming.supportEmail.trim()
          : current.supportEmail,
      heroImageUrl:
        typeof incoming.heroImageUrl === 'string' && incoming.heroImageUrl.trim()
          ? incoming.heroImageUrl.trim()
          : current.heroImageUrl,
      courseImageUrl:
        typeof incoming.courseImageUrl === 'string' && incoming.courseImageUrl.trim()
          ? incoming.courseImageUrl.trim()
          : current.courseImageUrl,
      videoUrl: typeof incoming.videoUrl === 'string' ? incoming.videoUrl.trim() : current.videoUrl,
      videoPosterUrl:
        typeof incoming.videoPosterUrl === 'string' && incoming.videoPosterUrl.trim()
          ? incoming.videoPosterUrl.trim()
          : current.videoPosterUrl,
      metaPixelId:
        typeof incoming.metaPixelId === 'string'
          ? incoming.metaPixelId.replace(/\D/g, '')
          : current.metaPixelId,
      modules: Array.isArray(incoming.modules) ? incoming.modules : current.modules,
      beforeAfterImages: Array.isArray(incoming.beforeAfterImages)
        ? incoming.beforeAfterImages
        : current.beforeAfterImages,
      galleryImages: Array.isArray(incoming.galleryImages)
        ? incoming.galleryImages
        : current.galleryImages,
      testimonials: Array.isArray(incoming.testimonials)
        ? incoming.testimonials
        : current.testimonials,
      updatedAt: new Date().toISOString(),
    };

    const saved = await writeSiteConfig(sanitized);
    res.json(saved);
  });

  app.post('/api/admin/upload', requireAdmin, async (req, res) => {
    try {
      const { filename, dataUrl } = req.body as { filename?: string; dataUrl?: string };
      if (!filename || !dataUrl || !dataUrl.includes(';base64,')) {
        res.status(400).json({ error: 'Ficheiro inválido.' });
        return;
      }

      const [header, base64Data] = dataUrl.split(';base64,');
      const mime = header.replace('data:', '').toLowerCase();

      const allowedExtMap: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
      };

      const ext = allowedExtMap[mime];
      if (!ext) {
        res.status(400).json({ error: 'Formato não suportado. Use JPG, PNG, WebP, MP4 ou WebM.' });
        return;
      }

      const base = path
        .basename(filename, path.extname(filename))
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .slice(0, 40);
      const uniqueName = `${base || 'media'}-${Date.now()}${ext}`;
      const targetPath = path.join(UPLOAD_DIR, uniqueName);
      const buffer = Buffer.from(base64Data, 'base64');

      await fs.writeFile(targetPath, buffer);
      res.json({ url: `/uploads/${uniqueName}` });
    } catch {
      res.status(500).json({ error: 'Não foi possível guardar o ficheiro.' });
    }
  });

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/assets', express.static(path.resolve(process.cwd(), 'public', 'assets')));
  app.use('/src/assets/images', express.static(path.resolve(process.cwd(), 'src', 'assets', 'images')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Universo Maquiagem server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
