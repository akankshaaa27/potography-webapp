
import { jsPDF } from "jspdf";
import fs from "fs";

// Create a new PDF document
const doc = new jsPDF();

// --- HELPER FUNCTION FOR TEXT WRAPPING ---
function addWrappedText(text, x, y, maxWidth, lineHeight) {
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return y + (splitText.length * lineHeight);
}

// --- HEADER ---
doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.setTextColor(44, 62, 80);
doc.text("WEB DEVELOPMENT QUOTATION", 105, 20, { align: "center" });

doc.setFontSize(10);
doc.setTextColor(100, 100, 100);
doc.text("Date: January 19, 2026", 105, 26, { align: "center" });

doc.setLineWidth(0.5);
doc.setDrawColor(52, 152, 219);
doc.line(20, 30, 190, 30);

// ==========================================
// OPTION 1: STATIC WEBSITE
// ==========================================
let y = 45;
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(52, 152, 219); // Blue
doc.text("OPTION 1: Static Portfolio Website", 20, y);

y += 8;
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(0, 0, 0);
doc.text("Best for showcasing work without needing frequent updates.", 20, y);

y += 8;
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Features Included:", 20, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
y += 6;

const staticFeatures = [
    "•  Home Page with automated Image Slider",
    "•  Portfolio Gallery (Pre-selected best images)",
    "•  'About Us' & 'Contact' Pages with Map Integration",
    "•  WhatsApp Chat Button for direct leads",
    "•  Mobile Responsive Layout (Works on Phone/Tablet/PC)",
    "•  SEO Basic Setup (Google Listing optimization)"
];

staticFeatures.forEach(f => {
    doc.text(f, 25, y);
    y += 5;
});

// Hosting for Static
y += 4;
doc.setFont("helvetica", "bold");
doc.text("Hosting Requirements (Static):", 20, y);
y += 5;
doc.setFont("helvetica", "normal");
doc.text("•  Requires Basic Shared Hosting (Cheapest option).", 25, y);
y += 5;
doc.text("•  No Database required.", 25, y);

y += 8;
doc.setFillColor(235, 245, 251); // Light Blue
doc.rect(20, y, 170, 10, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(44, 62, 80);
doc.text("Estimated Cost: INR 18,000 - 25,000", 25, y + 6.5);
doc.text("|   Timeline: 1 Week", 110, y + 6.5);

// ==========================================
// OPTION 2: DYNAMIC BUSINESS SYSTEM
// ==========================================
y += 20;
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(230, 126, 34); // Orange
doc.text("OPTION 2: Dynamic Business System (Recommended)", 20, y);

y += 8;
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(0, 0, 0);
doc.text("A complete software solution to manage your entire photography business.", 20, y);

y += 8;
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Advanced Features (Admin Panel + Website):", 20, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
y += 6;

const dynamicFeatures = [
    "•  ADMIN DASHBOARD: Secure login to manage everything.",
    "•  GALLERY MANAGER: Upload/Delete unlimited photos instantly.",
    "•  CLIENT CRM: Save client details, track status (Lead/Booked).",
    "•  ENQUIRY MANAGEMENT: See website enquiries directly in admin.",
    "•  TESTIMONIALS: Add client reviews and ratings dynamically.",
    "•  FILMS MODULE: Manage YouTube video links effortlessly.",
    "•  FINANCE MODULE: Generate professional PDF Invoices & Quotations.",
    "•  DATABASE: Secure MySQL storage for all records.",
    "•  API INTEGRATION: Fast, modern Node.js backend."
];

dynamicFeatures.forEach(f => {
    doc.text(f, 25, y);
    y += 5;
});

// Hosting for Dynamic
y += 4;
doc.setFont("helvetica", "bold");
doc.text("Hosting Requirements (Dynamic):", 20, y);
y += 6;
doc.setFont("helvetica", "normal");
const hostingText = [
    "•  Requires 'Business Hosting' (Node.js Support) e.g., Hostinger.",
    "•  Includes MySQL Database (Free with plan).",
    "•  Daily Backups recommended for client data safety."
];
hostingText.forEach(f => {
    doc.text(f, 25, y);
    y += 5;
});

y += 5;
doc.setFillColor(253, 235, 208); // Light Orange
doc.rect(20, y, 170, 10, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(44, 62, 80);
doc.text("Estimated Cost: INR 45,000 - 65,000", 25, y + 6.5);
doc.text("|   Timeline: 3-4 Weeks", 110, y + 6.5);


// ==========================================
// HOSTING COST BREAKDOWN
// ==========================================
y += 20;
// Check if we need a new page
if (y > 250) {
    doc.addPage();
    y = 20;
}

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.setTextColor(44, 62, 80);
doc.text("Hosting & Server Cost Breakdown (Third Party)", 20, y);

y += 10;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);

// Hosting Table
const hostingRows = [
    ["1. Hostinger Business Plan", "For Node.js + MySQL sites (Best Speed)", "~ 5,000 / year"],
    ["2. Domain Name (.com)", "Your brand identity", "~ 900 / year"],
    ["3. SSL Certificate", "Security Lock", "Free (Included)"],
];

doc.setFillColor(240, 240, 240);
doc.rect(20, y, 170, 8, "F");
doc.setFont("helvetica", "bold");
doc.text("Service", 25, y + 5);
doc.text("Description", 85, y + 5);
doc.text("Approx Cost (INR)", 150, y + 5);

y += 8;
doc.setFont("helvetica", "normal");
hostingRows.forEach(row => {
    doc.text(row[0], 25, y + 6);
    doc.text(row[1], 85, y + 6);
    doc.text(row[2], 150, y + 6);
    y += 10;
});

// Save file
const pdfOutput = doc.output();
fs.writeFileSync("DETAILED_PHOTOGRAPHY_QUOTATION.pdf", pdfOutput);

console.log("PDF generated successfully: DETAILED_PHOTOGRAPHY_QUOTATION.pdf");
