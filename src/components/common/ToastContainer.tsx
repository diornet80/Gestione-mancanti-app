import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Toast } from '../../hooks/useToast';

interface ToastContainerProps {
    toasts: Toast[];
    isDarkMode: boolean;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, isDarkMode }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-[360px] px-4 flex flex-col gap-3">
            {toasts.map(t => {
                const isAlert = t.type === 'error' || t.type === 'warning';
                return (
                    <div key={t.id} className={`p-5 rounded-3xl shadow-2xl flex items-center gap-4 border-2 animate-fade-in ${isDarkMode ? 'bg-slate-900 border-slate-700' : isAlert ? 'bg-white border-rose-100' : 'bg-white border-emerald-100'} ${isAlert ? 'text-rose-600' : 'text-emerald-600'}`}>
                        <div className={`p-2 rounded-full ${isAlert ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                            {isAlert ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                {t.type === 'error' ? 'Errore' : t.type === 'warning' ? 'Avviso' : 'Sistema'}
                            </span>
                            <span className="text-xs font-bold leading-tight">{t.message}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
