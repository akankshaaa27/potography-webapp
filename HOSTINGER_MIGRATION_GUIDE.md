
# 🚀 Hostinger Migration Guide: Photography WebApp

This guide details how to deploy your **React Frontend** and **Node.js MySQL Backend** to Hostinger.

---

## 1. Database Setup (Hostinger)

1.  Log in to **Hostinger hPanel**.
2.  Go to **Databases** -> **Management**.
3.  Create a **New MySQL Database**:
    *   **Database Name**: e.g., `u123456789_photography`
    *   **Username**: e.g., `u123456789_admin`
    *   **Password**: *Create a strong password*
4.  Click **Enter phpMyAdmin**.
5.  Select your database on the left.
6.  Click the **Import** tab.
7.  Upload the `server/mysql_schema.sql` file provided in this project.
8.  Click **Go**.
    *   *Result: All tables (`users`, `clients`, `orders`, etc.) will be created.*

---

## 2. Backend Deployment (Node.js API)

### A. Prepare the Code
1.  Navigate to the `server/` directory on your local machine.
2.  Open `.env` and update the MySQL credentials with the ones you created in Step 1:
    ```env
    MYSQL_HOST=localhost (Usually 'localhost' for Hostinger)
    MYSQL_USER=u123456789_admin
    MYSQL_PASSWORD=your_password
    MYSQL_DATABASE=u123456789_photography
    JWT_SECRET=your_secure_jwt_secret
    ```
3.  Archive (Zip) the contents of the `server/` folder (excluding `node_modules`).

### B. Upload to Hostinger
1.  Go to **Websites** -> **Manage** -> **Files** -> **File Manager**.
2.  Navigate to `public_html`.
3.  Create a folder named `api` (or keep it in a separate `backend` folder outside `public_html` if your plan allows Node.js apps anywhere).
    *   *Recommendation for Hostinger VPS/Cloud*: `/home/u123456789/domains/yourdomain.com/backend`
    *   *Recommendation for Shared Hosting*: Hostinger has a specific "Node.js" section. Use that.
4.  Upload your `server.zip` and extract it.

### C. Configure Node.js (Shared Hosting)
1.  Go to **Advanced** -> **Node.js Configurator** in hPanel.
2.  **Application Root**: Enter the path to your uploaded server files (e.g., `backend` or `public_html/api`).
3.  **Application Startup File**: `server.js`.
4.  **Run npm install**: Click the button to install dependencies (`express`, `mysql2`, `sequelize`, etc.).
5.  **Start Application**: Click Start.
    *   *Note URL*: Your API will be available at your domain/subdomain depending on setup.

---

## 3. Frontend Deployment (React)

### A. Build for Production
1.  On your local machine, navigate to the `client` (or root if shared) directory.
2.  Open `.env` (or create `.env.production`) and set the API URL:
    ```env
    VITE_API_URL=https://api.jayeshchavanphotography.com (OR your Hostinger API URL)
    ```
3.  Run the build command:
    ```bash
    npm run build
    ```
    *   *This will create a `dist` folder.*

### B. Upload to Hostinger
1.  Go to **File Manager** -> `public_html`.
2.  Delete default files (like `default.php`).
3.  Upload the **contents** of the `dist` folder directly to `public_html`.
4.  **Important for React Router**:
    *   Create a `.htaccess` file in `public_html` with the following content to handle routing (refreshing pages):
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

---

## 4. Verification

1.  **Frontend**: Visit `jayeshchavanphotography.com`. The site should load.
2.  **API Connection**: Open Developer Tools (F12) -> Network. Check if requests to `/api/...` or `api.jayeshchavanphotography.com` are working (Status 200).
3.  **Database**: Try submitting a "Contact Us" form or logging in to the Admin Panel. Check phpMyAdmin to see if the record appears in the tables.

---

## ⚠️ Troubleshooting

*   **API Connection Refused**: Check if `MYSQL_HOST`, `MYSQL_USER`, and `MYSQL_PASSWORD` are correct in the server `.env`.
*   **404 on Refresh**: Ensure the `.htaccess` file is present in `public_html`.
*   **CORS Error**: Update `CORS_ORIGIN` in `server/.env` to match your actual domain name (e.g., `https://jayeshchavanphotography.com`).
