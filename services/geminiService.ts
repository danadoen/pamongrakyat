
import { GoogleGenAI, Type } from "@google/genai";
import { fetchSettings } from "./newsService";

<<<<<<< HEAD
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

=======
const getAiClient = (): GoogleGenAI => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateArticleImage = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `Professional journalism photography for a major newspaper, high resolution, realistic style: ${prompt}` }],
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Gagal generate gambar.");
};

export const researchAndGenerateViralArticles = async (): Promise<any[]> => {
  const ai = getAiClient();
  const settings = await fetchSettings();
  const systemInstruction = settings.aiSystemInstruction || "Anda adalah redaktur senior portal berita PamongRakyat.";

  // Step 1: Research Trending Topics
  const searchResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: "Analisis dan temukan 5 topik berita paling viral, trending, dan terverifikasi di Indonesia hari ini. Berikan ringkasan akurat untuk masing-masing topik tersebut.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const trends = searchResponse.text;

  // Step 2: Generate Structured Articles
  const articlesResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Berdasarkan tren terkini: ${trends}, buatkan 5 artikel berita yang lengkap dan mendalam. 
    Setiap artikel wajib menyertakan: Judul, Konten HTML (min 4 paragraf), Kategori (Pilih: Politik & Pemerintahan, Pelayanan Publik, Hukum & Keadilan, Ekonomi Rakyat, Budaya, Destinasi Wisata), Ringkasan, dan Image Prompt (deskripsi visual untuk generator gambar).`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING },
            summary: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["title", "content", "category", "summary", "imagePrompt"]
        }
      }
    }
  });

  return JSON.parse(articlesResponse.text || "[]");
};

export const generateEditorialDescription = async (title: string, content: string): Promise<string> => {
  const ai = getAiClient();
  const settings = await fetchSettings();
>>>>>>> 81afd11 (Update admin pages, services, and editors)
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan lead (ringkasan) jurnalistik pendek untuk berita: ${title}. Isi: ${content}`,
      config: {
          systemInstruction: settings.aiSystemInstruction
      }
    });
    return response.text || "Gagal menghasilkan deskripsi.";
  } catch (error) {
    return "Terjadi kesalahan.";
  }
};

export const askAiAssistant = async (query: string, context: string): Promise<string> => {
<<<<<<< HEAD
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

=======
  const ai = getAiClient();
  const settings = await fetchSettings();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Konteks Berita: ${context}\nPertanyaan Pembaca: ${query}`,
    config: {
        systemInstruction: `Anda adalah asisten AI PamongRakyat. Jawab pertanyaan pembaca berdasarkan konteks berita yang diberikan dengan nada sopan dan informatif. ${settings.aiSystemInstruction}`
    }
  });
  return response.text || "Mohon maaf, asisten sedang sibuk.";
};

export const continueArticle = async (currentContent: string): Promise<string> => {
  const ai = getAiClient();
  const settings = await fetchSettings();
>>>>>>> 81afd11 (Update admin pages, services, and editors)
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Lanjutkan penulisan artikel ini dalam format HTML (gunakan <p>): ${currentContent}`,
    config: { systemInstruction: settings.aiSystemInstruction }
  });
  return response.text || "";
};

export const improveWritingStyle = async (currentContent: string): Promise<string> => {
<<<<<<< HEAD
  const ai = await getAiClient();
  if (!ai) throw new Error("API Key AI belum diset.");

  const model = "gemini-2.5-flash";
  const prompt = `
    Bertindaklah sebagai editor koran. Perbaiki tata bahasa, ejaan, dan gaya penulisan teks berikut agar terlihat profesional, objektif, dan enak dibaca.
    Pertahankan makna aslinya. Output harus dalam format HTML yang rapi.

    Teks Asli:
    ${currentContent}
  `;

=======
  const ai = getAiClient();
  const settings = await fetchSettings();
>>>>>>> 81afd11 (Update admin pages, services, and editors)
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tulis ulang artikel berikut agar memiliki gaya bahasa jurnalistik yang lebih profesional (Format HTML): ${currentContent}`,
    config: { systemInstruction: settings.aiSystemInstruction }
  });
  return response.text || currentContent;
};
<<<<<<< HEAD
=======

export const generateArticleContent = async (topic: string): Promise<{title: string, content: string}> => {
    const ai = getAiClient();
    const settings = await fetchSettings();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tulis draft berita lengkap tentang: ${topic}. Balas dalam format JSON {title, content}`,
        config: {
            systemInstruction: settings.aiSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: { title: { type: Type.STRING }, content: { type: Type.STRING } }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};
>>>>>>> 81afd11 (Update admin pages, services, and editors)
