// ============================================================
// i18n.js - Multi-Language Support
// ১০টি ভাষা: বাংলা, English, हिन्दी, ଓଡ଼ିଆ, اردو, ગુજરાતી,
//              मराठी, தமிழ், తెలుగు, മലയാളം
// ============================================================

export const LANGUAGES = [
  { code: 'bn', name: 'বাংলা',   flag: '🇧🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी',   flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ',    flag: '🇮🇳' },
  { code: 'ur', name: 'اردو',    flag: '🇵🇰' },
  { code: 'gu', name: 'ગુજરાતી',  flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी',    flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்',    flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు',   flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം',  flag: '🇮🇳' }
];

export const translations = {

  // ============================================================
  // 🇧🇩 বাংলা (Bengali)
  // ============================================================
  bn: {
    // Navigation
    home: "হোম", coupons: "কুপন", users: "ইউজার", withdraw: "প্রত্যাহার",
    plan: "প্ল্যান", settings: "সেটিংস", profile: "প্রোফাইল",
    scan: "স্ক্যান", wallet: "ওয়ালেট", dashboard: "ড্যাশবোর্ড",
    // Auth
    login: "লগইন", register: "রেজিস্ট্রেশন", logout: "লগআউট",
    email: "ইমেইল", password: "পাসওয়ার্ড", confirm_password: "পাসওয়ার্ড নিশ্চিত করুন",
    forgot_password: "পাসওয়ার্ড ভুলে গেছেন?",
    // Register
    who_are_you: "আপনি কে?", company_name: "কোম্পানির নাম", your_name: "আপনার নাম",
    whatsapp_number: "হোয়াটসঅ্যাপ নাম্বার",
    admin_owner: "ব্যবসার মালিক", manufacturer: "উৎপাদনকারী",
    wholesaler: "পাইকার", retailer: "খুচরা বিক্রেতা",
    mistri: "কারিগর", customer: "গ্রাহক", invite_code_option: "আমার Invite Code আছে",
    // Dashboard Stats
    total_coupons: "মোট কুপন", used_coupons: "ব্যবহৃত", customers: "কাস্টমার",
    pending: "অপেক্ষমাণ", active: "সক্রিয়", trial: "ট্রায়াল", expired: "মেয়াদ শেষ",
    // Share
    share_link: "কাস্টমারদের সাথে লিংক শেয়ার করুন",
    copy_link: "লিংক কপি", share_whatsapp: "হোয়াটসঅ্যাপে শেয়ার",
    // Grades
    grades_prices: "গ্রেড ও মূল্য", no_grades: "কোনো গ্রেড নেই",
    grade_placeholder: "গ্রেড (যেমন T1 20Kg)", price_placeholder: "মূল্য",
    // Coupons
    generate_coupons: "কুপন তৈরি করুন", select_grade: "গ্রেড সিলেক্ট",
    quantity: "পরিমাণ", expiry: "মেয়াদ", generate_btn: "তৈরি করুন",
    recent_batch: "সাম্প্রতিক ব্যাচ", no_coupons: "এখনো কুপন নেই",
    print: "প্রিন্ট", download_pdf: "PDF ডাউনলোড",
    // Team
    team_management: "টিম ম্যানেজমেন্ট",
    team_management_hint: "নতুন কর্মী যোগ করতে Invite Code তৈরি করুন।",
    role_select: "রোল সিলেক্ট", expiry_days: "কোডের মেয়াদ (দিন)",
    generate_code: "কোড তৈরি করুন", your_codes: "আপনার কোডগুলো",
    your_team: "আপনার টিম মেম্বার", no_team_member: "এখনো কোনো টিম মেম্বার নেই",
    manager: "ম্যানেজার", salesman: "সেলসম্যান",
    delivery_boy: "ডেলিভারি বয়", dispatch_boy: "ডিসপ্যাচ বয়",
    consignor: "কনসাইনার",
    unused: "অব্যবহৃত", used: "ব্যবহৃত",
    // Invite Verify
    invite_code_title: "Invite Code দিয়ে যোগ দিন",
    invite_code_hint: "আপনার কোম্পানির অ্যাডমিন আপনাকে একটি কোড দিয়েছেন",
    verify_code: "কোড যাচাই করুন",
    // Settings
    company_settings: "কোম্পানির সেটিংস", helpline: "হেল্পলাইন",
    footer_text: "ফুটার টেক্সট", withdrawal_min: "ন্যূনতম প্রত্যাহার (₹)",
    language: "ভাষা", save: "সেভ করুন",
    // Subscription
    your_subscription: "আপনার সাবস্ক্রিপশন", upgrade: "আপগ্রেড করুন",
    days_left: "দিন", next_renew: "পরবর্তী রিনিউ", renew: "রিনিউ করুন",
    no_subscription: "কোনো সাবস্ক্রিপশন নেই",
    subscription_ended: "সাবস্ক্রিপশন শেষ",
    buy_plan: "প্ল্যান কিনুন", view_plans: "প্ল্যান দেখুন এবং কিনুন",
    buy_subscription: "সাবস্ক্রিপশন কিনুন",
    scan_qr_hint: "QR কোড স্ক্যান করে টাকা পাঠান",
    upload_screenshot: "পেমেন্টের স্ক্রিনশট আপলোড করুন",
    upi_reference: "UPI Reference / Transaction ID",
    submit_request: "অনুরোধ জমা দিন",
    pending_requests: "অপেক্ষমাণ অনুরোধ", no_requests: "কোনো অনুরোধ নেই",
    approved: "অনুমোদিত", rejected: "প্রত্যাখ্যাত",
    approve: "অনুমোদন", reject: "প্রত্যাখ্যান",
    // Wallet
    your_balance: "আপনার ব্যালেন্স", recent_txn: "সাম্প্রতিক লেনদেন",
    no_txn: "কোনো লেনদেন নেই", phone: "মোবাইল নাম্বার",
    upi_id: "UPI আইডি", request_withdraw: "প্রত্যাহার অনুরোধ",
    // Scan
    scan_coupon: "কুপন স্ক্যান করুন", stop_scan: "স্ক্যানার বন্ধ",
    manual_entry: "ম্যানুয়াল এন্ট্রি", redeem: "রিডিম করুন",
    coupon_code: "কুপন কোড", customer_phone: "কাস্টমারের ফোন নাম্বার",
    // Profile
    my_profile: "আমার প্রোফাইল", name: "নাম", company: "কোম্পানি",
    role: "রোল", joined: "যোগদান",
    // Common Messages
    loading: "লোড হচ্ছে...", success: "সফল!", error: "এরর",
    please_wait: "অপেক্ষা করুন...", are_you_sure: "আপনি নিশ্চিত?",
    save_success: "সেভ হয়েছে!", delete_success: "মুছে ফেলা হয়েছে!",
    invalid_phone: "সঠিক ১০ ডিজিটের নাম্বার দিন",
    invalid_email: "সঠিক ইমেইল দিন", weak_password: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর",
    password_mismatch: "পাসওয়ার্ড দুইটি মিলছে না",
    fill_all_fields: "সব তথ্য দিন", copied: "কপি হয়েছে!",
    welcome: "স্বাগতম", your_role: "আপনার ভূমিকা"
  },

  // ============================================================
  // 🇬🇧 English
  // ============================================================
  en: {
    home: "Home", coupons: "Coupons", users: "Users", withdraw: "Withdraw",
    plan: "Plan", settings: "Settings", profile: "Profile",
    scan: "Scan", wallet: "Wallet", dashboard: "Dashboard",
    login: "Login", register: "Register", logout: "Logout",
    email: "Email", password: "Password", confirm_password: "Confirm Password",
    forgot_password: "Forgot Password?",
    who_are_you: "Who are you?", company_name: "Company Name", your_name: "Your Name",
    whatsapp_number: "WhatsApp Number",
    admin_owner: "Business Owner", manufacturer: "Manufacturer",
    wholesaler: "Wholesaler", retailer: "Retailer",
    mistri: "Craftsman", customer: "Customer", invite_code_option: "I have an Invite Code",
    total_coupons: "Total Coupons", used_coupons: "Used", customers: "Customers",
    pending: "Pending", active: "Active", trial: "Trial", expired: "Expired",
    share_link: "Share Link with Customers", copy_link: "Copy Link",
    share_whatsapp: "Share on WhatsApp",
    grades_prices: "Grades & Prices", no_grades: "No grades yet",
    grade_placeholder: "Grade (e.g. T1 20Kg)", price_placeholder: "Price",
    generate_coupons: "Generate Coupons", select_grade: "Select Grade",
    quantity: "Quantity", expiry: "Expiry", generate_btn: "Generate",
    recent_batch: "Recent Batch", no_coupons: "No coupons yet",
    print: "Print", download_pdf: "Download PDF",
    team_management: "Team Management",
    team_management_hint: "Create Invite Code to add new staff.",
    role_select: "Select Role", expiry_days: "Code Expiry (days)",
    generate_code: "Generate Code", your_codes: "Your Codes",
    your_team: "Your Team Members", no_team_member: "No team members yet",
    manager: "Manager", salesman: "Salesman",
    delivery_boy: "Delivery Boy", dispatch_boy: "Dispatch Boy",
    consignor: "Consignor",
    unused: "Unused", used: "Used",
    invite_code_title: "Join with Invite Code",
    invite_code_hint: "Your company admin gave you a code",
    verify_code: "Verify Code",
    company_settings: "Company Settings", helpline: "Helpline",
    footer_text: "Footer Text", withdrawal_min: "Minimum Withdrawal (₹)",
    language: "Language", save: "Save",
    your_subscription: "Your Subscription", upgrade: "Upgrade",
    days_left: "days", next_renew: "Next Renew", renew: "Renew",
    no_subscription: "No Subscription",
    subscription_ended: "Subscription Ended",
    buy_plan: "Buy Plan", view_plans: "View Plans & Buy",
    buy_subscription: "Buy Subscription",
    scan_qr_hint: "Scan the QR code to pay",
    upload_screenshot: "Upload Payment Screenshot",
    upi_reference: "UPI Reference / Transaction ID",
    submit_request: "Submit Request",
    pending_requests: "Pending Requests", no_requests: "No requests",
    approved: "Approved", rejected: "Rejected",
    approve: "Approve", reject: "Reject",
    your_balance: "Your Balance", recent_txn: "Recent Transactions",
    no_txn: "No transactions", phone: "Phone Number",
    upi_id: "UPI ID", request_withdraw: "Request Withdrawal",
    scan_coupon: "Scan Coupon", stop_scan: "Stop Scanner",
    manual_entry: "Manual Entry", redeem: "Redeem",
    coupon_code: "Coupon Code", customer_phone: "Customer Phone",
    my_profile: "My Profile", name: "Name", company: "Company",
    role: "Role", joined: "Joined",
    loading: "Loading...", success: "Success!", error: "Error",
    please_wait: "Please wait...", are_you_sure: "Are you sure?",
    save_success: "Saved!", delete_success: "Deleted!",
    invalid_phone: "Enter valid 10-digit number",
    invalid_email: "Enter valid email", weak_password: "Password min 6 characters",
    password_mismatch: "Passwords do not match",
    fill_all_fields: "Fill all fields", copied: "Copied!",
    welcome: "Welcome", your_role: "Your Role"
  },

  // ============================================================
  // 🇮🇳 हिन्दी (Hindi)
  // ============================================================
  hi: {
    home: "होम", coupons: "कूपन", users: "उपयोगकर्ता", withdraw: "निकासी",
    plan: "प्लान", settings: "सेटिंग्स", profile: "प्रोफ़ाइल",
    scan: "स्कैन", wallet: "वॉलेट", dashboard: "डैशबोर्ड",
    login: "लॉगिन", register: "रजिस्टर", logout: "लॉगआउट",
    email: "ईमेल", password: "पासवर्ड", confirm_password: "पासवर्ड की पुष्टि करें",
    forgot_password: "पासवर्ड भूल गए?",
    who_are_you: "आप कौन हैं?", company_name: "कंपनी का नाम", your_name: "आपका नाम",
    whatsapp_number: "व्हाट्सएप नंबर",
    admin_owner: "व्यवसाय के मालिक", manufacturer: "निर्माता",
    wholesaler: "थोक विक्रेता", retailer: "खुदरा विक्रेता",
    mistri: "कारीगर", customer: "ग्राहक", invite_code_option: "मेरे पास इनवाइट कोड है",
    total_coupons: "कुल कूपन", used_coupons: "उपयोग किए", customers: "ग्राहक",
    pending: "लंबित", active: "सक्रिय", trial: "परीक्षण", expired: "समाप्त",
    share_link: "ग्राहकों के साथ लिंक साझा करें", copy_link: "लिंक कॉपी करें",
    share_whatsapp: "व्हाट्सएप पर साझा करें",
    grades_prices: "ग्रेड और मूल्य", no_grades: "कोई ग्रेड नहीं",
    grade_placeholder: "ग्रेड (जैसे T1 20Kg)", price_placeholder: "मूल्य",
    generate_coupons: "कूपन बनाएं", select_grade: "ग्रेड चुनें",
    quantity: "मात्रा", expiry: "समाप्ति", generate_btn: "बनाएं",
    recent_batch: "हाल का बैच", no_coupons: "अभी कोई कूपन नहीं",
    print: "प्रिंट", download_pdf: "PDF डाउनलोड",
    team_management: "टीम प्रबंधन",
    team_management_hint: "नया स्टाफ जोड़ने के लिए Invite Code बनाएं।",
    role_select: "भूमिका चुनें", expiry_days: "कोड समाप्ति (दिन)",
    generate_code: "कोड बनाएं", your_codes: "आपके कोड",
    your_team: "आपके टीम सदस्य", no_team_member: "अभी कोई टीम सदस्य नहीं",
    manager: "मैनेजर", salesman: "सेल्समैन",
    delivery_boy: "डिलीवरी बॉय", dispatch_boy: "डिस्पैच बॉय",
    consignor: "कंसाइनर",
    unused: "अप्रयुक्त", used: "प्रयुक्त",
    invite_code_title: "Invite Code से जुड़ें",
    invite_code_hint: "आपकी कंपनी के एडमिन ने आपको कोड दिया है",
    verify_code: "कोड सत्यापित करें",
    company_settings: "कंपनी सेटिंग्स", helpline: "हेल्पलाइन",
    footer_text: "फुटर टेक्स्ट", withdrawal_min: "न्यूनतम निकासी (₹)",
    language: "भाषा", save: "सेव करें",
    your_subscription: "आपकी सदस्यता", upgrade: "अपग्रेड करें",
    days_left: "दिन", next_renew: "अगली नवीनीकरण", renew: "नवीनीकरण",
    no_subscription: "कोई सदस्यता नहीं",
    subscription_ended: "सदस्यता समाप्त",
    buy_plan: "प्लान खरीदें", view_plans: "प्लान देखें और खरीदें",
    buy_subscription: "सदस्यता खरीदें",
    scan_qr_hint: "भुगतान के लिए QR कोड स्कैन करें",
    upload_screenshot: "भुगतान स्क्रीनशॉट अपलोड करें",
    upi_reference: "UPI संदर्भ / ट्रांजैक्शन ID",
    submit_request: "अनुरोध भेजें",
    pending_requests: "लंबित अनुरोध", no_requests: "कोई अनुरोध नहीं",
    approved: "स्वीकृत", rejected: "अस्वीकृत",
    approve: "स्वीकारें", reject: "अस्वीकारें",
    your_balance: "आपका बैलेंस", recent_txn: "हाल के लेनदेन",
    no_txn: "कोई लेनदेन नहीं", phone: "फ़ोन नंबर",
    upi_id: "UPI ID", request_withdraw: "निकासी का अनुरोध",
    scan_coupon: "कूपन स्कैन करें", stop_scan: "स्कैनर बंद करें",
    manual_entry: "मैन्युअल एंट्री", redeem: "रिडीम करें",
    coupon_code: "कूपन कोड", customer_phone: "ग्राहक का फ़ोन",
    my_profile: "मेरी प्रोफ़ाइल", name: "नाम", company: "कंपनी",
    role: "भूमिका", joined: "जुड़े",
    loading: "लोड हो रहा है...", success: "सफल!", error: "त्रुटि",
    please_wait: "कृपया प्रतीक्षा करें...", are_you_sure: "क्या आप निश्चित हैं?",
    save_success: "सेव हो गया!", delete_success: "हटा दिया गया!",
    invalid_phone: "10 अंकों का सही नंबर दर्ज करें",
    invalid_email: "सही ईमेल दर्ज करें", weak_password: "पासवर्ड कम से कम 6 अक्षर",
    password_mismatch: "पासवर्ड मेल नहीं खाते",
    fill_all_fields: "सभी फ़ील्ड भरें", copied: "कॉपी हो गया!",
    welcome: "स्वागत", your_role: "आपकी भूमिका"
  },

  // ============================================================
  // 🇮🇳 ଓଡ଼ିଆ (Odia)
  // ============================================================
  or: {
    home: "ହୋମ", coupons: "କୁପନ", users: "ଉପଭୋକ୍ତା", withdraw: "ଉତ୍ତୋଳନ",
    plan: "ଯୋଜନା", settings: "ସେଟିଂସ", profile: "ପ୍ରୋଫାଇଲ",
    scan: "ସ୍କାନ", wallet: "ୱାଲେଟ", dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    login: "ଲଗଇନ", register: "ପଞ୍ଜିକରଣ", logout: "ଲଗଆଉଟ",
    email: "ଇମେଲ", password: "ପାସୱାର୍ଡ", confirm_password: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    forgot_password: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ?",
    who_are_you: "ଆପଣ କିଏ?", company_name: "କମ୍ପାନୀ ନାମ", your_name: "ଆପଣଙ୍କ ନାମ",
    whatsapp_number: "ହ୍ୱାଟସଆପ ନମ୍ବର",
    admin_owner: "ବ୍ୟବସାୟ ମାଲିକ", manufacturer: "ଉତ୍ପାଦକ",
    wholesaler: "ପାଇକାରୀ", retailer: "ଖୁଚୁରା ବିକ୍ରେତା",
    mistri: "କାରିଗର", customer: "ଗ୍ରାହକ", invite_code_option: "ମୋର ଇନଭାଇଟ କୋଡ ଅଛି",
    total_coupons: "ମୋଟ କୁପନ", used_coupons: "ବ୍ୟବହୃତ", customers: "ଗ୍ରାହକ",
    pending: "ବିଚାରାଧୀନ", active: "ସକ୍ରିୟ", trial: "ପରୀକ୍ଷଣ", expired: "ସମାପ୍ତ",
    share_link: "ଗ୍ରାହକଙ୍କ ସହ ଲିଙ୍କ ଅଂଶୀଦାର କରନ୍ତୁ", copy_link: "ଲିଙ୍କ କପି",
    share_whatsapp: "ହ୍ୱାଟସଆପରେ ଅଂଶୀଦାର",
    grades_prices: "ଗ୍ରେଡ ଏବଂ ମୂଲ୍ୟ", no_grades: "କୌଣସି ଗ୍ରେଡ ନାହିଁ",
    grade_placeholder: "ଗ୍ରେଡ (ଯଥା T1 20Kg)", price_placeholder: "ମୂଲ୍ୟ",
    generate_coupons: "କୁପନ ତିଆରି କରନ୍ତୁ", select_grade: "ଗ୍ରେଡ ଚୟନ",
    quantity: "ପରିମାଣ", expiry: "ସମାପ୍ତି", generate_btn: "ତିଆରି",
    recent_batch: "ସାମ୍ପ୍ରତିକ ବ୍ୟାଚ", no_coupons: "ଏବେ କୌଣସି କୁପନ ନାହିଁ",
    print: "ପ୍ରିଣ୍ଟ", download_pdf: "PDF ଡାଉନଲୋଡ",
    team_management: "ଟିମ ପରିଚାଳନା",
    team_management_hint: "ନୂତନ କର୍ମଚାରୀ ଯୋଡିବାକୁ Invite Code ତିଆରି କରନ୍ତୁ।",
    role_select: "ଭୂମିକା ଚୟନ", expiry_days: "କୋଡ ସମାପ୍ତି (ଦିନ)",
    generate_code: "କୋଡ ତିଆରି", your_codes: "ଆପଣଙ୍କ କୋଡ",
    your_team: "ଆପଣଙ୍କ ଟିମ ସଦସ୍ୟ", no_team_member: "ଏବେ କୌଣସି ସଦସ୍ୟ ନାହିଁ",
    manager: "ମ୍ୟାନେଜର", salesman: "ବିକ୍ରେତା",
    delivery_boy: "ଡେଲିଭରୀ ବୟ", dispatch_boy: "ଡିସପ୍ୟାଚ ବୟ",
    consignor: "କନସାଇନର",
    unused: "ଅବ୍ୟବହୃତ", used: "ବ୍ୟବହୃତ",
    invite_code_title: "Invite Code ସହ ଯୋଡନ୍ତୁ",
    invite_code_hint: "ଆପଣଙ୍କ କମ୍ପାନୀ ଆଡମିନ ଆପଣଙ୍କୁ ଏକ କୋଡ ଦେଇଛନ୍ତି",
    verify_code: "କୋଡ ଯାଞ୍ଚ କରନ୍ତୁ",
    company_settings: "କମ୍ପାନୀ ସେଟିଂସ", helpline: "ହେଲ୍ପଲାଇନ",
    footer_text: "ଫୁଟର ଟେକ୍ସଟ", withdrawal_min: "ସର୍ବନିମ୍ନ ଉତ୍ତୋଳନ (₹)",
    language: "ଭାଷା", save: "ସେଭ କରନ୍ତୁ",
    your_subscription: "ଆପଣଙ୍କ ସବସ୍କ୍ରିପସନ", upgrade: "ଅପଗ୍ରେଡ",
    days_left: "ଦିନ", next_renew: "ପରବର୍ତ୍ତୀ ନବୀକରଣ", renew: "ନବୀକରଣ",
    no_subscription: "କୌଣସି ସବସ୍କ୍ରିପସନ ନାହିଁ",
    subscription_ended: "ସବସ୍କ୍ରିପସନ ସମାପ୍ତ",
    buy_plan: "ଯୋଜନା କିଣନ୍ତୁ", view_plans: "ଯୋଜନା ଦେଖନ୍ତୁ ଏବଂ କିଣନ୍ତୁ",
    buy_subscription: "ସବସ୍କ୍ରିପସନ କିଣନ୍ତୁ",
    scan_qr_hint: "ଦେୟ ଦେବାକୁ QR କୋଡ ସ୍କାନ କରନ୍ତୁ",
    upload_screenshot: "ଦେୟ ସ୍କ୍ରିନସଟ ଅପଲୋଡ କରନ୍ତୁ",
    upi_reference: "UPI ରେଫରେନ୍ସ / ଟ୍ରାଞ୍ଜାକ୍ସନ ID",
    submit_request: "ଅନୁରୋଧ ଦାଖଲ",
    pending_requests: "ବିଚାରାଧୀନ ଅନୁରୋଧ", no_requests: "କୌଣସି ଅନୁରୋଧ ନାହିଁ",
    approved: "ଅନୁମୋଦିତ", rejected: "ପ୍ରତ୍ୟାଖ୍ୟାତ",
    approve: "ଅନୁମୋଦନ", reject: "ପ୍ରତ୍ୟାଖ୍ୟାନ",
    your_balance: "ଆପଣଙ୍କ ବାଲାନ୍ସ", recent_txn: "ସାମ୍ପ୍ରତିକ କାରବାର",
    no_txn: "କୌଣସି କାରବାର ନାହିଁ", phone: "ଫୋନ ନମ୍ବର",
    upi_id: "UPI ID", request_withdraw: "ଉତ୍ତୋଳନ ଅନୁରୋଧ",
    scan_coupon: "କୁପନ ସ୍କାନ କରନ୍ତୁ", stop_scan: "ସ୍କାନର ବନ୍ଦ",
    manual_entry: "ମାନୁଆଲ ଏଣ୍ଟ୍ରି", redeem: "ରିଡିମ",
    coupon_code: "କୁପନ କୋଡ", customer_phone: "ଗ୍ରାହକ ଫୋନ",
    my_profile: "ମୋର ପ୍ରୋଫାଇଲ", name: "ନାମ", company: "କମ୍ପାନୀ",
    role: "ଭୂମିକା", joined: "ଯୋଡିଛନ୍ତି",
    loading: "ଲୋଡ ହେଉଛି...", success: "ସଫଳ!", error: "ତ୍ରୁଟି",
    please_wait: "ଅପେକ୍ଷା କରନ୍ତୁ...", are_you_sure: "ଆପଣ ନିଶ୍ଚିତ?",
    save_success: "ସେଭ ହୋଇଛି!", delete_success: "ବିଲୋପ ହୋଇଛି!",
    invalid_phone: "10 ଅଙ୍କର ସଠିକ ନମ୍ବର ଦିଅନ୍ତୁ",
    invalid_email: "ସଠିକ ଇମେଲ ଦିଅନ୍ତୁ", weak_password: "ପାସୱାର୍ଡ ଅତି କମ 6 ଅକ୍ଷର",
    password_mismatch: "ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ",
    fill_all_fields: "ସମସ୍ତ ତଥ୍ୟ ଦିଅନ୍ତୁ", copied: "କପି ହୋଇଛି!",
    welcome: "ସ୍ୱାଗତ", your_role: "ଆପଣଙ୍କ ଭୂମିକା"
  },

  // ============================================================
  // 🇵🇰 اردو (Urdu) - RTL
  // ============================================================
  ur: {
    home: "ہوم", coupons: "کوپن", users: "صارفین", withdraw: "نکاسی",
    plan: "پلان", settings: "ترتیبات", profile: "پروفائل",
    scan: "اسکین", wallet: "والٹ", dashboard: "ڈیش بورڈ",
    login: "لاگ ان", register: "رجسٹر", logout: "لاگ آؤٹ",
    email: "ای میل", password: "پاس ورڈ", confirm_password: "پاس ورڈ کی تصدیق",
    forgot_password: "پاس ورڈ بھول گئے؟",
    who_are_you: "آپ کون ہیں؟", company_name: "کمپنی کا نام", your_name: "آپ کا نام",
    whatsapp_number: "واٹس ایپ نمبر",
    admin_owner: "کاروبار کا مالک", manufacturer: "مینوفیکچرر",
    wholesaler: "تھوک فروش", retailer: "خوردہ فروش",
    mistri: "کاریگر", customer: "گاہک", invite_code_option: "میرے پاس انوائٹ کوڈ ہے",
    total_coupons: "کل کوپن", used_coupons: "استعمال شدہ", customers: "گاہک",
    pending: "زیر التواء", active: "فعال", trial: "آزمائشی", expired: "میعاد ختم",
    share_link: "گاہکوں کے ساتھ لنک شیئر کریں", copy_link: "لنک کاپی کریں",
    share_whatsapp: "واٹس ایپ پر شیئر کریں",
    grades_prices: "گریڈ اور قیمت", no_grades: "کوئی گریڈ نہیں",
    grade_placeholder: "گریڈ (مثلاً T1 20Kg)", price_placeholder: "قیمت",
    generate_coupons: "کوپن بنائیں", select_grade: "گریڈ منتخب کریں",
    quantity: "مقدار", expiry: "میعاد", generate_btn: "بنائیں",
    recent_batch: "حالیہ بیچ", no_coupons: "ابھی کوئی کوپن نہیں",
    print: "پرنٹ", download_pdf: "PDF ڈاؤن لوڈ",
    team_management: "ٹیم مینجمنٹ",
    team_management_hint: "نیا عملہ شامل کرنے کے لیے Invite Code بنائیں۔",
    role_select: "کردار منتخب کریں", expiry_days: "کوڈ میعاد (دن)",
    generate_code: "کوڈ بنائیں", your_codes: "آپ کے کوڈز",
    your_team: "آپ کے ٹیم ممبران", no_team_member: "ابھی کوئی ممبر نہیں",
    manager: "منیجر", salesman: "سیلز مین",
    delivery_boy: "ڈیلیوری بوائے", dispatch_boy: "ڈسپیچ بوائے",
    consignor: "کنسائنر",
    unused: "غیر استعمال شدہ", used: "استعمال شدہ",
    invite_code_title: "Invite Code کے ساتھ شامل ہوں",
    invite_code_hint: "آپ کی کمپنی کے ایڈمن نے آپ کو کوڈ دیا ہے",
    verify_code: "کوڈ کی تصدیق کریں",
    company_settings: "کمپنی کی ترتیبات", helpline: "ہیلپ لائن",
    footer_text: "فوٹر ٹیکسٹ", withdrawal_min: "کم از کم نکاسی (₹)",
    language: "زبان", save: "محفوظ کریں",
    your_subscription: "آپ کی سبسکرپشن", upgrade: "اپ گریڈ",
    days_left: "دن", next_renew: "اگلی تجدید", renew: "تجدید",
    no_subscription: "کوئی سبسکرپشن نہیں",
    subscription_ended: "سبسکرپشن ختم",
    buy_plan: "پلان خریدیں", view_plans: "پلان دیکھیں اور خریدیں",
    buy_subscription: "سبسکرپشن خریدیں",
    scan_qr_hint: "ادائیگی کے لیے QR کوڈ اسکین کریں",
    upload_screenshot: "ادائیگی کا اسکرین شاٹ اپلوڈ کریں",
    upi_reference: "UPI حوالہ / ٹرانزیکشن ID",
    submit_request: "درخواست جمع کریں",
    pending_requests: "زیر التواء درخواستیں", no_requests: "کوئی درخواست نہیں",
    approved: "منظور شدہ", rejected: "مسترد",
    approve: "منظور کریں", reject: "مسترد کریں",
    your_balance: "آپ کا بیلنس", recent_txn: "حالیہ لین دین",
    no_txn: "کوئی لین دین نہیں", phone: "فون نمبر",
    upi_id: "UPI ID", request_withdraw: "نکاسی کی درخواست",
    scan_coupon: "کوپن اسکین کریں", stop_scan: "اسکینر بند کریں",
    manual_entry: "دستی اندراج", redeem: "ریڈیم",
    coupon_code: "کوپن کوڈ", customer_phone: "گاہک کا فون",
    my_profile: "میرا پروفائل", name: "نام", company: "کمپنی",
    role: "کردار", joined: "شامل ہوئے",
    loading: "لوڈ ہو رہا ہے...", success: "کامیاب!", error: "خرابی",
    please_wait: "براہ کرم انتظار کریں...", are_you_sure: "کیا آپ کو یقین ہے؟",
    save_success: "محفوظ ہو گیا!", delete_success: "حذف ہو گیا!",
    invalid_phone: "10 ہندسوں کا درست نمبر دیں",
    invalid_email: "درست ای میل دیں", weak_password: "پاس ورڈ کم از کم 6 حروف",
    password_mismatch: "پاس ورڈ مماثل نہیں",
    fill_all_fields: "تمام معلومات دیں", copied: "کاپی ہو گیا!",
    welcome: "خوش آمدید", your_role: "آپ کا کردار"
  },

  // ============================================================
  // 🇮🇳 ગુજરાતી (Gujarati)
  // ============================================================
  gu: {
    home: "હોમ", coupons: "કૂપન", users: "વપરાશકર્તાઓ", withdraw: "ઉપાડ",
    plan: "પ્લાન", settings: "સેટિંગ્સ", profile: "પ્રોફાઇલ",
    scan: "સ્કેન", wallet: "વોલેટ", dashboard: "ડેશબોર્ડ",
    login: "લોગિન", register: "રજિસ્ટર", logout: "લોગઆઉટ",
    email: "ઈમેલ", password: "પાસવર્ડ", confirm_password: "પાસવર્ડની પુષ્ટિ કરો",
    forgot_password: "પાસવર્ડ ભૂલી ગયા?",
    who_are_you: "તમે કોણ છો?", company_name: "કંપનીનું નામ", your_name: "તમારું નામ",
    whatsapp_number: "વોટ્સએપ નંબર",
    admin_owner: "વ્યવસાયના માલિક", manufacturer: "ઉત્પાદક",
    wholesaler: "જથ્થાબંધ વેપારી", retailer: "છૂટક વેપારી",
    mistri: "કારીગર", customer: "ગ્રાહક", invite_code_option: "મારી પાસે Invite Code છે",
    total_coupons: "કુલ કૂપન", used_coupons: "વપરાયેલ", customers: "ગ્રાહકો",
    pending: "બાકી", active: "સક્રિય", trial: "ટ્રાયલ", expired: "સમાપ્ત",
    share_link: "ગ્રાહકો સાથે લિંક શેર કરો", copy_link: "લિંક કોપી",
    share_whatsapp: "વોટ્સએપ પર શેર કરો",
    grades_prices: "ગ્રેડ અને ભાવ", no_grades: "કોઈ ગ્રેડ નથી",
    grade_placeholder: "ગ્રેડ (દા.ત. T1 20Kg)", price_placeholder: "ભાવ",
    generate_coupons: "કૂપન બનાવો", select_grade: "ગ્રેડ પસંદ કરો",
    quantity: "જથ્થો", expiry: "સમાપ્તિ", generate_btn: "બનાવો",
    recent_batch: "તાજેતરની બેચ", no_coupons: "હજી કોઈ કૂપન નથી",
    print: "પ્રિન્ટ", download_pdf: "PDF ડાઉનલોડ",
    team_management: "ટીમ મેનેજમેન્ટ",
    team_management_hint: "નવો સ્ટાફ ઉમેરવા Invite Code બનાવો.",
    role_select: "ભૂમિકા પસંદ કરો", expiry_days: "કોડ સમાપ્તિ (દિવસ)",
    generate_code: "કોડ બનાવો", your_codes: "તમારા કોડ",
    your_team: "તમારા ટીમ સભ્યો", no_team_member: "હજી કોઈ સભ્ય નથી",
    manager: "મેનેજર", salesman: "સેલ્સમેન",
    delivery_boy: "ડિલિવરી બોય", dispatch_boy: "ડિસ્પેચ બોય",
    consignor: "કન્સાઇનર",
    unused: "વણવપરાયેલ", used: "વપરાયેલ",
    invite_code_title: "Invite Code સાથે જોડાઓ",
    invite_code_hint: "તમારી કંપનીના એડમિને તમને કોડ આપ્યો છે",
    verify_code: "કોડ ચકાસો",
    company_settings: "કંપની સેટિંગ્સ", helpline: "હેલ્પલાઇન",
    footer_text: "ફૂટર ટેક્સ્ટ", withdrawal_min: "ન્યૂનતમ ઉપાડ (₹)",
    language: "ભાષા", save: "સેવ કરો",
    your_subscription: "તમારી સબસ્ક્રિપ્શન", upgrade: "અપગ્રેડ",
    days_left: "દિવસ", next_renew: "આગળનું નવીકરણ", renew: "નવીકરણ",
    no_subscription: "કોઈ સબસ્ક્રિપ્શન નથી",
    subscription_ended: "સબસ્ક્રિપ્શન સમાપ્ત",
    buy_plan: "પ્લાન ખરીદો", view_plans: "પ્લાન જુઓ અને ખરીદો",
    buy_subscription: "સબસ્ક્રિપ્શન ખરીદો",
    scan_qr_hint: "ચૂકવણી માટે QR કોડ સ્કેન કરો",
    upload_screenshot: "ચૂકવણી સ્ક્રીનશોટ અપલોડ કરો",
    upi_reference: "UPI સંદર્ભ / ટ્રાન્ઝેક્શન ID",
    submit_request: "વિનંતી સબમિટ કરો",
    pending_requests: "બાકી વિનંતીઓ", no_requests: "કોઈ વિનંતી નથી",
    approved: "મંજૂર", rejected: "અસ્વીકૃત",
    approve: "મંજૂર કરો", reject: "અસ્વીકારો",
    your_balance: "તમારું બેલેન્સ", recent_txn: "તાજેતરના વ્યવહારો",
    no_txn: "કોઈ વ્યવહાર નથી", phone: "ફોન નંબર",
    upi_id: "UPI ID", request_withdraw: "ઉપાડ વિનંતી",
    scan_coupon: "કૂપન સ્કેન કરો", stop_scan: "સ્કેનર બંધ કરો",
    manual_entry: "મેન્યુઅલ એન્ટ્રી", redeem: "રિડીમ",
    coupon_code: "કૂપન કોડ", customer_phone: "ગ્રાહકનો ફોન",
    my_profile: "મારી પ્રોફાઇલ", name: "નામ", company: "કંપની",
    role: "ભૂમિકા", joined: "જોડાયા",
    loading: "લોડ થઈ રહ્યું છે...", success: "સફળ!", error: "ભૂલ",
    please_wait: "કૃપા કરી રાહ જુઓ...", are_you_sure: "શું તમે ચોક્કસ છો?",
    save_success: "સેવ થયું!", delete_success: "કાઢી નાખ્યું!",
    invalid_phone: "10 અંકનો સાચો નંબર આપો",
    invalid_email: "સાચો ઈમેલ આપો", weak_password: "પાસવર્ડ ઓછામાં ઓછા 6 અક્ષર",
    password_mismatch: "પાસવર્ડ મેળ ખાતા નથી",
    fill_all_fields: "બધી માહિતી ભરો", copied: "કોપી થયું!",
    welcome: "સ્વાગત", your_role: "તમારી ભૂમિકા"
  },

  // ============================================================
  // 🇮🇳 मराठी (Marathi)
  // ============================================================
  mr: {
    home: "होम", coupons: "कूपन", users: "वापरकर्ते", withdraw: "पैसे काढा",
    plan: "प्लॅन", settings: "सेटिंग्ज", profile: "प्रोफाइल",
    scan: "स्कॅन", wallet: "वॉलेट", dashboard: "डॅशबोर्ड",
    login: "लॉगिन", register: "नोंदणी", logout: "लॉगआउट",
    email: "ईमेल", password: "पासवर्ड", confirm_password: "पासवर्डची पुष्टी करा",
    forgot_password: "पासवर्ड विसरला?",
    who_are_you: "तुम्ही कोण आहात?", company_name: "कंपनीचे नाव", your_name: "तुमचे नाव",
    whatsapp_number: "व्हॉट्सअॅप नंबर",
    admin_owner: "व्यवसाय मालक", manufacturer: "उत्पादक",
    wholesaler: "घाऊक विक्रेता", retailer: "किरकोळ विक्रेता",
    mistri: "कारागीर", customer: "ग्राहक", invite_code_option: "माझ्याकडे Invite Code आहे",
    total_coupons: "एकूण कूपन", used_coupons: "वापरलेले", customers: "ग्राहक",
    pending: "प्रलंबित", active: "सक्रिय", trial: "चाचणी", expired: "कालबाह्य",
    share_link: "ग्राहकांसोबत लिंक शेअर करा", copy_link: "लिंक कॉपी",
    share_whatsapp: "व्हॉट्सअॅपवर शेअर करा",
    grades_prices: "ग्रेड आणि किंमती", no_grades: "कोणतेही ग्रेड नाही",
    grade_placeholder: "ग्रेड (उदा. T1 20Kg)", price_placeholder: "किंमत",
    generate_coupons: "कूपन तयार करा", select_grade: "ग्रेड निवडा",
    quantity: "प्रमाण", expiry: "कालबाह्यता", generate_btn: "तयार करा",
    recent_batch: "अलीकडील बॅच", no_coupons: "अजून कूपन नाही",
    print: "प्रिंट", download_pdf: "PDF डाउनलोड",
    team_management: "टीम व्यवस्थापन",
    team_management_hint: "नवीन कर्मचारी जोडण्यासाठी Invite Code तयार करा.",
    role_select: "भूमिका निवडा", expiry_days: "कोड कालबाह्यता (दिवस)",
    generate_code: "कोड तयार करा", your_codes: "तुमचे कोड",
    your_team: "तुमचे टीम सदस्य", no_team_member: "अजून सदस्य नाही",
    manager: "व्यवस्थापक", salesman: "विक्रेता",
    delivery_boy: "डिलिव्हरी बॉय", dispatch_boy: "डिस्पॅच बॉय",
    consignor: "कन्साइनर",
    unused: "न वापरलेले", used: "वापरलेले",
    invite_code_title: "Invite Code ने जोडा",
    invite_code_hint: "तुमच्या कंपनीच्या अ‍ॅडमिनने तुम्हाला कोड दिला आहे",
    verify_code: "कोड तपासा",
    company_settings: "कंपनी सेटिंग्ज", helpline: "हेल्पलाइन",
    footer_text: "फूटर मजकूर", withdrawal_min: "किमान पैसे काढणे (₹)",
    language: "भाषा", save: "जतन करा",
    your_subscription: "तुमची सदस्यता", upgrade: "अपग्रेड",
    days_left: "दिवस", next_renew: "पुढील नूतनीकरण", renew: "नूतनीकरण",
    no_subscription: "सदस्यता नाही",
    subscription_ended: "सदस्यता संपली",
    buy_plan: "प्लॅन खरेदी करा", view_plans: "प्लॅन पहा आणि खरेदी करा",
    buy_subscription: "सदस्यता खरेदी करा",
    scan_qr_hint: "पैसे भरण्यासाठी QR कोड स्कॅन करा",
    upload_screenshot: "पेमेंट स्क्रीनशॉट अपलोड करा",
    upi_reference: "UPI संदर्भ / व्यवहार ID",
    submit_request: "विनंती सबमिट करा",
    pending_requests: "प्रलंबित विनंत्या", no_requests: "विनंती नाही",
    approved: "मंजूर", rejected: "नाकारले",
    approve: "मंजूर करा", reject: "नाकारा",
    your_balance: "तुमचे शिल्लक", recent_txn: "अलीकडील व्यवहार",
    no_txn: "व्यवहार नाही", phone: "फोन नंबर",
    upi_id: "UPI ID", request_withdraw: "पैसे काढण्याची विनंती",
    scan_coupon: "कूपन स्कॅन करा", stop_scan: "स्कॅनर बंद करा",
    manual_entry: "मॅन्युअल एंट्री", redeem: "रिडीम",
    coupon_code: "कूपन कोड", customer_phone: "ग्राहकाचा फोन",
    my_profile: "माझे प्रोफाइल", name: "नाव", company: "कंपनी",
    role: "भूमिका", joined: "सामील झाले",
    loading: "लोड होत आहे...", success: "यशस्वी!", error: "त्रुटी",
    please_wait: "कृपया थांबा...", are_you_sure: "तुम्हाला खात्री आहे?",
    save_success: "जतन झाले!", delete_success: "हटवले!",
    invalid_phone: "10 अंकी योग्य क्रमांक द्या",
    invalid_email: "योग्य ईमेल द्या", weak_password: "पासवर्ड किमान 6 अक्षरे",
    password_mismatch: "पासवर्ड जुळत नाहीत",
    fill_all_fields: "सर्व माहिती भरा", copied: "कॉपी झाले!",
    welcome: "स्वागत", your_role: "तुमची भूमिका"
  },

  // ============================================================
  // 🇮🇳 தமிழ் (Tamil)
  // ============================================================
  ta: {
    home: "முகப்பு", coupons: "கூப்பன்கள்", users: "பயனர்கள்", withdraw: "பணம் எடு",
    plan: "திட்டம்", settings: "அமைப்புகள்", profile: "சுயவிவரம்",
    scan: "ஸ்கேன்", wallet: "பணப்பெட்டி", dashboard: "டாஷ்போர்டு",
    login: "உள்நுழை", register: "பதிவு", logout: "வெளியேறு",
    email: "மின்னஞ்சல்", password: "கடவுச்சொல்", confirm_password: "கடவுச்சொல்லை உறுதிப்படுத்து",
    forgot_password: "கடவுச்சொல் மறந்துவிட்டதா?",
    who_are_you: "நீங்கள் யார்?", company_name: "நிறுவன பெயர்", your_name: "உங்கள் பெயர்",
    whatsapp_number: "வாட்ஸ்அப் எண்",
    admin_owner: "வணிக உரிமையாளர்", manufacturer: "உற்பத்தியாளர்",
    wholesaler: "மொத்த விற்பனையாளர்", retailer: "சில்லறை விற்பனையாளர்",
    mistri: "கைவினைஞர்", customer: "வாடிக்கையாளர்", invite_code_option: "என்னிடம் Invite Code உள்ளது",
    total_coupons: "மொத்த கூப்பன்கள்", used_coupons: "பயன்படுத்தியது", customers: "வாடிக்கையாளர்கள்",
    pending: "நிலுவை", active: "செயலில்", trial: "சோதனை", expired: "காலாவதியானது",
    share_link: "வாடிக்கையாளர்களுடன் இணைப்பைப் பகிரவும்", copy_link: "இணைப்பை நகலெடு",
    share_whatsapp: "வாட்ஸ்அப்பில் பகிரவும்",
    grades_prices: "தரம் மற்றும் விலை", no_grades: "தரம் இல்லை",
    grade_placeholder: "தரம் (எ.கா. T1 20Kg)", price_placeholder: "விலை",
    generate_coupons: "கூப்பன்களை உருவாக்கு", select_grade: "தரம் தேர்வு",
    quantity: "அளவு", expiry: "காலாவதி", generate_btn: "உருவாக்கு",
    recent_batch: "சமீபத்திய தொகுதி", no_coupons: "இன்னும் கூப்பன் இல்லை",
    print: "அச்சிடு", download_pdf: "PDF பதிவிறக்கம்",
    team_management: "குழு மேலாண்மை",
    team_management_hint: "புதிய பணியாளரைச் சேர்க்க Invite Code உருவாக்கவும்.",
    role_select: "பங்கு தேர்வு", expiry_days: "குறியீடு காலாவதி (நாட்கள்)",
    generate_code: "குறியீடு உருவாக்கு", your_codes: "உங்கள் குறியீடுகள்",
    your_team: "உங்கள் குழு உறுப்பினர்கள்", no_team_member: "இன்னும் உறுப்பினர் இல்லை",
    manager: "மேலாளர்", salesman: "விற்பனையாளர்",
    delivery_boy: "டெலிவரி பாய்", dispatch_boy: "டிஸ்பேட்ச் பாய்",
    consignor: "கன்சைனர்",
    unused: "பயன்படுத்தப்படாதது", used: "பயன்படுத்தப்பட்டது",
    invite_code_title: "Invite Code உடன் சேரவும்",
    invite_code_hint: "உங்கள் நிறுவன நிர்வாகி உங்களுக்கு ஒரு குறியீட்டை வழங்கியுள்ளார்",
    verify_code: "குறியீட்டைச் சரிபார்",
    company_settings: "நிறுவன அமைப்புகள்", helpline: "உதவி எண்",
    footer_text: "அடிக்குறிப்பு", withdrawal_min: "குறைந்தபட்ச பணம் எடு (₹)",
    language: "மொழி", save: "சேமி",
    your_subscription: "உங்கள் சந்தா", upgrade: "மேம்படுத்து",
    days_left: "நாட்கள்", next_renew: "அடுத்த புதுப்பித்தல்", renew: "புதுப்பி",
    no_subscription: "சந்தா இல்லை",
    subscription_ended: "சந்தா முடிந்தது",
    buy_plan: "திட்டம் வாங்கு", view_plans: "திட்டங்களைப் பார் மற்றும் வாங்கு",
    buy_subscription: "சந்தா வாங்கு",
    scan_qr_hint: "பணம் செலுத்த QR குறியீட்டை ஸ்கேன் செய்யவும்",
    upload_screenshot: "பணம் செலுத்திய திரைப்பிடிப்பைப் பதிவேற்றவும்",
    upi_reference: "UPI குறிப்பு / பரிவர்த்தனை ID",
    submit_request: "கோரிக்கையைச் சமர்ப்பி",
    pending_requests: "நிலுவை கோரிக்கைகள்", no_requests: "கோரிக்கை இல்லை",
    approved: "அங்கீகரிக்கப்பட்டது", rejected: "நிராகரிக்கப்பட்டது",
    approve: "அங்கீகரி", reject: "நிராகரி",
    your_balance: "உங்கள் இருப்பு", recent_txn: "சமீபத்திய பரிவர்த்தனைகள்",
    no_txn: "பரிவர்த்தனை இல்லை", phone: "தொலைபேசி எண்",
    upi_id: "UPI ID", request_withdraw: "பணம் எடு கோரிக்கை",
    scan_coupon: "கூப்பன் ஸ்கேன்", stop_scan: "ஸ்கேனரை நிறுத்து",
    manual_entry: "கைமுறை உள்ளீடு", redeem: "பயன்படுத்து",
    coupon_code: "கூப்பன் குறியீடு", customer_phone: "வாடிக்கையாளர் தொலைபேசி",
    my_profile: "எனது சுயவிவரம்", name: "பெயர்", company: "நிறுவனம்",
    role: "பங்கு", joined: "சேர்ந்தார்",
    loading: "ஏற்றுகிறது...", success: "வெற்றி!", error: "பிழை",
    please_wait: "காத்திருக்கவும்...", are_you_sure: "நிச்சயமா?",
    save_success: "சேமிக்கப்பட்டது!", delete_success: "நீக்கப்பட்டது!",
    invalid_phone: "10 இலக்க சரியான எண்ணை உள்ளிடவும்",
    invalid_email: "சரியான மின்னஞ்சலை உள்ளிடவும்", weak_password: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள்",
    password_mismatch: "கடவுச்சொற்கள் பொருந்தவில்லை",
    fill_all_fields: "அனைத்து தகவலையும் நிரப்பவும்", copied: "நகலெடுக்கப்பட்டது!",
    welcome: "வரவேற்பு", your_role: "உங்கள் பங்கு"
  },

  // ============================================================
  // 🇮🇳 తెలుగు (Telugu)
  // ============================================================
  te: {
    home: "హోమ్", coupons: "కూపన్లు", users: "వినియోగదారులు", withdraw: "ఉపసంహరణ",
    plan: "ప్లాన్", settings: "సెట్టింగ్‌లు", profile: "ప్రొఫైల్",
    scan: "స్కాన్", wallet: "వాలెట్", dashboard: "డాష్‌బోర్డ్",
    login: "లాగిన్", register: "నమోదు", logout: "లాగ్అవుట్",
    email: "ఇమెయిల్", password: "పాస్‌వర్డ్", confirm_password: "పాస్‌వర్డ్ నిర్ధారించండి",
    forgot_password: "పాస్‌వర్డ్ మర్చిపోయారా?",
    who_are_you: "మీరు ఎవరు?", company_name: "కంపెనీ పేరు", your_name: "మీ పేరు",
    whatsapp_number: "వాట్సాప్ నంబర్",
    admin_owner: "వ్యాపార యజమాని", manufacturer: "తయారీదారు",
    wholesaler: "హోల్‌సేల్ వ్యాపారి", retailer: "రిటైల్ వ్యాపారి",
    mistri: "కళాకారుడు", customer: "వినియోగదారు", invite_code_option: "నా దగ్గర Invite Code ఉంది",
    total_coupons: "మొత్తం కూపన్లు", used_coupons: "వాడినవి", customers: "వినియోగదారులు",
    pending: "పెండింగ్", active: "యాక్టివ్", trial: "ట్రయల్", expired: "గడువు ముగిసింది",
    share_link: "వినియోగదారులతో లింక్ పంచుకోండి", copy_link: "లింక్ కాపీ",
    share_whatsapp: "వాట్సాప్‌లో పంచుకోండి",
    grades_prices: "గ్రేడ్లు మరియు ధరలు", no_grades: "గ్రేడ్‌లు లేవు",
    grade_placeholder: "గ్రేడ్ (ఉదా. T1 20Kg)", price_placeholder: "ధర",
    generate_coupons: "కూపన్లు సృష్టించండి", select_grade: "గ్రేడ్ ఎంచుకోండి",
    quantity: "పరిమాణం", expiry: "గడువు", generate_btn: "సృష్టించు",
    recent_batch: "ఇటీవలి బ్యాచ్", no_coupons: "ఇంకా కూపన్లు లేవు",
    print: "ప్రింట్", download_pdf: "PDF డౌన్‌లోడ్",
    team_management: "టీమ్ నిర్వహణ",
    team_management_hint: "కొత్త సిబ్బందిని జోడించడానికి Invite Code సృష్టించండి.",
    role_select: "పాత్ర ఎంచుకోండి", expiry_days: "కోడ్ గడువు (రోజులు)",
    generate_code: "కోడ్ సృష్టించు", your_codes: "మీ కోడ్‌లు",
    your_team: "మీ టీమ్ సభ్యులు", no_team_member: "ఇంకా సభ్యులు లేరు",
    manager: "మేనేజర్", salesman: "సేల్స్‌మెన్",
    delivery_boy: "డెలివరీ బాయ్", dispatch_boy: "డిస్పాచ్ బాయ్",
    consignor: "కన్సైనర్",
    unused: "వాడనిది", used: "వాడినది",
    invite_code_title: "Invite Code తో చేరండి",
    invite_code_hint: "మీ కంపెనీ అడ్మిన్ మీకు కోడ్ ఇచ్చారు",
    verify_code: "కోడ్ ధృవీకరించు",
    company_settings: "కంపెనీ సెట్టింగ్‌లు", helpline: "హెల్ప్‌లైన్",
    footer_text: "ఫుటర్ టెక్స్ట్", withdrawal_min: "కనీస ఉపసంహరణ (₹)",
    language: "భాష", save: "సేవ్ చేయి",
    your_subscription: "మీ సబ్‌స్క్రిప్షన్", upgrade: "అప్‌గ్రేడ్",
    days_left: "రోజులు", next_renew: "తదుపరి పునరుద్ధరణ", renew: "పునరుద్ధరించు",
    no_subscription: "సబ్‌స్క్రిప్షన్ లేదు",
    subscription_ended: "సబ్‌స్క్రిప్షన్ ముగిసింది",
    buy_plan: "ప్లాన్ కొనండి", view_plans: "ప్లాన్‌లు చూడండి మరియు కొనండి",
    buy_subscription: "సబ్‌స్క్రిప్షన్ కొనండి",
    scan_qr_hint: "చెల్లించడానికి QR కోడ్ స్కాన్ చేయండి",
    upload_screenshot: "చెల్లింపు స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి",
    upi_reference: "UPI సూచన / లావాదేవీ ID",
    submit_request: "అభ్యర్థన సమర్పించు",
    pending_requests: "పెండింగ్ అభ్యర్థనలు", no_requests: "అభ్యర్థనలు లేవు",
    approved: "ఆమోదించబడింది", rejected: "తిరస్కరించబడింది",
    approve: "ఆమోదించు", reject: "తిరస్కరించు",
    your_balance: "మీ బ్యాలెన్స్", recent_txn: "ఇటీవలి లావాదేవీలు",
    no_txn: "లావాదేవీలు లేవు", phone: "ఫోన్ నంబర్",
    upi_id: "UPI ID", request_withdraw: "ఉపసంహరణ అభ్యర్థన",
    scan_coupon: "కూపన్ స్కాన్", stop_scan: "స్కానర్ ఆపు",
    manual_entry: "మాన్యువల్ ఎంట్రీ", redeem: "రిడీమ్",
    coupon_code: "కూపన్ కోడ్", customer_phone: "వినియోగదారు ఫోన్",
    my_profile: "నా ప్రొఫైల్", name: "పేరు", company: "కంపెనీ",
    role: "పాత్ర", joined: "చేరారు",
    loading: "లోడ్ అవుతోంది...", success: "విజయం!", error: "లోపం",
    please_wait: "దయచేసి వేచి ఉండండి...", are_you_sure: "మీరు ఖచ్చితంగా ఉన్నారా?",
    save_success: "సేవ్ చేయబడింది!", delete_success: "తొలగించబడింది!",
    invalid_phone: "10 అంకెల సరైన నంబర్ ఇవ్వండి",
    invalid_email: "సరైన ఇమెయిల్ ఇవ్వండి", weak_password: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు",
    password_mismatch: "పాస్‌వర్డ్‌లు సరిపోలలేదు",
    fill_all_fields: "అన్ని వివరాలు నింపండి", copied: "కాపీ అయింది!",
    welcome: "స్వాగతం", your_role: "మీ పాత్ర"
  },

  // ============================================================
  // 🇮🇳 മലയാളം (Malayalam)
  // ============================================================
  ml: {
    home: "ഹോം", coupons: "കൂപ്പണുകൾ", users: "ഉപയോക്താക്കൾ", withdraw: "പിൻവലിക്കൽ",
    plan: "പ്ലാൻ", settings: "ക്രമീകരണങ്ങൾ", profile: "പ്രൊഫൈൽ",
    scan: "സ്കാൻ", wallet: "വാലറ്റ്", dashboard: "ഡാഷ്ബോർഡ്",
    login: "ലോഗിൻ", register: "രജിസ്റ്റർ", logout: "ലോഗൗട്ട്",
    email: "ഇമെയിൽ", password: "പാസ്‌വേഡ്", confirm_password: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    forgot_password: "പാസ്‌വേഡ് മറന്നോ?",
    who_are_you: "നിങ്ങൾ ആരാണ്?", company_name: "കമ്പനി പേര്", your_name: "നിങ്ങളുടെ പേര്",
    whatsapp_number: "വാട്ട്‌സ്ആപ്പ് നമ്പർ",
    admin_owner: "ബിസിനസ് ഉടമ", manufacturer: "നിർമ്മാതാവ്",
    wholesaler: "മൊത്തവ്യാപാരി", retailer: "ചില്ലറ വ്യാപാരി",
    mistri: "കൈത്തൊഴിലാളി", customer: "ഉപഭോക്താവ്", invite_code_option: "എന്റെ പക്കൽ Invite Code ഉണ്ട്",
    total_coupons: "ആകെ കൂപ്പണുകൾ", used_coupons: "ഉപയോഗിച്ചത്", customers: "ഉപഭോക്താക്കൾ",
    pending: "തീർപ്പാക്കാത്തത്", active: "സജീവം", trial: "ട്രയൽ", expired: "കാലഹരണപ്പെട്ടത്",
    share_link: "ഉപഭോക്താക്കളുമായി ലിങ്ക് പങ്കിടുക", copy_link: "ലിങ്ക് പകർത്തുക",
    share_whatsapp: "വാട്ട്‌സ്ആപ്പിൽ പങ്കിടുക",
    grades_prices: "ഗ്രേഡുകളും വിലകളും", no_grades: "ഗ്രേഡുകൾ ഇല്ല",
    grade_placeholder: "ഗ്രേഡ് (ഉദാ. T1 20Kg)", price_placeholder: "വില",
    generate_coupons: "കൂപ്പണുകൾ സൃഷ്ടിക്കുക", select_grade: "ഗ്രേഡ് തിരഞ്ഞെടുക്കുക",
    quantity: "അളവ്", expiry: "കാലഹരണം", generate_btn: "സൃഷ്ടിക്കുക",
    recent_batch: "സമീപകാല ബാച്ച്", no_coupons: "ഇതുവരെ കൂപ്പണുകൾ ഇല്ല",
    print: "പ്രിന്റ്", download_pdf: "PDF ഡൗൺലോഡ്",
    team_management: "ടീം മാനേജ്‌മെന്റ്",
    team_management_hint: "പുതിയ ജീവനക്കാരെ ചേർക്കാൻ Invite Code സൃഷ്ടിക്കുക.",
    role_select: "റോൾ തിരഞ്ഞെടുക്കുക", expiry_days: "കോഡ് കാലഹരണം (ദിവസങ്ങൾ)",
    generate_code: "കോഡ് സൃഷ്ടിക്കുക", your_codes: "നിങ്ങളുടെ കോഡുകൾ",
    your_team: "നിങ്ങളുടെ ടീം അംഗങ്ങൾ", no_team_member: "ഇതുവരെ അംഗങ്ങൾ ഇല്ല",
    manager: "മാനേജർ", salesman: "സെയിൽസ്മാൻ",
    delivery_boy: "ഡെലിവറി ബോയ്", dispatch_boy: "ഡിസ്പാച്ച് ബോയ്",
    consignor: "കോൺസൈനർ",
    unused: "ഉപയോഗിക്കാത്തത്", used: "ഉപയോഗിച്ചത്",
    invite_code_title: "Invite Code ഉപയോഗിച്ച് ചേരുക",
    invite_code_hint: "നിങ്ങളുടെ കമ്പനി അഡ്മിൻ നിങ്ങൾക്ക് ഒരു കോഡ് നൽകിയിട്ടുണ്ട്",
    verify_code: "കോഡ് പരിശോധിക്കുക",
    company_settings: "കമ്പനി ക്രമീകരണങ്ങൾ", helpline: "ഹെൽപ്‌ലൈൻ",
    footer_text: "ഫൂട്ടർ ടെക്സ്റ്റ്", withdrawal_min: "കുറഞ്ഞ പിൻവലിക്കൽ (₹)",
    language: "ഭാഷ", save: "സേവ് ചെയ്യുക",
    your_subscription: "നിങ്ങളുടെ സബ്‌സ്‌ക്രിപ്ഷൻ", upgrade: "അപ്‌ഗ്രേഡ്",
    days_left: "ദിവസം", next_renew: "അടുത്ത പുതുക്കൽ", renew: "പുതുക്കുക",
    no_subscription: "സബ്‌സ്‌ക്രിപ്ഷൻ ഇല്ല",
    subscription_ended: "സബ്‌സ്‌ക്രിപ്ഷൻ അവസാനിച്ചു",
    buy_plan: "പ്ലാൻ വാങ്ങുക", view_plans: "പ്ലാനുകൾ കാണുക, വാങ്ങുക",
    buy_subscription: "സബ്‌സ്‌ക്രിപ്ഷൻ വാങ്ങുക",
    scan_qr_hint: "പണമടയ്ക്കാൻ QR കോഡ് സ്കാൻ ചെയ്യുക",
    upload_screenshot: "പേയ്‌മെന്റ് സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യുക",
    upi_reference: "UPI റഫറൻസ് / ട്രാൻസാക്ഷൻ ID",
    submit_request: "അഭ്യർത്ഥന സമർപ്പിക്കുക",
    pending_requests: "തീർപ്പാക്കാത്ത അഭ്യർത്ഥനകൾ", no_requests: "അഭ്യർത്ഥനകൾ ഇല്ല",
    approved: "അംഗീകരിച്ചു", rejected: "നിരസിച്ചു",
    approve: "അംഗീകരിക്കുക", reject: "നിരസിക്കുക",
    your_balance: "നിങ്ങളുടെ ബാലൻസ്", recent_txn: "സമീപകാല ഇടപാടുകൾ",
    no_txn: "ഇടപാടുകൾ ഇല്ല", phone: "ഫോൺ നമ്പർ",
    upi_id: "UPI ID", request_withdraw: "പിൻവലിക്കൽ അഭ്യർത്ഥന",
    scan_coupon: "കൂപ്പൺ സ്കാൻ", stop_scan: "സ്കാനർ നിർത്തുക",
    manual_entry: "മാനുവൽ എൻട്രി", redeem: "റിഡീം",
    coupon_code: "കൂപ്പൺ കോഡ്", customer_phone: "ഉപഭോക്താവിന്റെ ഫോൺ",
    my_profile: "എന്റെ പ്രൊഫൈൽ", name: "പേര്", company: "കമ്പനി",
    role: "റോൾ", joined: "ചേർന്നു",
    loading: "ലോഡ് ചെയ്യുന്നു...", success: "വിജയം!", error: "പിശക്",
    please_wait: "കാത്തിരിക്കുക...", are_you_sure: "നിങ്ങൾക്ക് ഉറപ്പാണോ?",
    save_success: "സേവ് ചെയ്തു!", delete_success: "ഇല്ലാതാക്കി!",
    invalid_phone: "10 അക്ക സംഖ്യ നൽകുക",
    invalid_email: "ശരിയായ ഇമെയിൽ നൽകുക", weak_password: "പാസ്‌വേഡ് കുറഞ്ഞത് 6 അക്ഷരം",
    password_mismatch: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല",
    fill_all_fields: "എല്ലാ വിവരങ്ങളും നൽകുക", copied: "പകർത്തി!",
    welcome: "സ്വാഗതം", your_role: "നിങ്ങളുടെ റോൾ"
  }
};

// ============================================================
// Helper Functions
// ============================================================

let currentLang = 'bn';

// একটি কী-এর অনুবাদ পাওয়া
export function t(key, lang = null) {
  const l = lang || currentLang;
  const dict = translations[l] || translations.bn;
  return dict[key] || translations.bn[key] || key;
}

// ভাষা পরিবর্তন করা
export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
    
    // RTL ভাষার জন্য direction পরিবর্তন (Urdu)
    if (lang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    applyTranslations(lang);
    return true;
  }
  return false;
}

// বর্তমান ভাষা পাওয়া
export function getLanguage() {
  return currentLang;
}

// localStorage থেকে ভাষা লোড করা
export function initLanguage() {
  const saved = localStorage.getItem('app_lang') || 'bn';
  currentLang = saved;
  document.documentElement.lang = saved;
  if (saved === 'ur') document.documentElement.dir = 'rtl';
  return saved;
}

// পেজের সব `data-t` অ্যাট্রিবিউটে অনুবাদ প্রয়োগ
export function applyTranslations(lang = null) {
  const l = lang || currentLang;
  const dict = translations[l] || translations.bn;
  
  // data-t অ্যাট্রিবিউট সহ সব এলিমেন্ট
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    if (dict[key]) {
      // যদি প্লেসহোল্ডার অ্যাট্রিবিউট থাকে
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });
  
  // data-t-ph (placeholder) সহ এলিমেন্ট
  document.querySelectorAll('[data-t-ph]').forEach(el => {
    const key = el.getAttribute('data-t-ph');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
  
  // টাইটেল অ্যাট্রিবিউট
  document.querySelectorAll('[data-t-title]').forEach(el => {
    const key = el.getAttribute('data-t-title');
    if (dict[key]) {
      el.title = dict[key];
    }
  });
}

// ============================================================
// AUTO-TRANSLATION SYSTEM
// বাংলা লেখা থেকে অটো অনুবাদ (data-t অ্যাট্রিবিউট ছাড়াই)
// ============================================================

// অটো-অনুবাদের অভিধান
// কী = বাংলা লেখা (HTML-এ যেমন আছে)
// মান = অন্য ভাষায় কী হবে
export const autoDict = {
  
  // ============= Navigation =============
  "হোম": { en: "Home", hi: "होम", or: "ହୋମ", ur: "ہوم", gu: "હોમ", mr: "होम", ta: "முகப்பு", te: "హోమ్", ml: "ഹോം" },
  "কুপন": { en: "Coupons", hi: "कूपन", or: "କୁପନ", ur: "کوپن", gu: "કૂપન", mr: "कूपन", ta: "கூப்பன்கள்", te: "కూపన్లు", ml: "കൂപ്പണുകൾ" },
  "ইউজার": { en: "Users", hi: "उपयोगकर्ता", or: "ଉପଭୋକ୍ତା", ur: "صارفین", gu: "વપરાશકર્તાઓ", mr: "वापरकर्ते", ta: "பயனர்கள்", te: "వినియోగదారులు", ml: "ഉപയോക്താക്കൾ" },
  "প্রত্যাহার": { en: "Withdraw", hi: "निकासी", or: "ଉତ୍ତୋଳନ", ur: "نکاسی", gu: "ઉપાડ", mr: "पैसे काढा", ta: "பணம் எடு", te: "ఉపసంహరణ", ml: "പിൻവലിക്കൽ" },
  "প্ল্যান": { en: "Plan", hi: "प्लान", or: "ଯୋଜନା", ur: "پلان", gu: "પ્લાન", mr: "प्लॅन", ta: "திட்டம்", te: "ప్లాన్", ml: "പ്ലാൻ" },
  "সেটিংস": { en: "Settings", hi: "सेटिंग्स", or: "ସେଟିଂସ", ur: "ترتیبات", gu: "સેટિંગ્સ", mr: "सेटिंग्ज", ta: "அமைப்புகள்", te: "సెట్టింగ్‌లు", ml: "ക്രമീകരണങ്ങൾ" },
  "লগআউট": { en: "Logout", hi: "लॉगआउट", or: "ଲଗଆଉଟ", ur: "لاگ آؤٹ", gu: "લોગઆઉટ", mr: "लॉगआउट", ta: "வெளியேறு", te: "లాగ్అవుట్", ml: "ലോഗൗട്ട്" },
  "লগইন": { en: "Login", hi: "लॉगिन", or: "ଲଗଇନ", ur: "لاگ ان", gu: "લોગિન", mr: "लॉगिन", ta: "உள்நுழை", te: "లాగిన్", ml: "ലോഗിൻ" },
  "রেজিস্ট্রেশন": { en: "Register", hi: "रजिस्टर", or: "ପଞ୍ଜିକରଣ", ur: "رجسٹر", gu: "રજિસ્ટર", mr: "नोंदणी", ta: "பதிவு", te: "నమోదు", ml: "രജിസ്റ്റർ" },
  
  // ============= Auth =============
  "ইমেইল": { en: "Email", hi: "ईमेल", or: "ଇମେଲ", ur: "ای میل", gu: "ઈમેલ", mr: "ईमेल", ta: "மின்னஞ்சல்", te: "ఇమెయిల్", ml: "ഇമെയിൽ" },
  "পাসওয়ার্ড": { en: "Password", hi: "पासवर्ड", or: "ପାସୱାର୍ଡ", ur: "پاس ورڈ", gu: "પાસવર્ડ", mr: "पासवर्ड", ta: "கடவுச்சொல்", te: "పాస్‌వర్డ్", ml: "പാസ്‌വേഡ്" },
  "🔑 পাসওয়ার্ড ভুলে গেছেন?": { en: "🔑 Forgot Password?", hi: "🔑 पासवर्ड भूल गए?", or: "🔑 ପାସୱାର୍ଡ ଭୁଲିଗଲେ?", ur: "🔑 پاس ورڈ بھول گئے؟", gu: "🔑 પાસવર્ડ ભૂલી ગયા?", mr: "🔑 पासवर्ड विसरला?", ta: "🔑 கடவுச்சொல் மறந்துவிட்டதா?", te: "🔑 పాస్‌వర్డ్ మర్చిపోయారా?", ml: "🔑 പാസ്‌വേഡ് മറന്നോ?" },
  
  // ============= Register Roles =============
  "ব্যবসার মালিক": { en: "Business Owner", hi: "व्यवसाय के मालिक", or: "ବ୍ୟବସାୟ ମାଲିକ", ur: "کاروبار کا مالک", gu: "વ્યવસાયના માલિક", mr: "व्यवसाय मालक", ta: "வணிக உரிமையாளர்", te: "వ్యాపార యజమాని", ml: "ബിസിനസ് ഉടമ" },
  "উৎপাদনকারী": { en: "Manufacturer", hi: "निर्माता", or: "ଉତ୍ପାଦକ", ur: "مینوفیکچرر", gu: "ઉત્પાદક", mr: "उत्पादक", ta: "உற்பத்தியாளர்", te: "తయారీదారు", ml: "നിർമ്മാതാവ്" },
  "পাইকার": { en: "Wholesaler", hi: "थोक विक्रेता", or: "ପାଇକାରୀ", ur: "تھوک فروش", gu: "જથ્થાબંધ વેપારી", mr: "घाऊक विक्रेता", ta: "மொத்த விற்பனையாளர்", te: "హోల్‌సేల్ వ్యాపారి", ml: "മൊത്തവ്യാപാരി" },
  "খুচরা বিক্রেতা": { en: "Retailer", hi: "खुदरा विक्रेता", or: "ଖୁଚୁରା ବିକ୍ରେତା", ur: "خوردہ فروش", gu: "છૂટક વેપારી", mr: "किरकोळ विक्रेता", ta: "சில்லறை விற்பனையாளர்", te: "రిటైల్ వ్యాపారి", ml: "ചില്ലറ വ്യാപാരി" },
  "কারিগর": { en: "Craftsman", hi: "कारीगर", or: "କାରିଗର", ur: "کاریگر", gu: "કારીગર", mr: "कारागीर", ta: "கைவினைஞர்", te: "కళాకారుడు", ml: "കൈത്തൊഴിലാളി" },
  "গ্রাহক": { en: "Customer", hi: "ग्राहक", or: "ଗ୍ରାହକ", ur: "گاہک", gu: "ગ્રાહક", mr: "ग्राहक", ta: "வாடிக்கையாளர்", te: "వినియోగదారు", ml: "ഉപഭോക്താവ്" },
  
  // ============= Card Titles =============
  "👥 টিম ম্যানেজমেন্ট": { en: "👥 Team Management", hi: "👥 टीम प्रबंधन", or: "👥 ଟିମ ପରିଚାଳନା", ur: "👥 ٹیم مینجمنٹ", gu: "👥 ટીમ મેનેજમેન્ટ", mr: "👥 टीम व्यवस्थापन", ta: "👥 குழு மேலாண்மை", te: "👥 టీమ్ నిర్వహణ", ml: "👥 ടീം മാനേജ്‌മെന്റ്" },
  "📦 গ্রেড ও মূল্য": { en: "📦 Grades & Prices", hi: "📦 ग्रेड और मूल्य", or: "📦 ଗ୍ରେଡ ଏବଂ ମୂଲ୍ୟ", ur: "📦 گریڈ اور قیمت", gu: "📦 ગ્રેડ અને ભાવ", mr: "📦 ग्रेड आणि किंमती", ta: "📦 தரம் மற்றும் விலை", te: "📦 గ్రేడ్లు మరియు ధరలు", ml: "📦 ഗ്രേഡുകളും വിലകളും" },
  "🎫 কুপন তৈরি করুন": { en: "🎫 Generate Coupons", hi: "🎫 कूपन बनाएं", or: "🎫 କୁପନ ତିଆରି କରନ୍ତୁ", ur: "🎫 کوپن بنائیں", gu: "🎫 કૂપન બનાવો", mr: "🎫 कूपन तयार करा", ta: "🎫 கூப்பன்களை உருவாக்கு", te: "🎫 కూపన్లు సృష్టించండి", ml: "🎫 കൂപ്പണുകൾ സൃഷ്ടിക്കുക" },
  "📋 সাম্প্রতিক ব্যাচ": { en: "📋 Recent Batch", hi: "📋 हाल का बैच", or: "📋 ସାମ୍ପ୍ରତିକ ବ୍ୟାଚ", ur: "📋 حالیہ بیچ", gu: "📋 તાજેતરની બેચ", mr: "📋 अलीकडील बॅच", ta: "📋 சமீபத்திய தொகுதி", te: "📋 ఇటీవలి బ్యాచ్", ml: "📋 സമീപകാല ബാച്ച്" },
  "🏢 কোম্পানির সেটিংস": { en: "🏢 Company Settings", hi: "🏢 कंपनी सेटिंग्स", or: "🏢 କମ୍ପାନୀ ସେଟିଂସ", ur: "🏢 کمپنی کی ترتیبات", gu: "🏢 કંપની સેટિંગ્સ", mr: "🏢 कंपनी सेटिंग्ज", ta: "🏢 நிறுவன அமைப்புகள்", te: "🏢 కంపెనీ సెట్టింగ్‌లు", ml: "🏢 കമ്പനി ക്രമീകരണങ്ങൾ" },
  "👨‍💼 আপনার টিম মেম্বার": { en: "👨‍💼 Your Team Members", hi: "👨‍💼 आपके टीम सदस्य", or: "👨‍💼 ଆପଣଙ୍କ ଟିମ ସଦସ୍ୟ", ur: "👨‍💼 آپ کے ٹیم ممبران", gu: "👨‍💼 તમારા ટીમ સભ્યો", mr: "👨‍💼 तुमचे टीम सदस्य", ta: "👨‍💼 உங்கள் குழு உறுப்பினர்கள்", te: "👨‍💼 మీ టీమ్ సభ్యులు", ml: "👨‍💼 നിങ്ങളുടെ ടീം അംഗങ്ങൾ" },
  "💎 আপনার সাবস্ক্রিপশন": { en: "💎 Your Subscription", hi: "💎 आपकी सदस्यता", or: "💎 ଆପଣଙ୍କ ସବସ୍କ୍ରିପସନ", ur: "💎 آپ کی سبسکرپشن", gu: "💎 તમારી સબસ્ક્રિપ્શન", mr: "💎 तुमची सदस्यता", ta: "💎 உங்கள் சந்தா", te: "💎 మీ సబ్‌స్క్రిప్షన్", ml: "💎 നിങ്ങളുടെ സബ്‌സ്‌ക്രിപ്ഷൻ" },
  "🚀 আপগ্রেড করুন": { en: "🚀 Upgrade", hi: "🚀 अपग्रेड करें", or: "🚀 ଅପଗ୍ରେଡ", ur: "🚀 اپ گریڈ", gu: "🚀 અપગ્રેડ", mr: "🚀 अपग्रेड", ta: "🚀 மேம்படுத்து", te: "🚀 అప్‌గ్రేడ్", ml: "🚀 അപ്‌ഗ്രേഡ്" },
  "⏳ অপেক্ষমাণ অনুরোধ": { en: "⏳ Pending Requests", hi: "⏳ लंबित अनुरोध", or: "⏳ ବିଚାରାଧୀନ ଅନୁରୋଧ", ur: "⏳ زیر التواء درخواستیں", gu: "⏳ બાકી વિનંતીઓ", mr: "⏳ प्रलंबित विनंत्या", ta: "⏳ நிலுவை கோரிக்கைகள்", te: "⏳ పెండింగ్ అభ్యర్థనలు", ml: "⏳ തീർപ്പാക്കാത്ത അഭ്യർത്ഥനകൾ" },
  
  // ============= Form Labels =============
  "কোম্পানির নাম": { en: "Company Name", hi: "कंपनी का नाम", or: "କମ୍ପାନୀ ନାମ", ur: "کمپنی کا نام", gu: "કંપનીનું નામ", mr: "कंपनीचे नाव", ta: "நிறுவன பெயர்", te: "కంపెనీ పేరు", ml: "കമ്പനി പേര്" },
  "আপনার নাম": { en: "Your Name", hi: "आपका नाम", or: "ଆପଣଙ୍କ ନାମ", ur: "آپ کا نام", gu: "તમારું નામ", mr: "तुमचे नाव", ta: "உங்கள் பெயர்", te: "మీ పేరు", ml: "നിങ്ങളുടെ പേര്" },
  "হোয়াটসঅ্যাপ নাম্বার": { en: "WhatsApp Number", hi: "व्हाट्सएप नंबर", or: "ହ୍ୱାଟସଆପ ନମ୍ବର", ur: "واٹس ایپ نمبر", gu: "વોટ્સએપ નંબર", mr: "व्हॉट्सअ‍ॅप नंबर", ta: "வாட்ஸ்அப் எண்", te: "వాట్సాప్ నంబర్", ml: "വാട്ട്‌സ്ആപ്പ് നമ്പർ" },
  "হেল্পলাইন": { en: "Helpline", hi: "हेल्पलाइन", or: "ହେଲ୍ପଲାଇନ", ur: "ہیلپ لائن", gu: "હેલ્પલાઇન", mr: "हेल्पलाइन", ta: "உதவி எண்", te: "హెల్ప్‌లైన్", ml: "ഹെൽപ്‌ലൈൻ" },
  "ফুটার টেক্সট": { en: "Footer Text", hi: "फुटर टेक्स्ट", or: "ଫୁଟର ଟେକ୍ସଟ", ur: "فوٹر ٹیکسٹ", gu: "ફૂટર ટેક્સ્ટ", mr: "फूटर मजकूर", ta: "அடிக்குறிப்பு", te: "ఫుటర్ టెక్స్ట్", ml: "ഫൂട്ടർ ടെക്സ്റ്റ്" },
  "ন্যূনতম প্রত্যাহার (₹)": { en: "Minimum Withdrawal (₹)", hi: "न्यूनतम निकासी (₹)", or: "ସର୍ବନିମ୍ନ ଉତ୍ତୋଳନ (₹)", ur: "کم از کم نکاسی (₹)", gu: "ન્યૂનતમ ઉપાડ (₹)", mr: "किमान पैसे काढणे (₹)", ta: "குறைந்தபட்ச பணம் எடு (₹)", te: "కనీస ఉపసంహరణ (₹)", ml: "കുറഞ്ഞ പിൻവലിക്കൽ (₹)" },
  "ভাষা": { en: "Language", hi: "भाषा", or: "ଭାଷା", ur: "زبان", gu: "ભાષા", mr: "भाषा", ta: "மொழி", te: "భాష", ml: "ഭാഷ" },
  "রোল সিলেক্ট করুন": { en: "Select Role", hi: "भूमिका चुनें", or: "ଭୂମିକା ଚୟନ", ur: "کردار منتخب کریں", gu: "ભૂમિકા પસંદ કરો", mr: "भूमिका निवडा", ta: "பங்கு தேர்வு", te: "పాత్ర ఎంచుకోండి", ml: "റോൾ തിരഞ്ഞെടുക്കുക" },
  "কোডের মেয়াদ (দিন)": { en: "Code Expiry (days)", hi: "कोड समाप्ति (दिन)", or: "କୋଡ ସମାପ୍ତି (ଦିନ)", ur: "کوڈ میعاد (دن)", gu: "કોડ સમાપ્તિ (દિવસ)", mr: "कोड कालबाह्यता (दिवस)", ta: "குறியீடு காலாவதி (நாட்கள்)", te: "కోడ్ గడువు (రోజులు)", ml: "കോഡ് കാലഹരണം (ദിവസങ്ങൾ)" },
  
  // ============= Buttons =============
  "🔑 কোড তৈরি করুন": { en: "🔑 Generate Code", hi: "🔑 कोड बनाएं", or: "🔑 କୋଡ ତିଆରି", ur: "🔑 کوڈ بنائیں", gu: "🔑 કોડ બનાવો", mr: "🔑 कोड तयार करा", ta: "🔑 குறியீடு உருவாக்கு", te: "🔑 కోడ్ సృష్టించు", ml: "🔑 കോഡ് സൃഷ്ടിക്കുക" },
  "✅ সেভ করুন": { en: "✅ Save", hi: "✅ सेव करें", or: "✅ ସେଭ କରନ୍ତୁ", ur: "✅ محفوظ کریں", gu: "✅ સેવ કરો", mr: "✅ जतन करा", ta: "✅ சேமி", te: "✅ సేవ్ చేయి", ml: "✅ സേവ് ചെയ്യുക" },
  "💾 সেভ করুন": { en: "💾 Save", hi: "💾 सेव करें", or: "💾 ସେଭ କରନ୍ତୁ", ur: "💾 محفوظ کریں", gu: "💾 સેવ કરો", mr: "💾 जतन करा", ta: "💾 சேமி", te: "💾 సేవ్ చేయి", ml: "💾 സേവ് ചെയ്യുക" },
  "Generate": { en: "Generate", hi: "बनाएं", or: "ତିଆରି", ur: "بنائیں", gu: "બનાવો", mr: "तयार करा", ta: "உருவாக்கு", te: "సృష్టించు", ml: "സൃഷ്ടിക്കുക" },
  
  // ============= Empty States =============
  "এখনো কোনো কোড তৈরি করা হয়নি": { en: "No codes created yet", hi: "अभी तक कोई कोड नहीं बनाया गया", or: "ଏବେ କୌଣସି କୋଡ ତିଆରି ହୋଇନାହିଁ", ur: "ابھی تک کوئی کوڈ نہیں بنایا گیا", gu: "હજી કોઈ કોડ બનાવ્યો નથી", mr: "अजून कोड तयार केला नाही", ta: "இன்னும் குறியீடு உருவாக்கப்படவில்லை", te: "ఇంకా కోడ్ సృష్టించబడలేదు", ml: "ഇതുവരെ കോഡ് സൃഷ്ടിച്ചിട്ടില്ല" },
  "এখনো কোনো টিম মেম্বার যোগ দেয়নি": { en: "No team members yet", hi: "अभी कोई टीम सदस्य नहीं", or: "ଏବେ କୌଣସି ସଦସ୍ୟ ନାହିଁ", ur: "ابھی کوئی ممبر نہیں", gu: "હજી કોઈ સભ્ય નથી", mr: "अजून सदस्य नाही", ta: "இன்னும் உறுப்பினர் இல்லை", te: "ఇంకా సభ్యులు లేరు", ml: "ഇതുവരെ അംഗങ്ങൾ ഇല്ല" },
  "কোনো গ্রেড নেই": { en: "No grades yet", hi: "कोई ग्रेड नहीं", or: "କୌଣସି ଗ୍ରେଡ ନାହିଁ", ur: "کوئی گریڈ نہیں", gu: "કોઈ ગ્રેડ નથી", mr: "कोणतेही ग्रेड नाही", ta: "தரம் இல்லை", te: "గ్రేడ్‌లు లేవు", ml: "ഗ്രേഡുകൾ ഇല്ല" },
  "No coupons yet": { en: "No coupons yet", hi: "अभी कोई कूपन नहीं", or: "ଏବେ କୌଣସି କୁପନ ନାହିଁ", ur: "ابھی کوئی کوپن نہیں", gu: "હજી કોઈ કૂપન નથી", mr: "अजून कूपन नाही", ta: "இன்னும் கூப்பன் இல்லை", te: "ఇంకా కూపన్లు లేవు", ml: "ഇതുവരെ കൂപ്പണുകൾ ഇല്ല" },
  "লোড হচ্ছে...": { en: "Loading...", hi: "लोड हो रहा है...", or: "ଲୋଡ ହେଉଛି...", ur: "لوڈ ہو رہا ہے...", gu: "લોડ થઈ રહ્યું છે...", mr: "लोड होत आहे...", ta: "ஏற்றுகிறது...", te: "లోడ్ అవుతోంది...", ml: "ലോഡ് ചെയ്യുന്നു..." },
  
  // ============= Subscription =============
  "Starter": { en: "Starter", hi: "स्टार्टर", or: "ଷ୍ଟାର୍ଟର", ur: "اسٹارٹر", gu: "સ્ટાર્ટર", mr: "स्टार्टर", ta: "ஸ்டார்ட்டர்", te: "స్టార్టర్", ml: "സ്റ്റാർട്ടർ" },
  "Pro": { en: "Pro", hi: "प्रो", or: "ପ୍ରୋ", ur: "پرو", gu: "પ્રો", mr: "प्रो", ta: "ப்ரோ", te: "ప్రో", ml: "പ്രോ" },
  "Enterprise": { en: "Enterprise", hi: "एंटरप्राइज़", or: "ଏଣ୍ଟରପ୍ରାଇଜ", ur: "انٹرپرائز", gu: "એન્ટરપ્રાઇઝ", mr: "एंटरप्राइझ", ta: "எண்டர்பிரைஸ்", te: "ఎంటర్‌ప్రైజ్", ml: "എന്റർപ്രൈസ്" },
  
  // ============= Common Words =============
  "কুপন": { en: "Coupons", hi: "कूपन", or: "କୁପନ", ur: "کوپن", gu: "કૂપન", mr: "कूपन", ta: "கூப்பன்கள்", te: "కూపన్లు", ml: "കൂപ്പണുകൾ" },
  "কাস্টমার": { en: "Customers", hi: "ग्राहक", or: "ଗ୍ରାହକ", ur: "گاہک", gu: "ગ્રાહક", mr: "ग्राहक", ta: "வாடிக்கையாளர்கள்", te: "వినియోగదారులు", ml: "ഉപഭോക്താക്കൾ" },
  "দিন": { en: "days", hi: "दिन", or: "ଦିନ", ur: "دن", gu: "દિવસ", mr: "दिवस", ta: "நாட்கள்", te: "రోజులు", ml: "ദിവസം" },
  "বাকি": { en: "left", hi: "बाकी", or: "ବାକି", ur: "باقی", gu: "બાકી", mr: "उर्वरित", ta: "மீதம்", te: "మిగిలి", ml: "ബാക്കി" }
};

// Auto-Translate Function
export function autoTranslate() {
  const lang = currentLang;
  
  // বাংলা হলে কিছু করার নেই (সোর্স ভাষা)
  if (lang === 'bn') return;
  
  // Walk through all text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        
        const text = node.textContent.trim();
        if (text && autoDict[text]) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    }
  );
  
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  
  nodes.forEach(node => {
    const text = node.textContent.trim();
    const translation = autoDict[text]?.[lang];
    if (translation) {
      // মূল টেক্সট replace করি, তবে স্পেসিং রাখি
      node.textContent = node.textContent.replace(text, translation);
    }
  });
  
  // Placeholder-ও auto-translate করি
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    const ph = el.getAttribute('placeholder');
    if (ph && autoDict[ph]?.[lang]) {
      el.setAttribute('placeholder', autoDict[ph][lang]);
    }
  });
  
  // data-t অ্যাট্রিবিউট থাকলেও apply করি
  applyTranslations(lang);
}

// MutationObserver — নতুন কনটেন্ট যোগ হলে অটো অনুবাদ
let autoTranslateObserver = null;

export function startAutoTranslateObserver() {
  if (autoTranslateObserver) return;
  
  autoTranslateObserver = new MutationObserver((mutations) => {
    // Debounce — সব পরিবর্তন শেষ হলে একবার চালাও
    clearTimeout(window.__atTimeout);
    window.__atTimeout = setTimeout(() => {
      autoTranslate();
    }, 300);
  });
  
  autoTranslateObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
