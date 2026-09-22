// ============================================
// firebase-config-prod.js (Production)
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ⬇⬇⬇ Production Firebase (CouponSystem) কনফিগ এখানে বসান ⬇⬇⬇
const firebaseConfig = {
  apiKey: "PROD_API_KEY",
  authDomain: "PROD_AUTH_DOMAIN",
  projectId: "PROD_PROJECT_ID",
  storageBucket: "PROD_STORAGE_BUCKET",
  messagingSenderId: "PROD_SENDER_ID",
  appId: "PROD_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
