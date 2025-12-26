import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchSettings, saveSettings } from '../../services/newsService';
import { AppSettings } from '../../types';
import { autoPilot } from '../../services/autoPilotService';
import { 
  Save, 
  Key, 
  Edit3, 
  AlertCircle, 
  CheckCircle, 
  BrainCircuit, 
  ExternalLink, 
  RefreshCw, 
  Zap, 
  MessageSquareText, 
  ShieldCheck,
  Settings2,
  Cpu
} from 'lucide-react';

// Fix: Augment the Window interface with a readonly aistudio property to match the environment's definition
declare global {
  interface Window {
    readonly aistudio: {
      hasSelectedApiKey(): Promise<boolean>;
      openSelectKey(): Promise<void>;
    };
  }
}

const ApiManagement: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isAutoPilotActive, setIsAutoPilotActive] = useState(false);

  useEffect(() => {
    const init = async () => {
        const data = await fetchSettings();
        setSettings(data);
        setIsAutoPilotActive(autoPilot.getStatus());
        
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
        try {
            await window.aistudio.openSelectKey();
            setHasGeminiKey(true);
            setSuccess('Koneksi API Gemini berhasil dikonfigurasi secara manual.');
        } catch (e) {
            setError('Gagal mengonfigurasi API Key.');
        }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
        await saveSettings(settings);
        setSuccess('Pengaturan inteligensi bot berhasil disimpan.');
    } catch (err: any) {
        setError('Gagal menyimpan: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) return <AdminLayout><div className="p-8 font-mono animate-pulse">Menghubungkan ke pusat sirkuit AI...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-black text-ink font-serif uppercase tracking-tight">Pusat Kendali Pamong AI</h2>
            <p className="text-sm text-gray-500 font-mono mt-1">Konfigurasi manual integrasi Gemini, Auto-Pilot, dan AI Bot Assistant.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="bg-green-500 p-2 rounded-lg text-white">
                    <CheckCircle size={20}/>
                </div>
                <span className="font-bold">{success}</span>
            </div>
        )}
        
        {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-sm flex items-center gap-4">
                <div className="bg-red-500 p-2 rounded-lg text-white">
                    <AlertCircle size={20}/>
                </div>
                <span className="font-bold">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                        <Cpu size={14} className="text-accent" /> Monitoring Mesin
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className={hasGeminiKey ? 'text-green-500' : 'text-gray-300'} />
                                <span className="text-sm font-bold">Koneksi API</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${hasGeminiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {hasGeminiKey ? 'Aktif' : 'Off'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <Zap size={18} className={isAutoPilotActive ? 'text-accent' : 'text-gray-300'} />
                                <span className="text-sm font-bold">Auto-Pilot</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${isAutoPilotActive ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {isAutoPilotActive ? 'Running' : 'Idle'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <MessageSquareText size={18} className="text-blue-500" />
                                <span className="text-sm font-bold">AI Bot Chat</span>
                            </div>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-700">
                                Ready
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 italic leading-relaxed">
                            * Integrasi ini menggunakan model Gemini 3 Pro Preview untuk riset viral dan Gemini 2.5 Flash untuk generate gambar & asisten.
                        </p>
                    </div>
                </div>

                <div className="bg-ink text-paper p-6 rounded-2xl shadow-xl">
                    <h4 className="font-serif italic text-lg mb-2">"Kecerdasan tanpa integritas adalah bahaya."</h4>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">PamongRakyat AI Ethics Board</p>
                </div>
            </div>

            {/* Config Panel */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Gemini Core Configuration */}
                    <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                            <BrainCircuit size={150} />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200">
                                    <Key size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase">Input Kunci Gemini Manual</h3>
                                    <p className="text-sm text-gray-500">Otentikasi akses ke API Kecerdasan Buatan Google.</p>
                                </div>
                            </div>
                            
                            <button 
                                type="button"
                                onClick={handleSelectKey}
                                className="flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-xl active:scale-95 group"
                            >
                                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                {hasGeminiKey ? 'Update Kunci API' : 'Masukkan Kunci API'}
                            </button>
                        </div>

                        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-8">
                            <div className="flex gap-4">
                                <AlertCircle className="text-purple-600 shrink-0 mt-1" size={20} />
                                <div className="text-sm text-purple-900 leading-relaxed">
                                    <p className="font-bold mb-1">Catatan Keamanan:</p>
                                    Demi keamanan, PamongRakyat tidak menyimpan teks mentah kunci API Anda dalam database lokal. 
                                    Kunci dikelola secara aman melalui sesi browser terenkripsi.
                                </div>
                            </div>
                        </div>

                        {/* Bot Behavioral Settings */}
                        <div className="space-y-8">
                            <div className="border-t border-gray-100 pt-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings2 size={18} className="text-accent" />
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-600">Behavioral Matrix</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Auto Pilot Instruction */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
                                            <Zap size={14} className="text-accent" />
                                            Persona Auto-Pilot (Editorial)
                                        </label>
                                        <textarea 
                                            value={settings?.aiSystemInstruction || ''}
                                            onChange={e => setSettings(prev => prev ? {...prev, aiSystemInstruction: e.target.value} : null)}
                                            rows={6}
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl font-serif text-sm focus:border-purple-500 focus:ring-0 outline-none bg-gray-50/50 transition-all resize-none"
                                            placeholder="Tentukan instruksi penulisan berita otomatis..."
                                        />
                                        <p className="text-[10px] text-gray-400 font-mono">
                                            * Perintah utama untuk mesin riset viral.
                                        </p>
                                    </div>

                                    {/* AI Bot Assistant Instruction */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
                                            <MessageSquareText size={14} className="text-blue-500" />
                                            Persona AI Bot (Public Assistant)
                                        </label>
                                        <textarea 
                                            value={settings?.aiSystemInstruction || ''}
                                            readOnly
                                            rows={6}
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl font-serif text-sm bg-gray-100 text-gray-400 cursor-not-allowed resize-none opacity-60"
                                            placeholder="Asisten publik mewarisi persona editorial..."
                                        />
                                        <p className="text-[10px] text-gray-400 font-mono">
                                            * (Mirroring) Sinkron dengan persona utama.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="flex items-center gap-3 bg-ink text-white px-12 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-800 transition-all shadow-2xl disabled:opacity-70 active:scale-95 border-b-4 border-black/20"
                        >
                            <Save size={20} />
                            {saving ? 'Sedang Sinkronisasi...' : 'Simpan Konfigurasi Bot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* External Resources */}
        <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Edit3 size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">TinyMCE Visual Editor</h4>
                    <p className="text-sm text-gray-500">Konfigurasi kunci untuk editor teks visual di dashboard.</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:w-64">
                    <Key size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                        type="password" 
                        value={settings?.tinymceApiKey || ''} 
                        onChange={e => setSettings(prev => prev ? {...prev, tinymceApiKey: e.target.value} : null)}
                        className="w-full pl-12 p-3 border-2 border-gray-100 rounded-xl font-mono text-xs focus:border-blue-500 outline-none"
                        placeholder="TinyMCE API Key"
                    />
                </div>
                <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 text-gray-400 hover:text-accent transition-colors"
                    title="Billing Documentation"
                >
                    <ExternalLink size={20} />
                </a>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApiManagement;
