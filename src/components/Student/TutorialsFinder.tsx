import React, { useState, useRef, useEffect } from 'react';
import { Search, Youtube, Send, PlayCircle, Loader2 } from 'lucide-react';
import { generateText } from '../../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  searchQuery?: string;
}

export default function TutorialsFinder() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا زمليك الذكي لمساعدتك في العثور على أفضل الشروحات المرئية. ما الدرس الذي تبحث عنه؟ (مثال: أبي درس القسمة المطولة)'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `
        المستخدم يبحث عن شرح لدرس معين. 
        نص المستخدم: "${userMsg.content}"
        
        استخرج عنوان الدرس أو الموضوع الرئيسي فقط للبحث عنه في يوتيوب.
        اكتب العنوان فقط بدون أي إضافات، إذا لم يكن هناك درس واضح يمكن البحث عنه، اكتب "غير واضح".
      `;
      const topic = await generateText(prompt);
      
      const cleanTopic = topic.trim().replace(/["']/g, ''); // Remove quotes if LLM adds any
      
      if (cleanTopic === 'غير واضح' || cleanTopic.length < 2) {
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: 'عذراً، لم أتمكن من استخلاص عنوان الدرس. هل يمكنك توضيح اسم الدرس بدقة أكثر؟'
          }]);
      } else {
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: `تفضل! لقد بحثت لك عن شروحات لدرس: **${cleanTopic}** 📚`,
              searchQuery: cleanTopic
          }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'حدث خطأ أثناء تحليل طلبك، يرجى المحاولة مرة أخرى.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="p-6 border-b border-slate-200 bg-white shadow-sm flex items-center gap-3 shrink-0">
            <div className="bg-red-100 p-2 rounded-xl text-red-600">
                <Youtube className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">الشروحات المرئية</h2>
                <p className="text-sm text-slate-500">ابحث عن أي درس وسيتم جلبه من يوتيوب كأنك تبحث في جوجل</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            <AnimatePresence>
                {messages.map(msg => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] flex flex-col gap-2`}>
                            <div className={`p-4 rounded-2xl shadow-sm text-base ${msg.role === 'user' ? 'bg-red-600 text-white rounded-bl-none' : 'bg-white border border-slate-200 text-slate-800 rounded-br-none'}`}>
                                {msg.content}
                            </div>
                            
                            {msg.searchQuery && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full min-w-[300px] sm:min-w-[400px]"
                                >
                                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                                       <Search className="w-5 h-5 text-red-500" />
                                       <span className="font-bold text-slate-700">نتائج بحث يوتيوب</span>
                                    </div>
                                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 relative shadow-inner">
                                        <iframe 
                                           width="100%" 
                                           height="100%" 
                                           src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(msg.searchQuery)}`}
                                           title="YouTube search results" 
                                           frameBorder="0" 
                                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                           allowFullScreen
                                           className="absolute inset-0"
                                        ></iframe>
                                    </div>
                                    <a 
                                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(msg.searchQuery)}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="mt-4 w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold transition-colors border border-red-100"
                                    >
                                      <PlayCircle className="w-5 h-5"/> مشاهدة النتائج في يوتيوب
                                    </a>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {isLoading && (
               <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-br-none flex items-center gap-3 text-slate-500 shadow-sm">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       <span className="font-medium">جاري البحث عن أفضل الشروحات...</span>
                   </div>
               </div>
            )}
        </div>

        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="max-w-4xl mx-auto relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب الدرس الذي تريد شرحه (مثال: ابي شرح جدول الضرب)..."
                    className="w-full bg-slate-100 border-none rounded-full px-6 py-4 pr-16 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400 text-slate-800"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-colors shadow-sm"
                >
                    <Send className="w-5 h-5 rtl:-scale-x-100" />
                </button>
            </div>
        </div>
      </div>
  );
}
