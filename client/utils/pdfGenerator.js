import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (elementId, filename) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    // Generate Blob URL and open in new tab
    const blobUrl = pdf.output("bloburl");
    window.open(blobUrl, "_blank");
    // pdf.save(filename); // Disabled auto-download
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF");
  }
};

export const generateQuotationPDF = (quotation, client, settings = {}) => {
  const businessName = settings.businessName || "The Patil Photography";
  const primaryLogo = settings.primaryLogo || ""; // URL or Base64
  const contactText = "Crafting beautiful moments, flawlessly documented";
  const address = settings.address || "";
  const primaryPhone = settings.primaryMobileNumber || "";
  const secondaryPhone = settings.secondaryMobileNumber || "";
  const contactEmail = settings.contactEmail || "";
  const socialLinks = settings.socialLinks || [];

  const logoHtml = primaryLogo
    ? `<img src="${primaryLogo}" style="height: 50px; object-fit: contain;" />`
    : `<div style="width: 50px; height: 50px; background: linear-gradient(135deg, #d4a574, #c49561); border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-weight: bold; font-size: 20px;">P</span></div>`;

  // Social media icons HTML
  const socialIconsHtml = socialLinks
    .filter(l => l.active)
    .map(link => {
      const platformIcons = {
        'WhatsApp': '📱',
        'Instagram': '📷',
        'Facebook': 'f',
        'YouTube': '▶',
        'Twitter': '𝕏',
        'LinkedIn': 'in',
        'Other': '🔗'
      };
      return `<a href="${link.url}" target="_blank" style="margin: 0 5px; text-decoration: none; color: #d4a574; font-weight: bold;">${platformIcons[link.platform] || link.platform}</a>`;
    })
    .join('');

  // Contact info HTML
  const contactInfoHtml = `
    <div style="font-size: 10px; color: #666; line-height: 1.8;">
      ${primaryPhone ? `<p style="margin: 0;">📞 ${primaryPhone}${secondaryPhone ? ` | ${secondaryPhone}` : ''}</p>` : ''}
      ${contactEmail ? `<p style="margin: 0;">✉️ ${contactEmail}</p>` : ''}
      ${address ? `<p style="margin: 0;">📍 ${address}</p>` : ''}
      ${socialIconsHtml ? `<p style="margin: 0 0 5px 0;">Social: ${socialIconsHtml}</p>` : ''}
    </div>
  `;

  const content = `
    <div style="font-family: 'Playfair Display', serif; padding: 40px; background: white; color: #1a1a1a;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #d4a574; padding-bottom: 20px;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px;">
          ${logoHtml}
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1a1a1a;">${businessName}</h1>
          </div>
        </div>
        <h2 style="font-size: 24px; font-weight: bold; margin: 20px 0 0 0; color: #1a1a1a;">QUOTATION</h2>
      </div>

      <!-- Quote Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #d4a574; font-size: 12px; font-weight: bold; margin-bottom: 10px;">QUOTATION TO</h3>
          <p style="margin: 0; font-size: 16px; font-weight: bold;">${client?.name || quotation.clientName || "Client"}</p>
          <p style="margin: 5px 0; font-size: 12px;">${client?.email || quotation.email || ""}</p>
          <p style="margin: 5px 0; font-size: 12px;">${client?.phone || quotation.whatsapp_no || ""}</p>
          <p style="margin: 5px 0; font-size: 12px;">${client?.address || quotation.location || ""}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 5px 0; font-size: 12px;"><strong>Quotation No:</strong> ${quotation.quotationNumber}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Date:</strong> ${new Date(quotation.quotationDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Event Date:</strong> ${new Date(quotation.eventDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Valid Till:</strong> ${new Date(quotation.validityDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Event Type:</strong> ${quotation.eventType}</p>
        </div>
      </div>

      <!-- Services Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #2d2d2d; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #d4a574;">Service</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #d4a574;">Qty</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #d4a574;">Days</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #d4a574;">Rate</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #d4a574;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${quotation.services
      .map(
        (service) => `
            <tr style="border: 1px solid #e5e5e5;">
              <td style="padding: 12px; border: 1px solid #e5e5e5;">${service.serviceName}</td>
              <td style="padding: 12px; text-align: center; border: 1px solid #e5e5e5;">${service.quantity}</td>
              <td style="padding: 12px; text-align: center; border: 1px solid #e5e5e5;">${service.days}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5;">₹${service.ratePerDay.toLocaleString()}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5;"><strong>₹${service.total.toLocaleString()}</strong></td>
            </tr>
          `,
      )
      .join("")}
        </tbody>
      </table>

      <!-- Summary -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #d4a574; font-weight: bold; margin-bottom: 10px; font-size: 12px;">PAYMENT TERMS</h3>
          <p style="margin: 0; font-size: 12px; line-height: 1.6;">${quotation.paymentTerms}</p>
          ${quotation.notes ? `<h3 style="color: #d4a574; font-weight: bold; margin-top: 15px; margin-bottom: 10px; font-size: 12px;">NOTES</h3><p style="margin: 0; font-size: 12px; line-height: 1.6;">${quotation.notes}</p>` : ""}
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>₹${quotation.subtotal.toLocaleString()}</span>
          </div>
          ${quotation.discount > 0
      ? `
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
              <span>Discount ${quotation.discountType === "percentage" ? `(${quotation.discount}%)` : ""}:</span>
              <span>-₹${(quotation.discountType === "percentage" ? (quotation.subtotal * quotation.discount) / 100 : quotation.discount).toLocaleString()}</span>
            </div>
          `
      : ""
    }
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>Tax (${quotation.taxPercentage}%):</span>
            <span>₹${quotation.tax.toLocaleString()}</span>
          </div>
          <div style="border-top: 2px solid #d4a574; padding-top: 8px; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #d4a574;">
            <span>Grand Total:</span>
            <span>₹${quotation.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Thank You -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 12px; line-height: 1.6; font-style: italic;">${quotation.thankYouMessage}</p>
      </div>

      <!-- Footer with Contact Info and Social Links -->
      <div style="border-top: 2px solid #d4a574; padding-top: 20px;">
        <div style="text-align: center; margin-bottom: 15px;">
          ${contactInfoHtml}
        </div>
        <p style="margin: 10px 0 0 0; text-align: center; font-size: 10px; color: #666;">${businessName} | ${contactText}</p>
        <p style="margin: 5px 0 0 0; text-align: center; font-size: 10px; color: #666;">This quotation is valid till ${new Date(quotation.validityDate).toLocaleDateString()}</p>
      </div>
    </div>
  `;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  tempDiv.id = "pdf-content";
  // FIX: html2canvas requires visibility
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "794px"; // ~210mm @ 96dpi
  document.body.appendChild(tempDiv);

  setTimeout(async () => {
    try {
      await generatePDF("pdf-content", `Quotation-${quotation.quotationNumber}.pdf`);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }, 500);
};

export const generateInvoicePDF = (invoice, client, settings = {}) => {
  const businessName = settings.businessName || "The Patil Photography";
  const primaryLogo = settings.primaryLogo || "";
  const contactText = "Crafting beautiful moments, flawlessly documented";
  const address = settings.address || "";
  const primaryPhone = settings.primaryMobileNumber || "";
  const secondaryPhone = settings.secondaryMobileNumber || "";
  const contactEmail = settings.contactEmail || "";
  const socialLinks = settings.socialLinks || [];

  const logoHtml = primaryLogo
    ? `<img src="${primaryLogo}" style="height: 50px; object-fit: contain;" />`
    : `<div style="width: 50px; height: 50px; background: linear-gradient(135deg, #d4a574, #c49561); border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-weight: bold; font-size: 20px;">P</span></div>`;

  // Social media icons HTML
  const socialIconsHtml = socialLinks
    .filter(l => l.active)
    .map(link => {
      const platformIcons = {
        'WhatsApp': '📱',
        'Instagram': '📷',
        'Facebook': 'f',
        'YouTube': '▶',
        'Twitter': '𝕏',
        'LinkedIn': 'in',
        'Other': '🔗'
      };
      return `<a href="${link.url}" target="_blank" style="margin: 0 5px; text-decoration: none; color: #d4a574; font-weight: bold;">${platformIcons[link.platform] || link.platform}</a>`;
    })
    .join('');

  // Contact info HTML
  const contactInfoHtml = `
    <div style="font-size: 10px; color: #666; line-height: 1.8;">
      ${primaryPhone ? `<p style="margin: 0;">📞 ${primaryPhone}${secondaryPhone ? ` | ${secondaryPhone}` : ''}</p>` : ''}
      ${contactEmail ? `<p style="margin: 0;">✉️ ${contactEmail}</p>` : ''}
      ${address ? `<p style="margin: 0;">📍 ${address}</p>` : ''}
      ${socialIconsHtml ? `<p style="margin: 0 0 5px 0;">Social: ${socialIconsHtml}</p>` : ''}
    </div>
  `;

  const content = `
    <div style="font-family: 'Playfair Display', serif; padding: 40px; background: white; color: #1a1a1a;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #d4a574; padding-bottom: 20px;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px;">
          ${logoHtml}
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1a1a1a;">${businessName}</h1>
          </div>
        </div>
        <h2 style="font-size: 24px; font-weight: bold; margin: 20px 0 0 0; color: #1a1a1a;">INVOICE</h2>
      </div>

      <!-- Invoice Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #d4a574; font-size: 12px; font-weight: bold; margin-bottom: 10px;">BILL TO</h3>
          <p style="margin: 0; font-size: 16px; font-weight: bold;">${client.name}</p>
          <p style="margin: 5px 0; font-size: 12px;">${client.email}</p>
          <p style="margin: 5px 0; font-size: 12px;">${client.phone}</p>
          <p style="margin: 5px 0; font-size: 12px;">${client.address || ""}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 5px 0; font-size: 12px;"><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Event Date:</strong> ${new Date(invoice.eventDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: ${invoice.paymentStatus === "Paid" ? "green" : invoice.paymentStatus === "Partially Paid" ? "orange" : "red"}; font-weight: bold;">${invoice.paymentStatus}</span></p>
        </div>
      </div>

      <!-- Services Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #2d2d2d; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #d4a574;">Service</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #d4a574;">Qty</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #d4a574;">Days</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #d4a574;">Rate</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #d4a574;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.services
      .map(
        (service) => `
            <tr style="border: 1px solid #e5e5e5;">
              <td style="padding: 12px; border: 1px solid #e5e5e5;">${service.serviceName}</td>
              <td style="padding: 12px; text-align: center; border: 1px solid #e5e5e5;">${service.quantity}</td>
              <td style="padding: 12px; text-align: center; border: 1px solid #e5e5e5;">${service.days}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5;">₹${service.ratePerDay.toLocaleString()}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5;"><strong>₹${service.total.toLocaleString()}</strong></td>
            </tr>
          `,
      )
      .join("")}
        </tbody>
      </table>

      <!-- Summary -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          ${invoice.bankDetails?.accountName
      ? `
            <h3 style="color: #d4a574; font-weight: bold; margin-bottom: 10px; font-size: 12px;">PAYMENT DETAILS</h3>
            <p style="margin: 5px 0; font-size: 12px;"><strong>Account Name:</strong> ${invoice.bankDetails.accountName}</p>
            ${invoice.bankDetails.accountNumber ? `<p style="margin: 5px 0; font-size: 12px;"><strong>Account No:</strong> ${invoice.bankDetails.accountNumber}</p>` : ""}
            ${invoice.bankDetails.ifscCode ? `<p style="margin: 5px 0; font-size: 12px;"><strong>IFSC Code:</strong> ${invoice.bankDetails.ifscCode}</p>` : ""}
            ${invoice.bankDetails.upiId ? `<p style="margin: 5px 0; font-size: 12px;"><strong>UPI ID:</strong> ${invoice.bankDetails.upiId}</p>` : ""}
          `
      : ""
    }
          ${invoice.notes ? `<h3 style="color: #d4a574; font-weight: bold; margin-top: 15px; margin-bottom: 10px; font-size: 12px;">NOTES</h3><p style="margin: 0; font-size: 12px; line-height: 1.6;">${invoice.notes}</p>` : ""}
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>₹${invoice.subtotal.toLocaleString()}</span>
          </div>
          ${invoice.discount > 0
      ? `
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
              <span>Discount ${invoice.discountType === "percentage" ? `(${invoice.discount}%)` : ""}:</span>
              <span>-₹${(invoice.discountType === "percentage" ? (invoice.subtotal * invoice.discount) / 100 : invoice.discount).toLocaleString()}</span>
            </div>
          `
      : ""
    }
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>Tax (${invoice.taxPercentage}%):</span>
            <span>₹${invoice.tax.toLocaleString()}</span>
          </div>
          <div style="border-top: 2px solid #d4a574; padding-top: 8px; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #d4a574;">
            <span>Grand Total:</span>
            <span>₹${invoice.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Thank You -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 12px; line-height: 1.6; font-style: italic;">${invoice.thankYouMessage}</p>
      </div>

      <!-- Footer with Contact Info and Social Links -->
      <div style="border-top: 2px solid #d4a574; padding-top: 20px;">
        <div style="text-align: center; margin-bottom: 15px;">
          ${contactInfoHtml}
        </div>
        <p style="margin: 10px 0 0 0; text-align: center; font-size: 10px; color: #666;">${businessName} | ${contactText}</p>
        <p style="margin: 5px 0 0 0; text-align: center; font-size: 10px; color: #666;">Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
      </div>
    </div>
  `;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  tempDiv.id = "pdf-content";
  // FIX: html2canvas requires visibility
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "794px"; // ~210mm @ 96dpi
  document.body.appendChild(tempDiv);

  setTimeout(async () => {
    try {
      await generatePDF("pdf-content", `Invoice-${invoice.invoiceNumber}.pdf`);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }, 500);
};

export const generateOrderPDF = (order, settings = {}) => {
  const businessName = settings.businessName || "The Patil Photography";
  const primaryLogo = settings.primaryLogo || "";
  const contactText = "Crafting beautiful moments, flawlessly documented";
  const address = settings.address || "";
  const primaryPhone = settings.primaryMobileNumber || "";
  const secondaryPhone = settings.secondaryMobileNumber || "";
  const contactEmail = settings.contactEmail || "";
  const socialLinks = settings.socialLinks || [];

  const logoHtml = primaryLogo
    ? `<img src="${primaryLogo}" style="height: 50px; object-fit: contain;" />`
    : `<div style="width: 50px; height: 50px; background: linear-gradient(135deg, #d4a574, #c49561); border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-weight: bold; font-size: 20px;">P</span></div>`;

  // Social media icons HTML
  const socialIconsHtml = socialLinks
    .filter(l => l.active)
    .map(link => {
      const platformIcons = {
        'WhatsApp': '📱',
        'Instagram': '📷',
        'Facebook': 'f',
        'YouTube': '▶',
        'Twitter': '𝕏',
        'LinkedIn': 'in',
        'Other': '🔗'
      };
      return `<a href="${link.url}" target="_blank" style="margin: 0 5px; text-decoration: none; color: #d4a574; font-weight: bold;">${platformIcons[link.platform] || link.platform}</a>`;
    })
    .join('');

  // Contact info HTML
  const contactInfoHtml = `
    <div style="font-size: 10px; color: #666; line-height: 1.8;">
      ${primaryPhone ? `<p style="margin: 0;">📞 ${primaryPhone}${secondaryPhone ? ` | ${secondaryPhone}` : ''}</p>` : ''}
      ${contactEmail ? `<p style="margin: 0;">✉️ ${contactEmail}</p>` : ''}
      ${address ? `<p style="margin: 0;">📍 ${address}</p>` : ''}
      ${socialIconsHtml ? `<p style="margin: 0 0 5px 0;">Social: ${socialIconsHtml}</p>` : ''}
    </div>
  `;

  const paid = parseFloat(order.amount_paid) || parseFloat(order.paidAmount) || 0;
  const total = parseFloat(order.amount) || 0;
  const remaining = total - paid;
  const eventDate = order.event_date || order.date ? new Date(order.event_date || order.date).toLocaleDateString() : "N/A";

  const content = `
    <div style="font-family: 'Playfair Display', serif; padding: 40px; background: white; color: #1a1a1a;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #d4a574; padding-bottom: 20px;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px;">
          ${logoHtml}
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1a1a1a;">${businessName}</h1>
          </div>
        </div>
        <h2 style="font-size: 24px; font-weight: bold; margin: 20px 0 0 0; color: #1a1a1a;">PAYMENT RECEIPT</h2>
      </div>

      <!-- Receipt Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #d4a574; font-size: 12px; font-weight: bold; margin-bottom: 10px;">CLIENT DETAILS</h3>
          <p style="margin: 0; font-size: 16px; font-weight: bold;">${order.name || order.customerName}</p>
          <p style="margin: 5px 0; font-size: 12px;">${order.email || ""}</p>
          <p style="margin: 5px 0; font-size: 12px;">${order.whatsapp_no || order.customerPhone || ""}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 5px 0; font-size: 12px;"><strong>Order ID:</strong> #${order._id.slice(-6).toUpperCase()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Receipt Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Event:</strong> ${order.event_name || "-"}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Event Date:</strong> ${eventDate}</p>
        </div>
      </div>

      <!-- Financial Summary Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #2d2d2d; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #d4a574;">Description</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #d4a574;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border: 1px solid #e5e5e5;">
            <td style="padding: 12px; border: 1px solid #e5e5e5;">Total Project Value (${order.photography_type || "Service"})</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5;">₹${total.toLocaleString()}</td>
          </tr>
          <tr style="border: 1px solid #e5e5e5;">
            <td style="padding: 12px; border: 1px solid #e5e5e5;">Amount Received</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5; font-weight: bold; color: green;">₹${paid.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <!-- Summary / Balance -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; width: 300px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>Total Amount:</span>
            <span>₹${total.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>Paid Amount:</span>
            <span>₹${paid.toLocaleString()}</span>
          </div>
          <div style="border-top: 2px solid #d4a574; padding-top: 8px; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #d4a574;">
            <span>Balance Due:</span>
            <span>₹${remaining > 0 ? remaining.toLocaleString() : "0 (Fully Paid)"}</span>
          </div>
        </div>
      </div>

      <!-- Thank You -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 12px; line-height: 1.6; font-style: italic;">Thank you for trusting us with your memories!</p>
      </div>

      <!-- Footer with Contact Info and Social Links -->
      <div style="border-top: 2px solid #d4a574; padding-top: 20px;">
        <div style="text-align: center; margin-bottom: 15px;">
          ${contactInfoHtml}
        </div>
        <p style="margin: 10px 0 0 0; text-align: center; font-size: 10px; color: #666;">${businessName} | ${contactText}</p>
        <p style="margin: 5px 0 0 0; text-align: center; font-size: 10px; color: #666;">Receipt Date: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  `;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  tempDiv.id = "pdf-content";
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "794px";
  document.body.appendChild(tempDiv);

  setTimeout(async () => {
    try {
      await generatePDF("pdf-content", `Receipt_${(order.name || "Order").replace(/\s+/g, '_')}.pdf`);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }, 500);
};
