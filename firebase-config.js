// ============================================
// firebase-config.js
// Firebase Configuration & Services
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ⬇⬇⬇ আপনার Firebase (Beta) কনফিগ এখানে বসান ⬇⬇⬇
// Firebase Console -> CouponSystem-Beta -> Project Settings -> Web App
const firebaseConfig = {
  apiKey: "AIzaSyC59_zbUP1xlqpowS-dfCyeUmQPR1VhPLk",
  authDomain: "couponsystem-beta.firebaseapp.com",
  databaseURL: "https://couponsystem-beta-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "couponsystem-beta",
  storageBucket: "couponsystem-beta.firebasestorage.app",
  messagingSenderId: "420484645883",
  appId: "1:420484645883:web:e0df430315104d2b10015e",
  measurementId: "G-Y5YECTQ61J"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
