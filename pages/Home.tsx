
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ArticleCard from '../components/ArticleCard';
import { Article, BannerAd } from '../types';
import { fetchArticles, fetchBanners } from '../services/newsService';

const Home: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const allArticles = await fetchArticles();
      const allBanners = await fetchBanners();
      
      if (category) {
        // Filter articles strictly by category string matching the Enum in types.ts
        const filtered = allArticles.filter(a => a.category === category);
        setArticles(filtered);
      } else {
        setArticles(allArticles);
      }
      setBanners(allBanners.filter(b => b.isActive));
      setLoading(false);
    };
    load();
  }, [category]);

  if (loading) return <Layout><div className="text-center py-20 font-mono">Sedang memuat tinta digital...</div></Layout>;

  // Empty state handling
  if (articles.length === 0) {
     return (
         <Layout>
            {category && (
                <div className="mb-8 text-center border-b border-ink pb-4 mt-4">
                    <h2 className="font-serif text-4xl md:text-5xl font-black text-ink mt-2">
                        {category}
                    </h2>
                </div>
            )}
             <div className="text-center py-20">
                 <h3 className="font-serif text-2xl font-bold text-gray-400">Belum Ada Berita</h3>
                 <p className="text-gray-500 mt-2 font-mono text-sm">Redaksi belum menerbitkan artikel untuk kategori ini.</p>
             </div>
         </Layout>
     )
  }

  const featured = articles[0];
  const editorsPick = articles.slice(1, 3);
  const latest = articles.slice(3);

  // Helper to pick random banner for a slot
  const getBanner = (position: 'home_middle' | 'sidebar_right') => {
      const available = banners.filter(b => b.position === position);
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
  };

  const middleBanner = getBanner('home_middle');
  const sidebarBanner = getBanner('sidebar_right');

  return (
    <Layout>
      {/* Category Header */}
      {category && (
          <div className="mb-8 text-center">
              <h2 className="font-serif text-4xl md:text-5xl font-black text-ink mt-2 mb-4 border-b-4 border-double border-ink pb-4 inline-block">
                  {category}
              </h2>
          </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Column (Left & Center) */}
        <div className="lg:col-span-3">
          {featured && <ArticleCard article={featured} featured />}
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
             {editorsPick.map(article => (
                <ArticleCard key={article.id} article={article} />
             ))}
          </div>

          {/* Advertisement Banner (Middle) */}
          {middleBanner ? (
              <div className="my-8 py-4 border-y-4 border-double border-gray-300 bg-gray-50 text-center overflow-hidden group">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Iklan</p>
                <a href={middleBanner.linkUrl} target="_blank" rel="noreferrer" className="block relative">
                    <img src={middleBanner.imageUrl} alt={middleBanner.title} className="max-h-40 mx-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"/>
                    <div className="absolute bottom-0 right-0 bg-white/80 text-[10px] px-1">{middleBanner.title}</div>
                </a>
              </div>
          ) : (
              // Fallback generic ad style if no active banner
              <div className="my-8 py-6 border-y-4 border-double border-gray-300 bg-gray-100 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Space Iklan Tersedia</p>
                <div className="font-serif text-2xl font-bold text-gray-600">
                  Hubungi Bagian Iklan: 0812-3456-7890
                </div>
              </div>
          )}

          {latest.length > 0 && (
            <>
                <h3 className="font-serif text-2xl font-bold mb-6 border-b-2 border-black inline-block">Berita Lainnya</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {latest.map(article => (
                    <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </>
          )}
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-1 border-l border-gray-300 pl-8 hidden lg:block">
           {/* Weather / Widget */}
           <div className="bg-ink text-paper p-4 mb-8 text-center">
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Pojok Redaksi</h4>
              <p className="text-xs font-serif italic mb-4">"Kebenaran tidak pernah takut pada penyelidikan."</p>
              <div className="border-t border-gray-600 pt-2 text-xs font-mono">
                 Edisi: {new Date().toLocaleDateString()}
              </div>
           </div>

           <h4 className="font-bold uppercase tracking-widest text-sm border-b border-black mb-4">Terpopuler</h4>
           <div className="flex flex-col gap-2">
              {articles.slice().sort((a,b) => b.views - a.views).slice(0, 5).map((article, idx) => (
                  <div key={article.id} className="flex gap-3 mb-2 group cursor-pointer">
                      <span className="font-serif text-3xl font-bold text-gray-300 group-hover:text-accent">{idx + 1}</span>
                      <p className="font-serif text-sm leading-tight hover:underline">{article.title}</p>
                  </div>
              ))}
           </div>

           {/* Vertical Ad (Sidebar) */}
           {sidebarBanner && (
               <div className="mt-8 border border-gray-400 p-2 text-center bg-gray-50 group">
                  <p className="text-[10px] text-gray-400 uppercase mb-1">Iklan Baris</p>
                  <a href={sidebarBanner.linkUrl} target="_blank" rel="noreferrer">
                    <img src={sidebarBanner.imageUrl} alt={sidebarBanner.title} className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all"/>
                    <h5 className="font-bold font-serif mt-2 text-sm">{sidebarBanner.title}</h5>
                  </a>
               </div>
           )}

           {/* Quote of the day */}
           <div className="mt-8 p-4 border-2 border-black bg-white rotate-1">
              <p className="font-serif italic text-lg text-center">
                "Keadilan jadi barang sukar, ketika hukum hanya tajam ke bawah."
              </p>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
    