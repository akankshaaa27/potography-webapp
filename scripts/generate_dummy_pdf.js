
import { jsPDF } from "jspdf";
import fs from "fs";

// Create a new PDF document
const doc = new jsPDF();

// Set font settings
doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.setTextColor(44, 62, 80); // Dark Blue

// Title
doc.text("Web Application Hosting Proposal", 105, 20, { align: "center" });

// Line
doc.setLineWidth(0.5);
doc.setDrawColor(52, 152, 219);
doc.line(20, 25, 190, 25);

// Reset font for body
doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.setTextColor(0, 0, 0);

// Info
doc.text("Project: Photography Portfolio & Management System", 20, 40);
doc.text("Date: January 19, 2026", 20, 48);
doc.text("Prepared For: Client", 20, 56);

// Section 1: Budget
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(44, 62, 80);
doc.text("1. Budget Estimate (Annual)", 20, 75);

doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(0, 0, 0);
doc.text("Recommended Plan: Hostinger Business Web Hosting", 20, 85);

// Table Header
let y = 95;
doc.setFillColor(240, 240, 240);
doc.rect(20, y, 170, 10, "F");
doc.setFont("helvetica", "bold");
doc.text("Item", 25, y + 7);
doc.text("Est. Annual Cost", 100, y + 7);
doc.text("Client Price", 150, y + 7);

// Table Rows
y += 10;
doc.setFont("helvetica", "normal");

const rows = [
    ["Server Hosting", "INR 4,500 - 5,500", "INR 10,000"],
    ["Domain Name", "Free (1st Year)", "Included"],
    ["SSL Certificate", "Free", "Included"],
    ["MySQL Database", "Free", "Included"],
    ["Maintenance", "--", "INR 5,000"],
];

rows.forEach(row => {
    doc.text(row[0], 25, y + 7);
    doc.text(row[1], 100, y + 7);
    doc.text(row[2], 150, y + 7);
    y += 10;
});

// Total
y += 5;
doc.setFont("helvetica", "bold");
doc.setFillColor(234, 250, 241); // Light Green
doc.rect(20, y, 170, 10, "F");
doc.text("TOTAL", 25, y + 7);
doc.text("~ INR 5,000 / year", 100, y + 7);
doc.text("INR 10k - 15k / year", 150, y + 7);


// Section 2: Roadmap
y += 25;
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(44, 62, 80);
doc.text("2. Deployment Roadmap", 20, y);

y += 10;
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.setTextColor(0, 0, 0);
doc.text("Phase 1: Infrastructure (Day 1)", 20, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.text("- Domain & SSL Configuration", 20, y + 6);
doc.text("- Setup MySQL Database & Import Logic", 20, y + 12);

y += 25;
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Phase 2: Backend (Day 1-2)", 20, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.text("- Upload Node.js API to Hostinger", 20, y + 6);
doc.text("- Configure 'uploads' folder for images", 20, y + 12);

y += 25;
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Phase 3: Frontend (Day 2)", 20, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.text("- Build & Deploy React Website", 20, y + 6);
doc.text("- Build & Deploy Admin Panel", 20, y + 12);

// Save file
const pdfOutput = doc.output();
fs.writeFileSync("PROJECT_PROPOSAL.pdf", pdfOutput);

console.log("PDF generated successfully: PROJECT_PROPOSAL.pdf");
