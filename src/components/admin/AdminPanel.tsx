import React, { useState, useEffect } from 'react';
import { ChevronLeft, Edit3, UserPlus, Save, AlertOctagon, Trash2, ShieldCheck, Users as UsersIcon, Plus } from 'lucide-react';
import { ViewState } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';

interface AdminPanelProps {
    isDarkMode: boolean;
    setView: (view: ViewState) => void;
    addToast: (msg: string, type?: any) => void;
    // Assuming useAuth is passed or we use it here. 
    // Since useAuth manages state, we can use it here if we pass the hook result, but `useAuth` is designed to be top-level. 
    // We should probably receive `usersList` and methods from parent or just logic. 
    // For simplicity, let's accept props.
    usersList: any[];
    fetchUsersList: () => void;
    currentUser: any;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
    isDarkMode, setView, addToast, usersList, fetchUsersList, currentUser
}) => {
    const [newUserForm, setNewUserForm] = useState({ username: '', password: '', role: 'user' as any });
    const [editingUsername, setEditingUsername] = useState<string | null>(null);
    const [showGlobalResetModal, setShowGlobalResetModal] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleCreateOrUpdateUser = async () => {
        if (!newUserForm.username || !newUserForm.password) {
            addToast("Username e Password obbligatori", "warning");
            return;
        }
        setIsSyncing(true);
        try {
            if (editingUsername) {
                const { error } = await supabase
                    .from('app_users')
                    .update({
                        password: newUserForm.password.trim(),
                        role: newUserForm.role
                    })
                    .eq('username', editingUsername);

                if (!error) {
                    addToast("Utente aggiornato con successo!");
                    setEditingUsername(null);
                    setNewUserForm({ username: '', password: '', role: 'user' });
                    fetchUsersList();
                } else {
                    addToast("Errore: " + error.message, "error");
                }
            } else {
                const { error } = await supabase.from('app_users').insert([{
                    username: newUserForm.username.trim().toLowerCase(),
                    password: newUserForm.password.trim(),
                    role: newUserForm.role
                }]);
                if (!error) {
                    addToast("Utente creato con successo!");
                    setNewUserForm({ username: '', password: '', role: 'user' });
                    fetchUsersList();
                } else {
                    addToast("Errore: " + error.message, "error");
                }
            }
        } catch (e) {
            addToast("Errore di rete", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleStartEditUser = (user: any) => {
        setEditingUsername(user.username);
        setNewUserForm({
            username: user.username,
            password: user.password,
            role: user.role
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteUser = async (username: string) => {
        if (username === currentUser?.username) {
            addToast("Non puoi eliminare il tuo account", "error");
            return;
        }
        if (!window.confirm(`Sei sicuro di voler eliminare l'utente ${username}?`)) return;

        setIsSyncing(true);
        try {
            const { error } = await supabase.from('app_users').delete().eq('username', username);
            if (!error) {
                addToast("Utente rimosso");
                fetchUsersList();
            } else {
                addToast("Errore: " + error.message, "error");
            }
        } catch (e) {
            addToast("Errore di rete", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    const confirmGlobalReset = async () => {
        setIsSyncing(true);
        setShowGlobalResetModal(false);
        try {
            const { error } = await supabase.from('inventory').delete().not('id', 'is', null);
            if (!error) {
                addToast("Tutti i record sono stati eliminati", "success");
                // Note: fetchCloudData needs to be called in parent or we need to pass it down. 
                // For now, we rely on parent refresh or user navigating away.
                // Ideally we pass a callback `onResetComplete`.
            } else {
                addToast("Errore durante l'eliminazione: " + error.message, "error");
            }
        } catch (e) {
            addToast("Errore di connessione al database", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <button onClick={() => setView('DASHBOARD')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-4 hover:text-blue-600 transition-colors">
                <ChevronLeft size={18} /> Dashboard
            </button>
            <div className={`p-8 rounded-[3rem] shadow-2xl border space-y-8 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
                <div className="flex items-center gap-4 border-b pb-6">
                    <div className={`p-4 rounded-2xl shadow-inner ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        {editingUsername ? <Edit3 size={28} /> : <UserPlus size={28} />}
                    </div>
                    <div>
                        <h2 className={`text-2xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{editingUsername ? `Modifica: ${editingUsername}` : 'Nuovo Utente'}</h2>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Sistema di Accessi</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Username</label>
                        <input value={newUserForm.username} onChange={e => !editingUsername && setNewUserForm({ ...newUserForm, username: e.target.value })} placeholder="LOGIN ID" disabled={!!editingUsername} className={`w-full p-4 rounded-xl font-black outline-none border-2 border-transparent transition-all uppercase text-sm ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${editingUsername ? 'opacity-50 cursor-not-allowed' : 'focus:bg-white focus:border-blue-500'}`} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Password</label>
                        <input type="password" value={newUserForm.password} onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })} placeholder="********" className={`w-full p-4 rounded-xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all text-sm ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 focus:bg-white'}`} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Ruolo</label>
                        <select value={newUserForm.role} onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value as any })} className={`w-full p-4 rounded-xl font-black outline-none border-2 border-transparent focus:border-blue-500 transition-all appearance-none text-sm ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 focus:bg-white'}`}>
                            <option value="admin">AMMINISTRATORE</option>
                            <option value="user">UTENTE STANDARD</option>
                            <option value="reader">SOLO LETTURA</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleCreateOrUpdateUser} className={`flex-1 py-4 ${editingUsername ? 'bg-amber-500' : 'bg-blue-600'} text-white rounded-2xl font-black uppercase italic shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm`}>
                        {isSyncing ? <span className="sync-loader"></span> : editingUsername ? <Save size={20} /> : <Plus size={20} />}
                        {editingUsername ? 'AGGIORNA' : 'AGGIUNGI UTENTE'}
                    </button>
                    {editingUsername && (
                        <button onClick={() => { setEditingUsername(null); setNewUserForm({ username: '', password: '', role: 'user' as any }); }} className="py-4 px-6 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase italic active:scale-95 transition-all flex items-center justify-center gap-3 text-sm">
                            ANNULLA
                        </button>
                    )}
                </div>
            </div>

            <div className={`p-8 rounded-[3rem] shadow-xl border space-y-6 transition-colors border-rose-100 bg-rose-50/30 ${isDarkMode ? 'bg-rose-900/10 border-rose-900/30' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-rose-100 text-rose-600 shadow-inner">
                        <AlertOctagon size={28} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Area Pericolo</h2>
                        <p className="text-[9px] font-bold text-rose-500 mt-1 uppercase">Manutenzione Database</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed max-w-md">Il ripristino eliminerà <span className="text-rose-600 font-black">TUTTI</span> i record dei mancanti in ogni reparto. Questa azione non influisce sugli utenti.</p>
                    <button onClick={() => setShowGlobalResetModal(true)} className="py-4 px-8 bg-rose-600 text-white rounded-2xl font-black uppercase italic shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 text-xs">
                        <Trash2 size={18} /> RESET MANCANTI
                    </button>
                </div>
            </div>

            <div className={`p-8 rounded-[3rem] shadow-xl border space-y-6 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-4 border-b pb-6">
                    <div className={`p-4 rounded-2xl shadow-inner ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Lista Accessi</h2>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Monitoraggio Permessi</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {usersList.map(u => (
                        <div key={u.username} className={`p-4 rounded-2xl border flex items-center justify-between hover:shadow-md transition-all group ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                    <UsersIcon size={20} />
                                </div>
                                <div>
                                    <span className={`text-lg font-black uppercase leading-none block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{u.username}</span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-500 mt-1.5 inline-block`}>{u.role === 'admin' ? 'Amministratore' : u.role === 'user' ? 'Utente' : 'Visitatore'}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleStartEditUser(u)} className="p-3 bg-amber-50 text-amber-600 rounded-xl active:scale-75 transition-all shadow-sm"><Edit3 size={18} /></button>
                                {u.username !== currentUser?.username && (
                                    <button onClick={() => handleDeleteUser(u.username)} className="p-3 bg-rose-50 text-rose-600 rounded-xl active:scale-75 transition-all shadow-sm"><Trash2 size={18} /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showGlobalResetModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-rose-950/90 backdrop-blur-xl">
                    <div className={`w-full max-w-md rounded-[3rem] p-10 shadow-2xl border-4 border-rose-500 text-center animate-fade-in ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                            <AlertOctagon size={48} strokeWidth={2.5} />
                        </div>
                        <h3 className={`text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cancellazione Totale</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                            Stai per eliminare <span className="text-rose-600 font-black">OGNI SINGOLO RECORD</span> di produzione presente nel database cloud.<br />Questa azione è <span className="underline">IRREVERSIBILE</span>.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={confirmGlobalReset}
                                disabled={isSyncing}
                                className="w-full py-6 bg-rose-600 text-white rounded-2xl font-black uppercase italic shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSyncing ? <span className="sync-loader"></span> : <Trash2 size={24} />}
                                {isSyncing ? 'ELIMINAZIONE...' : "SI, ELIMINA TUTTO"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowGlobalResetModal(false)}
                                className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs active:scale-95 transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                            >
                                ANNULLA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
