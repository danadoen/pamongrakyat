
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchSettings, saveSettings } from '../../services/newsService';
import { AppSettings } from '../../types';
import { Save, Key, Bot, Edit3, AlertCircle, CheckCircle } from 'lucide-react';

const ApiManagement: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings().then(data => {
        setSettings(data);
        setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
        await saveSettings(settings);
        setSuccess('API Key berhasil disimpan! Refresh halaman jika perubahan editor tidak langsung terlihat.');
    } catch (err: any) {
        setError('Gagal menyimpan: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Integrasi API Eksternal</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center gap-2">
                <CheckCircle size={20}/>
                <span>{success}</span>
            </div>
        )}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-2">
                <AlertCircle size={20}/>
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
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
                        <p className="text-sm text-gray-500">Platform editor teks kaya fitur untuk menulis berita.</p>
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
                            className="w-full pl-10 p-3 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-colors"
                            placeholder="ib4xq..."
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Jika kosong, sistem akan menggunakan key default (mungkin ada limitasi/watermark). Dapatkan key di <a href="https://www.tiny.cloud/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">Tiny.cloud</a>.
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 bg-ink text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-70"
                >
                    <Save size={18} />
                    {saving ? 'Menyimpan...' : 'Simpan Konfigurasi API'}
                </button>
            </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ApiManagement;
