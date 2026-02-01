import React from 'react';
import { Sun, Moon, Users as UsersIcon, LayoutDashboard, BarChart3, LogOut } from 'lucide-react';
import { User, ViewState } from '../../types';

interface HeaderProps {
    view: ViewState;
    selectedDept: string | null;
    currentUser: User | null;
    isDarkMode: boolean;
    setIsDarkMode: (val: boolean) => void;
    setView: (view: ViewState) => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    view, selectedDept, currentUser, isDarkMode, setIsDarkMode, setView, onLogout
}) => {
    return (
        <header className={`sticky top-0 z-[100] backdrop-blur-2xl border-b px-4 py-3 flex items-center justify-between shadow-sm transition-all ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
            <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg italic shadow-md shrink-0 ${isDarkMode ? 'bg-blue-600' : 'bg-slate-900'}`}>M</div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.18em] block mb-0.5 leading-none">GESTIONALE</span>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className={`text-[10px] md:text-sm font-black uppercase italic leading-none truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {view === 'DASHBOARD' ? 'HOME' : view === 'ADMIN_PANEL' ? 'UTENTI' : view === 'ANALYTICS' ? 'ANALYTICS' : 'REPARTO'}
                        </span>
                        {selectedDept && (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[6.5px] md:text-[8px] font-black uppercase italic border border-amber-200 shrink-0 shadow-[0_1px_2px_rgba(245,158,11,0.1)] animate-fade-in">
                                {selectedDept}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {(currentUser?.role === 'admin' && (view === 'DASHBOARD' || view === 'ANALYTICS')) && (
                    <button onClick={() => setView('ADMIN_PANEL')} className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-[#0F172A] hover:bg-slate-800'}`}>
                        <UsersIcon size={20} />
                    </button>
                )}
                <button onClick={() => setView(view === 'ANALYTICS' ? 'DASHBOARD' : 'ANALYTICS')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${view === 'ANALYTICS' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-100 text-slate-500'}`}>
                    {view === 'ANALYTICS' ? <LayoutDashboard size={20} /> : <BarChart3 size={20} />}
                </button>
                <button onClick={onLogout} className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};
