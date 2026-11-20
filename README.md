# Fylo — Cloud File Storage & Document Sharing Platform (Abuja, Nigeria)

Fylo is a full-stack cloud file storage and document management web application built with **Laravel 12**, **Inertia.js v2**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Designed and contextualized for individuals, teams, and businesses in **Abuja, Federal Capital Territory (FCT), Nigeria**, all subscription plans, billing, and transactions operate exclusively in **Nigerian Naira (₦ / NGN)**.

---

## Core Capabilities

- **Private Cloud File Storage**: Authenticated file uploads stored on an isolated storage disk (`local` private disk by default) with server-side ownership and access verification on every download and preview.
- **Single & Multi-File Upload**: Drag-and-drop or modal-based multi-file upload with live progress bars, per-plan upload size enforcement, duplicate filename resolution, and strict extension validation.
- **Hierarchical Folder Management**: Create nested folders with custom color tags, navigate via breadcrumb trails, move files across folders, and safely delete folders without losing inner files.
- **In-Browser Media & Document Previews**: Preview images (with zoom controls), PDF documents, video/audio streams, and plain text (`TXT`, `CSV`, `JSON`, `MD`) directly inside the browser.
- **Direct & Tokenized File Sharing**:
  - Share files directly with other registered Fylo users by email.
  - Generate cryptographic public share links (`/s/{token}`) with optional bcrypt password protection, custom expiration dates (1, 7, 30, or 90 days), and instant one-click link revocation.
- **Storage Quota & Naira (₦) Billing**:
  - Real-time storage quota calculation and progress visualization.
  - Configurable plans in Nigerian Naira (`₦`) with a 20% annual discount (`Yearly Price = Monthly Price × 12 × 0.8`):
    - **Free**: 5 GB — **₦0/mo** (₦0/yr)
    - **Starter**: 50 GB — **₦15,000/mo** (₦144,000/yr)
    - **Growth**: 100 GB — **₦20,000/mo** (₦192,000/yr)
    - **Business**: 250 GB — **₦30,000/mo** (₦288,000/yr)
  - Dedicated two-step Package Selection (`/subscription`) and Checkout (`/subscription/checkout`) flow supporting **Moneta** (default gateway extension point) and **Paystack** (full payment initialization, kobo conversion, transaction verification, and HMAC SHA-512 webhook processing).
- **Recycle Bin (Trash)**: Soft-delete files, restore deleted files with quota verification, or permanently purge files from storage.
- **Admin Operations Console**: Role-protected administrator portal (`/admin`) to monitor platform metrics, manage users, configure NGN storage plans, and inspect payment transactions.

---

## Prerequisites

- **PHP** >= 8.2 (with `pdo`, `mbstring`, `fileinfo`, `openssl`, `sqlite3` / `pdo_mysql` extensions)
- **Composer** >= 2.x
- **Node.js** >= 20.x & **npm** >= 10.x
- **Database**: MySQL / MariaDB or SQLite

---

## Local Setup & Installation

1. **Install PHP dependencies**:
   ```bash
   composer install
   ```

2. **Install Frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Update `.env` with your `APP_URL` (e.g., `http://localhost:8000`), database credentials (`DB_CONNECTION`, `DB_DATABASE`, etc.), and payment gateway credentials:
   ```env
   DEFAULT_PAYMENT_GATEWAY=moneta

   PAYSTACK_ENVIRONMENT=test
   PAYSTACK_TEST_PUBLIC_KEY=pk_test_...
   PAYSTACK_TEST_SECRET_KEY=sk_test_...
   PAYSTACK_LIVE_PUBLIC_KEY=pk_live_...
   PAYSTACK_LIVE_SECRET_KEY=sk_live_...
   PAYSTACK_CALLBACK_URL=
   PAYSTACK_WEBHOOK_SECRET=
   ```
   Central application settings, Abuja location metadata, NGN currency config, and default plans live in [`config/fylo.php`](config/fylo.php) and [`config/services.php`](config/services.php).

4. **Run Database Migrations & Seeders**:
   ```bash
   php artisan migrate --seed
   ```
   This seeds the four Naira (`₦`) storage plans (`Free`, `Basic`, `Pro`, `Business`) and demo accounts:
   - **Admin Account**: `admin@fylo.ng` / `password`
   - **Standard Account**: `test@example.com` / `password`

5. **Start the Development Server**:
   ```bash
   composer run dev
   ```
   Or run the backend and Vite servers separately:
   ```bash
   php artisan serve
   npm run dev
   ```

---

## Testing & Quality Verification

- **Run Backend Feature & Unit Tests (PHPUnit)**:
  ```bash
  php artisan test
  ```
- **Run TypeScript Type Checking**:
  ```bash
  npm run types
  ```
- **Build Production Frontend Assets**:
  ```bash
  npm run build
  ```

---

## Production Deployment & Security Considerations

1. **Environment Hardening**:
   - Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`.
   - Set `APP_URL` to your canonical HTTPS domain (e.g., `https://fylo.ng`).
   - Keep `FYLO_STORAGE_DISK=local` (stores files under `storage/app/private/uploads`) so uploaded files are never directly accessible via public web paths without passing through `FileController` or `PublicShareController` authorization checks.
2. **Optimize Laravel Caches**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   npm run build
   ```
3. **Upload Size Limits**:
   - Configure `upload_max_filesize` and `post_max_size` in `php.ini` / Nginx (`client_max_body_size`) to match your highest plan's upload limit.
