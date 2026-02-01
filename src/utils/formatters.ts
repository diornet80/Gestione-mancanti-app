export const excelSerialToDateString = (serial: any): string | null => {
    if (!serial) return null;
    const num = Number(serial);
    if (isNaN(num)) return String(serial);
    const date = new Date((num - 25569) * 86400 * 1000);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getVal = (row: any, ...keys: string[]) => {
    for (const key of keys) {
        const normalizedKey = key.toLowerCase().trim();
        const actualKey = Object.keys(row).find(k => {
            const rowKey = k.toLowerCase().trim();
            return rowKey === normalizedKey || rowKey.includes(normalizedKey);
        });
        if (actualKey !== undefined && row[actualKey] !== undefined) return row[actualKey];
    }
    return '';
};

export const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
