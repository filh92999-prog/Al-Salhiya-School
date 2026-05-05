import React, { useState, useRef } from 'react';
import { Award, Printer, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function CertificateGen() {
  const [studentName, setStudentName] = useState('أحمد محمد');
  const [course, setCourse] = useState('التفوق العلمي');
  const [principalName, setPrincipalName] = useState('أ. منذر المطيري');
  const [deputyName, setDeputyName] = useState('أ. اسم الوكيل');
  const [isExporting, setIsExporting] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
     window.print();
  };

  const handleDownload = async () => {
      if (!certRef.current) return;
      setIsExporting(true);
      try {
          const image = await toPng(certRef.current, {
              pixelRatio: 2, // High resolution
              cacheBust: true,
              fontEmbedCSS: '',
              skipFonts: true,
          });
          const link = document.createElement('a');
          link.download = `شهادة_${studentName.replace(/ /g, '_')}.png`;
          link.href = image;
          link.click();
      } catch (e) {
          console.error("Error generating certificate image", e);
          alert("حدث خطأ أثناء حفظ الصورة");
      }
      setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
       <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex justify-between items-center">
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    قوالب الشهادات الفاخرة
                  </h2>
                  <p className="text-slate-500">قم بتصميم، طباعة، وحفظ شهادات تقدير للطلاب بشكل فوري ومميز.</p>
              </div>
              <div className="flex gap-3">
                  <button onClick={handleDownload} disabled={isExporting} className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md">
                      <Download className="w-4 h-4" />
                      {isExporting ? 'جاري الحفظ...' : 'حفظ كصورة'}
                  </button>
                  <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md">
                      <Printer className="w-4 h-4" />
                      طباعة
                  </button>
              </div>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 flex flex-col xl:flex-row gap-8 items-start">
           
           {/* Form Settings */}
           <div className="w-full xl:w-80 shrink-0 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 h-fit print:hidden z-10 sticky top-0">
               <h3 className="font-extrabold text-lg text-slate-800 mb-2 border-b border-slate-100 pb-3">بيانات الشهادة</h3>
               
               <div className="space-y-4">
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">اسم الطالب</label>
                       <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-semibold" />
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">سبب التكريم</label>
                       <input type="text" value={course} onChange={e => setCourse(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-semibold" />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                       <div>
                           <label className="block text-sm font-bold text-slate-700 mb-1">المدير</label>
                           <input type="text" value={principalName} onChange={e => setPrincipalName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-yellow-500 focus:bg-white outline-none transition-all text-sm font-semibold" />
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-slate-700 mb-1">الوكيل</label>
                           <input type="text" value={deputyName} onChange={e => setDeputyName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-yellow-500 focus:bg-white outline-none transition-all text-sm font-semibold" />
                       </div>
                   </div>
               </div>
           </div>

           {/* Preview / Certificate */}
           <div className="flex-1 flex justify-center w-full overflow-x-auto pb-10">
               <div 
                  ref={certRef}
                  className="w-[1000px] h-[707px] bg-white relative shrink-0 print:m-0 shadow-2xl print:shadow-none print:w-[100vw] print:h-[100vh] flex flex-col"
                  style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1578306014493-205fb1cd7fb4?q=80&w=1200&auto=format&fit=crop")', // Abstract luxury darker texture
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                  }}
               >
                   {/* Gold Outer Border & Inner Content Overlay */}
                   <div className="absolute inset-4 border-[12px] border-double border-yellow-500/80 bg-white/95 backdrop-blur flex flex-col p-16 shadow-inner">
                       
                       {/* Ornaments Corners */}
                       <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-yellow-600 rounded-tl-3xl opacity-80"></div>
                       <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-yellow-600 rounded-tr-3xl opacity-80"></div>
                       <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-yellow-600 rounded-bl-3xl opacity-80"></div>
                       <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-yellow-600 rounded-br-3xl opacity-80"></div>

                       <div className="flex-1 border border-yellow-300/50 rounded-2xl flex flex-col items-center text-center p-12 relative overflow-hidden">
                           
                           {/* Background Watermark/Logo */}
                           <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5 pointer-events-none">
                               <Award className="w-[400px] h-[400px]" />
                           </div>

                           <div className="relative z-10 w-full flex flex-col items-center">
                               <h2 className="text-2xl text-slate-500 font-bold mb-8 tracking-widest uppercase">مدرسة الصالحية الرقمية</h2>
                               <h1 className="text-6xl text-yellow-600 font-extrabold mb-12 drop-shadow-sm" style={{ fontFamily: 'serif' }}>شـهـادة شـكـر وتـقـدير</h1>
                               
                               <p className="text-3xl text-slate-700 mb-8 font-semibold leading-relaxed">
                                   يسر إدارة المدرسة أن تمنح هذه الشهادة للطالب / للطالبة
                               </p>
                               
                               <div className="relative w-4/5 mx-auto mb-10">
                                   <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                                   <h3 className="text-5xl text-slate-900 font-extrabold pb-4">{studentName || '...'}</h3>
                               </div>
                               
                               <p className="text-2xl text-slate-700 mb-16 font-semibold leading-relaxed max-w-3xl">
                                   وذلك لجهوده وتميزه الملحوظ في مجال <span className="text-yellow-600 font-bold text-3xl mx-2">{course || '...'}</span><br/>سائلين المولى عز وجل له دوام التوفيق والنجاح.
                               </p>

                               <div className="flex justify-between w-full mt-auto px-16 font-bold text-slate-800 text-xl items-end relative">
                                   <div className="text-center w-64">
                                       <p className="mb-8 border-b-2 border-slate-300/60 pb-2 text-slate-500 text-lg">مدير المدرسة</p>
                                       <span className="text-3xl text-slate-800 font-extrabold signature-font" style={{ fontFamily: 'Tahoma, serif', fontStyle: 'italic' }}>{principalName}</span>
                                   </div>
                                   
                                   <div className="mb-4">
                                      <div className="w-24 h-24 rounded-full border-4 border-yellow-500 bg-yellow-50 flex items-center justify-center shadow-lg transform -rotate-12">
                                         <Award className="w-12 h-12 text-yellow-600" />
                                      </div>
                                   </div>

                                   <div className="text-center w-64">
                                       <p className="mb-8 border-b-2 border-slate-300/60 pb-2 text-slate-500 text-lg">الوكيل التعليمي</p>
                                       <span className="text-3xl text-slate-800 font-extrabold signature-font" style={{ fontFamily: 'Tahoma, serif', fontStyle: 'italic' }}>{deputyName}</span>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}
