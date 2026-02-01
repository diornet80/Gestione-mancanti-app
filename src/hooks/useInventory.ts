
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import { InventoryItem, Department, Urgency } from '../types';
import { generateUUID } from '../utils/formatters';

export const useInventory = (addToast: (msg: string, type?: any) => void) => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // States for filters inside the hook if needed, or derived outside.
    // We'll keep filters outside to allow UI control, but we can provide helper methods.

    const fetchCloudData = async () => {
        setIsSyncing(true);
        try {
            const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });
            if (data) setInventory(data);
            if (error) console.error("Fetch error:", error);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchCloudData();
    }, []);

    const saveToCloud = async (data: any, selectedDept: Department | null, currentUser: string) => {
        const msnUpper = String(data.msn || '').toUpperCase().trim();
        const pnlUpper = String(data.pnl || '').toUpperCase().trim();
        const pnUpper = String(data.partNumber || '').toUpperCase().trim();

        if (!msnUpper || !pnlUpper || !pnUpper) {
            addToast("I campi MSN, PNL e Part Number sono obbligatori!", "warning");
            return false;
        }

        const isDuplicate = inventory.some(i =>
            i.id !== (data.id || '') &&
            String(i.msn).toUpperCase().trim() === msnUpper &&
            String(i.pnl || '').toUpperCase().trim() === pnlUpper &&
            String(i.part_number).toUpperCase().trim() === pnUpper &&
            i.department === selectedDept
        );

        if (isDuplicate) {
            addToast("Record già esistente in questo reparto!", "error");
            return false;
        }

        setIsSyncing(true);
        const dbPayload: any = {
            id: (data.id && data.id !== '') ? data.id : generateUUID(),
            msn: msnUpper,
            pnl: pnlUpper,
            part_number: pnUpper,
            quantita: parseInt(String(data.quantita)) || 1,
            urgency: data.urgency,
            department: selectedDept,
            created_by: currentUser,
            data_masticiatura: data.dataMasticiatura || null,
            note: data.note || '',
            tipo: data.tipo || '',
            updated_at: new Date().toISOString()
        };

        try {
            const { error } = await supabase.from('inventory').upsert(dbPayload);
            if (!error) {
                await fetchCloudData();
                addToast("Salvataggio completato!");
                return true;
            } else {
                addToast(`Errore: ${error.message}`, "error");
                return false;
            }
        } catch (err) {
            addToast("Errore di rete", "error");
            return false;
        } finally {
            setIsSyncing(false);
        }
    };

    const deleteItem = async (id: string) => {
        setIsSyncing(true);
        try {
            const { error } = await supabase.from('inventory').delete().eq('id', id);
            if (!error) {
                await fetchCloudData();
                addToast("Evasione completata");
            } else addToast(error.message, "error");
        } catch (e) {
            addToast("Errore", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    const globalDelete = async (msn: string, pnl: string, part_number: string) => {
        setIsSyncing(true);
        try {
            const { error } = await supabase
                .from('inventory')
                .delete()
                .eq('msn', msn)
                .eq('pnl', pnl)
                .eq('part_number', part_number);

            if (!error) {
                addToast("Pezzo rimosso da tutta la produzione");
                await fetchCloudData();
            } else addToast(error.message, "error");
        } catch (e) {
            addToast("Errore di rete", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    const stats = useMemo(() => {
        const totalQty = inventory.reduce((sum, i) => sum + (Number(i.quantita) || 0), 0);
        const sumByDept = Object.values(Department).reduce((acc, dept) => {
            acc[dept] = inventory
                .filter(i => i.department === dept)
                .reduce((sum, i) => sum + (Number(i.quantita) || 0), 0);
            return acc;
        }, {} as Record<string, number>);

        return { totalQty, sumByDept };
    }, [inventory]);

    const interRepartoDuplicatesConsolidated = useMemo(() => {
        const groups: Record<string, { items: any[], departments: Set<string> }> = {};
        inventory.forEach(item => {
            const msn = String(item.msn).trim().toUpperCase();
            const pnl = String(item.pnl || '').trim().toUpperCase();
            const pn = String(item.part_number).trim().toUpperCase();
            const key = `${msn}_${pnl}_${pn}`;

            if (!groups[key]) {
                groups[key] = { items: [], departments: new Set() };
            }
            groups[key].items.push(item);
            groups[key].departments.add(item.department);
        });

        return Object.values(groups)
            .filter(group => group.departments.size > 1)
            .map(group => {
                const first = group.items[0];
                return {
                    ...first,
                    departments: Array.from(group.departments),
                    total_qty: group.items.reduce((sum, i) => sum + (Number(i.quantita) || 0), 0)
                };
            });
    }, [inventory]);

    const analyticsData = useMemo(() => {
        // Group by department for pie chart
        const deptTotals = Object.values(Department).map(d => ({
            label: d,
            value: inventory.filter(i => i.department === d).reduce((s, i) => s + (Number(i.quantita) || 0), 0)
        }));

        // Group by urgency for bar chart
        const urgencyTotals = Object.values(Urgency).map(u => ({
            label: u,
            value: inventory.filter(i => i.urgency === u).reduce((s, i) => s + (Number(i.quantita) || 0), 0)
        }));

        // Pareto data for Part Numbers
        const pnCounts: Record<string, number> = {};
        inventory.forEach(i => {
            const pn = String(i.part_number).trim().toUpperCase();
            pnCounts[pn] = (pnCounts[pn] || 0) + (Number(i.quantita) || 1);
        });

        const paretoRaw = Object.entries(pnCounts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Show top 10

        const totalPnQty = Object.values(pnCounts).reduce((a, b) => a + b, 0);
        let cumulativeSum = 0;
        const paretoData = paretoRaw.map(item => {
            cumulativeSum += item.value;
            return {
                ...item,
                cumulativePercent: (cumulativeSum / totalPnQty) * 100
            };
        });

        // Trend by creation date (last 7 days) per department
        const trend: { date: string, total: number, [key: string]: any }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const dayData: any = { date: dateStr, total: 0 };
            Object.values(Department).forEach(dept => {
                const count = inventory.filter(item => {
                    if (!item.created_at || item.department !== dept) return false;
                    return item.created_at.split('T')[0] === dateStr;
                }).length;
                dayData[dept] = count;
                dayData.total += count;
            });
            trend.push(dayData);
        }

        return { deptTotals, urgencyTotals, trend, paretoData };
    }, [inventory]);

    return {
        inventory,
        isSyncing,
        fetchCloudData,
        saveToCloud,
        deleteItem,
        globalDelete,
        stats,
        interRepartoDuplicatesConsolidated,
        analyticsData,
        setInventory,
        setIsSyncing
    };
};
