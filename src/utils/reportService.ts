import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SystemSettings, BudgetRequest, ApprovalLog } from '../types';

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
        costCenter?: string;
        fund?: string;
        functionalArea?: string;
        commitmentItem?: string;
    }[];
    requests?: (BudgetRequest & { categoryData?: any })[];
    approvalLogs?: ApprovalLog[];
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

    // --- Detailed Transactions & Approval History ---
    if (data.requests && data.requests.length > 0) {
        doc.addPage();
        yPos = 20;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('4. Detailed Budget Transactions', margin, yPos);

        const requestRows = data.requests.map(req => {
            const logs = data.approvalLogs?.filter(l => l.requestId === req.id) || [];
            const history = logs.map(l =>
                `${l.stage}: ${l.action === 'approve' ? 'Approved' : 'Rejected'} by ${l.user?.name || 'User'}`
            ).join('\n');

            return [
                req.project,
                req.category,
                `THB ${req.amount.toLocaleString()}`,
                req.status,
                history || 'No history'
            ];
        });

        autoTable(doc, {
            startY: yPos + 6,
            head: [['Project/Activity', 'Category', 'Amount', 'Status', 'Approval history']],
            body: requestRows,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            styles: { fontSize: 8, cellPadding: 3, cellWidth: 'wrap' },
            columnStyles: {
                4: { cellWidth: 60 } // History column width
            }
        });

        // --- SAP Mapping Table ---
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 20;
        if (yPos > 240) { doc.addPage(); yPos = 20; }

        doc.setFontSize(14);
        doc.text('5. SAP Account Assignment Mapping', margin, yPos);

        const sapRows = data.categoryData.map(c => [
            c.name,
            '1000', // Business Place (Wul)
            c.costCenter || '-',
            c.fund || '-',
            c.functionalArea || '-',
            c.commitmentItem || '-'
        ]);

        autoTable(doc, {
            startY: yPos + 6,
            head: [['Category', 'BP', 'Cost Center', 'Fund', 'Func. Area', 'Commit. Item']],
            body: sapRows,
            theme: 'striped',
            headStyles: { fillColor: [142, 68, 173] },
            styles: { fontSize: 8 }
        });
    }

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
