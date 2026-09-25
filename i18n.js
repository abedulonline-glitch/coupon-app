// ============================================================
// i18n.js — Multi-Language Support (10 Languages)
// UMD version — i18next আগে থেকে loaded থাকতে হবে
// ============================================================

// ==================== সাপোর্টেড ভাষা ====================
const LANGUAGES = [
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
];

// ==================== অনুবাদ ====================
const resources = {
  bn: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "অ্যাডমিন প্যানেল",
      login: "লগইন", register: "রেজিস্টার", logout: "লগআউট",
      email: "ইমেইল", password: "পাসওয়ার্ড", phone: "মোবাইল", name: "নাম",
      whatsapp: "হোয়াটসঅ্যাপ", company_name: "কোম্পানির নাম",
      home: "হোম", coupons: "কুপন", users: "ইউজার", withdraw: "প্রত্যাহার",
      plan: "প্ল্যান", settings: "সেটিংস", dashboard: "ড্যাশবোর্ড",
      total_coupons: "মোট কুপন", used: "ব্যবহৃত", customers: "কাস্টমার", pending: "অপেক্ষমাণ",
      generate_coupons: "কুপন তৈরি করুন", select_grade: "গ্রেড সিলেক্ট",
      quantity: "পরিমাণ", expiry: "মেয়াদ", generate_btn: "তৈরি করুন",
      subscription: "সাবস্ক্রিপশন", your_subscription: "আপনার সাবস্ক্রিপশন",
      upgrade: "আপগ্রেড করুন", days_left: "দিন বাকি", renew: "রিনিউ করুন",
      team_management: "টিম ম্যানেজমেন্ট", role_select: "রোল সিলেক্ট করুন",
      invite_code: "Invite Code", generate_code: "কোড তৈরি করুন",
      profile: "প্রোফাইল", my_profile: "আমার প্রোফাইল", role: "রোল", joined_date: "যোগদানের তারিখ",
      scan_coupon: "কুপন স্ক্যান করুন", manual_entry: "ম্যানুয়াল এন্ট্রি", redeem: "রিডিম করুন",
      forgot_password: "পাসওয়ার্ড ভুলে গেছেন?", reset_password: "পাসওয়ার্ড রিসেট করুন",
      send_reset_link: "রিসেট লিংক পাঠান",
      loading: "লোড হচ্ছে...", save: "সেভ করুন", cancel: "বাতিল", confirm: "নিশ্চিত",
      back: "পিছনে যান", next: "পরবর্তী", yes: "হ্যাঁ", no: "না",
      welcome: "স্বাগতম", role_info: "আপনার ভূমিকা",
      saved_success: "সেভ হয়েছে!", error_occurred: "সমস্যা হয়েছে",
      not_found: "খুঁজে পাওয়া যায়নি",
      copy_link: "লিংক কপি", share_whatsapp: "হোয়াটসঅ্যাপে শেয়ার",
      locked_message: "আপনার সাবস্ক্রিপশন শেষ। চালিয়ে যেতে রিনিউ করুন।"
    }
  },
  en: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "Admin Panel",
      login: "Login", register: "Register", logout: "Logout",
      email: "Email", password: "Password", phone: "Phone", name: "Name",
      whatsapp: "WhatsApp", company_name: "Company Name",
      home: "Home", coupons: "Coupons", users: "Users", withdraw: "Withdraw",
      plan: "Plan", settings: "Settings", dashboard: "Dashboard",
      total_coupons: "Total Coupons", used: "Used", customers: "Customers", pending: "Pending",
      generate_coupons: "Generate Coupons", select_grade: "Select Grade",
      quantity: "Quantity", expiry: "Expiry", generate_btn: "Generate",
      subscription: "Subscription", your_subscription: "Your Subscription",
      upgrade: "Upgrade Now", days_left: "days left", renew: "Renew Now",
      team_management: "Team Management", role_select: "Select Role",
      invite_code: "Invite Code", generate_code: "Generate Code",
      profile: "Profile", my_profile: "My Profile", role: "Role", joined_date: "Joined",
      scan_coupon: "Scan Coupon", manual_entry: "Manual Entry", redeem: "Redeem",
      forgot_password: "Forgot Password?", reset_password: "Reset Password",
      send_reset_link: "Send Reset Link",
      loading: "Loading...", save: "Save", cancel: "Cancel", confirm: "Confirm",
      back: "Go Back", next: "Next", yes: "Yes", no: "No",
      welcome: "Welcome", role_info: "Your Role",
      saved_success: "Saved successfully!", error_occurred: "An error occurred",
      not_found: "Not found",
      copy_link: "Copy Link", share_whatsapp: "Share on WhatsApp",
      locked_message: "Your subscription has expired. Please renew to continue."
    }
  },
  hi: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "एडमिन पैनल",
      login: "लॉगिन", register: "रजिस्टर", logout: "लॉगआउट",
      email: "ईमेल", password: "पासवर्ड", phone: "फ़ोन", name: "नाम",
      whatsapp: "व्हाट्सएप", company_name: "कंपनी का नाम",
      home: "होम", coupons: "कूपन", users: "उपयोगकर्ता", withdraw: "निकासी",
      plan: "प्लान", settings: "सेटिंग्स", dashboard: "डैशबोर्ड",
      total_coupons: "कुल कूपन", used: "उपयोग किए", customers: "ग्राहक", pending: "लंबित",
      generate_coupons: "कूपन बनाएं", select_grade: "ग्रेड चुनें",
      quantity: "मात्रा", expiry: "समाप्ति", generate_btn: "बनाएं",
      subscription: "सदस्यता", your_subscription: "आपकी सदस्यता",
      upgrade: "अपग्रेड करें", days_left: "दिन बाकी", renew: "रिन्यू करें",
      team_management: "टीम प्रबंधन", role_select: "रोल चुनें",
      invite_code: "आमंत्रण कोड", generate_code: "कोड बनाएं",
      profile: "प्रोफ़ाइल", my_profile: "मेरी प्रोफ़ाइल", role: "भूमिका", joined_date: "जुड़े",
      scan_coupon: "कूपन स्कैन करें", manual_entry: "मैन्युअल एंट्री", redeem: "रिडीम करें",
      forgot_password: "पासवर्ड भूल गए?", reset_password: "पासवर्ड रीसेट करें",
      send_reset_link: "रीसेट लिंक भेजें",
      loading: "लोड हो रहा है...", save: "सेव करें", cancel: "रद्द करें", confirm: "पुष्टि करें",
      back: "वापस जाएं", next: "अगला", yes: "हाँ", no: "नहीं",
      welcome: "स्वागत है", role_info: "आपकी भूमिका",
      saved_success: "सफलतापूर्वक सहेजा गया!", error_occurred: "त्रुटि हुई",
      not_found: "नहीं मिला",
      copy_link: "लिंक कॉपी", share_whatsapp: "व्हाट्सएप पर शेयर",
      locked_message: "आपकी सदस्यता समाप्त हो गई है। जारी रखने के लिए रिन्यू करें।"
    }
  },
  or: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "ଆଡମିନ ପ୍ୟାନେଲ",
      login: "ଲଗଇନ", register: "ରେଜିଷ୍ଟର", logout: "ଲଗଆଉଟ",
      email: "ଇମେଲ", password: "ପାସୱାର୍ଡ", phone: "ଫୋନ", name: "ନାମ",
      whatsapp: "ହ୍ୱାଟସଆପ", company_name: "କମ୍ପାନୀ ନାମ",
      home: "ହୋମ", coupons: "କୁପନ", users: "ବ୍ୟବହାରକାରୀ", withdraw: "ଉଠାଣ",
      plan: "ପ୍ଲାନ", settings: "ସେଟିଂସ", dashboard: "ଡ୍ୟାସବୋର୍ଡ",
      total_coupons: "ମୋଟ କୁପନ", used: "ବ୍ୟବହୃତ", customers: "ଗ୍ରାହକ", pending: "ବିଚାରାଧୀନ",
      generate_coupons: "କୁପନ ତିଆରି କରନ୍ତୁ", select_grade: "ଗ୍ରେଡ ଚୟନ",
      quantity: "ପରିମାଣ", expiry: "ସମାପ୍ତି", generate_btn: "ତିଆରି କରନ୍ତୁ",
      subscription: "ସବସ୍କ୍ରିପସନ", your_subscription: "ଆପଣଙ୍କ ସବସ୍କ୍ରିପସନ",
      upgrade: "ଅପଗ୍ରେଡ", days_left: "ଦିନ ବାକି", renew: "ନବୀକରଣ",
      team_management: "ଟିମ ପରିଚାଳନା", role_select: "ରୋଲ ଚୟନ",
      invite_code: "ଆମନ୍ତ୍ରଣ କୋଡ", generate_code: "କୋଡ ତିଆରି",
      profile: "ପ୍ରୋଫାଇଲ", my_profile: "ମୋର ପ୍ରୋଫାଇଲ", role: "ଭୂମିକା", joined_date: "ଯୋଗଦାନ",
      scan_coupon: "କୁପନ ସ୍କାନ", manual_entry: "ମାନୁଆଲ ଏଣ୍ଟ୍ରି", redeem: "ରିଡିମ",
      forgot_password: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ?", reset_password: "ପାସୱାର୍ଡ ରିସେଟ",
      send_reset_link: "ରିସେଟ ଲିଙ୍କ ପଠାନ୍ତୁ",
      loading: "ଲୋଡ ହେଉଛି...", save: "ସେଭ", cancel: "ବାତିଲ", confirm: "ନିଶ୍ଚିତ",
      back: "ପଛକୁ", next: "ପରବର୍ତ୍ତୀ", yes: "ହଁ", no: "ନା",
      welcome: "ସ୍ୱାଗତ", role_info: "ଆପଣଙ୍କ ଭୂମିକା",
      saved_success: "ସେଭ ହୋଇଛି!", error_occurred: "ତ୍ରୁଟି ଘଟିଛି",
      not_found: "ମିଳିଲା ନାହିଁ",
      copy_link: "ଲିଙ୍କ କପି", share_whatsapp: "ହ୍ୱାଟସଆପ ରେ ସେୟାର",
      locked_message: "ଆପଣଙ୍କ ସବସ୍କ୍ରିପସନ ସମାପ୍ତ। ଜାରି ରଖିବାକୁ ନବୀକରଣ କରନ୍ତୁ।"
    }
  },
  ur: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "ایڈمن پینل",
      login: "لاگ ان", register: "رجسٹر", logout: "لاگ آؤٹ",
      email: "ای میل", password: "پاس ورڈ", phone: "فون", name: "نام",
      whatsapp: "واٹس ایپ", company_name: "کمپنی کا نام",
      home: "ہوم", coupons: "کوپن", users: "صارفین", withdraw: "نکاسی",
      plan: "پلان", settings: "سیٹنگز", dashboard: "ڈیش بورڈ",
      total_coupons: "کل کوپن", used: "استعمال شدہ", customers: "گاہک", pending: "زیر التواء",
      generate_coupons: "کوپن بنائیں", select_grade: "گریڈ منتخب کریں",
      quantity: "مقدار", expiry: "میعاد", generate_btn: "بنائیں",
      subscription: "سبسکرپشن", your_subscription: "آپ کی سبسکرپشن",
      upgrade: "اپ گریڈ کریں", days_left: "دن باقی", renew: "تجدید کریں",
      team_management: "ٹیم مینجمنٹ", role_select: "کردار منتخب کریں",
      invite_code: "دعوتی کوڈ", generate_code: "کوڈ بنائیں",
      profile: "پروفائل", my_profile: "میرا پروفائل", role: "کردار", joined_date: "شامل ہوئے",
      scan_coupon: "کوپن اسکین کریں", manual_entry: "دستی اندراج", redeem: "ریڈیم کریں",
      forgot_password: "پاس ورڈ بھول گئے؟", reset_password: "پاس ورڈ ری سیٹ کریں",
      send_reset_link: "ری سیٹ لنک بھیجیں",
      loading: "لوڈ ہو رہا ہے...", save: "محفوظ کریں", cancel: "منسوخ", confirm: "تصدیق",
      back: "واپس جائیں", next: "اگلا", yes: "ہاں", no: "نہیں",
      welcome: "خوش آمدید", role_info: "آپ کا کردار",
      saved_success: "کامیابی سے محفوظ!", error_occurred: "خرابی پیش آئی",
      not_found: "نہیں ملا",
      copy_link: "لنک کاپی", share_whatsapp: "واٹس ایپ پر شیئر",
      locked_message: "آپ کی سبسکرپشن ختم ہو گئی۔ جاری رکھنے کے لیے تجدید کریں۔"
    }
  },
  gu: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "એડમિન પેનલ",
      login: "લોગિન", register: "રજિસ્ટર", logout: "લોગઆઉટ",
      email: "ઈમેલ", password: "પાસવર્ડ", phone: "ફોન", name: "નામ",
      whatsapp: "વોટ્સએપ", company_name: "કંપનીનું નામ",
      home: "હોમ", coupons: "કૂપન", users: "વપરાશકર્તા", withdraw: "ઉપાડ",
      plan: "પ્લાન", settings: "સેટિંગ્સ", dashboard: "ડેશબોર્ડ",
      total_coupons: "કુલ કૂપન", used: "વપરાયેલ", customers: "ગ્રાહકો", pending: "બાકી",
      generate_coupons: "કૂપન બનાવો", select_grade: "ગ્રેડ પસંદ કરો",
      quantity: "જથ્થો", expiry: "સમાપ્તિ", generate_btn: "બનાવો",
      subscription: "સબ્સ્ક્રિપ્શન", your_subscription: "તમારું સબ્સ્ક્રિપ્શન",
      upgrade: "અપગ્રેડ કરો", days_left: "દિવસ બાકી", renew: "રિન્યુ કરો",
      team_management: "ટીમ મેનેજમેન્ટ", role_select: "રોલ પસંદ કરો",
      invite_code: "આમંત્રણ કોડ", generate_code: "કોડ બનાવો",
      profile: "પ્રોફાઇલ", my_profile: "મારી પ્રોફાઇલ", role: "ભૂમિકા", joined_date: "જોડાયા",
      scan_coupon: "કૂપન સ્કેન કરો", manual_entry: "મેન્યુઅલ એન્ટ્રી", redeem: "રિડીમ કરો",
      forgot_password: "પાસવર્ડ ભૂલી ગયા?", reset_password: "પાસવર્ડ રીસેટ કરો",
      send_reset_link: "રીસેટ લિંક મોકલો",
      loading: "લોડ થઈ રહ્યું છે...", save: "સાચવો", cancel: "રદ કરો", confirm: "પુષ્ટિ",
      back: "પાછા જાઓ", next: "આગળ", yes: "હા", no: "ના",
      welcome: "સ્વાગત", role_info: "તમારી ભૂમિકા",
      saved_success: "સફળતાપૂર્વક સાચવ્યું!", error_occurred: "ભૂલ આવી",
      not_found: "મળ્યું નથી",
      copy_link: "લિંક કોપી", share_whatsapp: "વોટ્સએપ પર શેર",
      locked_message: "તમારું સબ્સ્ક્રિપ્શન સમાપ્ત। ચાલુ રાખવા રિન્યુ કરો।"
    }
  },
  mr: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "अॅडमिन पॅनेल",
      login: "लॉगिन", register: "नोंदणी", logout: "लॉगआउट",
      email: "ईमेल", password: "पासवर्ड", phone: "फोन", name: "नाव",
      whatsapp: "व्हॉट्सअॅप", company_name: "कंपनीचे नाव",
      home: "होम", coupons: "कूपन", users: "वापरकर्ते", withdraw: "पैसे काढा",
      plan: "प्लॅन", settings: "सेटिंग्ज", dashboard: "डॅशबोर्ड",
      total_coupons: "एकूण कूपन", used: "वापरलेले", customers: "ग्राहक", pending: "प्रलंबित",
      generate_coupons: "कूपन तयार करा", select_grade: "ग्रेड निवडा",
      quantity: "प्रमाण", expiry: "समाप्ती", generate_btn: "तयार करा",
      subscription: "सदस्यता", your_subscription: "तुमची सदस्यता",
      upgrade: "अपग्रेड करा", days_left: "दिवस शिल्लक", renew: "नूतनीकरण करा",
      team_management: "टीम व्यवस्थापन", role_select: "भूमिका निवडा",
      invite_code: "आमंत्रण कोड", generate_code: "कोड तयार करा",
      profile: "प्रोफाइल", my_profile: "माझे प्रोफाइल", role: "भूमिका", joined_date: "सामील झाले",
      scan_coupon: "कूपन स्कॅन करा", manual_entry: "मॅन्युअल एंट्री", redeem: "रिडीम करा",
      forgot_password: "पासवर्ड विसरलात?", reset_password: "पासवर्ड रीसेट करा",
      send_reset_link: "रीसेट लिंक पाठवा",
      loading: "लोड होत आहे...", save: "जतन करा", cancel: "रद्द करा", confirm: "पुष्टी",
      back: "मागे जा", next: "पुढे", yes: "हो", no: "नाही",
      welcome: "स्वागत", role_info: "तुमची भूमिका",
      saved_success: "यशस्वीरित्या जतन केले!", error_occurred: "त्रुटी आली",
      not_found: "सापडले नाही",
      copy_link: "लिंक कॉपी", share_whatsapp: "व्हॉट्सअॅपवर शेअर",
      locked_message: "तुमची सदस्यता संपली. सुरू ठेवण्यासाठी नूतनीकरण करा."
    }
  },
  ta: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "நிர்வாக பலகை",
      login: "உள்நுழை", register: "பதிவு", logout: "வெளியேறு",
      email: "மின்னஞ்சல்", password: "கடவுச்சொல்", phone: "தொலைபேசி", name: "பெயர்",
      whatsapp: "வாட்ஸ்அப்", company_name: "நிறுவன பெயர்",
      home: "முகப்பு", coupons: "கூப்பன்கள்", users: "பயனர்கள்", withdraw: "விலக்கு",
      plan: "திட்டம்", settings: "அமைப்புகள்", dashboard: "டாஷ்போர்டு",
      total_coupons: "மொத்த கூப்பன்கள்", used: "பயன்படுத்தியது", customers: "வாடிக்கையாளர்கள்", pending: "நிலுவை",
      generate_coupons: "கூப்பன் உருவாக்கு", select_grade: "தரம் தேர்வு",
      quantity: "எண்ணிக்கை", expiry: "காலாவதி", generate_btn: "உருவாக்கு",
      subscription: "சந்தா", your_subscription: "உங்கள் சந்தா",
      upgrade: "மேம்படுத்து", days_left: "நாட்கள் மீதம்", renew: "புதுப்பி",
      team_management: "குழு நிர்வாகம்", role_select: "பங்கு தேர்வு",
      invite_code: "அழைப்பு குறியீடு", generate_code: "குறியீடு உருவாக்கு",
      profile: "சுயவிவரம்", my_profile: "என் சுயவிவரம்", role: "பங்கு", joined_date: "சேர்ந்தது",
      scan_coupon: "கூப்பன் ஸ்கேன்", manual_entry: "கைமுறை உள்ளீடு", redeem: "பயன்படுத்து",
      forgot_password: "கடவுச்சொல் மறந்ததா?", reset_password: "கடவுச்சொல் மீட்டமை",
      send_reset_link: "மீட்டமை இணைப்பு அனுப்பு",
      loading: "ஏற்றுகிறது...", save: "சேமி", cancel: "ரத்து", confirm: "உறுதி",
      back: "பின்செல்", next: "அடுத்து", yes: "ஆம்", no: "இல்லை",
      welcome: "வரவேற்பு", role_info: "உங்கள் பங்கு",
      saved_success: "வெற்றிகரமாக சேமிக்கப்பட்டது!", error_occurred: "பிழை ஏற்பட்டது",
      not_found: "கிடைக்கவில்லை",
      copy_link: "இணைப்பை நகல்", share_whatsapp: "வாட்ஸ்அப்பில் பகிர்",
      locked_message: "உங்கள் சந்தா முடிந்தது. தொடர புதுப்பிக்கவும்."
    }
  },
  te: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "అడ్మిన్ ప్యానెల్",
      login: "లాగిన్", register: "నమోదు", logout: "లాగౌట్",
      email: "ఇమెయిల్", password: "పాస్వర్డ్", phone: "ఫోన్", name: "పేరు",
      whatsapp: "వాట్సాప్", company_name: "కంపెనీ పేరు",
      home: "హోమ్", coupons: "కూపన్లు", users: "వినియోగదారులు", withdraw: "ఉపసంహరణ",
      plan: "ప్లాన్", settings: "సెట్టింగ్లు", dashboard: "డాష్బోర్డ్",
      total_coupons: "మొత్తం కూపన్లు", used: "ఉపయోగించిన", customers: "వినియోగదారులు", pending: "పెండింగ్",
      generate_coupons: "కూపన్ సృష్టించు", select_grade: "గ్రేడ్ ఎంచుకో",
      quantity: "పరిమాణం", expiry: "గడువు", generate_btn: "సృష్టించు",
      subscription: "సభ్యత్వం", your_subscription: "మీ సభ్యత్వం",
      upgrade: "అప్గ్రేడ్", days_left: "రోజులు మిగిలాయి", renew: "పునరుద్ధరించు",
      team_management: "టీమ్ నిర్వహణ", role_select: "పాత్ర ఎంచుకో",
      invite_code: "ఆహ్వాన కోడ్", generate_code: "కోడ్ సృష్టించు",
      profile: "ప్రొఫైల్", my_profile: "నా ప్రొఫైల్", role: "పాత్ర", joined_date: "చేరిన",
      scan_coupon: "కూపన్ స్కాన్", manual_entry: "మాన్యువల్ ఎంట్రీ", redeem: "రిడీమ్",
      forgot_password: "పాస్వర్డ్ మర్చిపోయారా?", reset_password: "పాస్వర్డ్ రీసెట్",
      send_reset_link: "రీసెట్ లింక్ పంపు",
      loading: "లోడ్ అవుతోంది...", save: "సేవ్", cancel: "రద్దు", confirm: "నిర్ధారించు",
      back: "వెనుకకు", next: "తదుపరి", yes: "అవును", no: "కాదు",
      welcome: "స్వాగతం", role_info: "మీ పాత్ర",
      saved_success: "విజయవంతంగా సేవ్!", error_occurred: "లోపం సంభవించింది",
      not_found: "కనుగొనబడలేదు",
      copy_link: "లింక్ కాపీ", share_whatsapp: "వాట్సాప్లో షేర్",
      locked_message: "మీ సభ్యత్వం ముగిసింది. కొనసాగించడానికి పునరుద్ధరించండి."
    }
  },
  ml: {
    translation: {
      app_name: "Coupon SaaS", admin_panel: "അഡ്മിൻ പാനൽ",
      login: "ലോഗിൻ", register: "രജിസ്റ്റർ", logout: "ലോഗൗട്ട്",
      email: "ഇമെയിൽ", password: "പാസ്വേഡ്", phone: "ഫോൺ", name: "പേര്",
      whatsapp: "വാട്ട്സ്ആപ്പ്", company_name: "കമ്പനിയുടെ പേര്",
      home: "ഹോം", coupons: "കൂപ്പണുകൾ", users: "ഉപയോക്താക്കൾ", withdraw: "പിൻവലിക്കൽ",
      plan: "പ്ലാൻ", settings: "സെറ്റിംഗ്സ്", dashboard: "ഡാഷ്ബോർഡ്",
      total_coupons: "ആകെ കൂപ്പണുകൾ", used: "ഉപയോഗിച്ചത്", customers: "ഉപഭോക്താക്കൾ", pending: "തീർപ്പാക്കാത്തത്",
      generate_coupons: "കൂപ്പൺ ഉണ്ടാക്കുക", select_grade: "ഗ്രേഡ് തിരഞ്ഞെടുക്കുക",
      quantity: "അളവ്", expiry: "കാലാവധി", generate_btn: "ഉണ്ടാക്കുക",
      subscription: "സബ്സ്ക്രിപ്ഷൻ", your_subscription: "നിങ്ങളുടെ സബ്സ്ക്രിപ്ഷൻ",
      upgrade: "അപ്ഗ്രേഡ്", days_left: "ദിവസം ബാക്കി", renew: "പുതുക്കുക",
      team_management: "ടീം മാനേജ്മെന്റ്", role_select: "റോൾ തിരഞ്ഞെടുക്കുക",
      invite_code: "ക്ഷണ കോഡ്", generate_code: "കോഡ് ഉണ്ടാക്കുക",
      profile: "പ്രൊഫൈൽ", my_profile: "എന്റെ പ്രൊഫൈൽ", role: "റോൾ", joined_date: "ചേർന്നത്",
      scan_coupon: "കൂപ്പൺ സ്കാൻ", manual_entry: "മാനുവൽ എൻട്രി", redeem: "റിഡീം",
      forgot_password: "പാസ്വേഡ് മറന്നോ?", reset_password: "പാസ്വേഡ് റീസെറ്റ്",
      send_reset_link: "റീസെറ്റ് ലിങ്ക് അയയ്ക്കുക",
      loading: "ലോഡ് ചെയ്യുന്നു...", save: "സേവ്", cancel: "റദ്ദാക്കുക", confirm: "സ്ഥിരീകരിക്കുക",
      back: "പിന്നോട്ട്", next: "അടുത്തത്", yes: "അതെ", no: "ഇല്ല",
      welcome: "സ്വാഗതം", role_info: "നിങ്ങളുടെ റോൾ",
      saved_success: "വിജയകരമായി സേവ് ചെയ്തു!", error_occurred: "പിശക് സംഭവിച്ചു",
      not_found: "കണ്ടെത്തിയില്ല",
      copy_link: "ലിങ്ക് പകർത്തുക", share_whatsapp: "വാട്ട്സ്ആപ്പിൽ പങ്കിടുക",
      locked_message: "നിങ്ങളുടെ സബ്സ്ക്രിപ്ഷൻ കാലഹരണപ്പെട്ടു. തുടരാൻ പുതുക്കുക."
    }
  }
};

// ==================== i18next চালু ====================
i18next.init({
  lng: localStorage.getItem('lang') || 'bn',
  fallbackLng: 'bn',
  resources: resources,
  interpolation: { escapeValue: false }
});

// ==================== Global Export ====================
window.i18n = i18next;
window.LANGUAGES = LANGUAGES;
