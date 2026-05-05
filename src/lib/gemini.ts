/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI features will not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key-to-prevent-crash" });

export const MODEL = "gemini-2.5-flash"; // fall back to standard model

export async function generateText(prompt: string, systemInstruction?: string, responseSchema: any = null) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: responseSchema ? "application/json" : undefined,
        responseSchema: responseSchema,
      }
    });
    return response.text || "";
  } catch (e) {
    console.error("AI Generation Error", e);
    return "عذراً، المعلم الذكي غير متاح الآن.";
  }
}

