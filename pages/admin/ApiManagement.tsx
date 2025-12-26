<<<<<<< HEAD

=======
>>>>>>> 81afd11 (Update admin pages, services, and editors)
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchSettings, saveSettings } from '../../services/newsService';
import { AppSettings } from '../../types';
<<<<<<< HEAD
import { Save, Key, Bot, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
=======
import { Save, Key, Edit3, AlertCircle, CheckCircle, BrainCircuit, ExternalLink, RefreshCw } from 'lucide-react';

// Declare or extend the AIStudio interface to match existing global definitions and satisfy TypeScript modifiers.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio: AIStudio;
  }
}
>>>>>>> 81afd11 (Update admin pages, services, and editors)

const ApiManagement: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD

  useEffect(() => {
    fetchSettings().then(data => {
        setSettings(data);
        setLoading(false);
    });
  }, []);

=======
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    const init = async () => {
        const data = await fetchSettings();
        setSettings(data);
        
        if (window.aistudio) {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setHasGeminiKey(hasKey);
        }
        setLoading(false);
    };
    init();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setHasGeminiKey(true); // Assume success after triggering openSelectKey to mitigate race conditions.
        setSuccess('Proyek API Key telah diperbarui.');
    }
  };

>>>>>>> 81afd11 (Update admin pages, services, and editors)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
        await saveSettings(settings);
<<<<<<< HEAD
        setSuccess('API Key berhasil disimpan! Refresh halaman jika perubahan editor tidak langsung terlihat.');
=======
        setSuccess('Konfigurasi berhasil disimpan.');
>>>>>>> 81afd11 (Update admin pages, services, and editors)
    } catch (err: any) {
        setError('Gagal menyimpan: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
<<<<<<< HEAD
        <h2 className="text-2xl font-bold">Integrasi API Eksternal</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center gap-2">
=======
        <h2 className="text-2xl font-bold">Integrasi API & Kecerdasan Buatan</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
>>>>>>> 81afd11 (Update admin pages, services, and editors)
                <CheckCircle size={20}/>
                <span>{success}</span>
            </div>
        )}
        {error && (
<<<<<<< HEAD
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-2">
=======
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2">
>>>>>>> 81afd11 (Update admin pages, services, and editors)
                <AlertCircle size={20}/>
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
<<<<<<< HEAD
            {/* Google AI Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-purple-600">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Artificial Intelligence (Google Gemini)</h3>
                        <p className="text-sm text-gray-500">Mengaktifkan fitur editor cerdas, ringkasan otomatis, dan asisten pembaca.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">Google Gemini API Key</label>
                    <div className="relative">
                        <Key size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            value={settings?.googleApiKey || ''} 
                            onChange={e => setSettings(prev => prev ? {...prev, googleApiKey: e.target.value} : null)}
                            className="w-full pl-10 p-3 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-colors"
                            placeholder="AIzaSy..."
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Dapatkan key di <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">Google AI Studio</a>.
                    </p>
=======
            {/* Google Gemini Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-purple-600">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Google Gemini Intelligence</h3>
                        <p className="text-sm text-gray-500">Mesin utama untuk Riset Berita Viral dan Asisten Redaksi.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* API Key Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100 gap-4">
                        <div>
                            <span className="block font-bold text-sm text-purple-900">Koneksi Proyek Google Cloud</span>
                            <div className="flex items-center gap-2 mt-1">
                                {hasGeminiKey ? (
                                    <span className="text-xs text-green-600 flex items-center gap-1 font-bold">
                                        <CheckCircle size={12}/> Terhubung ke Proyek Aktif
                                    </span>
                                ) : (
                                    <span className="text-xs text-red-600 flex items-center gap-1 font-bold">
                                        <AlertCircle size={12}/> Belum Terhubung
                                    </span>
                                )}
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={handleSelectKey}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 flex items-center gap-2 transition-colors whitespace-nowrap"
                        >
                            <RefreshCw size={14} />
                            {hasGeminiKey ? 'Ganti Proyek API' : 'Pilih Proyek API Key'}
                        </button>
                    </div>

                    {/* System Instruction */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Instruksi Sistem (AI Persona)</label>
                        <textarea 
                            value={settings?.aiSystemInstruction || ''}
                            onChange={e => setSettings(prev => prev ? {...prev, aiSystemInstruction: e.target.value} : null)}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded font-serif text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50"
                            placeholder="Tentukan kepribadian AI PamongRakyat di sini..."
                        />
                        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                            Instruksi ini akan memandu AI dalam menulis berita. Contoh: "Gunakan gaya bahasa investigasi yang kritis namun objektif."
                        </p>
                    </div>

                    <div className="pt-2">
                        <a 
                            href="https://ai.google.dev/gemini-api/docs/billing" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                        >
                            <ExternalLink size={12} /> Dokumentasi Billing & Kuota API
                        </a>
                    </div>
>>>>>>> 81afd11 (Update admin pages, services, and editors)
                </div>
            </div>

            {/* TinyMCE Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-blue-600">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Edit3 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Text Editor (TinyMCE)</h3>
<<<<<<< HEAD
                        <p className="text-sm text-gray-500">Platform editor teks kaya fitur untuk menulis berita.</p>
=======
                        <p className="text-sm text-gray-500">Editor visual untuk menulis artikel secara manual.</p>
>>>>>>> 81afd11 (Update admin pages, services, and editors)
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">TinyMCE API Key</label>
                    <div className="relative">
                        <Key size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            value={settings?.tinymceApiKey || ''} 
                            onChange={e => setSettings(prev => prev ? {...prev, tinymceApiKey: e.target.value} : null)}
<<<<<<< HEAD
                            className="w-full pl-10 p-3 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-colors"
                            placeholder="ib4xq..."
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Jika kosong, sistem akan menggunakan key default (mungkin ada limitasi/watermark). Dapatkan key di <a href="https://www.tiny.cloud/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">Tiny.cloud</a>.
                    </p>
=======
                            className="w-full pl-10 p-3 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            placeholder="API Key dari dashboard Tiny.cloud"
                        />
                    </div>
>>>>>>> 81afd11 (Update admin pages, services, and editors)
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={saving}
<<<<<<< HEAD
                    className="flex items-center gap-2 bg-ink text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-70"
                >
                    <Save size={18} />
                    {saving ? 'Menyimpan...' : 'Simpan Konfigurasi API'}
=======
                    className="flex items-center gap-2 bg-ink text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-70"
                >
                    <Save size={18} />
                    {saving ? 'Menyimpan Konfigurasi...' : 'Simpan Perubahan'}
>>>>>>> 81afd11 (Update admin pages, services, and editors)
                </button>
            </div>
        </form>
      </div>
    </AdminLayout>
  );
};

<<<<<<< HEAD
export default ApiManagement;
=======
export default ApiManagement;
>>>>>>> 81afd11 (Update admin pages, services, and editors)
