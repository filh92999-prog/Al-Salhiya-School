import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BrainCircuit, BotMessageSquare, Youtube } from 'lucide-react';
import AICanvas from '../components/Student/AICanvas';
import AITutor from '../components/Student/AITutor';
import TutorialsFinder from '../components/Student/TutorialsFinder';

export default function StudentView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'canvas' | 'tutor' | 'tutorials'>('tutorials');

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10 overflow-x-auto">
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <GraduationIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">بوابة الطلاب</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 mr-4">
          <TabButton 
            active={activeTab === 'tutorials'} 
            onClick={() => setActiveTab('tutorials')} 
            icon={<Youtube className="w-4 h-4" />} 
            label="الشروحات المرئية" 
          />
          <TabButton 
            active={activeTab === 'tutor'} 
            onClick={() => setActiveTab('tutor')} 
            icon={<BotMessageSquare className="w-4 h-4" />} 
            label="المعلم الذكي" 
          />
          <TabButton 
            active={activeTab === 'canvas'} 
            onClick={() => setActiveTab('canvas')} 
            icon={<BrainCircuit className="w-4 h-4" />} 
            label="ساحة العمل الذكية" 
          />
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 relative overflow-hidden bg-white rounded-tl-3xl shadow-inner-xl mt-4 ml-4">
        <AnimatePresence mode="wait">
          {activeTab === 'tutorials' ? (
            <motion.div key="tutorials" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
               <TutorialsFinder />
            </motion.div>
          ) : activeTab === 'tutor' ? (
            <motion.div key="tutor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
               <AITutor />
            </motion.div>
          ) : (
            <motion.div key="canvas" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full overflow-y-auto">
               <AICanvas />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
        active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GraduationIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
