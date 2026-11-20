// server.ts
import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { createServer as createViteServer } from "vite";

// src/lib/defaultConfig.ts
var DEFAULT_SITE_CONFIG = {
  courseName: "Universo Maquiagem",
  logoUrl: "/assets/aistudio/file_000000006b7471f4956a18565d37ddfd_81b6ace5.png",
  comparePriceText: "15.000 Kz",
  priceText: "2.500 Kz",
  priceNumeric: 2500,
  currencyCode: "AOA",
  checkoutUrl: "https://pay.kursinha.com/c/6a95ce587f8896e596b31fde",
  whatsappNumber: "244900000000",
  whatsappMessage: "Ol\xE1! Tenho interesse no curso Universo Maquiagem e gostaria de esclarecer algumas d\xFAvidas.",
  supportEmail: "suporte@universomaquiagem.com",
  heroImageUrl: "/src/assets/images/hero_makeup_model_1794755648886.jpg",
  courseImageUrl: "/src/assets/images/course_demo_black_women_1794763985917.jpg",
  videoUrl: "/assets/aistudio/demo_1cd600ca.mp4",
  videoPosterUrl: "/src/assets/images/video_poster_black_model_1794763988454.jpg",
  metaPixelId: "",
  modules: [],
  beforeAfterImages: [
    {
      id: "ba-1",
      url: "/assets/aistudio/make1_8992cf44.jpg",
      caption: "Transforma\xE7\xE3o completa: prepara\xE7\xE3o de pele e acabamento elegante"
    },
    {
      id: "ba-2",
      url: "/assets/aistudio/make2_af253646.jpg",
      caption: "Realce natural dos olhos, ilumina\xE7\xE3o e l\xE1bios definidos"
    },
    {
      id: "ba-3",
      url: "/assets/aistudio/make3_440202f1.jpg",
      caption: "Pele uniforme, contorno suave e olhar marcante"
    },
    {
      id: "ba-4",
      url: "/assets/aistudio/make4_e11534b6.jpg",
      caption: "Maquiagem luminosa com t\xE9cnica profissional passo a passo"
    },
    {
      id: "ba-5",
      url: "/assets/aistudio/make5_5d65807e.jpg",
      caption: "Acabamento impec\xE1vel com harmonia de cores e durabilidade"
    }
  ],
  galleryImages: [
    {
      id: "gal-1",
      url: "/src/assets/images/gallery_brushes_flatlay_1794755650242.jpg",
      caption: "Pinc\xE9is e acabamento profissional"
    },
    {
      id: "gal-2",
      url: "/src/assets/images/gallery_glam_portrait_1794755650172.jpg",
      caption: "Prepara\xE7\xE3o de pele luminosa e natural"
    },
    {
      id: "gal-3",
      url: "/src/assets/images/gallery_studio_products_1794755650648.jpg",
      caption: "Sele\xE7\xE3o de produtos e tonalidades"
    }
  ],
  testimonials: [
    {
      id: "dep-1",
      url: "/assets/aistudio/file_000000002280820a9da949e185a741d6_f38ae8d3.png",
      alt: "Depoimento real de aluna sobre resultados no 2.\xBA dia",
      order: 1
    },
    {
      id: "dep-2",
      url: "/assets/aistudio/file_000000006db081f48863f4b1de35fe95_eef2a88d.png",
      alt: "Depoimento real de aluna ap\xF3s receber o material e aulas em v\xEDdeo",
      order: 2
    },
    {
      id: "dep-3",
      url: "/assets/aistudio/file_00000000215481f4bf73791eb2355421_6741ead7.png",
      alt: "Depoimento real de aluna confirmando acesso \xE0s aulas do curso",
      order: 3
    },
    {
      id: "dep-4",
      url: "/assets/aistudio/file_00000000c8a8824387d9698161ef30ec_ce278b3a.png",
      alt: "Depoimento real de aluna confirmando rece\xE7\xE3o do guia digital",
      order: 4
    },
    {
      id: "dep-5",
      url: "/assets/aistudio/file_00000000bccc821086c8ab5d6530e718_c37f9ae5.png",
      alt: "Depoimento real da aluna Maria Helena ap\xF3s confirma\xE7\xE3o",
      order: 5
    },
    {
      id: "dep-6",
      url: "/assets/aistudio/Screenshot_20260909-165103_f0e1eba1.png",
      alt: "Comprovativo real de envio e confirma\xE7\xE3o de material digital",
      order: 6
    }
  ],
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};

// server.ts
var PORT = 3e3;
var DATA_DIR = path.resolve(process.cwd(), "data");
var CONFIG_FILE = path.join(DATA_DIR, "site-config.json");
var UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Universo2026!";
var TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.createHash("sha256").update(`universo-maquiagem-${ADMIN_PASSWORD}`).digest("hex");
async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}
async function readSiteConfig() {
  try {
    const raw = await fs.readFile(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      modules: Array.isArray(parsed.modules) ? parsed.modules : DEFAULT_SITE_CONFIG.modules,
      beforeAfterImages: Array.isArray(parsed.beforeAfterImages) ? parsed.beforeAfterImages : DEFAULT_SITE_CONFIG.beforeAfterImages,
      galleryImages: Array.isArray(parsed.galleryImages) ? parsed.galleryImages : DEFAULT_SITE_CONFIG.galleryImages,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : DEFAULT_SITE_CONFIG.testimonials
    };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}
async function writeSiteConfig(config) {
  await ensureDirectories();
  const nextConfig = {
    ...config,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await fs.writeFile(CONFIG_FILE, JSON.stringify(nextConfig, null, 2), "utf-8");
  return nextConfig;
}
function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}
function verifyToken(token) {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [body, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    return decoded.role === "admin" && typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Autentica\xE7\xE3o necess\xE1ria." });
    return;
  }
  const token = auth.slice("Bearer ".length).trim();
  if (!verifyToken(token)) {
    res.status(401).json({ error: "Sess\xE3o expirada ou inv\xE1lida." });
    return;
  }
  next();
}
async function startServer() {
  await ensureDirectories();
  const app = express();
  app.use(express.json({ limit: "35mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.get("/api/config", async (_req, res) => {
    const config = await readSiteConfig();
    res.json(config);
  });
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (typeof password !== "string") {
      res.status(400).json({ error: "Informe a palavra-passe." });
      return;
    }
    const inputBuf = Buffer.from(password);
    const expectedBuf = Buffer.from(ADMIN_PASSWORD);
    const matches = inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf);
    if (!matches) {
      res.status(401).json({ error: "Palavra-passe incorreta." });
      return;
    }
    const token = signToken({
      role: "admin",
      exp: Date.now() + 1e3 * 60 * 60 * 24
    });
    res.json({ token });
  });
  app.get("/api/admin/verify", requireAdmin, (_req, res) => {
    res.json({ valid: true });
  });
  app.put("/api/config", requireAdmin, async (req, res) => {
    const incoming = req.body;
    const current = await readSiteConfig();
    const sanitized = {
      courseName: typeof incoming.courseName === "string" && incoming.courseName.trim() ? incoming.courseName.trim() : current.courseName,
      logoUrl: typeof incoming.logoUrl === "string" && incoming.logoUrl.trim() ? incoming.logoUrl.trim() : current.logoUrl,
      comparePriceText: typeof incoming.comparePriceText === "string" ? incoming.comparePriceText.trim() : current.comparePriceText,
      priceText: typeof incoming.priceText === "string" && incoming.priceText.trim() ? incoming.priceText.trim() : current.priceText,
      priceNumeric: typeof incoming.priceNumeric === "number" && Number.isFinite(incoming.priceNumeric) ? incoming.priceNumeric : current.priceNumeric,
      currencyCode: typeof incoming.currencyCode === "string" && incoming.currencyCode.trim() ? incoming.currencyCode.trim().toUpperCase() : current.currencyCode,
      checkoutUrl: typeof incoming.checkoutUrl === "string" ? incoming.checkoutUrl.trim() : current.checkoutUrl,
      whatsappNumber: typeof incoming.whatsappNumber === "string" ? incoming.whatsappNumber.replace(/\D/g, "") : current.whatsappNumber,
      whatsappMessage: typeof incoming.whatsappMessage === "string" ? incoming.whatsappMessage.trim() : current.whatsappMessage,
      supportEmail: typeof incoming.supportEmail === "string" ? incoming.supportEmail.trim() : current.supportEmail,
      heroImageUrl: typeof incoming.heroImageUrl === "string" && incoming.heroImageUrl.trim() ? incoming.heroImageUrl.trim() : current.heroImageUrl,
      courseImageUrl: typeof incoming.courseImageUrl === "string" && incoming.courseImageUrl.trim() ? incoming.courseImageUrl.trim() : current.courseImageUrl,
      videoUrl: typeof incoming.videoUrl === "string" ? incoming.videoUrl.trim() : current.videoUrl,
      videoPosterUrl: typeof incoming.videoPosterUrl === "string" && incoming.videoPosterUrl.trim() ? incoming.videoPosterUrl.trim() : current.videoPosterUrl,
      metaPixelId: typeof incoming.metaPixelId === "string" ? incoming.metaPixelId.replace(/\D/g, "") : current.metaPixelId,
      modules: Array.isArray(incoming.modules) ? incoming.modules : current.modules,
      beforeAfterImages: Array.isArray(incoming.beforeAfterImages) ? incoming.beforeAfterImages : current.beforeAfterImages,
      galleryImages: Array.isArray(incoming.galleryImages) ? incoming.galleryImages : current.galleryImages,
      testimonials: Array.isArray(incoming.testimonials) ? incoming.testimonials : current.testimonials,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await writeSiteConfig(sanitized);
    res.json(saved);
  });
  app.post("/api/admin/upload", requireAdmin, async (req, res) => {
    try {
      const { filename, dataUrl } = req.body;
      if (!filename || !dataUrl || !dataUrl.includes(";base64,")) {
        res.status(400).json({ error: "Ficheiro inv\xE1lido." });
        return;
      }
      const [header, base64Data] = dataUrl.split(";base64,");
      const mime = header.replace("data:", "").toLowerCase();
      const allowedExtMap = {
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "video/mp4": ".mp4",
        "video/webm": ".webm"
      };
      const ext = allowedExtMap[mime];
      if (!ext) {
        res.status(400).json({ error: "Formato n\xE3o suportado. Use JPG, PNG, WebP, MP4 ou WebM." });
        return;
      }
      const base = path.basename(filename, path.extname(filename)).toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 40);
      const uniqueName = `${base || "media"}-${Date.now()}${ext}`;
      const targetPath = path.join(UPLOAD_DIR, uniqueName);
      const buffer = Buffer.from(base64Data, "base64");
      await fs.writeFile(targetPath, buffer);
      res.json({ url: `/uploads/${uniqueName}` });
    } catch {
      res.status(500).json({ error: "N\xE3o foi poss\xEDvel guardar o ficheiro." });
    }
  });
  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use("/assets", express.static(path.resolve(process.cwd(), "public", "assets")));
  app.use("/src/assets/images", express.static(path.resolve(process.cwd(), "src", "assets", "images")));
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Universo Maquiagem server listening on port ${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
