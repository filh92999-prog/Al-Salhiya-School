import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, User, Shield, BrainCircuit, BotMessageSquare, FileText, Image as ImageIcon, Award, BarChart, ChevronLeft, ArrowLeft, Star, PlayCircle, BookOpen } from 'lucide-react';

export default function Home({ onSelectPortal }: { onSelectPortal: (portal: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200" dir="rtl">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-200">ص</div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">الصالحية الرقمية</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">المميزات</a>
            <a href="#portals" className="hover:text-blue-600 transition-colors">البوابات</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">إحصائيات</a>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> متصل بالخوادم
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-b from-blue-100/50 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-t from-indigo-100/50 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-sm mb-8">
              <SparklesIcon className="w-4 h-4" /> منصة التعلم المدعومة بالذكاء الاصطناعي
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              نحو مستقبل <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">تعليمي مشرق</span> وتجربة لا تُنسى
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg md:text-xl text-slate-600 font-medium mb-12 max-w-2xl leading-relaxed">
              منصة تعليمية متطورة توفر بيئة تفاعلية للطلاب، أدوات احترافية ومريحة للمعلمين، وتحليلات دقيقة ولحظية للإدارة المدرسية.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button onClick={() => { document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                الدخول للمنصة <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-bold text-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                <PlayCircle className="w-5 h-5 text-slate-400" /> جولة تعريفية
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-24 bg-white border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">بوابات الدخول</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg">اختر البوابة المناسبة للوصول إلى أدواتك المخصصة ومساحة عملك الذكية.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Portal Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              onClick={() => onSelectPortal('student')}
              className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">بوابة الطلاب</h3>
              <p className="text-slate-500 font-medium mb-8 flex-1">وصول مباشر إلى المعلم الذكي، وساحة العمل لإنشاء البطاقات التفاعلية ومراجعة الدروس.</p>
              <div className="space-y-3 mb-8">
                 <FeatureItem icon={<BrainCircuit className="w-4 h-4 text-blue-500" />} text="ساحة البطاقات الذكية (Canvas AI)" />
                 <FeatureItem icon={<BotMessageSquare className="w-4 h-4 text-blue-500" />} text="المعلم الذكي الشامل (AI Tutor)" />
              </div>
              <div className="mt-auto flex items-center text-blue-600 font-bold group-hover:gap-3 transition-all gap-2">
                 <span>تسجيل الدخول</span> <ArrowLeft className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Teacher Portal Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              onClick={() => onSelectPortal('teacher')}
              className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 w-16 h-16 bg-indigo-800 text-indigo-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                  بوابة المعلمين
                  <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-md tracking-wider font-mono">PW: 9666</span>
                </h3>
                <p className="text-indigo-200/80 font-medium mb-8 flex-1">إدارة العملية التعليمية، التقييم، وتوليد المحتوى بإمكانيات الذكاء الاصطناعي.</p>
                <div className="space-y-3 mb-8">
                   <FeatureItem icon={<FileText className="w-4 h-4 text-indigo-400" />} text="تحضير الدروس الذكي" dark />
                   <FeatureItem icon={<ImageIcon className="w-4 h-4 text-indigo-400" />} text="توليد الصور التعليمية" dark />
                   <FeatureItem icon={<Award className="w-4 h-4 text-indigo-400" />} text="مصمم الشهادات الفاخرة" dark />
                </div>
                <div className="mt-auto flex items-center text-indigo-300 font-bold group-hover:gap-3 transition-all gap-2">
                   <span>تسجيل الدخول</span> <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Admin Portal Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              onClick={() => onSelectPortal('admin')}
              className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                  بوابة الإدارة
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-md tracking-wider font-mono">PW: 9666</span>
              </h3>
              <p className="text-slate-500 font-medium mb-8 flex-1">لوحة تحكم شاملة لمراقبة الأداء، إصدار التقارير وصياغة التعاميم الرسمية.</p>
              <div className="space-y-3 mb-8">
                 <FeatureItem icon={<BarChart className="w-4 h-4 text-emerald-500" />} text="تحليلات الأداء والتقارير" />
                 <FeatureItem icon={<FileText className="w-4 h-4 text-emerald-500" />} text="صياغة التعاميم الذكية" />
              </div>
              <div className="mt-auto flex items-center text-emerald-600 font-bold group-hover:gap-3 transition-all gap-2">
                 <span>تسجيل الدخول</span> <ArrowLeft className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Capabilities */}
      <section id="features" className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">الذكاء الاصطناعي في خدمة أبنائنا</h2>
                  <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                     بنيت المنصة لتقديم مساعدة فورية للطلاب، حيث لا تقدم إجابات جاهزة بل تعمل كموجه تربوي يساعد الطالب على استنتاج الحلول، إلى جانب تحويل المحتوى النصي إلى بطاقات تعليمية تفاعلية.
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1"><Star className="w-4 h-4" /></div>
                        <div>
                           <h4 className="font-bold text-slate-800">بيئة آمنة للطلاب</h4>
                           <p className="text-slate-500 text-sm mt-1">المعلم الذكي مصمم وفقاً لمعايير المناهج السعودية مع حماية من الأخطاء.</p>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1"><BookOpen className="w-4 h-4" /></div>
                        <div>
                           <h4 className="font-bold text-slate-800">بطاقات مراجعة ذكية</h4>
                           <p className="text-slate-500 text-sm mt-1">توليد تلقائي للأسئلة مع تلميحات فكرية بدلاً من الإجابات المباشرة.</p>
                        </div>
                     </li>
                  </ul>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-blue-200 rounded-[3rem] transform rotate-3 scale-105"></div>
                  <div className="relative bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">🤖</div>
                        <div>
                           <div className="font-bold text-slate-800">المعلم الذكي</div>
                           <div className="text-xs text-green-500 font-bold">نشط الآن</div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-slate-100 p-4 rounded-2xl rounded-tr-none text-slate-700 text-sm w-5/6">
                           أهلاً بك! كيف يمكنني مساعدتك في درس العلوم اليوم؟
                        </div>
                        <div className="bg-blue-600 p-4 rounded-2xl rounded-tl-none text-white text-sm w-4/6 mr-auto">
                           هل يمكنك حل هذا السؤال لي عن دورة المياه؟
                        </div>
                        <div className="bg-slate-100 p-4 rounded-2xl rounded-tr-none text-slate-700 text-sm w-5/6 leading-relaxed">
                           لا أستطيع إعطائك الحل المباشر، ولكن دعنا نفكر معاً: ماذا يحدث للماء عندما تسخن الشمس المحيطات؟ ☀️
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">ص</div>
              <span className="font-bold text-slate-800">مدرسة الصالحية الرقمية</span>
           </div>
           <p className="text-slate-500 font-medium text-sm">© {new Date().getFullYear()} جميع الحقوق محفوظة لمدارس الصالحية الأهلية.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, text, dark = false }: { icon: React.ReactNode, text: string, dark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 font-medium text-sm ${dark ? 'text-indigo-200' : 'text-slate-600'}`}>
      <div className={`p-1.5 rounded-lg ${dark ? 'bg-indigo-800/50' : 'bg-slate-100'}`}>
        {icon}
      </div>
      {text}
    </div>
  )
}

function SparklesIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}

