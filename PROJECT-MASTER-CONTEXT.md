🔴 PART 1: PROJECT-MASTER-CONTEXT.md (শুরু থেকে Tech Stack).
# 🎯 Project Master Context

> **উদ্দেশ্য:** এই ফাইলটি নতুন AI বা নতুন ডেভেলপারকে প্রজেক্টের সম্পূর্ণ ধারণা দেওয়ার জন্য। কেউ যদি এই প্রজেক্টে কাজ করতে চায়, প্রথমে এই ফাইলটি পড়বে।

**Last Updated:** 2026-10-09 14:30  
**Project Version:** 3.5  
**Project Owner:** Abedul Mallick  
**GitHub:** abedulonline-glitch

---

## 📌 প্রজেক্ট কী?

এটি একটি **Multi-Tenant SaaS Platform** — যা কুপন ম্যানেজমেন্ট, স্টক ম্যানেজমেন্ট, মাল্টি-ল্যাঙ্গুয়েজ সাপোর্ট এবং সাবস্ক্রিপশন সিস্টেম সমন্বিত।

**কাদের জন্য?**
- Manufacturers (কুপন ও পণ্য তৈরি)
- Wholesalers (পাইকারি বিক্রেতা)
- Retailers (খুচরা বিক্রেতা)
- Craftsmen / Mistri (কারিগর)
- Customers (গ্রাহক)

---

## 🏗️ প্রজেক্টের কোর আর্কিটেকচার

### ফাইল স্ট্রাকচার
----------------------------------------------------------------------------------------------------------------------------------------
coupon-app/
├── beta.html → Coupon System (Main)
├── stock-beta.html → Stock Management System
├── super-beta.html → Super Admin Panel
├── index.html → Production Version
├── i18n.js → Multi-Language System (10 ভাষা)
├── firebase-config-beta.js → Firebase Configuration (Beta)
├── firebase-config-prod.js → Firebase Configuration (Prod)
├── README.md → Master Documentation
├── AI-HANDOFF-PROTOCOL.md → AI Handoff Rules
└── PROJECT-MASTER-CONTEXT.md → এই ফাইল
---------------------------------------------------------------------------------------------------------------------------------------

### প্রযুক্তি স্ট্যাক

| লেয়ার | টেকনোলজি |
|:---|:---|
| Frontend | Vanilla JavaScript (ES Modules), HTML5, CSS3 |
| Backend | Firebase (Firestore, Auth) |
| Hosting | GitHub Pages (Free) |
| Image Hosting | ImgBB API (Free) |
| Image Cropping | Cropper.js |
| QR Scanner | html5-qrcode |
| QR Generator | qrcodejs |
| Language | Custom i18n (10 ভাষা) |
| খরচ | ₹0 (সম্পূর্ণ ফ্রি) |

---

## 🎯 বর্তমান অবস্থা (Current State)

### ✅ যা কাজ করছে

**Stock Management (`stock-beta.html`):**
- ✅ Category-First Approach
- ✅ Marble/Granite: Simple Mode + Details Mode
- ✅ Tiles/General Template
- ✅ Transport System (Lorry/Container)
- ✅ Free Delivery
- ✅ Live Calculation
- ✅ Role Rates (5 রোল)
- ✅ Others Mode + Timer + Panic Button
- ✅ Slider Drag System
- ✅ Quick Add System
- ✅ Temporary Buffer + Local Storage Auto-Save
- ✅ ImgBB + Cropper.js Image Upload
- ✅ Camera/Gallery Picker (Bottom Sheet)
- ✅ Supplier WhatsApp Field
- ✅ Smart Button System (Add/Quick/View/Finish)
- ✅ Simple Mode (Slab, Total Sqft, Allowance)
- ✅ Allowance Profit Calculator
- ✅ Dynamic Label (Marble → sqft, Tiles → Box)
- ✅ Per Box + Per Piece Display
- ✅ Others Mode OFF → Cash Hide

**Coupon System (`beta.html`):**
- ✅ Admin Registration/Login
- ✅ Team Management (Invite Code)
- ✅ Customer Wallet
- ✅ Subscription System
- ✅ Lock Screen

**Language System (`i18n.js`):**
- ✅ 10 Indian Languages
- ✅ Auto-translate
- ✅ RTL Support

### 🚧 যা কাজ চলছে (In Progress)

- 🔴 Firebase Save (Stock Entry)
- 🔴 Item Rendering System
- 🔴 Staff Attendance System
- 🟡 Godown/Warehouse Management
- 🟡 Stock Movement (Shift/Sale)
- 🟡 Excel Import/Export
- 🟢 POS Billing System
- 🟢 Online Catalog

---

## 📊 গুরুত্বপূর্ণ তথ্য

### Live URLs

| পেজ | URL |
|:---|:---|
| Coupon System | `https://abedulonline-glitch.github.io/coupon-app/beta.html` |
| Stock Management | `https://abedulonline-glitch.github.io/coupon-app/stock-beta.html` |
| Super Admin | `https://abedulonline-glitch.github.io/coupon-app/super-beta.html` |

### Firebase Projects

- **Beta:** `CouponSystem-Beta`
- **Production:** `CouponSystem`

### GitHub Repository

- Repository: `abedulonline-glitch/coupon-app`
- Branch: `main`
- Folder: `/ (root)`

------------------------------------------------------------------------------------------------------------------------------------
🔴 PART 2: Stock Management Deep Dive + Coupon System + Data Structures + Rules
## 📦 Stock Management — Deep Dive

### 🎯 Stock Calculation Logic (Marble/Granite)

#### Simple Mode:

-----------
Total Paper = Original Sqft (ইউজারের ইনপুট)
Total Actual = Total Paper + Allowance
Total Weight = Total Paper × ওজন/sqft
পাকা Amount = Total Paper × পাকা রেট
Cash Amount = Total Paper × Cash রেট (শুধু Others Mode ON)
GST = পাকা Amount × GST%
Allowance Profit = Allowance × পাকা রেট
Total Landing = পাকা + Cash + GST + Transport + Extra
-------------------

#### Details Mode:
--------------------
প্রতি Row Paper = (Length/12) × (Width/12) × Qty
প্রতি Row Actual = ((Length+L-Allow)/12) × ((Width+W-Allow)/12) × Qty
Total Paper = সব Row-এর Paper যোগ
Total Actual = সব Row-এর Actual যোগ
--------------------

### 🎯 Stock Calculation Logic (Tiles/General)

#### Box Mode:
-------------------
Total Weight = Quantity × Weight/Box
পাকা Amount = Quantity × পাকা রেট/Box
Cash Amount = Quantity × Cash রেট/Box (Others Mode ON)
-------------------

#### Sqft Mode:
-------------------
Total Weight = Quantity × Weight/Box
পাকা Amount = Quantity × Sqft/Box × পাকা রেট/sqft
Cash Amount = Quantity × Sqft/Box × Cash রেট/sqft (Others Mode ON)
------------------

### 🎯 Per Unit Display Rules

| Category | Primary Unit | Secondary Unit |
|:---|:---|:---|
| Marble/Granite | 📄 প্রতি sqft | ❌ |
| Tiles | 📦 প্রতি বক্স | 🔢 প্রতি পিস |

**Formula:**
- Per Box (Landing) = Total Landing / Quantity
- Per Piece (Landing) = Total Landing / (Quantity × Pieces/Box)

### 🎯 Others Mode Rules

**Others Mode ON (Cash দৃশ্যমান):**
- Cash Amount = স্বাভাবিক হিসাব
- Total Landing = Cash সহ
- Per Unit = Cash সহ

**Others Mode OFF (Cash গোপন):**
- Cash Amount = 0
- Total Landing = Cash ছাড়া
- Per Unit = Cash ছাড়া
- Label/UI অপরিবর্তিত

### 🎯 Transport Logic
--------------------
Transport Rate (₹/টন) × Paper Weight (kg) / 1000
Container হলে: GST Adjustment (Effective Rate)
Free Delivery হলে: Transport = ₹0 (🎁 ফ্রি)
------------------------

### 🎯 Extra Cost Logic (Weight Proportion)
---------------------------
Extra Per Product = (Total Extra / Truck Weight) × Product Weight
যেখানে: Total Extra = Loading + Unloading + Insurance + Others + Optional
---------------------------

---

## 🎫 Coupon System — Deep Dive

### 🎯 Subscription Plans

| Plan | Monthly | Coupon Limit | Customer Limit |
|:---|:---|:---|:---|
| Trial | Free | 100 | 50 |
| Starter | ₹300 | 500 | 200 |
| Pro | ₹800 | 5,000 | 2,000 |
| Enterprise | ₹2,000+ | Unlimited | Unlimited |

### 🎯 Team Roles (5 Types)

| Role | Code | Permission |
|:---|:---|:---|
| Manager | MGR | সব Access |
| Salesman | SLS | Coupon Sell |
| Delivery Boy | DLV | Delivery Only |
| Dispatch Boy | DSP | Dispatch Only |
| Consignor | CNS | Consignment |

### 🎯 Invite Code Format
-------------------------------
{COMPANY_CODE}-{ROLE_CODE}-{4_DIGIT}
যেমন: KOH-MGR-4829

Single-use (একবার ব্যবহার)

Expiry Date সহ

Expire হলে New Invite Code তৈরি করতে হবে
----------------------

### 🎯 Customer Wallet Flow
-----------------------
1.Admin Unique Link শেয়ার করে: beta.html?admin=ADMIN_ID

2.Customer Mobile Number দিয়ে Register করে

3.Coupon QR Scan করে Points অর্জন করে

4.Wallet থেকে Withdrawal Request করে (Super Admin Approve করে)
------------------------------

---

## 🗄️ Data Structures

### Firestore Collections

| Collection | Purpose | Key Fields |
|:---|:---|:---|
| `admins` | Admin অ্যাকাউন্ট | id, email, company, role, subscription, roleDefaults, vaultInfo |
| `invites` | Invite Codes | code, role, used, expiry |
| `coupons` | Coupons | code, grade, status, customerId |
| `customers` | Customers | phone, adminId, walletBalance |
| `transactions` | Transactions | type, amount, timestamp |
| `withdrawals` | Withdrawals | customerId, amount, status |
| `subscriptions` | Subscription Requests | plan, screenshot, status |
| `stock_entries` | Stock Entries (Planned) | stockId, adminId, supplier, products[], transport, extraCosts |
| `stock_movements` | Stock Movements (Planned) | fromLocation, toLocation, type, userId |
| `categories` | Categories | adminId, businessType, name |
| `super_settings` | Super Admin | role_defaults |

### 📋 Stock Entry Document Structure (Planned)

```javascript
{
  stockId: "ABD-2026-0001",
  adminId: "xyz123",
  
  supplier: {
    name: "Gujarat Tiles",
    whatsapp: "9876543210",
    gst: "24AAAAA0000A1Z5",
    invoiceNo: "INV-2026-001",
    purchaseDate: "2026-10-03"
  },
  
  transport: {
    source: "import",
    method: "container",
    rate: 4800,
    truckWeight: 30000,
    containerGst: 18
  },
  
  extraCosts: {
    loading: 200,
    unloading: 300,
    insurance: 200,
    others: 400,
    optional: 1000
  },
  
  products: [
    {
      productId: "PRD-001",
      _localId: "local_xxx",
      name: "Marble Cutpic",
      category: "Marble",
      brand: "Arna",
      hsn: "6802",
      gst: 18,
      size: "24x24",
      piecesPerBox: 55,
      sqftPerBox: 4.0,
      weightPerBox: 27,
      boxes: 10,
      pakkaRate: 30,
      cashRate: 40,
      tags: ["marble", "premium"],
      images: {
        main: "https://i.ibb.co/.../main.webp",
        gallery: ["url1", "url2"],
        video: "youtube_url"
      },
      location: { godown: "Main", lane: "L-3" },
      roleRates: { stocker: 108, wholesaler: 113, ... },
      status: "in_stock"
    }
  ],
  
  globalRoleRates: { stocker: 5, wholesaler: 10, ... },
  createdAt: Timestamp,
  createdBy: "userId",
  status: "active"
}
-------------------------------------
📜 Development Rules (অপরিবর্তনীয় নিয়ম)
✅ যা করতে হবে
1.README.md পড়া বাধ্যতামূলক — নতুন কাজ শুরু করার আগে

2.Class/ID ডুপ্লিকেট নয় — নতুন যোগ করার আগে Registry চেক

3.Step-by-Step কোড — Part 1, Part 2 আকারে

4.Test প্রতিটি Step — Commit করার আগে

5.SUMMARY দিতে হবে — কাজ শেষে README আপডেটের জন্য

6.Deprecated Class রাখতে হবে — ডিলিট করলেও README-তে সংরক্ষণ

7.Language Support — সব নতুন Text data-t দিয়ে যোগ করতে হবে

8.Free-First Approach — সব সেবা ফ্রি হতে হবে

9.Mobile-First Design — মোবাইলে পারফেক্ট দেখাতে হবে

10.Console Log রাখতে হবে — Debug-এর জন্য

❌ যা করা যাবে না
1.Firebase Storage ব্যবহার নয় — ImgBB ব্যবহার করতে হবে (খরচ)

2.Class/ID Duplicate নয় — আগে চেক করতে হবে

3.Hard-coded Bengali নয় — i18n ব্যবহার করতে হবে

4.Production এ Commit নয় — সব কাজ Beta-তে

5.একবারে পুরো কোড নয় — Step-by-Step

6.Testing ছাড়া Commit নয় — প্রতিটি ধাপ টেস্ট করতে হবে

7.README Update ছাড়া বড় ফিচার নয় — প্রতিটি বড় কাজে README আপডেট

🎨 Design System
Colors
Color	Hex	Usage
🟢 Green	#0f9d58	Success, Add, Confirm
🔴 Red	#d93025	Danger, Delete, Panic
🔵 Blue	#1a73e8	Primary, Info
🟡 Yellow	#f9a825	Others Mode, Warning
🟣 Purple	#7b1fa2	Vault, Super Admin
🟠 Orange	#f57c00	Allowance
🟤 Brown	#b06000	Cash Labels
Typography
Font: Segoe UI, Arial, sans-serif

Sizes: 11px (small), 13px (normal), 15px (heading), 18px (large)

Weight: 400 (normal), 600 (semibold), 700 (bold)

🌐 Language System
10 Indian Languages
Code	Language	Flag
bn	বাংলা	🇧🇩
en	English	🇬🇧
hi	हिन्दी	🇮🇳
or	ଓଡ଼ିଆ	🇮🇳
ur	اردو	🇵🇰
gu	ગુજરાતી	🇮🇳
mr	मराठी	🇮🇳
ta	தமிழ்	🇮🇳
te	తెలుగు	🇮🇳
ml	മലയാളം	🇮🇳
-------------------------------------------------------------------------------------------------------------------------------------
<span data-t="key_name">Default Text</span>
<input data-t-placeholder="key_name" placeholder="Default">
---------------------------------------------------------------------------------------------------------------------------------
import { t } from './i18n.js';
element.innerText = t('key_name');
--------------------------------------------------------------------------------------------------------------------------------------+

**বিস্তারিত:** দেখুন `AI-HANDOFF-PROTOCOL.md` ফাইল।

---

## 🗺️ Roadmap (Future Development)

### 🔴 Priority 1 — জরুরি (Next 2-4 Weeks)

| # | ফিচার | সময় | স্ট্যাটাস |
|:---|:---|:---|:---|
| ১ | **Firebase Save (Stock Entry)** | ৩-৪ দিন | 🔴 পরিকল্পিত |
| ২ | **Item Rendering System** | ২-৩ দিন | 🔴 পরিকল্পিত |
| ৩ | **Staff Attendance System** | ৩-৪ দিন | 🔴 পরিকল্পিত |
| ৪ | **Godown/Warehouse Management** | ৫-৭ দিন | 🔴 পরিকল্পিত |

### 🟡 Priority 2 — জরুরি (1-2 Months)

| # | ফিচার | সময় | স্ট্যাটাস |
|:---|:---|:---|:---|
| ৫ | **Stock Movement (Shift/Sale)** | ২-৩ দিন | 🟡 পরিকল্পিত |
| ৬ | **Stock List View (Table)** | ৩-৪ দিন | 🟡 পরিকল্পিত |
| ৭ | **Excel Import/Export** | ২-৩ দিন | 🟡 পরিকল্পিত |
| ৮ | **Category Default Role Rates** | ১-২ দিন | 🟡 পরিকল্পিত |

### 🟢 Priority 3 — ভবিষ্যতের (3-6 Months)

| # | ফিচার | সময় | স্ট্যাটাস |
|:---|:---|:---|:---|
| ৯ | **POS Billing System** | ৫-৭ দিন | 🟢 পরিকল্পিত |
| ১০ | **Online Catalog (E-commerce)** | ৭-১০ দিন | 🟢 পরিকল্পিত |
| ১১ | **Barcode/QR Scan** | ২-৩ দিন | 🟢 পরিকল্পিত |
| ১২ | **Voice Input** | ২-৩ দিন | 🟢 পরিকল্পিত |
| ১৩ | **Dashboard Analytics** | ৫-৭ দিন | 🟢 পরিকল্পিত |
| ১৪ | **Mobile Typography Optimization** | ১-২ দিন | 🟢 পরিকল্পিত |

---

## 👥 User Roles (12 Total)

| # | Role | Type | Registration |
|:---|:---|:---|:---|
| 1 | Super Admin | Platform Owner | Secret Key |
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

### Current Pricing

| Plan | Monthly | Coupon Limit | Customer Limit |
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

## 📝 Important Notes

### Development Rules
- সব নতুন ফিচার **README-তে যোগ করতে হবে**
- Class/ID **ডুপ্লিকেট করা যাবে না**
- কোড **Step-by-Step** দিতে হবে
- প্রতিটি Step **টেস্ট করতে হবে**
- **Others Mode OFF → Cash Hide** (নিরাপত্তা)

### Technical Notes
- Marble/Granite measurements **inches** এ (auto-converts to feet)
- সব monetary values **₹ (Indian Rupees)**
- Free Delivery checkbox **Transport Section লুকায়**
- Container transport **GST Tax Benefit** হিসাব করে
- Cash/Optional fields **Others Mode-এই দেখা যায়**
- Others Mode auto-closes on: Timer End / Panic / 30s Inactivity
- Local Storage Draft **24 ঘণ্টা পর** auto-delete
- ImgBB Images **WebP (max 800px, ~500KB)**

### Cost-Saving Notes
- **Firebase Storage ব্যবহার নয়** → ImgBB API (ফ্রি)
- **Firebase Firestore** Free Tier (৫০K reads, ২০K writes/day)
- **GitHub Pages** (ফ্রি হোস্টিং)
- **Total Project Cost: ₹0**

---

## 📞 Contact & Contribution

### Project Owner
- **Name:** Abedul Mallick
- **GitHub:** [abedulonline-glitch](https://github.com/abedulonline-glitch)
- **WhatsApp:** 9851713487

### Repository
- **URL:** https://github.com/abedulonline-glitch/coupon-app
- **Branch:** `main`
- **Type:** Private Project

### License
This is a **private project** — সব অধিকার সংরক্ষিত।

---

## 📊 Version History

| Version | Date | Highlights |
|:---|:---|:---|
| **3.5** | 2026-10-09 | Others Mode OFF → Cash Hide, Camera/Gallery Picker, Per Box+Piece, Deprecated Section |
| **3.4** | 2026-10-08 | Tiles Per Piece, Marble Per Sqft, Dynamic Label |
| **3.3** | 2026-10-05 | Simple Mode, Total Sqft, Allowance, README Restructure |
| **3.2** | 2026-10-04 | Quick Add, ImgBB Upload, Supplier WhatsApp |
| **3.1** | 2026-10-03 | Local Storage Auto-Save, Temporary Buffer |
| **3.0** | 2026-10-02 | Others Mode, Timer, Panic Button, Slider Drag |
| **2.0** | 2026-10-01 | Category-First, Marble Simple+Details |
| **1.0** | 2026-09 | Initial Coupon System |

---

## 🔗 Related Files

| ফাইল | উদ্দেশ্য |
|:---|:---|
| `README.md` | Master Documentation (Class/ID Registry, Update Log) |
| `AI-HANDOFF-PROTOCOL.md` | নতুন AI-এর জন্য Handoff Rules |
| `PROJECT-MASTER-CONTEXT.md` | এই ফাইল — প্রজেক্টের সম্পূর্ণ ধারণা |

---

## ⏰ Last Updated Information

**এই ফাইলটি সর্বশেষ আপডেট:** 2026-10-09 14:30  
**পরবর্তী রিভিউ:** 2026-10-16  
**Version:** 3.5

> **📌 নোট:** এই ফাইলে কোনো বড় পরিবর্তন হলে, `README.md`-এর Update Log-এ যোগ করতে হবে এবং `Update Timeline` আপডেট করতে হবে।

---

**Made with ❤️ in India By Abedul Mallick**

**🚀 Multi-Tenant SaaS Platform — Coupon + Stock Management**

**💰 Total Cost: ₹0 (সম্পূর্ণ ফ্রি)**

