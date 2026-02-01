
import React from 'react';
import { ChevronLeft, BookOpen, Monitor, Plus, Search, ArrowRight } from 'lucide-react';
import { ViewState } from '../../types';

interface GuideProps {
    isDarkMode: boolean;
    setView: (view: ViewState) => void;
}

export const Guide: React.FC<GuideProps> = ({ isDarkMode, setView }) => {
    return (
        <div className="max-w-md mx-auto space-y-4 animate-fade-in pb-8">
            <button onClick={() => setView('LOGIN')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-1 hover:text-blue-600 transition-colors"><ChevronLeft size={16} /> Indietro</button>
            <div className={`p-6 rounded-[2.5rem] shadow-xl border space-y-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
                <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><BookOpen size={20} /></div>
                    <div><h2 className={`text-xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Guida di Sistema</h2><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Manuale Operativo</p></div>
                </div>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2"><Monitor className="text-blue-500" size={16} /><h3 className={`text-xs font-black uppercase italic ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Operazioni Principali</h3></div>
                        <div className="space-y-3">
                            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}><div className="flex items-center gap-2 mb-1"><Plus size={14} className="text-emerald-500" /><span className={`font-black uppercase text-[9px] ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Aggiungi Mancante</span></div><p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">Entra nel reparto e usa "+ Aggiungi". MSN, PNL e Part Number sono obbligatori per garantire l'integrità dei dati.</p></div>
                            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}><div className="flex items-center gap-2 mb-1"><Search size={14} className="text-blue-500" /><span className={`font-black uppercase text-[9px] ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Ricerca & Report</span></div><p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">Usa "Lista / Filtri" per consultare i pezzi. Puoi esportare in Excel o PDF il report del reparto filtrato in tempo reale.</p></div>
                        </div>
                    </div>
                </div>
                <button onClick={() => setView('LOGIN')} className="w-full py-4 bg-[#0F172A] text-white rounded-[2rem] font-black uppercase italic shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-xs">HO CAPITO, CHIUDI <ArrowRight size={18} /></button>
            </div>
        </div>
    );
};
