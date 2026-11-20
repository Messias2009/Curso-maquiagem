import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import type { CourseModule, SiteConfig } from '../types/config.ts';
import { SafeImage } from './SafeImage.tsx';

interface AdminPanelProps {
  initialConfig: SiteConfig;
  onConfigSaved: (next: SiteConfig) => void;
}

const TOKEN_STORAGE_KEY = 'um_admin_token';

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Erro ao ler ficheiro'));
    reader.readAsDataURL(file);
  });
}

export function AdminPanel({ initialConfig, onConfigSaved }: AdminPanelProps) {
  const [token, setToken] = useState<string>(() => sessionStorage.getItem(TOKEN_STORAGE_KEY) || '');
  const [verified, setVerified] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [draft, setDraft] = useState<SiteConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    setDraft(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setCheckingAuth(false);
        setVerified(false);
        return;
      }
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          setVerified(true);
        } else {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken('');
          setVerified(false);
        }
      } catch {
        setVerified(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    verify();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        setLoginError('O painel administrativo requer o servidor Node ativo.');
        return;
      }
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setLoginError(data.error || 'Falha ao iniciar sessão.');
        return;
      }
      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setVerified(true);
      setPassword('');
    } catch {
      setLoginError('Erro de ligação ao servidor.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken('');
    setVerified(false);
  };

  const uploadMediaFile = async (file: File, fieldKey: string): Promise<string | null> => {
    setUploadingField(fieldKey);
    setSaveMessage(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        setSaveMessage({
          type: 'error',
          text: 'O envio de ficheiros requer o servidor Node ativo.',
        });
        return null;
      }
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setSaveMessage({
          type: 'error',
          text: data.error || 'Não foi possível enviar o ficheiro.',
        });
        return null;
      }
      return data.url;
    } catch {
      setSaveMessage({ type: 'error', text: 'Erro ao carregar o ficheiro.' });
      return null;
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        setSaveMessage({
          type: 'error',
          text: 'Guardar alterações requer o servidor Node ativo.',
        });
        return;
      }
      const data = (await res.json()) as SiteConfig & { error?: string };
      if (!res.ok) {
        setSaveMessage({ type: 'error', text: data.error || 'Erro ao guardar alterações.' });
        return;
      }
      setDraft(data);
      onConfigSaved(data);
      setSaveMessage({
        type: 'success',
        text: 'Configurações guardadas e publicadas na página de vendas.',
      });
    } catch {
      setSaveMessage({ type: 'error', text: 'Erro de rede ao guardar configurações.' });
    } finally {
      setSaving(false);
    }
  };

  const addModule = () => {
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: `Módulo ${draft.modules.length + 1}`,
      description: '',
      imageUrl: '',
      contents: [],
    };
    setDraft((prev) => ({ ...prev, modules: [...prev.modules, newMod] }));
  };

  const updateModule = (index: number, patch: Partial<CourseModule>) => {
    setDraft((prev) => {
      const next = [...prev.modules];
      next[index] = { ...next[index], ...patch };
      return { ...prev, modules: next };
    });
  };

  const removeModule = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const addGalleryItem = () => {
    setDraft((prev) => ({
      ...prev,
      galleryImages: [
        ...prev.galleryImages,
        { id: `gal-${Date.now()}`, url: '', caption: '' },
      ],
    }));
  };

  const addTestimonialItem = () => {
    setDraft((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          id: `dep-${Date.now()}`,
          url: '',
          alt: `Depoimento real de aluna ${prev.testimonials.length + 1}`,
          order: prev.testimonials.length + 1,
        },
      ],
    }));
  };

  const moveTestimonial = (index: number, direction: -1 | 1) => {
    setDraft((prev) => {
      const sorted = [...prev.testimonials].sort((a, b) => a.order - b.order);
      const target = index + direction;
      if (target < 0 || target >= sorted.length) return prev;
      const temp = sorted[index];
      sorted[index] = sorted[target];
      sorted[target] = temp;
      const reindexed = sorted.map((item, idx) => ({ ...item, order: idx + 1 }));
      return { ...prev, testimonials: reindexed };
    });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FCF9F7] flex items-center justify-center p-6">
        <p className="text-sm text-[#6B5853]">A verificar sessão administrativa...</p>
      </div>
    );
  }

  if (!verified) {
    return (
      <main className="min-h-screen bg-[#FCF9F7] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E7D8D2] shadow-lg p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F6ECE8] text-[#B85D6E] flex items-center justify-center mb-5">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#2A1F1D] mb-2">
            Administração — {initialConfig.courseName}
          </h1>
          <p className="text-sm text-[#5A4743] mb-6 leading-relaxed">
            Área reservada para atualizar o link de checkout, WhatsApp, vídeo, fotografias,
            depoimentos, módulos e Meta Pixel.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-[#2A1F1D] mb-1.5"
              >
                Palavra-passe de acesso
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="Introduza a palavra-passe"
                className="w-full px-4 py-3 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
              />
            </div>

            {loginError && (
              <p className="text-sm text-[#A93245] bg-[#FDF1F3] border border-[#F4C8CF] rounded-xl px-3.5 py-2.5">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 px-5 rounded-xl bg-[#B85D6E] hover:bg-[#9C4959] disabled:opacity-60 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              {loggingIn ? 'A autenticar...' : 'Entrar no Painel'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E7D8D2] text-center">
            <a href="/" className="text-xs font-medium text-[#6B5853] hover:text-[#2A1F1D]">
              Voltar à página de vendas
            </a>
          </div>
        </div>
      </main>
    );
  }

  const sortedTestimonials = [...draft.testimonials].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#FCF9F7] pb-20">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7D8D2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-2xl font-semibold text-[#2A1F1D] truncate">
              Painel Administrativo
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E7D8D2] hover:bg-[#F6ECE8] text-xs font-medium text-[#2A1F1D]"
            >
              <span>Ver Página</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#6B5853] hover:bg-[#F6ECE8] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <form onSubmit={handleSave} className="space-y-8">
          {saveMessage && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                saveMessage.type === 'success'
                  ? 'bg-[#EAF7EE] text-[#1E7E3E] border border-[#BFE6CB]'
                  : 'bg-[#FDF1F3] text-[#A93245] border border-[#F4C8CF]'
              }`}
            >
              {saveMessage.type === 'success' && <Check className="w-4 h-4 shrink-0" />}
              <span>{saveMessage.text}</span>
            </div>
          )}

          {/* 1. Checkout, Preço e Contactos */}
          <section className="bg-white rounded-2xl border border-[#E7D8D2] p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-2xl font-semibold text-[#2A1F1D] border-b border-[#F0E4DF] pb-3">
              1. Checkout, Preço e Contactos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2A1F1D] mb-1.5">
                  Link do Checkout Oficial (todos os botões de compra usam este endereço)
                </label>
                <input
                  type="url"
                  value={draft.checkoutUrl}
                  onChange={(e) => setDraft({ ...draft, checkoutUrl: e.target.value })}
                  placeholder="https://checkout.seudominio.com/universo-maquiagem"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A1F1D] mb-1.5">
                  Preço anterior (Antes)
                </label>
                <input
                  type="text"
                  value={draft.comparePriceText}
                  onChange={(e) => setDraft({ ...draft, comparePriceText: e.target.value })}
                  placeholder="15.000 Kz"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A1F1D] mb-1.5">
                  Preço atual (Agora)
                </label>
                <input
                  type="text"
                  value={draft.priceText}
                  onChange={(e) => setDraft({ ...draft, priceText: e.target.value })}
                  placeholder="2.500 Kz"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A1F1D] mb-1.5">
                  Valor numérico (para Meta Pixel)
                </label>
                <input
                  type="number"
                  value={draft.priceNumeric}
                  onChange={(e) =>
                    setDraft({ ...draft, priceNumeric: Number(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A1F1D] mb-1.5">
                  Número do WhatsApp de Suporte (com indicativo, ex: 2449XXXXXXXX)
                </label>
                <input
                  type="text"
                  value={draft.whatsappNumber}
                  onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })}
                  placeholder="244900000000"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A1F1D] mb-1.5">
                  Email de Suporte
                </label>
                <input
                  type="email"
                  value={draft.supportEmail}
                  onChange={(e) => setDraft({ ...draft, supportEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2A1F1D] mb-1.5">
                  Mensagem automática inicial do WhatsApp
                </label>
                <input
                  type="text"
                  value={draft.whatsappMessage}
                  onChange={(e) => setDraft({ ...draft, whatsappMessage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C4BC] focus:outline-none focus:border-[#B85D6E] text-sm"
                />
              </div>
            </div>
          </section>

          {/* 3. Imagem Principal, Apresentação e Vídeo */}
          <section className="bg-white rounded-2xl border border-[#E7D8D2] p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-2xl font-semibold text-[#2A1F1D] border-b border-[#F0E4DF] pb-3">
              3. Imagem Principal e Vídeo Demonstrativo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#2A1F1D]">
                  Fotografia Principal (Hero)
                </label>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F6ECE8] border border-[#E7D8D2]">
                  <SafeImage
                    src={draft.heroImageUrl}
                    alt="Pré-visualização Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft.heroImageUrl}
                    onChange={(e) => setDraft({ ...draft, heroImageUrl: e.target.value })}
                    placeholder="URL ou caminho da imagem"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D8C4BC] text-xs"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F6ECE8] hover:bg-[#EDE0DA] text-xs font-medium text-[#2A1F1D] cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'hero' ? 'A enviar...' : 'Carregar'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadMediaFile(file, 'hero');
                        if (url) setDraft((prev) => ({ ...prev, heroImageUrl: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Course presentation image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#2A1F1D]">
                  Fotografia de Apresentação do Curso
                </label>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F6ECE8] border border-[#E7D8D2]">
                  <SafeImage
                    src={draft.courseImageUrl}
                    alt="Pré-visualização Curso"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft.courseImageUrl}
                    onChange={(e) => setDraft({ ...draft, courseImageUrl: e.target.value })}
                    placeholder="URL ou caminho da imagem"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D8C4BC] text-xs"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F6ECE8] hover:bg-[#EDE0DA] text-xs font-medium text-[#2A1F1D] cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'course' ? 'A enviar...' : 'Carregar'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadMediaFile(file, 'course');
                        if (url) setDraft((prev) => ({ ...prev, courseImageUrl: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Video cover & video URL */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#2A1F1D]">
                  Capa Personalizada do Vídeo
                </label>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#F6ECE8] border border-[#E7D8D2]">
                  <SafeImage
                    src={draft.videoPosterUrl}
                    alt="Capa do vídeo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft.videoPosterUrl}
                    onChange={(e) => setDraft({ ...draft, videoPosterUrl: e.target.value })}
                    placeholder="URL da imagem de capa"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D8C4BC] text-xs"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F6ECE8] hover:bg-[#EDE0DA] text-xs font-medium text-[#2A1F1D] cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'poster' ? 'A enviar...' : 'Carregar'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadMediaFile(file, 'poster');
                        if (url) setDraft((prev) => ({ ...prev, videoPosterUrl: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#2A1F1D]">
                  Vídeo Demonstrativo (Ficheiro MP4/WebM ou Link YouTube/Vimeo/Drive)
                </label>
                <div className="aspect-video rounded-xl bg-[#2A1F1D] text-white flex flex-col items-center justify-center p-4 text-center">
                  <Video className="w-8 h-8 text-[#D6B07A] mb-2" />
                  <span className="text-xs text-[#E6D8D4] break-all">
                    {draft.videoUrl || 'Nenhum vídeo configurado ainda'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft.videoUrl}
                    onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
                    placeholder="https://... ou /uploads/video.mp4"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D8C4BC] text-xs"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F6ECE8] hover:bg-[#EDE0DA] text-xs font-medium text-[#2A1F1D] cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'video' ? 'A enviar...' : 'MP4'}</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadMediaFile(file, 'video');
                        if (url) setDraft((prev) => ({ ...prev, videoUrl: url }));
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Módulos do Curso */}
          <section className="bg-white rounded-2xl border border-[#E7D8D2] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-[#F0E4DF] pb-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#2A1F1D]">
                  4. Módulos Reais do Curso
                </h2>
                <p className="text-xs text-[#6B5853] mt-0.5">
                  Adicione apenas os módulos e conteúdos reais do Universo Maquiagem.
                </p>
              </div>
              <button
                type="button"
                onClick={addModule}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B85D6E] hover:bg-[#9C4959] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Módulo</span>
              </button>
            </div>

            {draft.modules.length === 0 ? (
              <p className="text-sm text-[#6B5853] bg-[#F6ECE8]/60 rounded-xl p-5 text-center">
                Nenhum módulo configurado. Enquanto estiver vazio, a página apresenta os espaços
                reservados estruturados.
              </p>
            ) : (
              <div className="space-y-5">
                {draft.modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    className="rounded-xl border border-[#E7D8D2] p-5 space-y-4 bg-[#FCF9F7]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#9E7840]">
                        Módulo {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeModule(idx)}
                        className="inline-flex items-center gap-1 text-xs text-[#A93245] hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remover
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#2A1F1D] mb-1">
                          Nome do módulo
                        </label>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => updateModule(idx, { title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#D8C4BC] bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#2A1F1D] mb-1">
                          Fotografia ilustrativa
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={mod.imageUrl}
                            onChange={(e) => updateModule(idx, { imageUrl: e.target.value })}
                            placeholder="URL ou enviar imagem"
                            className="flex-1 px-3 py-2 rounded-lg border border-[#D8C4BC] bg-white text-xs"
                          />
                          <label className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F6ECE8] text-xs font-medium cursor-pointer shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Enviar</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = await uploadMediaFile(file, `mod-${idx}`);
                                if (url) updateModule(idx, { imageUrl: url });
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-[#2A1F1D] mb-1">
                          Descrição
                        </label>
                        <textarea
                          rows={2}
                          value={mod.description}
                          onChange={(e) => updateModule(idx, { description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#D8C4BC] bg-white text-sm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-[#2A1F1D] mb-1">
                          Lista de conteúdos (um item por linha)
                        </label>
                        <textarea
                          rows={3}
                          value={mod.contents.join('\n')}
                          onChange={(e) =>
                            updateModule(idx, {
                              contents: e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Aula 1: ..."
                          className="w-full px-3 py-2 rounded-lg border border-[#D8C4BC] bg-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 5. Fotos de Antes e Depois */}
          <section className="bg-white rounded-2xl border border-[#E7D8D2] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-[#F0E4DF] pb-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#2A1F1D]">
                  5. Imagens de Antes e Depois
                </h2>
                <p className="text-xs text-[#6B5853] mt-0.5">
                  Transformações reais exibidas na secção de resultados.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    beforeAfterImages: [
                      ...prev.beforeAfterImages,
                      { id: `ba-${Date.now()}`, url: '', caption: 'Antes & Depois' },
                    ],
                  }))
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C21F5E] hover:bg-[#9F164B] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Antes & Depois</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {draft.beforeAfterImages.map((img, idx) => (
                <div
                  key={img.id}
                  className="rounded-xl border border-[#E7D8D2] p-4 bg-[#FCF9F7] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B5853]">
                      Transformação {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          beforeAfterImages: prev.beforeAfterImages.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-xs text-[#A93245] hover:underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#FDF3F6]">
                    <SafeImage src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => {
                        const next = [...draft.beforeAfterImages];
                        next[idx] = { ...next[idx], url: e.target.value };
                        setDraft({ ...draft, beforeAfterImages: next });
                      }}
                      placeholder="URL da foto"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#D8C4BC] bg-white text-xs"
                    />
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FDF3F6] text-xs font-medium cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Enviar</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadMediaFile(file, `ba-${idx}`);
                          if (url) {
                            const next = [...draft.beforeAfterImages];
                            next[idx] = { ...next[idx], url };
                            setDraft({ ...draft, beforeAfterImages: next });
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => {
                      const next = [...draft.beforeAfterImages];
                      next[idx] = { ...next[idx], caption: e.target.value };
                      setDraft({ ...draft, beforeAfterImages: next });
                    }}
                    placeholder="Legenda"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D8C4BC] bg-white text-xs"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 6. Galeria Visual */}
          <section className="bg-white rounded-2xl border border-[#E7D8D2] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-[#F0E4DF] pb-3">
              <h2 className="font-display text-2xl font-semibold text-[#2A1F1D]">
                6. Fotografias da Galeria
              </h2>
              <button
                type="button"
                onClick={addGalleryItem}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C21F5E] hover:bg-[#9F164B] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Foto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draft.galleryImages.map((img, idx) => (
                <div
                  key={img.id}
                  className="rounded-xl border border-[#E7D8D2] p-4 bg-[#FCF9F7] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B5853] inline-flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Foto {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-xs text-[#A93245] hover:underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F6ECE8]">
                    <SafeImage src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => {
                        const next = [...draft.galleryImages];
                        next[idx] = { ...next[idx], url: e.target.value };
                        setDraft({ ...draft, galleryImages: next });
                      }}
                      placeholder="URL da foto"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#D8C4BC] bg-white text-xs"
                    />
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F6ECE8] text-xs font-medium cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Enviar</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadMediaFile(file, `gal-${idx}`);
                          if (url) {
                            const next = [...draft.galleryImages];
                            next[idx] = { ...next[idx], url };
                            setDraft({ ...draft, galleryImages: next });
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => {
                      const next = [...draft.galleryImages];
                      next[idx] = { ...next[idx], caption: e.target.value };
                      setDraft({ ...draft, galleryImages: next });
                    }}
                    placeholder="Legenda da fotografia"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D8C4BC] bg-white text-xs"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 7. Imagens dos Depoimentos */}
          <section className="bg-white rounded-2xl border border-[#E7D8D2] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-[#F0E4DF] pb-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#2A1F1D]">
                  7. Imagens dos Depoimentos Reais
                </h2>
                <p className="text-xs text-[#6B5853] mt-0.5">
                  Carregue, ordene ou remova capturas de ecrã reais das suas alunas.
                </p>
              </div>
              <button
                type="button"
                onClick={addTestimonialItem}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C21F5E] hover:bg-[#9F164B] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Depoimento</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTestimonials.map((dep, idx) => (
                <div
                  key={dep.id}
                  className="rounded-xl border border-[#E7D8D2] p-4 bg-[#FCF9F7] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#6B5853] tabular-nums">
                      Ordem #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveTestimonial(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Mover para cima"
                        className="p-1.5 rounded hover:bg-[#EFE1DC] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTestimonial(idx, 1)}
                        disabled={idx === sortedTestimonials.length - 1}
                        aria-label="Mover para baixo"
                        className="p-1.5 rounded hover:bg-[#EFE1DC] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials
                              .filter((item) => item.id !== dep.id)
                              .map((item, newIdx) => ({ ...item, order: newIdx + 1 })),
                          }))
                        }
                        aria-label="Remover depoimento"
                        className="p-1.5 rounded text-[#A93245] hover:bg-[#FDF1F3] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#1D1B1A]">
                    <SafeImage
                      src={dep.url}
                      alt={dep.alt}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dep.url}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          testimonials: prev.testimonials.map((t) =>
                            t.id === dep.id ? { ...t, url: e.target.value } : t,
                          ),
                        }))
                      }
                      placeholder="URL da imagem"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#D8C4BC] bg-white text-xs"
                    />
                    <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6ECE8] text-xs font-medium cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Enviar</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadMediaFile(file, `dep-${dep.id}`);
                          if (url) {
                            setDraft((prev) => ({
                              ...prev,
                              testimonials: prev.testimonials.map((t) =>
                                t.id === dep.id ? { ...t, url } : t,
                              ),
                            }));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="sticky bottom-4 z-20 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#B85D6E] hover:bg-[#9C4959] disabled:opacity-60 text-white font-semibold shadow-xl cursor-pointer transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'A guardar...' : 'Guardar Todas as Configurações'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
