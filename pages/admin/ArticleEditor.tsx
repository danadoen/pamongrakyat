
import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import RichTextEditor from '../../components/RichTextEditor';
import { ArticleCategory, Article } from '../../types';
import { generateEditorialDescription, generateArticleContent, continueArticle, improveWritingStyle } from '../../services/geminiService';
import { createArticle, getArticleById, updateArticle } from '../../services/newsService';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles, Save, Wand2, Image as ImageIcon, X, UploadCloud, ArrowLeft, PenTool, Feather } from 'lucide-react';

const ArticleEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ArticleCategory.POLITIK,
    summary: '',
    author: 'Redaksi',
    imageUrl: '',
    additionalImageUrls: [] as string[],
    createdAt: '',
    views: 0
  });
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiAction, setAiAction] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFilesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const loadArticle = async () => {
        const article = await getArticleById(id);
        if (article) {
          setFormData({
            title: article.title,
            content: article.content,
            category: article.category,
            summary: article.summary,
            author: article.author,
            imageUrl: article.imageUrl,
            additionalImageUrls: article.additionalImageUrls || [],
            createdAt: article.createdAt,
            views: article.views
          });
        }
      };
      loadArticle();
    }
  }, [id]);

  const resizeImage = (file: File, maxWidth = 800): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleSize = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const base64 = await resizeImage(e.target.files[0]);
          setFormData(prev => ({ ...prev, imageUrl: base64 }));
      }
  };

  const handleExtraImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newImages: string[] = [];
          const remainingSlots = 2 - formData.additionalImageUrls.length;
          const filesToProcess = (Array.from(e.target.files) as File[]).slice(0, remainingSlots);

          for (const file of filesToProcess) {
              const base64 = await resizeImage(file, 600);
              newImages.push(base64);
          }
          
          setFormData(prev => ({
              ...prev,
              additionalImageUrls: [...prev.additionalImageUrls, ...newImages]
          }));
      }
  };

  const removeExtraImage = (index: number) => {
      setFormData(prev => ({
          ...prev,
          additionalImageUrls: prev.additionalImageUrls.filter((_, i) => i !== index)
      }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleContentChange = (html: string) => {
    setFormData(prev => ({ ...prev, content: html }));
  };

  const handleGenerateSummary = async () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    if (!formData.title || !plainText) return alert("Isi judul dan konten dulu untuk membuat ringkasan.");
    
    setAiAction('summary');
    setAiGenerating(true);
    try {
        const summary = await generateEditorialDescription(formData.title, plainText);
        setFormData(prev => ({...prev, summary}));
    } catch (e) {
        alert("Gagal menggunakan AI.");
    }
    setAiGenerating(false);
    setAiAction('');
  };

  const handleGenerateDraft = async () => {
      const topic = prompt("Masukkan topik berita yang ingin dibuatkan draftnya (misal: Pembangunan Jembatan di Desa Sukamaju):");
      if(!topic) return;
      
      setAiAction('draft');
      setAiGenerating(true);
      try {
          const draft = await generateArticleContent(topic);
          const htmlContent = draft.content
            .split('\n\n')
            .map(p => `<p>${p}</p>`)
            .join('');
          
          setFormData(prev => ({
              ...prev,
              title: draft.title,
              content: htmlContent
          }));
      } catch (e: any) {
          alert("Gagal membuat draft: " + e.message);
      }
      setAiGenerating(false);
      setAiAction('');
  }

  const handleContinueWriting = async () => {
      if (!formData.content) return alert("Isi konten terlebih dahulu.");
      
      setAiAction('continue');
      setAiGenerating(true);
      try {
          const continuation = await continueArticle(formData.content);
          setFormData(prev => ({
              ...prev,
              content: prev.content + continuation
          }));
      } catch (e) {
          alert("Gagal melanjutkan tulisan.");
      }
      setAiGenerating(false);
      setAiAction('');
  };

  const handleImproveStyle = async () => {
      if (!formData.content) return alert("Isi konten terlebih dahulu.");
      if (!confirm("AI akan menulis ulang konten ini agar lebih rapi. Lanjutkan?")) return;

      setAiAction('improve');
      setAiGenerating(true);
      try {
          const improved = await improveWritingStyle(formData.content);
          setFormData(prev => ({
              ...prev,
              content: improved
          }));
      } catch (e) {
          alert("Gagal memperbaiki tulisan.");
      }
      setAiGenerating(false);
      setAiAction('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert("Wajib mengupload 1 gambar utama!");
        return;
    }

    setLoading(true);
    
    // Robust slug generation: title + random suffix to avoid unique constraint violations
    const baseSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = id ? baseSlug : `${baseSlug}-${uniqueSuffix}`;
    
    try {
        if (id) {
            await updateArticle({
                id: id,
                ...formData,
                slug: baseSlug, // Update doesn't necessarily change slug unless title changed, but simple logic here
                isBreaking: false
            } as Article);
        } else {
            await createArticle({
                ...formData,
                slug, // New article gets unique slug
                isBreaking: false
            });
        }
        setLoading(false);
        navigate('/admin/articles');
    } catch (err: any) {
        setLoading(false);
        console.error(err);
        // Extract useful message from JSON string if possible
        let errorMessage = err.message || "Database error.";
        try {
            const parsed = JSON.parse(errorMessage);
            if(parsed.message) errorMessage = parsed.message;
            else if(parsed.details) errorMessage = parsed.details;
        } catch(e) {}
        
        alert("Gagal menyimpan berita: " + errorMessage);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/articles')} className="text-gray-500 hover:text-ink">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold">{id ? 'Edit Berita' : 'Editor Berita Baru'}</h2>
        </div>
        <button onClick={handleGenerateDraft} disabled={aiGenerating} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 transition-all shadow-sm font-bold text-sm">
             <Wand2 size={16} />
             {aiAction === 'draft' ? 'Menulis...' : 'Buat Baru dgn AI'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm max-w-5xl border border-gray-200 mx-auto">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Headline</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded font-serif text-2xl focus:ring-2 focus:ring-ink focus:border-transparent placeholder:text-gray-300"
              placeholder="Judul Berita..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              >
                {Object.values(ArticleCategory).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Penulis</label>
              <input 
                type="text" 
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Gambar Utama (Wajib)</label>
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${formData.imageUrl ? 'border-ink' : 'border-gray-300 hover:bg-gray-50'}`}
                 >
                    {formData.imageUrl ? (
                        <>
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold text-sm flex items-center gap-1"><UploadCloud size={16}/> Ganti</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-4 text-gray-400">
                            <ImageIcon size={32} className="mx-auto mb-2"/>
                            <span className="text-xs">Klik untuk upload</span>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleMainImageUpload} />
                 </div>
              </div>

              <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Galeri Tambahan (Opsional - Max 2)</label>
                  <div className="flex gap-4">
                      {formData.additionalImageUrls.map((img, idx) => (
                          <div key={idx} className="relative w-32 h-32 border border-gray-300 rounded overflow-hidden group">
                              <img src={img} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => removeExtraImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                          </div>
                      ))}
                      
                      {formData.additionalImageUrls.length < 2 && (
                          <div 
                            onClick={() => extraFilesInputRef.current?.click()}
                            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400"
                          >
                              <PlusIcon />
                              <span className="text-[10px] mt-1">Tambah Foto</span>
                              <input type="file" ref={extraFilesInputRef} className="hidden" accept="image/*" multiple onChange={handleExtraImagesUpload} />
                          </div>
                      )}
                  </div>
              </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Konten Berita</label>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={handleContinueWriting}
                        disabled={aiGenerating || !formData.content}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 hover:bg-blue-100 disabled:opacity-50"
                    >
                        {aiAction === 'continue' ? <span className="animate-spin">⏳</span> : <PenTool size={14} />}
                        Lanjutkan Tulisan
                    </button>
                    <button 
                        type="button"
                        onClick={handleImproveStyle}
                        disabled={aiGenerating || !formData.content}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded border border-green-200 hover:bg-green-100 disabled:opacity-50"
                    >
                        {aiAction === 'improve' ? <span className="animate-spin">⏳</span> : <Feather size={14} />}
                        Perbaiki Bahasa
                    </button>
                </div>
            </div>
            <RichTextEditor 
                value={formData.content} 
                onChange={handleContentChange} 
                placeholder="Mulai mengetik berita di sini..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-blue-900">Deskripsi Singkat (Lead Paragraph)</label>
              <button 
                type="button"
                onClick={handleGenerateSummary}
                disabled={aiGenerating}
                className="text-xs flex items-center gap-1 bg-white text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-100 shadow-sm"
              >
                <Sparkles size={12} />
                {aiAction === 'summary' ? 'Sedang Berpikir...' : 'Buat Lead Otomatis'}
              </button>
            </div>
            <textarea 
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Ringkasan menarik untuk ditampilkan di halaman depan..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-4 border-t border-gray-100 pt-6">
            <button type="button" onClick={() => navigate('/admin/articles')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-ink text-white rounded hover:bg-gray-800 disabled:opacity-70 shadow-lg transform hover:-translate-y-0.5 transition-all font-bold"
            >
              <Save size={18} />
              {loading ? 'Menyimpan...' : (id ? 'Update Berita' : 'Terbitkan Berita')}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default ArticleEditor;
