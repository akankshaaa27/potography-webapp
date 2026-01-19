# Web Application Hosting Proposal & Deployment Roadmap

**Project:** Photography Portfolio & Management System  
**Date:** January 19, 2026  
**Prepared For:** Client  
**Prepared By:** Development Team

---

## 1. Executive Summary

We have successfully developed a high-performance, full-stack web application tailored for your photography business. The system consists of:
*   **Public Website:** A stunning, responsive portfolio site built with **React.js**.
*   **Admin Panel:** A comprehensive dashboard to manage clients, bookings, and content.
*   **Backend API:** A robust **Node.js** server handling all logic.
*   **Database:** A cost-effective, high-speed **MySQL** database for data storage.

This document outlines the hosting requirements, budget estimates, and a step-by-step deployment roadmap to launch your site on **Hostinger**.

---

## 2. Budget Estimate (Annual)

Unlike other solutions that require expensive cloud databases (like MongoDB Atlas), we have optimized this application to use **MySQL**, which is **free and included** in standard hosting plans. This significantly reduces your recurring costs.

### Recommended Hosting Plan: **Hostinger Business Web Hosting**

| Item | Description | Estimated Annual Cost | Client Price Suggestion |
| :--- | :--- | :--- | :--- |
| **Server Hosting** | Hostinger Business Plan (Supports Node.js, 4x Performance, Daily Backups) | ₹4,500 - ₹5,500 | ₹10,000 |
| **Domain Name** | `.com` or `.in` Domain Registration | Free (1st Year) | Included |
| **SSL Certificate** | Secure HTTPS connection (Essential for security) | Free (Forever) | Included |
| **Database** | Managed MySQL Database Service | Free (Unlimited) | Included |
| **Maintenance** | Server updates, backup monitoring, minor content edits | -- | ₹5,000 / year (Optional) |
| **TOTAL** | | **~₹5,000 / year** | **₹10,000 - ₹15,000 / year** |

**Why this plan?**
*   **Performance:** React applications require decent processing power. The Business plan offers 4x speed compared to basic shared hosting.
*   **Node.js Support:** Essential for running our custom backend.
*   **Storage:** 200 GB NVMe Storage (plenty of room for high-res portfolio images).

---

## 3. Deployment Roadmap

This technical roadmap ensures a smooth transition from development to the live production server.

### Phase 1: Infrastructure Setup (Day 1)
*   **Domain Configuration:** Pointing your `www.yourdomain.com` to Hostinger's nameservers.
*   **SSL Activation:** Enabling HTTPS for security.
*   **Database Creation:** 
    *   Setting up the MySQL Database on Hostinger.
    *   Creating secure user credentials.
    *   Importing the database structure (Tables for Users, Galleries, Bookings, etc.).

### Phase 2: Backend Deployment (Day 1-2)
*   **API Upload:** Moving the Node.js server code to the secure backend directory.
*   **Configuration:** Connecting the backend to the live MySQL database.
*   **Image Storage Setup:** creating a dedicated, writable `uploads` folder for storing gallery images and client files.
*   **Testing:** Verifying that the API is running and responding to requests.

### Phase 3: Frontend Launch (Day 2)
*   **Optimization:** Building the React Website and Admin Panel for production (minifying code for faster load times).
*   **Environment Setup:** Pointing the website to the live API URL.
*   **Upload:** Deploying the Public Website to the main domain (e.g., `yourdomain.com`).
*   **Admin Deployment:** Deploying the Admin Panel to a secure subdomain or subfolder (e.g., `yourdomain.com/admin`).

### Phase 4: Final Verification & Handover (Day 3)
*   **Functionality Check:** Testing all forms (Contact, Booking), Image Uploads, and Login systems.
*   **Performance Test:** Checking page load speeds on mobile and desktop.
*   **Handover:** Providing credentials for the Admin Panel and Hosting Account.

---

## 4. Maintenance & Support

To ensure the website remains secure and fast, we recommend a basic maintenance agreement.

*   **Daily Backups:** Automated via Hostinger.
*   **Security Patches:** Keeping the Node.js environment up to date.
*   **Uptime Monitoring:** Ensuring the site is always online.

---

*This document serves as a professional proposal and roadmap for your web application deployment.*
