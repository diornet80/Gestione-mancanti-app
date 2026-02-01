
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Home, Search as SearchIcon, ChevronLeft } from 'lucide-react';
import { Action, Department, ViewState, Urgency } from './types';
import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';
import { useToast } from './hooks/useToast';
import { ToastContainer, Header } from './components/common';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { ActionSelect } from './components/dashboard/ActionSelect';
import { InventoryForm } from './components/inventory/InventoryForm';
import { InventoryList } from './components/inventory/InventoryList';
import { AdminPanel } from './components/admin/AdminPanel';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { Guide } from './components/common/Guide';
import { MultiDeleteModal } from './components/common/MultiDeleteModal';
import { ImportModal } from './components/common/ImportModal';

const App: React.FC = () => {
    const [view, setView] = useState<ViewState>('DASHBOARD');
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [pendingImport, setPendingImport] = useState<{ data: any[], fileName: string } | null>(null);
    const [pendingMultiDelete, setPendingMultiDelete] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [filters, setFilters] = useState({ msn: '', pnl: '', partNumber: '' });
    const [formState, setFormState] = useState({
        id: '', msn: '', pnl: '', partNumber: '',
        quantita: '1', urgency: Urgency.BASSA,
        dataMasticiatura: new Date().toISOString().split('T')[0],
        note: '', tipo: ''
    });

    const { toasts, addToast } = useToast();
    const { currentUser, login, usersList, fetchUsersList, isSyncing: authSyncing } = useAuth(addToast);
    const {
        inventory, isSyncing: invSyncing, fetchCloudData, saveToCloud, deleteItem, globalDelete,
        stats, interRepartoDuplicatesConsolidated, analyticsData, setIsSyncing
    } = useInventory(addToast);

    const isSyncing = authSyncing || invSyncing;

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                setPendingImport({ data, fileName: file.name });
            };
            reader.readAsBinaryString(file);
        }
        e.target.value = ''; // Reset input
    };

    const handleStartDelete = (item: any) => {
        // Check if item exists in other departments
        const others = inventory.filter(i =>
            i.msn === item.msn && i.pnl === item.pnl && i.part_number === item.part_number && i.department !== item.department
        ).map(i => i.department);
        const uniqueOthers = Array.from(new Set(others));

        if (uniqueOthers.length > 0) {
            setPendingMultiDelete({
                id: item.id,
                msn: item.msn,
                pnl: item.pnl,
                part_number: item.part_number,
                others: uniqueOthers,
                department: item.department
            });
        } else {
            setPendingMultiDelete({
                id: item.id,
                msn: item.msn,
                pnl: item.pnl,
                part_number: item.part_number,
                others: [],
                department: item.department
            });
        }
    };

    const confirmMultiDelete = async (mode: 'local' | 'global' | 'single') => {
        if (!pendingMultiDelete) return;

        if (mode === 'global') {
            globalDelete(pendingMultiDelete.msn, pendingMultiDelete.pnl, pendingMultiDelete.part_number);
        } else {
            deleteItem(pendingMultiDelete.id);
        }
        setPendingMultiDelete(null);
    };

    const filteredItems = useMemo(() => {
        return inventory.filter(item => {
            const matchesDept = selectedAction === Action.FILTRA ? true : item.department === selectedDept;
            const matchesMsn = item.msn.startsWith(filters.msn.toUpperCase());
            const matchesPnl = (item.pnl || '').startsWith(filters.pnl.toUpperCase());
            const matchesPn = item.part_number.startsWith(filters.partNumber.toUpperCase());
            return matchesDept && matchesMsn && matchesPnl && matchesPn;
        });
    }, [inventory, selectedDept, selectedAction, filters]);

    const filteredQtySum = filteredItems.reduce((acc, curr) => acc + (curr.quantita || 0), 0);

    const canEdit = currentUser && currentUser.role !== 'reader';

    if (!currentUser) {
        return (
            <>
                <ToastContainer toasts={toasts} isDarkMode={isDarkMode} />
                <Login
                    onLogin={(e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        login(target.username.value, target.password.value);
                    }}
                    isSyncing={isSyncing}
                    onViewGuide={() => setView('GUIDA')}
                    onShare={() => {
                        navigator.clipboard.writeText(window.location.href);
                        addToast("Link copiato!");
                    }}
                />
                {view === 'GUIDA' && (
                    <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl p-6 overflow-y-auto">
                        <Guide isDarkMode={true} setView={setView} />
                    </div>
                )}
            </>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 font-sans ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
            <ToastContainer toasts={toasts} isDarkMode={isDarkMode} />

            <Header
                view={view} selectedDept={selectedDept} currentUser={currentUser}
                isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setView={setView}
                onLogout={() => window.location.reload()}
            />

            <main className="container mx-auto px-4 pb-32 pt-6 max-w-7xl">
                {view === 'DASHBOARD' && (
                    <Dashboard
                        isDarkMode={isDarkMode} setView={setView} setSelectedDept={setSelectedDept}
                        stats={stats} interRepartoDuplicatesConsolidated={interRepartoDuplicatesConsolidated}
                        filters={filters} setFilters={setFilters} handleStartDelete={handleStartDelete}
                        canEdit={!!canEdit} addToast={addToast}
                    />
                )}

                {view === 'ACTION_SELECT' && (
                    <ActionSelect
                        setView={setView} setSelectedAction={setSelectedAction} setFormState={setFormState}
                        fileInputRef={fileInputRef} handleImportExcel={handleImportExcel} canEdit={!!canEdit} isDarkMode={isDarkMode}
                    />
                )}

                {view === 'CONTENT' && (
                    <>
                        <button onClick={() => setView('ACTION_SELECT')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-6 hover:text-blue-600 transition-colors">
                            <ChevronLeft size={18} /> Indietro
                        </button>
                        {(selectedAction === Action.INSERISCI || selectedAction === Action.MODIFICA) && (
                            <InventoryForm
                                formState={formState} setFormState={setFormState} selectedAction={selectedAction}
                                selectedDept={selectedDept} saveToCloud={saveToCloud} currentUser={currentUser}
                                isSyncing={isSyncing} isDarkMode={isDarkMode}
                            />
                        )}
                        {(selectedAction === Action.FILTRA || selectedAction === Action.ELIMINA) && (
                            <InventoryList
                                filteredItems={filteredItems} filteredQtySum={filteredQtySum} selectedDept={selectedDept}
                                isDarkMode={isDarkMode} filters={filters} setFilters={setFilters}
                                handleResetFilters={() => setFilters({ msn: '', pnl: '', partNumber: '' })}
                                canEdit={!!canEdit} setFormState={setFormState} setSelectedAction={setSelectedAction}
                                handleStartDelete={handleStartDelete} addToast={addToast}
                            />
                        )}
                    </>
                )}

                {view === 'ANALYTICS' && (
                    <AnalyticsDashboard analyticsData={analyticsData} isDarkMode={isDarkMode} setView={setView} addToast={addToast} />
                )}

                {view === 'ADMIN_PANEL' && (
                    <AdminPanel
                        isDarkMode={isDarkMode} setView={setView} addToast={addToast}
                        usersList={usersList} fetchUsersList={fetchUsersList} currentUser={currentUser}
                    />
                )}

                {view === 'GUIDA' && (
                    <Guide isDarkMode={isDarkMode} setView={setView} />
                )}
            </main>

            {(view !== 'GUIDA' && view !== 'LOGIN') && (
                <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-2 flex items-center justify-around z-[200] shadow-xl transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <button onClick={() => { setView('DASHBOARD'); setSelectedDept(null); setSelectedAction(null); }} className={`flex flex-col items-center gap-0.5 transition-all ${view === 'DASHBOARD' ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-blue-500'}`}><Home size={22} strokeWidth={2.5} /><span className="text-[8px] font-black uppercase tracking-wider">Home</span></button>
                    <button onClick={() => { setSelectedAction(Action.FILTRA); setView('CONTENT'); }} className={`flex flex-col items-center gap-0.5 transition-all ${selectedAction === Action.FILTRA ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-blue-500'}`}><SearchIcon size={22} strokeWidth={2.5} /><span className="text-[8px] font-black uppercase tracking-wider">Cerca</span></button>
                    <button onClick={() => setView('ACTION_SELECT')} disabled={view === 'DASHBOARD'} className={`flex flex-col items-center gap-0.5 transition-all ${view === 'DASHBOARD' ? 'text-slate-200 opacity-20' : 'text-slate-500 active:scale-90'}`}><ChevronLeft size={22} strokeWidth={2.5} /><span className="text-[8px] font-black uppercase tracking-wider">Indietro</span></button>
                </nav>
            )}

            <MultiDeleteModal
                data={pendingMultiDelete} setData={setPendingMultiDelete}
                confirmMultiDelete={confirmMultiDelete} isDarkMode={isDarkMode}
            />

            <ImportModal
                pendingImport={pendingImport} setPendingImport={setPendingImport} selectedDept={selectedDept}
                isDarkMode={isDarkMode} inventory={inventory} fetchCloudData={fetchCloudData}
                setIsSyncing={setIsSyncing} isSyncing={isSyncing} setView={setView} addToast={addToast}
                fileInputRef={fileInputRef}
            />
        </div>
    );
};

export default App;
