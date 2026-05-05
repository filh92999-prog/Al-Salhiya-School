const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI features will not work.");
}

export const MODEL = "gemini-1.5-flash";

export async function generateText(prompt: string, systemInstruction?: string, responseSchema: any = null) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const payload: any = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  
  if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  if (responseSchema) {
    payload.generationConfig = { responseMimeType: "application/json", responseSchema: responseSchema };
  }

  try {
    const res = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) 
    });
    if (!res.ok) {
        const errText = await res.text();
        console.error("API Error Response:", res.status, errText);
        throw new Error(`API Error: ${res.status}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (e) {
    console.error("AI Generation Error", e);
    return "عذراً، المعلم الذكي غير متاح الآن.";
  }
}

