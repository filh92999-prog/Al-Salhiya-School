import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI features will not work.");
}

export const ai = new GoogleGenAI({
    apiKey: apiKey || "dummy-key-to-prevent-crash",
});

export const MODEL = "gemini-3-flash-preview";

export async function generateText(prompt: string, systemInstruction?: string) {
    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text || "";
    } catch (e) {
        console.error("AI Generation Error", e);
        return "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
    }
}
