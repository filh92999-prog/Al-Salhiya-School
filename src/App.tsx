import { useState } from 'react';
import Home from './views/Home';
import StudentView from './views/StudentView';
import TeacherView from './views/TeacherView';
import AdminView from './views/AdminView';

export default function App() {
  const [currentPortal, setCurrentPortal] = useState<string>('home');

  const renderPortal = () => {
    switch (currentPortal) {
      case 'student':
        return <StudentView onBack={() => setCurrentPortal('home')} />;
      case 'teacher':
        return <TeacherView onBack={() => setCurrentPortal('home')} />;
      case 'admin':
        return <AdminView onBack={() => setCurrentPortal('home')} />;
      default:
        return <Home onSelectPortal={setCurrentPortal} />;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen">
      {renderPortal()}
    </div>
  );
}
