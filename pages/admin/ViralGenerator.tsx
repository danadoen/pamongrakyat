
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { autoPilot, AutoPilotLog } from '../../services/autoPilotService';
import { Sparkles, Zap, Radio, Power, History, Newspaper, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViralGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [isAutoPilot, setIsAutoPilot] = useState(autoPilot.getStatus());
  const [logs, setLogs] = useState<AutoPilotLog[]>(JSON.parse(localStorage.getItem('pamong_ai_logs') || '[]'));
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Sinkronisasi dengan service
    autoPilot.subscribe(
      (enabled: boolean) => setIsAutoPilot(enabled),
      (newLogs: AutoPilotLog[]) => setLogs(newLogs)
    );
  }, []);

  const toggleAutoPilot = () => {
    const newState = !isAutoPilot;
    setIsAutoPilot(newState);
    autoPilot.setStatus(newState);
  };

  const handleManualTrigger = async () => {
    setIsGenerating(true);
    await autoPilot.execute();
    setIsGenerating(false);
  };

  const getLogColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-300';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Control Panel */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Radio size={120} className={isAutoPilot ? 'animate-ping' : ''} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-all duration-500 ${isAutoPilot ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-gray-100 text-gray-400'}`}>
                <Zap size={40} className={isAutoPilot ? 'animate-pulse' : ''} />
              </div>
              <div>
                <h2 className="text-3xl font-black font-serif tracking-tight">Viral Engine <span className="text-accent">v3.0</span></h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${isAutoPilot ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                    {isAutoPilot ? 'System Running in Background' : 'System Standby'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleAutoPilot}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${isAutoPilot ? 'bg-accent text-white hover:bg-red-800' : 'bg-ink text-white hover:bg-gray-800'}`}
              >
                <Power size={18} />
                {isAutoPilot ? 'Nonaktifkan Auto-Pilot' : 'Aktifkan Auto-Pilot'}
              </button>
            </div>
          </div>

          {!isAutoPilot && (
            <div className="mt-8 text-center border-t border-dashed border-gray-200 pt-8">
               <button 
                 onClick={handleManualTrigger}
                 disabled={isGenerating}
                 className="bg-ink text-paper px-12 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl disabled:opacity-50"
               >
                 {isGenerating ? <Zap className="animate-spin" /> : <Sparkles className="text-accent" />}
                 {isGenerating ? 'Memproses Berita...' : 'Trigger Riset Manual'}
               </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terminal Logs */}
          <div className="lg:col-span-2 bg-ink text-green-400 p-6 rounded-2xl font-mono text-[11px] h-[550px] overflow-hidden flex flex-col border-4 border-gray-800 shadow-inner">
            <div className="flex items-center justify-between mb-4 border-b border-green-900/50 pb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAutoPilot ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-white font-bold uppercase tracking-widest text-[10px]">AI_SYSTEM_CORE_LOGS</span>
              </div>
              <History size={14} className="text-gray-600" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {logs.length === 0 && <p className="text-green-900 italic">No activity logs recorded yet.</p>}
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 ${getLogColor(log.type)}`}>
                  <span className="opacity-50 shrink-0">[{log.timestamp}]</span>
                  <p className="leading-relaxed">{log.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats / Feed */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 h-[550px] flex flex-col shadow-sm">
             <div className="flex items-center justify-between mb-6 border-b pb-3">
               <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-gray-500 flex items-center gap-2">
                 <Newspaper size={14} className="text-accent" /> Info Sistem
               </h3>
               {isAutoPilot && <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">AUTOPILOT ON</span>}
             </div>
             
             <div className="flex-1 space-y-6">
                <div className="p-4 bg-paper rounded-xl border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Interval Pemindaian</p>
                    <p className="text-xl font-serif font-black">Setiap 60 Menit</p>
                    <p className="text-xs text-gray-500 mt-1">Sistem akan terus mencari 5 berita viral terbaru tanpa henti.</p>
                </div>

                <div className="p-4 bg-paper rounded-xl border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Metode Riset</p>
                    <p className="text-sm font-bold">Gemini 3.0 Pro Search Grounding</p>
                    <p className="text-xs text-gray-500 mt-1">Menggunakan data real-time dari Google Search untuk validasi berita.</p>
                </div>

                <div className="p-4 bg-paper rounded-xl border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Status Database</p>
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                        <CheckCircle size={14} /> Sinkronisasi Aktif
                    </div>
                </div>
             </div>

             <button 
                onClick={() => navigate('/admin/articles')}
                className="mt-6 w-full py-4 bg-ink text-white text-xs font-bold rounded-xl hover:bg-accent transition-all flex items-center justify-center gap-2"
              >
                Cek Artikel Terbit
              </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViralGenerator;
