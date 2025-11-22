import React, { useState } from 'react';
import { Sparkles, Send, BrainCircuit, AlertTriangle } from 'lucide-react';

// Mock function untuk simulasi panggilan ke API AI
// Di aplikasi nyata, ini akan memanggil backend Anda.
const getAiAnswer = async (question: string): Promise<string> => {
  console.log("Mengirim pertanyaan ke AI:", question);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulasi kondisi error jika pertanyaan mengandung kata "gagal"
      if (question.toLowerCase().includes("gagal")) {
        reject(new Error("Gagal memproses pertanyaan."));
      } else {
        resolve(`Tentu, saya akan jelaskan. Berdasarkan konteks artikel, istilah yang Anda tanyakan merujuk pada sebuah konsep hukum yang kompleks dimana... (jawaban AI akan muncul di sini).`);
      }
    }, 1500);
  });
};

const AiAssistantWidget: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    setError('');

    try {
      const aiResponse = await getAiAnswer(question);
      setAnswer(aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md my-8">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="text-purple-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Tanya Asisten AI Pamong</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Bingung dengan istilah hukum, data statistik, atau konteks politik di artikel ini? Tanyakan langsung pada sistem cerdas kami.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 pr-28 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition"
            placeholder="Ketik pertanyaan Anda di sini..."
            rows={2}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !question.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">
            <Send size={14} />
            Kirim
          </button>
        </div>
      </form>

      {(isLoading || answer || error) && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><BrainCircuit size={16} /> Jawaban Redaksi AI:</h4>
          {isLoading && <p className="text-sm text-gray-500 animate-pulse">Sedang memproses jawaban...</p>}
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2"><AlertTriangle size={16}/> {error}</p>}
          {answer && <p className="text-sm text-gray-800 leading-relaxed">{answer}</p>}
        </div>
      )}
    </div>
  );
};

export default AiAssistantWidget;