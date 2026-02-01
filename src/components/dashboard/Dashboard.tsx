
import React from 'react';
import { Layers, LayoutDashboard, Activity, CopyX, FileSpreadsheet, FileText, Search, Box, Trash2 } from 'lucide-react';
import { Department, ViewState } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

interface DashboardProps {
    isDarkMode: boolean;
    setView: (view: ViewState) => void;
    setSelectedDept: (dept: Department | null) => void;
    stats: { totalQty: number, sumByDept: Record<string, number> };
    interRepartoDuplicatesConsolidated: any[];
    filters: any;
    setFilters: (filters: any) => void;
    handleStartDelete: (item: any) => void;
    canEdit: boolean;
    addToast: (msg: string, type?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    isDarkMode, setView, setSelectedDept, stats, interRepartoDuplicatesConsolidated,
    filters, setFilters, handleStartDelete, canEdit, addToast
}) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(Department).map(d => (
                    <button key={d} onClick={() => { setSelectedDept(d); setView('ACTION_SELECT'); }} className={`p-6 border-2 border-transparent rounded-[2.5rem] shadow-lg transition-all text-center group active:scale-95 ${isDarkMode ? 'bg-slate-900 hover:border-blue-500' : 'bg-white hover:border-blue-500'}`}>
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-slate-800 text-blue-400 border-slate-700' : 'bg-[#F0F7FF] text-[#2563EB] border-blue-50'}`}>
                                <Layers size={24} />
                            </div>
                            <span className={`text-lg font-black uppercase italic tracking-tighter group-hover:text-blue-600 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{d}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-[2rem] text-white shadow-xl flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-[#0F172A]'}`}>
                    <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <LayoutDashboard size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black opacity-60 uppercase tracking-widest leading-none mb-1">TOTALE</span>
                        <span className="text-2xl font-black italic leading-none">{stats.totalQty}</span>
                    </div>
                </div>
                {Object.values(Department).map(d => (
                    <div key={d} className={`p-3 rounded-[2rem] shadow-sm flex items-center gap-4 border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${isDarkMode ? 'bg-slate-800 text-blue-400 border-slate-700' : 'bg-[#F0F7FF] text-[#2563EB] border-blue-50'}`}>
                            <Activity size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{d}</span>
                            <span className={`text-xl font-black italic leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.sumByDept[d] || 0}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`p-8 rounded-[3.5rem] shadow-xl border space-y-8 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-[1.5rem] shadow-inner ${isDarkMode ? 'bg-amber-900/30 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                            <CopyX size={28} />
                        </div>
                        <div>
                            <h2 className={`text-xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Duplicati Inter-Reparto</h2>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Stesso MSN + PNL + PN in più settori</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => exportToExcel(interRepartoDuplicatesConsolidated, 'Report_Duplicati', true, addToast)} className="p-2 bg-emerald-50 text-[#1D6F42] rounded-lg active:scale-90 transition-all" title="Esporta Excel"><FileSpreadsheet size={16} /></button>
                        <button onClick={() => exportToPDF(interRepartoDuplicatesConsolidated, 'Report Duplicati', true, addToast)} className="p-2 bg-rose-50 text-[#F40F02] rounded-lg active:scale-90 transition-all" title="Esporta PDF"><FileText size={16} /></button>
                    </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-[2rem] ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input maxLength={10} placeholder="Filtra MSN..." value={filters.msn} onChange={e => setFilters({ ...filters, msn: e.target.value })} className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl font-bold uppercase text-[10px] focus:border-blue-500 outline-none shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`} />
                    </div>
                    <div className="relative">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input maxLength={10} placeholder="Filtra PNL..." value={filters.pnl} onChange={e => setFilters({ ...filters, pnl: e.target.value })} className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl font-bold uppercase text-[10px] focus:border-blue-500 outline-none shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`} />
                    </div>
                    <div className="relative">
                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input maxLength={10} placeholder="Filtra Part Number..." value={filters.partNumber} onChange={e => setFilters({ ...filters, partNumber: e.target.value })} className={`w-full p-3 border-2 rounded-xl font-black uppercase text-[10px] focus:border-blue-500 outline-none shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`} />
                    </div>
                </div>

                <div className="space-y-3">
                    {interRepartoDuplicatesConsolidated.length > 0 ? interRepartoDuplicatesConsolidated.map(i => (
                        <div key={`${i.msn}_${i.part_number}_dup`} className={`p-4 rounded-2xl border flex items-center justify-between hover:shadow-lg transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800' : 'bg-slate-50/50 border-slate-100 hover:bg-white'}`}>
                            <div className="flex flex-col md:flex-row md:gap-6 md:items-center">
                                <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase leading-none block mb-1">MSN / PNL</span>
                                    <span className={`text-base font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{i.msn} <span className="text-blue-600 not-italic ml-2">{i.pnl}</span></span>
                                </div>
                                <div className="mt-1 md:mt-0">
                                    <span className="text-[9px] font-black text-slate-400 uppercase leading-none block mb-1">PART NUMBER</span>
                                    <span className={`text-base font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{i.part_number}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-1 md:mt-0">
                                    {i.departments.map((d: any) => (
                                        <div key={d} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[7px] font-black uppercase tracking-widest">{d}</div>
                                    ))}
                                </div>
                            </div>
                            {canEdit && (
                                <button
                                    onClick={() => handleStartDelete(i)}
                                    className="p-3 bg-rose-50 text-rose-600 rounded-xl active:scale-75 transition-all shadow-sm"
                                    title="Gestisci Duplicati"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    )) : (
                        <div className="py-12 text-center opacity-30"><LayoutDashboard size={36} className="mx-auto mb-3" /><p className="font-black uppercase text-base italic tracking-widest">Nessun duplicato</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};
