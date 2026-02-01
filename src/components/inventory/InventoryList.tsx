
import React from 'react';
import { FileBarChart, FileText, FileSpreadsheet, RotateCcw, Edit3, Trash2, Database } from 'lucide-react';
import { Action, Urgency } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

interface InventoryListProps {
    filteredItems: any[];
    filteredQtySum: number;
    selectedDept: string | null;
    isDarkMode: boolean;
    filters: any;
    setFilters: (filters: any) => void;
    handleResetFilters: () => void;
    canEdit: boolean;
    setFormState: (state: any) => void;
    setSelectedAction: (action: Action) => void;
    handleStartDelete: (item: any) => void;
    addToast: (msg: string, type?: any) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
    filteredItems, filteredQtySum, selectedDept, isDarkMode, filters, setFilters,
    handleResetFilters, canEdit, setFormState, setSelectedAction, handleStartDelete, addToast
}) => {
    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className={`p-5 md:p-8 rounded-[2.5rem] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <FileBarChart className="text-white" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <h2 className={`text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>REPORT {selectedDept}</h2>
                        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">DETTAGLIO REPARTO</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <div className={`border px-4 py-2 rounded-xl flex flex-col items-center justify-center min-w-[100px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-[#F0F7FF] border-blue-100'}`}>
                        <span className={`text-[7px] font-black uppercase tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-[#2563EB]'}`}>TOTALE</span>
                        <span className={`text-lg font-black italic leading-none ${isDarkMode ? 'text-blue-400' : 'text-[#2563EB]'}`}>{filteredQtySum}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => exportToPDF(filteredItems, `Report ${selectedDept}`, false, addToast)} className="bg-[#F40F02] text-white p-3 rounded-xl active:scale-90 shadow-lg shadow-rose-500/20 transition-all" title="Esporta PDF"><FileText size={18} /></button>
                        <button onClick={() => exportToExcel(filteredItems, `Report_${selectedDept}`, false, addToast)} className="bg-[#1D6F42] text-white p-3 rounded-xl active:scale-90" title="Esporta Excel"><FileSpreadsheet size={18} /></button>
                    </div>
                </div>
            </div>

            <div className={`p-4 rounded-[2rem] shadow-sm border flex flex-wrap gap-3 items-center transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="relative flex-1 min-w-[70px]">
                    <input maxLength={10} placeholder="MSN" value={filters.msn} onChange={e => setFilters({ ...filters, msn: e.target.value })} className={`w-full p-3 border-2 rounded-xl font-black uppercase text-[10px] focus:border-blue-500 outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                </div>
                <div className="relative flex-1 min-w-[70px]">
                    <input maxLength={10} placeholder="PNL" value={filters.pnl} onChange={e => setFilters({ ...filters, pnl: e.target.value })} className={`w-full p-3 border-2 rounded-xl font-black uppercase text-[10px] focus:border-blue-500 outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                </div>
                <div className="relative flex-1 min-w-[100px]">
                    <input maxLength={10} placeholder="P/N" value={filters.partNumber} onChange={e => setFilters({ ...filters, partNumber: e.target.value })} className={`w-full p-3 border-2 rounded-xl font-black uppercase text-[10px] focus:border-blue-500 outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
                </div>
                <button onClick={handleResetFilters} className="p-3 bg-slate-900 text-white rounded-xl active:scale-90"><RotateCcw size={16} /></button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredItems.length > 0 ? filteredItems.map(i => (
                    <div key={i.id} className={`p-4 md:p-5 rounded-[2rem] shadow-sm flex items-center justify-between border-2 border-transparent transition-all relative ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-100/50 border-slate-100'}`}>
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`w-1.5 h-12 rounded-full shrink-0 ${i.urgency === Urgency.ALTA ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : i.urgency === Urgency.MEDIA ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-[8px] font-bold uppercase tracking-widest mb-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>MSN {i.msn} / {i.pnl}</p>
                                <h3 className={`text-lg font-black uppercase italic tracking-tighter leading-none truncate ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{i.part_number}</h3>
                                <div className="flex gap-1.5 mt-1">
                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase italic">Q.TA: {i.quantita}</span>
                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-white text-slate-500 border border-slate-200 uppercase tracking-tight truncate max-w-[80px]">{i.department}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {canEdit && (
                                <>
                                    <button onClick={() => { setFormState({ id: i.id, msn: i.msn, pnl: i.pnl, partNumber: i.part_number, quantita: String(i.quantita), urgency: i.urgency as Urgency, dataMasticiatura: i.data_masticiatura || '', note: i.note || '', tipo: i.tipo || '' }); setSelectedAction(Action.INSERISCI); }} className="p-3.5 bg-amber-100 text-amber-600 rounded-xl active:scale-75 transition-all shadow-sm" title="Modifica"><Edit3 size={18} /></button>
                                    <button onClick={() => handleStartDelete(i)} className="p-3.5 bg-rose-100 text-rose-600 rounded-xl active:scale-75 transition-all shadow-sm" title="Evadi"><Trash2 size={18} /></button>
                                </>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="py-16 text-center opacity-20"><Database size={60} className="mx-auto" /><p className="font-black uppercase text-sm mt-3 italic tracking-widest">Nessun record</p></div>
                )}
            </div>
        </div>
    );
};
