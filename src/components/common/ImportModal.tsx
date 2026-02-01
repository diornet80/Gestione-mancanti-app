
import React, { useState } from 'react';
import { Settings2, RefreshCw, Upload } from 'lucide-react';
import { generateUUID, getVal, excelSerialToDateString } from '../../utils/formatters';
import { Department, Urgency } from '../../types';
import { supabase } from '../../services/supabase';

interface ImportModalProps {
    pendingImport: { data: any[], fileName: string } | null;
    setPendingImport: (data: any) => void;
    selectedDept: Department | null;
    isDarkMode: boolean;
    inventory: any[];
    fetchCloudData: () => void;
    setIsSyncing: (val: boolean) => void;
    isSyncing: boolean;
    setView: (val: any) => void;
    addToast: (msg: string, type?: any) => void;
    fileInputRef: any;
}

export const ImportModal: React.FC<ImportModalProps> = ({
    pendingImport, setPendingImport, selectedDept, isDarkMode, inventory,
    fetchCloudData, setIsSyncing, isSyncing, setView, addToast
}) => {
    const [importOptions, setImportOptions] = useState({
        duplicatePolicy: 'skip' as 'skip' | 'replace',
        cleanDepartment: false
    });

    if (!pendingImport) return null;

    const executeImport = async () => {
        if (!pendingImport || !selectedDept) return;
        setIsSyncing(true);

        try {
            const { data: rawData } = pendingImport;
            const { duplicatePolicy, cleanDepartment } = importOptions;

            const existingItems = inventory.filter(i => i.department === selectedDept);
            const existingKeys = new Set(existingItems.map(i => `${String(i.msn).toUpperCase()}_${String(i.pnl).toUpperCase()}_${String(i.part_number).toUpperCase()}`));

            const batch: any[] = [];
            const incomingKeys = new Set<string>();

            rawData.forEach((row: any) => {
                const msn = String(getVal(row, 'MSN', 'msn') || '').toUpperCase().trim();
                const pnl = String(getVal(row, 'PNL', 'pnl') || '').toUpperCase().trim();
                const pn = String(getVal(row, 'PART NUMBER', 'PART_NUMBER', 'PARTNUMBER', 'pn', 'partnumber') || '').toUpperCase().trim();

                if (!msn || !pnl || !pn) return;
                const itemKey = `${msn}_${pnl}_${pn}`;

                if (!cleanDepartment && duplicatePolicy === 'skip' && existingKeys.has(itemKey)) return;
                if (incomingKeys.has(itemKey)) return;

                incomingKeys.add(itemKey);

                const rawQta = getVal(row, "QUANTITA'", "QUANTITA", "QUANTITÀ", "QTY", "QTA");
                const qta = parseInt(String(rawQta)) || 1;
                const rawDataMast = getVal(row, 'DATA MASTICIATURA', 'DATA_MASTICIATURA', 'DATA', 'DATE');
                const dataMast = excelSerialToDateString(rawDataMast);
                const note = String(getVal(row, 'NOTE', 'note') || '').toUpperCase().trim();
                const tipo = String(getVal(row, 'TIPO', 'tipo') || '').toUpperCase().trim();

                batch.push({
                    id: generateUUID(),
                    msn, pnl, part_number: pn, quantita: qta,
                    data_masticiatura: dataMast, note, tipo,
                    urgency: Urgency.BASSA, department: selectedDept,
                    created_by: 'import',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            });

            if (batch.length === 0 && !cleanDepartment) {
                addToast("Nessun nuovo dato da importare.", "warning");
                setIsSyncing(false);
                setPendingImport(null);
                return;
            }

            if (cleanDepartment) {
                await supabase.from('inventory').delete().eq('department', selectedDept);
            }
            else if (duplicatePolicy === 'replace') {
                const toDeleteIds = existingItems
                    .filter(i => incomingKeys.has(`${String(i.msn).toUpperCase()}_${String(i.pnl).toUpperCase()}_${String(i.part_number).toUpperCase()}`))
                    .map(i => i.id);

                if (toDeleteIds.length > 0) {
                    await supabase.from('inventory').delete().in('id', toDeleteIds);
                }
            }

            if (batch.length > 0) {
                const { error } = await supabase.from('inventory').insert(batch);
                if (error) throw error;
            }

            addToast(`Importazione completata: ${batch.length} record elaborati.`);
            await fetchCloudData();
            setPendingImport(null);
            setView('DASHBOARD');
        } catch (err: any) {
            addToast("Errore durante l'importazione: " + err.message, "error");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
            <div className={`w-full max-w-md rounded-[3rem] p-10 shadow-2xl border-2 animate-fade-in ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-100'}`}>
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
                        <Settings2 size={24} />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Opzioni Import</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Configura Sincronizzazione</p>
                    </div>
                </div>

                <div className="space-y-8 mb-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">Gestione Record Duplicati</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setImportOptions({ ...importOptions, duplicatePolicy: 'skip' })}
                                className={`py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${importOptions.duplicatePolicy === 'skip' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                            >
                                Salta Duplicati
                            </button>
                            <button
                                onClick={() => setImportOptions({ ...importOptions, duplicatePolicy: 'replace' })}
                                className={`py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${importOptions.duplicatePolicy === 'replace' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                            >
                                Sostituisci
                            </button>
                        </div>
                    </div>

                    <div className="p-5 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <RefreshCw className={importOptions.cleanDepartment ? "text-rose-500 animate-spin-slow" : "text-slate-300"} size={20} />
                            <div>
                                <span className={`text-[10px] font-black uppercase block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pulisci Reparto</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sincronizza file</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setImportOptions({ ...importOptions, cleanDepartment: !importOptions.cleanDepartment })}
                            className={`w-12 h-6 rounded-full p-1 transition-all ${importOptions.cleanDepartment ? 'bg-rose-500' : 'bg-slate-200'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${importOptions.cleanDepartment ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className={`p-4 rounded-2xl text-[9px] font-bold uppercase italic leading-tight ${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                        {importOptions.cleanDepartment ? (
                            <span className="text-rose-500 font-black">ATTENZIONE: Verranno eliminati tutti i pezzi attuali in {selectedDept} non presenti in questo file.</span>
                        ) : (
                            "I dati attuali verranno mantenuti, aggiungendo solo i nuovi elementi dal file."
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={executeImport}
                        disabled={isSyncing}
                        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase italic shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {isSyncing ? <span className="sync-loader"></span> : <Upload size={20} />}
                        AVVIA IMPORTAZIONE
                    </button>
                    <button
                        onClick={() => setPendingImport(null)}
                        className={`w-full py-4 rounded-[2rem] font-black uppercase text-xs active:scale-95 transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                    >
                        ANNULLA
                    </button>
                </div>
            </div>
        </div>
    );
};
