
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { savePage, getPageById } from '../../services/newsService';
import { generateArticleContent } from '../../services/geminiService';
import { Page } from '../../types';
import { Save, Wand2, ArrowLeft, LayoutTemplate, FileText, CheckCircle, X } from 'lucide-react';

const PageEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    isActive: true,
    showInNavbar: false, // Default false
    showInFooter: true  // Default true
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // AI Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      // PERFORMANCE FIX: Fetch only single page data by ID
      getPageById(id).then(page => {
        if (page) setFormData(page);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Auto-generate slug if empty
        const slug = formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
        
        // Ensure we don't send 'id' if it's undefined (new page)
        await savePage({ ...formData as Page, slug });
        
        // Show success feedback
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/pages');
        }, 1500);
    } catch (error: any) {
        alert("Gagal menyimpan halaman: " + error.message);
        setLoading(false);
    }
  };

  const handleAiDraft = async () => {
     if (!aiTopic) return;
     setAiLoading(true);
     try {
       const draft = await generateArticleContent(aiTopic);
       setFormData(prev => ({
         ...prev,
         content: draft.content
       }));
       setShowAiModal(false);
       setAiTopic('');
     } catch (e) {
       alert("Gagal membuat konten AI.");
     }
     setAiLoading(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{id ? 'Edit Halaman' : 'Halaman Baru'}</h2>
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded flex items-center gap-2 text-sm transition-colors">
           <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded border border-gray-200 shadow-sm max-w-4xl relative">
        {loading && !id && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">Loading...</div>}
        
        {showSuccess && (
           <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <CheckCircle size={20} />
              <strong>Berhasil!</strong> Halaman telah disimpan. Mengalihkan...
           </div>
        )}

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Halaman</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded font-serif text-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (Otomatis jika kosong)</label>
               <input 
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded text-sm font-mono bg-gray-50"
               />
            </div>
            
            <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 text-ink rounded focus:ring-ink"
                  />
                  <div>
                      <span className="block text-sm font-bold text-gray-800">Status Publikasi</span>
                      <span className="text-xs text-gray-500">Halaman dapat diakses publik</span>
                  </div>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-blue-50 p-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData.showInNavbar}
                        onChange={e => setFormData({...formData, showInNavbar: e.target.checked})}
                        className="w-5 h-5 text-blue-800 rounded focus:ring-blue-800"
                    />
                    <div className="flex-1">
                        <span className="block text-sm font-bold text-blue-900 flex items-center gap-2"><LayoutTemplate size={14}/> Navbar Utama</span>
                        <span className="text-xs text-blue-700">Tampil di Menu Atas</span>
                    </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors">
                    <input 
                        type="checkbox" 
                        checked={formData.showInFooter}
                        onChange={e => setFormData({...formData, showInFooter: e.target.checked})}
                        className="w-5 h-5 text-gray-800 rounded focus:ring-gray-800"
                    />
                    <div className="flex-1">
                        <span className="block text-sm font-bold text-gray-900 flex items-center gap-2"><FileText size={14}/> Footer Bawah</span>
                        <span className="text-xs text-gray-600">Tampil di Informasi</span>
                    </div>
                    </label>
                </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-sm font-medium text-gray-700">Konten HTML (Editor Sederhana)</label>
               <button 
                 type="button" 
                 onClick={() => setShowAiModal(true)}
                 disabled={aiLoading}
                 className="text-xs flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1.5 rounded hover:bg-purple-200 transition-colors border border-purple-200 font-bold shadow-sm"
               >
                 <Wand2 size={14} />
                 Bantu Tulis dengan AI
               </button>
            </div>
            <textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              rows={15}
              className="w-full p-4 border border-gray-300 rounded font-mono text-sm leading-relaxed focus:ring-2 focus:ring-ink focus:border-transparent"
              placeholder="<p>Tulis konten di sini...</p>"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Mendukung tag HTML dasar.</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
             <button 
               type="submit" 
               disabled={loading}
               className="flex items-center gap-2 px-6 py-2 bg-ink text-white rounded hover:bg-gray-800 transition-all font-bold disabled:opacity-70 shadow-lg transform hover:-translate-y-0.5"
             >
               <Save size={18} />
               {loading ? 'Menyimpan...' : 'Simpan Halaman'}
             </button>
          </div>
        </div>
      </form>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                <div className="flex items-center gap-2 mb-4 text-purple-700">
                    <Wand2 size={24} />
                    <h3 className="font-bold text-xl">AI Writer Assistant</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Jelaskan apa yang ingin Anda tulis untuk halaman ini. AI akan membuatkan draft awal dalam format HTML.
                </p>
                <textarea 
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    className="w-full border border-gray-300 rounded p-3 text-sm mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Contoh: Buatkan halaman 'Tentang Kami' untuk media PamongRakyat yang fokus pada jurnalisme independen..."
                    rows={4}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">Batal</button>
                    <button 
                        onClick={handleAiDraft}
                        disabled={!aiTopic || aiLoading}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                    >
                        {aiLoading ? 'Sedang Menulis...' : 'Generate Draft'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default PageEditor;
