import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BarChart, FileSignature } from 'lucide-react';
import { AuthGuard } from '../components/AuthGuard';

import ProblemAnalyzer from '../components/Admin/ProblemAnalyzer';
import CircularDrafter from '../components/Admin/CircularDrafter';

export default function AdminView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'circular'>('analyzer');

  return (
    <AuthGuard onBack={onBack} title="بوابة الإدارة">
      <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-slate-900 text-white border-l border-slate-800 shrink-0 flex flex-col z-20 shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className="bg-emerald-500/20 p-2 rounded-lg">
                   <ShieldIcon className="w-6 h-6 text-emerald-400" />
                 </div>
                 <h1 className="text-xl font-bold">بوابة المدير</h1>
             </div>
             <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors md:hidden">
               <ArrowRight className="w-5 h-5" />
             </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-2 mt-4">
            <SidebarButton active={activeTab === 'analyzer'} onClick={() => setActiveTab('analyzer')} icon={<BarChart className="w-5 h-5" />} label="المحلل الإداري" />
            <SidebarButton active={activeTab === 'circular'} onClick={() => setActiveTab('circular')} icon={<FileSignature className="w-5 h-5" />} label="صياغة التعاميم" />
          </div>

          <div className="p-4 border-t border-slate-800 hidden md:block">
             <button onClick={onBack} className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-semibold">
               <ArrowRight className="w-4 h-4" /> العودة للرئيسية
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 relative overflow-y-auto bg-slate-50 md:p-6">
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab} 
               initial={{ opacity: 0, scale: 0.98 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.98 }} 
               className="h-full bg-white md:rounded-3xl shadow-lg border border-slate-200 overflow-hidden"
             >
                {activeTab === 'analyzer' && <ProblemAnalyzer />}
                {activeTab === 'circular' && <CircularDrafter />}
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AuthGuard>
  );
}

function SidebarButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
        active ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ShieldIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
