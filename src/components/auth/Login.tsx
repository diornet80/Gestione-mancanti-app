import React, { useState } from 'react';
import { Share2, HelpCircle, Database } from 'lucide-react';

interface LoginProps {
    onLogin: (e: React.FormEvent) => void;
    isSyncing: boolean;
    onViewGuide: () => void;
    onShare: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isSyncing, onViewGuide, onShare }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0F172A]">
            <div className="w-full max-w-md p-10 bg-[#1E293B] rounded-[4rem] shadow-2xl border border-white/5 text-center animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
                <div className="absolute top-8 left-8">
                    <button onClick={onShare} className="w-12 h-12 bg-slate-800/50 hover:bg-slate-700 text-blue-400 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-slate-700 shadow-xl" title="Condividi Link App">
                        <Share2 size={24} />
                    </button>
                </div>
                <div className="absolute top-8 right-8">
                    <button onClick={onViewGuide} className="w-12 h-12 bg-slate-800/50 hover:bg-slate-700 text-slate-400 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-slate-700 shadow-xl" title="Guida all'installazione">
                        <HelpCircle size={24} />
                    </button>
                </div>
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
                    <Database className="text-white" size={40} />
                </div>
                <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 leading-tight">Mancanti<br />Cloud</h1>
                <form onSubmit={onLogin} className="space-y-4 mb-10">
                    <input name="username" type="text" placeholder="UTENTE" className="w-full p-5 bg-slate-800 rounded-3xl text-white font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all placeholder:text-slate-600" required />
                    <input name="password" type="password" placeholder="PASSWORD" className="w-full p-5 bg-slate-800 rounded-3xl text-white font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all placeholder:text-slate-600" required />
                    <button disabled={isSyncing} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase italic shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                        {isSyncing ? <span className="sync-loader"></span> : 'ACCEDI ORA'}
                    </button>
                </form>
                <div className="pt-8 border-t border-white/10 flex flex-col items-center">
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter opacity-60">Sincronizzazione Cloud Protetta</p>
                </div>
            </div>
        </div>
    );
};
