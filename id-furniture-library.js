/* ============================================================
   INTERIOR DESIGN STUDIO — id-furniture-library.js
   ফার্নিচার / লাইট / স্যানিটারি / ডেকোর / আউটসাইড ডেটাবেস
   সব 3D মডেল প্রসিডিউরালি তৈরি — কোনো পেইড asset নেই।
   প্রিফিক্স: id-  |  নতুন Class নেই (শুধু ডেটা + ফাংশন export)
   ============================================================ */

/**
 * প্রতিটি আইটেমের গঠন:
 * {
 *   id, name, emoji, cat,
 *   dims: { w, d, h },        // ফুট — রুমের স্কেলে
 *   color: '#hex',            // মেইন রঙ (ইউজার বদলাতে পারবে)
 *   parts: [                  // Three.js primitives
 *     { t:'box',  s:[w,h,d],   p:[x,y,z], c:'#hex', r:[rx,ry,rz] },
 *     { t:'cyl',  rt, rb, h, p, c, r },
 *     { t:'sph',  r,  p, c },
 *     { t:'cone', r, h, p, c },
 *     { t:'torus',r, t, p, c },
 *     { t:'plane',w, h, p, c, r }
 *   ],
 *   snap: 'floor' | 'wall' | 'ceiling'   // ডিফল্ট প্লেসমেন্ট
 * }
 *
 * r (rotation) / p (position) — degrees / ফুট; রেন্ডার ইঞ্জিন রেডিয়ান ও স্কেলে কনভার্ট করবে
 * না দিলে ডিফল্ট 0
 */

// ---------- helpers ----------
const B = (s, p = [0,0,0], c = '#ccc', r) => ({ t:'box',   s, p, c, ...(r && { r }) });
const C = (rt, rb, h, p = [0,0,0], c = '#ccc', r) => ({ t:'cyl', rt, rb, h, p, c, ...(r && { r }) });
const S = (rad, p = [0,0,0], c = '#ccc') => ({ t:'sph', r: rad, p, c });
const N = (rad, h, p = [0,0,0], c = '#ccc') => ({ t:'cone', r: rad, h, p, c });
const T = (rad, tub, p = [0,0,0], c = '#ccc', r) => ({ t:'torus', r: rad, t: tub, p, c, ...(r && { r }) });
const P = (w, h, p = [0,0,0], c = '#ccc', r) => ({ t:'plane', w, h, p, c, ...(r && { r }) });

// ============================================================
// 🛋️  FURNITURE
// ============================================================
export const FURNITURE = [
  // ---- Sofa ----
  { id:'sofa-3seat', name:'সোফা ৩-সিটার', emoji:'🛋️', cat:'furniture', snap:'floor',
    dims:{ w:7, d:3, h:2.5 }, color:'#6b7a8f',
    parts:[
      B([7,0.6,3], [0,0.3,0], '#6b7a8f'),
      B([7,0.7,0.7],[0,0.95,-1.15],'#5c6b80'),
      B([0.5,1.4,3],[3.25,0.7,0],'#5c6b80'),
      B([0.5,1.4,3],[-3.25,0.7,0],'#5c6b80'),
      B([2,0.5,2.6],[0,0.85,0.1],'#7b8aa0'),
      B([0.15,0.15,0.15],[3,0.075,1.4],'#222'),
      B([0.15,0.15,0.15],[-3,0.075,1.4],'#222'),
      B([0.15,0.15,0.15],[3,0.075,-1.4],'#222'),
      B([0.15,0.15,0.15],[-3,0.075,-1.4],'#222')
    ]
  },
  { id:'sofa-2seat', name:'সোফা ২-সিটার', emoji:'🛋️', cat:'furniture', snap:'floor',
    dims:{ w:5, d:3, h:2.5 }, color:'#8a7b6b',
    parts:[
      B([5,0.6,3],[0,0.3,0],'#8a7b6b'),
      B([5,0.7,0.7],[0,0.95,-1.15],'#7a6b5b'),
      B([0.5,1.4,3],[2.25,0.7,0],'#7a6b5b'),
      B([0.5,1.4,3],[-2.25,0.7,0],'#7a6b5b'),
      B([1.5,0.5,2.6],[0,0.85,0.1],'#9a8b7b')
    ]
  },
  { id:'sofa-l', name:'L-শেপ সোফা', emoji:'🛋️', cat:'furniture', snap:'floor',
    dims:{ w:9, d:6, h:2.5 }, color:'#556b7e',
    parts:[
      B([9,0.6,3],[0,0.3,0],'#556b7e'),
      B([9,0.7,0.7],[0,0.95,-1.15],'#455b6e'),
      B([0.5,1.4,3],[-4.25,0.7,0],'#455b6e'),
      B([0.5,1.4,3],[4.25,0.7,0],'#455b6e'),
      B([3,0.6,3],[3,0.3,3],'#556b7e'),
      B([0.7,0.7,3],[4.25,0.95,3],'#455b6e'),
      B([3,0.7,0.7],[3,0.95,4.35],'#455b6e')
    ]
  },
  { id:'sofa-recliner', name:'রিক্লাইনার সোফা', emoji:'🛋️', cat:'furniture', snap:'floor',
    dims:{ w:3, d:3.5, h:3.5 }, color:'#4a4a55',
    parts:[
      B([3,0.5,3],[0,0.25,0],'#4a4a55'),
      B([3,2.5,0.5],[0,1.75,-1.4],'#3a3a45'),
      B([0.4,1,3],[1.3,0.75,0],'#3a3a45'),
      B([0.4,1,3],[-1.3,0.75,0],'#3a3a45'),
      B([2.4,0.4,0.6],[0,0.55,1.2],'#5a5a65')
    ]
  },

  // ---- Bed ----
  { id:'bed-king', name:'কিং বেড', emoji:'🛏️', cat:'furniture', snap:'floor',
    dims:{ w:6.5, d:7, h:3.5 }, color:'#8b6f47',
    parts:[
      B([6.5,0.4,7],[0,0.2,0],'#8b6f47'),
      B([6.5,0.6,1],[0,1.7,-3],'#7a5f37'),
      B([0.3,3.4,7],[3.1,1.7,0],'#7a5f37'),
      B([0.3,3.4,7],[-3.1,1.7,0],'#7a5f37'),
      B([6,0.8,6.5],[0,0.8,0.2],'#f0f0f0'),
      B([2,0.4,2.5],[0,1.4,-2],'#e0e0e0'),
      B([2,0.4,2.5],[0,1.4,2],'#e0e0e0')
    ]
  },
  { id:'bed-queen', name:'কুইন বেড', emoji:'🛏️', cat:'furniture', snap:'floor',
    dims:{ w:5, d:6.5, h:3.5 }, color:'#8b6f47',
    parts:[
      B([5,0.4,6.5],[0,0.2,0],'#8b6f47'),
      B([5,0.6,1],[0,1.7,-2.75],'#7a5f37'),
      B([0.3,3.4,6.5],[2.35,1.7,0],'#7a5f37'),
      B([0.3,3.4,6.5],[-2.35,1.7,0],'#7a5f37'),
      B([4.6,0.8,6],[0,0.8,0.2],'#f0f0f0')
    ]
  },
  { id:'bed-single', name:'সিঙ্গেল বেড', emoji:'🛏️', cat:'furniture', snap:'floor',
    dims:{ w:3.5, d:6, h:3 }, color:'#a08060',
    parts:[
      B([3.5,0.4,6],[0,0.2,0],'#a08060'),
      B([3.5,0.6,0.8],[0,1.5,-2.6],'#8a6a4a'),
      B([0.3,2.8,6],[1.6,1.5,0],'#8a6a4a'),
      B([0.3,2.8,6],[-1.6,1.5,0],'#8a6a4a'),
      B([3.2,0.7,5.6],[0,0.75,0.2],'#f0f0f0')
    ]
  },
  { id:'bed-bunk', name:'বাঙ্ক বেড', emoji:'🛏️', cat:'furniture', snap:'floor',
    dims:{ w:3.5, d:6, h:6 }, color:'#7a5f37',
    parts:[
      B([3.5,0.4,6],[0,0.2,0],'#7a5f37'),
      B([3.5,0.4,6],[0,4,0],'#7a5f37'),
      B([0.3,6,0.3],[1.6,3,-2.85],'#6a4f27'),
      B([0.3,6,0.3],[-1.6,3,-2.85],'#6a4f27'),
      B([0.3,6,0.3],[1.6,3,2.85],'#6a4f27'),
      B([0.3,6,0.3],[-1.6,3,2.85],'#6a4f27')
    ]
  },

  // ---- Table / Chair ----
  { id:'table-dining-6', name:'ডাইনিং টেবিল ৬ সিট', emoji:'🍽️', cat:'furniture', snap:'floor',
    dims:{ w:6, d:3.5, h:2.5 }, color:'#5a4a3a',
    parts:[
      B([6,0.3,3.5],[0,2.35,0],'#5a4a3a'),
      B([0.4,2.2,0.4],[2.6,1.1,1.4],'#4a3a2a'),
      B([0.4,2.2,0.4],[-2.6,1.1,1.4],'#4a3a2a'),
      B([0.4,2.2,0.4],[2.6,1.1,-1.4],'#4a3a2a'),
      B([0.4,2.2,0.4],[-2.6,1.1,-1.4],'#4a3a2a')
    ]
  },
  { id:'table-round', name:'রাউন্ড টেবিল', emoji:'🍽️', cat:'furniture', snap:'floor',
    dims:{ w:4, d:4, h:2.5 }, color:'#6a5a4a',
    parts:[
      C(2, 2, 0.3, [0,2.35,0], '#6a5a4a'),
      C(0.4, 0.6, 2.2, [0,1.1,0], '#5a4a3a')
    ]
  },
  { id:'chair-dining', name:'ডাইনিং চেয়ার', emoji:'🪑', cat:'furniture', snap:'floor',
    dims:{ w:1.5, d:1.5, h:3 }, color:'#8a6a4a',
    parts:[
      B([1.5,0.2,1.5],[0,1.5,0],'#8a6a4a'),
      B([1.5,2,0.2],[0,2.6,-0.65],'#7a5a3a'),
      B([0.15,1.5,0.15],[0.65,0.75,0.65],'#6a4a2a'),
      B([0.15,1.5,0.15],[-0.65,0.75,0.65],'#6a4a2a'),
      B([0.15,1.5,0.15],[0.65,0.75,-0.65],'#6a4a2a'),
      B([0.15,1.5,0.15],[-0.65,0.75,-0.65],'#6a4a2a')
    ]
  },
  { id:'chair-office', name:'অফিস চেয়ার', emoji:'💺', cat:'furniture', snap:'floor',
    dims:{ w:2, d:2, h:4 }, color:'#222',
    parts:[
      B([2,0.3,2],[0,1.7,0],'#222'),
      B([2,2.5,0.2],[0,3.1,-0.9],'#1a1a1a'),
      C(0.15, 0.15, 0.7, [0,1.2,0], '#555'),
      C(0.8, 0.8, 0.1, [0,0.05,0], '#333')
    ]
  },
  { id:'stool-bar', name:'বার স্টুল', emoji:'🪑', cat:'furniture', snap:'floor',
    dims:{ w:1.2, d:1.2, h:2.8 }, color:'#4a4a4a',
    parts:[
      C(0.6, 0.6, 0.15, [0,2.8,0], '#4a4a4a'),
      C(0.1, 0.1, 2.7, [0,1.4,0], '#3a3a3a'),
      C(0.5, 0.5, 0.08, [0,0.1,0], '#333')
    ]
  },

  // ---- Storage ----
  { id:'wardrobe-3', name:'ওয়ারড্রোব ৩-দরজা', emoji:'🚪', cat:'furniture', snap:'wall',
    dims:{ w:6, d:2, h:7 }, color:'#8b6f47',
    parts:[
      B([6,7,2],[0,3.5,0],'#8b6f47'),
      B([0.1,6,2.05],[0,3.5,0],'#7a5f37'),
      B([0.1,6,2.05],[2,3.5,0],'#7a5f37'),
      B([0.1,6,2.05],[-2,3.5,0],'#7a5f37'),
      C(0.08, 0.08, 0.5, [0.6,3.5,1.1], '#c0a060', [90,0,0]),
      C(0.08, 0.08, 0.5, [-0.6,3.5,1.1], '#c0a060', [90,0,0])
    ]
  },
  { id:'tv-unit', name:'টিভি ইউনিট', emoji:'📺', cat:'furniture', snap:'wall',
    dims:{ w:5, d:1.5, h:1.5 }, color:'#2a2a2a',
    parts:[
      B([5,1.5,1.5],[0,0.75,0],'#2a2a2a'),
      B([3.5,2,0.2],[0,3,0],'#111'),
      B([3.4,1.9,0.05],[0,3,0.13],'#1a3a5a')
    ]
  },
  { id:'bookshelf', name:'বুকশেলফ', emoji:'📚', cat:'furniture', snap:'wall',
    dims:{ w:3, d:1, h:6 }, color:'#5a4a3a',
    parts:[
      B([3,0.1,1],[0,0.05,0],'#5a4a3a'),
      B([3,0.1,1],[0,1.5,0],'#5a4a3a'),
      B([3,0.1,1],[0,3,0],'#5a4a3a'),
      B([3,0.1,1],[0,4.5,0],'#5a4a3a'),
      B([3,0.1,1],[0,6,0],'#5a4a3a'),
      B([0.15,6,1],[1.5,3,0],'#4a3a2a'),
      B([0.15,6,1],[-1.5,3,0],'#4a3a2a')
    ]
  },
  { id:'cabinet-kitchen', name:'কিচেন কেবিনেট', emoji:'🗄️', cat:'furniture', snap:'floor',
    dims:{ w:4, d:2, h:3 }, color:'#d0d0d0',
    parts:[
      B([4,3,2],[0,1.5,0],'#d0d0d0'),
      B([3.9,0.05,0.05],[0,1.5,1],'#999'),
      C(0.05, 0.05, 0.6, [1,1.5,1.05], '#888', [90,0,0]),
      C(0.05, 0.05, 0.6, [-1,1.5,1.05], '#888', [90,0,0])
    ]
  },
  { id:'nightstand', name:'নাইটস্ট্যান্ড', emoji:'🗄️', cat:'furniture', snap:'floor',
    dims:{ w:1.5, d:1.5, h:2 }, color:'#7a5f37',
    parts:[
      B([1.5,2,1.5],[0,1,0],'#7a5f37'),
      C(0.04, 0.04, 0.5, [0,1.3,0.8], '#c0a060', [90,0,0])
    ]
  },
  { id:'coffee-table', name:'কফি টেবিল', emoji:'☕', cat:'furniture', snap:'floor',
    dims:{ w:3, d:1.5, h:1.2 }, color:'#4a3a2a',
    parts:[
      B([3,0.15,1.5],[0,1.15,0],'#4a3a2a'),
      B([0.15,1,0.15],[1.4,0.5,0.65],'#3a2a1a'),
      B([0.15,1,0.15],[-1.4,0.5,0.65],'#3a2a1a'),
      B([0.15,1,0.15],[1.4,0.5,-0.65],'#3a2a1a'),
      B([0.15,1,0.15],[-1.4,0.5,-0.65],'#3a2a1a')
    ]
  },
  { id:'desk', name:'ডেস্ক', emoji:'🖥️', cat:'furniture', snap:'floor',
    dims:{ w:4, d:2, h:2.5 }, color:'#8b6f47',
    parts:[
      B([4,0.2,2],[0,2.4,0],'#8b6f47'),
      B([0.2,2.4,2],[1.9,1.2,0],'#7a5f37'),
      B([0.2,2.4,2],[-1.9,1.2,0],'#7a5f37')
    ]
  },

  // ---- Misc ----
  { id:'ottoman', name:'অটোম্যান', emoji:'🪑', cat:'furniture', snap:'floor',
    dims:{ w:2, d:2, h:1.5 }, color:'#a08060',
    parts:[
      C(1, 1, 1.2, [0,0.6,0], '#a08060'),
      C(0.9, 0.9, 0.3, [0,1.35,0], '#b09070')
    ]
  },
  { id:'bench', name:'বেঞ্চ', emoji:'🪑', cat:'furniture', snap:'floor',
    dims:{ w:4, d:1.2, h:1.5 }, color:'#5a4a3a',
    parts:[
      B([4,0.2,1.2],[0,1.4,0],'#5a4a3a'),
      B([0.2,1.4,1.2],[1.7,0.7,0],'#4a3a2a'),
      B([0.2,1.4,1.2],[-1.7,0.7,0],'#4a3a2a')
    ]
  },
  { id:'crib', name:'ক্রিব', emoji:'🛏️', cat:'furniture', snap:'floor',
    dims:{ w:3, d:5, h:2.5 }, color:'#e0d0b0',
    parts:[
      B([3,0.3,5],[0,1,0],'#e0d0b0'),
      B([3,2,0.15],[0,1.5,-2.5],'#d0c0a0'),
      B([0.15,2,5],[1.5,1.5,0],'#d0c0a0'),
      B([0.15,2,5],[-1.5,1.5,0],'#d0c0a0')
    ]
  }
];

// ============================================================
// 💡  LIGHTS
// ============================================================
export const LIGHTS = [
  { id:'light-chandelier', name:'শ্যান্ডেলিয়ার', emoji:'💎', cat:'light', snap:'ceiling',
    dims:{ w:3, d:3, h:4 }, color:'#d4af37', light:{ type:'point', color:'#fff5cc', intensity:1.5, dist:20 },
    parts:[
      C(0.05, 0.05, 1.5, [0,-0.75,0], '#333'),
      C(0.3, 0.3, 0.2, [0,-1.6,0], '#d4af37'),
      S(0.2, [1, -2, 0], '#fff5cc'),
      S(0.2, [-1, -2, 0], '#fff5cc'),
      S(0.2, [0, -2, 1], '#fff5cc'),
      S(0.2, [0, -2, -1], '#fff5cc')
    ]
  },
  { id:'light-ceiling-round', name:'সিলিং লাইট', emoji:'💡', cat:'light', snap:'ceiling',
    dims:{ w:1.5, d:1.5, h:0.5 }, color:'#f5f5f5', light:{ type:'point', color:'#ffffff', intensity:1, dist:15 },
    parts:[
      C(0.75, 0.75, 0.3, [0,-0.15,0], '#f5f5f5'),
      C(0.7, 0.7, 0.05, [0,-0.32,0], '#fff5cc')
    ]
  },
  { id:'light-pendant', name:'পেনডেন্ট লাইট', emoji:'💡', cat:'light', snap:'ceiling',
    dims:{ w:1, d:1, h:3 }, color:'#333', light:{ type:'point', color:'#ffddaa', intensity:0.8, dist:12 },
    parts:[
      C(0.03, 0.03, 2.5, [0,-1.25,0], '#333'),
      N(0.4, 0.5, [0,-2.75,0], '#222'),
      S(0.15, [0,-2.9,0], '#ffddaa')
    ]
  },
  { id:'light-wall-sconce', name:'ওয়াল স্কন্স', emoji:'🔦', cat:'light', snap:'wall',
    dims:{ w:0.6, d:0.6, h:1.2 }, color:'#c0a060', light:{ type:'point', color:'#ffe0b0', intensity:0.6, dist:8 },
    parts:[
      B([0.6,0.4,0.3],[0,0,0],'#c0a060'),
      N(0.3, 0.5, [0,0.4,0.1], '#d4b070'),
      S(0.1, [0,0.55,0.3], '#ffe0b0')
    ]
  },
  { id:'light-floor-lamp', name:'ফ্লোর ল্যাম্প', emoji:'🛋️', cat:'light', snap:'floor',
    dims:{ w:1.5, d:1.5, h:5 }, color:'#333', light:{ type:'point', color:'#fff0d0', intensity:0.7, dist:10 },
    parts:[
      C(0.5, 0.6, 0.1, [0,0.05,0], '#222'),
      C(0.05, 0.05, 5, [0,2.5,0], '#333'),
      N(0.5, 0.8, [0,4.9,0], '#d4b070'),
      S(0.15, [0,4.7,0], '#fff0d0')
    ]
  },
  { id:'light-table-lamp', name:'টেবিল ল্যাম্প', emoji:'💡', cat:'light', snap:'floor',
    dims:{ w:1, d:1, h:1.5 }, color:'#8b6f47', light:{ type:'point', color:'#ffddaa', intensity:0.5, dist:6 },
    parts:[
      C(0.4, 0.5, 0.1, [0,0.05,0], '#8b6f47'),
      C(0.05, 0.05, 0.8, [0,0.5,0], '#333'),
      N(0.35, 0.5, [0,1.1,0], '#f0e0c0'),
      S(0.1, [0,1,0], '#ffddaa')
    ]
  },
  { id:'light-led-strip', name:'LED স্ট্রিপ', emoji:'🌈', cat:'light', snap:'wall',
    dims:{ w:6, d:0.2, h:0.2 }, color:'#00e5ff', light:{ type:'point', color:'#00e5ff', intensity:0.6, dist:8 },
    parts:[
      B([6,0.15,0.15],[0,0,0],'#00e5ff')
    ]
  },
  { id:'light-spot', name:'স্পট লাইট', emoji:'🔦', cat:'light', snap:'ceiling',
    dims:{ w:0.5, d:0.5, h:0.4 }, color:'#222', light:{ type:'spot', color:'#ffffff', intensity:1.2, dist:12, angle:35 },
    parts:[
      C(0.25, 0.25, 0.3, [0,-0.15,0], '#222')
    ]
  },
  { id:'fan-ceiling', name:'সিলিং ফ্যান', emoji:'🌀', cat:'light', snap:'ceiling',
    dims:{ w:4, d:4, h:1.5 }, color:'#c0c0c0',
    parts:[
      C(0.1, 0.1, 0.8, [0,-0.4,0], '#888'),
      C(0.35, 0.35, 0.2, [0,-0.9,0], '#c0c0c0'),
      B([4,0.05,0.4],[0,-0.9,0],'#d0d0d0'),
      B([0.4,0.05,4],[0,-0.9,0],'#d0d0d0')
    ]
  }
];

// ============================================================
// 🚿  SANITARY
// ============================================================
export const SANITARY = [
  { id:'wc-western', name:'ওয়েস্টার্ন কমোড', emoji:'🚽', cat:'sanitary', snap:'floor',
    dims:{ w:1.5, d:2.2, h:2.5 }, color:'#ffffff',
    parts:[
      B([1.5,0.9,1.5],[0,0.45,0],'#fff'),
      B([1.5,0.3,1.5],[0,0.9,0],'#e8e8e8'),
      B([1.5,2,0.6],[0,1.4,-0.8],'#f0f0f0'),
      C(0.5, 0.5, 0.15, [0,1,0.1], '#fff')
    ]
  },
  { id:'wc-indian', name:'ইন্ডিয়ান টয়লেট', emoji:'🚽', cat:'sanitary', snap:'floor',
    dims:{ w:1.5, d:2, h:0.4 }, color:'#ffffff',
    parts:[
      B([1.5,0.3,2],[0,0.15,0],'#fff'),
      C(0.5, 0.5, 0.1, [0,0.32,-0.3], '#e8e8e8')
    ]
  },
  { id:'basin-wall', name:'ওয়াল বেসিন', emoji:'🚰', cat:'sanitary', snap:'wall',
    dims:{ w:2, d:1.5, h:1 }, color:'#ffffff',
    parts:[
      B([2,0.8,1.5],[0,0,0],'#fff'),
      B([2,0.2,0.6],[0,0.6,-0.2],'#e8e8e8'),
      C(0.03, 0.03, 0.6, [0,0.9,-0.6], '#c0c0c0', [90,0,0])
    ]
  },
  { id:'basin-pedestal', name:'পেডেস্টাল বেসিন', emoji:'🚰', cat:'sanitary', snap:'floor',
    dims:{ w:1.8, d:1.5, h:3 }, color:'#ffffff',
    parts:[
      C(0.35, 0.4, 2.2, [0,1.1,0], '#fff'),
      C(0.9, 0.7, 0.4, [0,2.4,0], '#fff'),
      C(0.03, 0.03, 0.4, [0,2.75,-0.6], '#c0c0c0', [90,0,0])
    ]
  },
  { id:'shower-head', name:'শাওয়ার হেড', emoji:'🚿', cat:'sanitary', snap:'wall',
    dims:{ w:0.8, d:0.8, h:0.5 }, color:'#c0c0c0',
    parts:[
      C(0.03, 0.03, 1, [0,0.5,0], '#c0c0c0'),
      C(0.35, 0.35, 0.15, [0,1,0.3], '#d0d0d0')
    ]
  },
  { id:'bathtub', name:'বাথটাব', emoji:'🛁', cat:'sanitary', snap:'floor',
    dims:{ w:2.5, d:5.5, h:2 }, color:'#ffffff',
    parts:[
      B([2.5,2,5.5],[0,1,0],'#fff'),
      B([2.1,0.3,5.1],[0,1.85,0],'#e0f0ff')
    ]
  },
  { id:'mirror-bath', name:'বাথরুম আয়না', emoji:'🪞', cat:'sanitary', snap:'wall',
    dims:{ w:2, d:0.15, h:3 }, color:'#c0d8e8',
    parts:[
      B([2,3,0.1],[0,0,0],'#c0d8e8'),
      B([2.1,3.1,0.05],[0,0,-0.05],'#8b6f47')
    ]
  },
  { id:'towel-rack', name:'টাওয়েল র্যাক', emoji:'🧻', cat:'sanitary', snap:'wall',
    dims:{ w:2, d:0.3, h:0.3 }, color:'#c0c0c0',
    parts:[
      C(0.03, 0.03, 2, [0,0,0], '#c0c0c0', [0,0,90]),
      B([0.3,0.9,0.1],[0.5,-0.5,0.1],'#f0f0f0'),
      B([0.3,0.9,0.1],[-0.5,-0.5,0.1],'#f0f0f0')
    ]
  },
  { id:'cabinet-bath', name:'বাথরুম কেবিনেট', emoji:'🗄️', cat:'sanitary', snap:'wall',
    dims:{ w:2, d:0.8, h:2.5 }, color:'#e0e0e0',
    parts:[
      B([2,2.5,0.8],[0,0,0],'#e0e0e0'),
      C(0.05, 0.05, 0.4, [0.8,0,0.45], '#888', [90,0,0]),
      C(0.05, 0.05, 0.4, [-0.8,0,0.45], '#888', [90,0,0])
    ]
  }
];

// ============================================================
// 🪴  DECOR
// ============================================================
export const DECOR = [
  { id:'decor-plant-tall', name:'বড় প্লান্ট', emoji:'🪴', cat:'decor', snap:'floor',
    dims:{ w:2, d:2, h:5 }, color:'#2e7d32',
    parts:[
      C(0.6, 0.45, 1.2, [0,0.6,0], '#8d6e63'),
      S(1.2, [0,2.8,0], '#2e7d32'),
      S(0.9, [0.3,3.8,0], '#388e3c'),
      S(0.8, [-0.4,3.5,0.3], '#43a047'),
      S(0.7, [0.2,4.5,-0.2], '#4caf50')
    ]
  },
  { id:'decor-plant-small', name:'ছোট প্লান্ট', emoji:'🌿', cat:'decor', snap:'floor',
    dims:{ w:1, d:1, h:2 }, color:'#2e7d32',
    parts:[
      C(0.35, 0.3, 0.6, [0,0.3,0], '#8d6e63'),
      S(0.7, [0,1.2,0], '#2e7d32'),
      S(0.5, [0.2,1.7,0], '#388e3c')
    ]
  },
  { id:'decor-rug-round', name:'রাউন্ড রাগ', emoji:'⭕', cat:'decor', snap:'floor',
    dims:{ w:5, d:5, h:0.1 }, color:'#c8956d',
    parts:[ C(2.5, 2.5, 0.05, [0,0.03,0], '#c8956d') ]
  },
  { id:'decor-rug-rect', name:'রেক্ট রাগ', emoji:'⬛', cat:'decor', snap:'floor',
    dims:{ w:6, d:4, h:0.1 }, color:'#8b5a4a',
    parts:[ B([6,0.05,4],[0,0.03,0],'#8b5a4a') ]
  },
  { id:'decor-painting', name:'পেইন্টিং', emoji:'🖼️', cat:'decor', snap:'wall',
    dims:{ w:3, d:0.15, h:2 }, color:'#c9a96a',
    parts:[
      B([3,2,0.1],[0,0,0],'#c9a96a'),
      B([2.7,1.7,0.02],[0,0,0.06],'#4a6fa5')
    ]
  },
  { id:'decor-wall-art', name:'ওয়াল আর্ট', emoji:'🎨', cat:'decor', snap:'wall',
    dims:{ w:2, d:0.1, h:2.5 }, color:'#e74c3c',
    parts:[
      B([2,2.5,0.08],[0,0,0],'#e74c3c'),
      T(0.6, 0.08, [0,0,0.06], '#f39c12')
    ]
  },
  { id:'decor-mirror-full', name:'ফুল-লেংথ আয়না', emoji:'🪞', cat:'decor', snap:'wall',
    dims:{ w:2.5, d:0.2, h:6 }, color:'#c0d8e8',
    parts:[
      B([2.5,6,0.15],[0,0,0],'#8b6f47'),
      B([2.3,5.8,0.02],[0,0,0.09],'#c0d8e8')
    ]
  },
  { id:'decor-vase', name:'ফুলদানি', emoji:'🏺', cat:'decor', snap:'floor',
    dims:{ w:0.8, d:0.8, h:1.5 }, color:'#4a6fa5',
    parts:[
      C(0.35, 0.25, 1.5, [0,0.75,0], '#4a6fa5'),
      S(0.3, [0,1.7,0], '#e74c3c')
    ]
  },
  { id:'decor-clock', name:'দেয়াল ঘড়ি', emoji:'🕐', cat:'decor', snap:'wall',
    dims:{ w:1.5, d:0.15, h:1.5 }, color:'#2a2a2a',
    parts:[
      C(0.75, 0.75, 0.1, [0,0,0], '#2a2a2a'),
      C(0.7, 0.7, 0.02, [0,0,0.06], '#f5f5f5')
    ]
  },
  { id:'decor-curtain', name:'কার্টেন', emoji:'🪟', cat:'decor', snap:'wall',
    dims:{ w:5, d:0.1, h:8 }, color:'#8b5a8f',
    parts:[
      B([5,8,0.05],[0,0,0],'#8b5a8f')
    ]
  },
  { id:'decor-cushion', name:'কুশন', emoji:'🟨', cat:'decor', snap:'floor',
    dims:{ w:1.5, d:1.5, h:0.5 }, color:'#f39c12',
    parts:[ B([1.5,0.5,1.5],[0,0.25,0],'#f39c12') ]
  },
  { id:'decor-sculpture', name:'ভাস্কর্য', emoji:'🗿', cat:'decor', snap:'floor',
    dims:{ w:1, d:1, h:3 }, color:'#95a5a6',
    parts:[
      B([1,0.5,1],[0,0.25,0],'#7f8c8d'),
      C(0.35, 0.5, 2.5, [0,1.75,0], '#95a5a6')
    ]
  }
];

// ============================================================
// 🌤️  OUTSIDE VIEWS  (HDRI fallback — procedural skybox)
// ============================================================
export const OUTSIDE = [
  { id:'out-day',    name:'☀️ পরিষ্কার দিন',  emoji:'☀️', cat:'outside',
    sky:{ top:'#4a9eff', bottom:'#c7e0ff' }, light:{ sun:'#fff5e0', intensity:1.2, dir:[1,1,1] } },
  { id:'out-sunset', name:'🌅 সূর্যাস্ত',     emoji:'🌅', cat:'outside',
    sky:{ top:'#ff6b35', bottom:'#ffd5a5' }, light:{ sun:'#ffb37a', intensity:1.0, dir:[-1,0.3,1] } },
  { id:'out-night',  name:'🌙 রাত',           emoji:'🌙', cat:'outside',
    sky:{ top:'#0a0a2a', bottom:'#1a1a4a' }, light:{ sun:'#c0d0ff', intensity:0.3, dir:[0,1,1] } },
  { id:'out-garden', name:'🌳 বাগান',         emoji:'🌳', cat:'outside',
    sky:{ top:'#87ceeb', bottom:'#90ee90' }, light:{ sun:'#fffacd', intensity:1.1, dir:[0.5,1,0.5] } },
  { id:'out-city',   name:'🏙️ শহর',          emoji:'🏙️', cat:'outside',
    sky:{ top:'#5a6b8a', bottom:'#c0c8d8' }, light:{ sun:'#e0e8f0', intensity:0.9, dir:[1,0.8,0] } },
  { id:'out-beach',  name:'🏖️ সমুদ্র সৈকত',  emoji:'🏖️', cat:'outside',
    sky:{ top:'#3d9bc7', bottom:'#f5deb3' }, light:{ sun:'#fff8e0', intensity:1.3, dir:[0,1,1] } },
  { id:'out-mountain',name:'🏔️ পাহাড়',       emoji:'🏔️', cat:'outside',
    sky:{ top:'#6b8cae', bottom:'#d0e0f0' }, light:{ sun:'#e8f0ff', intensity:1.0, dir:[0.3,1,0.3] } },
  { id:'out-forest', name:'🌲 বন',            emoji:'🌲', cat:'outside',
    sky:{ top:'#4a7c59', bottom:'#a8d5ba' }, light:{ sun:'#f0f5e0', intensity:0.9, dir:[0.3,1,0] } }
];

// ============================================================
// 🗂️  COMBINED INDEX + HELPERS
// ============================================================
export const LIBRARY = {
  furniture: FURNITURE,
  light:     LIGHTS,
  sanitary:  SANITARY,
  decor:     DECOR,
  outside:   OUTSIDE
};

export function getItemsByCategory(cat) {
  return LIBRARY[cat] || [];
}

export function getItemById(id) {
  for (const cat of Object.keys(LIBRARY)) {
    const found = LIBRARY[cat].find(it => it.id === id);
    if (found) return found;
  }
  return null;
}

export function getAllItems() {
  return Object.values(LIBRARY).flat();
}

// গ্লোবাল এক্সপোজ (id-app.js সহজে ব্যবহার করতে পারবে)
if (typeof window !== 'undefined') {
  window.__id_library = { LIBRARY, getItemsByCategory, getItemById, getAllItems };
}
