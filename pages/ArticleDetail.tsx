
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Article } from '../types';
import { getArticleBySlug, fetchArticles } from '../services/newsService';
import { askAiAssistant } from '../services/geminiService';
import { Sparkles, Share2, Printer, Camera, X, Copy, Check } from 'lucide-react';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        if (slug) {
            // Fetch current article
            const data = await getArticleBySlug(slug);
            setArticle(data || null);
            
            // Fetch latest articles for sidebar, excluding current one
            const all = await fetchArticles();
            setLatestArticles(all.filter(a => a.slug !== slug).slice(0, 5));
        }
    };
    loadData();
  }, [slug]);

  const handleAskAi = async () => {
    if (!article || !aiQuery.trim()) return;
    // Use plain text of content for context to save tokens/complexity
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = article.content;
    const context = tempDiv.textContent || "";

    setAiLoading(true);
    const res = await askAiAssistant(aiQuery, context);
    setAiResponse(res);
    setAiLoading(false);
  };

  const handleCopyUrl = () => {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  if (!article) return <Layout><div className="text-center py-20">Artikel tidak ditemukan.</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-8">
          <span className="inline-block bg-ink text-paper px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 border border-ink">
            {article.category}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6 text-ink">
            {article.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-sm font-mono text-gray-600 border-y border-gray-300 py-3 mt-6">
            <span>Oleh <strong>{article.author}</strong></span>
            <span>|</span>
            <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</span>
            <span>|</span>
            <div className="flex gap-2">
                <button 
                  onClick={() => setIsShareModalOpen(true)} 
                  className="hover:text-accent transition-colors flex items-center gap-1" 
                  title="Bagikan Artikel"
                >
                    <Share2 size={16}/>
                    <span className="hidden md:inline text-xs font-bold uppercase">Bagikan</span>
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button 
                  onClick={() => window.print()} 
                  className="hover:text-accent transition-colors flex items-center gap-1" 
                  title="Cetak Halaman"
                >
                    <Printer size={16}/>
                </button>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative mb-10 group bg-gray-100 border border-gray-300 p-1 shadow-sm">
           <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
           <p className="text-xs text-gray-500 mt-2 italic text-right pr-2">Foto: Dokumentasi PamongRakyat</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Sidebar Links */}
           <div className="lg:col-span-3 hidden lg:block border-r border-gray-300 pr-6">
             <div className="sticky top-8">
                <div className="text-7xl font-serif font-black text-gray-200 mb-2 -ml-2 leading-none">P</div>
                <p className="text-xs font-bold uppercase mb-6 border-b border-black pb-2">Terkini</p>
                <ul className="space-y-6">
                    {latestArticles.map(item => (
                        <li key={item.id} className="group">
                            <Link to={`/berita/${item.slug}`}>
                                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{item.category}</span>
                                <h5 className="font-serif font-bold leading-tight text-sm mt-1 group-hover:underline text-gray-800">{item.title}</h5>
                                <span className="text-[10px] text-gray-500 font-mono mt-1 block">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
             </div>
           </div>

           {/* Content Area */}
           <div className="lg:col-span-9">
              {/* Article Content (HTML) */}
              <div 
                className="prose prose-lg font-serif prose-headings:font-bold text-ink leading-loose text-justify prose-p:mb-6 prose-img:rounded-sm prose-img:border prose-img:border-gray-300 prose-a:text-accent max-w-none first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-16px] first-letter:font-serif"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Image Gallery (Optional) */}
              {article.additionalImageUrls && article.additionalImageUrls.length > 0 && (
                  <div className="mt-12 mb-8 border-t-2 border-black pt-6">
                      <h3 className="font-sans font-bold uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
                          <Camera size={18} /> Galeri Foto
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {article.additionalImageUrls.map((img, idx) => (
                              <div key={idx} className="relative group overflow-hidden border border-gray-300 p-1 bg-white shadow-sm transform hover:-rotate-1 transition-transform">
                                  <img src={img} alt={`Galeri ${idx}`} className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* AI Interaction Section */}
              <div className="mt-12 bg-[#EAE8E0] p-8 border-y-4 border-double border-gray-400 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 text-gray-300 opacity-20 pointer-events-none">
                    <Sparkles size={120} />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-ink text-white p-1 rounded-sm"><Sparkles size={16} /></div>
                        <h3 className="font-bold text-xl font-serif">Tanya Asisten AI Pamong</h3>
                    </div>
                    <p className="text-sm mb-6 text-gray-700 font-sans max-w-lg leading-relaxed">
                        Bingung dengan istilah hukum, data statistik, atau konteks politik di artikel ini? Tanyakan langsung pada sistem cerdas kami.
                    </p>
                    
                    <div className="flex gap-0 shadow-sm">
                        <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="Contoh: Apa dampak kebijakan ini bagi pedagang kecil?"
                        className="flex-grow p-3 border-2 border-gray-400 focus:border-ink focus:outline-none font-mono text-sm bg-white"
                        />
                        <button 
                        onClick={handleAskAi}
                        disabled={aiLoading}
                        className="bg-ink text-paper px-6 py-2 font-bold text-sm hover:bg-accent transition-colors disabled:opacity-50 uppercase tracking-widest border-2 border-ink border-l-0"
                        >
                        {aiLoading ? '...' : 'Kirim'}
                        </button>
                    </div>
                    
                    {aiResponse && (
                        <div className="mt-6 bg-white p-6 border-l-4 border-accent shadow-md">
                            <h4 className="font-bold mb-2 text-accent text-xs uppercase tracking-wider">Jawaban Redaksi AI:</h4>
                            <p className="font-serif text-gray-800 leading-relaxed">{aiResponse}</p>
                        </div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Share Modal Popup */}
        {isShareModalOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)}>
                <div className="bg-white p-6 max-w-md w-full shadow-2xl border-4 border-double border-ink relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 hover:text-red-600"><X size={20}/></button>
                    
                    <h3 className="font-serif text-2xl font-bold mb-2 border-b-2 border-ink inline-block">Bagikan Berita</h3>
                    <p className="text-sm text-gray-600 mb-6 font-serif italic">"Sebarkan kebenaran, cerdaskan kehidupan bangsa."</p>
                    
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" 
                            readOnly 
                            value={window.location.href} 
                            className="flex-grow border-2 border-gray-300 p-2 text-sm font-mono bg-gray-50 focus:outline-none text-gray-600"
                        />
                        <button 
                            onClick={handleCopyUrl} 
                            className={`px-4 py-2 font-bold text-sm flex items-center gap-2 transition-all border-2 ${isCopied ? 'bg-green-600 border-green-600 text-white' : 'bg-ink border-ink text-white hover:bg-white hover:text-ink'}`}
                        >
                            {isCopied ? <Check size={16}/> : <Copy size={16}/>}
                            {isCopied ? 'Disalin' : 'Salin'}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                         <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="bg-[#1877F2] text-white py-2 px-4 rounded hover:opacity-90 text-xs font-bold text-center">Facebook</a>
                         <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer" className="bg-[#000000] text-white py-2 px-4 rounded hover:opacity-80 text-xs font-bold text-center">X (Twitter)</a>
                         <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white py-2 px-4 rounded hover:opacity-90 text-xs font-bold text-center">WhatsApp</a>
                    </div>
                    
                    <div className="mt-6 text-center border-t border-gray-200 pt-2">
                        <p className="text-[10px] font-mono text-gray-400 uppercase">Tautan Publik PamongRakyat</p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};

export default ArticleDetail;
