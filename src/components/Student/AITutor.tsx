import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Video, Loader2, Play, Pause, Maximize, Volume2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateText } from '../../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  type: 'text' | 'image' | 'video';
  mediaPrompt?: string;
}

const SYSTEM_INSTRUCTION = `أنت "المعلم الذكي الشامل" لمدرسة الصالحية، خبير في المناهج السعودية وتوجه الطلاب بحكمة. 
أنت تجيب على أسئلة الطلاب من الصف الثالث الابتدائي إلى الثالث المتوسط. 
تجنب إعطاء الإجابات النهائية فوراً؛ حاول توجيههم للتفكير.
إذا طلب المستخدم صورة، قم بالرد بمحتوى فيه وصف باللغة الإنجليزية للصورة المطلوبة محاطاً بهذا التنسيق: [IMAGE: prompt here].
ملاحظة: لا ترد باللغة الإنجليزية، فقط وصف الصورة يكون داخل التنسيق بأسلوب [IMAGE: english prompt].`;

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: 'أهلاً بك يا بطل في مدرسة الصالحية! أنا معلمك الذكي، كيف يمكنني مساعدتك اليوم في دراستك؟', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'text' | 'image' | 'video'>('text');
  const [mediaMode, setMediaMode] = useState<'text' | 'image' | 'video'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, type: 'text' | 'image' | 'video' = 'text') => {
    if (!text.trim()) return;

    let userMsgContent = text;
    if (type === 'image') userMsgContent = `[طلب صورة] ${text}`;
    if (type === 'video') userMsgContent = `[طلب فيديو] ${text}`;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsgContent, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setMediaMode('text');
    setIsLoading(true);
    setLoadingType(type);

    if (type === 'video') {
      try {
        const englishPromptResponse = await generateText(`مطلوب مقطع فيديو تعليمي عن: "${text}". اكتب لي وصفاً دقيقاً باللغة الإنجليزية (English Prompt) لإنشاء صورة سينمائية 8k وتفاصيل مذهلة. اكتب الوصف فقط باللغة الإنجليزية بدون أي مقدمات.`);
        const videoPrompt = englishPromptResponse.trim();
        
        const teacherResponse = await generateText(`طالب طلب فيديو عن "${text}". قم بالرد كمساعد ذكي يوضح أنه قام بإنشاء الفيديو بواسطة تقنية الذكاء الاصطناعي VEO-3. الرد يكون باللغة العربية وموجه لطالب في التعليم العام.`);

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          content: teacherResponse,
          type: 'video',
          mediaPrompt: videoPrompt
        }]);
      } catch (e) {
         setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "عذراً، حدث خطأ أثناء توليد الفيديو.", type: 'text' }]);
      }
      setIsLoading(false);
      return;
    }

    // Prepare history for context
    const historyText = messages.map(m => `${m.role === 'user' ? 'الطالب' : 'المعلم'}: ${m.content}`).join('\n');
    const prompt = `${historyText}\nالطالب: ${userMsgContent}\nالمعلم:`;

    const responseText = await generateText(prompt, SYSTEM_INSTRUCTION);
    
    // Parse for image format [IMAGE: prompt]
    const imgRegex = /\[IMAGE:\s*(.*?)\]/i;
    const match = responseText.match(imgRegex);
    
    if (match && match[1]) {
      const imgPrompt = match[1];
      const cleanedText = responseText.replace(imgRegex, '').trim();
      
      if (cleanedText) {
          setMessages(prev => [...prev, { id: Date.now().toString() + '1', role: 'model', content: cleanedText, type: 'text' }]);
      }
      setMessages(prev => [...prev, { id: Date.now().toString() + '2', role: 'model', content: imgPrompt, type: 'image' }]);
    } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText, type: 'text' }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-slate-500 bg-white p-4 rounded-2xl w-max shadow-sm border border-slate-100">
               <Loader2 className="w-5 h-5 animate-spin" />
               <span className="text-sm font-medium">
                  {loadingType === 'video' ? 'جاري بناء الفيديو بواسطة VEO-3...' : 
                   loadingType === 'image' ? 'جاري توليد الصورة التوضيحية...' : 
                   'جاري التفكير وتوليد المحتوى...'}
               </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-2">
             <button
               onClick={() => setMediaMode(mediaMode === 'image' ? 'text' : 'image')}
               title="توليد صورة"
               className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mediaMode === 'image' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
             >
               <ImageIcon className="w-4 h-4" />
               <span className="hidden sm:inline">توليد صورة</span>
             </button>
             <button
               onClick={() => setMediaMode(mediaMode === 'video' ? 'text' : 'video')}
               title="توليد فيديو VEO-3"
               className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mediaMode === 'video' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
             >
               <Video className="w-4 h-4" />
               <span className="hidden sm:inline">توليد فيديو VEO-3</span>
             </button>
             {mediaMode !== 'text' && (
               <span className="text-xs font-bold text-slate-500 mr-2 animate-pulse">
                اكتب وصف {mediaMode === 'image' ? 'الصورة' : 'الفيديو'} ثم اضغط إرسال
               </span>
             )}
          </div>
          
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input, mediaMode);
                }
              }}
              placeholder={mediaMode === 'image' ? "صف الصورة التي تريد توليدها..." : mediaMode === 'video' ? "صف الفيديو الذي تريد توليده..." : "اسأل معلمك الذكي..."}
              className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl resize-none transition-all shadow-inner focus:outline-none ${mediaMode === 'image' ? 'bg-purple-50 border-purple-200 focus:border-purple-500' : mediaMode === 'video' ? 'bg-emerald-50 border-emerald-200 focus:border-emerald-500' : 'bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              rows={2}
            />
            <button
              onClick={() => handleSend(input, mediaMode)}
              disabled={!input.trim() || isLoading}
              className="absolute left-3 bottom-3 p-3 bg-blue-600 text-white rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md"
            >
              <Send className="w-5 h-5 rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VeoVideoPlayer({ prompt, content }: { prompt: string, content: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " highly detailed, cinematic lighting, 8k resolution, photorealistic")}?width=1280&height=720&nologo=true&seed=${Math.random()}`;

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col gap-3 w-full sm:min-w-[400px]">
      <div className="prose max-w-none font-medium">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex items-center justify-center group select-none">
        
        <div className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center">
            {/* The Image that pans slightly to simulate video */}
            <img 
                src={imageUrl} 
                alt="VEO-3 Generated initial frame" 
                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear"
                style={{ 
                transform: isPlaying ? 'scale(1.15) translate(-2%, 2%)' : 'scale(1.0) translate(0, 0)'
                }}
            />
        </div>

        {/* VEO-3 Watermark */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 z-20">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">VEO-3</span>
        </div>

        {/* Big Play Button Overlay */}
        {!isPlaying && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="absolute z-20 w-20 h-20 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all duration-300 shadow-xl"
          >
            <Play className="w-8 h-8 text-white ml-2" fill="currentColor" />
          </button>
        )}

        {/* Video Controls / Timeline */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 z-20 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          <div className="flex items-center gap-4 text-white">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-emerald-400 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" fill="currentColor"/> : <Play className="w-6 h-6" fill="currentColor"/>}
            </button>
            <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <Volume2 className="w-5 h-5"/>
            <Maximize className="w-5 h-5"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 ${
          isUser
            ? 'bg-blue-600 text-white rounded-bl-none shadow-blue-500/20 shadow-lg'
            : 'bg-white border border-slate-100 text-slate-800 rounded-br-none shadow-sm'
        }`}
      >
        {msg.type === 'text' && (
          <div className={`prose ${isUser ? 'prose-invert' : ''} max-w-none font-medium leading-relaxed`}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
        
        {msg.type === 'image' && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-500 mb-2 font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4"/> تم توليد الصورة الذكية:
            </p>
            <img 
              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(msg.content)}?width=800&height=400&nologo=true`} 
              alt="AI Generated" 
              className="rounded-xl w-full object-cover shadow-md border border-slate-200 bg-slate-100 min-h-[200px]"
              onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
        )}

        {msg.type === 'video' && msg.mediaPrompt && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-emerald-600 mb-2 font-bold flex items-center gap-2 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                <Sparkles className="w-4 h-4"/> تم توليد هذا الفيديو حصرياً بواسطة الذكاء الاصطناعي VEO-3
            </p>
            <VeoVideoPlayer prompt={msg.mediaPrompt} content={msg.content} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
