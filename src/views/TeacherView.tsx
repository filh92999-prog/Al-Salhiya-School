import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, FileText, Image as ImageIcon, Award, MessageCircle, Video } from 'lucide-react';
import { AuthGuard } from '../components/AuthGuard';

import LessonPrep from '../components/Teacher/LessonPrep';
import ImageTool from '../components/Teacher/ImageTool';
import VideoTool from '../components/Teacher/VideoTool';
import CertificateGen from '../components/Teacher/CertificateGen';
import TeacherChat from '../components/Teacher/TeacherChat';

export default function TeacherView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'prep' | 'image' | 'video' | 'cert' | 'chat'>('prep');

  return (
    <AuthGuard onBack={onBack} title="بوابة المعلمين">
      <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-l border-slate-200 shrink-0 flex flex-col z-20 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className="bg-gold-100 p-2 rounded-lg">
                   <UserIcon className="w-6 h-6 text-gold-600" />
                 </div>
                 <h1 className="text-xl font-bold text-slate-800">بوابة المعلم</h1>
             </div>
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden">
               <ArrowRight className="w-5 h-5 text-slate-600" />
             </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-2">
            <SidebarButton active={activeTab === 'prep'} onClick={() => setActiveTab('prep')} icon={<FileText className="w-5 h-5" />} label="تحضير الدروس الذكي" />
            <SidebarButton active={activeTab === 'image'} onClick={() => setActiveTab('image')} icon={<ImageIcon className="w-5 h-5" />} label="بنانا بنانا برو للصور" />
            <SidebarButton active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={<Video className="w-5 h-5" />} label="إنشاء فيديو حقيقي" />
            <SidebarButton active={activeTab === 'cert'} onClick={() => setActiveTab('cert')} icon={<Award className="w-5 h-5" />} label="قوالب الشهادات" />
            <SidebarButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle className="w-5 h-5" />} label="محادثة المعلم الذكي" />
          </div>

          <div className="p-4 border-t border-slate-200 hidden md:block">
             <button onClick={onBack} className="flex items-center justify-center gap-2 w-full py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all font-semibold">
               <ArrowRight className="w-4 h-4" /> العودة للرئيسية
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 relative overflow-y-auto bg-slate-50 md:p-6">
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab} 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }} 
               className="h-full bg-white md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
             >
                {activeTab === 'prep' && <LessonPrep />}
                {activeTab === 'image' && <ImageTool />}
                {activeTab === 'video' && <VideoTool />}
                {activeTab === 'cert' && <CertificateGen />}
                {activeTab === 'chat' && <TeacherChat />}
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
        active ? 'bg-gold-50 text-gold-700 shadow-sm border border-gold-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function UserIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
