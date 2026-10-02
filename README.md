# 🎫 Coupon SaaS Platform — Master Context

> **Multi-Tenant SaaS Platform** — Coupon Management + Stock Management + Multi-Language Support + Subscription System

A complete business management platform built with **Vanilla JavaScript**, **Firebase**, and **GitHub Pages**. Designed for manufacturers, wholesalers, retailers, and craftsmen (Mistri) across India.

**Last Updated:** 2026-10-02

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Live Links](#-live-links)
3. [Files & Structure](#-files--structure)
4. [Features Implemented](#-features-implemented)
5. [Features In Progress](#-features-in-progress)
6. [Tech Stack](#-tech-stack)
7. [Database Structure](#-database-structure)
8. [User Roles](#-user-roles)
9. [Subscription Plans](#-subscription-plans)
10. [How to Use This Repo](#-how-to-use-this-repo)
11. [Update Log](#-update-log)

---

## 🎯 Project Overview

This is a **Single Page Application (SPA)** built using **Vanilla JavaScript (ES Modules)** and **Firebase**. The platform serves multiple business types:

- **Manufacturers** (কুপন ও পণ্য তৈরি)
- **Wholesalers** (পাইকারি বিক্রেতা)
- **Retailers** (খুচরা বিক্রেতা)
- **Craftsmen / Mistri** (কারিগর)
- **Customers** (গ্রাহক)

Each admin can manage their own business with separate coupons, stock, team, and customers — while the Super Admin manages the entire platform.

---

## 🌐 Live Links

| Page | URL |
|:---|:---|
| **Coupon System (Beta)** | `https://abedulonline-glitch.github.io/coupon-app/beta.html` |
| **Stock Management (Beta)** | `https://abedulonline-glitch.github.io/coupon-app/stock-beta.html` |
| **Super Admin Panel (Beta)** | `https://abedulonline-glitch.github.io/coupon-app/super-beta.html` |

---

## 📁 Files & Structure

### Core Files

| File | Description | Raw Link |
|:---|:---|:---|
| `beta.html` | Main Coupon System (Admin Registration, Invite, Wallet, Subscription) | [raw](https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/beta.html) |
| `stock-beta.html` | Stock Management System (Category, Products, Marble/Tiles/Granite) | [raw](https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/stock-beta.html) |
| `super-beta.html` | Super Admin Panel (Platform Management, Approve/Reject, Revenue) | [raw](https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/super-beta.html) |
| `i18n.js` | Multi-Language System (10 Indian Languages) | [raw](https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/i18n.js) |
| `firebase-config-beta.js` | Firebase Configuration (Beta Project) | [raw](https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/firebase-config-beta.js) |
| `firebase-config-prod.js` | Firebase Configuration (Production Project) | [raw](https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/firebase-config-prod.js) |
| `index.html` | Production version (uses prod Firebase) | [raw](https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/index.html) |

---

## ✅ Features Implemented

### 🎫 Coupon System (`beta.html`)

- Admin Registration (Email + Password via Firebase Auth)
- Admin Login
- Password Recovery (Email-based via Firebase)
- Category Manager (Custom categories per business type)
- Product Row (7 types: Marble, Tiles, Medicine, Grocery, Clothing, Restaurant, Electronics, Hardware)
- Coupon Generation (with QR code + Print / PDF)
- Team Management (Invite Code System)
  - Manager, Salesman, Delivery Boy, Dispatch Boy, Consignor
  - Invite code expiry + single-use
- Customer Wallet (Balance + Transactions)
- Withdrawal System (Manual approval by Super Admin)
- Subscription System
  - UPI QR Code
  - Screenshot Upload (ImgBB)
  - Approve / Reject by Super Admin
  - Subscription Lock Screen
- Lock Screen (When subscription expired or trial ended)

### 📦 Stock Management (`stock-beta.html`)

- **Category-First Approach** — Select category first, then template loads
- **Marble / Granite Template**
  - Simple Mode (one line entry)
  - Details Mode (Excel-like table)
  - Length / Width in **inches** (auto-converts to feet)
  - Allowance (with info tooltip)
  - Total Paper sqft + Total Actual sqft
  - Per sqft (Paper based) + Per sqft (Actual based)
  - Measurement Benefit (per sqft)
  - Add New Lot / Finish Lot
- **Tiles Template**
  - Rating Type (sqft / Box)
  - Size, Pieces/Box, sqft/Box
  - Weight/Box, Boxes
  - Pakka Rate / Cash Rate (dynamic label)
- **General Template** (Adhesive, Medicine, Grocery, etc.)
  - Size, Pieces/Box, Weight/Box, Boxes
  - Pakka Rate / Cash Rate
- **Transport System**
  - Lorry vs Container
  - Container GST Benefit (Tax-adj rate)
  - Truck Weight Filter (42T/45T vs 30T/31T/32T)
- **Free Delivery**
  - Common level (all products)
  - Product level override
- **Live Calculation**
  - Total Paper / Actual
  - Pakka + Cash + GST + Transport + Extra
  - Weight Proportion (Auto split of whole-bill costs)
- **Role Rates**
  - 5 Roles: Stocker, Wholesaler, Retailer, Consumer, Mistri
  - Item Custom Rate (Priority 1)
  - Category Default Rate (Priority 2 — planned)
  - Admin Global % (Priority 3)
  - Super Admin Global % (Priority 4)
  - Contact Admin (Priority 5)
- **Others Mode + Timer + Panic Button**
  - Vault Password Protection
  - Timer with Progress Bar (15/30/45/60 min)
  - Panic Button (Double Tap)
  - Auto-close on: Timer End / Another Screen / 10s Inactivity

### 🌐 Language System (`i18n.js`)

- 10 Indian Languages:
  - বাংলা, English, हिन्दी, ଓଡ଼ିଆ, اردو
  - ગુજરાતી, मराठी, தமிழ், తెలుగు, മലയാളം
- Auto-translate via `data-t` attribute
- Smart Auto-Tag (Bengali → Key detection)
- RTL support for Urdu
- localStorage persistence

### 🟣 Super Admin Panel (`super-beta.html`)

- Super Admin Registration (Secret Key)
- Super Admin Login (Firebase Auth)
- Admin List (All Companies)
- Subscription Requests (Approve / Reject)
- Trial Management (Extend days)
- Subscription Plans (Trial, Starter, Pro, Enterprise)
- Revenue Tracking
- Suspend / Activate Admin

---

## 🚧 Features In Progress

<!-- AUTO_FEATURES_IN_PROGRESS_START -->
- [ ] **Product-level Free Delivery** for all 7 templates
- [ ] **Others Mode Integration** — Cash/Optional hide/show
- [ ] **Firebase Save** — Full stock entry save to Firestore
- [ ] **Excel Import / Export** — CSV + XLSX
- [ ] **Table View** — Form ↔ Table toggle
- [ ] **Category Default Role Rates** — Priority 2
- [ ] **Barcode / QR Scan** — Product scanning
- [ ] **Mobile Typography Optimization**
- [ ] **Voice Input** — Speech-to-text
- [ ] **Auto-Save Draft** — localStorage
- [ ] **Stock List Tab** — View all stock entries
- [ ] **Dashboard** — Analytics + Charts
<!-- AUTO_FEATURES_IN_PROGRESS_END -->

---

## 🛠 Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | Vanilla JavaScript (ES Modules), HTML5, CSS3 |
| **Backend** | Firebase (Firestore, Auth) |
| **Hosting** | GitHub Pages |
| **QR Scanner** | html5-qrcode |
| **QR Generator** | qrcodejs |
| **Image Hosting** | ImgBB |
| **Language System** | Custom i18n implementation |

---

## 🗄 Database Structure

### Firestore Collections

| Collection | Purpose |
|:---|:---|
| `admins` | Admin accounts (company, role, subscription) |
| `invites` | Invite codes (role, expiry, used status) |
| `coupons` | Generated coupons (code, grade, status) |
| `customers` | Customer accounts (phone, wallet balance) |
| `transactions` | Wallet transactions (credit/debit) |
| `withdrawals` | Withdrawal requests |
| `subscriptions` | Subscription requests (plan, screenshot, status) |
| `stock_entries` | Stock entries (products, transport, cost) |
| `categories` | Custom categories per admin |

---

## 👥 User Roles (12 Total)

| # | Role | Type | Registration |
|:---|:---|:---|:---|
| 1 | Super Admin | Platform Owner | Secret Link |
| 2 | Admin / Owner | Business Owner | Open |
| 3 | Manufacturer | Business Owner | Open |
| 4 | Wholesaler | Business Owner | Open |
| 5 | Retailer | Business Owner | Open |
| 6 | Mistri | Craftsman | Open |
| 7 | Customer | End User | Open |
| 8 | Manager | Team Member | Invite Code |
| 9 | Salesman | Team Member | Invite Code |
| 10 | Delivery Boy | Team Member | Invite Code |
| 11 | Dispatch Boy | Team Member | Invite Code |
| 12 | Consignor | Team Member | Invite Code |

---

## 💰 Subscription Plans

### Current Pricing (Subject to change)

| Plan | Monthly Price | Coupon Limit | Customer Limit |
|:---|:---|:---|:---|
| 🟡 Trial | Free | 100 | 50 |
| 🟢 Starter | ₹300 | 500 | 200 |
| 🔵 Pro | ₹800 | 5,000 | 2,000 |
| 🟣 Enterprise | ₹2,000+ | Unlimited | Unlimited |

### Module-Based Pricing (Planned)

| Module | Price |
|:---|:---|
| 📦 Stock Management | ₹1000/month |
| 🛍️ Product Catalog | ₹500/month |
| 🎫 Coupon (1000) | ₹500/month |
| 🎫 Coupon (1000+) | ₹800/month |
| 👥 Team Management | ₹300/month |
| 💎 Subscription System | ₹300/month |
| 📊 Reports & Analytics | ₹500/month |
| 🎯 **COMBO (All)** | **₹2500/month** |

---

## 📖 How to Use This Repo

### For Developers / Chatbots

**Step 1:** Read this README completely.

**Step 2:** Read the relevant file(s):

- **Stock-related work** → `stock-beta.html`
- **Coupon-related work** → `beta.html`
- **Language-related work** → `i18n.js`
- **Super Admin-related work** → `super-beta.html`

**Step 3:** Firebase Configuration:

- Beta: `firebase-config-beta.js`
- Prod: `firebase-config-prod.js`

**Step 4:** When giving instructions, reference the specific file and line numbers when possible.

### For Users

**Admin Login:**
1. Go to `beta.html`
2. Register with Email + Password
3. Select Role (Admin / Manufacturer / Wholesaler / Retailer / Mistri / Customer)
4. Access Dashboard

**Stock Management:**
1. Go to `stock-beta.html`
2. Select Business Type
3. Select Category (Marble / Tiles / Adhesive / etc.)
4. Fill product details
5. Add New Lot / Finish Lot

**Customer Access:**
1. Admin shares unique link: `beta.html?admin=ADMIN_ID`
2. Customer registers with mobile number
3. Customer scans coupon QR to earn points
4. Customer requests withdrawal via UPI

---

## 🚀 Deployment

### GitHub Pages

This project is deployed via GitHub Pages:
- Repository: `abedulonline-glitch/coupon-app`
- Branch: `main`
- Folder: `/ (root)`

### Firebase Projects

- **Beta**: `CouponSystem-Beta`
- **Production**: `CouponSystem`

---

## 🎨 Design System

### Colors

| Color | Usage |
|:---|:---|
| 🟢 Green (#0f9d58) | Success, Add New Lot |
| 🔴 Red (#d93025) | Danger, Delete, Panic |
| 🔵 Blue (#1a73e8) | Primary, Info |
| 🟡 Yellow (#f9a825) | Others Mode, Warning |
| 🟣 Purple (#7b1fa2) | Vault Password, Super Admin |

### Typography

- Font: `Segoe UI`, Arial, sans-serif
- Size: 11px (small), 13px (normal), 15px (heading), 18px (large)

---

## 📝 Notes

- All measurements for Marble/Granite are in **inches** (auto-converts to feet)
- All monetary values in **₹ (Indian Rupees)**
- Free Delivery checkbox **hides** the entire Transport Section
- Container transport includes **GST Tax Benefit** calculation
- Cash / Optional fields are **hidden by default** and revealed only in Others Mode

---

## 📊 Update Log

<!-- AUTO_UPDATE_LOG_START -->
| Date | File(s) | Changes |
|:---|:---|:---|
| 2026-10-02 | `README.md` | Master Context restructured with auto-update tags |
<!-- AUTO_UPDATE_LOG_END -->

---

## 📸 Screenshots & Demo

<!-- AUTO_SCREENSHOTS_START -->
> _Screenshots will be added here as the project evolves._
<!-- AUTO_SCREENSHOTS_END -->

---

## 🤝 Contributions

This is a **private project** by [@abedulonline-glitch](https://github.com/abedulonline-glitch).

## 📞 Contact

- **GitHub**: [abedulonline-glitch](https://github.com/abedulonline-glitch)
- **WhatsApp**: 9851713487

---

**Made with ❤️ in India By Abedul Mallick**
