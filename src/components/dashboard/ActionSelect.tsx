
import React from 'react';
import { ChevronLeft, Plus, Edit3, Trash2, FileSpreadsheet, Search as SearchIcon } from 'lucide-react';
import { Action, Department, ViewState, Urgency } from '../../types';

interface ActionSelectProps {
    setView: (view: ViewState) => void;
    setSelectedAction: (action: Action | null) => void;
    setFormState: (state: any) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
    canEdit: boolean;
    isDarkMode: boolean;
    currentUserRole?: string;
}

export const ActionSelect: React.FC<ActionSelectProps> = ({
    setView, setSelectedAction, setFormState, fileInputRef, handleImportExcel, canEdit, isDarkMode, currentUserRole
}) => {
    return (
        <div className="max-w-md mx-auto space-y-4 animate-fade-in">
            <button onClick={() => setView('DASHBOARD')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-6 px-4 hover:text-blue-600 transition-colors">
                <ChevronLeft size={18} /> Torna alla Home
            </button>
            {canEdit && (
                <>
                    <button onClick={() => { setFormState({ id: '', msn: '', pnl: '', partNumber: '', quantita: '1', urgency: Urgency.BASSA, dataMasticiatura: new Date().toISOString().split('T')[0], note: '', tipo: '' }); setSelectedAction(Action.INSERISCI); setView('CONTENT'); }} className={`w-full p-8 rounded-[2.5rem] shadow-sm border-2 border-transparent hover:border-emerald-500 flex items-center gap-6 group transition-all ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl"><Plus size={32} /></div>
                        <span className={`text-xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Aggiungi</span>
                    </button>
                    <button onClick={() => { setSelectedAction(Action.MODIFICA); setView('CONTENT'); }} className={`w-full p-8 rounded-[2.5rem] shadow-sm border-2 border-transparent hover:border-amber-500 flex items-center gap-6 group transition-all ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="p-5 bg-amber-50 text-amber-600 rounded-2xl"><Edit3 size={32} /></div>
                        <span className={`text-xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Modifica</span>
                    </button>
                    <button onClick={() => { setSelectedAction(Action.ELIMINA); setView('CONTENT'); }} className={`w-full p-8 rounded-[2.5rem] shadow-sm border-2 border-transparent hover:border-rose-500 flex items-center gap-6 group transition-all ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="p-5 bg-rose-50 text-rose-600 rounded-2xl"><Trash2 size={32} /></div>
                        <span className={`text-xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Evadi</span>
                    </button>
                </>
            )}

            <button onClick={() => { setSelectedAction(Action.FILTRA); setView('CONTENT'); }} className={`w-full p-8 rounded-[2.5rem] shadow-sm border-2 border-transparent hover:border-blue-500 flex items-center gap-6 group transition-all ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl"><SearchIcon size={32} /></div>
                <span className={`text-xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Lista / Filtri</span>
            </button>

            {canEdit && currentUserRole === 'admin' && (
                <button onClick={() => fileInputRef.current?.click()} className={`w-full p-8 rounded-[2.5rem] shadow-sm border-2 border-transparent hover:border-[#1D6F42] flex items-center gap-6 group transition-all ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                    <div className="p-5 bg-emerald-50 text-[#1D6F42] rounded-2xl"><FileSpreadsheet size={32} /></div>
                    <span className={`text-xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Importa Excel</span>
                    <input type="file" ref={fileInputRef} onChange={handleImportExcel} accept=".xlsx, .xls, .csv" className="hidden" />
                </button>
            )}
        </div>
    );
};
