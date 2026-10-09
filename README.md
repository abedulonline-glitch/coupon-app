# 🎫 Coupon SaaS Platform — Master Context

> **Multi-Tenant SaaS Platform** — Coupon Management + Stock Management + Multi-Language Support + Subscription System

A complete business management platform built with **Vanilla JavaScript**, **Firebase**, and **GitHub Pages**. Designed for manufacturers, wholesalers, retailers, and craftsmen (Mistri) across India.

**Last Updated:** 2026-10-09 14:30  
**Next Review:** 2026-10-16  
**README Version:** 3.5

---

## ⏰ Update Timeline

> README.md-এর সাম্প্রতিক আপডেট ট্র্যাকিং। প্রতি বড় পরিবর্তনে এই টাইমলাইন আপডেট হবে।

| Date | Time | Session | Files Changed | Status |
|:---|:---|:---|:---|:---|
| 2026-10-09 | 14:30 | Session 15 | `stock-beta.html`, `README.md` | ✅ Synced |
| 2026-10-08 | 18:45 | Session 14 | `stock-beta.html` | ✅ Synced |
| 2026-10-07 | 22:00 | Session 13 | `stock-beta.html` | ✅ Synced |
| 2026-10-06 | 18:00 | Session 12 | `stock-beta.html` | ✅ Synced |
| 2026-10-05 | 15:00 | Session 11 | `stock-beta.html` | ⚠️ Partial |
| 2026-10-04 | 20:00 | Session 10 | `stock-beta.html` | ✅ Synced |

**Legend:**
- ✅ **Synced:** README এবং Code সম্পূর্ণ মিলে আছে
- ⚠️ **Partial:** কিছু পরিবর্তন README-তে যোগ করা হয়নি
- 🔴 **Outdated:** README-তে বড় আপডেট প্রয়োজন

---

**📌 নোট:** এই Timeline সাপ্তাহিক রিভিউ করা উচিত। `Next Review` তারিখের আগে README আপ-টু-ডেট রাখলে ভালো।

---


---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Live Links](#-live-links)
3. [Files & Structure](#-files--structure)
4. [Features Implemented](#-features-implemented)
5. [Features In Progress](#-features-in-progress)
6. [Tech Stack](#-tech-stack)
7. [Class & ID Registry](#-class--id-registry-developer-reference)
8. [Deprecated Classes](#-deprecated-classes)
9. [Database Structure](#-database-structure)
10. [User Roles](#-user-roles)
11. [Subscription Plans](#-subscription-plans)
12. [How to Use This Repo](#-how-to-use-this-repo)
13. [Update Log](#-update-log)

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
  - ✅ **Simple Mode** — Slab সংখ্যা, Total Sqft, Allowance (ঐচ্ছিক), Live Calculator
  - ✅ **Details Mode** — Excel-like table (Length, Width, L-Allow, W-Allow, Qty)
  - Length / Width in **inches** (auto-converts to feet)
  - Allowance (with info tooltip)
  - Total Paper sqft + Total Actual sqft
  - Per sqft (Paper) + Per sqft (Actual)
  - ✅ **Allowance Profit Calculator** — Marble/Granite-এ বাড়তি মাপের প্রফিট হিসাব
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
- ✅ **Others Mode + Timer + Panic Button**
  - Vault Password Protection
  - Timer with Progress Bar (15/30/45/60 min)
  - ✅ **Slider Drag System** — Progress Bar-এ আঙুল টেনে সময় কমানো/বাড়ানো
  - Panic Button (Double Tap)
  - Auto-close on: Timer End / Another Screen / 30s Inactivity
- ✅ **Quick Add System**
  - Design Name, Quantity, Image, Gallery, Video
  - Marble/Granite-এ Allowance (L-Allow, W-Allow)
  - Common Info Auto-Copy
  - Add & Next (Modal খোলা থাকে)
- ✅ **Temporary Buffer + Auto-Save**
  - Local Storage Auto-Save
  - Restore Popup (24 ঘণ্টা পর Auto-Delete)
  - Duplicate Prevention (_localId)
- ✅ **Image Upload (ImgBB + Cropper.js)**
  - Camera / Gallery থেকে ছবি
  - Crop (800px, WebP format)
  - ImgBB-তে আপলোড
  - ১টি Main + ৫টি Gallery + ১টি Video (YouTube)
- ✅ **Supplier WhatsApp Field**
  - বাধ্যতামূলক ১০ ডিজিট ভ্যালিডেশন
  - ভবিষ্যতের জন্য Firebase-এ সেভ প্রস্তুত
- ✅ **Smart Button System**
  - ➕ Add Item (সম্পূর্ণ নতুন Product Row)
  - ⚡ Quick Add (Common Info কপি)
  - 👁️ View Items (Temporary Buffer তালিকা)
  - ✅ Finish & Save

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

- [ ] **Firebase Save (Stock Entry)** — Full stock entry save to Firestore
- [ ] **Godown / Warehouse Management** — Dynamic Location Tracking
  - User-Defined Godown Name, Lane, Distance, Side
  - Marble: Large Hall, Tiles: Rack, Sanitary: Shelf
  - Stock Shift between Godowns
- [ ] **Stock Movement (Shift / Sale)** — User Details + Timestamp সহ লগ
- [ ] **Stock List View (Table Format)** — WordPress-এর মতো Excel Table
  - Quick Edit, Bulk Add/Edit, Delete Restriction (Stock 0 না হলে ডিলিট নয়)
- [ ] **Excel Import / Export** — CSV + XLSX
- [ ] **POS Billing System** — E-commerce এর সাথে ইন্টিগ্রেটেড
- [ ] **Online Catalog** — E-commerce Website এর জন্য
- [ ] **Product-level Free Delivery** — 7 Template-এ
- [ ] **Category Default Role Rates** — Priority 2
- [ ] **Barcode / QR Scan** — Product Scanning
- [ ] **Mobile Typography Optimization**
- [ ] **Voice Input** — Speech-to-text
- [ ] **Dashboard Analytics** — Charts + Revenue Reports

---

## 🛠 Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | Vanilla JavaScript (ES Modules), HTML5, CSS3 |
| **Backend** | Firebase (Firestore, Auth) |
| **Hosting** | GitHub Pages |
| **QR Scanner** | html5-qrcode |
| **QR Generator** | qrcodejs |
| **Image Hosting** | ImgBB API |
| **Image Cropping** | Cropper.js |
| **Language System** | Custom i18n implementation |
| **Cost** | ₹0 (সম্পূর্ণ ফ্রি) |

---
## 🗑️ Deprecated Classes & IDs

> ডিলিট করা Class/ID — শুধু রেফারেন্সের জন্য রাখা হয়েছে। নতুন কোডে এগুলো ব্যবহার করবেন না।

### 📦 Stock System (`stock-beta.html`)

| Class/ID | Reason for Removal | Removed On | Replaced By |
|:---|:---|:---|:---|
| `.per-sqft-combined` | Duplicate ডিজাইন (পার্ট ১-২ কনফ্লিক্ট) | 2026-10-09 | `.calc-per-box` + `.calc-per-piece` |
| `.calc-per-sqft-actual` | ভুল স্ট্রাকচার (DOM ব্রোকেন) | 2026-10-08 | `.calc-per-actual-sqft` |
| `.calc-measure-benefit` (পুরনো) | নতুন স্ট্রাকচারে স্থানান্তর | 2026-10-08 | `.calc-measure-benefit` (নতুন) |
| `input.capture = 'environment'` | মোবাইলে সরাসরি ক্যামেরা খুলত | 2026-10-09 | `#imageSourcePicker` |
| `.allow-cell` (পুরনো) | Simple Mode-এ দরকার নেই | 2026-10-08 | (বাদ) |
| `.d-l`, `.d-w`, `.d-al`, `.d-aw` (Simple Mode-এ) | Simple Mode-এ প্রযোজ্য নয় | 2026-10-06 | `.s-total-sqft`, `.s-allowance` |
| `.calc-per-sqft-actual` (পুরনো) | ভুল হিসাব | 2026-10-08 | `.calc-per-actual-sqft` |

### 🎫 Coupon System (`beta.html`)

| Class/ID | Reason for Removal | Removed On | Replaced By |
|:---|:---|:---|:---|
| _(এখনো কোনো ডেপ্রিকেটেড নেই)_ | — | — | — |

### 🌐 Language System (`i18n.js`)

| Key/Function | Reason for Removal | Removed On | Replaced By |
|:---|:---|:---|:---|
| _(এখনো কোনো ডেপ্রিকেটেড নেই)_ | — | — | — |

---

### 📋 ডেপ্রিকেটেড Class/ID যোগ করার নিয়ম

1. **ডিলিট করার আগে** এখানে যোগ করুন (তারিখ ও কারণ সহ)।
2. **Replaced By** কলামে নতুন Class/ID লিখুন (যদি থাকে)।
3. **Deprecated** ক্লাসটি কোড থেকে **সম্পূর্ণ ডিলিট** করুন (তবে README-এ রাখুন)।
4. **৬ মাস পর** ডেপ্রিকেটেড ক্লাসটি এই টেবিল থেকে সরিয়ে দিতে পারেন (ঐচ্ছিক)।

---


## 🏷️ Class & ID Registry (Developer Reference)

> **⚠️ গুরুত্বপূর্ণ:** এই সেকশনটি প্রতিটি ফাইলের গুরুত্বপূর্ণ Class, ID এবং Local Storage Key-এর রেফারেন্স। নতুন কোড যোগ করার আগে এখানে খুঁজে নিন, যাতে ডুপ্লিকেট না হয়।

---

### 📦 Stock System (`stock-beta.html`)

#### 🏢 Supplier & Common Info

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Supplier Name | `#supplierName` | কোম্পানি / সাপ্লায়ার নাম |
| Supplier WhatsApp | `#supplierWhatsapp` | সাপ্লায়ারের WhatsApp নাম্বার (বাধ্যতামূলক) |
| Supplier WhatsApp Helper | `#supplierWhatsappHelper` | ভ্যালিডেশন মেসেজ |
| Supplier GST | `#supplierGst` | GST নাম্বার |
| Invoice No | `#invoiceNo` | ইনভয়েস নম্বর |
| Purchase Date | `#purchaseDate` | ক্রয় তারিখ |
| Free Delivery | `#freeDeliveryCommon` | ফ্রি ডেলিভারি চেকবক্স |
| Transport Section | `#transportSectionWrapper` | পরিবহন সেকশন |
| Transport Rate | `#transportRate` | পরিবহন রেট (₹/টন) |
| Truck Weight | `#truckWeight` | ট্রাক/কনটেইনার ওজন |
| Truck Weight Custom | `#truckWeightCustom` | কাস্টম ওজন |
| Container GST | `#containerGstPercent` | কনটেইনার GST % |
| Container GST Custom | `#containerGstCustom` | কাস্টম GST % |
| Container GST Wrapper | `#containerGstWrapper` | কনটেইনার GST সেকশন |

#### 💰 Additional Cost (Whole Bill)

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Loading | `#loadingCost` | লোডিং খরচ |
| Unloading | `#unloadingCost` | আনলোডিং খরচ |
| Insurance | `#insuranceCost` | ইন্স্যুরেন্স খরচ |
| Others | `#otherPakka` | অন্যান্য খরচ |
| Optional Cost | `#optionalCost` | Cash/Optional খরচ (Others Mode-এ দেখাবে) |
| Optional Label | `#optionalLabelText` | Custom Label |
| Optional Hint | `#optionalHint` | হিন্ট মেসেজ |
| Optional Wrap | `.optional-wrap` | ইনপুট র‍্যাপার |
| Optional Icon | `.optional-icon` | 👁️ Eye Icon |
| Cash Label Wrap | `.others-cash-label` | Cash লেবেল (Others Mode) |

#### 📦 Product Row — General / Tiles

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Product Row | `.product-row` | প্রতিটি প্রোডাক্ট রো |
| Product Row ID | `#product-row-{id}` | ইউনিক ID |
| Product Name | `.p-name` | প্রোডাক্টের নাম |
| Category | `.p-category` | ক্যাটাগরি ড্রপডাউন |
| Brand | `.p-brand` | ব্র্যান্ড |
| HSN Code | `.p-hsn` | HSN কোড |
| GST % | `.p-gst` | GST ড্রপডাউন |
| Size | `.p-size` | সাইজ |
| Pieces/Box | `.p-pieces` | প্রতি বক্সে পিস |
| Sqft/Box | `.p-sqft` | প্রতি বক্সে স্কয়ার ফিট |
| Weight/Box | `.p-weight` | প্রতি বক্সে ওজন |
| Boxes | `.p-boxes` | মোট বক্স |
| Pakka Rate | `.p-pakka` | পাকা রেট |
| Cash Rate | `.p-optional` | Cash রেট (Others Mode) |
| Weight per Sqft | `.p-wt-sqft` | ওজন/sqft (Marble) |
| Allowance Check | `.p-allow-check` | Allowance চেকবক্স |
| Allowance Info Icon | `.allow-info-icon` | Tooltip আইকন |
| Allowance Column | `.allow-col` | Allowance হেডার সেল |
| Allowance Cell | `.allow-cell` | Allowance ডেটা সেল |
| Role Inputs | `.p-role-input` | ৫টি রোলের রেট |
| Role Preview | `.role-preview` | প্রিভিউ |
| Cash Rate Wrap | `.others-cash-rate-wrap` | Cash রেট সেকশন |

#### 🧮 Calculation Box

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Calc Box | `#calc-box-{id}` | হিসাবের বক্স |
| Total Paper | `.calc-total-paper` | মোট কাগজ sqft |
| Total Actual | `.calc-total-actual` | মোট আসল sqft |
| Per Sqft Paper | `.calc-per-sqft` | প্রতি sqft (Paper) |
| Per Sqft No Tax | `.calc-per-sqft-no-tax` | প্রতি sqft (Tax ছাড়া) |
| Per Actual Sqft | `.calc-per-actual-sqft` | প্রতি sqft (Actual) |
| Measure Benefit | `.calc-measure-benefit` | মেজারমেন্ট বেনিফিট |
| Allowance Profit | `.calc-allowance-profit` | Allowance প্রফিট |
| Shutter Toggle | `.calc-shutter-toggle` | বিস্তারিত হিসাব বাটন |
| Shutter Arrow | `.calc-shutter-arrow` | ▼ আইকন |
| Details Shutter | `.calc-details-shutter` | বিস্তারিত হিসাব কনটেন্ট |
| Calc Qty | `.calc-qty` | মোট পরিমাণ |
| Calc Pakka | `.calc-pakka` | পাকা মোট |
| Calc Cash | `.calc-cash` | Cash মোট |
| Calc GST | `.calc-gst` | GST |
| Calc Transport | `.calc-transport-share` | পরিবহন ভাগ |
| Calc Extra | `.calc-extra-share` | Extra ভাগ |
| Calc Weight Share | `.calc-weight-share` | ওজন ভাগ |
| Calc Total | `.calc-total` | মোট Landing |
| Calc Total No Tax | `.calc-total-no-tax` | মোট (Tax ছাড়া) |
| Benefit Box | `.benefit-box` | বেনিফিট সেকশন |
| Calc Paper | `.calc-paper` | হিসাব মাপ |
| Calc Actual | `.calc-actual` | আসল মাপ |
| Calc Extra | `.calc-extra` | Extra |
| Calc Extra Pct | `.calc-extra-pct` | Extra % |
| Calc Savings Pct | `.calc-savings-pct` | Savings % |
| Calc Real Rate | `.calc-real-rate` | প্রকৃত/sqft |
| Per Piece Landing | `.calc-per-piece` | প্রতি পিস (Landing) |
| Per Piece No Tax | `.calc-per-piece-no-tax` | প্রতি পিস (Tax ছাড়া) |
| Per Unit Label Landing | `.per-unit-label-landing` | Dynamic Label (Landing) |
| Per Unit Label No Tax | `.per-unit-label-no-tax` | Dynamic Label (Tax ছাড়া) |

#### 🧮 Simple Mode (Marble/Granite)

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Simple Mode | `#marble-simple-{id}` | Simple Mode কন্টেইনার |
| Slab সংখ্যা | `.s-slabs` | মোট স্ল্যাবের সংখ্যা |
| Total Sqft | `.s-total-sqft` | মূল কাগজের মোট মাপ |
| Allowance | `.s-allowance` | বাড়তি মাপ (ঐচ্ছিক) |

#### 🧮 Details Mode (Marble/Granite)

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Details Mode | `#marble-details-{id}` | Details Mode কন্টেইনার |
| Details Tbody | `#details-tbody-{id}` | Details টেবিল বডি |
| Length | `.d-l` | প্রতিটি স্ল্যাবের দৈর্ঘ্য |
| Width | `.d-w` | প্রতিটি স্ল্যাবের প্রস্থ |
| L-Allow | `.d-al` | দৈর্ঘ্যের ছাড় |
| W-Allow | `.d-aw` | প্রস্থের ছাড় |
| Qty | `.d-qty` | স্ল্যাব সংখ্যা |

#### 🎯 Role Rates Section

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Role Section | `.role-rates-section` | Role Rates কন্টেইনার |
| Role Header | `.role-rates-header` | টগল হেডার |
| Role Body | `.role-rates-body` | কনটেন্ট |
| Role Arrow | `.role-arrow` | ▼ আইকন |
| Role Landing Info | `.role-landing-info` | Landing Cost তথ্য |
| Role Row | `.role-row` | প্রতিটি রোলের রো |
| Role Label | `.role-label` | রোলের নাম |
| Role Autofill | `.role-autofill-btn` | Auto-fill বাটন |

#### 📸 Image Upload

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Image Section | `.image-upload-section` | ছবির সেকশন |
| Upload Box | `.upload-box` | আপলোড বক্স |
| Main Image Preview | `.img-preview-main` | Main Image প্রিভিউ |
| Main Image URL | `.p-image-main-url` | Main Image URL (hidden) |
| Gallery URLs | `.p-image-gallery-urls` | Gallery URLs (hidden) |
| Video URL | `.p-video-url` | Video URL (hidden) |
| Icon Main | `#icon-main-{id}` | Main Icon |
| Icon Gallery | `#icon-gallery-{id}` | Gallery Icon |
| Icon Video | `#icon-video-{id}` | Video Icon |

#### 📷 Image Source Picker

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Source Picker | `#imageSourcePicker` | Camera/Gallery Bottom Sheet |
| Camera Option | `onclick="pickImageSource('camera')"` | Camera সিলেক্ট |
| Gallery Option | `onclick="pickImageSource('gallery')"` | Gallery সিলেক্ট |
| Last Source | `localStorage.lastImageSource` | গতবারের পছন্দ |


#### 🖼️ Crop Modal

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Crop Modal | `#cropModal` | ক্রপ মোডাল |
| Crop Image | `#cropImage` | ক্রপ করার ছবি |
| Crop Status | `#cropStatus` | আপলোড স্ট্যাটাস |

#### ⚡ Quick Add System

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Quick Add Modal | `#quickAddModal` | Quick Add মোডাল |
| Common Info | `#quickCommonText` | Common Info প্রিভিউ |
| Design Name | `#quickDesignName` | ডিজাইনের নাম |
| Quantity | `#quickQuantity` | বক্স সংখ্যা |
| L-Allow | `#quickLAllow` | Marble L-Allow |
| W-Allow | `#quickWAllow` | Marble W-Allow |
| Gallery Slots | `#quickGallerySlots` | ৫টি গ্যালারি স্লট |
| Video URL | `#quickVideoUrl` | YouTube লিংক |
| Main Image Preview | `#quickMainImagePreview` | Main Image প্রিভিউ |
| Counter | `#quickAddCounter` | Counter |
| Allowance Wrapper | `#quickAllowanceWrapper` | Allowance সেকশন |

#### 📋 Temporary Buffer & Buttons

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Temp Buffer Status | `#tempBufferStatus` | জমা হওয়া আইটেম স্ট্যাটাস |
| Temp Buffer Count | `#tempBufferCount` | আইটেম সংখ্যা |
| View Items Count | `#viewItemsCount` | View বাটনে সংখ্যা |
| View Items Modal | `#viewItemsModal` | View Items মোডাল |
| View Items List | `#viewItemsList` | আইটেম তালিকা |
| Modal Count | `#modalItemsCount` | মোডালে আইটেম সংখ্যা |

#### 🟡 Others Mode

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Toggle | `#othersModeToggle` | Others Mode চেকবক্স |
| Timer Select | `#othersModeTimer` | Timer সময় |
| Inactivity Select | `#othersInactivityTimer` | Inactivity সেকেন্ড |
| Status | `#othersModeStatus` | Others Mode স্ট্যাটাস |
| Timer Bar | `#othersTimerBar` | Timer Progress Bar |
| Progress Fill | `#othersProgressFill` | Progress Bar ফিল |
| Progress Knob | `#othersProgressKnob` | Progress Bar Knob |
| Timer Text | `#othersTimerText` | Timer টেক্সট |
| Panic Button | `#othersPanicBtn` | Panic বাটন |
| Drag Tooltip | `#othersDragTooltip` | Drag টুলটিপ |

#### 💾 Local Storage Keys

| Key | Purpose |
|:---|:---|
| `stock_draft_{adminId}` | অসম্পূর্ণ স্টক এন্ট্রির ড্রাফট |
| `stock_vault_password` | Vault Password (Hashed) |
| `stock_vault_phone` | Vault Phone |
| `stock_vault_method` | Vault Method |
| `others_mode_timer_mins` | Others Mode Timer |
| `others_mode_inactivity_sec` | Others Mode Inactivity |
| `adminId` | Admin ID |

#### 🎨 CSS State Classes

| Class | Purpose |
|:---|:---|
| `body.others-mode-active` | Others Mode চালু অবস্থায় |
| `body.others-mode-active .p-optional` | Cash রেট দেখানো |
| `body:not(.others-mode-active) .p-allow-check` | Allowance হাইড |
| `.calc-details-shutter.open` | Shutter খোলা |
| `.danger` | Timer Danger State |
| `.quick-rates-common` | Quick Add Common Info |

---

### 🎫 Coupon System (`beta.html`)

#### 🔐 Auth & Registration

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Login Form | `#login-form` | Login |
| Register Form | `#register-form` | Registration |
| Login Email | `#loginEmail` | Login ইমেইল |
| Login Password | `#loginPassword` | Login পাসওয়ার্ড |
| Login Status | `#loginStatus` | Login স্ট্যাটাস |
| Register Email | `#regEmail` | Registration ইমেইল |
| Register Password | `#regPassword` | Registration পাসওয়ার্ড |
| Register Company | `#regCompany` | কোম্পানির নাম |
| Register Name | `#regName` | নাম |
| Register WhatsApp | `#regWhatsapp` | WhatsApp |
| Register Status | `#regStatus` | Registration স্ট্যাটাস |
| Role Selection | `#roleSelection` | রোল সিলেকশন |
| Register Form Fields | `#registerFormFields` | Registration ফর্ম |
| Invite Verify Section | `#inviteVerifySection` | Invite Code সেকশন |
| Invite Code Input | `#inviteCodeInput` | Invite কোড |
| Invite Verify Status | `#inviteVerifyStatus` | Invite স্ট্যাটাস |
| Selected Role Badge | `#selectedRoleBadge` | সিলেক্টেড রোল |
| Company Field Wrapper | `#companyFieldWrapper` | কোম্পানি ফিল্ড |

#### 🎨 Role Cards

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Role Card | `.role-card` | রোল সিলেকশন কার্ড |
| Admin Role | `#role-admin` | Admin কার্ড |
| Manufacturer Role | `#role-manufacturer` | Manufacturer কার্ড |
| Wholesaler Role | `#role-wholesaler` | Wholesaler কার্ড |
| Retailer Role | `#role-retailer` | Retailer কার্ড |
| Mistri Role | `#role-mistri` | Mistri কার্ড |
| Customer Role | `#role-customer` | Customer কার্ড |

#### 📊 Dashboard Views

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Admin View | `#view-admin` | Admin ভিউ |
| Subscription Alert | `#subAlertBanner` | Subscription অ্যালার্ট |
| Lock Screen | `#subLockScreen` | Lock Screen |
| Lock Title | `#lockTitle` | Lock Title |
| Lock Message | `#lockMessage` | Lock Message |
| Lock Status | `#lockStatus` | Lock Status |
| Admin Company Name | `#adminCompanyName` | কোম্পানির নাম |
| Language Selector | `#languageSelector` | ভাষা সিলেক্টর |

#### 🌐 Splash Screen

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Splash Screen | `#view-lang` | Splash Screen |
| Rotating Welcome | `#rotatingWelcome` | Rotating Text |
| Float Icons | `.float-icons` | Floating Icons |

#### 🎫 Subscription Cards

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Plan Card | `.plan-card` | প্ল্যান কার্ড |
| Sub Status Box | `.sub-status-box` | সাবস্ক্রিপশন স্ট্যাটাস |
| Sub Plan Name | `.sub-plan-name` | প্ল্যান নাম |
| Sub Days Left | `.sub-days-left` | দিন বাকি |
| Sub End Date | `.sub-end-date` | শেষ তারিখ |

#### 🎫 Team Management

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Team Role Pill | `.team-role-pill` | রোল ব্যাজ |
| Manager Pill | `.pill-manager` | Manager |
| Salesman Pill | `.pill-salesman` | Salesman |
| Delivery Boy Pill | `.pill-delivery_boy` | Delivery Boy |
| Dispatch Boy Pill | `.pill-dispatch_boy` | Dispatch Boy |
| Consignor Pill | `.pill-consignor` | Consignor |
| Member Card | `.member-card` | টিম মেম্বার কার্ড |

#### 🎫 Invite System

| Element | Class / ID | Purpose |
|:---|:---|:---|
| Invite Card | `.invite-card` | Invite কার্ড |
| Invite Code Text | `.invite-code-text` | কোড টেক্সট |
| Badge Unused | `.badge-unused` | অব্যবহৃত |
| Badge Used | `.badge-used` | ব্যবহৃত |
| Badge Expired | `.badge-expired` | মেয়াদোত্তীর্ণ |

---

### 🌐 Language System (`i18n.js`)

#### 📚 Language Codes

| Code | Language | Flag |
|:---|:---|:---|
| `bn` | বাংলা | 🇧🇩 |
| `en` | English | 🇬🇧 |
| `hi` | हिन्दी | 🇮🇳 |
| `or` | ଓଡ଼ିଆ | 🇮🇳 |
| `ur` | اردو | 🇵🇰 |
| `gu` | ગુજરાતી | 🇮🇳 |
| `mr` | मराठी | 🇮🇳 |
| `ta` | தமிழ் | 🇮🇳 |
| `te` | తెలుగు | 🇮🇳 |
| `ml` | മലയാളം | 🇮🇳 |

#### 📚 Exported Functions

| Function | Purpose |
|:---|:---|
| `t(key)` | Translation lookup |
| `setLanguage(code)` | ভাষা পরিবর্তন |
| `getLanguage()` | বর্তমান ভাষা |
| `initLanguage()` | ভাষা ইনিশিয়ালাইজ |
| `applyTranslations()` | সব ট্রান্সলেশন প্রয়োগ |
| `autoTagTranslations()` | Auto-tag text |
| `autoTagPlaceholders()` | Auto-tag placeholder |
| `autoTranslateAll()` | সব অটো-ট্রান্সলেট |
| `startMutationObserver()` | Dynamic content observe |

#### 📚 HTML Attributes

| Attribute | Purpose |
|:---|:---|
| `data-t="key"` | ট্রান্সলেশন কী |
| `data-t-placeholder="key"` | Placeholder কী |

---

### 📦 ImgBB & External Services

| Service | Key/URL | Purpose |
|:---|:---|:---|
| ImgBB API | `IMGBB_API_KEY` | ছবি আপলোড |
| ImgBB Upload URL | `https://api.imgbb.com/1/upload` | আপলোড Endpoint |
| Cropper.js CDN | `https://cdn.jsdelivr.net/npm/cropperjs@1.6.1/` | ছবি ক্রপিং |
| html5-qrcode CDN | `https://unpkg.com/html5-qrcode@2.3.8/` | QR স্ক্যানার |
| qrcodejs CDN | `https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/` | QR জেনারেটর |

---

### 📊 Calculation Logic (Summary)

#### Simple Mode (Marble/Granite)
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

**Step 5:** Before adding a new Class/ID, check the "Class & ID Registry" section above.

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
5. Add Item / Quick Add / Finish

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
- Others Mode auto-closes on: Timer End / Panic Button / 30s Inactivity
- Local Storage Draft auto-deletes after **24 hours**
- ImgBB Images are compressed to **WebP (max 800px, ~500KB)**

---

## 📸 Screenshots & Demo

> _Screenshots will be added here as the project evolves._

<!-- 
  স্ক্রিনশট যোগ করার নিয়ম:
  1. ছবি ImgBB-তে আপলোড করুন
  2. নিচের ফরম্যাটে যোগ করুন:
  
  ### 📦 Stock Management
  ![Simple Mode](IMAGE_URL_HERE)
  _Simple Mode: Slab সংখ্যা, Total Sqft, Allowance, Live Calculator_
  
  ![Quick Add](IMAGE_URL_HERE)
  _Quick Add: Design, Quantity, Image, Gallery, Video_
  
  ![Timer Bar](IMAGE_URL_HERE)
  _Others Mode Timer Bar with Slider Drag System_
  
  ### 🎫 Coupon System
  ![Admin Dashboard](IMAGE_URL_HERE)
  
  ![Role Selection](IMAGE_URL_HERE)
-->

---

## 📊 Update Log

## 📊 Update Log

| Date | Time | File | Changes |
|:---|:---|:---|:---|
| 2026-10-09 | 14:30 | `README.md` | Added Update Timeline, Deprecated Classes সেকশন |
| 2026-10-09 | 14:30 | `stock-beta.html` | Others Mode OFF → Cash সম্পূর্ণ বাদ (perUnit হিসাবেও) |
| 2026-10-09 | 14:30 | `stock-beta.html` | `stopOthersMode` → Auto-recalc সব প্রোডাক্ট |
| 2026-10-09 | 14:30 | `stock-beta.html` | Camera/Gallery পিকার (Bottom Sheet) যোগ |
| 2026-10-08 | 18:45 | `stock-beta.html` | Tiles-এ প্রতি পিস লাইন যোগ (Landing + Tax ছাড়া) |
| 2026-10-08 | 18:45 | `stock-beta.html` | Marble/Granite-এ প্রতি sqft (Dynamic Label) |
| 2026-10-08 | 16:20 | `stock-beta.html` | `getCalcBox` ডুপ্লিকেট ফিল্ড পরিষ্কার |
| 2026-10-08 | 12:00 | `stock-beta.html` | Simple Mode-এ Total Sqft, Allowance যোগ |
| 2026-10-07 | 22:00 | `stock-beta.html` | Allowance Profit Calculator |
| 2026-10-07 | 20:00 | `stock-beta.html` | Slider Drag System (Timer Bar) |
| 2026-10-06 | 18:00 | `stock-beta.html` | Quick Add-এ Marble Allowance |
| 2026-10-05 | 15:00 | `stock-beta.html` | `getMarbleTemplateFields` রিস্ট্রাকচার |
| 2026-10-05 | 12:00 | `README.md` | Fresh restructured Master Context |
| 2026-10-04 | 20:00 | `stock-beta.html` | ImgBB + Cropper.js Image Upload |
| 2026-10-04 | 16:00 | `stock-beta.html` | Supplier WhatsApp Field |
| 2026-10-04 | 14:00 | `stock-beta.html` | Smart Button System (Add/Quick/View/Finish) |
| 2026-10-03 | 20:00 | `stock-beta.html` | Local Storage Auto-Save (Draft Protection) |
| 2026-10-03 | 16:00 | `stock-beta.html` | Temporary Buffer + Restore Popup |
| 2026-10-02 | 20:00 | `stock-beta.html` | Slider Drag System for Timer |
| 2026-10-02 | 18:00 | `stock-beta.html` | Others Mode + Timer + Panic Button |
| 2026-10-02 | 14:00 | `README.md` | Master Context রিস্ট্রাকচার |
| 2026-10-02 | 12:00 | `stock-beta.html` | Role Rates, Allowance, Cash Hide/Show |
| 2026-10-01 | 18:00 | `stock-beta.html` | Marble/Granite Transport & Weight Share Fix |


## 🤝 Contributions

This is a **private project** by [@abedulonline-glitch](https://github.com/abedulonline-glitch).

## 📞 Contact

- **GitHub**: [abedulonline-glitch](https://github.com/abedulonline-glitch)
- **WhatsApp**: 9851713487

## 📅 Version History

| Version | Date | Changes |
|:---|:---|:---|
| 3.0 | 2026-10 | Quick Add System, ImgBB Upload, Local Storage Auto-Save, Smart Buttons |
| 2.0 | 2026-10 | Category-First Approach, Marble Simple+Details, Others Mode, Timer |
| 1.0 | 2026-09 | Initial Coupon System |

---

**Made with ❤️ in India By Abedul Mallick**
