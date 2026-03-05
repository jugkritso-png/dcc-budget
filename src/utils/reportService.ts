import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SystemSettings } from '../types';

interface ReportData {
    orgName: string;
    fiscalYear: number;
    stats: {
        totalBudget: number;
        totalUsed: number;
        totalRemaining: number;
        utilizationRate: number;
    };
    monthlyData: {
        name: string;
        planned: number;
        actual: number;
    }[];
    categoryData: {
        name: string;
        amount: number;
        totalAllocated: number;
    }[];
}

export const generateBudgetReport = (data: ReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;

    // --- Header ---
    doc.setFontSize(20);
    doc.text('Budget Performance Report', margin, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Organization: ${data.orgName}`, margin, 28);
    doc.text(`Fiscal Year: ${data.fiscalYear}`, margin, 33);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 38);

    // --- KPI Summary ---
    let yPos = 50;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('1. Executive Summary', margin, yPos);

    yPos += 10;
    const kpiData = [
        ['Total Budget', 'Total Used', 'Remaining', 'Utilization'],
        [
            `THB ${data.stats.totalBudget.toLocaleString()}`,
            `THB ${data.stats.totalUsed.toLocaleString()}`,
            `THB ${data.stats.totalRemaining.toLocaleString()}`,
            `${data.stats.utilizationRate.toFixed(1)}%`
        ]
    ];

    autoTable(doc, {
        startY: yPos,
        head: [kpiData[0]],
        body: [kpiData[1]],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // --- Monthly Breakdown ---
    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 20;
    doc.text('2. Monthly Spending Analysis', margin, yPos);

    yPos += 6;
    const monthlyRows = data.monthlyData.map(m => [
        m.name, // Note: Thai months might show as ??? without font. We might need to map to EN or use numbers.
        m.planned.toLocaleString(),
        m.actual.toLocaleString(),
        (m.planned - m.actual).toLocaleString()
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Month', 'Planned (THB)', 'Actual (THB)', 'Variance']],
        body: monthlyRows,
        theme: 'striped',
        headStyles: { fillColor: [52, 73, 94] }
    });

    // --- Top Categories ---
    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 20;

    // Check if new page needed
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }

    doc.text('3. Top Spending Categories', margin, yPos);

    yPos += 6;
    const categoryRows = data.categoryData.map(c => [
        c.name,
        c.totalAllocated.toLocaleString(),
        c.amount.toLocaleString(),
        `${((c.amount / c.totalAllocated) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Allocated', 'Used', '% Used']],
        body: categoryRows,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] }
    });

    // --- Footer ---
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10);
    }

    doc.save(`Budget_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
