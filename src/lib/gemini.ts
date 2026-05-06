/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const MODEL = "gemini-3-flash-preview";

export async function generateText(prompt: string, systemInstruction?: string, responseSchema: any = null) {
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
    return `عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. القطأ: ${e.message || 'غير معروف'}`;
  }
}

export async function generateImage(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in the response");
  } catch (e: any) {
    console.error("Image Generation Error", e);
    throw e;
  }
}

let activeVideoOperation: any = null;

export async function generateVideo(prompt: string) {
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    activeVideoOperation = operation;

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
      activeVideoOperation = operation;
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (downloadLink && process.env.GEMINI_API_KEY) {
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
      });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    return null;
  } catch (e: any) {
    console.error("Video Generation Error", e);
    throw e;
  }
}
