import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Department, Urgency } from '../types';

export const mapDataForExport = (data: any[], isDuplicateReport: boolean = false) => {
    if (isDuplicateReport) {
        return data.map(i => ({
            'MSN': i.msn,
            'PNL': i.pnl,
            'PART NUMBER': i.part_number,
            'Q.TA TOTALE': i.total_qty,
            'REPARTI COINVOLTI': i.departments ? i.departments.join(', ') : ''
        }));
    }
    return data.map(i => ({
        'MSN': i.msn,
        'PNL': i.pnl,
        'PART NUMBER': i.part_number,
        'QUANTITA': i.quantita,
        'CRITICITA': i.urgency,
        'REPARTO': i.department,
        'UTENTE': i.created_by,
        'DATA MASTICIATURA': i.data_masticiatura || '-',
        'TIPO': i.tipo || '-',
        'NOTE': i.note || '-'
    }));
};

export const exportToExcel = (data: any[], filename: string, isDuplicateReport: boolean = false, addToast: (msg: string, type?: any) => void) => {
    const cleanData = mapDataForExport(data, isDuplicateReport);
    const totalQty = data.reduce((sum, item) => sum + (parseInt(item.quantita || item.total_qty) || 0), 0);

    const summaryRow = isDuplicateReport ? {
        'MSN': 'TOTALE QTA', 'PNL': '', 'PART NUMBER': '', 'Q.TA TOTALE': totalQty, 'REPARTI COINVOLTI': ''
    } : {
        'MSN': 'TOTALE QTA', 'PNL': '', 'PART NUMBER': '', 'QUANTITA': totalQty, 'CRITICITA': '', 'REPARTO': '', 'UTENTE': '', 'DATA MASTICIATURA': '', 'TIPO': '', 'NOTE': ''
    };

    const worksheet = XLSX.utils.json_to_sheet([...cleanData, summaryRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    addToast("Excel generato!");
};

export const exportToPDF = (data: any[], title: string, isDuplicateReport: boolean = false, addToast: (msg: string, type?: any) => void) => {
    try {
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFontSize(18);
        doc.text(title, 14, 15);

        let headers: string[][];
        let body: any[][];
        const totalQty = data.reduce((sum, item) => sum + (parseInt(item.quantita || item.total_qty) || 0), 0);

        if (isDuplicateReport) {
            headers = [['MSN', 'PNL', 'Part Number', 'Q.ta Totale', 'Reparti']];
            body = data.map(i => [i.msn, i.pnl, i.part_number, i.total_qty, i.departments?.join(', ') || '']);
            body.push([{ content: 'TOTALE QUANTITÀ', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, totalQty, '']);
        } else {
            headers = [['MSN', 'PNL', 'Part Number', 'Q.ta', 'Criticità', 'Reparto', 'Utente', 'Data Mast.', 'Tipo']];
            body = data.map(i => [i.msn, i.pnl, i.part_number, i.quantita, i.urgency, i.department, i.created_by, i.data_masticiatura || '-', i.tipo || '-']);
            body.push([{ content: 'TOTALE QUANTITÀ', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, totalQty, '', '', '', '', '']);
        }

        autoTable(doc, {
            head: headers,
            body: body,
            startY: 25,
            styles: { fontSize: 8, font: 'helvetica' },
            headStyles: { fillColor: [225, 29, 72] }, // Adobe Red themed
            alternateRowStyles: { fillColor: [255, 241, 242] },
            didParseCell: (dataCell) => {
                if (dataCell.row.index === body.length - 1) {
                    dataCell.cell.styles.fillColor = [254, 205, 211];
                    dataCell.cell.styles.fontStyle = 'bold';
                }
            }
        });

        doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
        addToast("PDF generato!");
    } catch (err) {
        addToast("Errore export PDF", "error");
    }
};

export const exportAnalytics = (analyticsData: any, format: 'json' | 'excel' | 'pdf', addToast: (msg: string, type?: any) => void) => {
    const timestamp = new Date().toISOString().split('T')[0];
    if (format === 'json') {
        const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_mancanti_${timestamp}.json`;
        a.click();
        addToast("Report JSON scaricato!");
    } else if (format === 'excel') {
        const wb = XLSX.utils.book_new();
        const wsDept = XLSX.utils.json_to_sheet(analyticsData.deptTotals);
        XLSX.utils.book_append_sheet(wb, wsDept, "Per_Reparto");
        const wsUrgency = XLSX.utils.json_to_sheet(analyticsData.urgencyTotals);
        XLSX.utils.book_append_sheet(wb, wsUrgency, "Per_Urgenza");
        const wsTrend = XLSX.utils.json_to_sheet(analyticsData.trend);
        XLSX.utils.book_append_sheet(wb, wsTrend, "Trend_Settimanale");
        const wsPareto = XLSX.utils.json_to_sheet(analyticsData.paretoData);
        XLSX.utils.book_append_sheet(wb, wsPareto, "Analisi_Pareto_PN");
        XLSX.writeFile(wb, `analytics_mancanti_${timestamp}.xlsx`);
        addToast("Report Excel scaricato!");
    } else if (format === 'pdf') {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(225, 29, 72);
            doc.text("REPORT ANALITICO MANCANTI", 14, 20);
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Data di generazione: ${new Date().toLocaleString()}`, 14, 28);
            doc.setDrawColor(226, 232, 240);
            doc.line(14, 32, 196, 32);

            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.text("Distribuzione per Reparto", 14, 42);
            autoTable(doc, {
                startY: 47,
                head: [['Reparto', 'Quantità Mancante']],
                body: analyticsData.deptTotals.map((d: any) => [d.label, d.value]),
                headStyles: { fillColor: [37, 99, 235] },
                styles: { fontSize: 9 }
            });

            let currentY = (doc as any).lastAutoTable.finalY + 15;
            doc.text("Analisi per Criticità", 14, currentY);
            autoTable(doc, {
                startY: currentY + 5,
                head: [['Criticità', 'Conteggio']],
                body: analyticsData.urgencyTotals.map((u: any) => [u.label, u.value]),
                headStyles: { fillColor: [244, 63, 94] },
                styles: { fontSize: 9 }
            });

            currentY = (doc as any).lastAutoTable.finalY + 15;
            if (currentY > 220) { doc.addPage(); currentY = 20; }
            doc.text("Analisi Pareto Part Numbers (Top 10)", 14, currentY);
            autoTable(doc, {
                startY: currentY + 5,
                head: [['Pos.', 'Part Number', 'Q.tà', '% Cumulata']],
                body: analyticsData.paretoData.map((p: any, idx: number) => [idx + 1, p.label, p.value, p.cumulativePercent.toFixed(1) + '%']),
                headStyles: { fillColor: [30, 41, 59] },
                styles: { fontSize: 9 }
            });

            currentY = (doc as any).lastAutoTable.finalY + 15;
            if (currentY > 220) { doc.addPage(); currentY = 20; }
            doc.text("Trend Ultimi 7 Giorni", 14, currentY);
            autoTable(doc, {
                startY: currentY + 5,
                head: [['Data', ...Object.values(Department)]],
                body: analyticsData.trend.map((t: any) => [t.date, t[Department.AUTOMATIZZATO], t[Department.PANNELLI], t[Department.FINALE]]),
                headStyles: { fillColor: [16, 185, 129] },
                styles: { fontSize: 9 }
            });

            doc.save(`analytics_mancanti_${timestamp}.pdf`);
            addToast("Report PDF scaricato!");
        } catch (err) {
            addToast("Errore generazione PDF", "error");
        }
    }
}
