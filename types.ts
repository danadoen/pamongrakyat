
export enum ArticleCategory {
  POLITIK = 'Politik & Pemerintahan',
  PELAYANAN = 'Pelayanan Publik',
  HUKUM = 'Hukum & Keadilan',
  EKONOMI = 'Ekonomi Rakyat',
  BUDAYA = 'Budaya',
  WISATA = 'Destinasi Wisata'
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Stores HTML
  category: ArticleCategory;
  imageUrl: string; // Main Image (Base64 or URL)
  additionalImageUrls?: string[]; // Optional 2 images
  author: string;
  createdAt: string;
  isBreaking: boolean;
  views: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isActive: boolean;
  showInNavbar?: boolean; // Toggle visibility in Top Nav
  showInFooter?: boolean; // Toggle visibility in Footer
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  name: string;
  avatarUrl?: string;
}

export interface BannerAd {
  id: string;
  title: string;
  imageUrl: string; // Base64
  linkUrl: string;
  position: 'home_middle' | 'sidebar_right';
  isActive: boolean;
}

export interface AppSettings {
  siteName: string;
  siteDescription: string;
  showAds: boolean;
  maintenanceMode: boolean;
  breakingNewsSpeed: number;
  // TinyMCE Configuration
  tinymceApiKey?: string;
  // Gemini AI Configuration
  aiSystemInstruction?: string;
  // Social Media
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  // Contact Info
  contactAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
}
