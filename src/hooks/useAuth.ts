
import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';

export const useAuth = (addToast: (msg: string, type?: any) => void) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [usersList, setUsersList] = useState<User[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const login = async (userVal: string, passVal: string) => {
        setIsSyncing(true);
        try {
            const user = await AuthService.login(userVal, passVal);
            if (user) {
                setCurrentUser(user);
                addToast(`Benvenuto, ${user.username}`);
                return true;
            } else {
                addToast("Credenziali non valide", "error");
                return false;
            }
        } catch (e) {
            addToast("Errore di connessione", "error");
            return false;
        } finally {
            setIsSyncing(false);
        }
    };

    const fetchUsersList = async () => {
        setIsSyncing(true);
        try {
            const users = await AuthService.getUsers();
            setUsersList(users);
        } catch (e) {
            addToast("Errore caricamento utenti", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchUsersList();
        }
    }, [currentUser]);

    return { currentUser, setCurrentUser, usersList, isSyncing, login, fetchUsersList };
};
