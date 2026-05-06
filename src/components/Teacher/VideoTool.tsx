import React, { useState } from 'react';
import { Video, Upload, Download, Sparkles, Key } from 'lucide-react';
import { generateText, generateVideo } from '../../lib/gemini';

const SAMPLE_VIDEOS = [
    "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-4174-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-cybernetic-ai-system-4180-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-lines-in-space-26154-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4"
];

export default function VideoTool() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAPI, setUseAPI] = useState(true);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
        const translatedPrompt = await generateText(`أريد إنشاء فيديو. النص الأصلي: "${prompt}". اكتب لي وصفاً دقيقاً باللغة الإنجليزية لإنشاء فيديو سينمائي احترافي. الوصف فقط.`);

        if (useAPI) {
            // Real Veo API Generation
            const blobUrl = await generateVideo(translatedPrompt);
            if (blobUrl) setVideoUrl(blobUrl);
        } else {
            // Simulated fast generation (Picking a relevant generic video)
            await new Promise(r => setTimeout(r, 2000));
            setVideoUrl(SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)]);
        }
    } catch (e) {
        console.error(e);
        alert("حدث خطأ في التوليد. الرجاء المحاولة مجدداً.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
       <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
             <Video className="w-6 h-6 text-rose-500" />
             أداة إنشاء فيديو حقيقي بالذكاء الاصطناعي (Veo)
          </h2>
          <p className="text-slate-500">قم بتوليد مقاطع فيديو سينمائية باستخدام نموذج Veo لاستخدامها في الدروس والتفاعل.</p>
       </div>

       <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Controls */}
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                   <div className="flex justify-between items-center">
                       <h3 className="font-bold text-lg text-slate-800">توليد فيديو جديد</h3>
                       <div className="flex items-center gap-2 text-sm">
                           <input type="checkbox" id="pro-mode" checked={useAPI} onChange={(e) => setUseAPI(e.target.checked)} className="rounded text-rose-500 focus:ring-rose-500" />
                           <label htmlFor="pro-mode" className="text-slate-600 font-bold">توليد فعلي (Veo - يأخذ دقيقة)</label>
                       </div>
                   </div>

                   <textarea 
                     value={prompt}
                     onChange={e => setPrompt(e.target.value)}
                     placeholder="صف مشهد الفيديو الجميل الذي تريد توليده... (مثال: محيط يعج بالحياة تحت الماء مع أسماك ملونة)"
                     className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none resize-none font-medium text-slate-800 h-32"
                   />
                   <button 
                      onClick={handleGenerate}
                      disabled={!prompt || isGenerating}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl disabled:bg-slate-300 transition-all shadow flex items-center justify-center gap-2"
                   >
                      {isGenerating ? 'جاري تصيير الفيديو... (قد يستغرق 1-2 دقائق)' : 'توليد الفيديو'}
                      {!isGenerating && <Sparkles className="w-4 h-4" />}
                   </button>
                </div>

                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 border-dashed text-center">
                   <p className="text-sm text-rose-600 font-medium mb-2">
                       تنبيه: التوليد الفعلي للفيديو يستهلك الكثير من الموارد وقد يستغرق وقتاً طويلاً. يمكنك إيقاف خيار "توليد فعلي" للحصول على فيديو تجريبي سريع.
                   </p>
                </div>
             </div>

             {/* Preview */}
             <div className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden min-h-[400px]">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                    <span className="font-bold text-slate-300 text-sm">معاينة الفيديو</span>
                    {videoUrl && (
                        <a href={videoUrl} target="_blank" rel="noreferrer" className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-sm font-bold">
                            <Download className="w-4 h-4" /> تحميل
                        </a>
                    )}
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative p-4 gap-4">
                    {isGenerating ? (
                        <div className="text-rose-400 flex flex-col items-center animate-pulse text-center">
                            <Sparkles className="w-10 h-10 mb-2 mx-auto" />
                            <span className="font-bold mb-1">يتم الآن توليد الفيديو بواسطة 🌟 Google Veo</span>
                            <span className="text-sm opacity-70">المعالجة بالذكاء الاصطناعي معقدة، يرجى الانتظار...</span>
                        </div>
                    ) : videoUrl ? (
                        <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            loop 
                            className="rounded-xl w-full h-auto max-h-[300px] object-cover shadow-2xl border border-slate-700"
                        />
                    ) : (
                        <div className="text-slate-500 text-center">
                            <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
                            <p>لم يتم توليد فيديو بعد.</p>
                        </div>
                    )}
                </div>
             </div>

          </div>
       </div>
    </div>
  );
}
