// ============================================================
// i18n.js - Smart Multi-Language System (v2)
// ১০টি ভাষা: বাংলা, English, हिन्दी, ଓଡ଼ିଆ, اردو, ગુજરાતી,
//              मराठी, தமிழ், తెలుగు, മലയാളം
// ============================================================

export const LANGUAGES = [
  { code: 'bn', name: 'বাংলা',    flag: '🇧🇩' },
  { code: 'en', name: 'English',  flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी',    flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ',     flag: '🇮🇳' },
  { code: 'ur', name: 'اردو',     flag: '🇵🇰' },
  { code: 'gu', name: 'ગુજરાતી',   flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी',     flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்',     flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు',    flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം',   flag: '🇮🇳' }
];

export const translations = {

  // ============================================================
  // 🇧🇩 বাংলা (Bengali) — সম্পূর্ণ Dictionary
  // ============================================================
  bn: {
    // ===== Navigation =====
    home: "হোম", coupons: "কুপন", users: "ইউজার", withdraw: "প্রত্যাহার",
    plan: "প্ল্যান", settings: "সেটিংস", profile: "প্রোফাইল",
    scan: "স্ক্যান", wallet: "ওয়ালেট", dashboard: "ড্যাশবোর্ড",
    logout: "লগআউট", login: "লগইন", register: "রেজিস্ট্রেশন",
    
    // ===== Auth =====
    email: "ইমেইল", password: "পাসওয়ার্ড", 
    confirm_password: "পাসওয়ার্ড নিশ্চিত করুন",
    forgot_password: "পাসওয়ার্ড ভুলে গেছেন?",
    login_btn: "লগইন", register_btn: "রেজিস্ট্রেশন",
    reset_password: "পাসওয়ার্ড রিসেট করুন",
    send_reset_link: "রিসেট লিংক পাঠান",
    
    // ===== Register =====
    who_are_you: "আপনি কে?",
    company_name: "কোম্পানির নাম",
    your_name: "আপনার নাম",
    whatsapp_number: "হোয়াটসঅ্যাপ নাম্বার",
    admin_owner: "ব্যবসার মালিক", manufacturer: "উৎপাদনকারী",
    wholesaler: "পাইকার", retailer: "খুচরা বিক্রেতা",
    mistri: "কারিগর", customer: "গ্রাহক",
    invite_code_option: "আমার Invite Code আছে",
    invite_code: "Invite Code",
    verify_code: "কোড যাচাই করুন",
    back: "পিছনে যান",
    
    // ===== Dashboard =====
    total_coupons: "মোট কুপন", used_coupons: "ব্যবহৃত",
    customers: "কাস্টমার", pending: "অপেক্ষমাণ",
    active: "সক্রিয়", trial: "ট্রায়াল", expired: "মেয়াদ শেষ",
    no_subscription: "কোনো সাবস্ক্রিপশন নেই",
    subscription_ended: "সাবস্ক্রিপশন শেষ",
    
    // ===== Share =====
    share_link: "কাস্টমারদের সাথে লিংক শেয়ার করুন",
    share_hint: "এই লিংক কাস্টমারদের পাঠান। তারা এখান থেকে রেজিস্ট্রেশন করবে।",
    copy_link: "লিংক কপি করুন",
    share_whatsapp: "হোয়াটসঅ্যাপে শেয়ার করুন",
    copied: "কপি হয়েছে!",
    
    // ===== Grades =====
    grades_prices: "গ্রেড ও মূল্য",
    no_grades: "কোনো গ্রেড নেই",
    grade_placeholder: "গ্রেড (যেমন T1 20Kg)",
    price_placeholder: "মূল্য",
    add: "যোগ করুন",
    
    // ===== Coupons =====
    generate_coupons: "কুপন তৈরি করুন",
    select_grade: "গ্রেড সিলেক্ট",
    quantity: "পরিমাণ",
    expiry: "মেয়াদ",
    generate_btn: "তৈরি করুন",
    recent_batch: "সাম্প্রতিক ব্যাচ",
    no_coupons: "এখনো কুপন নেই",
    print: "প্রিন্ট",
    download_pdf: "PDF ডাউনলোড",
    code: "কোড",
    
    // ===== Team =====
    team_management: "টিম ম্যানেজমেন্ট",
    team_management_hint: "নতুন কর্মী যোগ করতে Invite Code তৈরি করুন।",
    role_select: "রোল সিলেক্ট করুন",
    expiry_days: "কোডের মেয়াদ (দিন)",
    generate_code: "কোড তৈরি করুন",
    your_codes: "আপনার কোডগুলো",
    your_team: "আপনার টিম মেম্বার",
    no_team_member: "এখনো কোনো টিম মেম্বার নেই",
    no_codes: "এখনো কোনো কোড তৈরি করা হয়নি",
    manager: "ম্যানেজার", salesman: "সেলসম্যান",
    delivery_boy: "ডেলিভারি বয়", dispatch_boy: "ডিসপ্যাচ বয়",
    consignor: "কনসাইনার",
    unused: "অব্যবহৃত", used: "ব্যবহৃত",
    suspended: "সাসপেন্ডেড",
    coupon_redeemed: "কুপন রিডিম",
    total_points: "মোট পয়েন্ট",
    joined: "যোগদান",
    
    // ===== Settings =====
    company_settings: "কোম্পানির সেটিংস",
    helpline: "হেল্পলাইন",
    footer_text: "ফুটার টেক্সট",
    withdrawal_min: "ন্যূনতম প্রত্যাহার (₹)",
    language: "ভাষা",
    save: "সেভ করুন",
    save_success: "সেভ হয়েছে!",
    
    // ===== Subscription =====
    your_subscription: "আপনার সাবস্ক্রিপশন",
    upgrade: "আপগ্রেড করুন",
    upgrade_hint: "আপনার প্রয়োজন অনুযায়ী প্ল্যান সিলেক্ট করুন",
    days_left: "দিন",
    next_renew: "পরবর্তী রিনিউ",
    renew: "রিনিউ করুন",
    buy_plan: "প্ল্যান কিনুন",
    view_plans: "প্ল্যান দেখুন এবং কিনুন",
    buy_subscription: "সাবস্ক্রিপশন কিনুন",
    scan_qr_hint: "QR কোড স্ক্যান করে টাকা পাঠান",
    or_pay_to_upi: "অথবা এই UPI আইডিতে পাঠান",
    upload_screenshot: "পেমেন্টের স্ক্রিনশট আপলোড করুন",
    upi_reference: "UPI Reference / Transaction ID",
    submit_request: "অনুরোধ জমা দিন",
    pending_requests: "অপেক্ষমাণ অনুরোধ",
    no_requests: "কোনো অনুরোধ নেই",
    approved: "অনুমোদিত", rejected: "প্রত্যাখ্যাত",
    approve: "অনুমোদন", reject: "প্রত্যাখ্যান",
    subscription_request: "সাবস্ক্রিপশন অনুরোধ",
    
    // ===== Wallet =====
    your_balance: "আপনার ব্যালেন্স",
    recent_txn: "সাম্প্রতিক লেনদেন",
    no_txn: "কোনো লেনদেন নেই",
    phone: "মোবাইল নাম্বার",
    upi_id: "UPI আইডি",
    request_withdraw: "প্রত্যাহার অনুরোধ",
    minimum_withdraw: "ন্যূনতম প্রত্যাহার",
    
    // ===== Scan =====
    scan_coupon: "কুপন স্ক্যান করুন",
    stop_scan: "স্ক্যানার বন্ধ করুন",
    manual_entry: "ম্যানুয়াল এন্ট্রি",
    redeem: "রিডিম করুন",
    coupon_code: "কুপন কোড",
    customer_phone: "কাস্টমারের ফোন নাম্বার",
    
    // ===== Profile =====
    my_profile: "আমার প্রোফাইল",
    name: "নাম", company: "কোম্পানি",
    role: "রোল",
    whatsapp: "হোয়াটসঅ্যাপ",
    
    // ===== Subscription Lock =====
    no_subscription_msg: "আপনি এখনো কোনো প্ল্যান কেনেননি। প্যানেলে প্রবেশ করতে একটি প্ল্যান কিনুন।",
    subscription_ended_msg: "আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে। চালিয়ে যেতে আবার রিনিউ করুন।",
    current_subscription: "আপনার বর্তমান সাবস্ক্রিপশন",
    status: "স্ট্যাটাস",
    expiry_date: "মেয়াদ শেষ",
    
    // ===== Common =====
    loading: "লোড হচ্ছে...",
    success: "সফল!",
    error: "এরর",
    please_wait: "অপেক্ষা করুন...",
    are_you_sure: "আপনি নিশ্চিত?",
    delete_success: "মুছে ফেলা হয়েছে!",
    invalid_phone: "সঠিক ১০ ডিজিটের নাম্বার দিন",
    invalid_email: "সঠিক ইমেইল দিন",
    weak_password: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর",
    password_mismatch: "পাসওয়ার্ড দুইটি মিলছে না",
    fill_all_fields: "সব তথ্য দিন",
    welcome: "স্বাগতম",
    your_role: "আপনার ভূমিকা",
    start: "শুরু করুন",
    cancel: "বাতিল",
    confirm: "নিশ্চিত করুন",
    close: "বন্ধ করুন",
    yes: "হ্যাঁ", no: "না",
    ok: "ঠিক আছে"
  },

  // ============================================================
  // 🇬🇧 English
  // ============================================================
  en: {
    home: "Home", coupons: "Coupons", users: "Users", withdraw: "Withdraw",
    plan: "Plan", settings: "Settings", profile: "Profile",
    scan: "Scan", wallet: "Wallet", dashboard: "Dashboard",
    logout: "Logout", login: "Login", register: "Register",
    email: "Email", password: "Password",
    confirm_password: "Confirm Password",
    forgot_password: "Forgot Password?",
    login_btn: "Login", register_btn: "Register",
    reset_password: "Reset Password",
    send_reset_link: "Send Reset Link",
    who_are_you: "Who are you?",
    company_name: "Company Name",
    your_name: "Your Name",
    whatsapp_number: "WhatsApp Number",
    admin_owner: "Business Owner", manufacturer: "Manufacturer",
    wholesaler: "Wholesaler", retailer: "Retailer",
    mistri: "Craftsman", customer: "Customer",
    invite_code_option: "I have an Invite Code",
    invite_code: "Invite Code",
    verify_code: "Verify Code",
    back: "Go Back",
    total_coupons: "Total Coupons", used_coupons: "Used",
    customers: "Customers", pending: "Pending",
    active: "Active", trial: "Trial", expired: "Expired",
    no_subscription: "No Subscription",
    subscription_ended: "Subscription Ended",
    share_link: "Share Link with Customers",
    share_hint: "Send this link to customers. They'll register from here.",
    copy_link: "Copy Link",
    share_whatsapp: "Share on WhatsApp",
    copied: "Copied!",
    grades_prices: "Grades & Prices",
    no_grades: "No grades yet",
    grade_placeholder: "Grade (e.g. T1 20Kg)",
    price_placeholder: "Price",
    add: "Add",
    generate_coupons: "Generate Coupons",
    select_grade: "Select Grade",
    quantity: "Quantity",
    expiry: "Expiry",
    generate_btn: "Generate",
    recent_batch: "Recent Batch",
    no_coupons: "No coupons yet",
    print: "Print",
    download_pdf: "Download PDF",
    code: "Code",
    team_management: "Team Management",
    team_management_hint: "Create Invite Code to add new staff.",
    role_select: "Select Role",
    expiry_days: "Code Expiry (days)",
    generate_code: "Generate Code",
    your_codes: "Your Codes",
    your_team: "Your Team Members",
    no_team_member: "No team members yet",
    no_codes: "No codes created yet",
    manager: "Manager", salesman: "Salesman",
    delivery_boy: "Delivery Boy", dispatch_boy: "Dispatch Boy",
    consignor: "Consignor",
    unused: "Unused", used: "Used",
    suspended: "Suspended",
    coupon_redeemed: "Coupons Redeemed",
    total_points: "Total Points",
    joined: "Joined",
    company_settings: "Company Settings",
    helpline: "Helpline",
    footer_text: "Footer Text",
    withdrawal_min: "Minimum Withdrawal (₹)",
    language: "Language",
    save: "Save",
    save_success: "Saved!",
    your_subscription: "Your Subscription",
    upgrade: "Upgrade",
    upgrade_hint: "Select a plan as per your need",
    days_left: "days",
    next_renew: "Next Renew",
    renew: "Renew",
    buy_plan: "Buy Plan",
    view_plans: "View Plans & Buy",
    buy_subscription: "Buy Subscription",
    scan_qr_hint: "Scan the QR code to pay",
    or_pay_to_upi: "Or pay to this UPI ID",
    upload_screenshot: "Upload Payment Screenshot",
    upi_reference: "UPI Reference / Transaction ID",
    submit_request: "Submit Request",
    pending_requests: "Pending Requests",
    no_requests: "No requests",
    approved: "Approved", rejected: "Rejected",
    approve: "Approve", reject: "Reject",
    subscription_request: "Subscription Request",
    your_balance: "Your Balance",
    recent_txn: "Recent Transactions",
    no_txn: "No transactions",
    phone: "Phone Number",
    upi_id: "UPI ID",
    request_withdraw: "Request Withdrawal",
    minimum_withdraw: "Minimum Withdrawal",
    scan_coupon: "Scan Coupon",
    stop_scan: "Stop Scanner",
    manual_entry: "Manual Entry",
    redeem: "Redeem",
    coupon_code: "Coupon Code",
    customer_phone: "Customer Phone",
    my_profile: "My Profile",
    name: "Name", company: "Company",
    role: "Role",
    whatsapp: "WhatsApp",
    no_subscription_msg: "You haven't bought any plan yet. Buy a plan to access the panel.",
    subscription_ended_msg: "Your subscription has expired. Please renew to continue.",
    current_subscription: "Your Current Subscription",
    status: "Status",
    expiry_date: "Expiry Date",
    loading: "Loading...",
    success: "Success!",
    error: "Error",
    please_wait: "Please wait...",
    are_you_sure: "Are you sure?",
    delete_success: "Deleted!",
    invalid_phone: "Enter valid 10-digit number",
    invalid_email: "Enter valid email",
    weak_password: "Password min 6 characters",
    password_mismatch: "Passwords do not match",
    fill_all_fields: "Fill all fields",
    welcome: "Welcome",
    your_role: "Your Role",
    start: "Get Started",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    yes: "Yes", no: "No",
    ok: "OK"
  },

  // ============================================================
  // 🇮🇳 हिन्दी (Hindi)
  // ============================================================
  hi: {
    home: "होम", coupons: "कूपन", users: "उपयोगकर्ता", withdraw: "निकासी",
    plan: "प्लान", settings: "सेटिंग्स", profile: "प्रोफ़ाइल",
    scan: "स्कैन", wallet: "वॉलेट", dashboard: "डैशबोर्ड",
    logout: "लॉगआउट", login: "लॉगिन", register: "रजिस्टर",
    email: "ईमेल", password: "पासवर्ड",
    confirm_password: "पासवर्ड की पुष्टि करें",
    forgot_password: "पासवर्ड भूल गए?",
    login_btn: "लॉगिन", register_btn: "रजिस्टर",
    reset_password: "पासवर्ड रीसेट करें",
    send_reset_link: "रीसेट लिंक भेजें",
    who_are_you: "आप कौन हैं?",
    company_name: "कंपनी का नाम",
    your_name: "आपका नाम",
    whatsapp_number: "व्हाट्सएप नंबर",
    admin_owner: "व्यवसाय के मालिक", manufacturer: "निर्माता",
    wholesaler: "थोक विक्रेता", retailer: "खुदरा विक्रेता",
    mistri: "कारीगर", customer: "ग्राहक",
    invite_code_option: "मेरे पास इनवाइट कोड है",
    invite_code: "इनवाइट कोड",
    verify_code: "कोड सत्यापित करें",
    back: "पीछे जाएं",
    total_coupons: "कुल कूपन", used_coupons: "उपयोग किए",
    customers: "ग्राहक", pending: "लंबित",
    active: "सक्रिय", trial: "परीक्षण", expired: "समाप्त",
    no_subscription: "कोई सदस्यता नहीं",
    subscription_ended: "सदस्यता समाप्त",
    share_link: "ग्राहकों के साथ लिंक साझा करें",
    share_hint: "यह लिंक ग्राहकों को भेजें। वे यहाँ से रजिस्टर करेंगे।",
    copy_link: "लिंक कॉपी करें",
    share_whatsapp: "व्हाट्सएप पर साझा करें",
    copied: "कॉपी हो गया!",
    grades_prices: "ग्रेड और मूल्य",
    no_grades: "कोई ग्रेड नहीं",
    grade_placeholder: "ग्रेड (जैसे T1 20Kg)",
    price_placeholder: "मूल्य",
    add: "जोड़ें",
    generate_coupons: "कूपन बनाएं",
    select_grade: "ग्रेड चुनें",
    quantity: "मात्रा",
    expiry: "समाप्ति",
    generate_btn: "बनाएं",
    recent_batch: "हाल का बैच",
    no_coupons: "अभी कोई कूपन नहीं",
    print: "प्रिंट",
    download_pdf: "PDF डाउनलोड",
    code: "कोड",
    team_management: "टीम प्रबंधन",
    team_management_hint: "नया स्टाफ जोड़ने के लिए Invite Code बनाएं।",
    role_select: "भूमिका चुनें",
    expiry_days: "कोड समाप्ति (दिन)",
    generate_code: "कोड बनाएं",
    your_codes: "आपके कोड",
    your_team: "आपके टीम सदस्य",
    no_team_member: "अभी कोई टीम सदस्य नहीं",
    no_codes: "अभी कोई कोड नहीं बनाया",
    manager: "मैनेजर", salesman: "सेल्समैन",
    delivery_boy: "डिलीवरी बॉय", dispatch_boy: "डिस्पैच बॉय",
    consignor: "कंसाइनर",
    unused: "अप्रयुक्त", used: "प्रयुक्त",
    suspended: "निलंबित",
    coupon_redeemed: "कूपन भुनाए",
    total_points: "कुल अंक",
    joined: "जुड़े",
    company_settings: "कंपनी सेटिंग्स",
    helpline: "हेल्पलाइन",
    footer_text: "फुटर टेक्स्ट",
    withdrawal_min: "न्यूनतम निकासी (₹)",
    language: "भाषा",
    save: "सेव करें",
    save_success: "सेव हो गया!",
    your_subscription: "आपकी सदस्यता",
    upgrade: "अपग्रेड करें",
    upgrade_hint: "अपनी आवश्यकता के अनुसार प्लान चुनें",
    days_left: "दिन",
    next_renew: "अगली नवीनीकरण",
    renew: "नवीनीकरण",
    buy_plan: "प्लान खरीदें",
    view_plans: "प्लान देखें और खरीदें",
    buy_subscription: "सदस्यता खरीदें",
    scan_qr_hint: "भुगतान के लिए QR कोड स्कैन करें",
    or_pay_to_upi: "या इस UPI ID पर भुगतान करें",
    upload_screenshot: "भुगतान स्क्रीनशॉट अपलोड करें",
    upi_reference: "UPI संदर्भ / ट्रांजैक्शन ID",
    submit_request: "अनुरोध भेजें",
    pending_requests: "लंबित अनुरोध",
    no_requests: "कोई अनुरोध नहीं",
    approved: "स्वीकृत", rejected: "अस्वीकृत",
    approve: "स्वीकारें", reject: "अस्वीकारें",
    subscription_request: "सदस्यता अनुरोध",
    your_balance: "आपका बैलेंस",
    recent_txn: "हाल के लेनदेन",
    no_txn: "कोई लेनदेन नहीं",
    phone: "फ़ोन नंबर",
    upi_id: "UPI ID",
    request_withdraw: "निकासी का अनुरोध",
    minimum_withdraw: "न्यूनतम निकासी",
    scan_coupon: "कूपन स्कैन करें",
    stop_scan: "स्कैनर बंद करें",
    manual_entry: "मैन्युअल एंट्री",
    redeem: "रिडीम करें",
    coupon_code: "कूपन कोड",
    customer_phone: "ग्राहक का फ़ोन",
    my_profile: "मेरी प्रोफ़ाइल",
    name: "नाम", company: "कंपनी",
    role: "भूमिका",
    whatsapp: "व्हाट्सएप",
    no_subscription_msg: "आपने अभी तक कोई प्लान नहीं खरीदा है। पैनल का उपयोग करने के लिए एक प्लान खरीदें।",
    subscription_ended_msg: "आपकी सदस्यता समाप्त हो गई है। जारी रखने के लिए कृपया नवीनीकरण करें।",
    current_subscription: "आपकी वर्तमान सदस्यता",
    status: "स्थिति",
    expiry_date: "समाप्ति तिथि",
    loading: "लोड हो रहा है...",
    success: "सफल!",
    error: "त्रुटि",
    please_wait: "कृपया प्रतीक्षा करें...",
    are_you_sure: "क्या आप निश्चित हैं?",
    delete_success: "हटा दिया गया!",
    invalid_phone: "10 अंकों का सही नंबर दर्ज करें",
    invalid_email: "सही ईमेल दर्ज करें",
    weak_password: "पासवर्ड कम से कम 6 अक्षर",
    password_mismatch: "पासवर्ड मेल नहीं खाते",
    fill_all_fields: "सभी फ़ील्ड भरें",
    welcome: "स्वागत",
    your_role: "आपकी भूमिका",
    start: "शुरू करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    close: "बंद करें",
    yes: "हाँ", no: "नहीं",
    ok: "ठीक है"
  },

  // ============================================================
  // 🇮🇳 ଓଡ଼ିଆ (Odia)
  // ============================================================
  or: {
    home: "ହୋମ", coupons: "କୁପନ", users: "ଉପଭୋକ୍ତା", withdraw: "ଉତ୍ତୋଳନ",
    plan: "ଯୋଜନା", settings: "ସେଟିଂସ", profile: "ପ୍ରୋଫାଇଲ",
    scan: "ସ୍କାନ", wallet: "ୱାଲେଟ", dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    logout: "ଲଗଆଉଟ", login: "ଲଗଇନ", register: "ପଞ୍ଜିକରଣ",
    email: "ଇମେଲ", password: "ପାସୱାର୍ଡ",
    confirm_password: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    forgot_password: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ?",
    login_btn: "ଲଗଇନ", register_btn: "ପଞ୍ଜିକରଣ",
    reset_password: "ପାସୱାର୍ଡ ରିସେଟ କରନ୍ତୁ",
    send_reset_link: "ରିସେଟ ଲିଙ୍କ ପଠାନ୍ତୁ",
    who_are_you: "ଆପଣ କିଏ?",
    company_name: "କମ୍ପାନୀ ନାମ",
    your_name: "ଆପଣଙ୍କ ନାମ",
    whatsapp_number: "ହ୍ୱାଟସଆପ ନମ୍ବର",
    admin_owner: "ବ୍ୟବସାୟ ମାଲିକ", manufacturer: "ଉତ୍ପାଦକ",
    wholesaler: "ପାଇକାରୀ", retailer: "ଖୁଚୁରା ବିକ୍ରେତା",
    mistri: "କାରିଗର", customer: "ଗ୍ରାହକ",
    invite_code_option: "ମୋର ଇନଭାଇଟ କୋଡ ଅଛି",
    invite_code: "ଇନଭାଇଟ କୋଡ",
    verify_code: "କୋଡ ଯାଞ୍ଚ କରନ୍ତୁ",
    back: "ପଛକୁ ଯାଆନ୍ତୁ",
    total_coupons: "ମୋଟ କୁପନ", used_coupons: "ବ୍ୟବହୃତ",
    customers: "ଗ୍ରାହକ", pending: "ବିଚାରାଧୀନ",
    active: "ସକ୍ରିୟ", trial: "ପରୀକ୍ଷଣ", expired: "ସମାପ୍ତ",
    no_subscription: "କୌଣସି ସବସ୍କ୍ରିପସନ ନାହିଁ",
    subscription_ended: "ସବସ୍କ୍ରିପସନ ସମାପ୍ତ",
    share_link: "ଗ୍ରାହକଙ୍କ ସହ ଲିଙ୍କ ଅଂଶୀଦାର କରନ୍ତୁ",
    share_hint: "ଏହି ଲିଙ୍କ ଗ୍ରାହକଙ୍କୁ ପଠାନ୍ତୁ।",
    copy_link: "ଲିଙ୍କ କପି",
    share_whatsapp: "ହ୍ୱାଟସଆପରେ ଅଂଶୀଦାର",
    copied: "କପି ହୋଇଛି!",
    grades_prices: "ଗ୍ରେଡ ଏବଂ ମୂଲ୍ୟ",
    no_grades: "କୌଣସି ଗ୍ରେଡ ନାହିଁ",
    grade_placeholder: "ଗ୍ରେଡ",
    price_placeholder: "ମୂଲ୍ୟ",
    add: "ଯୋଡନ୍ତୁ",
    generate_coupons: "କୁପନ ତିଆରି କରନ୍ତୁ",
    select_grade: "ଗ୍ରେଡ ଚୟନ",
    quantity: "ପରିମାଣ",
    expiry: "ସମାପ୍ତି",
    generate_btn: "ତିଆରି",
    recent_batch: "ସାମ୍ପ୍ରତିକ ବ୍ୟାଚ",
    no_coupons: "ଏବେ କୌଣସି କୁପନ ନାହିଁ",
    print: "ପ୍ରିଣ୍ଟ",
    download_pdf: "PDF ଡାଉନଲୋଡ",
    code: "କୋଡ",
    team_management: "ଟିମ ପରିଚାଳନା",
    team_management_hint: "ନୂତନ କର୍ମଚାରୀ ଯୋଡିବାକୁ Invite Code ତିଆରି କରନ୍ତୁ।",
    role_select: "ଭୂମିକା ଚୟନ",
    expiry_days: "କୋଡ ସମାପ୍ତି (ଦିନ)",
    generate_code: "କୋଡ ତିଆରି",
    your_codes: "ଆପଣଙ୍କ କୋଡ",
    your_team: "ଆପଣଙ୍କ ଟିମ ସଦସ୍ୟ",
    no_team_member: "ଏବେ କୌଣସି ସଦସ୍ୟ ନାହିଁ",
    no_codes: "ଏବେ କୌଣସି କୋଡ ନାହିଁ",
    manager: "ମ୍ୟାନେଜର", salesman: "ବିକ୍ରେତା",
    delivery_boy: "ଡେଲିଭରୀ ବୟ", dispatch_boy: "ଡିସପ୍ୟାଚ ବୟ",
    consignor: "କନସାଇନର",
    unused: "ଅବ୍ୟବହୃତ", used: "ବ୍ୟବହୃତ",
    suspended: "ସ୍ଥଗିତ",
    coupon_redeemed: "କୁପନ ରିଡିମ",
    total_points: "ମୋଟ ପଏଣ୍ଟ",
    joined: "ଯୋଡିଛନ୍ତି",
    company_settings: "କମ୍ପାନୀ ସେଟିଂସ",
    helpline: "ହେଲ୍ପଲାଇନ",
    footer_text: "ଫୁଟର ଟେକ୍ସଟ",
    withdrawal_min: "ସର୍ବନିମ୍ନ ଉତ୍ତୋଳନ (₹)",
    language: "ଭାଷା",
    save: "ସେଭ କରନ୍ତୁ",
    save_success: "ସେଭ ହୋଇଛି!",
    your_subscription: "ଆପଣଙ୍କ ସବସ୍କ୍ରିପସନ",
    upgrade: "ଅପଗ୍ରେଡ",
    upgrade_hint: "ଆପଣଙ୍କ ଆବଶ୍ୟକତା ଅନୁଯାୟୀ ଯୋଜନା ଚୟନ କରନ୍ତୁ",
    days_left: "ଦିନ",
    next_renew: "ପରବର୍ତ୍ତୀ ନବୀକରଣ",
    renew: "ନବୀକରଣ",
    buy_plan: "ଯୋଜନା କିଣନ୍ତୁ",
    view_plans: "ଯୋଜନା ଦେଖନ୍ତୁ ଏବଂ କିଣନ୍ତୁ",
    buy_subscription: "ସବସ୍କ୍ରିପସନ କିଣନ୍ତୁ",
    scan_qr_hint: "ଦେୟ ଦେବାକୁ QR କୋଡ ସ୍କାନ କରନ୍ତୁ",
    or_pay_to_upi: "କିମ୍ବା ଏହି UPI ID କୁ ଦିଅନ୍ତୁ",
    upload_screenshot: "ଦେୟ ସ୍କ୍ରିନସଟ ଅପଲୋଡ କରନ୍ତୁ",
    upi_reference: "UPI ରେଫରେନ୍ସ / ଟ୍ରାଞ୍ଜାକ୍ସନ ID",
    submit_request: "ଅନୁରୋଧ ଦାଖଲ",
    pending_requests: "ବିଚାରାଧୀନ ଅନୁରୋଧ",
    no_requests: "କୌଣସି ଅନୁରୋଧ ନାହିଁ",
    approved: "ଅନୁମୋଦିତ", rejected: "ପ୍ରତ୍ୟାଖ୍ୟାତ",
    approve: "ଅନୁମୋଦନ", reject: "ପ୍ରତ୍ୟାଖ୍ୟାନ",
    subscription_request: "ସବସ୍କ୍ରିପସନ ଅନୁରୋଧ",
    your_balance: "ଆପଣଙ୍କ ବାଲାନ୍ସ",
    recent_txn: "ସାମ୍ପ୍ରତିକ କାରବାର",
    no_txn: "କୌଣସି କାରବାର ନାହିଁ",
    phone: "ଫୋନ ନମ୍ବର",
    upi_id: "UPI ID",
    request_withdraw: "ଉତ୍ତୋଳନ ଅନୁରୋଧ",
    minimum_withdraw: "ସର୍ବନିମ୍ନ ଉତ୍ତୋଳନ",
    scan_coupon: "କୁପନ ସ୍କାନ",
    stop_scan: "ସ୍କାନର ବନ୍ଦ",
    manual_entry: "ମାନୁଆଲ ଏଣ୍ଟ୍ରି",
    redeem: "ରିଡିମ",
    coupon_code: "କୁପନ କୋଡ",
    customer_phone: "ଗ୍ରାହକ ଫୋନ",
    my_profile: "ମୋର ପ୍ରୋଫାଇଲ",
    name: "ନାମ", company: "କମ୍ପାନୀ",
    role: "ଭୂମିକା",
    whatsapp: "ହ୍ୱାଟସଆପ",
    no_subscription_msg: "ଆପଣ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଯୋଜନା କିଣି ନାହାନ୍ତି।",
    subscription_ended_msg: "ଆପଣଙ୍କ ସବସ୍କ୍ରିପସନ ସମାପ୍ତ ହୋଇଛି।",
    current_subscription: "ଆପଣଙ୍କ ବର୍ତ୍ତମାନ ସବସ୍କ୍ରିପସନ",
    status: "ସ୍ଥିତି",
    expiry_date: "ସମାପ୍ତି ତାରିଖ",
    loading: "ଲୋଡ ହେଉଛି...",
    success: "ସଫଳ!",
    error: "ତ୍ରୁଟି",
    please_wait: "ଅପେକ୍ଷା କରନ୍ତୁ...",
    are_you_sure: "ଆପଣ ନିଶ୍ଚିତ?",
    delete_success: "ବିଲୋପ ହୋଇଛି!",
    invalid_phone: "10 ଅଙ୍କର ସଠିକ ନମ୍ବର ଦିଅନ୍ତୁ",
    invalid_email: "ସଠିକ ଇମେଲ ଦିଅନ୍ତୁ",
    weak_password: "ପାସୱାର୍ଡ ଅତି କମ 6 ଅକ୍ଷର",
    password_mismatch: "ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ",
    fill_all_fields: "ସମସ୍ତ ତଥ୍ୟ ଦିଅନ୍ତୁ",
    welcome: "ସ୍ୱାଗତ",
    your_role: "ଆପଣଙ୍କ ଭୂମିକା",
    start: "ଆରମ୍ଭ କରନ୍ତୁ",
    cancel: "ବାତିଲ",
    confirm: "ନିଶ୍ଚିତ କରନ୍ତୁ",
    close: "ବନ୍ଦ କରନ୍ତୁ",
    yes: "ହଁ", no: "ନା",
    ok: "ଠିକ ଅଛି"
  },

  // ============================================================
  // 🇵🇰 اردو (Urdu) - RTL
  // ============================================================
  ur: {
    home: "ہوم", coupons: "کوپن", users: "صارفین", withdraw: "نکاسی",
    plan: "پلان", settings: "ترتیبات", profile: "پروفائل",
    scan: "اسکین", wallet: "والٹ", dashboard: "ڈیش بورڈ",
    logout: "لاگ آؤٹ", login: "لاگ ان", register: "رجسٹر",
    email: "ای میل", password: "پاس ورڈ",
    confirm_password: "پاس ورڈ کی تصدیق",
    forgot_password: "پاس ورڈ بھول گئے؟",
    login_btn: "لاگ ان", register_btn: "رجسٹر",
    reset_password: "پاس ورڈ ری سیٹ",
    send_reset_link: "ری سیٹ لنک بھیجیں",
    who_are_you: "آپ کون ہیں؟",
    company_name: "کمپنی کا نام",
    your_name: "آپ کا نام",
    whatsapp_number: "واٹس ایپ نمبر",
    admin_owner: "کاروبار کا مالک", manufacturer: "مینوفیکچرر",
    wholesaler: "تھوک فروش", retailer: "خوردہ فروش",
    mistri: "کاریگر", customer: "گاہک",
    invite_code_option: "میرے پاس انوائٹ کوڈ ہے",
    invite_code: "انوائٹ کوڈ",
    verify_code: "کوڈ کی تصدیق کریں",
    back: "واپس جائیں",
    total_coupons: "کل کوپن", used_coupons: "استعمال شدہ",
    customers: "گاہک", pending: "زیر التواء",
    active: "فعال", trial: "آزمائشی", expired: "میعاد ختم",
    no_subscription: "کوئی سبسکرپشن نہیں",
    subscription_ended: "سبسکرپشن ختم",
    share_link: "گاہکوں کے ساتھ لنک شیئر کریں",
    share_hint: "یہ لنک گاہکوں کو بھیجیں۔",
    copy_link: "لنک کاپی کریں",
    share_whatsapp: "واٹس ایپ پر شیئر کریں",
    copied: "کاپی ہو گیا!",
    grades_prices: "گریڈ اور قیمت",
    no_grades: "کوئی گریڈ نہیں",
    grade_placeholder: "گریڈ",
    price_placeholder: "قیمت",
    add: "شامل کریں",
    generate_coupons: "کوپن بنائیں",
    select_grade: "گریڈ منتخب کریں",
    quantity: "مقدار",
    expiry: "میعاد",
    generate_btn: "بنائیں",
    recent_batch: "حالیہ بیچ",
    no_coupons: "ابھی کوئی کوپن نہیں",
    print: "پرنٹ",
    download_pdf: "PDF ڈاؤن لوڈ",
    code: "کوڈ",
    team_management: "ٹیم مینجمنٹ",
    team_management_hint: "نیا عملہ شامل کرنے کے لیے Invite Code بنائیں۔",
    role_select: "کردار منتخب کریں",
    expiry_days: "کوڈ میعاد (دن)",
    generate_code: "کوڈ بنائیں",
    your_codes: "آپ کے کوڈز",
    your_team: "آپ کے ٹیم ممبران",
    no_team_member: "ابھی کوئی ممبر نہیں",
    no_codes: "ابھی کوئی کوڈ نہیں",
    manager: "منیجر", salesman: "سیلز مین",
    delivery_boy: "ڈیلیوری بوائے", dispatch_boy: "ڈسپیچ بوائے",
    consignor: "کنسائنر",
    unused: "غیر استعمال شدہ", used: "استعمال شدہ",
    suspended: "معطل",
    coupon_redeemed: "کوپن ریڈیم",
    total_points: "کل پوائنٹس",
    joined: "شامل ہوئے",
    company_settings: "کمپنی کی ترتیبات",
    helpline: "ہیلپ لائن",
    footer_text: "فوٹر ٹیکسٹ",
    withdrawal_min: "کم از کم نکاسی (₹)",
    language: "زبان",
    save: "محفوظ کریں",
    save_success: "محفوظ ہو گیا!",
    your_subscription: "آپ کی سبسکرپشن",
    upgrade: "اپ گریڈ",
    upgrade_hint: "اپنی ضرورت کے مطابق پلان منتخب کریں",
    days_left: "دن",
    next_renew: "اگلی تجدید",
    renew: "تجدید",
    buy_plan: "پلان خریدیں",
    view_plans: "پلان دیکھیں اور خریدیں",
    buy_subscription: "سبسکرپشن خریدیں",
    scan_qr_hint: "ادائیگی کے لیے QR کوڈ اسکین کریں",
    or_pay_to_upi: "یا اس UPI ID پر ادائیگی کریں",
    upload_screenshot: "ادائیگی کا اسکرین شاٹ اپلوڈ کریں",
    upi_reference: "UPI حوالہ / ٹرانزیکشن ID",
    submit_request: "درخواست جمع کریں",
    pending_requests: "زیر التواء درخواستیں",
    no_requests: "کوئی درخواست نہیں",
    approved: "منظور شدہ", rejected: "مسترد",
    approve: "منظور کریں", reject: "مسترد کریں",
    subscription_request: "سبسکرپشن درخواست",
    your_balance: "آپ کا بیلنس",
    recent_txn: "حالیہ لین دین",
    no_txn: "کوئی لین دین نہیں",
    phone: "فون نمبر",
    upi_id: "UPI ID",
    request_withdraw: "نکاسی کی درخواست",
    minimum_withdraw: "کم از کم نکاسی",
    scan_coupon: "کوپن اسکین کریں",
    stop_scan: "اسکینر بند کریں",
    manual_entry: "دستی اندراج",
    redeem: "ریڈیم",
    coupon_code: "کوپن کوڈ",
    customer_phone: "گاہک کا فون",
    my_profile: "میرا پروفائل",
    name: "نام", company: "کمپنی",
    role: "کردار",
    whatsapp: "واٹس ایپ",
    no_subscription_msg: "آپ نے ابھی تک کوئی پلان نہیں خریدا۔",
    subscription_ended_msg: "آپ کی سبسکرپشن ختم ہو گئی ہے۔",
    current_subscription: "آپ کی موجودہ سبسکرپشن",
    status: "حیثیت",
    expiry_date: "میعاد ختم",
    loading: "لوڈ ہو رہا ہے...",
    success: "کامیاب!",
    error: "خرابی",
    please_wait: "براہ کرم انتظار کریں...",
    are_you_sure: "کیا آپ کو یقین ہے؟",
    delete_success: "حذف ہو گیا!",
    invalid_phone: "10 ہندسوں کا درست نمبر دیں",
    invalid_email: "درست ای میل دیں",
    weak_password: "پاس ورڈ کم از کم 6 حروف",
    password_mismatch: "پاس ورڈ مماثل نہیں",
    fill_all_fields: "تمام معلومات دیں",
    welcome: "خوش آمدید",
    your_role: "آپ کا کردار",
    start: "شروع کریں",
    cancel: "منسوخ",
    confirm: "تصدیق کریں",
    close: "بند کریں",
    yes: "ہاں", no: "نہیں",
    ok: "ٹھیک ہے"
  },

  // ============================================================
  // 🇮🇳 ગુજરાતી (Gujarati)
  // ============================================================
  gu: {
    home: "હોમ", coupons: "કૂપન", users: "વપરાશકર્તાઓ", withdraw: "ઉપાડ",
    plan: "પ્લાન", settings: "સેટિંગ્સ", profile: "પ્રોફાઇલ",
    scan: "સ્કેન", wallet: "વોલેટ", dashboard: "ડેશબોર્ડ",
    logout: "લોગઆઉટ", login: "લોગિન", register: "રજિસ્ટર",
    email: "ઈમેલ", password: "પાસવર્ડ",
    confirm_password: "પાસવર્ડની પુષ્ટિ કરો",
    forgot_password: "પાસવર્ડ ભૂલી ગયા?",
    login_btn: "લોગિન", register_btn: "રજિસ્ટર",
    reset_password: "પાસવર્ડ રીસેટ કરો",
    send_reset_link: "રીસેટ લિંક મોકલો",
    who_are_you: "તમે કોણ છો?",
    company_name: "કંપનીનું નામ",
    your_name: "તમારું નામ",
    whatsapp_number: "વોટ્સએપ નંબર",
    admin_owner: "વ્યવસાયના માલિક", manufacturer: "ઉત્પાદક",
    wholesaler: "જથ્થાબંધ વેપારી", retailer: "છૂટક વેપારી",
    mistri: "કારીગર", customer: "ગ્રાહક",
    invite_code_option: "મારી પાસે Invite Code છે",
    invite_code: "Invite Code",
    verify_code: "કોડ ચકાસો",
    back: "પાછા જાઓ",
    total_coupons: "કુલ કૂપન", used_coupons: "વપરાયેલ",
    customers: "ગ્રાહકો", pending: "બાકી",
    active: "સક્રિય", trial: "ટ્રાયલ", expired: "સમાપ્ત",
    no_subscription: "કોઈ સબસ્ક્રિપ્શન નથી",
    subscription_ended: "સબસ્ક્રિપ્શન સમાપ્ત",
    share_link: "ગ્રાહકો સાથે લિંક શેર કરો",
    share_hint: "આ લિંક ગ્રાહકોને મોકલો.",
    copy_link: "લિંક કોપી",
    share_whatsapp: "વોટ્સએપ પર શેર કરો",
    copied: "કોપી થયું!",
    grades_prices: "ગ્રેડ અને ભાવ",
    no_grades: "કોઈ ગ્રેડ નથી",
    grade_placeholder: "ગ્રેડ",
    price_placeholder: "ભાવ",
    add: "ઉમેરો",
    generate_coupons: "કૂપન બનાવો",
    select_grade: "ગ્રેડ પસંદ કરો",
    quantity: "જથ્થો",
    expiry: "સમાપ્તિ",
    generate_btn: "બનાવો",
    recent_batch: "તાજેતરની બેચ",
    no_coupons: "હજી કોઈ કૂપન નથી",
    print: "પ્રિન્ટ",
    download_pdf: "PDF ડાઉનલોડ",
    code: "કોડ",
    team_management: "ટીમ મેનેજમેન્ટ",
    team_management_hint: "નવો સ્ટાફ ઉમેરવા Invite Code બનાવો.",
    role_select: "ભૂમિકા પસંદ કરો",
    expiry_days: "કોડ સમાપ્તિ (દિવસ)",
    generate_code: "કોડ બનાવો",
    your_codes: "તમારા કોડ",
    your_team: "તમારા ટીમ સભ્યો",
    no_team_member: "હજી કોઈ સભ્ય નથી",
    no_codes: "હજી કોઈ કોડ નથી",
    manager: "મેનેજર", salesman: "સેલ્સમેન",
    delivery_boy: "ડિલિવરી બોય", dispatch_boy: "ડિસ્પેચ બોય",
    consignor: "કન્સાઇનર",
    unused: "વણવપરાયેલ", used: "વપરાયેલ",
    suspended: "સસ્પેન્ડેડ",
    coupon_redeemed: "કૂપન રિડીમ",
    total_points: "કુલ પોઈન્ટ",
    joined: "જોડાયા",
    company_settings: "કંપની સેટિંગ્સ",
    helpline: "હેલ્પલાઇન",
    footer_text: "ફૂટર ટેક્સ્ટ",
    withdrawal_min: "ન્યૂનતમ ઉપાડ (₹)",
    language: "ભાષા",
    save: "સેવ કરો",
    save_success: "સેવ થયું!",
    your_subscription: "તમારી સબસ્ક્રિપ્શન",
    upgrade: "અપગ્રેડ",
    upgrade_hint: "તમારી જરૂરિયાત મુજબ પ્લાન પસંદ કરો",
    days_left: "દિવસ",
    next_renew: "આગળનું નવીકરણ",
    renew: "નવીકરણ",
    buy_plan: "પ્લાન ખરીદો",
    view_plans: "પ્લાન જુઓ અને ખરીદો",
    buy_subscription: "સબસ્ક્રિપ્શન ખરીદો",
    scan_qr_hint: "ચૂકવણી માટે QR કોડ સ્કેન કરો",
    or_pay_to_upi: "અથવા આ UPI ID પર ચૂકવો",
    upload_screenshot: "ચૂકવણી સ્ક્રીનશોટ અપલોડ કરો",
    upi_reference: "UPI સંદર્ભ / ટ્રાન્ઝેક્શન ID",
    submit_request: "વિનંતી સબમિટ કરો",
    pending_requests: "બાકી વિનંતીઓ",
    no_requests: "કોઈ વિનંતી નથી",
    approved: "મંજૂર", rejected: "અસ્વીકૃત",
    approve: "મંજૂર કરો", reject: "અસ્વીકારો",
    subscription_request: "સબસ્ક્રિપ્શન વિનંતી",
    your_balance: "તમારું બેલેન્સ",
    recent_txn: "તાજેતરના વ્યવહારો",
    no_txn: "કોઈ વ્યવહાર નથી",
    phone: "ફોન નંબર",
    upi_id: "UPI ID",
    request_withdraw: "ઉપાડ વિનંતી",
    minimum_withdraw: "ન્યૂનતમ ઉપાડ",
    scan_coupon: "કૂપન સ્કેન કરો",
    stop_scan: "સ્કેનર બંધ કરો",
    manual_entry: "મેન્યુઅલ એન્ટ્રી",
    redeem: "રિડીમ",
    coupon_code: "કૂપન કોડ",
    customer_phone: "ગ્રાહકનો ફોન",
    my_profile: "મારી પ્રોફાઇલ",
    name: "નામ", company: "કંપની",
    role: "ભૂમિકા",
    whatsapp: "વોટ્સએપ",
    no_subscription_msg: "તમે હજી કોઈ પ્લાન ખરીદ્યો નથી.",
    subscription_ended_msg: "તમારી સબસ્ક્રિપ્શન સમાપ્ત થઈ ગઈ છે.",
    current_subscription: "તમારી વર્તમાન સબસ્ક્રિપ્શન",
    status: "સ્થિતિ",
    expiry_date: "સમાપ્તિ તારીખ",
    loading: "લોડ થઈ રહ્યું છે...",
    success: "સફળ!",
    error: "ભૂલ",
    please_wait: "કૃપા કરી રાહ જુઓ...",
    are_you_sure: "શું તમે ચોક્કસ છો?",
    delete_success: "કાઢી નાખ્યું!",
    invalid_phone: "10 અંકનો સાચો નંબર આપો",
    invalid_email: "સાચો ઈમેલ આપો",
    weak_password: "પાસવર્ડ ઓછામાં ઓછા 6 અક્ષર",
    password_mismatch: "પાસવર્ડ મેળ ખાતા નથી",
    fill_all_fields: "બધી માહિતી ભરો",
    welcome: "સ્વાગત",
    your_role: "તમારી ભૂમિકા",
    start: "શરૂ કરો",
    cancel: "રદ કરો",
    confirm: "પુષ્ટિ કરો",
    close: "બંધ કરો",
    yes: "હા", no: "ના",
    ok: "બરાબર"
  },

  // ============================================================
  // 🇮🇳 मराठी (Marathi)
  // ============================================================
  mr: {
    home: "होम", coupons: "कूपन", users: "वापरकर्ते", withdraw: "पैसे काढा",
    plan: "प्लॅन", settings: "सेटिंग्ज", profile: "प्रोफाइल",
    scan: "स्कॅन", wallet: "वॉलेट", dashboard: "डॅशबोर्ड",
    logout: "लॉगआउट", login: "लॉगिन", register: "नोंदणी",
    email: "ईमेल", password: "पासवर्ड",
    confirm_password: "पासवर्डची पुष्टी करा",
    forgot_password: "पासवर्ड विसरला?",
    login_btn: "लॉगिन", register_btn: "नोंदणी",
    reset_password: "पासवर्ड रीसेट करा",
    send_reset_link: "रीसेट लिंक पाठवा",
    who_are_you: "तुम्ही कोण आहात?",
    company_name: "कंपनीचे नाव",
    your_name: "तुमचे नाव",
    whatsapp_number: "व्हॉट्सअ‍ॅप नंबर",
    admin_owner: "व्यवसाय मालक", manufacturer: "उत्पादक",
    wholesaler: "घाऊक विक्रेता", retailer: "किरकोळ विक्रेता",
    mistri: "कारागीर", customer: "ग्राहक",
    invite_code_option: "माझ्याकडे Invite Code आहे",
    invite_code: "Invite Code",
    verify_code: "कोड तपासा",
    back: "मागे जा",
    total_coupons: "एकूण कूपन", used_coupons: "वापरलेले",
    customers: "ग्राहक", pending: "प्रलंबित",
    active: "सक्रिय", trial: "चाचणी", expired: "कालबाह्य",
    no_subscription: "सदस्यता नाही",
    subscription_ended: "सदस्यता संपली",
    share_link: "ग्राहकांसोबत लिंक शेअर करा",
    share_hint: "ही लिंक ग्राहकांना पाठवा.",
    copy_link: "लिंक कॉपी",
    share_whatsapp: "व्हॉट्सअ‍ॅपवर शेअर करा",
    copied: "कॉपी झाले!",
    grades_prices: "ग्रेड आणि किंमती",
    no_grades: "कोणतेही ग्रेड नाही",
    grade_placeholder: "ग्रेड",
    price_placeholder: "किंमत",
    add: "जोडा",
    generate_coupons: "कूपन तयार करा",
    select_grade: "ग्रेड निवडा",
    quantity: "प्रमाण",
    expiry: "कालबाह्यता",
    generate_btn: "तयार करा",
    recent_batch: "अलीकडील बॅच",
    no_coupons: "अजून कूपन नाही",
    print: "प्रिंट",
    download_pdf: "PDF डाउनलोड",
    code: "कोड",
    team_management: "टीम व्यवस्थापन",
    team_management_hint: "नवीन कर्मचारी जोडण्यासाठी Invite Code तयार करा.",
    role_select: "भूमिका निवडा",
    expiry_days: "कोड कालबाह्यता (दिवस)",
    generate_code: "कोड तयार करा",
    your_codes: "तुमचे कोड",
    your_team: "तुमचे टीम सदस्य",
    no_team_member: "अजून सदस्य नाही",
    no_codes: "अजून कोड नाही",
    manager: "व्यवस्थापक", salesman: "विक्रेता",
    delivery_boy: "डिलिव्हरी बॉय", dispatch_boy: "डिस्पॅच बॉय",
    consignor: "कन्साइनर",
    unused: "न वापरलेले", used: "वापरलेले",
    suspended: "निलंबित",
    coupon_redeemed: "कूपन रिडीम",
    total_points: "एकूण गुण",
    joined: "सामील झाले",
    company_settings: "कंपनी सेटिंग्ज",
    helpline: "हेल्पलाइन",
    footer_text: "फूटर मजकूर",
    withdrawal_min: "किमान पैसे काढणे (₹)",
    language: "भाषा",
    save: "जतन करा",
    save_success: "जतन झाले!",
    your_subscription: "तुमची सदस्यता",
    upgrade: "अपग्रेड",
    upgrade_hint: "तुमच्या गरजेनुसार प्लॅन निवडा",
    days_left: "दिवस",
    next_renew: "पुढील नूतनीकरण",
    renew: "नूतनीकरण",
    buy_plan: "प्लॅन खरेदी करा",
    view_plans: "प्लॅन पहा आणि खरेदी करा",
    buy_subscription: "सदस्यता खरेदी करा",
    scan_qr_hint: "पैसे भरण्यासाठी QR कोड स्कॅन करा",
    or_pay_to_upi: "किंवा या UPI ID वर द्या",
    upload_screenshot: "पेमेंट स्क्रीनशॉट अपलोड करा",
    upi_reference: "UPI संदर्भ / व्यवहार ID",
    submit_request: "विनंती सबमिट करा",
    pending_requests: "प्रलंबित विनंत्या",
    no_requests: "विनंती नाही",
    approved: "मंजूर", rejected: "नाकारले",
    approve: "मंजूर करा", reject: "नाकारा",
    subscription_request: "सदस्यता विनंती",
    your_balance: "तुमचे शिल्लक",
    recent_txn: "अलीकडील व्यवहार",
    no_txn: "व्यवहार नाही",
    phone: "फोन नंबर",
    upi_id: "UPI ID",
    request_withdraw: "पैसे काढण्याची विनंती",
    minimum_withdraw: "किमान पैसे काढणे",
    scan_coupon: "कूपन स्कॅन करा",
    stop_scan: "स्कॅनर बंद करा",
    manual_entry: "मॅन्युअल एंट्री",
    redeem: "रिडीम",
    coupon_code: "कूपन कोड",
    customer_phone: "ग्राहकाचा फोन",
    my_profile: "माझे प्रोफाइल",
    name: "नाव", company: "कंपनी",
    role: "भूमिका",
    whatsapp: "व्हॉट्सअ‍ॅप",
    no_subscription_msg: "तुम्ही अजून कोणताही प्लॅन खरेदी केला नाही.",
    subscription_ended_msg: "तुमची सदस्यता संपली आहे.",
    current_subscription: "तुमची सध्याची सदस्यता",
    status: "स्थिती",
    expiry_date: "कालबाह्यता तारीख",
    loading: "लोड होत आहे...",
    success: "यशस्वी!",
    error: "त्रुटी",
    please_wait: "कृपया थांबा...",
    are_you_sure: "तुम्हाला खात्री आहे?",
    delete_success: "हटवले!",
    invalid_phone: "10 अंकी योग्य क्रमांक द्या",
    invalid_email: "योग्य ईमेल द्या",
    weak_password: "पासवर्ड किमान 6 अक्षरे",
    password_mismatch: "पासवर्ड जुळत नाहीत",
    fill_all_fields: "सर्व माहिती भरा",
    welcome: "स्वागत",
    your_role: "तुमची भूमिका",
    start: "सुरू करा",
    cancel: "रद्द करा",
    confirm: "पुष्टी करा",
    close: "बंद करा",
    yes: "होय", no: "नाही",
    ok: "ठीक आहे"
  },

  // ============================================================
  // 🇮🇳 தமிழ் (Tamil)
  // ============================================================
  ta: {
    home: "முகப்பு", coupons: "கூப்பன்கள்", users: "பயனர்கள்", withdraw: "பணம் எடு",
    plan: "திட்டம்", settings: "அமைப்புகள்", profile: "சுயவிவரம்",
    scan: "ஸ்கேன்", wallet: "பணப்பெட்டி", dashboard: "டாஷ்போர்டு",
    logout: "வெளியேறு", login: "உள்நுழை", register: "பதிவு",
    email: "மின்னஞ்சல்", password: "கடவுச்சொல்",
    confirm_password: "கடவுச்சொல்லை உறுதிப்படுத்து",
    forgot_password: "கடவுச்சொல் மறந்துவிட்டதா?",
    login_btn: "உள்நுழை", register_btn: "பதிவு",
    reset_password: "கடவுச்சொல்லை மீட்டமை",
    send_reset_link: "மீட்டமை இணைப்பை அனுப்பு",
    who_are_you: "நீங்கள் யார்?",
    company_name: "நிறுவன பெயர்",
    your_name: "உங்கள் பெயர்",
    whatsapp_number: "வாட்ஸ்அப் எண்",
    admin_owner: "வணிக உரிமையாளர்", manufacturer: "உற்பத்தியாளர்",
    wholesaler: "மொத்த விற்பனையாளர்", retailer: "சில்லறை விற்பனையாளர்",
    mistri: "கைவினைஞர்", customer: "வாடிக்கையாளர்",
    invite_code_option: "என்னிடம் Invite Code உள்ளது",
    invite_code: "Invite Code",
    verify_code: "குறியீட்டைச் சரிபார்",
    back: "பின்செல்",
    total_coupons: "மொத்த கூப்பன்கள்", used_coupons: "பயன்படுத்தியது",
    customers: "வாடிக்கையாளர்கள்", pending: "நிலுவை",
    active: "செயலில்", trial: "சோதனை", expired: "காலாவதியானது",
    no_subscription: "சந்தா இல்லை",
    subscription_ended: "சந்தா முடிந்தது",
    share_link: "வாடிக்கையாளர்களுடன் இணைப்பைப் பகிரவும்",
    share_hint: "இந்த இணைப்பை வாடிக்கையாளர்களுக்கு அனுப்பவும்.",
    copy_link: "இணைப்பை நகலெடு",
    share_whatsapp: "வாட்ஸ்அப்பில் பகிரவும்",
    copied: "நகலெடுக்கப்பட்டது!",
    grades_prices: "தரம் மற்றும் விலை",
    no_grades: "தரம் இல்லை",
    grade_placeholder: "தரம்",
    price_placeholder: "விலை",
    add: "சேர்",
    generate_coupons: "கூப்பன்களை உருவாக்கு",
    select_grade: "தரம் தேர்வு",
    quantity: "அளவு",
    expiry: "காலாவதி",
    generate_btn: "உருவாக்கு",
    recent_batch: "சமீபத்திய தொகுதி",
    no_coupons: "இன்னும் கூப்பன் இல்லை",
    print: "அச்சிடு",
    download_pdf: "PDF பதிவிறக்கம்",
    code: "குறியீடு",
    team_management: "குழு மேலாண்மை",
    team_management_hint: "புதிய பணியாளரைச் சேர்க்க Invite Code உருவாக்கவும்.",
    role_select: "பங்கு தேர்வு",
    expiry_days: "குறியீடு காலாவதி (நாட்கள்)",
    generate_code: "குறியீடு உருவாக்கு",
    your_codes: "உங்கள் குறியீடுகள்",
    your_team: "உங்கள் குழு உறுப்பினர்கள்",
    no_team_member: "இன்னும் உறுப்பினர் இல்லை",
    no_codes: "இன்னும் குறியீடு இல்லை",
    manager: "மேலாளர்", salesman: "விற்பனையாளர்",
    delivery_boy: "டெலிவரி பாய்", dispatch_boy: "டிஸ்பேட்ச் பாய்",
    consignor: "கன்சைனர்",
    unused: "பயன்படுத்தப்படாதது", used: "பயன்படுத்தப்பட்டது",
    suspended: "இடைநிறுத்தப்பட்டது",
    coupon_redeemed: "கூப்பன் மீட்டெடுக்கப்பட்டது",
    total_points: "மொத்த புள்ளிகள்",
    joined: "சேர்ந்தார்",
    company_settings: "நிறுவன அமைப்புகள்",
    helpline: "உதவி எண்",
    footer_text: "அடிக்குறிப்பு",
    withdrawal_min: "குறைந்தபட்ச பணம் எடு (₹)",
    language: "மொழி",
    save: "சேமி",
    save_success: "சேமிக்கப்பட்டது!",
    your_subscription: "உங்கள் சந்தா",
    upgrade: "மேம்படுத்து",
    upgrade_hint: "உங்கள் தேவைக்கேற்ப திட்டத்தைத் தேர்ந்தெடுக்கவும்",
    days_left: "நாட்கள்",
    next_renew: "அடுத்த புதுப்பித்தல்",
    renew: "புதுப்பி",
    buy_plan: "திட்டம் வாங்கு",
    view_plans: "திட்டங்களைப் பார் மற்றும் வாங்கு",
    buy_subscription: "சந்தா வாங்கு",
    scan_qr_hint: "பணம் செலுத்த QR குறியீட்டை ஸ்கேன் செய்யவும்",
    or_pay_to_upi: "அல்லது இந்த UPI ID க்கு செலுத்தவும்",
    upload_screenshot: "பணம் செலுத்திய திரைப்பிடிப்பைப் பதிவேற்றவும்",
    upi_reference: "UPI குறிப்பு / பரிவர்த்தனை ID",
    submit_request: "கோரிக்கையைச் சமர்ப்பி",
    pending_requests: "நிலுவை கோரிக்கைகள்",
    no_requests: "கோரிக்கை இல்லை",
    approved: "அங்கீகரிக்கப்பட்டது", rejected: "நிராகரிக்கப்பட்டது",
    approve: "அங்கீகரி", reject: "நிராகரி",
    subscription_request: "சந்தா கோரிக்கை",
    your_balance: "உங்கள் இருப்பு",
    recent_txn: "சமீபத்திய பரிவர்த்தனைகள்",
    no_txn: "பரிவர்த்தனை இல்லை",
    phone: "தொலைபேசி எண்",
    upi_id: "UPI ID",
    request_withdraw: "பணம் எடு கோரிக்கை",
    minimum_withdraw: "குறைந்தபட்ச பணம் எடு",
    scan_coupon: "கூப்பன் ஸ்கேன்",
    stop_scan: "ஸ்கேனரை நிறுத்து",
    manual_entry: "கைமுறை உள்ளீடு",
    redeem: "பயன்படுத்து",
    coupon_code: "கூப்பன் குறியீடு",
    customer_phone: "வாடிக்கையாளர் தொலைபேசி",
    my_profile: "எனது சுயவிவரம்",
    name: "பெயர்", company: "நிறுவனம்",
    role: "பங்கு",
    whatsapp: "வாட்ஸ்அப்",
    no_subscription_msg: "நீங்கள் இன்னும் எந்த திட்டத்தையும் வாங்கவில்லை.",
    subscription_ended_msg: "உங்கள் சந்தா காலாவதியானது.",
    current_subscription: "உங்கள் தற்போதைய சந்தா",
    status: "நிலை",
    expiry_date: "காலாவதி தேதி",
    loading: "ஏற்றுகிறது...",
    success: "வெற்றி!",
    error: "பிழை",
    please_wait: "காத்திருக்கவும்...",
    are_you_sure: "நிச்சயமா?",
    delete_success: "நீக்கப்பட்டது!",
    invalid_phone: "10 இலக்க சரியான எண்ணை உள்ளிடவும்",
    invalid_email: "சரியான மின்னஞ்சலை உள்ளிடவும்",
    weak_password: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள்",
    password_mismatch: "கடவுச்சொற்கள் பொருந்தவில்லை",
    fill_all_fields: "அனைத்து தகவலையும் நிரப்பவும்",
    welcome: "வரவேற்பு",
    your_role: "உங்கள் பங்கு",
    start: "தொடங்கு",
    cancel: "ரத்து",
    confirm: "உறுதிப்படுத்து",
    close: "மூடு",
    yes: "ஆம்", no: "இல்லை",
    ok: "சரி"
  },

  // ============================================================
  // 🇮🇳 తెలుగు (Telugu)
  // ============================================================
  te: {
    home: "హోమ్", coupons: "కూపన్లు", users: "వినియోగదారులు", withdraw: "ఉపసంహరణ",
    plan: "ప్లాన్", settings: "సెట్టింగ్‌లు", profile: "ప్రొఫైల్",
    scan: "స్కాన్", wallet: "వాలెట్", dashboard: "డాష్‌బోర్డ్",
    logout: "లాగ్అవుట్", login: "లాగిన్", register: "నమోదు",
    email: "ఇమెయిల్", password: "పాస్‌వర్డ్",
    confirm_password: "పాస్‌వర్డ్ నిర్ధారించండి",
    forgot_password: "పాస్‌వర్డ్ మర్చిపోయారా?",
    login_btn: "లాగిన్", register_btn: "నమోదు",
    reset_password: "పాస్‌వర్డ్ రీసెట్",
    send_reset_link: "రీసెట్ లింక్ పంపండి",
    who_are_you: "మీరు ఎవరు?",
    company_name: "కంపెనీ పేరు",
    your_name: "మీ పేరు",
    whatsapp_number: "వాట్సాప్ నంబర్",
    admin_owner: "వ్యాపార యజమాని", manufacturer: "తయారీదారు",
    wholesaler: "హోల్‌సేల్ వ్యాపారి", retailer: "రిటైల్ వ్యాపారి",
    mistri: "కళాకారుడు", customer: "వినియోగదారు",
    invite_code_option: "నా దగ్గర Invite Code ఉంది",
    invite_code: "Invite Code",
    verify_code: "కోడ్ ధృవీకరించు",
    back: "వెనక్కి",
    total_coupons: "మొత్తం కూపన్లు", used_coupons: "వాడినవి",
    customers: "వినియోగదారులు", pending: "పెండింగ్",
    active: "యాక్టివ్", trial: "ట్రయల్", expired: "గడువు ముగిసింది",
    no_subscription: "సబ్‌స్క్రిప్షన్ లేదు",
    subscription_ended: "సబ్‌స్క్రిప్షన్ ముగిసింది",
    share_link: "వినియోగదారులతో లింక్ పంచుకోండి",
    share_hint: "ఈ లింక్ వినియోగదారులకు పంపండి.",
    copy_link: "లింక్ కాపీ",
    share_whatsapp: "వాట్సాప్‌లో పంచుకోండి",
    copied: "కాపీ అయింది!",
    grades_prices: "గ్రేడ్లు మరియు ధరలు",
    no_grades: "గ్రేడ్‌లు లేవు",
    grade_placeholder: "గ్రేడ్",
    price_placeholder: "ధర",
    add: "జోడించు",
    generate_coupons: "కూపన్లు సృష్టించండి",
    select_grade: "గ్రేడ్ ఎంచుకోండి",
    quantity: "పరిమాణం",
    expiry: "గడువు",
    generate_btn: "సృష్టించు",
    recent_batch: "ఇటీవలి బ్యాచ్",
    no_coupons: "ఇంకా కూపన్లు లేవు",
    print: "ప్రింట్",
    download_pdf: "PDF డౌన్‌లోడ్",
    code: "కోడ్",
    team_management: "టీమ్ నిర్వహణ",
    team_management_hint: "కొత్త సిబ్బందిని జోడించడానికి Invite Code సృష్టించండి.",
    role_select: "పాత్ర ఎంచుకోండి",
    expiry_days: "కోడ్ గడువు (రోజులు)",
    generate_code: "కోడ్ సృష్టించు",
    your_codes: "మీ కోడ్‌లు",
    your_team: "మీ టీమ్ సభ్యులు",
    no_team_member: "ఇంకా సభ్యులు లేరు",
    no_codes: "ఇంకా కోడ్‌లు లేవు",
    manager: "మేనేజర్", salesman: "సేల్స్‌మెన్",
    delivery_boy: "డెలివరీ బాయ్", dispatch_boy: "డిస్పాచ్ బాయ్",
    consignor: "కన్సైనర్",
    unused: "వాడనిది", used: "వాడినది",
    suspended: "సస్పెండ్ చేయబడింది",
    coupon_redeemed: "కూపన్ రిడీమ్",
    total_points: "మొత్తం పాయింట్లు",
    joined: "చేరారు",
    company_settings: "కంపెనీ సెట్టింగ్‌లు",
    helpline: "హెల్ప్‌లైన్",
    footer_text: "ఫుటర్ టెక్స్ట్",
    withdrawal_min: "కనీస ఉపసంహరణ (₹)",
    language: "భాష",
    save: "సేవ్ చేయి",
    save_success: "సేవ్ చేయబడింది!",
    your_subscription: "మీ సబ్‌స్క్రిప్షన్",
    upgrade: "అప్‌గ్రేడ్",
    upgrade_hint: "మీ అవసరానికి తగిన ప్లాన్ ఎంచుకోండి",
    days_left: "రోజులు",
    next_renew: "తదుపరి పునరుద్ధరణ",
    renew: "పునరుద్ధరించు",
    buy_plan: "ప్లాన్ కొనండి",
    view_plans: "ప్లాన్‌లు చూడండి మరియు కొనండి",
    buy_subscription: "సబ్‌స్క్రిప్షన్ కొనండి",
    scan_qr_hint: "చెల్లించడానికి QR కోడ్ స్కాన్ చేయండి",
    or_pay_to_upi: "లేదా ఈ UPI ID కు చెల్లించండి",
    upload_screenshot: "చెల్లింపు స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి",
    upi_reference: "UPI సూచన / లావాదేవీ ID",
    submit_request: "అభ్యర్థన సమర్పించు",
    pending_requests: "పెండింగ్ అభ్యర్థనలు",
    no_requests: "అభ్యర్థనలు లేవు",
    approved: "ఆమోదించబడింది", rejected: "తిరస్కరించబడింది",
    approve: "ఆమోదించు", reject: "తిరస్కరించు",
    subscription_request: "సబ్‌స్క్రిప్షన్ అభ్యర్థన",
    your_balance: "మీ బ్యాలెన్స్",
    recent_txn: "ఇటీవలి లావాదేవీలు",
    no_txn: "లావాదేవీలు లేవు",
    phone: "ఫోన్ నంబర్",
    upi_id: "UPI ID",
    request_withdraw: "ఉపసంహరణ అభ్యర్థన",
    minimum_withdraw: "కనీస ఉపసంహరణ",
    scan_coupon: "కూపన్ స్కాన్",
    stop_scan: "స్కానర్ ఆపు",
    manual_entry: "మాన్యువల్ ఎంట్రీ",
    redeem: "రిడీమ్",
    coupon_code: "కూపన్ కోడ్",
    customer_phone: "వినియోగదారు ఫోన్",
    my_profile: "నా ప్రొఫైల్",
    name: "పేరు", company: "కంపెనీ",
    role: "పాత్ర",
    whatsapp: "వాట్సాప్",
    no_subscription_msg: "మీరు ఇంకా ఏ ప్లాన్ కొనలేదు.",
    subscription_ended_msg: "మీ సబ్‌స్క్రిప్షన్ ముగిసింది.",
    current_subscription: "మీ ప్రస్తుత సబ్‌స్క్రిప్షన్",
    status: "స్థితి",
    expiry_date: "గడువు తేదీ",
    loading: "లోడ్ అవుతోంది...",
    success: "విజయం!",
    error: "లోపం",
    please_wait: "దయచేసి వేచి ఉండండి...",
    are_you_sure: "మీరు ఖచ్చితంగా ఉన్నారా?",
    delete_success: "తొలగించబడింది!",
    invalid_phone: "10 అంకెల సరైన నంబర్ ఇవ్వండి",
    invalid_email: "సరైన ఇమెయిల్ ఇవ్వండి",
    weak_password: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు",
    password_mismatch: "పాస్‌వర్డ్‌లు సరిపోలలేదు",
    fill_all_fields: "అన్ని వివరాలు నింపండి",
    welcome: "స్వాగతం",
    your_role: "మీ పాత్ర",
    start: "ప్రారంభించు",
    cancel: "రద్దు",
    confirm: "నిర్ధారించు",
    close: "మూసివేయి",
    yes: "అవును", no: "కాదు",
    ok: "సరే"
  },

  // ============================================================
  // 🇮🇳 മലയാളം (Malayalam)
  // ============================================================
  ml: {
    home: "ഹോം", coupons: "കൂപ്പണുകൾ", users: "ഉപയോക്താക്കൾ", withdraw: "പിൻവലിക്കൽ",
    plan: "പ്ലാൻ", settings: "ക്രമീകരണങ്ങൾ", profile: "പ്രൊഫൈൽ",
    scan: "സ്കാൻ", wallet: "വാലറ്റ്", dashboard: "ഡാഷ്ബോർഡ്",
    logout: "ലോഗൗട്ട്", login: "ലോഗിൻ", register: "രജിസ്റ്റർ",
    email: "ഇമെയിൽ", password: "പാസ്‌വേഡ്",
    confirm_password: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    forgot_password: "പാസ്‌വേഡ് മറന്നോ?",
    login_btn: "ലോഗിൻ", register_btn: "രജിസ്റ്റർ",
    reset_password: "പാസ്‌വേഡ് പുനഃസജ്ജീകരിക്കുക",
    send_reset_link: "റീസെറ്റ് ലിങ്ക് അയയ്ക്കുക",
    who_are_you: "നിങ്ങൾ ആരാണ്?",
    company_name: "കമ്പനി പേര്",
    your_name: "നിങ്ങളുടെ പേര്",
    whatsapp_number: "വാട്ട്‌സ്ആപ്പ് നമ്പർ",
    admin_owner: "ബിസിനസ് ഉടമ", manufacturer: "നിർമ്മാതാവ്",
    wholesaler: "മൊത്തവ്യാപാരി", retailer: "ചില്ലറ വ്യാപാരി",
    mistri: "കൈത്തൊഴിലാളി", customer: "ഉപഭോക്താവ്",
    invite_code_option: "എന്റെ പക്കൽ Invite Code ഉണ്ട്",
    invite_code: "Invite Code",
    verify_code: "കോഡ് പരിശോധിക്കുക",
    back: "പിന്നോട്ട്",
    total_coupons: "ആകെ കൂപ്പണുകൾ", used_coupons: "ഉപയോഗിച്ചത്",
    customers: "ഉപഭോക്താക്കൾ", pending: "തീർപ്പാക്കാത്തത്",
    active: "സജീവം", trial: "ട്രയൽ", expired: "കാലഹരണപ്പെട്ടത്",
    no_subscription: "സബ്‌സ്‌ക്രിപ്ഷൻ ഇല്ല",
    subscription_ended: "സബ്‌സ്‌ക്രിപ്ഷൻ അവസാനിച്ചു",
    share_link: "ഉപഭോക്താക്കളുമായി ലിങ്ക് പങ്കിടുക",
    share_hint: "ഈ ലിങ്ക് ഉപഭോക്താക്കൾക്ക് അയയ്ക്കുക.",
    copy_link: "ലിങ്ക് പകർത്തുക",
    share_whatsapp: "വാട്ട്‌സ്ആപ്പിൽ പങ്കിടുക",
    copied: "പകർത്തി!",
    grades_prices: "ഗ്രേഡുകളും വിലകളും",
    no_grades: "ഗ്രേഡുകൾ ഇല്ല",
    grade_placeholder: "ഗ്രേഡ്",
    price_placeholder: "വില",
    add: "ചേർക്കുക",
    generate_coupons: "കൂപ്പണുകൾ സൃഷ്ടിക്കുക",
    select_grade: "ഗ്രേഡ് തിരഞ്ഞെടുക്കുക",
    quantity: "അളവ്",
    expiry: "കാലഹരണം",
    generate_btn: "സൃഷ്ടിക്കുക",
    recent_batch: "സമീപകാല ബാച്ച്",
    no_coupons: "ഇതുവരെ കൂപ്പണുകൾ ഇല്ല",
    print: "പ്രിന്റ്",
    download_pdf: "PDF ഡൗൺലോഡ്",
    code: "കോഡ്",
    team_management: "ടീം മാനേജ്‌മെന്റ്",
    team_management_hint: "പുതിയ ജീവനക്കാരെ ചേർക്കാൻ Invite Code സൃഷ്ടിക്കുക.",
    role_select: "റോൾ തിരഞ്ഞെടുക്കുക",
    expiry_days: "കോഡ് കാലഹരണം (ദിവസങ്ങൾ)",
    generate_code: "കോഡ് സൃഷ്ടിക്കുക",
    your_codes: "നിങ്ങളുടെ കോഡുകൾ",
    your_team: "നിങ്ങളുടെ ടീം അംഗങ്ങൾ",
    no_team_member: "ഇതുവരെ അംഗങ്ങൾ ഇല്ല",
    no_codes: "ഇതുവരെ കോഡുകൾ ഇല്ല",
    manager: "മാനേജർ", salesman: "സെയിൽസ്മാൻ",
    delivery_boy: "ഡെലിവറി ബോയ്", dispatch_boy: "ഡിസ്പാച്ച് ബോയ്",
    consignor: "കോൺസൈനർ",
    unused: "ഉപയോഗിക്കാത്തത്", used: "ഉപയോഗിച്ചത്",
    suspended: "സസ്പെൻഡ് ചെയ്തു",
    coupon_redeemed: "കൂപ്പൺ റിഡീം",
    total_points: "ആകെ പോയിന്റ്",
    joined: "ചേർന്നു",
    company_settings: "കമ്പനി ക്രമീകരണങ്ങൾ",
    helpline: "ഹെൽപ്‌ലൈൻ",
    footer_text: "ഫൂട്ടർ ടെക്സ്റ്റ്",
    withdrawal_min: "കുറഞ്ഞ പിൻവലിക്കൽ (₹)",
    language: "ഭാഷ",
    save: "സേവ് ചെയ്യുക",
    save_success: "സേവ് ചെയ്തു!",
    your_subscription: "നിങ്ങളുടെ സബ്‌സ്‌ക്രിപ്ഷൻ",
    upgrade: "അപ്‌ഗ്രേഡ്",
    upgrade_hint: "നിങ്ങളുടെ ആവശ്യത്തിനനുസരിച്ച് പ്ലാൻ തിരഞ്ഞെടുക്കുക",
    days_left: "ദിവസം",
    next_renew: "അടുത്ത പുതുക്കൽ",
    renew: "പുതുക്കുക",
    buy_plan: "പ്ലാൻ വാങ്ങുക",
    view_plans: "പ്ലാനുകൾ കാണുക, വാങ്ങുക",
    buy_subscription: "സബ്‌സ്‌ക്രിപ്ഷൻ വാങ്ങുക",
    scan_qr_hint: "പണമടയ്ക്കാൻ QR കോഡ് സ്കാൻ ചെയ്യുക",
    or_pay_to_upi: "അല്ലെങ്കിൽ ഈ UPI ID യിലേക്ക് അടയ്ക്കുക",
    upload_screenshot: "പേയ്‌മെന്റ് സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യുക",
    upi_reference: "UPI റഫറൻസ് / ട്രാൻസാക്ഷൻ ID",
    submit_request: "അഭ്യർത്ഥന സമർപ്പിക്കുക",
    pending_requests: "തീർപ്പാക്കാത്ത അഭ്യർത്ഥനകൾ",
    no_requests: "അഭ്യർത്ഥനകൾ ഇല്ല",
    approved: "അംഗീകരിച്ചു", rejected: "നിരസിച്ചു",
    approve: "അംഗീകരിക്കുക", reject: "നിരസിക്കുക",
    subscription_request: "സബ്‌സ്‌ക്രിപ്ഷൻ അഭ്യർത്ഥന",
    your_balance: "നിങ്ങളുടെ ബാലൻസ്",
    recent_txn: "സമീപകാല ഇടപാടുകൾ",
    no_txn: "ഇടപാടുകൾ ഇല്ല",
    phone: "ഫോൺ നമ്പർ",
    upi_id: "UPI ID",
    request_withdraw: "പിൻവലിക്കൽ അഭ്യർത്ഥന",
    minimum_withdraw: "കുറഞ്ഞ പിൻവലിക്കൽ",
    scan_coupon: "കൂപ്പൺ സ്കാൻ",
    stop_scan: "സ്കാനർ നിർത്തുക",
    manual_entry: "മാനുവൽ എൻട്രി",
    redeem: "റിഡീം",
    coupon_code: "കൂപ്പൺ കോഡ്",
    customer_phone: "ഉപഭോക്താവിന്റെ ഫോൺ",
    my_profile: "എന്റെ പ്രൊഫൈൽ",
    name: "പേര്", company: "കമ്പനി",
    role: "റോൾ",
    whatsapp: "വാട്ട്‌സ്ആപ്പ്",
    no_subscription_msg: "നിങ്ങൾ ഇതുവരെ ഒരു പ്ലാനും വാങ്ങിയിട്ടില്ല.",
    subscription_ended_msg: "നിങ്ങളുടെ സബ്‌സ്‌ക്രിപ്ഷൻ അവസാനിച്ചു.",
    current_subscription: "നിങ്ങളുടെ നിലവിലെ സബ്‌സ്‌ക്രിപ്ഷൻ",
    status: "സ്ഥിതി",
    expiry_date: "കാലഹരണ തീയതി",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    success: "വിജയം!",
    error: "പിശക്",
    please_wait: "കാത്തിരിക്കുക...",
    are_you_sure: "നിങ്ങൾക്ക് ഉറപ്പാണോ?",
    delete_success: "ഇല്ലാതാക്കി!",
    invalid_phone: "10 അക്ക സംഖ്യ നൽകുക",
    invalid_email: "ശരിയായ ഇമെയിൽ നൽകുക",
    weak_password: "പാസ്‌വേഡ് കുറഞ്ഞത് 6 അക്ഷരം",
    password_mismatch: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല",
    fill_all_fields: "എല്ലാ വിവരങ്ങളും നൽകുക",
    welcome: "സ്വാഗതം",
    your_role: "നിങ്ങളുടെ റോൾ",
    start: "ആരംഭിക്കുക",
    cancel: "റദ്ദാക്കുക",
    confirm: "സ്ഥിരീകരിക്കുക",
    close: "അടയ്ക്കുക",
    yes: "അതെ", no: "ഇല്ല",
    ok: "ശരി"
  }
};

// ============================================================
// STATE MANAGEMENT
// ============================================================

let currentLang = 'bn';
let observer = null;

// ============================================================
// BASIC FUNCTIONS
// ============================================================

export function t(key, lang = null) {
  const l = lang || currentLang;
  const dict = translations[l] || translations.bn;
  return dict[key] || translations.bn[key] || key;
}

export function getLanguage() {
  return currentLang;
}

export function initLanguage() {
  const saved = localStorage.getItem('app_lang') || 'bn';
  currentLang = saved;
  document.documentElement.lang = saved;
  if (saved === 'ur') document.documentElement.dir = 'rtl';
  return saved;
}

// ============================================================
// APPLY TRANSLATIONS (data-t সহ সব এলিমেন্টে)
// ============================================================

export function applyTranslations(lang = null) {
  const l = lang || currentLang;
  const dict = translations[l] || translations.bn;
  
  // data-t — text content
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        // শুধু text replace করো, child element রাখো
        const hasChildren = el.children.length > 0;
        if (!hasChildren) {
          el.textContent = dict[key];
        } else {
          // child element থাকলে শুধু text node পরিবর্তন করো
          let replaced = false;
          el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && !replaced) {
              node.textContent = dict[key];
              replaced = true;
            }
          });
        }
      }
    }
  });
  
  // data-t-ph — placeholder
  document.querySelectorAll('[data-t-ph]').forEach(el => {
    const key = el.getAttribute('data-t-ph');
    if (dict[key]) el.placeholder = dict[key];
  });
  
  // data-t-title — title attribute
  document.querySelectorAll('[data-t-title]').forEach(el => {
    const key = el.getAttribute('data-t-title');
    if (dict[key]) el.title = dict[key];
  });
  
  // select-এর option টেক্সট
  document.querySelectorAll('select[data-t-select]').forEach(select => {
    const prefix = select.getAttribute('data-t-select');
    select.querySelectorAll('option').forEach(opt => {
      const key = opt.getAttribute('data-t');
      if (key && dict[key]) opt.textContent = dict[key];
    });
  });
}

// ============================================================
// SMART AUTO-TAG — বাংলা টেক্সট চিনে data-t যোগ করে
// ============================================================

let BN_REVERSE_MAP = null;

function buildBengaliReverseMap() {
  const map = {};
  Object.entries(translations.bn).forEach(([key, value]) => {
    if (typeof value !== 'string') return;
    // পুরো মান
    map[value.trim()] = key;
    // ইমোজি/স্পেস বাদ দিয়ে
    const cleanValue = value.replace(/[\p{Emoji}\s]+/gu, '').trim();
    if (cleanValue) map[cleanValue] = key;
  });
  return map;
}

export function autoTagTranslations() {
  if (!BN_REVERSE_MAP) BN_REVERSE_MAP = buildBengaliReverseMap();
  
  let taggedCount = 0;
  
  // ১. সব Text Node
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const text = node.textContent.trim();
        if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') 
          return NodeFilter.FILTER_REJECT;
        if (parent.hasAttribute('data-t') || parent.hasAttribute('data-t-ph')) 
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  const nodesToProcess = [];
  let node;
  while ((node = walker.nextNode())) {
    const original = node.textContent;
    const trimmed = original.trim();
    
    // সরাসরি ম্যাচ
    let key = BN_REVERSE_MAP[trimmed];
    
    // ইমোজি বাদ দিয়ে ম্যাচ
    if (!key) {
      const withoutEmoji = trimmed.replace(/[\p{Emoji}\s]+/gu, '').trim();
      key = BN_REVERSE_MAP[withoutEmoji];
    }
    
    // কেস-ইনসেনসিটিভ ম্যাচ
    if (!key) {
      const lower = trimmed.toLowerCase();
      key = Object.keys(BN_REVERSE_MAP).find(k => k.toLowerCase() === lower);
      if (key) key = BN_REVERSE_MAP[key];
    }
    
    if (key) nodesToProcess.push({ node, key, original });
  }
  
  // এখন span দিয়ে wrap করি
  nodesToProcess.forEach(({ node, key, original }) => {
    try {
      const span = document.createElement('span');
      span.setAttribute('data-t', key);
      span.textContent = original.trim();
      if (node.parentNode) {
        node.parentNode.replaceChild(span, node);
        taggedCount++;
      }
    } catch (e) {
      // ignore
    }
  });
  
  console.log(`✅ Auto-tagged ${taggedCount} text nodes`);
  return taggedCount;
}

// ============================================================
// AUTO-TAG Placeholders
// ============================================================

export function autoTagPlaceholders() {
  if (!BN_REVERSE_MAP) BN_REVERSE_MAP = buildBengaliReverseMap();
  
  let count = 0;
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    if (el.hasAttribute('data-t-ph')) return;
    const ph = el.getAttribute('placeholder').trim();
    if (!ph) return;
    
    let key = BN_REVERSE_MAP[ph];
    if (!key) {
      const clean = ph.replace(/[\p{Emoji}\s]+/gu, '').trim();
      key = BN_REVERSE_MAP[clean];
    }
    
    if (key) {
      el.setAttribute('data-t-ph', key);
      count++;
    }
  });
  
  console.log(`✅ Auto-tagged ${count} placeholders`);
  return count;
}

// ============================================================
// SET LANGUAGE + APPLY
// ============================================================

export function setLanguage(lang) {
  if (!translations[lang]) return false;
  
  currentLang = lang;
  localStorage.setItem('app_lang', lang);
  document.documentElement.lang = lang;
  
  if (lang === 'ur') {
    document.documentElement.dir = 'rtl';
    document.body.style.direction = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
    document.body.style.direction = 'ltr';
  }
  
  applyTranslations(lang);
  return true;
}

// ============================================================
// AUTO-TRANSLATE ALL — সব কিছু একসাথে
// ============================================================

export function autoTranslateAll() {
  autoTagTranslations();
  autoTagPlaceholders();
  applyTranslations();
}

// ============================================================
// MUTATION OBSERVER — নতুন কনটেন্ট অটো ট্যাগ করে
// ============================================================

export function startMutationObserver() {
  if (observer) return;
  
  observer = new MutationObserver((mutations) => {
    let hasNewNodes = false;
    mutations.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === Node.ELEMENT_NODE) {
          // Modal বা অনুরূপ বড় ব্লক হলে
          if (n.querySelectorAll && n.querySelectorAll('*').length > 3) {
            hasNewNodes = true;
          }
        }
      });
    });
    
    if (hasNewNodes) {
      // debounce — একবারে অনেক পরিবর্তন এলে
      clearTimeout(window._mutationDebounce);
      window._mutationDebounce = setTimeout(() => {
        autoTagTranslations();
        autoTagPlaceholders();
        applyTranslations();
      }, 300);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('👁️ MutationObserver started');
}

export function stopMutationObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
