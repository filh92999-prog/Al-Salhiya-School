import React, { useState } from 'react';
import { generateText } from '../../lib/gemini';
import { BarChart, Loader2, Sparkles, Filter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProblemAnalyzer() {
  const [issue, setIssue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!issue) return;
    setIsLoading(true);
    setResult(null);

    const prompt = `بصفتك مستشاراً إدارياً خبيراً لمدير مدرسة الصالحية، أرجو تحليل المشكلة التالية:
    "${issue}"
    
    الرجاء تقديم تقرير إداري مفصل يحتوي على:
    1. تحليل الأسباب الجذرية (Root Cause Analysis).
    2. التأثير المتوقع على البيئة التعليمية.
    3. 3 حلول عملية قابلة للتطبيق الفوري.
    4. مؤشرات الأداء (KPIs) لضمان عدم تكرار المشكلة.
    
    قدم التقرير بتنسيق Markdown احترافي، مناسب للإدارة العليا.`;

    const text = await generateText(prompt);
    setResult(text);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
       <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                 <BarChart className="w-6 h-6 text-emerald-600" />
                 المحلل الإداري الذكي
              </h2>
              <p className="text-slate-500">لتحليل المشكلات המدرسية وإصدار تقارير دعم اتخاذ القرار.</p>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
             {!result && !isLoading && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                   <label className="block text-sm font-bold text-slate-700 mb-2">وصف المشكلة / الموقف</label>
                   <textarea 
                     value={issue}
                     onChange={e => setIssue(e.target.value)}
                     placeholder="مثال: لوحظ كثرة غياب طلاب المرحلة المتوسطة يوم الخميس، أو ضعف الانضباط في الساحة أثناء الفسحة..."
                     className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none resize-none font-medium text-slate-800 h-40 transition-all"
                   />
                   <button 
                      onClick={handleAnalyze}
                      disabled={!issue}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl disabled:bg-slate-300 transition-all shadow flex items-center justify-center gap-2 text-lg"
                   >
                      <Sparkles className="w-5 h-5" />
                      إجراء التحليل المتقدم
                   </button>
                </div>
             )}

             {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">جاري تحليل البيانات...</h3>
                    <p>المستشار الإداري يقوم بتشخيص المشكلة وصياغة الحلول.</p>
                </div>
             )}

             {result && (
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm relative">
                    <button 
                       onClick={() => { setIssue(''); setResult(null); }}
                       className="absolute left-8 top-8 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
                    >
                       تحليل مشكلة أخرى
                    </button>
                    <div className="prose prose-emerald max-w-none font-medium leading-relaxed mt-4">
                       <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
