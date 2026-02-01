import { useState, useCallback } from 'react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning';
}

export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
        const id = Math.random().toString(36);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    return { toasts, addToast };
};
