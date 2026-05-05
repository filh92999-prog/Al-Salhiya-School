import React, { useState } from 'react';
import { generateText } from '../../lib/gemini';
import { FileSignature, Loader2, PenTool, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CircularDrafter() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('المعلمين والإداريين');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDraft = async () => {
    if (!topic) return;
    setIsLoading(true);
    setResult(null);
    setCopied(false);

    const prompt = `أنت مدير مدرسة الصالحية. قم بصياغة تعميم داخلي رسمي ومهني بخصوص "${topic}".
    الفئة المستهدفة من التعميم: "${audience}".
    يجب أن يتضمن:
    - البسملة والتحية الرسمية التابعة لوزارة التعليم السعودية.
    - موضوع التعميم بشكل واضح وحازم ومهذب.
    - التوجيهات التفصيلية.
    - الختم والتوقيع (مدير مدرسة الصالحية).
    
    الرجاء التنسيق بصيغة بسيطة وجاهزة للطباعة، بدون استخدام كود برمجي. استخدم Markdown لعرض العناوين والخط الغامق.`;

    const text = await generateText(prompt);
    setResult(text);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
     if(result) {
         navigator.clipboard.writeText(result);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
     }
  };

  return (
    <div className="flex flex-col h-full bg-white">
       <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                 <FileSignature className="w-6 h-6 text-blue-600" />
                 أداة صياغة التعاميم الرسمية
              </h2>
              <p className="text-slate-500">صياغة سريعة ودقيقة للتعاميم والقرارات الإدارية بمدرسة الصالحية.</p>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          
          <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">موضوع التعميم</label>
                <textarea 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="مثال: الالتزام بمواعيد الانصراف، تفعيل المنصة، تنظيم المناوبة..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none font-medium h-24"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الفئة المستهدفة</label>
                <select 
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-medium"
                >
                    <option value="المعلمين والإداريين">المعلمين والإداريين</option>
                    <option value="الطلاب وأولياء الأمور">الطلاب وأولياء الأمور</option>
                    <option value="الفريق الإداري فقط">الفريق الإداري فقط</option>
                    <option value="لجنة الانضباط والموجهين">لجنة الانضباط والموجهين</option>
                </select>
             </div>

             <button 
                onClick={handleDraft}
                disabled={!topic || isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl disabled:bg-slate-300 transition-all shadow flex items-center justify-center gap-2 mt-4"
             >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />}
                صياغة التعميم
             </button>
          </div>

          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col">
              <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                  <span className="font-bold text-slate-600 text-sm">مسودة التعميم</span>
                  {result && (
                      <button onClick={copyToClipboard} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded flex items-center gap-2 text-sm font-bold transition-colors">
                          {copied ? <Check className="w-4 h-4 text-emerald-600"/> : <Copy className="w-4 h-4" />} 
                          {copied ? 'تم النسخ' : 'نسخ النص'}
                      </button>
                  )}
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto w-full">
                  {isLoading ? (
                     <div className="h-full flex items-center justify-center text-slate-400">
                         <div className="flex flex-col items-center">
                             <FileSignature className="w-12 h-12 mb-3 opacity-50 animate-pulse" />
                             <p>تتم الصياغة بأسلوب رسمي معتمد...</p>
                         </div>
                     </div>
                  ) : result ? (
                     <div className="bg-white p-8 md:p-12 shadow max-w-2xl mx-auto border border-slate-100 print:shadow-none print:p-0">
                         {/* Arabic Letterhead Layout */}
                         <div className="text-center mb-8 border-b-2 border-slate-800 pb-6 text-slate-800">
                             <h4 className="font-bold">المملكة العربية السعودية</h4>
                             <h4 className="font-bold">وزارة التعليم</h4>
                             <h4 className="font-bold">إدارة التعليم - مدرسة الصالحية</h4>
                         </div>
                         <div className="prose prose-slate max-w-none text-slate-800 leading-loose prose-h1:text-xl prose-h2:text-lg prose-p:font-semibold">
                            <ReactMarkdown>{result}</ReactMarkdown>
                         </div>
                     </div>
                  ) : (
                     <div className="h-full flex items-center justify-center text-slate-400">
                         <p>أدخل الموضوع واضغط أدناه لبدء الصياغة</p>
                     </div>
                  )}
              </div>
          </div>
       </div>
    </div>
  );
}
