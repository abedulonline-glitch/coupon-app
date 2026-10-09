# 🔄 AI Handoff Template — New Feature Development

> **📌 উদ্দেশ্য:** যখন আপনি একটি নতুন ফিচার ডেভেলপ করার জন্য **নতুন AI** (ChatGPT / Gemini / Claude) ব্যবহার করবেন, তখন এই টেমপ্লেটটি কপি করে নতুন AI-কে পাঠাবেন।

---

## 📋 Step 1: নতুন AI-কে এই প্রম্পটটি পাঠান
তুমি আমার Multi-Tenant SaaS প্রজেক্ট "Coupon App"-এ একটি নতুন ফিচার ডেভেলপ করবে।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 ধাপ ১: প্রথমে README.md পড়ো (সম্পূর্ণ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

https://raw.githubusercontent.com/abedulonline-glitch/coupon-app/main/README.md

এই README-তে Class/ID Registry, Database Structure,
Calculation Logic, এবং Features List রয়েছে।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ধাপ ২: তোমার কাজ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ফিচারের নাম: [এখানে ফিচারের নাম লিখুন]
যেমন: Item Rendering System

বিবরণ: [এখানে সংক্ষেপে লিখুন কী বানাতে চান]
যেমন: স্টক এন্ট্রির পর সব আইটেম কার্ড আকারে দেখাবে,
ছবি + নাম + দাম + পরিমাণ সহ, Edit/Delete অপশন।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ধাপ ৩: গুরুত্বপূর্ণ শর্ত
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

১. README-তে যে Class/ID আছে, সেগুলো ডুপ্লিকেট করবে না।
২. নতুন Class/ID যোগ করলে README-এর ফরম্যাটে লিখবে।
৩. Firebase, ImgBB, Cropper.js — সম্পূর্ণ প্রজেক্ট কনটেক্সট বুঝে কাজ করবে।
৪. যেখানে সম্ভব, বিদ্যমান ফাংশন/ক্লাস ব্যবহার করবে।
৫. নতুন কোনো ডিপেন্ডেন্সি যোগ করলে সেটি স্পষ্টভাবে উল্লেখ করবে।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 ধাপ ৪: কাজ শেষে SUMMARY দাও (এই ফরম্যাটে)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

=== PROJECT UPDATE SUMMARY ===

Date: YYYY-MM-DD HH:MM
Feature: [ফিচারের নাম]
Session: [Session নাম্বার]
AI Model: [ChatGPT / Gemini / Claude / Other]

FILE(S) CREATED:

[filename.js/html] | [উদ্দেশ্য]

FILE(S) MODIFIED:

[filename.js/html]: [কী পরিবর্তন করেছি]

NEW CLASSES/IDS:

[class/id] | [উদ্দেশ্য]

[class/id] | [উদ্দেশ্য]

NEW FUNCTIONS:

[functionName()] | [উদ্দেশ্য]

MODIFIED EXISTING FUNCTIONS:

[functionName()]: [কী পরিবর্তন]

DEPENDENCIES:

Requires: [কোন ফাংশন/ফাইল লাগবে]

Uses: [কোন API/সেবা ব্যবহার করেছে]

UPDATE LOG ENTRY (এই এক লাইনটি README-তে যাবে):
| YYYY-MM-DD | [ফাইল] | [সংক্ষেপে পরিবর্তন] |

DEPRECATED (যদি কোনো পুরনো ক্লাস ডিলিট করো):

[class/id] | [কারণ] | [কী দিয়ে রিপ্লেস করেছো]

NOTES FOR NEXT SESSION:

[ভবিষ্যতে কোন কাজ বাকি]

[কোনো সতর্কতা]

=== END SUMMARY ===

---

## 📋 Step 2: কাজ শেষ হলে

নতুন AI যখন SUMMARY দেবে, আপনি:

১. SUMMARY কপি করুন।
২. মূল README.md-এর জন্য **AI-২ (বর্তমান মডাল)**-এর কাছে ফিরে আসুন।
৩. বলুন: *"AI-২ এই কাজ করেছে। README আপডেট করে দিন।"*
৪. SUMMARY পেস্ট করুন।
৫. আমি README-এর ৫টি সেকশন আপডেট করে ছোট ছোট স্নিপেট দেব:
   - Update Log
   - Update Timeline
   - Class & ID Registry
   - Deprecated Classes (যদি থাকে)
   - Features Implemented

---

## 📋 Step 3: নতুন AI-এর জন্য চেকলিস্ট

নতুন AI-কে দেওয়ার আগে নিশ্চিত করুন:

- [ ] README.md-এর লিংক সঠিক আছে
- [ ] ফিচারের বিবরণ স্পষ্ট
- [ ] আগের কোনো Class/ID ডুপ্লিকেট হচ্ছে না
- [ ] SUMMARY ফরম্যাট কপি করা আছে
- [ ] আগের Session-এর শেষ অবস্থা জানানো হয়েছে

---

## ⚠️ সতর্কতা

**১. নতুন AI-কে README-এর লিংক না দিলে:**
- সে ডুপ্লিকেট Class/ID বানাতে পারে
- বিদ্যমান ফাংশন ব্যবহার না করে নতুন ফাংশন বানাবে
- প্রজেক্টের লজিক ভুল বুঝবে

**২. SUMMARY না নিলে:**
- README.md আপ-টু-ডেট থাকবে না
- পরবর্তী AI বুঝতে পারবে না কী হয়েছে
- Class/ID Registry ভুল হয়ে যাবে

**৩. একই ফিচারে দুই AI ব্যবহার করলে:**
- আগের AI-এর SUMMARY নতুন AI-কে দেখাতে হবে
- নাহলে দুটো আলাদা সিস্টেম তৈরি হবে

---

**Made with ❤️ for Multi-AI Development**
