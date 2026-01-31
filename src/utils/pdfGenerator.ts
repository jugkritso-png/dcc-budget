import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BudgetRequest, Category } from '../types';

// Fetch the font file and return it as a Base64 string
const loadFont = async (url: string): Promise<string> => {
    try {
        console.log(`Attempting to load font from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = (reader.result as string).split(',')[1];
                console.log(`Successfully loaded font from ${url}`);
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`Failed to load font from ${url}:`, error);
        return "";
    }
};

export const generateBudgetPDF = async (requests: BudgetRequest[], categories: Category[]) => {
    const doc = new jsPDF();

    // Load and add fonts
    const fontRegular = await loadFont('https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Regular.ttf');
    const fontBold = await loadFont('https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Bold.ttf');

    if (fontRegular) {
        doc.addFileToVFS('Sarabun-Regular.ttf', fontRegular);
        doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal');
    }

    if (fontBold) {
        doc.addFileToVFS('Sarabun-Bold.ttf', fontBold);
        doc.addFont('Sarabun-Bold.ttf', 'Sarabun', 'bold');
    }

    doc.setFont('Sarabun', 'normal');

    // Header
    doc.setFontSize(18);
    doc.setFont('Sarabun', 'bold');
    doc.text('รายงานสรุปงบประมาณ (Budget Report)', 14, 20);

    doc.setFontSize(12);
    doc.setFont('Sarabun', 'normal');
    doc.text(`วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}`, 14, 30);

    // Categories Table
    doc.setFont('Sarabun', 'bold');
    doc.text('สรุปหมวดงบประมาณ', 14, 40);

    const categoryRows = categories.map(cat => [
        cat.name,
        cat.code,
        cat.allocated.toLocaleString(),
        cat.used.toLocaleString(),
        (cat.allocated - cat.used).toLocaleString()
    ]);

    autoTable(doc, {
        startY: 45,
        head: [['หมวดหมู่', 'รหัส', 'จัดสรร', 'ใช้ไป', 'คงเหลือ']],
        body: categoryRows,
        styles: { font: 'Sarabun', fontSize: 10 },
        headStyles: { font: 'Sarabun', fontStyle: 'bold', fillColor: [59, 130, 246] },
    });

    // Recent Requests Table
    const finalY = (doc as any).lastAutoTable?.finalY || 45;
    doc.setFont('Sarabun', 'bold');
    doc.text('รายการขอเบิกงบประมาณล่าสุด', 14, finalY + 10);

    const requestRows = requests.slice(0, 20).map(req => [
        new Date(req.date).toLocaleDateString('th-TH'),
        req.project,
        req.category,
        req.amount.toLocaleString(),
        req.status === 'approved' ? 'อนุมัติ' : req.status === 'pending' ? 'รออนุมัติ' : 'ปฏิเสธ',
        req.requester
    ]);

    autoTable(doc, {
        startY: finalY + 15,
        head: [['วันที่', 'โครงการ', 'หมวดหมู่', 'จำนวน', 'สถานะ', 'ผู้ขอ']],
        body: requestRows,
        styles: { font: 'Sarabun', fontSize: 10 },
        headStyles: { font: 'Sarabun', fontStyle: 'bold', fillColor: [59, 130, 246] },
    });

    doc.save(`budget-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
