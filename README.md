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
| Cash Rate Wrap | `.others-cash-rate-wrap` | Cash রেট সেকশন (Others Mode) |

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

#### 🧮 Simple Mode (Marble/Granite)
| Element | Class / ID | Purpose |
|:---|:---|:---|
| Simple Mode | `#marble-simple-{id}` | Simple Mode কন্টেইনার |
| Simple Tbody | `#simple-tbody-{id}` | Simple Mode টেবিল বডি |
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
| Row ID | `data-row-id` | রো আইডেন্টিফায়ার |

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

#### 🎨 CSS State Classes
| Class | Purpose |
|:---|:---|
| `body.others-mode-active` | Others Mode চালু অবস্থায় |
| `body.others-mode-active .p-optional` | Cash রেট দেখানো |
| `body:not(.others-mode-active) .p-allow-check` | Allowance হাইড |
| `.others-mode-active .calc-details-shutter` | Shutter দেখানো |
| `.calc-details-shutter.open` | Shutter খোলা |
| `.danger` | Timer Danger State |

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

#### 🎨 Subscription Cards
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
| Member Header | `.member-header` | মেম্বার হেডার |
| Member Name | `.member-name` | নাম |
| Member Contact | `.member-contact` | কন্টাক্ট |
| Member Stats | `.member-stats` | স্ট্যাটস |

#### 🎫 Invite System
| Element | Class / ID | Purpose |
|:---|:---|:---|
| Invite Card | `.invite-card` | Invite কার্ড |
| Invite Code Text | `.invite-code-text` | কোড টেক্সট |
| Invite Meta | `.invite-meta` | মেটাডেটা |
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

### 🟣 Super Admin Panel (`super-beta.html`)

#### 🔐 Super Admin
| Element | Class / ID | Purpose |
|:---|:---|:---|
| Super Admin Registration | (Secret Key) | Registration |
| Super Admin Login | (Firebase Auth) | Login |
| Admin List | (Table) | সব কোম্পানি |
| Subscription Requests | (List) | Approve/Reject |
| Trial Management | (Card) | Trial বাড়ানো |
| Revenue Tracking | (Stats) | আয় ট্র্যাকিং |

---

### 🗄️ Firestore Collections

| Collection | Purpose |
|:---|:---|
| `admins` | Admin অ্যাকাউন্ট |
| `invites` | Invite কোড |
| `coupons` | কুপন |
| `customers` | কাস্টমার |
| `transactions` | লেনদেন |
| `withdrawals` | উইথড্রয়াল |
| `subscriptions` | সাবস্ক্রিপশন |
| `stock_entries` | স্টক এন্ট্রি (আগত) |
| `stock_movements` | স্টক মুভমেন্ট (আগত) |
| `categories` | ক্যাটাগরি |
| `super_settings` | Super Admin সেটিংস |

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
