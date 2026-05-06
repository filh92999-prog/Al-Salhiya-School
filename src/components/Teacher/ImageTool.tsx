import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Download, Sparkles } from 'lucide-react';
import { generateText, generateImage } from '../../lib/gemini';

export default function ImageTool() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
        const translatedPrompt = await generateText(`مطلوب توليد صورة تعليمية. النص الأصلي: "${prompt}". اكتب لي وصفاً دقيقاً باللغة الإنجليزية (English Prompt) لإنشاء صورة احترافية. اكتب الوصف فقط باللغة الإنجليزية بدون أي مقدمات.`);
        
        // Use gemini for image generation natively
        const b64Url = await generateImage(translatedPrompt + " educational illustration high quality");
        setImageUrl(b64Url);
    } catch (e) {
        console.error(e);
        alert("حدث خطأ في توليد الصورة");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
       <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
             <ImageIcon className="w-6 h-6 text-indigo-500" />
             أداة توليد وتعديل الصور - بنانا بنانا برو
          </h2>
          <p className="text-slate-500">قم بتوليد صور توضيحية باستخدام الذكاء الاصطناعي (بنانا بنانا برو) لاستخدامها في عروضك ودروسك.</p>
       </div>

       <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Controls */}
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                   <h3 className="font-bold text-lg text-slate-800">توليد صورة جديدة</h3>
                   <textarea 
                     value={prompt}
                     onChange={e => setPrompt(e.target.value)}
                     placeholder="صف الصورة التعليمية التي تريدها (مثال: خلية نباتية تحت المجهر مع إضاءة جيدة)..."
                     className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none resize-none font-medium text-slate-800 h-32"
                   />
                   <button 
                      onClick={handleGenerate}
                      disabled={!prompt || isGenerating}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl disabled:bg-slate-300 transition-all shadow flex items-center justify-center gap-2"
                   >
                      {isGenerating ? 'جاري التوليد...' : 'توليد الصورة'}
                      {!isGenerating && <Sparkles className="w-4 h-4" />}
                   </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed text-center">
                   <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                   <h3 className="font-bold text-slate-700 mb-1">رفع صورة موجودة (محاكاة)</h3>
                   <p className="text-sm text-slate-500 mb-4">ارفع صورة من جهازك لتعديلها لاحقاً</p>
                   <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                      اختيار ملف
                   </button>
                </div>
             </div>

             {/* Preview */}
             <div className="bg-slate-100 rounded-3xl border border-slate-200 flex flex-col overflow-hidden min-h-[400px]">
                <div className="p-4 bg-slate-200/50 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-600 text-sm">معاينة الصورة</span>
                    {imageUrl && (
                        <a href={imageUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-bold">
                            <Download className="w-4 h-4" /> تحميل
                        </a>
                    )}
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative p-4 gap-4">
                    {isGenerating ? (
                        <div className="text-indigo-500 flex flex-col items-center animate-pulse">
                            <Sparkles className="w-10 h-10 mb-2" />
                            <span className="font-bold">يتم الآن رسم الصورة باستخدام بنانا بنانا برو...</span>
                        </div>
                    ) : imageUrl ? (
                        <>
                            <p className="text-sm text-indigo-600 font-bold flex items-center gap-2 bg-indigo-50 w-fit px-3 py-1.5 rounded-lg border border-indigo-100 self-start">
                                <Sparkles className="w-4 h-4"/> تم توليد هذه الصورة حصرياً بواسطة نموذج بنانا بنانا برو
                            </p>
                            <img src={imageUrl} alt="Generated using Banana Banana Pro" className="rounded-xl shadow-lg w-full h-auto object-contain max-h-min" />
                        </>
                    ) : (
                        <div className="text-slate-400 text-center">
                            <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                            <p>لم يتم توليد صورة بعد.</p>
                        </div>
                    )}
                </div>
             </div>

          </div>
       </div>
    </div>
  );
}
