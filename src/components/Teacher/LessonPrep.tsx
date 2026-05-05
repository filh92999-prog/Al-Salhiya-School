import React, { useState } from 'react';
import { generateText } from '../../lib/gemini';
import { BookOpen, Sparkles, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function LessonPrep() {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic || !grade) return;
    setIsLoading(true);
    setResult(null);

    const prompt = `أنا معلم في مدرسة الصالحية بالمملكة العربية السعودية. 
    أريد تحضير دورة/درس منهجي متكامل عن "${topic}" لطلاب الصف "${grade}".
    
    الرجاء إعداد خطة درس تشمل:
    - الأهداف التعليمية
    - الاستراتيجيات المستخدمة
    - التهيئة الحافزة
    - عرض الدرس (خطوات التنفيذ)
    - التقويم الختامي
    - الواجب المنزلي
    
    قدمها بتنسيق Markdown بشكل أنيق وواضح.`;

    const text = await generateText(prompt);
    setResult(text);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
       <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
             <BookOpen className="w-6 h-6 text-gold-500" />
             مساعد تحضير الدروس الذكي
          </h2>
          <p className="text-slate-500">أدخل موضوع الدرس والصف وسيقوم الذكاء الاصطناعي بصياغة تحضير متكامل وفق المنهج.</p>
       </div>

       <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
             {!result && !isLoading && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">موضوع الدرس</label>
                       <input 
                          type="text"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="مثال: دورة حياة النبات، الفاعل، جدول الضرب..."
                          className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-gold-500 focus:bg-white outline-none font-medium transition-all"
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">الصف الدراسي</label>
                       <input 
                          type="text"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          placeholder="مثال: الثالث الابتدائي، الثاني المتوسط..."
                          className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-gold-500 focus:bg-white outline-none font-medium transition-all"
                       />
                   </div>
                   <button 
                      onClick={handleGenerate}
                      disabled={!topic || !grade}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl disabled:bg-slate-300 transition-all shadow-md flex items-center justify-center gap-2 text-lg"
                   >
                      <Sparkles className="w-5 h-5" />
                      توليد خطة الدرس
                   </button>
                </div>
             )}

             {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Loader2 className="w-12 h-12 animate-spin text-gold-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">جاري إعداد خطة الدرس...</h3>
                    <p>يرجى الانتظار، يقوم المساعد الذكي بتنسيق الأهداف والاستراتيجيات.</p>
                </div>
             )}

             {result && (
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm relative">
                    <button 
                       onClick={() => { setTopic(''); setGrade(''); setResult(null); }}
                       className="absolute left-8 top-8 text-sm font-bold text-slate-500 hover:text-slate-800"
                    >
                       إعداد درس جديد
                    </button>
                    <div className="prose prose-blue max-w-none font-medium leading-relaxed mt-8">
                       <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
