
import React from 'react';
import { AlertTriangle, Trash2, Check } from 'lucide-react';

interface MultiDeleteModalProps {
    data: {
        id: string;
        msn: string;
        pnl: string;
        part_number: string;
        others: string[];
        department: string;
    } | null;
    setData: (data: any) => void;
    confirmMultiDelete: (mode: 'local' | 'global' | 'single') => void;
    isDarkMode: boolean;
}

export const MultiDeleteModal: React.FC<MultiDeleteModalProps> = ({ data, setData, confirmMultiDelete, isDarkMode }) => {
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-[501] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
            <div className={`w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-fade-in border text-center ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-blue-100'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${data.others.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {data.others.length > 0 ? <AlertTriangle size={36} /> : <Check size={36} />}
                </div>

                <h3 className={`text-2xl font-black uppercase italic tracking-tighter mb-2 leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {data.others.length > 0 ? 'Scarico Multi-Settore' : 'Conferma Evasione'}
                </h3>

                <div className="space-y-4 mb-8">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        Pezzo: <span className="text-blue-600">{data.part_number}</span>
                    </p>
                    {data.others.length > 0 && (
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Presente anche in: <span className="text-blue-600 font-black">{data.others.join(', ')}</span>
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {data.others.length > 0 ? (
                        <>
                            <button onClick={() => confirmMultiDelete('global')} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                                <Trash2 size={16} /> ELIMINA OVUNQUE
                            </button>
                            <button onClick={() => confirmMultiDelete('local')} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                                <Check size={18} /> SOLO IN {data.department}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => confirmMultiDelete('single')} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                            <Check size={24} /> CONFERMA EVASIONE
                        </button>
                    )}

                    <button
                        onClick={() => setData(null)}
                        className={`w-full py-5 rounded-2xl font-black uppercase text-xs active:scale-95 transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                    >
                        ANNULLA
                    </button>
                </div>
            </div>
        </div>
    );
};
