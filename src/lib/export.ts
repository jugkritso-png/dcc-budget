import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BudgetRequest } from "@/types";

/**
 * Generate a PDF for a single BudgetRequest.
 */
export const generateBudgetPDF = (request: BudgetRequest) => {
  const doc = new jsPDF();
  
  // Basic configurations
  const startY = 20;

  // Title
  doc.setFontSize(20);
  doc.text("DCC Budget - Request Report", 14, startY);
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  const now = format(new Date(), "dd MMM yyyy HH:mm", { locale: th });
  doc.text(`Generated on: ${now}`, 14, startY + 8);

  // General Details
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`Project Name: ${request.project}`, 14, startY + 20);
  doc.text(`Tracking ID: ${request.id}`, 14, startY + 28);
  doc.text(`Requested By: ${request.requesterId}`, 14, startY + 36);
  doc.text(
    `Status: ${request.status.toUpperCase()} (${request.currentStep})`,
    14,
    startY + 44
  );
  doc.text(`Description: ${request.reason || "-"}`, 14, startY + 52);

  const amountStr = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(request.amount);
  
  doc.text(`Total Budget: ${amountStr}`, 14, startY + 60);

  let currentY = startY + 70;

  // Expenses Table
  if (request.expenseItems && request.expenseItems.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [["Description", "Quantity", "Unit Price", "Total"]],
      body: request.expenseItems.map((item: any) => [
        item.description,
        item.quantity?.toString() || "1",
        new Intl.NumberFormat("th-TH").format(item.amount || item.unitPrice || 0),
        new Intl.NumberFormat("th-TH").format((item.quantity || 1) * (item.amount || item.unitPrice || 0)),
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });
  }

  // Save the PDF
  doc.save(`Budget_Request_${request.id}.pdf`);
};

/**
 * Generate an Excel file for a list of BudgetRequests.
 */
export const generateBudgetExcel = (requests: BudgetRequest[]) => {
  // Map our internal format to what we want users to see in Excel
  const excelData = requests.map((req) => ({
    "Tracking ID": req.id,
    "Project Title": req.project,
    "Description": req.reason || "",
    "Amount (THB)": req.amount,
    "Status": req.status.toUpperCase(),
    "Current Step": req.currentStep,
    "Requester": req.requesterId,
    "Created Date": format(new Date(req.date), "dd/MM/yyyy HH:mm"),
    "Updated Date": format(new Date(), "dd/MM/yyyy HH:mm"),
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Budget Requests");

  // Generate an excel file
  XLSX.writeFile(
    workbook,
    `Budget_Export_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`
  );
};
