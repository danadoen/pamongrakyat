
import { Article, ArticleCategory, Page, User, AppSettings, BannerAd } from '../types';
import { supabase } from './supabaseClient';

// --- MOCK DATA ---
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Perda Transparansi Anggaran Disahkan, APBD Kini Bisa Diakses Publik',
    slug: 'perda-transparansi-anggaran',
    summary: 'DPRD dan Pemda sepakat membuka akses detail APBD via digital. Langkah besar menuju pemerintahan bersih.',
    content: '<p><strong>KOTA PAMONG</strong> - Setelah perdebatan panjang selama dua bulan, Peraturan Daerah mengenai Keterbukaan Informasi Publik sektor Keuangan akhirnya diketok palu. "Masyarakat berhak tahu setiap rupiah pajak mereka," ujar Ketua Pansus.</p><h3>Langkah Maju Reformasi</h3><p>Portal open data akan segera diluncurkan bulan depan. Dalam portal tersebut, masyarakat dapat melihat alokasi daya mulai dari tingkat kelurahan hingga dinas provinsi.</p><p>Pengamat kebijakan publik menilai ini adalah langkah revolusioner yang sudah lama dinantikan.</p>',
    category: ArticleCategory.POLITIK,
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800',
    additionalImageUrls: [],
    author: 'Redaksi Pamong',
    createdAt: new Date().toISOString(),
    isBreaking: true,
    views: 1204
  },
  {
    id: '2',
    title: 'Antrean BPJS Membludak, RSUD Janjikan Sistem Online Baru',
    slug: 'antrean-bpjs-membludak',
    summary: 'Warga mengeluh harus datang sejak subuh. Direktur RSUD jamin aplikasi pendaftaran rampung minggu ini.',
    content: '<p>Pelayanan kesehatan kembali menjadi sorotan. Ratusan pasien BPJS terlihat mengantre hingga ke area parkir RSUD sejak pukul 04.00 WIB. Ombudsman Daerah mendesak perbaikan sistem segera.</p><p>Pihak rumah sakit mengklaim sedang migrasi ke sistem antrean digital terintegrasi JKN Mobile. "Kami mohon maaf atas ketidaknyamanan ini selama masa transisi," ungkap Humas RSUD.</p>',
    category: ArticleCategory.PELAYANAN,
    imageUrl: 'https://images.unsplash.com/photo-1538108190963-8472854f21f9?auto=format&fit=crop&q=80&w=800',
    additionalImageUrls: [],
    author: 'Budi Santoso',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isBreaking: false,
    views: 850
  }
];

const MOCK_PAGES: Page[] = [
  { id: '1', title: 'Tentang Kami', slug: 'tentang-kami', content: '<h1>PamongRakyat</h1><p>Media independen yang berpihak pada kebenaran.</p>', isActive: true, showInNavbar: false, showInFooter: true },
  { id: '2', title: 'Redaksi', slug: 'redaksi', content: '<h1>Susunan Redaksi</h1><p>Pemimpin Redaksi: J. Doe</p>', isActive: true, showInNavbar: false, showInFooter: true }
];

const MOCK_USERS: User[] = [
  { id: '1', name: 'Administrator', email: 'admin@pamong.id', role: 'admin', avatarUrl: 'https://ui-avatars.com/api/?name=Admin' }
];

const MOCK_BANNERS: BannerAd[] = [
  { id: '1', title: 'Iklan Layanan Masyarakat', imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800', linkUrl: '#', position: 'home_middle', isActive: true }
];

const DEFAULT_SETTINGS: AppSettings = {
  siteName: 'PamongRakyat',
  siteDescription: 'Suara Hati Nurani Rakyat',
  showAds: true,
  maintenanceMode: false,
  breakingNewsSpeed: 30,
  tinymceApiKey: 'ib4xq52eiioizp66vv4dkknyj85bv3iqv9adxepq00vkzbxw',
  aiSystemInstruction: 'Anda adalah redaktur senior portal berita PamongRakyat. Gaya bahasa Anda adalah jurnalisme investigasi yang tajam, kritis, namun tetap objektif dan menggunakan Bahasa Indonesia yang baku dan elegan.',
  socialFacebook: 'https://facebook.com',
  socialTwitter: 'https://twitter.com',
  socialInstagram: 'https://instagram.com',
  contactAddress: 'Gedung Pers, Lt. 3\nJl. Kemerdekaan No. 45\nJakarta Pusat, 10110',
  contactEmail: 'redaksi@pamongrakyat.id',
  contactPhone: '+62 21 555-0199'
};

// --- HELPERS ---
const getStorage = <T>(key: string, def: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : def;
};

const setStorage = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const supabaseRequest = async <T>(request: Promise<{data: T | null, error: any}>): Promise<T | null> => {
    try {
        const { data, error } = await request;
        if (error) {
            if (error.message?.includes('Load failed') || error.message?.includes('fetch')) {
                return null;
            }
            console.error("Supabase Error:", error);
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
};

// --- ARTICLES ---
export const fetchArticles = async (): Promise<Article[]> => {
  const data = await supabaseRequest(supabase.from('articles').select('*').order('createdAt', { ascending: false }));
  if (data && (data as any).length > 0) return data as any;
  const articles = getStorage('pamong_articles', MOCK_ARTICLES);
  return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  const data = await supabaseRequest(supabase.from('articles').select('*').eq('slug', slug).single());
  if (data) return data as any;
  return getStorage('pamong_articles', MOCK_ARTICLES).find(a => a.slug === slug);
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  if (isUuid(id)) {
    const data = await supabaseRequest(supabase.from('articles').select('*').eq('id', id).single());
    if (data) return data as any;
  }
  return getStorage('pamong_articles', MOCK_ARTICLES).find(a => a.id === id);
};

export const createArticle = async (article: Omit<Article, 'id' | 'createdAt' | 'views'>): Promise<Article> => {
  const finalSlug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 5);
  const payload = { ...article, slug: finalSlug, createdAt: new Date().toISOString(), views: 0 };

  const data = await supabaseRequest(supabase.from('articles').insert([payload]).select().single());
  if (data) return data as Article;

  const newArticle = { ...payload, id: Math.random().toString(36).substr(2, 9) } as Article;
  const current = getStorage('pamong_articles', MOCK_ARTICLES);
  setStorage('pamong_articles', [newArticle, ...current]);
  return newArticle;
};

export const updateArticle = async (article: Article): Promise<void> => {
  if (isUuid(article.id)) {
    const { id, ...updates } = article;
    const { error } = await supabase.from('articles').update(updates).eq('id', id);
    if (!error) return;
  }
  const current = getStorage('pamong_articles', MOCK_ARTICLES);
  const updated = current.map(a => a.id === article.id ? article : a);
  setStorage('pamong_articles', updated);
};

export const deleteArticle = async (id: string): Promise<void> => {
    if (isUuid(id)) {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (!error) return;
    }
    const current = getStorage('pamong_articles', MOCK_ARTICLES);
    setStorage('pamong_articles', current.filter(a => a.id !== id));
};

// --- PAGES ---
export const fetchPages = async (): Promise<Page[]> => {
  const data = await supabaseRequest(supabase.from('pages').select('*'));
  if (data && (data as any).length > 0) return data as any;
  return getStorage('pamong_pages', MOCK_PAGES);
};

export const getPageById = async (id: string): Promise<Page | undefined> => {
  if (isUuid(id)) {
    const data = await supabaseRequest(supabase.from('pages').select('*').eq('id', id).single());
    if (data) return data as any;
  }
  return getStorage('pamong_pages', MOCK_PAGES).find(p => p.id === id);
};

export const getPageBySlug = async (slug: string): Promise<Page | undefined> => {
  const data = await supabaseRequest(supabase.from('pages').select('*').eq('slug', slug).single());
  if (data) return data as any;
  return (await fetchPages()).find(p => p.slug === slug);
};

export const savePage = async (page: Omit<Page, 'id'> & { id?: string }): Promise<void> => {
  const payload = { ...page, showInFooter: page.showInFooter ?? true, showInNavbar: page.showInNavbar ?? false };
  if (page.id && isUuid(page.id)) {
      const { id, ...updates } = payload;
      const { error } = await supabase.from('pages').update(updates).eq('id', id);
      if (!error) return;
  } else {
      const { id, ...insertPayload } = payload;
      const { error } = await supabase.from('pages').insert(insertPayload);
      if (!error) return;
  }
  let pages = getStorage('pamong_pages', MOCK_PAGES);
  if (page.id) {
    pages = pages.map(p => p.id === page.id ? { ...p, ...payload } as Page : p);
  } else {
    pages.push({ ...payload, id: Math.random().toString(36).substr(2, 9) } as Page);
  }
  setStorage('pamong_pages', pages);
};

export const deletePage = async (id: string): Promise<void> => {
  if (isUuid(id)) await supabase.from('pages').delete().eq('id', id);
  setStorage('pamong_pages', getStorage('pamong_pages', MOCK_PAGES).filter(p => p.id !== id));
};

// --- BANNERS ---
export const fetchBanners = async (): Promise<BannerAd[]> => {
    const data = await supabaseRequest(supabase.from('banners').select('*'));
    return (data && (data as any).length > 0) ? data as any : getStorage('pamong_banners', MOCK_BANNERS);
};

export const saveBanner = async (banner: BannerAd): Promise<void> => {
    if (banner.id && isUuid(banner.id)) await supabase.from('banners').update(banner).eq('id', banner.id);
    else await supabase.from('banners').insert([banner]);
    
    let banners = getStorage('pamong_banners', MOCK_BANNERS);
    const exists = banners.find(b => b.id === banner.id);
    if(exists) banners = banners.map(b => b.id === banner.id ? banner : b);
    else banners.push({ ...banner, id: Math.random().toString(36).substr(2, 9) });
    setStorage('pamong_banners', banners);
};

export const deleteBanner = async (id: string): Promise<void> => {
    if (isUuid(id)) await supabase.from('banners').delete().eq('id', id);
    setStorage('pamong_banners', (await fetchBanners()).filter(b => b.id !== id));
};

// --- USERS ---
export const fetchUsers = async (): Promise<User[]> => {
  const data = await supabaseRequest(supabase.from('users').select('*'));
  return (data && (data as any).length > 0) ? data as any : getStorage('pamong_users', MOCK_USERS);
};

export const saveUser = async (user: User): Promise<void> => {
  if (user.id && isUuid(user.id)) await supabase.from('users').update(user).eq('id', user.id);
  else await supabase.from('users').insert([user]);
  
  let users = await fetchUsers();
  const exists = users.find(u => u.id === user.id);
  if (exists) users = users.map(u => u.id === user.id ? user : u);
  else users.push({...user, id: Math.random().toString(36).substr(2, 9)});
  setStorage('pamong_users', users);
};

export const deleteUser = async (id: string): Promise<void> => {
   if(isUuid(id)) await supabase.from('users').delete().eq('id', id);
   setStorage('pamong_users', (await fetchUsers()).filter(u => u.id !== id));
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const users = await fetchUsers();
  const user = users.find(u => u.email === email);
  if (user && (password === 'admin123' || password === 'editor123')) return user;
  if (email === 'admin@pamong.id' && password === 'admin123') return { id: 'admin', name: 'Super Admin', email, role: 'admin' };
  return null;
};

// --- SETTINGS ---
export const fetchSettings = async (): Promise<AppSettings> => {
   const data = await supabaseRequest(supabase.from('settings').select('*').single());
   if (data) return { ...DEFAULT_SETTINGS, ...(data as any) };
   return getStorage('pamong_settings', DEFAULT_SETTINGS);
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
   try {
      await supabase.from('settings').upsert({ id: 1, ...settings });
   } catch (err) {}
   setStorage('pamong_settings', settings);
};
