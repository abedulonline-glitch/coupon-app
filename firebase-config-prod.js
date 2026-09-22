// ============================================
// firebase-config-prod.js (Production)
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ⬇⬇⬇ Production Firebase (CouponSystem) কনফিগ এখানে বসান ⬇⬇⬇
const firebaseConfig = {
  apiKey: "AIzaSyBZCFgugZCLuyryQiuLYY-HjBin6QeFQd0",
  authDomain: "couponsystem-7c625.firebaseapp.com",
  projectId: "couponsystem-7c625",
  storageBucket: "couponsystem-7c625.firebasestorage.app",
  messagingSenderId: "211989339411",
  appId: "1:211989339411:web:5efe34a6db6b006b434ee6",
  measurementId: "G-76WETNMGGL"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
