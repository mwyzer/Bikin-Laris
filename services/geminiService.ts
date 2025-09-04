
import { GoogleGenAI, Type } from "@google/genai";
import type { ProductInfo, GeneratedContent } from '../types';
import type { ThemeId } from '../constants';
import { THEMES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const generatePromotionalContent = async (
  productInfo: ProductInfo,
  themeId: ThemeId
): Promise<{ content: GeneratedContent; imageUrl: string }> => {
  try {
    const textPrompt = `
      Anda adalah seorang ahli marketing digital yang sangat berpengalaman untuk UMKM di Indonesia.
      Tugas Anda adalah membuat materi promosi yang lengkap berdasarkan informasi produk berikut.

      **Informasi Produk:**
      - Nama Produk: ${productInfo.productName}
      - Deskripsi: ${productInfo.description}
      - Target Audiens: ${productInfo.targetAudience}
      - Info Promo: ${productInfo.promo}

      **Tugas:**
      1.  **Buat Caption:** Buatkan caption promosi yang menarik, persuasif, dan disesuaikan untuk setiap platform: WhatsApp, Instagram, Facebook, Threads, dan Marketplace.
          - **WhatsApp:** Buat pesan yang personal, ramah, dan langsung ke poin, diakhiri dengan ajakan untuk bertanya atau memesan.
          - **Instagram:** Fokus pada visual, gunakan emoji, storytelling singkat, dan sertakan 5-7 hashtag yang relevan dan populer.
          - **Facebook:** Buat caption yang sedikit lebih detail, bisa menyertakan cerita di balik produk, dan ajak audiens berdiskusi.
          - **Threads:** Buat utas singkat (2-3 post) yang engaging, ringan, dan memancing percakapan. Mulai dengan hook yang kuat.
          - **Marketplace:** Fokus pada keunggulan produk (USP), detail teknis/spesifikasi, dan gunakan format daftar (list) agar mudah dibaca.
      2.  **Buat Kalender Konten:** Buatkan jadwal posting konten sederhana selama 7 hari untuk mempromosikan produk ini. Rencana ini harus bervariasi, menarik, dan bertujuan meningkatkan engagement. Berikan ide konten spesifik untuk setiap hari.

      Pastikan output Anda dalam format JSON yang valid dan sesuai dengan skema yang diberikan.
    `;

    const contentGenerationPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.OBJECT,
              properties: {
                whatsapp: { type: Type.STRING, description: "Caption untuk WhatsApp" },
                instagram: { type: Type.STRING, description: "Caption untuk Instagram dengan hashtags" },
                facebook: { type: Type.STRING, description: "Caption untuk Facebook" },
                threads: { type: Type.STRING, description: "Caption untuk Threads dalam bentuk utas" },
                marketplace: { type: Type.STRING, description: "Caption untuk Marketplace" },
              },
            },
            calendar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "Hari ke- (e.g., 'Hari 1')" },
                  idea: { type: Type.STRING, description: "Ide konten untuk hari itu" },
                },
              },
            },
          },
        },
      },
    });

    const selectedTheme = THEMES.find(t => t.id === themeId);
    const imagePrompt = `High-quality, professional promotional image for an Indonesian MSME product. Product: "${productInfo.productName}". Description: "${productInfo.description}". Visual style: ${selectedTheme?.prompt}. The image should be visually appealing and suitable for social media. Do not include any text in the image.`;

    const imageGenerationPromise = ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const [contentResponse, imageResponse] = await Promise.all([
      contentGenerationPromise,
      imageGenerationPromise
    ]);
    
    const content: GeneratedContent = JSON.parse(contentResponse.text);

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
        throw new Error("Gagal membuat gambar poster.");
    }
    const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { content, imageUrl };

  } catch (error) {
    console.error("Error generating promotional content:", error);
    throw new Error("Gagal membuat konten promosi. Silakan coba lagi.");
  }
};
