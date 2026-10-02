
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

## 🤝 Contributions

This is a **private project** by [@abedulonline-glitch](https://github.com/abedulonline-glitch).

---

## 📞 Contact

- **GitHub**: [abedulonline-glitch](https://github.com/abedulonline-glitch)
- **WhatsApp**: 9851713487

---

## 📅 Version History

| Version | Date | Changes |
|:---|:---|:---|
| 2.0 | 2026-10 | Category-First Approach, Marble Simple+Details, Others Mode, Timer |
| 1.0 | 2026-09 | Initial Coupon System |

---

**Made with ❤️ in India**
