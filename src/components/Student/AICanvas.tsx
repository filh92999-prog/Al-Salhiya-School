import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../../lib/gemini';
import { Brain, Sparkles, CheckCircle2, ChevronLeft, Bot, Send, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'model' | 'user';
  content: string;
}

export default function AICanvas() {
  // Phase modes: 'setup_chat' | 'generating' | 'quiz' | 'results'
  const [phase, setPhase] = useState<'setup_chat' | 'generating' | 'quiz' | 'results'>('setup_chat');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: 'أهلاً بك في ساحة العمل الذكية! أنا مساعدك لإعداد الاختبارات. ما هي المادة أو الموضوع الذي تريد أن نختبر معلوماتك فيه؟ وكم سؤالاً تفضل؟ (مثال: أريد 5 أسئلة في العلوم عن دورة المياه للصف الرابع)' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [quizData, setQuizData] = useState<any | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Results State
  const [results, setResults] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    const history = chatMessages.map(m => `${m.role === 'user' ? 'الطالب' : 'المعلم'}: ${m.content}`).join('\n');
    const prompt = `${history}\nالطالب: ${userMsg}\n
    أنت صانع اختبارات ذكي.
    إذا كانت رغبة الطالب واضحة (العدد، المادة أو الموضوع)، قم بالرد محتوياً على علامة "[GENERATE_QUIZ]" متبوعة بمحتوى كلامك لتأكيد بدء الإنشاء.
    وإذا لم تكن واضحة، اسأله بلطف لتوضيح التفاصيل.`;

    try {
        const responseText = await generateText(prompt);
        if (responseText.includes('[GENERATE_QUIZ]')) {
            const cleanText = responseText.replace(/\[GENERATE_QUIZ\]/g, '').trim();
            setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: cleanText }]);
            setIsChatLoading(false);
            generateQuizJSON(userMsg);
            return;
        } else {
            setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText }]);
        }
    } catch (e) {
        setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'عذراً حدث خطأ، هل يمكنك التوضيح أكثر؟' }]);
    }
    setIsChatLoading(false);
  };

  const generateQuizJSON = async (lastUserMessage: string) => {
      setPhase('generating');
      const history = chatMessages.map(m => m.content).join('\n');
      const prompt = `أريد إنشاء اختبار (أو بطاقات تعليمية) بناءً على هذا الطلب: "${lastUserMessage}" والسياق السابق: "${history}".
رد بصيغة JSON فقط، بدون أي نص إضافي، بالهيكل التالي:
{
  "title": "عنوان الاختبار (مثال: تحدي العلوم)",
  "questions": [
    {
      "id": 1,
      "text": "نص السؤال",
      "options": ["أ", "ب", "ج", "د"],
      "correct": "الإجابة الصحيحة كاملة نصياً",
      "hint": "تلميح ذكي وقصير يساعد الطالب على التفكير ولا يعطيه الإجابة"
    }
  ]
}`;
    
    try {
      const response = await generateText(prompt, "أنت خبير في المناهج السعودية، ومبرمج ينشئ JSON صحيح.");
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      setQuizData(parsed);
      setCurrentCardIndex(0);
      setAnswers({});
      setIsFlipped(false);
      setPhase('quiz');
    } catch (e) {
      console.error(e);
      alert("حدث خطأ في بناء الاختبار. سنعود للمحادثة.");
      setPhase('setup_chat');
    }
  };

  const currentQuestion = quizData?.questions[currentCardIndex];
  const isLastQuestion = quizData && currentCardIndex === quizData.questions.length - 1;

  const handleOptionSelect = (opt: string) => {
      setAnswers({ ...answers, [currentQuestion.id]: opt });
  };

  const handleNextCard = () => {
      if (isLastQuestion) {
          submitQuiz();
      } else {
          setIsFlipped(false);
          setCurrentCardIndex(prev => prev + 1);
      }
  };

  const submitQuiz = async () => {
      setPhase('results');
      setIsGrading(true);
      const prompt = `المادة: ${quizData.title}
      الأسئلة: ${JSON.stringify(quizData.questions.map((q:any) => ({ id: q.id, text: q.text, correct: q.correct })))}
      إجابات الطالب: ${JSON.stringify(answers)}
      الرجاء تقييم الطالب بلغة محفزة وحنونة، وشرح الأخطاء إن وجدت بشكل مبسط ومناسب لعمره. 
      اكتب النتيجة والنصيحة النهاية بشكل منسق مع رموز تعبيرية.`;

      try {
          const feedback = await generateText(prompt);
          setResults(feedback);
      } catch (e) {
          setResults("رائع جداً! مجهود بطل، نتمنى لك التوفيق الدائم.");
      }
      setIsGrading(false);
  };

  if (phase === 'setup_chat') {
    return (
      <div className="h-full flex flex-col bg-slate-50 relative">
        <div className="p-6 border-b border-slate-200 bg-white shadow-sm shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            بناء الاختبار بذكاء
          </h2>
          <p className="text-slate-500 text-sm mt-1">تحدث مع صانع الاختبارات لتجهيز تحديك المخصص.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           {chatMessages.map(msg => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-bl-none shadow-md' : 'bg-white border border-slate-200 text-slate-800 rounded-br-none shadow-sm'}`}>
                      <div className={`prose prose-sm md:prose-base font-medium ${msg.role === 'user' ? 'prose-invert text-white' : ''}`}>
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                  </div>
               </div>
           ))}
           {isChatLoading && (
               <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-4 rounded-3xl rounded-br-none shadow-sm text-slate-400 flex gap-2 items-center">
                      <Sparkles className="w-5 h-5 animate-pulse text-blue-400" />
                      <span className="font-bold text-sm">يقوم بالتفكير...</span>
                   </div>
               </div>
           )}
           <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="max-w-4xl mx-auto relative">
                <input 
                   type="text"
                   value={chatInput}
                   onChange={e => setChatInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                   disabled={isChatLoading}
                   placeholder="مثال: جهز لي 4 أسئلة في الرياضيات عن القسمة..."
                   className="w-full pl-14 pr-6 py-4 bg-slate-100 border-2 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium outline-none"
                />
                <button 
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="absolute left-2 top-2 bottom-2 aspect-square bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
                >
                    <Send className="w-5 h-5 rtl:-scale-x-100" />
                </button>
            </div>
        </div>
      </div>
    );
  }

  if (phase === 'generating') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
             <Brain className="w-20 h-20 text-blue-500 mb-8 drop-shadow-xl" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-3">جاري بناء البطاقات التفاعلية...</h2>
          <p className="text-slate-500 font-medium">يقوم الذكاء الاصطناعي الآن بصياغة الأسئلة والتلميحات الذكية المخصصة لك.</p>
      </div>
    );
  }

  if (phase === 'quiz' && currentQuestion) {
      const hasAnswered = !!answers[currentQuestion.id];

      return (
          <div className="h-full bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
              
              <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">{quizData.title}</h2>
                  <div className="bg-white px-4 py-2 rounded-full font-bold text-blue-600 shadow-sm">
                      سؤال {currentCardIndex + 1} من {quizData.questions.length}
                  </div>
              </div>

              {/* Flashcard Container */}
              <div className="w-full max-w-2xl perspective-1000 h-[450px] relative">
                  <AnimatePresence mode="wait">
                      <motion.div
                          key={currentCardIndex + (isFlipped ? '-flipped' : '-front')}
                          initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90, scale: 0.9 }}
                          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                          exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-8 sm:p-12 flex flex-col"
                      >
                         {!isFlipped ? (
                             // Front: Question & Options
                             <>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">{currentQuestion.text}</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:gap-4 flex-1">
                                    {currentQuestion.options.map((opt: string) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleOptionSelect(opt)}
                                            className={`text-right p-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                                                answers[currentQuestion.id] === opt 
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.02]' 
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                             </>
                         ) : (
                             // Back: Hint (It's a flashcard hint, not direct answer until the end)
                             <div className="flex-1 flex flex-col items-center justify-center text-center">
                                 <Lightbulb className="w-16 h-16 text-yellow-500 mb-6 drop-shadow-md" />
                                 <h3 className="text-2xl font-bold text-slate-800 mb-4">تلميح ذكي</h3>
                                 <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-md">
                                     {currentQuestion.hint}
                                 </p>
                             </div>
                         )}
                      </motion.div>
                  </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="w-full max-w-2xl mt-8 flex justify-between items-center">
                  <button 
                     onClick={() => setIsFlipped(!isFlipped)}
                     className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                     <Lightbulb className="w-5 h-5 text-yellow-500" />
                     {isFlipped ? 'العودة للسؤال' : 'طلب تلميح'}
                  </button>
                  
                  <button 
                     onClick={handleNextCard}
                     disabled={!hasAnswered}
                     className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all flex items-center gap-2 text-lg"
                  >
                     {isLastQuestion ? 'إنهاء وتصحيح' : 'السؤال التالي'}
                     <ArrowLeft className="w-5 h-5" />
                  </button>
              </div>

          </div>
      );
  }

  if (phase === 'results') {
      return (
          <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-12 flex flex-col items-center justify-center">
              {isGrading ? (
                  <div className="text-center">
                     <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-6 drop-shadow-lg" />
                     </motion.div>
                     <h2 className="text-3xl font-bold text-slate-800 mb-2">جاري تصحيح إجاباتك...</h2>
                     <p className="text-slate-500">يقوم الذكاء الاصطناعي الآن بكتابة النصيحة والتقييم.</p>
                  </div>
              ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-emerald-100">
                      <div className="flex items-center justify-center mb-8">
                          <CheckCircle2 className="w-16 h-16 text-emerald-500 bg-emerald-50 rounded-full p-2" />
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-800 mb-8">تقرير الأداء والنصيحة</h2>
                      
                      <div className="prose prose-lg prose-emerald max-w-none text-slate-700 font-medium leading-loose mb-12">
                          <ReactMarkdown>{results || ""}</ReactMarkdown>
                      </div>

                      <div className="flex justify-center border-t border-slate-100 pt-8">
                          <button 
                             onClick={() => {
                                 setPhase('setup_chat');
                                 setChatMessages([{ id: '1', role: 'model', content: 'أهلاً بك مجدداً يا بطل! عن ماذا سيكون اختبارنا القادم؟' }]);
                             }}
                             className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-3 text-lg"
                          >
                             <Bot className="w-6 h-6" />
                             بناء اختبار جديد
                          </button>
                      </div>
                  </motion.div>
              )}
          </div>
      );
  }

  return null;
}
