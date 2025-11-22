
import { Article, ArticleCategory, Page, User, AppSettings, BannerAd } from '../types';
import { supabase } from './supabaseClient';

// --- MOCK DATA ---
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Perda Transparansi Anggaran Disahkan, APBD Kini Bisa Diakses Publik',
    slug: 'perda-transparansi-anggaran',
    summary: 'DPRD dan Pemda sepakat membuka akses detail APBD via digital. Langkah besar menuju pemerintahan bersih.',
    content: '<p><strong>KOTA PAMONG</strong> - Setelah perdebatan panjang selama dua bulan, Peraturan Daerah mengenai Keterbukaan Informasi Publik sektor Keuangan akhirnya diketok palu. "Masyarakat berhak tahu setiap rupiah pajak mereka," ujar Ketua Pansus.</p><h3>Langkah Maju Reformasi</h3><p>Portal open data akan segera diluncurkan bulan depan. Dalam portal tersebut, masyarakat dapat melihat alokasi dana mulai dari tingkat kelurahan hingga dinas provinsi.</p><p>Pengamat kebijakan publik menilai ini adalah langkah revolusioner yang sudah lama dinantikan.</p>',
    category: ArticleCategory.POLITIK,
    imageUrl: 'https://picsum.photos/800/400?random=1',
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
    imageUrl: 'https://picsum.photos/800/400?random=2',
    additionalImageUrls: ['https://picsum.photos/800/400?random=12'],
    author: 'Budi Santoso',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isBreaking: false,
    views: 850
  },
  {
    id: '3',
    title: 'Festival Topeng Nusantara Pukau Wisatawan Asing',
    slug: 'festival-topeng-nusantara',
    summary: 'Menghidupkan kembali roh budaya leluhur di tengah gempuran modernisasi.',
    content: '<p>Alun-alun kota berubah menjadi lautan manusia saat Festival Topeng digelar. Delegasi dari 15 provinsi turut serta. Dinas Pariwisata mencatat kenaikan okupansi hotel sebesar 85% selama akhir pekan ini.</p><blockquote>"Ini bukan sekadar tontonan, tapi tuntunan nilai luhur," ujar Budayawan lokal.</blockquote><p>Acara ditutup dengan tarian kolosal yang melibatkan 500 penari muda.</p>',
    category: ArticleCategory.BUDAYA,
    imageUrl: 'https://picsum.photos/800/400?random=3',
    additionalImageUrls: [],
    author: 'Siti Aminah',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isBreaking: false,
    views: 2300
  },
  {
      id: '4',
      title: 'Vonis Bebas Terdakwa Korupsi Picu Aksi Mahasiswa',
      slug: 'vonis-bebas-korupsi',
      summary: 'Aliansi BEM se-Daerah gelar aksi diam di depan Pengadilan Negeri menuntut eksaminasi putusan.',
      content: '<p>Putusan sela yang membebaskan terdakwa kasus pengadaan lahan memicu reaksi keras. Pakar hukum menilai ada kejanggalan dalam pertimbangan hakim.</p><h3>Tuntutan Mahasiswa</h3><p>Mahasiswa menuntut Komisi Yudisial turun tangan memeriksa majelis hakim terkait. Aksi berjalan damai dengan penjagaan ketat aparat kepolisian.</p>',
      category: ArticleCategory.HUKUM,
      imageUrl: 'https://picsum.photos/800/400?random=4',
      additionalImageUrls: [],
      author: 'Investigasi Pamong',
      createdAt: new Date(Date.now() - 200000).toISOString(), 
      isBreaking: false,
      views: 543
  },
  {
    id: '5',
    title: 'UMKM Keripik Singkong Tembus Pasar Ekspor',
    slug: 'umkm-ekspor',
    summary: 'Berawal dari industri rumahan, kini omzet mencapai ratusan juta berkat pendampingan dinas.',
    content: '<p>Kisah inspiratif datang dari Desa Sukamaju. Kelompok Wanita Tani berhasil mengemas keripik singkong dengan standar internasional.</p><p>"Kuncinya ada di higienitas dan kemasan," ujar Bu Rahmi, ketua kelompok. Kini produk mereka telah dikirim ke Malaysia dan Singapura.</p>',
    category: ArticleCategory.EKONOMI,
    imageUrl: 'https://picsum.photos/800/400?random=5',
    additionalImageUrls: [],
    author: 'Dewi Persik',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    isBreaking: false,
    views: 300
  }
];

const MOCK_PAGES: Page[] = [
  { id: '1', title: 'Tentang Kami', slug: 'tentang-kami', content: '<h1>PamongRakyat</h1><p>Media independen yang berpihak pada kebenaran.</p>', isActive: true, showInNavbar: false, showInFooter: true },
  { id: '2', title: 'Redaksi', slug: 'redaksi', content: '<h1>Susunan Redaksi</h1><p>Pemimpin Redaksi: J. Doe</p>', isActive: true, showInNavbar: false, showInFooter: true },
  { id: '3', title: 'Pedoman Media Siber', slug: 'pedoman', content: '<p>Mengacu pada dewan pers...</p>', isActive: true, showInNavbar: false, showInFooter: true }
];

const MOCK_USERS: User[] = [
  { id: '1', name: 'Administrator', email: 'admin@pamong.id', role: 'admin', avatarUrl: 'https://ui-avatars.com/api/?name=Admin' },
  { id: '2', name: 'Editor Senior', email: 'editor@pamong.id', role: 'editor', avatarUrl: 'https://ui-avatars.com/api/?name=Editor' }
];

const MOCK_BANNERS: BannerAd[] = [
  { 
    id: '1', 
    title: 'Kopi Senja', 
    imageUrl: 'https://picsum.photos/800/200?grayscale', 
    linkUrl: '#', 
    position: 'home_middle', 
    isActive: true 
  },
  { 
    id: '2', 
    title: 'Rumah Makan Sederhana', 
    imageUrl: 'https://picsum.photos/300/600?grayscale', 
    linkUrl: '#', 
    position: 'sidebar_right', 
    isActive: true 
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  siteName: 'PamongRakyat',
  siteDescription: 'Suara Hati Nurani Rakyat',
  showAds: true,
  maintenanceMode: false,
  breakingNewsSpeed: 30,
  googleApiKey: '',
  tinymceApiKey: 'ib4xq52eiioizp66vv4dkknyj85bv3iqv9adxepq00vkzbxw', // Default backup key
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

// Helper to validate UUID to prevent crashing Postgres
const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// --- ARTICLES ---
export const fetchArticles = async (): Promise<Article[]> => {
  if (supabase) {
    // Try fetching from Supabase
    const { data, error } = await supabase.from('articles').select('*').order('createdAt', { ascending: false });
    
    if (!error && data) {
      return data as any;
    }
    
    // Only fallback if table doesn't exist or connection error, 
    // NOT if data is empty (because maybe it IS empty)
    if (error && error.message.includes('relation "articles" does not exist')) {
      console.warn("Tabel 'articles' tidak ditemukan. Menggunakan Mock Data lokal.");
      const articles = getStorage('pamong_articles', MOCK_ARTICLES);
      return articles.sort((a: Article, b: Article) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    if (error) {
      console.error("Supabase Error (fetchArticles):", JSON.stringify(error, null, 2));
    }
  }
  
  // Fallback if Supabase not connected or errored
  const articles = getStorage('pamong_articles', MOCK_ARTICLES);
  return articles.sort((a: Article, b: Article) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  if (supabase) {
     const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
     if (!error && data) return data as any;
     if (error) console.error("Supabase Error (getArticleBySlug):", JSON.stringify(error, null, 2));
  }
  const articles = getStorage('pamong_articles', MOCK_ARTICLES);
  return articles.find(a => a.slug === slug);
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  if (supabase && isUuid(id)) {
     const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
     if (!error && data) return data as any;
     if (error) console.error("Supabase Error (getArticleById):", JSON.stringify(error, null, 2));
  }
  const articles = getStorage('pamong_articles', MOCK_ARTICLES);
  return articles.find(a => a.id === id);
};

export const createArticle = async (article: Omit<Article, 'id' | 'createdAt' | 'views'>): Promise<Article> => {
  // Prepare payload with timestamps
  // Ensure slug is unique by appending random string if needed
  const finalSlug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 5);

  const payload = {
    ...article,
    slug: finalSlug,
    createdAt: new Date().toISOString(),
    views: 0
  };

  if (supabase) {
    // IMPORTANT: When using Supabase, DO NOT generate ID locally if using UUID in DB.
    const { data, error } = await supabase
        .from('articles')
        .insert([payload])
        .select()
        .single();

    if (error) {
        console.error("Create Article Error:", JSON.stringify(error, null, 2));
        throw new Error(error.message || JSON.stringify(error));
    }
    return data as Article;
  } else {
    // Fallback for LocalStorage
    const newArticle: Article = {
        ...payload,
        id: Math.random().toString(36).substr(2, 9)
    };
    const current = getStorage('pamong_articles', MOCK_ARTICLES);
    setStorage('pamong_articles', [newArticle, ...current]);
    return newArticle;
  }
};

export const updateArticle = async (article: Article): Promise<void> => {
  if (supabase && isUuid(article.id)) {
    const { id, ...updates } = article;
    const { error } = await supabase.from('articles').update(updates).eq('id', id);
    if (error) {
        console.error("Update Article Error:", JSON.stringify(error, null, 2));
        throw new Error(error.message || JSON.stringify(error));
    }
  } else {
    const current = getStorage('pamong_articles', MOCK_ARTICLES);
    const updated = current.map(a => a.id === article.id ? article : a);
    setStorage('pamong_articles', updated);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
    if(supabase) {
        // Check if ID is valid UUID. If not, it might be a legacy Mock Item from local storage.
        // We cannot delete a non-UUID from Postgres UUID column, it throws error.
        if (!isUuid(id)) {
             console.warn(`ID ${id} bukan UUID valid. Menghapus dari local storage saja.`);
             const current = getStorage('pamong_articles', MOCK_ARTICLES);
             setStorage('pamong_articles', current.filter(a => a.id !== id));
             return;
        }

        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) {
            console.error("Delete Article Error:", JSON.stringify(error, null, 2));
            throw new Error(error.message || JSON.stringify(error));
        }
    } else {
        const current = getStorage('pamong_articles', MOCK_ARTICLES);
        setStorage('pamong_articles', current.filter(a => a.id !== id));
    }
};

// --- PAGES ---
export const fetchPages = async (): Promise<Page[]> => {
  if (supabase) {
    const { data, error } = await supabase.from('pages').select('*');
    if (data) return data as any;
    if (error) console.error("Supabase Error (fetchPages):", JSON.stringify(error, null, 2));
  }
  return getStorage('pamong_pages', MOCK_PAGES);
};

export const getPageById = async (id: string): Promise<Page | undefined> => {
  if (supabase && isUuid(id)) {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single();
    if (!error && data) return data as any;
    if (error) console.error("Supabase Error (getPageById):", JSON.stringify(error, null, 2));
  }
  const pages = getStorage('pamong_pages', MOCK_PAGES);
  return pages.find(p => p.id === id);
}

export const getPageBySlug = async (slug: string): Promise<Page | undefined> => {
  if (supabase) {
    const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
    if (!error && data) return data as any;
  }
  const pages = await fetchPages();
  return pages.find(p => p.slug === slug);
};

export const savePage = async (page: Omit<Page, 'id'> & { id?: string }): Promise<void> => {
  const payload = {
      ...page,
      showInFooter: page.showInFooter ?? true,
      showInNavbar: page.showInNavbar ?? false
  };

  if(supabase) {
      try {
          if(page.id && isUuid(page.id)) {
              const { id, ...updates } = payload;
              const { error } = await supabase.from('pages').update(updates).eq('id', id);
              if(error) throw error;
          } else {
               // eslint-disable-next-line @typescript-eslint/no-unused-vars
               const { id, ...insertPayload } = payload; 
               const { error } = await supabase.from('pages').insert(insertPayload);
               if(error) throw error;
          }
      } catch (err: any) {
          const msg = err.message || JSON.stringify(err);
          if (msg.includes('column') || msg.includes('schema')) {
               console.warn("⚠️ Schema Mismatch (savePage): Retrying save without new columns.");
               // eslint-disable-next-line @typescript-eslint/no-unused-vars
               const { showInFooter, showInNavbar, ...safePayload } = payload;
               if(page.id && isUuid(page.id)) {
                   // eslint-disable-next-line @typescript-eslint/no-unused-vars
                   const { id, ...updates } = safePayload;
                   const { error } = await supabase.from('pages').update(updates).eq('id', id);
                   if(error) throw new Error(error.message);
               } else {
                   // eslint-disable-next-line @typescript-eslint/no-unused-vars
                   const { id, ...insertSafePayload } = safePayload;
                   const { error } = await supabase.from('pages').insert(insertSafePayload);
                   if(error) throw new Error(error.message);
               }
               return;
          }
          throw new Error(msg);
      }
      return;
  }

  let pages = getStorage('pamong_pages', MOCK_PAGES);
  if (page.id) {
    pages = pages.map(p => p.id === page.id ? { ...p, ...payload } as Page : p);
  } else {
    const newPage = { ...payload, id: Math.random().toString(36).substr(2, 9) } as Page;
    pages.push(newPage);
  }
  setStorage('pamong_pages', pages);
};

export const deletePage = async (id: string): Promise<void> => {
  if (supabase && isUuid(id)) {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if(error) throw new Error(error.message || JSON.stringify(error));
  }
  const pages = getStorage('pamong_pages', MOCK_PAGES);
  setStorage('pamong_pages', pages.filter(p => p.id !== id));
};

// --- BANNERS ---
export const fetchBanners = async (): Promise<BannerAd[]> => {
    if(supabase) {
        const { data, error } = await supabase.from('banners').select('*');
        if(data) return data as any;
        if(error) console.error("Supabase Error (fetchBanners):", JSON.stringify(error, null, 2));
    }
    return getStorage('pamong_banners', MOCK_BANNERS);
};

export const saveBanner = async (banner: BannerAd): Promise<void> => {
    if (supabase) {
        if(banner.id && isUuid(banner.id)) { 
             const { error } = await supabase.from('banners').update(banner).eq('id', banner.id);
             if (error) throw new Error(error.message || JSON.stringify(error));
        } else {
             const { id, ...rest } = banner;
             const { error } = await supabase.from('banners').insert(rest);
             if (error) throw new Error(error.message || JSON.stringify(error));
        }
        return;
    }

    let banners = getStorage('pamong_banners', MOCK_BANNERS);
    const exists = banners.find(b => b.id === banner.id);
    if(exists) {
        banners = banners.map(b => b.id === banner.id ? banner : b);
    } else {
        const newBanner = { ...banner, id: Math.random().toString(36).substr(2, 9) };
        banners.push(newBanner);
    }
    setStorage('pamong_banners', banners);
};

export const deleteBanner = async (id: string): Promise<void> => {
    if(supabase && isUuid(id)) await supabase.from('banners').delete().eq('id', id);
    const banners = await fetchBanners(); 
    setStorage('pamong_banners', banners.filter(b => b.id !== id));
};


// --- USERS ---
export const fetchUsers = async (): Promise<User[]> => {
  if (supabase) {
    const { data, error } = await supabase.from('users').select('*');
    if (data) return data as any;
    if(error) console.error("Supabase Error (fetchUsers):", JSON.stringify(error, null, 2));
  }
  return getStorage('pamong_users', MOCK_USERS);
};

export const saveUser = async (user: User): Promise<void> => {
  if (supabase) {
      if(user.id && isUuid(user.id)) await supabase.from('users').update(user).eq('id', user.id);
      else {
        const { id, ...rest } = user; 
        await supabase.from('users').insert(rest);
      }
      return;
  }
  let users = await fetchUsers();
  const exists = users.find(u => u.id === user.id);
  if (exists) {
     users = users.map(u => u.id === user.id ? user : u);
  } else {
     users.push({...user, id: Math.random().toString(36).substr(2, 9)});
  }
  setStorage('pamong_users', users);
};

export const deleteUser = async (id: string): Promise<void> => {
   if(supabase && isUuid(id)) await supabase.from('users').delete().eq('id', id);
   const users = await fetchUsers();
   setStorage('pamong_users', users.filter(u => u.id !== id));
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const users = await fetchUsers();
  const user = users.find(u => u.email === email);
  if (user && (password === 'admin123' || password === 'editor123')) {
    return user;
  }
  if (email === 'admin@pamong.id' && password === 'admin123') {
      return { id: 'admin', name: 'Super Admin', email, role: 'admin' };
  }
  return null;
};

// --- SETTINGS ---
export const fetchSettings = async (): Promise<AppSettings> => {
   if(supabase) {
       const { data, error } = await supabase.from('settings').select('*').single();
       if(data) return { ...DEFAULT_SETTINGS, ...data };
       if(error && error.code !== 'PGRST116') console.error("Supabase Error (fetchSettings):", JSON.stringify(error, null, 2));
   }
   return getStorage('pamong_settings', DEFAULT_SETTINGS);
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
   if(supabase) {
       try {
          const { error } = await supabase.from('settings').upsert({ id: 1, ...settings });
          if(error) throw error;
       } catch (err: any) {
          // Fallback for missing columns
          const msg = err.message || JSON.stringify(err);
          if (msg.includes('column') || msg.includes('schema')) {
              console.warn("⚠️ Schema Mismatch (saveSettings): Retrying save without new columns.");
              const { googleApiKey, tinymceApiKey, socialFacebook, socialTwitter, socialInstagram, contactAddress, contactEmail, contactPhone, ...safeSettings } = settings;
              const { error } = await supabase.from('settings').upsert({ id: 1, ...safeSettings });
              if(error) throw new Error(error.message);
              return;
          }
          throw new Error(msg);
       }
   }
   setStorage('pamong_settings', settings);
};
