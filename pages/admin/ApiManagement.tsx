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
  Cpu,
  Lock
} from 'lucide-react';

// The manual declare global block for window.aistudio was removed because it conflicted with 
// the existing AIStudio type definition provided by the execution environment.

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
        
        // Using Type Assertion to handle the globally available aistudio property 
        // while avoiding conflicts with existing internal type declarations.
        const aistudio = (window as any).aistudio;
        if (aistudio) {
            const hasKey = await aistudio.hasSelectedApiKey();
            setHasGeminiKey(hasKey);
        }
        setLoading(false);
    };
    init();
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
        try {
            await aistudio.openSelectKey();
            const hasKey = await aistudio.hasSelectedApiKey();
            setHasGeminiKey(hasKey);
            setSuccess('Kunci API Gemini berhasil dikonfigurasi secara manual.');
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
        setSuccess('Seluruh konfigurasi API dan Bot berhasil disimpan.');
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
            <p className="text-sm text-gray-500 font-mono mt-1">Kelola seluruh integrasi kunci API secara manual dalam satu dashboard.</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                        <Cpu size={14} className="text-accent" /> Monitoring Layanan
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className={hasGeminiKey ? 'text-green-500' : 'text-gray-300'} />
                                <span className="text-sm font-bold">Status Gemini</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${hasGeminiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {hasGeminiKey ? 'Aktif' : 'Non-Aktif'}
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
                </div>

                <div className="bg-ink text-paper p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="font-serif italic text-lg mb-2">"Teknologi adalah alat, namun suara rakyat adalah kompas."</h4>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">PamongRakyat AI Ethics Board</p>
                    </div>
                    <Lock className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-white/10 transition-colors" size={100} />
                </div>
            </div>

            {/* Config Panel */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Manual API Integration Section */}
                    <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-sm space-y-8">
                        
                        {/* 1. Google Gemini Section (Manual Trigger Input) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Key size={20} />
                                </div>
                                <h3 className="text-lg font-black text-ink uppercase tracking-tight">Integrasi Google Gemini</h3>
                            </div>
                            
                            <div className="relative">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Kunci API Gemini (Otentikasi Manual)</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <div className="absolute left-4 top-3.5 text-purple-400">
                                            <BrainCircuit size={18} />
                                        </div>
                                        <input 
                                            type="text" 
                                            readOnly
                                            value={hasGeminiKey ? '••••••••••••••••••••••••••••••••' : ''}
                                            onClick={handleSelectKey}
                                            placeholder="Klik 'Hubungkan' untuk memasukkan kunci..."
                                            className="w-full pl-12 pr-4 p-3.5 border-2 border-gray-100 rounded-xl font-mono text-sm bg-gray-50 focus:border-purple-400 outline-none cursor-pointer hover:bg-white transition-all"
                                        />
                                        {hasGeminiKey && (
                                            <div className="absolute right-4 top-4">
                                                <CheckCircle size={16} className="text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleSelectKey}
                                        className="bg-purple-600 text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <RefreshCw size={16} />
                                        {hasGeminiKey ? 'Perbarui' : 'Hubungkan'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 italic px-1 flex items-center gap-1">
                                    <AlertCircle size={10} /> Otentikasi manual melalui dialog aman Google AI Studio.
                                </p>
                            </div>
                        </div>

                        {/* 2. TinyMCE Section (Manual Text Input) */}
                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Edit3 size={20} />
                                </div>
                                <h3 className="text-lg font-black text-ink uppercase tracking-tight">TinyMCE Visual Editor</h3>
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">API Key Tiny.cloud</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-blue-400">
                                        <Key size={18} />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={settings?.tinymceApiKey || ''} 
                                        onChange={e => setSettings(prev => prev ? {...prev, tinymceApiKey: e.target.value} : null)}
                                        placeholder="Masukkan API Key TinyMCE secara manual..."
                                        className="w-full pl-12 pr-4 p-3.5 border-2 border-gray-100 rounded-xl font-mono text-sm focus:border-blue-400 outline-none bg-gray-50 focus:bg-white transition-all"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 italic px-1 flex items-center gap-1">
                                    <ExternalLink size={10} /> Digunakan untuk editor teks kaya (Rich Text Editor) pada penulisan berita.
                                </p>
                            </div>
                        </div>

                        {/* 3. AI Behavior Settings */}
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Settings2 size={18} className="text-accent" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-gray-600">Konfigurasi Persona AI</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
                                        <Zap size={14} className="text-accent" />
                                        Instruksi Sistem (Redaktur & Bot)
                                    </label>
                                    <textarea 
                                        value={settings?.aiSystemInstruction || ''}
                                        onChange={e => setSettings(prev => prev ? {...prev, aiSystemInstruction: e.target.value} : null)}
                                        rows={5}
                                        className="w-full p-4 border-2 border-gray-100 rounded-2xl font-serif text-sm focus:border-purple-500 focus:ring-0 outline-none bg-gray-50/50 transition-all resize-none"
                                        placeholder="Tentukan gaya bahasa dan etika jurnalisme AI Anda..."
                                    />
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
                            {saving ? 'Sinkronisasi...' : 'Simpan Perubahan API'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Support Section */}
        <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-amber-900">
                <AlertCircle size={24} className="shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                    <strong>Penting:</strong> Pastikan API Key Gemini yang Anda pilih berasal dari proyek dengan <strong>Billing Aktif</strong> untuk mendukung fitur Auto-Pilot yang berjalan di latar belakang secara intensif.
                </p>
            </div>
            <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-amber-200 text-amber-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-300 transition-all whitespace-nowrap"
            >
                Cek Billing Google <ExternalLink size={14} />
            </a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApiManagement;
