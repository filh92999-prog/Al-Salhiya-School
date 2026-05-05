import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateText } from '../../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const SYSTEM_INSTRUCTION = `أنت "مساعد المعلم الذكي" لمدرسة الصالحية. 
أنت مستشار استراتيجي للمعلمين، تساعدهم في ابتكار أساليب تدريس حديثة، إدارة الفصول، والتعامل مع التحديات السلوكية.
ردودك يجب أن تكون مبنية على أحدث نظريات التربية، بأسلوب داعم ومحفز ومخصص لبيئة التعليم في السعودية.`;

export default function TeacherChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: 'مرحباً بك أستاذي الكريم! أنا مساعدك الذكي للتطوير المهني واستراتيجيات التدريس. كيف أستطيع دعمك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsgContent = input;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsgContent };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyText = messages.map(m => `${m.role === 'user' ? 'المعلم' : 'المساعد'}: ${m.content}`).join('\n');
    const prompt = `${historyText}\nالمعلم: ${userMsgContent}\nالمساعد:`;

    const responseText = await generateText(prompt, SYSTEM_INSTRUCTION);
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <h2 className="font-bold text-slate-800">مستشار المعلم الذكي</h2>
          </div>
          <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded-full font-bold">بوابة التطوير</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-slate-500 bg-white p-4 rounded-2xl w-max shadow-sm border border-slate-100">
               <Loader2 className="w-5 h-5 animate-spin" />
               <span className="text-sm font-medium">جاري تحليل الاستفسار وطرح الاستراتيجيات...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="اطلب استراتيجية جديدة، استشارة عن سلوك طالب، أو حيلة للصف..."
              className="w-full pl-14 pr-4 py-4 bg-slate-100 border-transparent rounded-2xl focus:bg-white focus:border-gold-500 focus:ring-2 focus:ring-gold-200 resize-none transition-all shadow-inner"
              rows={2}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute left-3 bottom-3 p-3 bg-gold-600 text-white rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-gold-700 transition-colors shadow-md"
            >
              <Send className="w-5 h-5 rtl:-scale-x-100" />
            </button>
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
            ? 'bg-slate-800 text-white rounded-bl-none shadow-md'
            : 'bg-white border border-slate-100 text-slate-800 rounded-br-none shadow-sm'
        }`}
      >
        <div className={`prose ${isUser ? 'prose-invert' : ''} max-w-none font-medium leading-relaxed`}>
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
