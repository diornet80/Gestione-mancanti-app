import React from 'react';
import { ChevronLeft, FileJson, FileSpreadsheet, FileText, PieChart, TrendingUp, Activity } from 'lucide-react';
import { DonutChart } from './DonutChart';
import { ParetoChart } from './ParetoChart';
import { exportAnalytics } from '../../utils/exportUtils';
import { Department, Urgency, ViewState } from '../../types';

interface AnalyticsDashboardProps {
    analyticsData: any;
    isDarkMode: boolean;
    setView: (view: ViewState) => void;
    addToast: (msg: string, type?: any) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analyticsData, isDarkMode, setView, addToast }) => {
    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center justify-between gap-4">
                <button onClick={() => setView('DASHBOARD')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase hover:text-blue-600 transition-colors shrink-0">
                    <ChevronLeft size={18} /> Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => exportAnalytics(analyticsData, 'json', addToast)} className={`p-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase active:scale-90 transition-all ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`} title="Esporta JSON"><FileJson size={16} /> <span className="hidden sm:inline">JSON</span></button>
                    <button onClick={() => exportAnalytics(analyticsData, 'excel', addToast)} className={`p-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase active:scale-90 transition-all ${isDarkMode ? 'bg-slate-800 text-[#1D6F42]' : 'bg-emerald-50 text-[#1D6F42]'}`} title="Esporta Excel"><FileSpreadsheet size={16} /> <span className="hidden sm:inline">EXCEL</span></button>
                    <button onClick={() => exportAnalytics(analyticsData, 'pdf', addToast)} className={`p-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase active:scale-90 transition-all ${isDarkMode ? 'bg-slate-800 text-[#F40F02]' : 'bg-rose-50 text-[#F40F02]'}`} title="Esporta PDF"><FileText size={16} /> <span className="hidden sm:inline">PDF</span></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-[2.5rem] shadow-xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-3 mb-6"><PieChart className="text-blue-600" size={20} /><h3 className="font-black uppercase italic text-sm tracking-tight">Mancanti per Reparto</h3></div>
                    <div className="flex flex-col items-center">
                        <DonutChart data={analyticsData.deptTotals} isDarkMode={isDarkMode} />
                        <div className="grid grid-cols-1 gap-2 mt-6 w-full">{analyticsData.deptTotals.map((d: any, i: number) => (<div key={d.label} className={`flex items-center justify-between px-4 py-2 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}><div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#2563EB', '#F59E0B', '#10B981'][i] }}></div><span className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-400'}`}>{d.label}</span></div><span className={`text-sm font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.value}</span></div>))}</div>
                    </div>
                </div>
                <div className={`p-6 rounded-[2.5rem] shadow-xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-3 mb-6"><TrendingUp className="text-rose-600" size={20} /><h3 className="font-black uppercase italic text-sm tracking-tight">Analisi Criticità</h3></div>
                    <div className="space-y-5">{analyticsData.urgencyTotals.map((u: any) => { const colors: Record<string, string> = { [Urgency.BASSA]: 'bg-emerald-500', [Urgency.MEDIA]: 'bg-amber-500', [Urgency.ALTA]: 'bg-rose-500' }; const maxVal = Math.max(...analyticsData.urgencyTotals.map((v: any) => v.value), 1); const percent = (u.value / maxVal) * 100; return (<div key={u.label} className="space-y-1.5"><div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span className={isDarkMode ? 'text-slate-300' : 'text-slate-400'}>{u.label}</span><span className={isDarkMode ? 'text-white font-black' : 'text-slate-900 font-bold'}>{u.value}</span></div><div className={`h-4 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}><div className={`h-full ${colors[u.label as string]} transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: `${percent}%` }}></div></div></div>); })}</div>
                    <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}><p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Il reparto <span className="text-blue-600 font-black">AUTOMATIZZATO</span> presenta attualmente il carico maggiore di urgenze elevate.</p></div>
                </div>
                <div className={`p-6 rounded-[2.5rem] shadow-xl border col-span-1 md:col-span-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><Activity className="text-blue-600" size={20} /><h3 className="font-black uppercase italic text-sm tracking-tight">Pareto Part Numbers (Top 10)</h3></div><div className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${isDarkMode ? 'bg-rose-900/40 text-rose-400' : 'bg-rose-50 text-rose-500'}`}>Linea % Cumulata</div></div>
                    <ParetoChart data={analyticsData.paretoData} isDarkMode={isDarkMode} />
                    <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">{analyticsData.paretoData.slice(0, 10).map((item: any, idx: number) => (<div key={item.label} className={`shrink-0 p-4 rounded-2xl border min-w-[140px] shadow-sm transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}><p className={`text-[8px] font-black uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOP {idx + 1}</p><p className={`text-sm font-black italic truncate mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</p><p className={`text-[10px] font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{item.value} PEZZI ({item.cumulativePercent.toFixed(1)}%)</p></div>))}</div>
                </div>
            </div>
        </div>
    );
};
