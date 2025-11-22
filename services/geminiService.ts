
import { GoogleGenAI, Type } from "@google/genai";
import { fetchSettings } from "./newsService";

// Helper untuk mendapatkan client AI yang selalu up-to-date
// Prioritas: Env Variable -> Database Settings -> Null
const getAiClient = async (): Promise<GoogleGenAI | null> => {
  // 1. Cek Environment Variable (Hardcoded/Build time)
  if (process.env.API_KEY) {
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // 2. Cek Database Settings (Dynamic)
  try {
      const settings = await fetchSettings();
      if (settings.googleApiKey) {
          return new GoogleGenAI({ apiKey: settings.googleApiKey });
      }
  } catch (e) {
      console.error("Failed to fetch AI settings:", e);
  }

  return null;
};

export const generateEditorialDescription = async (title: string, content: string): Promise<string> => {
  const ai = await getAiClient();
  if (!ai) return "Fitur AI belum aktif. Mohon konfigurasi API Key di Pengaturan Admin.";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Bertindaklah sebagai editor senior surat kabar profesional bergaya "PamongRakyat".
      Buatkan ringkasan singkat (maksimal 2 kalimat) yang menarik, padat, dan menggunakan bahasa jurnalistik baku Indonesia yang elegan.
      
      Judul: ${title}
      Konten: ${content}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "Gagal menghasilkan deskripsi.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi AI.";
  }
};

export const askAiAssistant = async (query: string, context: string): Promise<string> => {
  const ai = await getAiClient();
  if (!ai) return "Maaf, fitur AI belum aktif.";

  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `
        Konteks Artikel: ${context}
        
        Pertanyaan Pembaca: ${query}
        
        Jawablah sebagai asisten berita yang cerdas dan netral.
      `
    });
    return response.text || "Tidak ada jawaban.";
  } catch (e) {
    return "Gagal memproses pertanyaan.";
  }
};

export const generateArticleContent = async (topic: string): Promise<{title: string, content: string}> => {
    const ai = await getAiClient();
    if (!ai) throw new Error("API Key belum dikonfigurasi di Admin Panel.");

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tuliskan draf artikel berita fiktif namun realistis tentang topik: "${topic}".
        Gunakan gaya bahasa jurnalistik formal Indonesia.
        Format output JSON: { "title": "Judul Headline", "content": "Isi berita minimal 3 paragraf..." }`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING }
                }
            }
        }
    });

    const text = response.text;
    if(!text) throw new Error("Empty response");
    return JSON.parse(text);
};

export const continueArticle = async (currentContent: string): Promise<string> => {
  const ai = await getAiClient();
  if (!ai) throw new Error("API Key AI belum diset.");
  
  const model = "gemini-2.5-flash";
  const prompt = `
    Anda adalah jurnalis senior. Lanjutkan artikel berita berikut ini.
    Tambahkan 1 atau 2 paragraf yang relevan, mengalir, dan menggunakan gaya bahasa berita formal.
    JANGAN mengulang kalimat terakhir. Langsung tulis kelanjutannya dalam format HTML paragraf (<p>...</p>).

    Konten Saat Ini:
    ${currentContent}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "";
};

export const improveWritingStyle = async (currentContent: string): Promise<string> => {
  const ai = await getAiClient();
  if (!ai) throw new Error("API Key AI belum diset.");

  const model = "gemini-2.5-flash";
  const prompt = `
    Bertindaklah sebagai editor koran. Perbaiki tata bahasa, ejaan, dan gaya penulisan teks berikut agar terlihat profesional, objektif, dan enak dibaca.
    Pertahankan makna aslinya. Output harus dalam format HTML yang rapi.

    Teks Asli:
    ${currentContent}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || currentContent;
};
