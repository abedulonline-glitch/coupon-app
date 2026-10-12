/* ============================================================
   INTERIOR DESIGN STUDIO — id-paver-library.js
   ১৫টি Paver Block Preset + Pattern Layout + Block Count
   ============================================================ */

import * as THREE from 'three';

const MM = 0.001;   // mm → m converter

// ============================================================
// 15 PAVER PRESETS
// ============================================================
export const PAVERS = {

  // ─────────────────────────────────────────────
  // BRICK SHAPES
  // ─────────────────────────────────────────────
  'brick-grey': {
    id: 'brick-grey', name: 'ব্রিক (গ্ৰে)', emoji: '🧱',
    category: 'brick',
    dims: { w: 200, h: 100 }, thickness: 60,
    coverage: 500,                 // blocks per 100 sqft
    color: '#a8a8a8',
    limits: { minW: 100, maxW: 400, minH: 50, maxH: 200 },
    shape: 'rect',
    patterns: ['running', 'stack']
  },
  'brick-orange': {
    id: 'brick-orange', name: 'ব্রিক (কমলা)', emoji: '🧱',
    category: 'brick',
    dims: { w: 300, h: 150 }, thickness: 60,
    coverage: 220,
    color: '#d2691e',
    limits: { minW: 150, maxW: 500, minH: 75, maxH: 250 },
    shape: 'rect',
    patterns: ['running', 'stack']
  },
  'brick-pink': {
    id: 'brick-pink', name: 'ব্রিক (গোলাপি)', emoji: '🧱',
    category: 'brick',
    dims: { w: 200, h: 100 }, thickness: 60,
    coverage: 500,
    color: '#d98b8b',
    limits: { minW: 100, maxW: 400, minH: 50, maxH: 200 },
    shape: 'rect',
    patterns: ['running', 'stack']
  },
  'brick-red-thin': {
    id: 'brick-red-thin', name: 'ব্রিক (লাল পাতলা)', emoji: '🧱',
    category: 'brick',
    dims: { w: 200, h: 100 }, thickness: 40,
    coverage: 500,
    color: '#b22222',
    limits: { minW: 100, maxW: 400, minH: 50, maxH: 200 },
    shape: 'rect',
    patterns: ['running', 'stack']
  },

  // ─────────────────────────────────────────────
  // SQUARE SHAPES
  // ─────────────────────────────────────────────
  'square-brown': {
    id: 'square-brown', name: 'স্কয়ার (বাদামি)', emoji: '⬛',
    category: 'square',
    dims: { w: 200, h: 200 }, thickness: 60,
    coverage: 250,
    color: '#8b6f47',
    limits: { minW: 100, maxW: 400, minH: 100, maxH: 400 },
    shape: 'rect',
    patterns: ['stack']
  },
  'square-grey-large': {
    id: 'square-grey-large', name: 'স্কয়ার (বড় ধূসর)', emoji: '⬛',
    category: 'square',
    dims: { w: 300, h: 300 }, thickness: 60,
    coverage: 110,
    color: '#9a9a9a',
    limits: { minW: 200, maxW: 500, minH: 200, maxH: 500 },
    shape: 'rect',
    patterns: ['stack']
  },
  'square-pink-small': {
    id: 'square-pink-small', name: 'স্কয়ার (ছোট গোলাপি)', emoji: '⬛',
    category: 'square',
    dims: { w: 150, h: 150 }, thickness: 60,
    coverage: 440,
    color: '#e0a0a0',
    limits: { minW: 80, maxW: 300, minH: 80, maxH: 300 },
    shape: 'rect',
    patterns: ['stack']
  },

  // ─────────────────────────────────────────────
  // DUMBLE SHAPES
  // ─────────────────────────────────────────────
  'dumble': {
    id: 'dumble', name: 'ডাম্বল', emoji: '⏺️',
    category: 'dumble',
    dims: { w: 200, h: 160 }, thickness: 60,
    coverage: 310,
    color: '#c9a876',
    limits: { minW: 150, maxW: 300, minH: 120, maxH: 250 },
    shape: 'dumble',
    patterns: ['stack']
  },
  'i-dumble': {
    id: 'i-dumble', name: 'I-ডাম্বল', emoji: '🎯',
    category: 'dumble',
    dims: { w: 185, h: 275 }, thickness: 60,
    coverage: 200,
    color: '#b89070',
    limits: { minW: 140, maxW: 280, minH: 220, maxH: 380 },
    shape: 'i-dumble',
    patterns: ['stack']
  },

  // ─────────────────────────────────────────────
  // GEOMETRIC SHAPES
  // ─────────────────────────────────────────────
  'zigzag': {
    id: 'zigzag', name: 'জিগজ্যাগ', emoji: '⚡',
    category: 'geometric',
    dims: { w: 250, h: 123 }, thickness: 60,
    coverage: 294,
    color: '#c47c3e',
    limits: { minW: 180, maxW: 320, minH: 90, maxH: 180 },
    shape: 'zigzag',
    patterns: ['stack']
  },
  'triangular': {
    id: 'triangular', name: 'ট্রায়াঙ্গুলার', emoji: '🔺',
    category: 'geometric',
    dims: { w: 200, h: 200, base: 280 }, thickness: 60,
    coverage: 230,
    color: '#d0a070',
    limits: { minW: 150, maxW: 320, minH: 150, maxH: 320 },
    shape: 'triangle',
    patterns: ['stack']
  },
  'milano': {
    id: 'milano', name: 'মিলানো', emoji: '🔷',
    category: 'geometric',
    dims: { w: 270, h: 218 }, thickness: 60,
    coverage: 220,
    color: '#8d7a5e',
    limits: { minW: 200, maxW: 350, minH: 170, maxH: 300 },
    shape: 'milano',
    patterns: ['stack']
  },

  // ─────────────────────────────────────────────
  // DECORATIVE / PATENTED SHAPES
  // ─────────────────────────────────────────────
  'moon-blossom': {
    id: 'moon-blossom', name: 'মুন ব্লসম', emoji: '🌸',
    category: 'decorative',
    dims: { w: 205, h: 205, circle: 158 }, thickness: 60,
    coverage: 240,
    color: '#c9a0b8',
    limits: { minW: 150, maxW: 300, minH: 150, maxH: 300 },
    shape: 'moon-blossom',
    patterns: ['stack']
  },
  'olympia': {
    id: 'olympia', name: 'অলিম্পিয়া', emoji: '🏛️',
    category: 'decorative',
    dims: { w: 225, h: 225 }, thickness: 60,
    coverage: 195,
    color: '#a88868',
    limits: { minW: 180, maxW: 300, minH: 180, maxH: 300 },
    shape: 'olympia',
    patterns: ['stack']
  },
  'oxford': {
    id: 'oxford', name: 'অক্সফোর্ড', emoji: '🔶',
    category: 'decorative',
    dims: { w: 312, h: 220 }, thickness: 60,
    coverage: 188,
    color: '#b09070',
    limits: { minW: 250, maxW: 400, minH: 180, maxH: 300 },
    shape: 'oxford',
    patterns: ['stack']
  }
};

// ============================================================
// COLOR PRESETS
// ============================================================
export const PAVER_COLORS = [
  { name: 'লাল',       hex: '#b22222' },
  { name: 'কমলা',      hex: '#d2691e' },
  { name: 'হলুদ',      hex: '#daa520' },
  { name: 'গ্ৰে',       hex: '#9a9a9a' },
  { name: 'গাঢ় গ্ৰে',   hex: '#555555' },
  { name: 'বাদামি',     hex: '#8b6f47' },
  { name: 'গোলাপি',    hex: '#d98b8b' },
  { name: 'সাদা',      hex: '#eeeeee' },
  { name: 'কালো',      hex: '#222222' },
  { name: 'সবুজ',      hex: '#5a7a4a' }
];

// ============================================================
// SURFACE PRESETS
// ============================================================
export const PAVER_SURFACES = [
  { id: 'smooth', name: 'স্মুথ',  roughness: 0.35, metalness: 0.05 },
  { id: 'rough',  name: 'রাফ',    roughness: 0.85, metalness: 0.02 },
  { id: 'granite',name: 'গ্রানাইট',roughness: 0.55, metalness: 0.15 }
];

// ============================================================
// SHAPE GEOMETRY BUILDERS
// Returns a THREE.Shape (top-view, mm units; caller scales to meters)
// ============================================================
export function buildShape(paver, customW, customH) {
  const w = (customW || paver.dims.w);
  const h = (customH || paver.dims.h);
  const shape = new THREE.Shape();

  switch (paver.shape) {

    case 'rect': {
      // Centered rectangle in mm
      const x0 = -w / 2, y0 = -h / 2;
      shape.moveTo(x0, y0);
      shape.lineTo(x0 + w, y0);
      shape.lineTo(x0 + w, y0 + h);
      shape.lineTo(x0, y0 + h);
      shape.closePath();
      break;
    }

    case 'dumble': {
      // Rectangle with pinched middle (bow-tie-ish)
      // Simplified — rectangle with small notch on sides
      const x0 = -w / 2, y0 = -h / 2;
      const notch = w * 0.08;
      shape.moveTo(x0, y0);
      shape.lineTo(x0 + w, y0);
      shape.lineTo(x0 + w - notch, y0 + h / 2);
      shape.lineTo(x0 + w, y0 + h);
      shape.lineTo(x0, y0 + h);
      shape.lineTo(x0 + notch, y0 + h / 2);
      shape.closePath();
      break;
    }

    case 'i-dumble': {
      // I-beam-like shape (top & bottom wider)
      const x0 = -w / 2, y0 = -h / 2;
      const topW = w * 0.7;
      const midW = w * 0.45;
      const midH = h * 0.35;
      shape.moveTo(x0, y0);
      shape.lineTo(x0 + w, y0);
      shape.lineTo(x0 + w - (w - topW) / 2, y0 + (h - midH) / 2);
      shape.lineTo(x0 + (w - midW) / 2, y0 + (h - midH) / 2);
      shape.lineTo(x0 + (w - midW) / 2, y0 + (h + midH) / 2);
      shape.lineTo(x0 + w - (w - topW) / 2, y0 + (h + midH) / 2);
      shape.lineTo(x0 + w, y0 + h);
      shape.lineTo(x0, y0 + h);
      shape.lineTo(x0 + (w - topW) / 2, y0 + (h + midH) / 2);
      shape.lineTo(x0 + (w - midW) / 2, y0 + (h + midH) / 2);
      shape.lineTo(x0 + (w - midW) / 2, y0 + (h - midH) / 2);
      shape.lineTo(x0 + (w - topW) / 2, y0 + (h - midH) / 2);
      shape.closePath();
      break;
    }

    case 'zigzag': {
      // Zigzag polygon
      const x0 = -w / 2, y0 = -h / 2;
      const seg = w / 4;
      shape.moveTo(x0, y0);
      shape.lineTo(x0 + seg, y0);
      shape.lineTo(x0 + seg, y0 + h * 0.6);
      shape.lineTo(x0 + seg * 2, y0 + h * 0.6);
      shape.lineTo(x0 + seg * 2, y0);
      shape.lineTo(x0 + seg * 3, y0);
      shape.lineTo(x0 + seg * 3, y0 + h * 0.6);
      shape.lineTo(x0 + seg * 4, y0 + h * 0.6);
      shape.lineTo(x0 + seg * 4, y0);
      shape.lineTo(x0 + w, y0);
      shape.lineTo(x0 + w, y0 + h);
      shape.lineTo(x0, y0 + h);
      shape.closePath();
      break;
    }

    case 'triangle': {
      // Isoceles triangle (base wider than sides)
      const base = paver.dims.base || w;
      const hw = base / 2;
      shape.moveTo(-hw, -h / 2);
      shape.lineTo( hw, -h / 2);
      shape.lineTo(0, h / 2);
      shape.closePath();
      break;
    }

    case 'milano': {
      // Hexagon-ish
      const x0 = -w / 2, y0 = -h / 2;
      const chamfer = Math.min(w, h) * 0.25;
      shape.moveTo(x0 + chamfer, y0);
      shape.lineTo(x0 + w - chamfer, y0);
      shape.lineTo(x0 + w, y0 + h / 2);
      shape.lineTo(x0 + w - chamfer, y0 + h);
      shape.lineTo(x0 + chamfer, y0 + h);
      shape.lineTo(x0, y0 + h / 2);
      shape.closePath();
      break;
    }

    case 'moon-blossom': {
      // Circle with corner cutouts — simplified as octagon
      const x0 = -w / 2, y0 = -h / 2;
      const c = w * 0.3;
      shape.moveTo(x0 + c, y0);
      shape.lineTo(x0 + w - c, y0);
      shape.lineTo(x0 + w, y0 + c);
      shape.lineTo(x0 + w, y0 + h - c);
      shape.lineTo(x0 + w - c, y0 + h);
      shape.lineTo(x0 + c, y0 + h);
      shape.lineTo(x0, y0 + h - c);
      shape.lineTo(x0, y0 + c);
      shape.closePath();
      break;
    }

    case 'olympia': {
      // Square with chamfered corners
      const x0 = -w / 2, y0 = -h / 2;
      const c = Math.min(w, h) * 0.15;
      shape.moveTo(x0 + c, y0);
      shape.lineTo(x0 + w - c, y0);
      shape.lineTo(x0 + w, y0 + c);
      shape.lineTo(x0 + w, y0 + h - c);
      shape.lineTo(x0 + w - c, y0 + h);
      shape.lineTo(x0 + c, y0 + h);
      shape.lineTo(x0, y0 + h - c);
      shape.lineTo(x0, y0 + c);
      shape.closePath();
      break;
    }

    case 'oxford': {
      // Octagon-ish
      const x0 = -w / 2, y0 = -h / 2;
      const c = Math.min(w, h) * 0.25;
      shape.moveTo(x0 + c, y0);
      shape.lineTo(x0 + w - c, y0);
      shape.lineTo(x0 + w, y0 + c);
      shape.lineTo(x0 + w, y0 + h - c);
      shape.lineTo(x0 + w - c, y0 + h);
      shape.lineTo(x0 + c, y0 + h);
      shape.lineTo(x0, y0 + h - c);
      shape.lineTo(x0, y0 + c);
      shape.closePath();
      break;
    }

    default: {
      // Fallback: rect
      const x0 = -w / 2, y0 = -h / 2;
      shape.moveTo(x0, y0);
      shape.lineTo(x0 + w, y0);
      shape.lineTo(x0 + w, y0 + h);
      shape.lineTo(x0, y0 + h);
      shape.closePath();
    }
  }

  return shape;
}

// ============================================================
// PATTERN LAYOUT
// Returns array of { x, y, w, h, rot } in mm, room-centered
// ============================================================
export function generateLayout(paver, roomW_mm, roomH_mm, customW, customH, pattern) {
  const w = customW || paver.dims.w;
  const h = customH || paver.dims.h;
  const grout = 2;    // mm (grout gap)
  const stepW = w + grout;
  const stepH = h + grout;

  const tiles = [];

  if (pattern === 'running') {
    // Brick running bond — every other row offset by half
    const rows = Math.ceil(roomH_mm / stepH) + 1;
    const cols = Math.ceil(roomW_mm / stepW) + 1;
    for (let r = 0; r < rows; r++) {
      const offset = (r % 2 === 1) ? stepW / 2 : 0;
      for (let c = -1; c < cols; c++) {
        const x = c * stepW + offset + stepW / 2;
        const y = r * stepH + stepH / 2;
        tiles.push({
          x: x - roomW_mm / 2,
          y: y - roomH_mm / 2,
          w, h, rot: 0,
          row: r, col: c
        });
      }
    }
  } else {
    // stack — simple grid
    const rows = Math.ceil(roomH_mm / stepH) + 1;
    const cols = Math.ceil(roomW_mm / stepW) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * stepW + stepW / 2;
        const y = r * stepH + stepH / 2;
        tiles.push({
          x: x - roomW_mm / 2,
          y: y - roomH_mm / 2,
          w, h, rot: 0,
          row: r, col: c
        });
      }
    }
  }

  return tiles;
}

// ============================================================
// BLOCK COUNT CALCULATION
// ============================================================
export function calcBlockCount(paver, roomW_mm, roomH_mm, customW, customH) {
  const w = customW || paver.dims.w;
  const h = customH || paver.dims.h;
  const grout = 2;
  const blockArea = (w + grout) * (h + grout);      // mm²
  const roomArea = roomW_mm * roomH_mm;             // mm²
  const exact = roomArea / blockArea;
  const withWastage = Math.ceil(exact * 1.05);       // 5% wastage
  return {
    exact: exact,
    withWastage: withWastage,
    blockArea_mm2: blockArea,
    roomArea_mm2: roomArea,
    blockArea_sqft: blockArea * 1.07639e-5,         // mm² → sqft
    roomArea_sqft: roomArea * 1.07639e-5
  };
}

// ============================================================
// HELPERS
// ============================================================
export function getPaver(id) {
  return PAVERS[id] || null;
}

export function getAllPavers() {
  return Object.values(PAVERS);
}

export function getPaversByCategory(cat) {
  return Object.values(PAVERS).filter(p => p.category === cat);
}

export function getCategories() {
  return [
    { id: 'brick',      name: '🧱 ব্রিক' },
    { id: 'square',     name: '⬛ স্কয়ার' },
    { id: 'dumble',     name: '⏺️ ডাম্বল' },
    { id: 'geometric',  name: '⚡ জিওমেট্রিক' },
    { id: 'decorative', name: '🌸 ডেকোরেটিভ' }
  ];
}

// Global expose
if (typeof window !== 'undefined') {
  window.__id_paver = {
    PAVERS, PAVER_COLORS, PAVER_SURFACES,
    getPaver, getAllPavers, getPaversByCategory, getCategories,
    buildShape, generateLayout, calcBlockCount
  };
}
