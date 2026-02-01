
import React from 'react';
import { Save, Maximize, Layers, Box, Hash, Calendar, Type, MessageSquare, Plus, Edit3, Trash2 } from 'lucide-react';
import { Action, Urgency } from '../../types';

interface InventoryFormProps {
    formState: any;
    setFormState: (state: any) => void;
    selectedAction: Action;
    selectedDept: string | null;
    saveToCloud: (data: any, dept: any, user: string) => Promise<boolean>;
    currentUser: any;
    isSyncing: boolean;
    isDarkMode: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
    formState, setFormState, selectedAction, selectedDept, saveToCloud, currentUser, isSyncing, isDarkMode
}) => {
    const handleSubmit = async () => {
        await saveToCloud(formState, selectedDept, currentUser?.username);
    };

    return (
        <div className={`max-w-4xl mx-auto p-12 rounded-[4rem] shadow-2xl space-y-10 border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
            <div className="flex items-center justify-between border-b pb-6">
                <h2 className="text-3xl font-black uppercase italic text-blue-600 tracking-tightest">{formState.id ? 'MODIFICA MANCANTE' : 'SCHEDA MANCANTE'}</h2>
                <div className="w-16 h-2 bg-blue-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Maximize size={12} /> MSN <span className="text-rose-500 font-black">*</span></label>
                    <input value={formState.msn} onChange={e => setFormState({ ...formState, msn: e.target.value.toUpperCase() })} placeholder="E.G. 21456" className={`w-full p-6 rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-950 text-white focus:bg-white focus:text-slate-900' : 'bg-slate-50 focus:bg-white'}`} />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Layers size={12} /> PNL <span className="text-rose-500 font-black">*</span></label>
                    <input value={formState.pnl} onChange={e => setFormState({ ...formState, pnl: e.target.value.toUpperCase() })} placeholder="E.G. 12" className={`w-full p-6 rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-950 text-white focus:bg-white focus:text-slate-900' : 'bg-slate-50 focus:bg-white'}`} />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Box size={12} /> PART NUMBER <span className="text-rose-500 font-black">*</span></label>
                    <input value={formState.partNumber} onChange={e => setFormState({ ...formState, partNumber: e.target.value.toUpperCase() })} placeholder="CODICE PARTE" className={`w-full p-6 rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-950 text-white focus:bg-white focus:text-slate-900' : 'bg-slate-50 focus:bg-white'}`} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Hash size={12} /> QTY</label>
                    <input type="number" value={formState.quantita} onChange={e => setFormState({ ...formState, quantita: e.target.value })} className={`w-full p-6 rounded-2xl font-black text-center outline-none border-2 border-transparent focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-950 text-white focus:bg-white focus:text-slate-900' : 'bg-slate-50 focus:bg-white'}`} />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Calendar size={12} /> DATA MASTICIATURA</label>
                    <input type="date" value={formState.dataMasticiatura} onChange={e => setFormState({ ...formState, dataMasticiatura: e.target.value })} className={`w-full p-6 rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-950 text-white focus:bg-white focus:text-slate-900' : 'bg-slate-50 focus:bg-white'}`} />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Type size={12} /> TIPO</label>
                    <input value={formState.tipo} onChange={e => setFormState({ ...formState, tipo: e.target.value.toUpperCase() })} placeholder="MACRO/MICRO" className={`w-full p-6 rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-950 text-white focus:bg-white focus:text-slate-900' : 'bg-slate-50 focus:bg-white'}`} />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><MessageSquare size={12} /> NOTE</label>
                <textarea value={formState.note} onChange={e => setFormState({ ...formState, note: e.target.value.toUpperCase() })} placeholder="NOTE AGGIUNTIVE..." className={`w-full p-8 rounded-[2.5rem] font-black h-32 resize-none outline-none border-2 border-transparent focus:border-blue-500 transition-all ${isDarkMode ? 'bg-slate-950 text-white focus:bg-white focus:text-slate-900' : 'bg-slate-50 focus:bg-white'}`}></textarea>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    {[Urgency.BASSA, Urgency.MEDIA, Urgency.ALTA].map(u => (
                        <button key={u} onClick={() => setFormState({ ...formState, urgency: u })} className={`p-6 rounded-3xl font-black text-xs uppercase italic transition-all border-2 ${formState.urgency === u ? (u === Urgency.BASSA ? 'bg-[#00A669] border-[#00A669] text-white' : u === Urgency.MEDIA ? 'bg-amber-500 border-amber-500 text-white' : 'bg-rose-600 border-rose-600 text-white') : 'bg-white border-slate-100 text-slate-400'}`}>
                            {u}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
                <button onClick={handleSubmit} className="flex-[2] py-8 bg-[#2563EB] text-white rounded-[3rem] font-black uppercase italic shadow-2xl flex items-center justify-center gap-4 text-xl active:scale-95 transition-all">
                    {isSyncing ? <span className="sync-loader"></span> : <Save size={28} />}
                    {formState.id ? 'AGGIORNA RECORD' : `SALVA IN ${selectedDept}`}
                </button>
            </div>
        </div>
    );
};
