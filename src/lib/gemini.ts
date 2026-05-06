/// <reference types="vite/client" />

// هذا السطر يضمن قراءة المفتاح سواء كان باسم VITE_ أو الاسم العادي في Vercel
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
               import.meta.env.GEMINI_API_KEY || 
               (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

if (!apiKey) {
    console.warn("تنبيه: مفتاح GEMINI_API_KEY غير معرف. تأكد من إضافته في إعدادات Vercel باسم VITE_GEMINI_API_KEY");
}

export const MODEL = "gemini-1.5-flash"; // استخدم الإصدار المستقر

export async function generateText(prompt: string, systemInstruction?: string, responseSchema: any = null) {
  // استخدام الرابط المباشر لـ API كما في الكود الخاص بك
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  
  const payload: any = { 
    contents: [{ role: "user", parts: [{ text: prompt }] }] 
  };

  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  if (responseSchema) {
    payload.generationConfig = { 
      responseMimeType: "application/json", 
      responseSchema: responseSchema 
    };
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
    // استخراج النص من هيكل استجابة Google AI
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
  } catch (e) {
    console.error("AI Generation Error", e);
    return "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. تأكد من إعدادات مفتاح الـ API.";
  }
}
