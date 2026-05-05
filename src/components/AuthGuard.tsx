// Auth Guard for Teacher and Admin portals
import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthGuardProps {
    children: React.ReactNode;
    onBack: () => void;
    title: string;
}

export function AuthGuard({ children, onBack, title }: AuthGuardProps) {
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '9666') {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setPin('');
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <button onClick={onBack} className="absolute top-6 right-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowRight className="w-5 h-5" />
                <span>العودة للرئيسية</span>
            </button>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 w-full max-w-md text-center"
            >
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-slate-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
                <p className="text-slate-500 mb-8">يرجى إدخال رمز الدخول للمتابعة</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="رمز الدخول"
                        className={`text-center text-2xl tracking-widest p-4 rounded-xl border-2 focus:outline-none transition-colors ${error ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:border-primary-500 bg-slate-50'}`}
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm">رمز الدخول غير صحيح، حاول مرة أخرى.</p>}
                    <button 
                        type="submit"
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-colors shadow-md"
                    >
                        دخول
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
