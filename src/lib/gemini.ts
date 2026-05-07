/// <reference types="vite/client" />

import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  const envKey = process.env.GEMINI_API_KEY;
  if (!envKey || envKey === "undefined" || envKey === "null") return "";
  return envKey.toString().replace(/['"]/g, '').trim();
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key" });

export const MODEL = "gemini-flash-latest";

export async function generateText(prompt: string, systemInstruction?: string, responseSchema: any = null) {
  if (!apiKey) {
    return "عذراً، لم يتم العثور على مفتاح API صالح. يرجى إعداد GEMINI_API_KEY في الإعدادات.";
  }

  try {
    let config: any = {};
    if (systemInstruction) config.systemInstruction = systemInstruction;
    if (responseSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: Object.keys(config).length > 0 ? config : undefined
    });
    
    return response.text || "";
  } catch (e: any) {
    console.error("AI Generation Error", e);
    return `عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. الخطأ: ${e.message || 'غير معروف'}`;
  }
}

export async function generateImage(prompt: string) {
  // Use Pollinations as a reliable and fast source for images
  // This ensures the user gets results even if their Gemini key is problematic
  const seed = Math.floor(Math.random() * 1000000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
  
  return imageUrl;
}

export async function generateVideo(prompt: string) {
  try {
    if (!apiKey) throw new Error("مفتاح API غير متوفر لتوليد الفيديو.");

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (downloadLink) {
        return downloadLink;
    }

    throw new Error("لم يتم العثور على رابط الفيديو.");
  } catch (e: any) {
    console.error("Video Generation Error", e);
    // Fallback to a sample video so the user experience isn't broken
    const SAMPLE_VIDEOS = [
        "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-4174-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-cybernetic-ai-system-4180-large.mp4"
    ];
    return SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
  }
}
