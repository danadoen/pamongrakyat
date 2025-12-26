
import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchBanners, saveBanner, deleteBanner } from '../../services/newsService';
import { BannerAd } from '../../types';
import { Trash2, Edit, Plus, Save, X, UploadCloud } from 'lucide-react';

const BannerAds: React.FC = () => {
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [editing, setEditing] = useState<Partial<BannerAd> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const data = await fetchBanners();
    setBanners(data);
  };

  useEffect(() => {
    load();
  }, []);

  const resizeImage = (file: File): Promise<string> => {
      return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  // Limit width mostly
                  const maxWidth = 800;
                  const scaleSize = maxWidth / img.width;
                  canvas.width = maxWidth;
                  canvas.height = img.height * scaleSize;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                  resolve(canvas.toDataURL('image/jpeg', 0.8));
              };
              img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
      });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && editing) {
          const base64 = await resizeImage(e.target.files[0]);
          setEditing({ ...editing, imageUrl: base64 });
      }
  };

  const handleSave = async () => {
    if (!editing?.title || !editing?.imageUrl) {
        alert("Judul dan Gambar wajib diisi.");
        return;
    }
    // Set default values if missing
    const bannerToSave = {
        ...editing,
        linkUrl: editing.linkUrl || '#',
        position: editing.position || 'home_middle',
        isActive: editing.isActive ?? true
    } as BannerAd;

    await saveBanner(bannerToSave);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus banner ini?')) {
      await deleteBanner(id);
      load();
    }
  };

  const handleCreateNew = () => {
      setEditing({
          title: '',
          imageUrl: '',
          linkUrl: '',
          position: 'home_middle',
          isActive: true
      });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Iklan Banner</h2>
        <button onClick={handleCreateNew} className="bg-ink text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
          <Plus size={16} /> Pasang Iklan Baru
        </button>
      </div>

      {/* Editor Form */}
      {editing && (
        <div className="mb-8 bg-white p-6 border border-gray-200 rounded shadow-sm">
           <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{editing.id ? 'Edit Banner' : 'Banner Baru'}</h3>
                <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form */}
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-bold mb-1">Nama Klien / Judul Iklan</label>
                      <input 
                        type="text" 
                        value={editing.title} 
                        onChange={e => setEditing({...editing, title: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Contoh: Kopi Senja"
                      />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">Posisi Slot</label>
                        <select 
                            value={editing.position} 
                            onChange={e => setEditing({...editing, position: e.target.value as any})}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        >
                            <option value="home_middle">Tengah Beranda (Landscape)</option>
                            <option value="sidebar_right">Sidebar Kanan (Portrait/Square)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Status</label>
                        <select 
                            value={editing.isActive ? 'active' : 'inactive'} 
                            onChange={e => setEditing({...editing, isActive: e.target.value === 'active'})}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        >
                            <option value="active">Tayang (Aktif)</option>
                            <option value="inactive">Arsip (Tidak Tayang)</option>
                        </select>
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-bold mb-1">URL Tujuan (Link)</label>
                      <input 
                        type="text" 
                        value={editing.linkUrl} 
                        onChange={e => setEditing({...editing, linkUrl: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded font-mono text-sm"
                        placeholder="https://..."
                      />
                  </div>
              </div>

              {/* Right Column: Image Upload */}
              <div>
                  <label className="block text-sm font-bold mb-1">Gambar Banner</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${editing.imageUrl ? 'border-ink' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    {editing.imageUrl ? (
                        <>
                            <img src={editing.imageUrl} alt="Preview" className="w-full h-full object-contain bg-gray-100" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold text-sm flex items-center gap-1"><UploadCloud size={16}/> Ganti Gambar</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-4 text-gray-400">
                            <UploadCloud size={32} className="mx-auto mb-2"/>
                            <span className="text-xs">Klik untuk upload gambar</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Saran: Gunakan gambar landscape untuk posisi tengah, dan square/portrait untuk sidebar.</p>
              </div>
           </div>

           <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
              <button onClick={handleSave} className="px-6 py-2 bg-ink text-white rounded hover:bg-gray-800 flex items-center gap-2 font-bold">
                <Save size={16}/> Simpan Iklan
              </button>
           </div>
        </div>
      )}

      {/* Banner List */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-600">Preview</th>
              <th className="p-4 font-bold text-gray-600">Klien / Judul</th>
              <th className="p-4 font-bold text-gray-600">Posisi</th>
              <th className="p-4 font-bold text-gray-600">Status</th>
              <th className="p-4 font-bold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map(banner => (
              <tr key={banner.id} className="hover:bg-gray-50">
                <td className="p-4 w-24">
                   <div className="w-20 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden">
                       <img src={banner.imageUrl} alt="" className="max-w-full max-h-full object-cover" />
                   </div>
                </td>
                <td className="p-4 font-medium">
                    {banner.title}
                    <div className="text-xs text-gray-400 font-mono truncate max-w-[150px]">{banner.linkUrl}</div>
                </td>
                <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono border border-blue-100">
                        {banner.position === 'home_middle' ? 'Tengah (Beranda)' : 'Sidebar Kanan'}
                    </span>
                </td>
                <td className="p-4">
                    {banner.isActive 
                        ? <span className="text-green-600 font-bold text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Tayang</span>
                        : <span className="text-gray-400 font-bold text-xs flex items-center gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full"></span> Arsip</span>
                    }
                </td>
                <td className="p-4 text-right flex justify-end gap-2 items-center h-full">
                   <button onClick={() => setEditing(banner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                   <button onClick={() => handleDelete(banner.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
               <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada iklan banner.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default BannerAds;
