/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return "";
};

const apiKey = getApiKey();

if (!apiKey) {
    console.warn("تنبيه: مفتاح GEMINI_API_KEY غير معرف. تأكد من إضافته في إعدادات Vercel باسم VITE_GEMINI_API_KEY");
}

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key-to-prevent-crash" });
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

export const MODEL = "gemini-2.5-flash"; // استخدم الإصدار الأحدث

export async function generateText(prompt: string, systemInstruction?: string, responseSchema: any = null) {
  if (!apiKey || apiKey.trim() === "undefined" || apiKey.trim() === "") {
     console.error("No API key available.");
     return "عذراً، يجب إعداد مفتاح VITE_GEMINI_API_KEY في النظام لكي يعمل الذكاء الاصطناعي.";
  }

  if (!ai) {
     return "عذراً، لم يتم تهيئة المساعد الذكي بنجاح.";
  }

  try {
    const cleanKey = apiKey.replace(/['"]/g, '').trim();
    // Re-initialize with clean key to be safe
    const client = new GoogleGenAI({ apiKey: cleanKey });
    
    let config: any = {};
    if (systemInstruction) config.systemInstruction = systemInstruction;
    if (responseSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }

    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: Object.keys(config).length > 0 ? config : undefined
    });
    
    return response.text || "";
  } catch (e: any) {
    console.error("AI Generation Error", e);
    return `عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. القطأ: ${e.message || 'غير معروف'}`;
  }
}
