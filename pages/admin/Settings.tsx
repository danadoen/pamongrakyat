
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchSettings, saveSettings } from '../../services/newsService';
import { AppSettings } from '../../types';
import { Save, Monitor, AlertTriangle, Share2, Building, Cpu } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (settings) {
      try {
          await saveSettings(settings);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
      } catch (error: any) {
          alert("Gagal menyimpan pengaturan: " + error.message);
      }
    }
  };

  if (!settings) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pengaturan Sistem</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* General Settings */}
         <div className="bg-white p-6 rounded border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
               <Monitor className="text-ink" size={20}/>
               <h3 className="font-bold text-lg">Identitas Situs</h3>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Nama Portal</label>
                  <input 
                    type="text" 
                    value={settings.siteName} 
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded font-serif text-lg"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Slogan / Tagline</label>
                  <input 
                    type="text" 
                    value={settings.siteDescription} 
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded italic"
                  />
               </div>
            </div>
         </div>

         {/* System Toggles */}
         <div className="bg-white p-6 rounded border border-gray-200">
             <div className="flex items-center gap-2 mb-4 border-b pb-2">
               <AlertTriangle className="text-ink" size={20}/>
               <h3 className="font-bold text-lg">Kontrol Sistem</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                   <div>
                      <span className="block font-bold text-sm">Maintenance Mode</span>
                      <span className="text-xs text-gray-500">Tutup akses publik sementara</span>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                   </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                   <div>
                      <span className="block font-bold text-sm">Tampilkan Iklan</span>
                      <span className="text-xs text-gray-500">Aktifkan slot banner ads</span>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.showAds} onChange={e => setSettings({...settings, showAds: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                   </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                   <div>
                      <span className="block font-bold text-sm">Kecepatan Breaking News</span>
                      <span className="text-xs text-gray-500">Detik per rotasi</span>
                   </div>
                   <input 
                     type="number" 
                     value={settings.breakingNewsSpeed} 
                     onChange={e => setSettings({...settings, breakingNewsSpeed: parseInt(e.target.value)})}
                     className="w-16 p-1 text-center border border-gray-300 rounded"
                   />
                </div>
            </div>
         </div>

         {/* AI Configuration (New) */}
         <div className="bg-white p-6 rounded border border-gray-200 lg:col-span-2 border-l-4 border-l-purple-600">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
               <Cpu className="text-purple-600" size={20}/>
               <h3 className="font-bold text-lg text-purple-900">Konfigurasi Kecerdasan Buatan (AI)</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-bold mb-1">Google Gemini API Key</label>
                    <input 
                        type="text" 
                        value={settings.googleApiKey || ''} 
                        onChange={(e) => setSettings({...settings, googleApiKey: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-purple-50"
                        placeholder="AIzaSy..."
                    />
                    <p className="text-xs text-gray-500">
                        Kunci ini digunakan untuk fitur "Editor Pintar", "Ringkasan Otomatis", dan "Chatbot Asisten" di artikel.
                        <br/>
                        <span className="text-red-500 font-bold">Perhatian:</span> API Key ini disimpan di database. Jangan gunakan key root/unrestricted untuk production skala besar.
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
                    <h4 className="font-bold mb-2">Cara Mendapatkan API Key:</h4>
                    <ol className="list-decimal ml-4 space-y-1">
                        <li>Kunjungi <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>.</li>
                        <li>Login dengan akun Google Anda.</li>
                        <li>Klik "Get API Key" di pojok kiri atas.</li>
                        <li>Buat project baru atau pilih yang sudah ada.</li>
                        <li>Salin kodenya dan tempel di kolom di samping.</li>
                    </ol>
                </div>
            </div>
         </div>

         {/* Social Media */}
         <div className="bg-white p-6 rounded border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
               <Share2 className="text-ink" size={20}/>
               <h3 className="font-bold text-lg">Jejaring Sosial</h3>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Facebook URL</label>
                  <input type="text" value={settings.socialFacebook || ''} onChange={(e) => setSettings({...settings, socialFacebook: e.target.value})} className="w-full p-2 border border-gray-300 rounded" placeholder="https://facebook.com/..." />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Twitter (X) URL</label>
                  <input type="text" value={settings.socialTwitter || ''} onChange={(e) => setSettings({...settings, socialTwitter: e.target.value})} className="w-full p-2 border border-gray-300 rounded" placeholder="https://twitter.com/..." />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Instagram URL</label>
                  <input type="text" value={settings.socialInstagram || ''} onChange={(e) => setSettings({...settings, socialInstagram: e.target.value})} className="w-full p-2 border border-gray-300 rounded" placeholder="https://instagram.com/..." />
               </div>
            </div>
         </div>

         {/* Office Contact */}
         <div className="bg-white p-6 rounded border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
               <Building className="text-ink" size={20}/>
               <h3 className="font-bold text-lg">Kontak Kantor (Footer)</h3>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Alamat Kantor</label>
                  <textarea rows={3} value={settings.contactAddress || ''} onChange={(e) => setSettings({...settings, contactAddress: e.target.value})} className="w-full p-2 border border-gray-300 rounded font-mono text-sm" placeholder="Alamat lengkap..." />
                  <p className="text-xs text-gray-500">Gunakan Enter untuk baris baru</p>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Email Redaksi</label>
                  <input type="text" value={settings.contactEmail || ''} onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} className="w-full p-2 border border-gray-300 rounded" />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                  <input type="text" value={settings.contactPhone || ''} onChange={(e) => setSettings({...settings, contactPhone: e.target.value})} className="w-full p-2 border border-gray-300 rounded" />
               </div>
            </div>
         </div>
      </div>

      <div className="mt-8 flex justify-end pb-8">
         <button 
            onClick={handleSave} 
            className={`flex items-center gap-2 px-8 py-3 rounded font-bold text-white transition-all shadow-lg ${saved ? 'bg-green-600 transform scale-105' : 'bg-ink hover:bg-gray-800'}`}
         >
            <Save size={20} />
            {saved ? 'Tersimpan!' : 'Simpan Semua Pengaturan'}
         </button>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
