/* ============================================================
   INTERIOR DESIGN STUDIO — id-app.js
   মূল লজিক: Wizard, State, Canvas Drawing, Cropper, Firebase,
   Tile Upload, Furniture Placement, Render Calls, i18n Hook
   প্রিফিক্স: id-  |  নতুন Class নেই
   ============================================================ */

import { InteriorEngine } from './id-render-engine.js';

// ============================================================
// STATE
// ============================================================
const STATE = {
  step: 1,
  maxStep: 7,
  room:   { type: 'living', length: 12, width: 15, height: 10 },
  shape:  'rect',
  customPoints: [],
  structure: [],          // {type, x, y, rot}
  surfaces: { floor: true, wall: false, ceiling: false, accent: false },
  tiles: {
    floor:   { url: null, size: { w: 600, h: 600 }, rot: 0, grout: 2 },
    wall:    { url: null, size: { w: 300, h: 600 }, rot: 0, grout: 2 },
    accent:  { url: null, size: { w: 300, h: 300 }, rot: 0, grout: 2 },
    ceiling: { url: null, size: { w: 600, h: 600 }, rot: 0, grout: 2 }
  },
  activeTab: 'floor',     // tile tab
  selectedStructIdx: null,
  activeSub: 'furniture', // step 6 subtab
  furniture: [],          // {id, x, y, z, rot, color}
  outside:   { id: 'out-day' },
  lightMode: 'day',
  
    stairChamber: {
    enabled: false,
    size: { w: 8, l: 12 },                 // ft
    position: 'right',                     // 'right'|'left'|'top'|'bottom'
    wallHeight: 10,                        // ft

    door: {
      enabled: true,
      width: 900,                          // mm
      height: 2100,                        // mm
      offsetFromCorner: 1500               // mm (from chamber's wall corner)
    },

    stair: {
      totalHeight: 3048,                   // mm (floor to floor)
      totalSteps: 17,                      // auto
      type: 'straight',                      // 'straight'|'double-fold'
      autoSteps: true,
      treadThickness: 20,                  // mm (granite slab)
      riserThickness: 18,                  // mm
      molding1: 5,                         // mm
      moldingGap: 8,                       // mm
      molding2: 5,                         // mm
      treadDepth: 280,                     // mm (run)
      width: 1000,                         // mm
      direction: 'along-length',           // 'along-length'|'along-width'

      treadMaterial: 'custom',             // 'floor'|'wall'|'accent'|'custom'
      riserMaterial: 'custom',
      treadColor: '#1a1a1a',
      riserColor: '#222222',
      molding1Color: '#ffffff',
      moldingGapColor: '#1a1a1a',
      molding2Color: '#ffffff'
    },

          finish: {
      tread: {
        source: 'solid',           // 'solid'|'floor'|'wall'|'custom'
        color: '#1a1a1a',
        imageUrl: null,
        thickness: 20,             // mm (15-30)
        overhang: 10               // mm
      },
      riser: {
        source: 'solid',
        color: '#222222',
        imageUrl: null,
        thickness: 18              // mm
      },
      molding: {
        pattern: 'simple',         // 'none'|'simple'|'double'|'bevel'
        color1: '#ffffff',
        color2: '#1a1a1a',
        thickness: 5,              // mm
        gap: 8                     // mm (double pattern এ)
      },
      sideSlope: {
        source: 'wall',            // 'wall'|'solid'|'custom'
        color: '#d0d0d0',
        imageUrl: null,
        tileW: 200,
        tileH: 100,
        grout: 2
      },

             skirting: {
        type: 'plain',
        color: '#ffffff',
        height: 100,
        boardColor: '#ffffff',
        boardHeight: 40,
        wallTile: {
          enabled: false,
          source: 'wall',
          imageUrl: null
        }
      },      

    stairSlabStyle: 'stepped',      // 'stepped' | 'straight'
             
      bottomFace: {
        color: '#d0d0d0'
      },
      skirting: {
        type: 'plain',             // 'plain'|'steps'
        color: '#ffffff',
        height: 100,               // mm
        boardColor: '#ffffff',
        boardHeight: 40,           // mm
        wallTile: {
          enabled: false,
          source: 'wall',
          imageUrl: null
        }
      }
    }, 

    railing: {
      enabled: false,
      type: 'metal',                        // 'metal'|'wood'|'glass'
      height: 900,                          // mm
      side: 'right'                         // 'both'|'left'|'right'
    },

    skirtingStyle: 'plain',                 // 'plain'|'steps'
    wallColor: '#f0f0f0',
    floorColor: '#ffffff'
  }, 
   
   wallColors: {},       // { 0: '#fff', 1: '#f00', ... } — wall index → hex
  ceilingColor: '#ffffff',
  paintMode: false,
  userPlan: 'free',              // 'free' | 'pro' | 'business'
  planExpiresAt: null,           // timestamp বা null
  sharesThisMonth: 0,
  monthResetAt: null,
  proPriceMonthly: 199,          // admin override হবে
  proPriceYearly: 1499,
  paintColor: '#ffffff',
  
   skirting: {
    enabled: false,
    height: 150,           // mm
    profile: 'flat',       // flat | beveled | bullnose | cove
    thickness: 12,         // mm
    material: 'floor',     // floor | wall | accent | solid
    color: '#ffffff'
  }, 
   paverMode: false,
    paver: {
    id: null,
    customW: 200,
    customH: 100,
    pattern: 'running',
    surface: 'rough',
    color: '#b22222',
    colorMode: 'solid',
    colorB: '#9a9a9a',
    individualColors: {}
  },
   cameraView:'iso'
};

let engine = null;
let cropper = null;
let adminId = null;
let currentDesignId = null;

// ============================================================
// UTIL
// ============================================================
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function toast(msg, kind = 'info', ms = 2500) {
  const el = $('#id-toast');
  el.textContent = msg;
  el.className = kind;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 300);
  }, ms);
}

function sqft() {
  return (STATE.room.length * STATE.room.width).toFixed(0);
}

// ============================================================
// STEP NAVIGATION
// ============================================================
function showStep(n) {
  n = Math.max(1, Math.min(STATE.maxStep, n));
  STATE.step = n;

  // Force hide ALL steps first
  $$('.id-step').forEach((el) => {
    el.hidden = true;
    el.style.display = 'none';
  });

  // Show only current
  const current = document.getElementById(`id-step-${n}`);
  if (current) {
    current.hidden = false;
    current.style.display = 'block';
  }

  $('#id-progressBar').style.width = `${(n / STATE.maxStep) * 100}%`;
  $('#id-progressText').textContent = `Step ${n} / ${STATE.maxStep}`;
  $('#id-prevBtn').disabled = (n === 1);

  // SCROLL TO TOP — নতুন স্ক্রিন যাতে উপরে থেকে দেখা যায়
  const wizard = $('#id-wizard');
  if (wizard) wizard.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (n === STATE.maxStep) {
    initEngine();
    refreshRender();
    setTimeout(refreshRotBar, 100);
  }
}

$('#id-nextBtn').addEventListener('click', () => {
  if (STATE.step === 1) {
    if (!STATE.room.length || !STATE.room.width) { toast('মাপ দিন', 'error'); return; }
  }
  showStep(STATE.step + 1);
if (STATE.step + 1 === 7) refreshRender(true);  
});
$('#id-prevBtn').addEventListener('click', () => showStep(STATE.step - 1));

// ============================================================
// STEP 1 — ROOM TYPE + SIZE
// ============================================================
$$('#id-roomTypes .id-tile-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#id-roomTypes .id-tile-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    STATE.room.type = btn.dataset.room;
  });
});
$('#id-roomTypes .id-tile-btn')?.classList.add('active');

function updateSqft() {
  const L = parseFloat($('#id-length').value) || 0;
  const W = parseFloat($('#id-width').value)  || 0;
  $('#id-sqft').value = (L * W).toFixed(0);
  STATE.room.length = L;
  STATE.room.width  = W;
}
$('#id-length').addEventListener('input', updateSqft);
$('#id-width').addEventListener('input', updateSqft);
$('#id-height').addEventListener('input', (e) => {
  STATE.room.height = parseFloat(e.target.value) || 10;
});
updateSqft();

// ============================================================
// STEP 2 — SHAPE
// ============================================================
$$('#id-shapeGrid .id-shape-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#id-shapeGrid .id-shape-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    STATE.shape = btn.dataset.shape;
    const canvas = $('#id-shapeCanvas');
    const tools  = $('#id-shapeTools');
    if (STATE.shape === 'custom') {
      canvas.hidden = false;
      tools.hidden  = false;
      initShapeCanvas();
    } else {
      canvas.hidden = true;
      tools.hidden  = true;
      STATE.customPoints = [];
    }
  });
});
$('#id-shapeGrid .id-shape-btn')?.classList.add('active');

// ---------- Custom polygon canvas ----------
// ============================================================
// CUSTOM SHAPE CANVAS — with Undo / Redo / Live Preview
// ============================================================
let shapeCtx = null;
let shapeHistory = [];   // past states
let shapeRedo    = [];   // future states
let shapeHover   = null; // {x,y} in canvas units

function snapPoint(p) {
  // avoid duplicates within 6 px
  for (const q of STATE.customPoints) {
    if (Math.hypot(q.x - p.x, q.y - p.y) < 6) return null;
  }
  return p;
}

function pushShapeHistory() {
  shapeHistory.push(JSON.parse(JSON.stringify(STATE.customPoints)));
  if (shapeHistory.length > 50) shapeHistory.shift();
  shapeRedo = [];
  updateShapeButtons();
}

function updateShapeButtons() {
  const u = $('#id-shapeUndo'), r = $('#id-shapeRedo');
  if (u) u.disabled = shapeHistory.length === 0;
  if (r) r.disabled = shapeRedo.length === 0;
}

function initShapeCanvas() {
  const canvas = $('#id-shapeCanvas');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  shapeCtx = canvas.getContext('2d');
  shapeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Reset history when entering
  shapeHistory = [];
  shapeRedo = [];
  updateShapeButtons();

  // Place
  canvas.onclick = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  * 600;
    const y = (e.clientY - r.top)  / r.height * 400;
    const p = snapPoint({ x, y });
    if (!p) return;
    pushShapeHistory();
    STATE.customPoints.push(p);
    redrawShape();
  };

  // Live preview line
  canvas.onmousemove = (e) => {
    const r = canvas.getBoundingClientRect();
    shapeHover = {
      x: (e.clientX - r.left) / r.width  * 600,
      y: (e.clientY - r.top)  / r.height * 400
    };
    redrawShape();
  };
  canvas.onmouseleave = () => { shapeHover = null; redrawShape(); };

  redrawShape();
  updateShapeButtons();
}

function redrawShape() {
  if (!shapeCtx) return;
  const canvas = $('#id-shapeCanvas');
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  const sx = w / 600, sy = h / 400;

  shapeCtx.clearRect(0, 0, w, h);
  shapeCtx.fillStyle = '#1f232e';
  shapeCtx.fillRect(0, 0, w, h);

  // grid
  shapeCtx.strokeStyle = 'rgba(79,140,255,0.08)';
  shapeCtx.lineWidth = 1;
  for (let i = 50; i < 600; i += 50) {
    shapeCtx.beginPath(); shapeCtx.moveTo(i * sx, 0); shapeCtx.lineTo(i * sx, h); shapeCtx.stroke();
  }
  for (let j = 50; j < 400; j += 50) {
    shapeCtx.beginPath(); shapeCtx.moveTo(0, j * sy); shapeCtx.lineTo(w, j * sy); shapeCtx.stroke();
  }

  const pts = STATE.customPoints;

  if (pts.length === 0) {
    shapeCtx.fillStyle = '#8a90a2';
    shapeCtx.font = '14px sans-serif';
    shapeCtx.fillText('এখানে ক্লিক করে কোণা বসান (min 3)', 20, 30);
    return;
  }

  // filled polygon
  shapeCtx.beginPath();
  pts.forEach((p, i) => {
    const px = p.x * sx, py = p.y * sy;
    i === 0 ? shapeCtx.moveTo(px, py) : shapeCtx.lineTo(px, py);
  });
  if (pts.length >= 3) shapeCtx.closePath();
  shapeCtx.fillStyle   = 'rgba(79,140,255,0.15)';
  shapeCtx.strokeStyle = '#4f8cff';
  shapeCtx.lineWidth   = 2;
  shapeCtx.fill();
  shapeCtx.stroke();

  // live preview line from last point to cursor
  if (shapeHover && pts.length > 0) {
    const last = pts[pts.length - 1];
    shapeCtx.beginPath();
    shapeCtx.moveTo(last.x * sx, last.y * sy);
    shapeCtx.lineTo(shapeHover.x * sx, shapeHover.y * sy);
    shapeCtx.strokeStyle = 'rgba(255,179,71,0.7)';
    shapeCtx.setLineDash([5, 5]);
    shapeCtx.lineWidth = 2;
    shapeCtx.stroke();
    shapeCtx.setLineDash([]);
  }

  // closing line preview (to first)
  if (pts.length >= 2 && shapeHover) {
    const first = pts[0];
    shapeCtx.beginPath();
    shapeCtx.moveTo(shapeHover.x * sx, shapeHover.y * sy);
    shapeCtx.lineTo(first.x * sx, first.y * sy);
    shapeCtx.strokeStyle = 'rgba(255,179,71,0.35)';
    shapeCtx.setLineDash([3, 4]);
    shapeCtx.lineWidth = 1.5;
    shapeCtx.stroke();
    shapeCtx.setLineDash([]);
  }

  // vertices
  pts.forEach((p, i) => {
    const px = p.x * sx, py = p.y * sy;
    shapeCtx.beginPath();
    shapeCtx.arc(px, py, i === 0 ? 7 : 5, 0, Math.PI * 2);
    shapeCtx.fillStyle = i === 0 ? '#2ecc71' : '#ffb347';
    shapeCtx.fill();
    shapeCtx.strokeStyle = '#0f1117';
    shapeCtx.lineWidth = 2;
    shapeCtx.stroke();
  });

  // area calculation
  if (pts.length >= 3) {
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      area += a.x * b.y - b.x * a.y;
    }
    area = Math.abs(area / 2);
    const fW = STATE.room.width  / 600;
    const fH = STATE.room.length / 400;
    const areaFt = area * fW * fH;
    shapeCtx.fillStyle = '#ffb347';
    shapeCtx.font = 'bold 13px sans-serif';
    shapeCtx.fillText(`≈ ${areaFt.toFixed(0)} sqft (${pts.length} কোণা)`, 12, h - 14);
  }
}

// ---------- Buttons ----------
$('#id-shapeUndo')?.addEventListener('click', () => {
  if (!shapeHistory.length) return;
  shapeRedo.push(JSON.parse(JSON.stringify(STATE.customPoints)));
  STATE.customPoints = shapeHistory.pop();
  redrawShape();
  updateShapeButtons();
});

$('#id-shapeRedo')?.addEventListener('click', () => {
  if (!shapeRedo.length) return;
  shapeHistory.push(JSON.parse(JSON.stringify(STATE.customPoints)));
  STATE.customPoints = shapeRedo.pop();
  redrawShape();
  updateShapeButtons();
});

$('#id-shapeClear')?.addEventListener('click', () => {
  if (!STATE.customPoints.length) return;
  pushShapeHistory();
  STATE.customPoints = [];
  redrawShape();
  updateShapeButtons();
});

$('#id-shapeDone')?.addEventListener('click', () => {
  if (STATE.customPoints.length < 3) {
    toast('কমপক্ষে ৩ কোণা লাগবে', 'error');
    return;
  }
  toast('✅ আকৃতি সেভ হয়েছে — পরবর্তী ধাপে যান', 'success');
});

// ---------- Keyboard Shortcuts ----------
document.addEventListener('keydown', (e) => {
  if (STATE.step !== 2) return;
  if (STATE.shape !== 'custom') return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault();
    $('#id-shapeUndo')?.click();
  }
  if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' ||
      (e.shiftKey && e.key.toLowerCase() === 'z'))) {
    e.preventDefault();
    $('#id-shapeRedo')?.click();
  }
});



// ============================================================
// STEP 3 — STRUCTURE SVG
// ============================================================
let activeTool = null;
$$('.id-struct-tool').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.id-struct-tool').forEach(b => b.classList.remove('active'));
    if (activeTool === btn.dataset.tool) {
      activeTool = null;
    } else {
      btn.classList.add('active');
      activeTool = btn.dataset.tool;
    }
  });
});

// ⬇️⬇️⬇️ এই নতুন ব্লকটি যোগ করুন ⬇️⬇️⬇️
$('#id-structSvg')?.addEventListener('click', (e) => {  
  if (!activeTool) return;
  const svg = $('#id-structSvg');
  const rect = svg.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width  * 600;
  const y = (e.clientY - rect.top)  / rect.height * 400;
  if (x < 40 || x > 560 || y < 40 || y > 360) return;

  if (activeTool === 'erase') {
    const filtered = STATE.structure.filter(s => Math.hypot(s.x - x, s.y - y) > 25);
    if (filtered.length !== STATE.structure.length) {
      STATE.structure = filtered;
      STATE.selectedStructIdx = null;
      buildStructureSVG();
      if (STATE.step === 7) refreshRender(true);
    }
    return;
  }
  STATE.structure.push({ type: activeTool, x, y, rot: 0 });
  STATE.selectedStructIdx = STATE.structure.length - 1;
  buildStructureSVG();
  if (STATE.step === 7) refreshRender(true);
});
// Initial draw
setTimeout(() => { try { buildStructureSVG(); } catch(e) { console.error('buildStructureSVG error:', e); } }, 100);

function buildStructureSVG() {
  const svg = $('#id-structSvg');
  svg.innerHTML = '';
  const W = 600, H = 400;

  // Floor background
  const floor = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  floor.setAttribute('x', 40); floor.setAttribute('y', 40);
  floor.setAttribute('width', W - 80);
  floor.setAttribute('height', H - 80);
  floor.classList.add('floor');
  svg.appendChild(floor);

  // Wall outline
  const wall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  wall.setAttribute('x', 40); wall.setAttribute('y', 40);
  wall.setAttribute('width', W - 80);
  wall.setAttribute('height', H - 80);
  wall.setAttribute('fill', 'none');
  wall.setAttribute('stroke', '#4f8cff');
  wall.setAttribute('stroke-width', 3);
  svg.appendChild(wall);

  // Corner markers (4 corners with ft labels)
  const corners = [[40,40],[560,40],[560,360],[40,360]];
  const L = STATE.room.length, Wd = STATE.room.width;
  const cornerLabels = [
    `0,0`,                       // top-left
    `${Wd}ft`,                   // top-right (X = width)
    `${Wd}ft, ${L}ft`,           // bottom-right
    `${L}ft`                     // bottom-left (Z = length)
  ];
  corners.forEach(([cx, cy], i) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy);
    c.setAttribute('r', 4); c.setAttribute('fill', '#4f8cff');
    svg.appendChild(c);
  });

  // Draw each structure item + dimension lines
  STATE.structure.forEach((s, i) => drawStructIcon(s, i));

  // If a structure is selected, highlight its dims
  if (STATE.selectedStructIdx != null && STATE.structure[STATE.selectedStructIdx]) {
    drawDimensionLines(STATE.structure[STATE.selectedStructIdx]);
  }
}

function pxToFt(px, axis) {
  // SVG 40..560 for X (width), 40..360 for Y (length)
  if (axis === 'x') return ((px - 40) / 520) * STATE.room.width;
  return ((px - 40) / 320) * STATE.room.length;
}

function drawDimensionLines(s) {
  const svg = $('#id-structSvg');
  if (!svg || !s) return;

  // distance to each of the 4 corners
  const distTL = Math.hypot(s.x - 40, s.y - 40);
  const distTR = Math.hypot(s.x - 560, s.y - 40);
  const distBR = Math.hypot(s.x - 560, s.y - 360);
  const distBL = Math.hypot(s.x - 40, s.y - 360);

  // distance to each wall (in ft)
  const fromLeft   = pxToFt(s.x, 'x');
  const fromRight  = STATE.room.width - fromLeft;
  const fromTop    = pxToFt(s.y, 'y');
  const fromBottom = STATE.room.length - fromTop;

  const walls = [
    { x1: s.x, y1: s.y, x2: 40,  y2: s.y, text: `${fromLeft.toFixed(1)} ft`, mx: (s.x+40)/2, my: s.y - 10 },
    { x1: s.x, y1: s.y, x2: 560, y2: s.y, text: `${fromRight.toFixed(1)} ft`, mx: (s.x+560)/2, my: s.y - 10 },
    { x1: s.x, y1: s.y, x2: s.x, y2: 40,  text: `${fromTop.toFixed(1)} ft`, mx: s.x + 30, my: (s.y+40)/2 },
    { x1: s.x, y1: s.y, x2: s.x, y2: 360, text: `${fromBottom.toFixed(1)} ft`, mx: s.x + 30, my: (s.y+360)/2 }
  ];

  walls.forEach(w => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', w.x1); line.setAttribute('y1', w.y1);
    line.setAttribute('x2', w.x2); line.setAttribute('y2', w.y2);
    line.classList.add('id-dim-line');
    svg.appendChild(line);

    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', w.mx); t.setAttribute('y', w.my);
    t.setAttribute('text-anchor', 'middle');
    t.classList.add('id-dim-text');
    t.textContent = w.text;
    svg.appendChild(t);
  });
}

function drawStructIcon(s, idx) {
  const svg = $('#id-structSvg');
  const x = s.x, y = s.y;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let el;

  const isSel = STATE.selectedStructIdx === idx;

  if (s.type === 'door') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', x - 18); el.setAttribute('y', y - 4);
    el.setAttribute('width', 36); el.setAttribute('height', 8);
    el.setAttribute('fill', '#ffb347');
  } else if (s.type === 'window') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', x - 22); el.setAttribute('y', y - 4);
    el.setAttribute('width', 44); el.setAttribute('height', 8);
    el.setAttribute('fill', '#4f8cff');
  } else if (s.type === 'ventilator') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', x - 14); el.setAttribute('y', y - 3);
    el.setAttribute('width', 28); el.setAttribute('height', 6);
    el.setAttribute('fill', '#66d9e8');
  } else if (s.type === 'stairs') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', x - 20); el.setAttribute('y', y - 20);
    el.setAttribute('width', 40); el.setAttribute('height', 40);
    el.setAttribute('fill', 'rgba(231,76,60,0.5)');
    el.setAttribute('stroke', '#e74c3c');
    el.setAttribute('stroke-width', 1.5);
  } else if (s.type === 'pillar') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', x); el.setAttribute('cy', y);
    el.setAttribute('r', 10);
    el.setAttribute('fill', '#95a5a6');
  }

  el.classList.add('id-struct-hit');
  if (isSel) {
    el.setAttribute('stroke', '#ffb347');
    el.setAttribute('stroke-width', 3);
    el.setAttribute('stroke-dasharray', '4 2');
  }
  el.style.opacity = isSel ? 1 : 0.75;

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    STATE.selectedStructIdx = idx;
    buildStructureSVG();
    engine?.updateStructure?.(idx, STATE.structure[idx].params || {});
    window.__id_onSelectStructure?.(idx);
  });

  el.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('এই আইটেম মুছে ফেলবেন?')) {
      STATE.structure.splice(idx, 1);
      STATE.selectedStructIdx = null;
      buildStructureSVG();
      if (STATE.step === 7) refreshRender(true);
    }
  });

  g.appendChild(el);
  svg.appendChild(g);
}

// ============================================================
// STEP 4 — SURFACE SELECTION
// ============================================================
$$('.id-surface-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.id-surface-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const s = btn.dataset.surface;
    STATE.surfaces = {
      floor:   s === 'floor'   || s === 'both' || s === 'all',
      wall:    s === 'wall'    || s === 'both' || s === 'all',
      ceiling: s === 'ceiling' || s === 'all',
      accent:  false
    };
  });
});

// ============================================================
// PAVER MODE
// ============================================================
function showPaverPanel() {
  $('#id-paverPanel').hidden = false;
  $('#id-tileTabs')?.setAttribute('hidden', '');
  $('#id-tileTabs')?.style.setProperty('display', 'none');
  $('#id-tileSource')?.style.setProperty('display', 'none');
  $('#id-tileGallery')?.style.setProperty('display', 'none');
  $('#id-tileSizePanel')?.style.setProperty('display', 'none');
}

function showTilePanel() {
  $('#id-paverPanel').hidden = true;
  $('#id-tileTabs')?.removeAttribute('hidden');
  $('#id-tileTabs')?.style.removeProperty('display');
  $('#id-tileSource')?.style.removeProperty('display');
  $('#id-tileGallery')?.style.removeProperty('display');
  $('#id-tileSizePanel')?.style.removeProperty('display');
}

// Mode toggle
document.getElementById('id-modeTile')?.addEventListener('click', () => {
  STATE.paverMode = false;
  document.getElementById('id-modeTile')?.classList.add('active');
  document.getElementById('id-modePaver')?.classList.remove('active');
  showTilePanel();
  if (STATE.step === 7) refreshRender();
});

document.getElementById('id-modePaver')?.addEventListener('click', () => {
  STATE.paverMode = true;
  document.getElementById('id-modePaver')?.classList.add('active');
  document.getElementById('id-modeTile')?.classList.remove('active');
  showPaverPanel();
  buildPaverUI();
  if (STATE.step === 7) refreshRender();
});

// Build category + preset dropdowns
function buildPaverUI() {
  const lib = window.__id_paver;
  if (!lib) return;

  const catSel = document.getElementById('id-paverCategory');
  if (catSel && catSel.options.length === 0) {
    catSel.innerHTML = '';
    lib.getCategories().forEach(c => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = c.name;
      catSel.appendChild(o);
    });
    catSel.value = 'brick';
  }

  refreshPaverPresets();
  refreshPaverColors();
}

function refreshPaverPresets() {
  const lib = window.__id_paver;
  if (!lib) return;
  const cat = document.getElementById('id-paverCategory')?.value || 'brick';
  const list = lib.getPaversByCategory(cat);
  const sel = document.getElementById('id-paverPreset');
  if (!sel) return;
  sel.innerHTML = '';
  list.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = `${p.emoji} ${p.name} — ${p.dims.w}×${p.dims.h}mm`;
    sel.appendChild(o);
  });
  if (list.length) {
    const first = list[0];
    sel.value = first.id;
    STATE.paver.id = first.id;
    STATE.paver.customW = first.dims.w;
    STATE.paver.customH = first.dims.h;
    STATE.paver.color = first.color;
    syncPaverInputs(first);
    updatePaverStats();
  }
}

function refreshPaverColors() {
  const lib = window.__id_paver;
  if (!lib) return;
  const wrap = document.getElementById('id-paverColorSwatches');
  if (!wrap) return;
  wrap.innerHTML = '';
  lib.PAVER_COLORS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'id-color-swatch';
    b.style.background = c.hex;
    b.title = c.name;
    b.dataset.color = c.hex;
    if (STATE.paver.color === c.hex) b.classList.add('active');
    b.addEventListener('click', () => {
      STATE.paver.color = c.hex;
      document.querySelectorAll('.id-color-swatch').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      applyPaverChange();
    });
    wrap.appendChild(b);
  });
}

function syncPaverInputs(def) {
  const wI = document.getElementById('id-paverW');
  const hI = document.getElementById('id-paverH');
  if (wI) { wI.value = STATE.paver.customW; wI.min = def.limits.minW; wI.max = def.limits.maxW; }
  if (hI) { hI.value = STATE.paver.customH; hI.min = def.limits.minH; hI.max = def.limits.maxH; }
  const custom = document.getElementById('id-paverColorCustom');
  if (custom) custom.value = STATE.paver.color;
  const surf = document.getElementById('id-paverSurface');
  if (surf) surf.value = STATE.paver.surface;
  const pat = document.getElementById('id-paverPattern');
  if (pat) pat.value = STATE.paver.pattern;
}

function updatePaverStats() {
  const lib = window.__id_paver;
  const paver = lib?.getPaver(STATE.paver.id);
  if (!paver) return;
  const roomW_mm = STATE.room.width * 304.8;
  const roomH_mm = STATE.room.length * 304.8;
  const stats = lib.calcBlockCount(paver, roomW_mm, roomH_mm, STATE.paver.customW, STATE.paver.customH);

  const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1) + 'k' : Math.round(n);
  const el = (id) => document.getElementById(id);
  if (el('id-paverCount'))   el('id-paverCount').textContent = fmt(stats.withWastage);
  if (el('id-paverWastage')) el('id-paverWastage').textContent = stats.exact.toFixed(0);
  if (el('id-paverRoom'))    el('id-paverRoom').textContent = `${STATE.room.length}×${STATE.room.width}ft`;
}

function applyPaverChange() {
  updatePaverStats();
    const bRow = document.getElementById('id-paverBRow');
  const mode = STATE.paver.colorMode || 'solid';
  if (bRow) bRow.style.display = (mode === 'solid' || mode === 'random') ? 'none' : ''; 
  const hint = document.getElementById('id-paverHint');
  const paver = window.__id_paver?.getPaver(STATE.paver.id);
  if (hint && paver) {
    hint.textContent = `✅ ${paver.name} — ${STATE.paver.customW}×${STATE.paver.customH}mm · ${STATE.paver.pattern}`;
  }
  if (STATE.step === 7) refreshRender();
}

// Category change
document.getElementById('id-paverCategory')?.addEventListener('change', () => {
  refreshPaverPresets();
  applyPaverChange();
});

// Preset change
document.getElementById('id-paverPreset')?.addEventListener('change', (e) => {
  const lib = window.__id_paver;
  const def = lib?.getPaver(e.target.value);
  if (!def) return;
  STATE.paver.id = def.id;
  STATE.paver.customW = def.dims.w;
  STATE.paver.customH = def.dims.h;
  STATE.paver.color = def.color;
  syncPaverInputs(def);
  refreshPaverColors();
  applyPaverChange();
});

// W input
document.getElementById('id-paverW')?.addEventListener('input', (e) => {
  const lib = window.__id_paver;
  const def = lib?.getPaver(STATE.paver.id);
  if (!def) return;
  let v = parseFloat(e.target.value) || def.dims.w;
  v = Math.max(def.limits.minW, Math.min(def.limits.maxW, v));
  STATE.paver.customW = v;
  applyPaverChange();
});

// H input
document.getElementById('id-paverH')?.addEventListener('input', (e) => {
  const lib = window.__id_paver;
  const def = lib?.getPaver(STATE.paver.id);
  if (!def) return;
  let v = parseFloat(e.target.value) || def.dims.h;
  v = Math.max(def.limits.minH, Math.min(def.limits.maxH, v));
  STATE.paver.customH = v;
  applyPaverChange();
});

// Surface dropdown
document.getElementById('id-paverSurface')?.addEventListener('change', (e) => {
  STATE.paver.surface = e.target.value;
  applyPaverChange();
});

// Pattern dropdown
document.getElementById('id-paverPattern')?.addEventListener('change', (e) => {
  STATE.paver.pattern = e.target.value;
  applyPaverChange();
});

// Color Mode dropdown
document.getElementById('id-paverColorMode')?.addEventListener('change', (e) => {
  STATE.paver.colorMode = e.target.value;
  const bRow = document.getElementById('id-paverBRow');
  if (bRow) {
    bRow.style.display = (e.target.value === 'solid' || e.target.value === 'random') ? 'none' : '';
  }
  if (e.target.value === 'individual') {
    toast('🧑‍🎨 3D-তে প্যাভারে ক্লিক করুন রঙ বদলাতে', 'info', 2500);
  }
  applyPaverChange();
});

// Second color picker
document.getElementById('id-paverColorB')?.addEventListener('input', (e) => {
  STATE.paver.colorB = e.target.value;
  applyPaverChange();
});

// Custom color picker
document.getElementById('id-paverColorCustom')?.addEventListener('input', (e) => {
  STATE.paver.color = e.target.value;
  document.querySelectorAll('.id-color-swatch').forEach(x => x.classList.remove('active'));
  applyPaverChange();
});

// ═══════════════════════════════════════════════
// INDIVIDUAL PAVER COLOR CLICK
// ═══════════════════════════════════════════════
window.__id_onPaverClick = (row, col) => {
  if (STATE.paver.colorMode !== 'individual') return;
  const key = `${row},${col}`;
  const cur = STATE.paver.individualColors[key];
  // Cycle through a palette on each click
  const palette = ['#b22222', '#d2691e', '#daa520', '#9a9a9a', '#555555',
                   '#8b6f47', '#d98b8b', '#eeeeee', '#222222', '#5a7a4a'];
  let idx = palette.indexOf(cur);
  idx = (idx + 1) % palette.length;
  STATE.paver.individualColors[key] = palette[idx];
  toast(`প্যাভার [${row},${col}] → ${palette[idx]}`, 'success', 1000);
  if (STATE.step === 7) refreshRender(true);
};

// Init paver UI on load
setTimeout(() => { try { buildPaverUI(); } catch(e) {} }, 200);

// ============================================================
// STEP 5 — TILE UPLOAD + CROP + SIZE
// ============================================================
$$('.id-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.id-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    STATE.activeTab = tab.dataset.tab;
    refreshTileGallery();
  });
});

// ============================================================
// TILE SIZE / INPUT LISTENERS
// ============================================================
function updateRatioBadge() {
  const cur = STATE.tiles[STATE.activeTab];
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const g = gcd(cur.size.w, cur.size.h) || 1;
  const text = `${cur.size.w/g}:${cur.size.h/g}`;
  const b1 = document.getElementById('id-sizeRatioBadge');
  const b2 = document.getElementById('id-cropRatioBadge');
  if (b1) b1.textContent = text;
  if (b2) b2.textContent = text;
}

function syncTilePreset() {
  const cur = STATE.tiles[STATE.activeTab];
  const key = `${cur.size.w},${cur.size.h}`;
  const sel = document.getElementById('id-tilePreset');
  if (!sel) return;
  const has = Array.from(sel.options).some(o => o.value === key);
  sel.value = has ? key : 'custom';
}

$('#id-tileW')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.size.w = Math.max(50, parseFloat(e.target.value) || 600);
  updateRatioBadge();
  syncTilePreset();
  reinitCropRatio();
  if (STATE.step === 7) refreshRender(true);
});

$('#id-tileH')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.size.h = Math.max(50, parseFloat(e.target.value) || 600);
  updateRatioBadge();
  syncTilePreset();
  reinitCropRatio();
  if (STATE.step === 7) refreshRender(true);
});

$('#id-tilePreset')?.addEventListener('change', (e) => {
  const v = e.target.value;
  if (v === 'custom') return;
  const [w, h] = v.split(',').map(Number);
  if (!w || !h) return;
  const cur = STATE.tiles[STATE.activeTab];
  cur.size.w = w;
  cur.size.h = h;
  const iw = document.getElementById('id-tileW');
  const ih = document.getElementById('id-tileH');
  if (iw) iw.value = w;
  if (ih) ih.value = h;
  updateRatioBadge();
  reinitCropRatio();
  toast(`মাপ: ${w} × ${h} mm`, 'info', 1500);
  if (STATE.step === 7) refreshRender(true);
});

// ═══════════════════════════════════════════════
// STEP 7 — QUICK ROTATION CONTROLS
// ═══════════════════════════════════════════════
$$('.id-rot-btn[data-rot]').forEach(b => {
  b.addEventListener('click', () => {
    const tab = STATE.activeTab || 'floor';
    const cur = STATE.tiles[tab];
    cur.rot = parseFloat(b.dataset.rot) || 0;
    const el = document.getElementById('id-tileRot');
    if (el) el.value = cur.rot;
    const lbl = document.getElementById('id-tileRotVal');
    if (lbl) lbl.textContent = cur.rot + '°';
    $$('.id-rot-btn[data-rot]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    toast(`🔄 ${cur.rot}° রোটেশন`, 'info', 1200);
    refreshRender(true);
  });
});

$$('.id-rot-btn[data-start]').forEach(b => {
  b.addEventListener('click', () => {
    const tab = STATE.activeTab || 'floor';
    const cur = STATE.tiles[tab];
    cur.cornerStart = b.dataset.start === 'corner';
    $$('.id-rot-btn[data-start]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    toast(cur.cornerStart ? '📍 কোণা থেকে শুরু' : '🎯 মাঝ থেকে শুরু', 'success', 1500);
    refreshRender(true);
  });
});

// ═══════════════════════════════════════════════
// INDIVIDUAL TILE MODE
// ═══════════════════════════════════════════════
let selectedTile = null;  // { surface, r, c }

function setIndividualMode(on) {
  const cur = STATE.tiles[STATE.activeTab];
  cur.individualMode = !!on;
  const btn = document.getElementById('id-individualMode');
  if (btn) btn.classList.toggle('active-mode', cur.individualMode);
  if (!cur.individual) cur.individual = {};
  toast(cur.individualMode
    ? '🔲 ইন্ডিভিজুয়াল মোড ON — টাইলে ক্লিক/ডান-ক্লিক করুন'
    : '🔳 ইন্ডিভিজুয়াল মোড OFF', 'info', 2000);
  if (STATE.step === 7) refreshRender(true);
}

function resetIndividual() {
  const cur = STATE.tiles[STATE.activeTab];
  cur.individual = {};
  selectedTile = null;
  engine?.clearTileSelection?.();
  toast('🧹 সব টাইলের ঘোরানো রিসেট হয়েছে', 'success');
  if (STATE.step === 7) refreshRender(true);
}

function rotateTile(surface, r, c) {
  const cur = STATE.tiles[surface];
  if (!cur.individual) cur.individual = {};
  const key = `${r},${c}`;
  const old = cur.individual[key] || 0;
  cur.individual[key] = (old + 90) % 360;
  if (STATE.step === 7) refreshRender(true);
}

// Toggle button
document.getElementById('id-individualMode')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const cur = STATE.tiles[STATE.activeTab];
  setIndividualMode(!cur.individualMode);
});

// Reset button
document.getElementById('id-resetIndividual')?.addEventListener('click', (e) => {
  e.stopPropagation();
  resetIndividual();
});

// Engine থেকে টাইল ক্লিক হলে
window.__id_onTileClick = (surface, r, c) => {
  selectedTile = { surface, r, c };
  engine?.highlightTile?.(r, c, surface);
  const info = document.getElementById('id-rotInfo');
  if (info) info.textContent = `🔲 টাইল [${r},${c}] — ডান-ক্লিক/ডবল-ক্লিক করুন`;
  // Double-click এবং long-press এর জন্য সময় ট্র্যাক
};

window.__id_onTileRotate = (surface, r, c) => {
  rotateTile(surface, r, c);
  const cur = STATE.tiles[surface];
  const rot = cur.individual?.[`${r},${c}`] || 0;
  toast(`🔄 টাইল [${r},${c}] → ${rot}°`, 'success', 1200);
};

window.__id_onTileDeselect = () => {
  selectedTile = null;
  engine?.clearTileSelection?.();
  const info = document.getElementById('id-rotInfo');
  if (info && typeof refreshRotBar === 'function') refreshRotBar();
};
// Step 7 খোলার সময় active tab অনুযায়ী label দেখানো
function refreshRotBar() {
  const info = document.getElementById('id-rotInfo');
  if (!info) return;
  const names = { floor: '🟫 ফ্লোর টাইল', wall: '🧱 ওয়াল টাইল', accent: '🎯 অ্যাকসেন্ট', ceiling: '⬜ সিলিং' };
  info.textContent = names[STATE.activeTab] || '🟫 ফ্লোর টাইল';

  const cur = STATE.tiles[STATE.activeTab] || { rot: 0, cornerStart: true };
  $$('.id-rot-btn[data-rot]').forEach(x => {
    x.classList.toggle('active', parseFloat(x.dataset.rot) === cur.rot);
  });
  $$('.id-rot-btn[data-start]').forEach(x => {
    const isCorner = x.dataset.start === 'corner';
    x.classList.toggle('active', isCorner === (cur.cornerStart !== false));
  });

  // Individual mode indicator
  const indBtn = document.getElementById('id-individualMode');
  if (indBtn) {
    indBtn.classList.toggle('active-mode', !!cur.individualMode);
  }
}

$('#id-tileRot')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.rot = parseFloat(e.target.value) || 0;
  const el = document.getElementById('id-tileRotVal');
  if (el) el.textContent = cur.rot + '°';
  if (STATE.step === 7) refreshRender(true);
});

$('#id-grout')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.grout = parseFloat(e.target.value) || 0;
  const el = document.getElementById('id-groutVal');
  if (el) el.textContent = cur.grout + 'mm';
});

$('#id-tileOffsetX')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.offsetX = parseFloat(e.target.value) || 0;
  const el = document.getElementById('id-tileOffXVal');
  if (el) el.textContent = cur.offsetX + 'mm';
  if (STATE.step === 7) refreshRender(true);
});

$('#id-tileOffsetY')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.offsetY = parseFloat(e.target.value) || 0;
  const el = document.getElementById('id-tileOffYVal');
  if (el) el.textContent = cur.offsetY + 'mm';
  if (STATE.step === 7) refreshRender(true);
});

// Crop চলাকালীন ratio পরিবর্তন হলে লাইভ আপডেট
function reinitCropRatio() {
  if (!cropper) return;
  const cur = STATE.tiles[STATE.activeTab];
  const r = cur.size.w / cur.size.h;
  try { cropper.setAspectRatio(r); } catch (e) {}
}

$('#id-tileFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  openCrop(file);
  e.target.value = '';
});

$('#id-tileFromStock')?.addEventListener('click', async () => {
  toast('Stock থেকে লোড হচ্ছে…', 'info');
  try {
    const { collection, getDocs, query, where } = window.__id_fs;
    const db = window.__id_db;
    const q = query(collection(db, 'stock'), where('adminId', '==', adminId));
    const snap = await getDocs(q);
    if (snap.empty) { toast('Stock খালি', 'error'); return; }
    renderStockList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    toast('Stock লোড করা যায়নি', 'error');
  }
});

$('#id-tileFromImgBB')?.addEventListener('click', () => {
  const url = prompt('ImgBB টাইলের URL দিন:');
  if (!url) return;
  setTile(url);
});

function renderStockList(items) {
  const gallery = $('#id-tileGallery');
  gallery.innerHTML = '';
  if (!items.length) {
    gallery.innerHTML = '<p class="id-empty">Stock-এ কিছু নেই।</p>';
    return;
  }
  items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'id-gallery-item';
    div.innerHTML = `<img src="${it.imageUrl || it.url}" alt=""><div class="id-item-label">${it.name || 'টাইল'}</div>`;
    div.addEventListener('click', () => {
      setTile(it.imageUrl || it.url);
      toast('টাইল সেট হয়েছে', 'success');
    });
    gallery.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════════
// PERSPECTIVE CROPPER (4-corner)
// ═══════════════════════════════════════════════════════
let pc = null;

function openCrop(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const modal = document.getElementById('id-cropModal');
    const stage = document.getElementById('id-cropStage');
    modal.hidden = false;
    modal.style.display = 'flex';
    stage.innerHTML = '';

    const img = new Image();
    img.onload = async () => {
      const mod = await import('./id-cropper.js');
      pc = new mod.PerspectiveCropper(img);
      stage.appendChild(pc.element);
      setTimeout(() => pc.resize(), 60);

      const cur = STATE.tiles[STATE.activeTab] || { size: { w: 600, h: 600 } };
      const tw = cur.size?.w || 600;
      const th = cur.size?.h || 600;
      console.log('🎯 Crop opened with size:', tw, '×', th);
      if (typeof updateRatioBadge === 'function') updateRatioBadge();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function closeCrop() {
  pc = null;
  const modal = document.getElementById('id-cropModal');
  modal.hidden = true;
  modal.style.display = 'none';
  const stage = document.getElementById('id-cropStage');
  if (stage) stage.innerHTML = '';
}

// Toolbar
document.getElementById('id-pcRotL')?.addEventListener('click', () => {
  if (pc) pc.setRotation((pc.rotation || 0) - 90);
});
document.getElementById('id-pcRotR')?.addEventListener('click', () => {
  if (pc) pc.setRotation((pc.rotation || 0) + 90);
});
document.getElementById('id-pcAuto')?.addEventListener('click', () => pc?.autoDetect());
document.getElementById('id-pcReset')?.addEventListener('click', () => pc?.reset());

// Cancel
document.getElementById('id-cropCancel')?.addEventListener('click', closeCrop);
document.getElementById('id-cropCancelTop')?.addEventListener('click', closeCrop);

// OK — Save
document.getElementById('id-cropOk')?.addEventListener('click', async () => {
  if (!pc) return;

  const cur = STATE.tiles[STATE.activeTab] || { size: { w: 600, h: 600 } };
  const tw = cur.size?.w || 600;
  const th = cur.size?.h || 600;
  const outW = tw >= th ? 1024 : Math.round(1024 * (tw / th));
  const outH = th >= tw ? 1024 : Math.round(1024 * (th / tw));

  const btn = document.getElementById('id-cropOk');
  btn.disabled = true;
  btn.textContent = '⏳ প্রসেস হচ্ছে...';

  try {
    const canvas = await pc.crop(outW, outH);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92));
    const url = await uploadToImgBB(blob);
    closeCrop();

    if (!url) {
      toast('❌ আপলোড ব্যর্থ', 'error');
      return;
    }

    setTile(url);
    toast('✅ টাইল যোগ হয়েছে', 'success');

    // 📚 Auto-save to library
    try {
      if (window.__id_tilelib && blob) {
        await window.__id_tilelib.saveTile({
          blob,
          name: `${STATE.activeTab === 'floor' ? 'ফ্লোর' : STATE.activeTab === 'wall' ? 'ওয়াল' : 'অ্যাকসেন্ট'} — ${new Date().toLocaleTimeString('bn-BD')}`,
          surface: STATE.activeTab,
          tileW: cur.size?.w || 600,
          tileH: cur.size?.h || 600
        });
        if (typeof refreshTileLibrary === 'function') refreshTileLibrary();
        toast('📚 লাইব্রেরিতে সেভ হয়েছে', 'info', 1500);
      }
    } catch (e) {
      console.warn('Library save failed', e);
    }

  } catch (err) {
    console.error('Crop failed:', err);
    toast('❌ ক্রপ ব্যর্থ', 'error');
  } finally {
    const b = document.getElementById('id-cropOk');
    if (b) {
      b.disabled = false;
      b.textContent = '✔️ ঠিক আছে';
    }
  }
});

async function uploadToImgBB(blob) {
  const IMGBB_API_KEY = window.__id_imgbb_key || 'YOUR_IMGBB_KEY'; // README-র সাথে মিলিয়ে দিন
  const fd = new FormData();
  fd.append('image', blob);
  try {
    const r = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST', body: fd
    });
    const j = await r.json();
    return j?.data?.url || null;
  } catch (e) { return null; }
}

function setTile(url) {
  STATE.tiles[STATE.activeTab].url = url;
  refreshTileGallery();
  $('#id-tileSizePanel').hidden = false;
}

function refreshTileGallery() {
  const gallery = $('#id-tileGallery');
  const cur = STATE.tiles[STATE.activeTab];
  gallery.innerHTML = '';
  if (!cur.url) {
    gallery.innerHTML = '<p class="id-empty">এখনো কোনো টাইল যোগ করা হয়নি। উপরে মাপ সেট করে ছবি আপলোড করুন।</p>';
  } else {
    const div = document.createElement('div');
    div.className = 'id-gallery-item selected';
    div.innerHTML = `<img src="${cur.url}" alt=""><div class="id-item-label">বর্তমান</div>`;
    gallery.appendChild(div);
  }

  const panel = $('#id-tileSizePanel');
  if (panel) { panel.hidden = false; panel.style.display = 'block'; }

  const iw = document.getElementById('id-tileW');
  const ih = document.getElementById('id-tileH');
  const ir = document.getElementById('id-tileRot');
  const irv = document.getElementById('id-tileRotVal');
  const ig = document.getElementById('id-grout');
  const igv = document.getElementById('id-groutVal');
  const iox = document.getElementById('id-tileOffsetX');
  const ioxv = document.getElementById('id-tileOffXVal');
  const ioy = document.getElementById('id-tileOffsetY');
  const ioyv = document.getElementById('id-tileOffYVal');

  if (iw) iw.value = cur.size.w;
  if (ih) ih.value = cur.size.h;
  if (ir) ir.value = cur.rot;
  if (irv) irv.textContent = cur.rot + '°';
  if (ig) ig.value = cur.grout;
  if (igv) igv.textContent = cur.grout + 'mm';
  if (iox) iox.value = cur.offsetX || 0;
  if (ioxv) ioxv.textContent = (cur.offsetX || 0) + 'mm';
  if (ioy) ioy.value = cur.offsetY || 0;
  if (ioyv) ioyv.textContent = (cur.offsetY || 0) + 'mm';

  if (typeof updateRatioBadge === 'function') updateRatioBadge();
  if (typeof syncTilePreset === 'function') syncTilePreset();
}

// ============================================================
// STEP 6 — FURNITURE + OUTSIDE
// ============================================================
$$('.id-subtab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.id-subtab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    STATE.activeSub = tab.dataset.cat;
    refreshFurnitureGrid();
  });
});

function refreshFurnitureGrid() {
  const grid = STATE.activeSub === 'outside'
    ? $('#id-outsideGrid')
    : $('#id-furnitureGrid');
  const other = STATE.activeSub === 'outside'
    ? $('#id-furnitureGrid')
    : $('#id-outsideGrid');
  other.hidden = true;
  grid.hidden = false;
  grid.innerHTML = '';
  const items = window.__id_library?.getItemsByCategory(STATE.activeSub) || [];
  items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'id-gallery-item';
    const imgHTML = it.imageUrl
      ? `<img src="${it.imageUrl}" alt="">`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:32px">${it.emoji || '📦'}</div>`;
    div.innerHTML = `${imgHTML}<div class="id-item-label">${it.name}</div>`;
    div.addEventListener('click', () => addItem(it));
    grid.appendChild(div);
  });
}

function addItem(def) {
  if (def.cat === 'outside') {
    STATE.outside = { id: def.id };
    toast('আউটসাইড ভিউ সেট হয়েছে', 'success');
    return;
  }
  const L = STATE.room.length, W = STATE.room.width;
  const x = (Math.random() - 0.5) * (L * 0.5);
  const z = (Math.random() - 0.5) * (W * 0.5);
  const y = def.snap === 'ceiling' ? STATE.room.height - 1 : 0;
  STATE.furniture.push({
    id: def.id, x, y, z, rot: 0, color: null,
    sx: 1, sy: 1, sz: 1
  });
  refreshSelectedList();
  toast(`${def.name} যোগ হয়েছে — 3D-তে ক্লিক করে এডিট করুন`, 'success', 3000);
  if (STATE.step === 7) refreshRender(true);
}

function refreshSelectedList() {
  const list = $('#id-selectedList');
  list.innerHTML = '';
  if (!STATE.furniture.length) {
    list.innerHTML = '<li style="justify-content:center;color:#8a90a2">কিছু যোগ করা হয়নি</li>';
    return;
  }
  STATE.furniture.forEach((f, i) => {
    const def = window.__id_library?.getItemById(f.id);
    const label = f.isCustom ? `🌐 ${f.customName || 'Custom'}` : `${def?.emoji || '📦'} ${def?.name || f.id}`;
    const rot = (f.rot || 0).toFixed(0);
    const scale = (f.sx || 1).toFixed(2);
    const li = document.createElement('li');
    li.style.flexWrap = 'wrap';
    li.innerHTML = `
      <span style="flex:1;min-width:100px">${label}
        <small style="color:#8a90a2"> (${rot}° · ×${scale})</small>
      </span>
      <button data-act="rotL" title="বামে ৪৫°">↺</button>
      <button data-act="rotR" title="ডানে ৪৫°">↻</button>
      <button data-act="rot90" title="৯০°">⟳</button>
      <button data-act="bigger" title="বড়">➕</button>
      <button data-act="smaller" title="ছোট">➖</button>
      <button data-act="reset" title="রিসেট">⟲</button>
      <button data-act="del" title="মুছুন" style="color:#e74c3c">✕</button>
    `;
    li.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.act;
        const item = STATE.furniture[i];
        if (a === 'del') {
          STATE.furniture.splice(i, 1);
          refreshSelectedList();
          if (STATE.step === 7) refreshRender(true);
          return;
        }
        if (a === 'rotL')  item.rot = (item.rot || 0) - 45;
        if (a === 'rotR')  item.rot = (item.rot || 0) + 45;
        if (a === 'rot90') item.rot = (item.rot || 0) + 90;
        if (a === 'bigger')  { item.sx = Math.min((item.sx||1)*1.1, 3); item.sy = item.sx; item.sz = item.sx; }
        if (a === 'smaller') { item.sx = Math.max((item.sx||1)*0.9, 0.3); item.sy = item.sx; item.sz = item.sx; }
        if (a === 'reset')   { item.rot = 0; item.sx = item.sy = item.sz = 1; }
        refreshSelectedList();
        if (STATE.step === 7) refreshRender(true);
      });
    });
    list.appendChild(li);
  });
}
refreshFurnitureGrid();
refreshSelectedList();

// ============================================================
// STEP 7 — RENDER
// ============================================================
function initEngine() {
  if (engine) return;
  const canvas = $('#id-canvas');
  engine = new InteriorEngine(canvas);
  engine.startLive();
}

const _origRefreshRenderFn = typeof refreshRender === 'function' ? refreshRender : null;
async function refreshRender() {
  if (!engine) return;
  try {
    await engine.render(STATE);
  } catch (e) {
    console.error(e);
    toast('রেন্ডারে সমস্যা', 'error');
  }
}

$('#id-cameraView')?.addEventListener('change', (e) => {
  STATE.cameraView = e.target.value;
  refreshRender();
});
$('#id-lightMode')?.addEventListener('change', (e) => {
  STATE.lightMode = e.target.value;
  refreshRender();
  // Time slider sync (preset → time)
  const presets = { day: 12, sunset: 17.5, night: 22, studio: 12 };
  const t = presets[STATE.lightMode];
  if (t != null && $('#id-timeOfDay')) {
    $('#id-timeOfDay').value = t;
    $('#id-timeVal').textContent = fmtTime(t);
    engine?.setTimeOfDay(t);
    if (STATE.lightMode === 'studio') engine?.setExposure(0.72);
    else engine?.setExposure(0.62);
  }
});
$('#id-liveRender')?.addEventListener('click', () => {
  refreshRender();
  toast('লাইভ প্রিভিউ আপডেট', 'info');
});

$('#id-finalRender')?.addEventListener('click', async () => {
  if (!engine) return;
  const progress = $('#id-renderProgress');
  const status   = $('#id-renderStatus');
  const timeEl   = $('#id-renderTime');
  progress.hidden = false;
  status.textContent = 'রেন্ডার শুরু হচ্ছে…';
  timeEl.textContent = '0.0s';
  $('#id-finalRender').disabled = true;

  try {
    const res = await engine.renderHD(({ frame, total, percent, elapsed }) => {
      status.textContent = `রেন্ডার ${frame}/${total} (${percent.toFixed(0)}%)`;
      timeEl.textContent = elapsed.toFixed(1) + 's';
    });
    progress.hidden = true;
    toast(`✅ HD রেন্ডার সম্পন্ন — ${res.seconds.toFixed(1)}s`, 'success', 4000);
  } catch (e) {
    console.error(e);
    progress.hidden = true;
    toast('রেন্ডার ব্যর্থ', 'error');
  } finally {
    $('#id-finalRender').disabled = false;
  }
});

$('#id-downloadRender')?.addEventListener('click', () => {
  if (!engine) return;
  engine.downloadHD();
  toast('ডাউনলোড শুরু', 'success');
});

// ============================================================
// FIREBASE — AUTH + SAVE/LOAD
// ============================================================
const { onAuthStateChanged } = window.__id_authHelpers;
onAuthStateChanged(window.__id_auth, (user) => {
  if (user) adminId = user.uid;
  else {
    toast('লগইন প্রয়োজন — beta.html-এ পাঠানো হচ্ছে…', 'error');
    setTimeout(() => window.location.href = './beta.html', 1500);
  }
});

$('#id-saveToFirebase')?.addEventListener('click', async () => {
  if (!adminId) { toast('লগইন নেই', 'error'); return; }
  const { collection, addDoc, doc, serverTimestamp } = window.__id_fs;
  const db = window.__id_db;
  try {
    const payload = {
      adminId,
      ...STATE,
      createdAt: serverTimestamp()
    };
    if (currentDesignId) {
      toast('আপডেট এখনো সাপোর্টেড নয়', 'info');
    } else {
      const ref = await addDoc(collection(db, 'interiorDesigns'), payload);
      currentDesignId = ref.id;
    }
    toast('☁️ ক্লাউডে সেভ হয়েছে', 'success');
  } catch (e) {
    console.error(e);
    toast('সেভ ব্যর্থ: ' + e.message, 'error');
  }
});

$('#id-loadBtn')?.addEventListener('click', async () => {
  if (!adminId) return;
  const { collection, getDocs, query, where } = window.__id_fs;
  const db = window.__id_db;
  try {
    const q = query(collection(db, 'interiorDesigns'), where('adminId', '==', adminId));
    const snap = await getDocs(q);
    const list = $('#id-myDesignsList');
    list.innerHTML = '';
    if (snap.empty) {
      list.innerHTML = '<p style="color:#8a90a2;text-align:center">কোনো ডিজাইন নেই</p>';
    } else {
      snap.forEach(d => {
        const data = d.data();
        const row = document.createElement('div');
        row.className = 'id-design-row';
        row.innerHTML = `<h4>${data.room?.type || 'Room'} — ${data.room?.length || 0}×${data.room?.width || 0} ft</h4>
          <p>${data.shape || 'rect'} · ${(data.furniture || []).length} items</p>`;
        row.addEventListener('click', () => {
          Object.assign(STATE, data);
             // Restore skirting UI

                    // Restore stair chamber UI
          setTimeout(() => {
            if (typeof window.__id_syncStairUI === 'function') {
              window.__id_syncStairUI();
            }
          }, 200); 
           
           // Restore paint
          setTimeout(() => {
            const info = document.getElementById('id-paintInfo');
            if (info && typeof window.__id_paintUpdate === 'function') {
              window.__id_paintUpdate();
            }
            if (engine && STATE.paintMode !== undefined) {
              engine.rebuildPaint?.();
            }
          }, 250);
           
          setTimeout(() => {
            const S = STATE.skirting;
            if (!S) return;
            const toggle = document.getElementById('id-skirtingToggle');
            if (toggle) {
              toggle.checked = !!S.enabled;
              toggle.dispatchEvent(new Event('change'));
            }
            const hSel = document.getElementById('id-skirtingHeight');
            if (hSel) {
              const known = ['100','125','150'];
              if (known.includes(String(S.height))) hSel.value = String(S.height);
              else hSel.value = 'custom';
              hSel.dispatchEvent(new Event('change'));
            }
            const hCust = document.getElementById('id-skirtingHeightCustom');
            if (hCust) hCust.value = S.height;
            const pSel = document.getElementById('id-skirtingProfile');
            if (pSel) { pSel.value = S.profile; pSel.dispatchEvent(new Event('change')); }
            const tS = document.getElementById('id-skirtingThickness');
            if (tS) { tS.value = S.thickness; tS.dispatchEvent(new Event('input')); }
            const mSel = document.getElementById('id-skirtingMaterial');
            if (mSel) { mSel.value = S.material; mSel.dispatchEvent(new Event('change')); }
            const ck = document.getElementById('id-skirtingColor');
            if (ck) { ck.value = S.color; ck.dispatchEvent(new Event('input')); }
          }, 150);
           
         // ---------- TILE INPUT LISTENERS ----------
$('#id-tileW')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.size.w = Math.max(50, parseFloat(e.target.value) || 600);
  syncTilePreset();
  if (STATE.step === 7) refreshRender(true);
});

$('#id-tileH')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.size.h = Math.max(50, parseFloat(e.target.value) || 600);
  syncTilePreset();
  if (STATE.step === 7) refreshRender(true);
});

$('#id-tilePreset')?.addEventListener('change', (e) => {
  const v = e.target.value;
  if (v === 'custom') return;
  const [w, h] = v.split(',').map(Number);
  if (!w || !h) return;
  const cur = STATE.tiles[STATE.activeTab];
  cur.size.w = w;
  cur.size.h = h;
  if ($('#id-tileW')) $('#id-tileW').value = w;
  if ($('#id-tileH')) $('#id-tileH').value = h;
  toast(`টাইলের মাপ: ${w} × ${h} mm`, 'info', 1500);
  if (STATE.step === 7) refreshRender(true);
});

 $('#id-tileRot')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.rot = parseFloat(e.target.value) || 0;
  if ($('#id-tileRotVal')) $('#id-tileRotVal').textContent = cur.rot + '°';
  if (STATE.step === 7) refreshRender(true);
});

$('#id-grout')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.grout = parseFloat(e.target.value) || 0;
  if ($('#id-groutVal')) $('#id-groutVal').textContent = cur.grout + 'mm';
});

$('#id-tileOffsetX')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.offsetX = parseFloat(e.target.value) || 0;
  if ($('#id-tileOffXVal')) $('#id-tileOffXVal').textContent = cur.offsetX + 'mm';
  if (STATE.step === 7) refreshRender(true);
});

$('#id-tileOffsetY')?.addEventListener('input', (e) => {
  const cur = STATE.tiles[STATE.activeTab];
  cur.offsetY = parseFloat(e.target.value) || 0;
  if ($('#id-tileOffYVal')) $('#id-tileOffYVal').textContent = cur.offsetY + 'mm';
  if (STATE.step === 7) refreshRender(true);
});
// ---------- END TILE INPUT LISTENERS ----------

refreshTileGallery();
          refreshSelectedList();
          refreshFurnitureGrid();
          $('#id-myDesigns').hidden = true;
          showStep(7);
        });
        list.appendChild(row);
      });
    }
    $('#id-myDesigns').hidden = false;
    $('#id-myDesigns').style.display = 'flex'; 
  } catch (e) {
    toast('লোড ব্যর্থ', 'error');
  }
});
$('#id-myDesignsClose')?.addEventListener('click', () => {
  $('#id-myDesigns').hidden = true;
  $('#id-myDesigns').style.display = 'none';
});

// ============================================================
// HELP MODAL
// ============================================================
$('#id-helpBtn')?.addEventListener('click', () => {
  $('#id-helpModal').hidden = false;
  $('#id-helpModal').style.display = 'flex';
});
$('#id-helpClose')?.addEventListener('click', () => {
  $('#id-helpModal').hidden = true;
  $('#id-helpModal').style.display = 'none';
});

// ============================================================
// FORCE-HIDE MODALS ON LOAD (CSS override-proof)
// ============================================================
['id-helpModal', 'id-cropModal', 'id-myDesigns'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
});

// ============================================================
// FURNITURE SELECTION / TRANSFORM HOOKS
// ============================================================
window.__id_onSelectFurniture = (idx) => {
  const bar = document.getElementById('id-transformBar');
  if (!bar) return;
  if (idx < 0) { bar.hidden = true; return; }
  bar.hidden = false;
  const f = STATE.furniture[idx];
  const def = window.__id_library?.getItemById(f?.id);
  document.getElementById('id-transformInfo').textContent =
    def ? `${def.emoji || ''} ${def.name}` : (f?.id || '—');
};

window.__id_onTransform = (idx, data) => {
  if (idx < 0 || idx >= STATE.furniture.length) return;
  Object.assign(STATE.furniture[idx], data);
  refreshSelectedList();
};

window.__id_onDeleteFurniture = (idx) => {
  if (idx < 0 || idx >= STATE.furniture.length) return;
  STATE.furniture.splice(idx, 1);
  refreshSelectedList();
  toast('আইটেম মুছে ফেলা হয়েছে', 'info');
};

// Transform mode buttons
function setActiveMode(activeId) {
  ['id-modeMove', 'id-modeRotate', 'id-modeScale'].forEach(id => {
    document.getElementById(id)?.classList.toggle('active', id === activeId);
  });
}
document.getElementById('id-modeMove')?.addEventListener('click', () => {
  engine?.setTransformMode('translate');
  setActiveMode('id-modeMove');
});
document.getElementById('id-modeRotate')?.addEventListener('click', () => {
  engine?.setTransformMode('rotate');
  setActiveMode('id-modeRotate');
});
document.getElementById('id-modeScale')?.addEventListener('click', () => {
  engine?.setTransformMode('scale');
  setActiveMode('id-modeScale');
});
document.getElementById('id-modeDeselect')?.addEventListener('click', () => {
  engine?.deselectFurniture();
});

// ফার্নিচার যোগ করার সময় ক্যামেরা ধরে রাখা
const _origRefreshRender = refreshRender;
window.refreshRender = refreshRender = async function (preserve) {
  if (!engine) return;
  try {
    if (preserve && engine.renderPreserveCamera) {
      await engine.renderPreserveCamera(STATE);
    } else {
      await engine.render(STATE);
    }
  } catch (e) {
    console.error(e);
    toast('রেন্ডারে সমস্যা', 'error');
  }
};

// ============================================================
// STRUCTURE EDITING
// ============================================================
window.__id_onSelectStructure = (idx) => {
  const panel = $('#id-structPanel');
  if (!panel) return;
  if (idx < 0) { panel.hidden = true; return; }
  const s = STATE.structure[idx];
  if (!s) { panel.hidden = true; return; }

  panel.hidden = false;
  const names = { door: '🚪 দরজা', window: '🪟 জানালা', pillar: '🏛️ পিলার', stairs: '🪜 সিঁড়ি' };
  $('#id-structTitle').textContent = `${names[s.type] || s.type} — #${idx + 1}`;

  const def = { door: { width: 0.9, height: 2.1 },
                window: { width: 1.2, height: 1.2, sill: 0.9 },
                pillar: { radius: 0.15 },
                stairs: { steps: 6, width: 1.2 } }[s.type] || {};
  const p = Object.assign({}, def, s.params || {});
  s.params = p;

  let html = '';
  if (s.type === 'door') {
    html += row('প্রস্থ (m)', 'width', p.width, 0.4, 3, 0.05);
    html += row('উচ্চতা (m)', 'height', p.height, 1.0, 3, 0.05);
    html += row('দেয়ালে অবস্থান (m)', 'offsetX', p.offsetX || 0, -8, 8, 0.05);
  } else if (s.type === 'window') {
    html += row('প্রস্থ (m)', 'width', p.width, 0.3, 5, 0.05);
    html += row('উচ্চতা (m)', 'height', p.height, 0.3, 3, 0.05);
    html += row('সিল উচ্চতা (m)', 'sill', p.sill, 0, 2.5, 0.05);
    html += row('দেয়ালে অবস্থান (m)', 'offsetX', p.offsetX || 0, -8, 8, 0.05);
  } else if (s.type === 'ventilator') {
    html += row('প্রস্থ (m)', 'width', p.width, 0.3, 1.5, 0.05);
    html += row('উচ্চতা (m)', 'height', p.height, 0.2, 1.0, 0.05);
    html += row('সিল উচ্চতা (m)', 'sill', p.sill, 1.5, 2.5, 0.05);
    html += row('দেয়ালে অবস্থান (m)', 'offsetX', p.offsetX || 0, -8, 8, 0.05);
  } else if (s.type === 'pillar') {
    html += selectRow('আকৃতি', 'shape', p.shape, [
      ['round', '⭕ গোল'], ['square', '⬛ স্কয়ার']
    ]);
    html += row('সাইজ (m)', 'size', p.size, 0.08, 0.6, 0.01);
    html += row('বেস সাইজ (m)', 'baseSize', p.baseSize, 0.1, 0.9, 0.02);
    html += row('বেস উচ্চতা (m)', 'baseH', p.baseH, 0.05, 0.5, 0.01);
    html += row('ক্যাপিটাল উচ্চতা (m)', 'capH', p.capH, 0.05, 0.5, 0.01);
    html += row('X অফসেট (m)', 'offsetX', p.offsetX || 0, -5, 5, 0.05);
    html += row('Z অফসেট (m)', 'offsetZ', p.offsetZ || 0, -5, 5, 0.05);
  } else if (s.type === 'stairs') {
    html += row('ধাপ সংখ্যা', 'steps', p.steps, 2, 30, 1);
    html += row('প্রস্থ (m)', 'width', p.width, 0.5, 3, 0.05);
    html += row('ট্রেড গভীরতা (m)', 'depth', p.depth, 0.15, 0.6, 0.01);
    html += row('প্রতি ধাপ উচ্চতা (m)', 'riserH', p.riserH, 0.12, 0.30, 0.01);
    html += selectRow('থিকনেস', 'thickness', p.thickness, [
      ['single', 'সিঙ্গেল (এক লেয়ার)'], ['double', 'ডাবল (ট্রেড + রাইজার আলাদা)']
    ]);
    html += selectRow('রেলিং', 'railing', p.railing, [
      ['none', 'নেই'], ['wood', '🪵 কাঠ'], ['metal', '⚙️ মেটাল'], ['glass', '🔷 গ্লাস']
    ]);
    if (p.railing && p.railing !== 'none') {
      html += row('রেলিং উচ্চতা (m)', 'railingH', p.railingH, 0.7, 1.2, 0.05);
    }
    html += selectRow('মোল্ডিং', 'molding', p.molding, [
      ['none', 'নেই'], ['simple', 'এক লাইন'], ['double', 'ডাবল মোল্ডিং']
    ]);
    if (p.molding !== 'none') {
      html += row('মোল্ডিং উচ্চতা (m)', 'moldingH', p.moldingH, 0.02, 0.12, 0.005);
    }
    html += selectRow('ট্রেড মেটেরিয়াল', 'treadMaterial', p.treadMaterial || 'solid', [
      ['solid', 'ধূসর কংক্রিট'], ['floor', '🟫 ফ্লোর টাইল'], ['wall', '🧱 ওয়াল টাইল'], ['accent', '🎯 অ্যাকসেন্ট']
    ]);
    html += selectRow('রাইজার মেটেরিয়াল', 'riserMaterial', p.riserMaterial || 'solid', [
      ['solid', 'সাদা'], ['floor', '🟫 ফ্লোর টাইল'], ['wall', '🧱 ওয়াল টাইল'], ['accent', '🎯 অ্যাকসেন্ট']
    ]);
  }
  html += `<div class="id-struct-row" style="margin-top:12px">
    <button id="id-structDelete" style="background:#e74c3c;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;flex:1">🗑️ এই আইটেম মুছুন</button>
  </div>`;

  $('#id-structBody').innerHTML = html;

  // Wire inputs
  $('#id-structBody').querySelectorAll('input[data-param]').forEach(inp => {
    inp.addEventListener('input', () => {
      const key = inp.dataset.param;
      const val = parseFloat(inp.value);
      if (isNaN(val)) return;
      engine?.updateStructure(idx, { [key]: val });
    });
  });

     $('#id-structBody').querySelectorAll('select[data-param]').forEach(sel => {
    sel.addEventListener('change', () => {
      const key = sel.dataset.param;
      engine?.updateStructure(idx, { [key]: sel.value });
    });
  });

  $('#id-structDelete')?.addEventListener('click', () => {
    engine?.deleteStructure(idx);
    panel.hidden = true;
    buildStructureSVG();
  });

  function row(label, key, val, min, max, step) {
    return `<div class="id-struct-row">
      <label>${label}</label>
      <input type="number" data-param="${key}" value="${val}" min="${min}" max="${max}" step="${step}">
    </div>`;
  }
  function selectRow(label, key, val, options) {
    const opts = options.map(([v, t]) =>
      `<option value="${v}" ${v === val ? 'selected' : ''}>${t}</option>`
    ).join('');
    return `<div class="id-struct-row">
      <label>${label}</label>
      <select data-param="${key}">${opts}</select>
    </div>`;
  }
};

$('#id-structClose')?.addEventListener('click', () => {
  engine?._clearStructSelection();
  $('#id-structPanel').hidden = true;
});

// ============================================================
// FREE 3D MODEL LOADER
// ============================================================
$('#id-modelLoad')?.addEventListener('click', async () => {
  const url = $('#id-modelUrl')?.value.trim();
  const name = $('#id-modelName')?.value.trim() || 'Custom Model';
  if (!url) { toast('URL দিন', 'error'); return; }
    if (!/\.(glb|gltf)(\?|$)/i.test(url)) {
    toast('❌ সরাসরি .glb / .gltf লিংক দিন। Sketchfab পেজের URL কাজ করবে না — ডাউনলোড বাটন থেকে .glb নামান।', 'error', 5000);
    return;
  }
  if (!engine) { toast('প্রথমে ধাপ ৭-এ যান', 'error'); return; }
  toast('লোড হচ্ছে…', 'info');
  try {
    const grp = await engine.loadModelFromURL(url, name, { targetMeters: 1.5 });
    const idx = STATE.furniture.length;
    grp.userData.stateIndex = idx;
    // Save to state
    STATE.furniture.push({
      id: grp.userData.id,
      customName: name,
      customUrl: url,
      isCustom: true,
      x: grp.position.x / 0.3048,
      y: 0,
      z: grp.position.z / 0.3048,
      rot: 0, sx: 1, sy: 1, sz: 1
    });
    refreshSelectedList();
    toast(`✅ ${name} যোগ হয়েছে`, 'success');
    $('#id-modelUrl').value = '';
    $('#id-modelName').value = '';
  } catch (err) {
    console.error(err);
    toast('❌ লোড ব্যর্থ: CORS বা URL সমস্যা', 'error', 4000);
  }
});

// ============================================================
// INIT
// ============================================================

// ============================================================
// RIGHT-CLICK CONTEXT MENU
// ============================================================
const ctxMenu = $('#id-ctxMenu');
let ctxTarget = { type: null, idx: -1 };

function hideCtx() { ctxMenu.hidden = true; }
document.addEventListener('click', hideCtx);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideCtx(); });

function buildCtxItems(type, idx) {
  const items = [];
  if (type === 'furniture') {
    const f = STATE.furniture[idx];
    if (!f) return [];
    const def = window.__id_library?.getItemById(f.id);
    const name = f.isCustom ? `🌐 ${f.customName}` : `${def?.emoji || ''} ${def?.name || f.id}`;
    items.push({ kind: 'title', label: name });
    items.push({ icon: '↔️', label: 'মুভ মোড', val: 'G', act: () => engine?.setTransformMode('translate') });
    items.push({ icon: '🔁', label: 'রোটেট মোড', val: 'R', act: () => engine?.setTransformMode('rotate') });
    items.push({ icon: '🔍', label: 'স্কেল মোড', val: 'S', act: () => engine?.setTransformMode('scale') });
    items.push({ kind: 'sep' });
    items.push({ icon: '↺', label: 'বামে ৪৫°', act: () => changeFurniture(idx, { rot: (f.rot || 0) - 45 }) });
    items.push({ icon: '↻', label: 'ডানে ৪৫°', act: () => changeFurniture(idx, { rot: (f.rot || 0) + 45 }) });
    items.push({ icon: '⟳', label: '৯০° রোটেট', act: () => changeFurniture(idx, { rot: (f.rot || 0) + 90 }) });
    items.push({ kind: 'sep' });
    items.push({ icon: '➕', label: 'বড় করুন', act: () => changeFurniture(idx, { sx: Math.min((f.sx||1)*1.15, 3) }) });
    items.push({ icon: '➖', label: 'ছোট করুন', act: () => changeFurniture(idx, { sx: Math.max((f.sx||1)*0.87, 0.3) }) });
    items.push({ icon: '🧍', label: 'আসল সাইজে ফেরান', act: () => changeFurniture(idx, { sx: 1 }) });
    items.push({ kind: 'sep' });
    items.push({ icon: '🎯', label: 'রুমের মাঝে বসান', act: () => changeFurniture(idx, { x: 0, z: 0 }) });
    items.push({ icon: '📋', label: 'কপি তৈরি করুন', act: () => duplicateFurniture(idx) });
    items.push({ icon: '⟲', label: 'সব রিসেট', act: () => changeFurniture(idx, { rot: 0, sx: 1, sy: 1, sz: 1 }) });
    items.push({ kind: 'sep' });
    items.push({ icon: '✕', label: 'মুছুন', danger: true, act: () => deleteFurnitureAt(idx) });
  }
  else if (type === 'structure') {
    const s = STATE.structure[idx];
    if (!s) return [];
    const names = { door: '🚪 দরজা', window: '🪟 জানালা', pillar: '🏛️ পিলার', stairs: '🪜 সিঁড়ি' };
    items.push({ kind: 'title', label: `${names[s.type]} #${idx+1}` });
    items.push({ icon: '⚙️', label: 'মাপ/সেটিংস এডিট', act: () => { window.__id_onSelectStructure?.(idx); } });
    items.push({ kind: 'sep' });
    items.push({ icon: '↺', label: 'বামে ৪৫°', act: () => changeStructure(idx, { rot: (s.rot || 0) - 45 }) });
    items.push({ icon: '↻', label: 'ডানে ৪৫°', act: () => changeStructure(idx, { rot: (s.rot || 0) + 45 }) });
    items.push({ kind: 'sep' });
    items.push({ icon: '✕', label: 'মুছুন', danger: true, act: () => deleteStructureAt(idx) });
  }
  else {
    items.push({ kind: 'title', label: 'রুম অপশন' });
    items.push({ icon: '🎥', label: 'সামনে থেকে দেখুন', act: () => { STATE.cameraView='front'; refreshRender(); } });
    items.push({ icon: '🔝', label: 'উপর থেকে দেখুন', act: () => { STATE.cameraView='top'; refreshRender(); } });
    items.push({ icon: '📐', label: 'আইসোমেট্রিক ভিউ', act: () => { STATE.cameraView='iso'; refreshRender(); } });
    items.push({ kind: 'sep' });
    items.push({ icon: '☀️', label: 'দিন', act: () => { STATE.lightMode='day'; $('#id-lightMode').value='day'; refreshRender(); } });
    items.push({ icon: '🌅', label: 'সন্ধ্যা', act: () => { STATE.lightMode='sunset'; $('#id-lightMode').value='sunset'; refreshRender(); } });
    items.push({ icon: '🌙', label: 'রাত', act: () => { STATE.lightMode='night'; $('#id-lightMode').value='night'; refreshRender(); } });
    items.push({ kind: 'sep' });
    items.push({ icon: '✨', label: 'ফাইনাল HD রেন্ডার', act: () => $('#id-finalRender')?.click() });
  }
  return items;
}

function renderCtx(x, y, items) {
  ctxMenu.innerHTML = '';
  items.forEach(it => {
    if (it.kind === 'title') {
      const d = document.createElement('div');
      d.className = 'id-ctx-title';
      d.textContent = it.label;
      ctxMenu.appendChild(d);
      return;
    }
    if (it.kind === 'sep') {
      const d = document.createElement('div');
      d.className = 'id-ctx-sep';
      ctxMenu.appendChild(d);
      return;
    }
    const d = document.createElement('div');
    d.className = 'id-ctx-item' + (it.danger ? ' danger' : '');
    d.innerHTML = `<span class="id-ctx-icon">${it.icon}</span><span>${it.label}</span>${it.val ? `<span class="id-ctx-value">${it.val}</span>` : ''}`;
    d.addEventListener('click', (e) => {
      e.stopPropagation();
      hideCtx();
      it.act?.();
    });
    ctxMenu.appendChild(d);
  });
  ctxMenu.hidden = false;
  // smart position
  const rect = ctxMenu.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  ctxMenu.style.left = Math.min(x, vw - rect.width - 8) + 'px';
  ctxMenu.style.top  = Math.min(y, vh - rect.height - 8) + 'px';
}

window.__id_showContext = (x, y, type, idx) => {
  ctxTarget = { type, idx };
  const items = buildCtxItems(type, idx);
  if (!items.length) return hideCtx();
  renderCtx(x, y, items);
};

// ---- Actions ----
function changeFurniture(idx, patch) {
  const f = STATE.furniture[idx];
  if (!f) return;
  Object.assign(f, patch);
  if (patch.sx != null) { f.sy = patch.sx; f.sz = patch.sx; }
  refreshSelectedList();
  if (STATE.step === 7) refreshRender(true);
}
function deleteFurnitureAt(idx) {
  STATE.furniture.splice(idx, 1);
  engine?.deselectFurniture();
  refreshSelectedList();
  if (STATE.step === 7) refreshRender(true);
  toast('মুছে ফেলা হয়েছে', 'info');
}
function duplicateFurniture(idx) {
  const f = STATE.furniture[idx];
  if (!f) return;
  const copy = Object.assign({}, f, {
    x: (f.x || 0) + 1.5,
    z: (f.z || 0) + 1.5
  });
  STATE.furniture.push(copy);
  refreshSelectedList();
  if (STATE.step === 7) refreshRender(true);
  toast('কপি তৈরি হয়েছে', 'success');
}
function changeStructure(idx, patch) {
  const s = STATE.structure[idx];
  if (!s) return;
  if (patch.rot != null) s.rot = patch.rot;
  engine?.updateStructure(idx, s.params || {});
}
function deleteStructureAt(idx) {
  engine?.deleteStructure(idx);
  $('#id-structPanel').hidden = true;
  buildStructureSVG();
  toast('স্ট্রাকচার মুছে ফেলা হয়েছে', 'info');
}

// ============================================================
// HDRI LOADER UI
// ============================================================
const HDRI_MAP = {
  venice:       'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
  kloppenheim:  'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloppenheim_06_puresky_1k.hdr',
  studio:       'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr',
  sunflowers:   'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/sunflowers_puresky_1k.hdr',
  rooitou:      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rooitou_park_1k.hdr',
  quarry:       'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/quarry_01_1k.hdr',
  spruit:       'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/spruit_sunrise_1k.hdr',
  night:        'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dikhololo_night_1k.hdr'
};

$('#id-hdriSelect')?.addEventListener('change', async (e) => {
  const v = e.target.value;
  if (v === 'none') return;
  const url = HDRI_MAP[v];
  if (!url) return;
  toast('🌅 আকাশ লোড হচ্ছে…', 'info');
  try {
     await engine?.loadHDRI(url);
  if (engine.scene && 'environmentIntensity' in engine.scene) {
    engine.scene.environmentIntensity = 0.35;
  }
  if (engine.renderer) {
    engine.renderer.toneMappingExposure = 0.62;
  }
    toast('✅ আকাশ সেট হয়েছে', 'success');
  } catch (err) {
    console.error(err);
    toast('❌ HDRI লোড ব্যর্থ', 'error');
  }
});

// ============================================================
// LIGHT SLIDERS
// ============================================================
function fmtTime(v) {
  const h = Math.floor(v);
  const m = Math.round((v - h) * 60);
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
}

$('#id-timeOfDay')?.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  $('#id-timeVal').textContent = fmtTime(v);
  engine?.setTimeOfDay(v);
});

$('#id-exposure')?.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value) / 100;
  $('#id-expVal').textContent = v.toFixed(2);
  engine?.setExposure(v);
});

$('#id-ambient')?.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value) / 100;
  $('#id-ambVal').textContent = v.toFixed(2);
  engine?.setAmbient(v);
});

// টাইল ট্যাব বদলালে রোট বার আপডেট
document.querySelectorAll('.id-tab').forEach(t => {
  t.addEventListener('click', () => setTimeout(refreshRotBar, 50));
});

// Paver mode STEP 5 → 7 transition
(function() {
  const nextBtn = document.getElementById('id-nextBtn');
  if (nextBtn && nextBtn._paverPatched !== true) {
    nextBtn._paverPatched = true;
  }
})();

// ═══════════════════════════════════════════════
// SKIRTING CONTROLS
// ═══════════════════════════════════════════════
(function initSkirtingUI() {
  const S = STATE.skirting;

  const toggle      = document.getElementById('id-skirtingToggle');
  const panel       = document.getElementById('id-skirtingPanel');
  const heightSel   = document.getElementById('id-skirtingHeight');
  const heightCust  = document.getElementById('id-skirtingHeightCustom');
  const profileSel  = document.getElementById('id-skirtingProfile');
  const thickSlider = document.getElementById('id-skirtingThickness');
  const thickVal    = document.getElementById('id-skirtingThicknessVal');
  const matSel      = document.getElementById('id-skirtingMaterial');
  const colorRow    = document.getElementById('id-skirtingColorRow');
  const colorPick   = document.getElementById('id-skirtingColor');
  const colorText   = document.getElementById('id-skirtingColorText');
  const block       = document.getElementById('id-skirtingBlockPreview');
  const hint        = document.getElementById('id-skirtingHint');

  if (!toggle) return;

  function applySkirting() {
    S.enabled   = toggle.checked;
    S.height    = heightSel.value === 'custom'
                    ? (parseFloat(heightCust.value) || 150)
                    : parseFloat(heightSel.value);
    S.profile   = profileSel.value;
    S.thickness = parseFloat(thickSlider.value) || 12;
    S.material  = matSel.value;
    S.color     = colorPick.value || '#ffffff';

    // UI sync
    if (panel)  panel.hidden = !S.enabled;
    if (heightCust) heightCust.hidden = heightSel.value !== 'custom';
    if (colorRow)   colorRow.hidden   = matSel.value !== 'solid';
    if (thickVal)   thickVal.textContent = S.thickness + 'mm';

    // Preview block
    if (block) {
      block.className = 'id-skirting-block profile-' + S.profile;
      // Height representation (scaled)
      const h = Math.max(14, Math.min(40, S.height / 6));
      block.style.height = h + 'px';
      // Color
      block.style.background = (S.material === 'solid')
        ? S.color
        : (S.material === 'wall'    ? '#d8d8d8'
        :  S.material === 'accent'  ? '#ffb347'
        :  '#ffffff');
    }

    // Hint
    if (hint) {
      const hInch = (S.height / 25.4).toFixed(1);
      hint.textContent = S.enabled
        ? `সব দেয়ালে ${hInch}" (${S.height}mm) ${S.profile} স্কার্টিং — দরজার জায়গায় অটো কাট`
        : 'স্কার্টিং বন্ধ — টগল ON করুন';
    }

    // Live 3D update
    if (STATE.step === 7 && typeof refreshRender === 'function') {
      refreshRender(true);
    }
  }

  // Toggle
  toggle.addEventListener('change', applySkirting);

  // Height dropdown
  heightSel?.addEventListener('change', () => {
    if (heightSel.value === 'custom') {
      heightCust.hidden = false;
      heightCust.focus();
    } else {
      heightCust.hidden = true;
    }
    applySkirting();
  });

  // Custom height input
  heightCust?.addEventListener('input', () => {
    const v = Math.max(50, Math.min(300, parseFloat(heightCust.value) || 150));
    S.height = v;
    applySkirting();
  });

  // Profile
  profileSel?.addEventListener('change', applySkirting);

  // Thickness slider
  thickSlider?.addEventListener('input', applySkirting);

  // Material
  matSel?.addEventListener('change', applySkirting);

  // Color picker
  colorPick?.addEventListener('input', () => {
    colorText.value = colorPick.value;
    applySkirting();
  });

  // Color text input
  colorText?.addEventListener('input', () => {
    const v = colorText.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      colorPick.value = v;
      applySkirting();
    }
  });

  // Initial state (off)
  applySkirting();
})();

// ═══════════════════════════════════════════════
// STAIR CHAMBER CONTROLS
// ═══════════════════════════════════════════════
(function initStairChamber() {
  const SC = STATE.stairChamber;
  if (!SC) return;

  const $id = (id) => document.getElementById(id);

  function updateStairStats() {
    const stats = window.__id_stairChamber?.calcStairStats(SC);
    if (!stats) return;
    const riseEl = $id('id-scRiseVal');
    const stepsEl = $id('id-scTotalStepsVal');
    const lenEl = $id('id-scStairLenVal');
    if (riseEl)  riseEl.textContent  = Math.round(stats.effectiveRise) + ' mm';
    if (stepsEl) stepsEl.textContent = stats.steps;
    if (lenEl)   lenEl.textContent   = Math.round(stats.stairLength) + ' mm';
  }

  // ═══════════════════════════════════════════════
  // DYNAMIC UI VISIBILITY
  // ═══════════════════════════════════════════════
  function updateFinishUI() {
    const F = SC.stair?.finish || {};

    // Tread image URL row
    const treadSrc = $id('id-scTreadSrc')?.value;
    const treadImgRow = $id('id-scTreadImgRow');
    if (treadImgRow) treadImgRow.hidden = (treadSrc !== 'custom');

    // Riser image URL row
    const riserSrc = $id('id-scRiserSrc')?.value;
    const riserImgRow = $id('id-scRiserImgRow');
    if (riserImgRow) riserImgRow.hidden = (riserSrc !== 'custom');

    // Molding gap row (only for double pattern)
    const moldPat = $id('id-scMoldPat')?.value;
    const moldGapRow = $id('id-scMoldGapRow');
    if (moldGapRow) moldGapRow.hidden = (moldPat !== 'double');
    // Mold2 color only for double
    const moldClr2 = $id('id-scMoldClr2');
    if (moldClr2) {
      const p2 = moldClr2.closest('.id-row');
      if (p2) p2.style.display = (moldPat === 'none') ? 'none' : '';
    }

    // Side slope image row
    const sideSrc = $id('id-scSideSrc')?.value;
    const sideImgRow = $id('id-scSideImgRow');
    if (sideImgRow) sideImgRow.hidden = (sideSrc !== 'custom');
    const sideTileRow = $id('id-scSideTileRow');
    if (sideTileRow) sideTileRow.hidden = (sideSrc !== 'custom');

    // Skirting wall tile URL row
    const wallTileChk = $id('id-scSkirtWallTile')?.checked;
    const wallImgRow = $id('id-scSkirtWallImgRow');
    if (wallImgRow) wallImgRow.hidden = !wallTileChk;

    // Label updates
    const treadTVal = $id('id-scTreadT2Val');
    if (treadTVal) treadTVal.textContent = ($id('id-scTreadT2')?.value || 20) + 'mm';
    const treadOHVal = $id('id-scTreadOHVal');
    if (treadOHVal) treadOHVal.textContent = ($id('id-scTreadOH')?.value || 10) + 'mm';
    const riserTVal = $id('id-scRiserT2Val');
    if (riserTVal) riserTVal.textContent = ($id('id-scRiserT2')?.value || 18) + 'mm';
    const moldTVal = $id('id-scMoldTVal');
    if (moldTVal) moldTVal.textContent = ($id('id-scMoldT')?.value || 5) + 'mm';
    const moldGapVal = $id('id-scMoldGapVal');
    if (moldGapVal) moldGapVal.textContent = ($id('id-scMoldGap')?.value || 8) + 'mm';
    const skirtHVal = $id('id-scSkirtHVal');
    if (skirtHVal) skirtHVal.textContent = ($id('id-scSkirtH')?.value || 100) + 'mm';
    const skirtBoardHVal = $id('id-scSkirtBoardHVal');
    if (skirtBoardHVal) skirtBoardHVal.textContent = ($id('id-scSkirtBoardH')?.value || 40) + 'mm';
  }
   
   function autoFitChamber() {
    if (!window.__id_stairChamber?.computeMinChamberSize) return;
    const min = window.__id_stairChamber.computeMinChamberSize(SC);
    const wEl = $id('id-scW');
    const lEl = $id('id-scL');
    let changed = false;
    if (wEl && SC.size.w < min.w_ft) {
      SC.size.w = min.w_ft;
      wEl.value = min.w_ft;
      changed = true;
    }
    if (lEl && SC.size.l < min.l_ft) {
      SC.size.l = min.l_ft;
      lEl.value = min.l_ft;
      changed = true;
    }
    if (changed) {
      toast(`📐 Chamber auto-sized to ${SC.size.w}×${SC.size.l} ft`, 'info', 2500);
    }
  }

  function applyAll() {
    const tog = $id('id-scToggle');
    SC.enabled = !!tog?.checked;
    const scPanel = $id('id-scPanel');
    if (scPanel) scPanel.hidden = !SC.enabled;

    SC.position = $id('id-scPosition')?.value || 'right';
    SC.size.w = Math.max(4, Math.min(20, parseFloat($id('id-scW')?.value) || 8));
    SC.size.l = Math.max(6, Math.min(30, parseFloat($id('id-scL')?.value) || 12));

    SC.door.enabled = !!$id('id-scDoorEnabled')?.checked;
    SC.door.width = Math.max(600, Math.min(1500, parseFloat($id('id-scDoorW')?.value) || 900));
    SC.door.height = Math.max(1800, Math.min(2400, parseFloat($id('id-scDoorH')?.value) || 2100));

    SC.stair.totalHeight = Math.max(1500, Math.min(6000, parseFloat($id('id-scTotalH')?.value) || 3048));
    SC.stair.autoSteps = !!$id('id-scAutoSteps')?.checked;
    if (!SC.stair.autoSteps) {
      SC.stair.totalSteps = Math.max(3, Math.min(30, parseFloat($id('id-scSteps')?.value) || 17));
    } else {
      SC.stair.totalSteps = Math.round(SC.stair.totalHeight / 180);
      const stepsEl = $id('id-scSteps');
      if (stepsEl) stepsEl.value = SC.stair.totalSteps;
    }
    SC.stair.treadThickness = Math.max(10, Math.min(40, parseFloat($id('id-scTreadT')?.value) || 20));
    SC.stair.riserThickness = Math.max(10, Math.min(40, parseFloat($id('id-scRiserT')?.value) || 18));
    SC.stair.treadDepth = Math.max(200, Math.min(400, parseFloat($id('id-scRun')?.value) || 280));
    SC.stair.width = Math.max(700, Math.min(1800, parseFloat($id('id-scStairW')?.value) || 1000));
    SC.stair.direction = $id('id-scDirection')?.value || 'along-length';
    SC.stair.type = $id('id-scStairType')?.value || 'straight';

    SC.stair.molding1 = Math.max(2, Math.min(20, parseFloat($id('id-scMold1')?.value) || 5));
    SC.stair.moldingGap = Math.max(2, Math.min(20, parseFloat($id('id-scMoldGap')?.value) || 8));
    SC.stair.molding2 = Math.max(2, Math.min(20, parseFloat($id('id-scMold2')?.value) || 5));

    SC.stair.treadMaterial = $id('id-scTreadMat')?.value || 'custom';
    SC.stair.treadColor = $id('id-scTreadColor')?.value || '#1a1a1a';
    SC.stair.riserMaterial = $id('id-scRiserMat')?.value || 'custom';
    SC.stair.riserColor = $id('id-scRiserColor')?.value || '#222222';
    SC.stair.molding1Color = $id('id-scMold1Color')?.value || '#ffffff';
    SC.stair.moldingGapColor = $id('id-scMoldGapColor')?.value || '#1a1a1a';
    SC.stair.molding2Color = $id('id-scMold2Color')?.value || '#ffffff';
    SC.wallColor = $id('id-scWallColor')?.value || '#f0f0f0';

    SC.railing.enabled = !!$id('id-scRailEnabled')?.checked;
    SC.railing.type = $id('id-scRailType')?.value || 'metal';
    SC.railing.height = Math.max(600, Math.min(1200, parseFloat($id('id-scRailH')?.value) || 900));
    SC.railing.side = $id('id-scRailSide')?.value || 'right';

       SC.skirtingStyle = $id('id-scSkirtStyle')?.value || 'plain';

    // ───── STAIR FINISH ─────
    if (!SC.stair.finish) SC.stair.finish = {};

    // Tread
    if (!SC.stair.finish.tread) SC.stair.finish.tread = {};
    SC.stair.finish.tread.source    = $id('id-scTreadSrc')?.value || 'solid';
    SC.stair.finish.tread.color     = $id('id-scTreadClr')?.value || '#1a1a1a';
    SC.stair.finish.tread.imageUrl  = $id('id-scTreadImg')?.value?.trim() || null;
    SC.stair.finish.tread.thickness = Math.max(10, Math.min(30, parseFloat($id('id-scTreadT2')?.value) || 20));
    SC.stair.finish.tread.overhang  = Math.max(0,  Math.min(30, parseFloat($id('id-scTreadOH')?.value) || 10));

    // Riser
    if (!SC.stair.finish.riser) SC.stair.finish.riser = {};
    SC.stair.finish.riser.source    = $id('id-scRiserSrc')?.value || 'solid';
    SC.stair.finish.riser.color     = $id('id-scRiserClr')?.value || '#222222';
    SC.stair.finish.riser.imageUrl  = $id('id-scRiserImg')?.value?.trim() || null;
    SC.stair.finish.riser.thickness = Math.max(10, Math.min(25, parseFloat($id('id-scRiserT2')?.value) || 18));

    // Molding
    if (!SC.stair.finish.molding) SC.stair.finish.molding = {};
    SC.stair.finish.molding.pattern   = $id('id-scMoldPat')?.value || 'simple';
    SC.stair.finish.molding.color1    = $id('id-scMoldClr1')?.value || '#ffffff';
    SC.stair.finish.molding.color2    = $id('id-scMoldClr2')?.value || '#1a1a1a';
    SC.stair.finish.molding.thickness = Math.max(2, Math.min(15, parseFloat($id('id-scMoldT')?.value) || 5));
    SC.stair.finish.molding.gap       = Math.max(2, Math.min(20, parseFloat($id('id-scMoldGap')?.value) || 8));

    // Side Slope
    if (!SC.stair.finish.sideSlope) SC.stair.finish.sideSlope = {};
    SC.stair.finish.sideSlope.source   = $id('id-scSideSrc')?.value || 'wall';
    SC.stair.finish.sideSlope.color    = $id('id-scSideClr')?.value || '#d0d0d0';
    SC.stair.finish.sideSlope.imageUrl = $id('id-scSideImg')?.value?.trim() || null;
    SC.stair.finish.sideSlope.tileW    = Math.max(50, Math.min(600, parseFloat($id('id-scSideTileW')?.value) || 200));
    SC.stair.finish.sideSlope.tileH    = Math.max(50, Math.min(600, parseFloat($id('id-scSideTileH')?.value) || 100));
       // Slab Style
    SC.stair.finish.stairSlabStyle = $id('id-scSlabStyle')?.value || 'stepped';

    
     // Bottom Face
    if (!SC.stair.finish.bottomFace) SC.stair.finish.bottomFace = {};
    SC.stair.finish.bottomFace.color = $id('id-scBottomClr')?.value || '#d0d0d0';

    // Side Skirting (chamber)
    if (!SC.stair.finish.skirting) SC.stair.finish.skirting = {};
    SC.stair.finish.skirting.type       = $id('id-scSkirtType')?.value || 'plain';
    SC.stair.finish.skirting.color      = $id('id-scSkirtClr')?.value || '#ffffff';
    SC.stair.finish.skirting.height     = Math.max(50,  Math.min(200, parseFloat($id('id-scSkirtH')?.value) || 100));
    SC.stair.finish.skirting.boardColor = $id('id-scSkirtBoardClr')?.value || '#ffffff';
    SC.stair.finish.skirting.boardHeight= Math.max(10,  Math.min(80,  parseFloat($id('id-scSkirtBoardH')?.value) || 40));
    if (!SC.stair.finish.skirting.wallTile) SC.stair.finish.skirting.wallTile = {};
    SC.stair.finish.skirting.wallTile.enabled  = !!$id('id-scSkirtWallTile')?.checked;
    SC.stair.finish.skirting.wallTile.imageUrl = $id('id-scSkirtWallImg')?.value?.trim() || null;

    // ───── UI visibility toggles ─────
    updateFinishUI();

    autoFitChamber();;
    updateStairStats();

    if (STATE.step === 7 && typeof refreshRender === 'function') {
      refreshRender();
    }
  }

  const inputs = [
    // Main chamber
    'id-scToggle', 'id-scPosition', 'id-scW', 'id-scL',
    'id-scDoorEnabled', 'id-scDoorW', 'id-scDoorH',
    'id-scTotalH', 'id-scSteps', 'id-scAutoSteps',
    'id-scTreadT', 'id-scRiserT', 'id-scRun',
    'id-scStairW', 'id-scDirection', 'id-scStairType',

    // FINISH — Tread
    'id-scTreadSrc', 'id-scTreadClr', 'id-scTreadImg',
    'id-scTreadT2', 'id-scTreadOH',

    // FINISH — Riser
    'id-scRiserSrc', 'id-scRiserClr', 'id-scRiserImg',
    'id-scRiserT2',

    // FINISH — Molding
    'id-scMoldPat', 'id-scMoldClr1', 'id-scMoldClr2',
    'id-scMoldT', 'id-scMoldGap',

    // FINISH — Side Slope
    'id-scSideSrc', 'id-scSideClr', 'id-scSideImg',
    'id-scSideTileW', 'id-scSideTileH',

    // FINISH — Bottom Face
    'id-scBottomClr',

    // SIDE SKIRTING
    'id-scSkirtType', 'id-scSkirtClr', 'id-scSkirtH',
    'id-scSkirtBoardClr', 'id-scSkirtBoardH',
    'id-scSkirtWallTile', 'id-scSkirtWallImg',

    // Railing
    'id-scRailEnabled', 'id-scRailType', 'id-scRailH', 'id-scRailSide',
    'id-scSkirtStyle'
  ];
  inputs.forEach(id => {
    const el = $id(id);
    if (!el) return;
    const evt = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';
    el.addEventListener(evt, applyAll);
  });

  window.__id_syncStairUI = function () {
    if (!SC) return;
    if ($id('id-scToggle')) $id('id-scToggle').checked = !!SC.enabled;
    if ($id('id-scPosition')) $id('id-scPosition').value = SC.position;
    if ($id('id-scW')) $id('id-scW').value = SC.size.w;
    if ($id('id-scL')) $id('id-scL').value = SC.size.l;
    if ($id('id-scDoorEnabled')) $id('id-scDoorEnabled').checked = !!SC.door.enabled;
    if ($id('id-scDoorW')) $id('id-scDoorW').value = SC.door.width;
    if ($id('id-scDoorH')) $id('id-scDoorH').value = SC.door.height;
    if ($id('id-scTotalH')) $id('id-scTotalH').value = SC.stair.totalHeight;
    if ($id('id-scSteps')) $id('id-scSteps').value = SC.stair.totalSteps;
    if ($id('id-scAutoSteps')) $id('id-scAutoSteps').checked = !!SC.stair.autoSteps;
    if ($id('id-scTreadT')) $id('id-scTreadT').value = SC.stair.treadThickness;
    if ($id('id-scRiserT')) $id('id-scRiserT').value = SC.stair.riserThickness;
    if ($id('id-scRun')) $id('id-scRun').value = SC.stair.treadDepth;
    if ($id('id-scStairW')) $id('id-scStairW').value = SC.stair.width;
    if ($id('id-scDirection')) $id('id-scDirection').value = SC.stair.direction;
    if ($id('id-scStairType')) $id('id-scStairType').value = SC.stair.type || 'straight';
    if ($id('id-scMold1')) $id('id-scMold1').value = SC.stair.molding1;
    if ($id('id-scMoldGap')) $id('id-scMoldGap').value = SC.stair.moldingGap;
    if ($id('id-scMold2')) $id('id-scMold2').value = SC.stair.molding2;
    if ($id('id-scTreadMat')) $id('id-scTreadMat').value = SC.stair.treadMaterial;
    if ($id('id-scTreadColor')) $id('id-scTreadColor').value = SC.stair.treadColor;
    if ($id('id-scRiserMat')) $id('id-scRiserMat').value = SC.stair.riserMaterial;
    if ($id('id-scRiserColor')) $id('id-scRiserColor').value = SC.stair.riserColor;
    if ($id('id-scMold1Color')) $id('id-scMold1Color').value = SC.stair.molding1Color;
    if ($id('id-scMoldGapColor')) $id('id-scMoldGapColor').value = SC.stair.moldingGapColor;
    if ($id('id-scMold2Color')) $id('id-scMold2Color').value = SC.stair.molding2Color;
    if ($id('id-scWallColor')) $id('id-scWallColor').value = SC.wallColor;
    if ($id('id-scRailEnabled')) $id('id-scRailEnabled').checked = !!SC.railing.enabled;
    if ($id('id-scRailType')) $id('id-scRailType').value = SC.railing.type;
    if ($id('id-scRailH')) $id('id-scRailH').value = SC.railing.height;
    if ($id('id-scRailSide')) $id('id-scRailSide').value = SC.railing.side;
    if ($id('id-scSkirtStyle')) $id('id-scSkirtStyle').value = SC.skirtingStyle;
    const p = $id('id-scPanel');
    if (p) p.hidden = !SC.enabled;
    updateStairStats();
  };

  autoFitChamber();
 
      // Sync finish UI
    const F = SC.stair?.finish || {};

    if ($id('id-scTreadSrc')) $id('id-scTreadSrc').value = F.tread?.source || 'solid';
    if ($id('id-scTreadClr')) $id('id-scTreadClr').value = F.tread?.color || '#1a1a1a';
    if ($id('id-scTreadImg')) $id('id-scTreadImg').value = F.tread?.imageUrl || '';
    if ($id('id-scTreadT2')) $id('id-scTreadT2').value = F.tread?.thickness || 20;
    if ($id('id-scTreadOH')) $id('id-scTreadOH').value = F.tread?.overhang || 10;

    if ($id('id-scRiserSrc')) $id('id-scRiserSrc').value = F.riser?.source || 'solid';
    if ($id('id-scRiserClr')) $id('id-scRiserClr').value = F.riser?.color || '#222222';
    if ($id('id-scRiserImg')) $id('id-scRiserImg').value = F.riser?.imageUrl || '';
    if ($id('id-scRiserT2')) $id('id-scRiserT2').value = F.riser?.thickness || 18;

    if ($id('id-scMoldPat')) $id('id-scMoldPat').value = F.molding?.pattern || 'simple';
    if ($id('id-scMoldClr1')) $id('id-scMoldClr1').value = F.molding?.color1 || '#ffffff';
    if ($id('id-scMoldClr2')) $id('id-scMoldClr2').value = F.molding?.color2 || '#1a1a1a';
    if ($id('id-scMoldT')) $id('id-scMoldT').value = F.molding?.thickness || 5;
    if ($id('id-scMoldGap')) $id('id-scMoldGap').value = F.molding?.gap || 8;

    if ($id('id-scSideSrc')) $id('id-scSideSrc').value = F.sideSlope?.source || 'wall';
    if ($id('id-scSideClr')) $id('id-scSideClr').value = F.sideSlope?.color || '#d0d0d0';
    if ($id('id-scSideImg')) $id('id-scSideImg').value = F.sideSlope?.imageUrl || '';
    if ($id('id-scSideTileW')) $id('id-scSideTileW').value = F.sideSlope?.tileW || 200;
    if ($id('id-scSideTileH')) $id('id-scSideTileH').value = F.sideSlope?.tileH || 100;

    if ($id('id-scBottomClr')) $id('id-scBottomClr').value = F.bottomFace?.color || '#d0d0d0';

    if ($id('id-scSkirtType')) $id('id-scSkirtType').value = F.skirting?.type || 'plain';
    if ($id('id-scSkirtClr')) $id('id-scSkirtClr').value = F.skirting?.color || '#ffffff';
    if ($id('id-scSkirtH')) $id('id-scSkirtH').value = F.skirting?.height || 100;
    if ($id('id-scSkirtBoardClr')) $id('id-scSkirtBoardClr').value = F.skirting?.boardColor || '#ffffff';
    if ($id('id-scSkirtBoardH')) $id('id-scSkirtBoardH').value = F.skirting?.boardHeight || 40;
    if ($id('id-scSkirtWallTile')) $id('id-scSkirtWallTile').checked = !!F.skirting?.wallTile?.enabled;
    if ($id('id-scSkirtWallImg')) $id('id-scSkirtWallImg').value = F.skirting?.wallTile?.imageUrl || '';

    updateFinishUI();

    updateStairStats(); 
   updateStairStats();
  const scPanelInit = $id('id-scPanel');
  if (scPanelInit) scPanelInit.hidden = !SC.enabled;
})();

// ═══════════════════════════════════════════════
// PAINT MODE — Wall & Ceiling Color
// ═══════════════════════════════════════════════
// Engine hooks for paint mode
// Engine hooks for paint mode
window.__id_isPaintMode = () => !!STATE.paintMode;
window.__id_getPaintColor = () => STATE.paintColor || '#ffffff';

window.__id_onPaint = (target, wallIndex) => {
  if (!engine) return;
  if (target === 'ceiling') {
    engine.paintCeiling();
    toast(`🎨 সিলিং → ${STATE.paintColor}`, 'success', 1200);
  } else if (target === 'wall' && wallIndex >= 0) {
    engine.paintWall(wallIndex);
    const n = Object.keys(STATE.wallColors).length;
    toast(`🎨 দেয়াল #${wallIndex + 1} → ${STATE.paintColor} (${n} দেয়াল)`, 'success', 1200);
  }
  if (typeof window.__id_paintUpdate === 'function') {
    window.__id_paintUpdate();
  }
};

(function initPaintTool() {
  const btn      = document.getElementById('id-paintModeBtn');
  const colorIn  = document.getElementById('id-paintColor');
  const colorTxt = document.getElementById('id-paintColorText');
  const resetBtn = document.getElementById('id-paintReset');
  const info     = document.getElementById('id-paintInfo');

  if (!btn) return;

  function updateInfo() {
    const wallCount = Object.keys(STATE.wallColors || {}).length;
    const ceilingPainted = STATE.ceilingColor && STATE.ceilingColor !== '#ffffff';
    if (STATE.paintMode) {
      info.classList.add('active');
      info.innerHTML = `🖌️ রঙ করুন — দেয়ালে/সিলিং-এ ট্যাপ করুন
        ${wallCount ? `<span id="id-paintCount">${wallCount} দেয়াল</span>` : ''}
        ${ceilingPainted ? `<span id="id-paintCount">সিলিং</span>` : ''}`;
    } else {
      info.classList.remove('active');
      info.innerHTML = '🖌️ পেইন্ট মোড বন্ধ';
    }
    btn.classList.toggle('active-mode', STATE.paintMode);
  }

  // Toggle Paint Mode
  btn.addEventListener('click', () => {
    STATE.paintMode = !STATE.paintMode;
    updateInfo();
    // Visual feedback: change canvas cursor
    const canvas = document.getElementById('id-canvas');
    if (canvas) {
      canvas.style.cursor = STATE.paintMode ? 'crosshair' : 'grab';
    }
    toast(STATE.paintMode
      ? '🎨 পেইন্ট মোড ON — দেয়ালে/সিলিং-এ ট্যাপ করুন'
      : '🎨 পেইন্ট মোড OFF', 'info', 1500);
  });

  // Color picker change
  colorIn?.addEventListener('input', () => {
    STATE.paintColor = colorIn.value;
    if (colorTxt) colorTxt.value = colorIn.value;
  });

  // Hex text change
  colorTxt?.addEventListener('input', () => {
    const v = colorTxt.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      STATE.paintColor = v;
      colorIn.value = v;
    }
  });

  // Reset all painted colors
  resetBtn?.addEventListener('click', () => {
    STATE.wallColors = {};
    STATE.ceilingColor = '#ffffff';
    engine?.rebuildPaint?.();
    updateInfo();
    toast('🧹 সব রঙ মুছে ফেলা হয়েছে', 'success', 1500);
  });

  // Initial
  STATE.paintMode = false;
  STATE.paintColor = colorIn?.value || '#ffffff';
  updateInfo();

  // Expose updater for engine callback
  window.__id_paintUpdate = updateInfo;
})();

// ═══════════════════════════════════════════════
// TILE LIBRARY
// ═══════════════════════════════════════════════
let _libFilter = 'all';

async function refreshTileLibrary() {
  const grid = document.getElementById('id-libGrid');
  const stats = document.getElementById('id-libStats');
  const clearBtn = document.getElementById('id-libClear');
  if (!grid || !window.__id_tilelib) return;

  try {
    const items = await window.__id_tilelib.listTiles(_libFilter);
    const allStats = await window.__id_tilelib.getStats();

    // Update stats
    if (stats) {
      stats.textContent = `${allStats.count} টাইল · ${window.__id_tilelib.fmtSize(allStats.totalSize)}`;
    }
    if (clearBtn) clearBtn.hidden = allStats.count === 0;

    // Render grid
    if (!items.length) {
      grid.innerHTML = `<p class="id-lib-empty">${_libFilter === 'all' ? 'এখনো কোনো টাইল সেভ করা হয়নি।' : 'এই ক্যাটাগরিতে কিছু নেই।'}</p>`;
      return;
    }

    grid.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'id-lib-item';
      div.dataset.id = item.id;

      const badgeLabel = { floor: 'FLR', wall: 'WLL', accent: 'ACC' }[item.surface] || '—';

      div.innerHTML = `
        <img src="${item.thumbnail || ''}" alt="">
        <div class="id-lib-item-badge badge-${item.surface}">${badgeLabel}</div>
        <div class="id-lib-item-name">${item.name}</div>
        <div class="id-lib-item-actions">
          <button class="rename" title="নাম বদলান">✎</button>
          <button class="del" title="ডিলিট">✕</button>
        </div>
      `;

      // Click → apply
      div.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        applyLibraryTile(item);
      });

      // Rename
      div.querySelector('.rename').addEventListener('click', async (e) => {
        e.stopPropagation();
        const newName = prompt('নতুন নাম:', item.name);
        if (!newName || newName === item.name) return;
        try {
          await window.__id_tilelib.renameTile(item.id, newName);
          refreshTileLibrary();
          toast('✏️ নাম বদলানো হয়েছে', 'success', 1200);
        } catch (err) { toast('ব্যর্থ', 'error'); }
      });

      // Delete
      div.querySelector('.del').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`"${item.name}" মুছে ফেলবেন?`)) return;
        try {
          await window.__id_tilelib.deleteTile(item.id);
          refreshTileLibrary();
          toast('🗑️ টাইল মুছে ফেলা হয়েছে', 'success', 1200);
        } catch (err) { toast('ব্যর্থ', 'error'); }
      });

      grid.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="id-lib-empty">লাইব্রেরি লোড ব্যর্থ।</p>';
  }
}

async function applyLibraryTile(item) {
  try {
    const url = window.__id_tilelib.blobToUrl(item.blob);
    // Set on current tab
    const cur = STATE.tiles[STATE.activeTab];
    cur.url = url;
    // Optionally restore size
    if (item.tileW && item.tileH) {
      cur.size.w = item.tileW;
      cur.size.h = item.tileH;
    }
    refreshTileGallery();
    toast(`📚 "${item.name}" প্রয়োগ হয়েছে`, 'success', 1500);
    if (STATE.step === 7) refreshRender(true);
  } catch (e) {
    console.error(e);
    toast('প্রয়োগ ব্যর্থ', 'error');
  }
}

// Tabs
document.querySelectorAll('.id-lib-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.id-lib-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    _libFilter = tab.dataset.libfilter;
    refreshTileLibrary();
  });
});

// Clear all
document.getElementById('id-libClear')?.addEventListener('click', async () => {
  if (!confirm('সব টাইল লাইব্রেরি থেকে মুছে ফেলবেন?')) return;
  try {
    await window.__id_tilelib.clearAll();
    refreshTileLibrary();
    toast('🧹 সব মুছে ফেলা হয়েছে', 'success');
  } catch (e) { toast('ব্যর্থ', 'error'); }
});

// Initial load
setTimeout(() => { refreshTileLibrary(); }, 400);


// ═══════════════════════════════════════════════
// SHARE SYSTEM
// ═══════════════════════════════════════════════
(function initShareSystem() {
  const modal    = document.getElementById('id-shareModal');
  const openBtn  = document.getElementById('id-shareBtn');
  const closeBtn = document.getElementById('id-shareClose');
  const createBtn= document.getElementById('id-shareCreate');
  const result   = document.getElementById('id-shareResult');
  const linkInput= document.getElementById('id-shareLink');
  const copyBtn  = document.getElementById('id-shareCopy');
  const upgrade  = document.getElementById('id-upgradeCTA');
  const upgradeBtn= document.getElementById('id-upgradeBtn');

  if (!modal) return;

  // ───────── PLAN FEATURES ─────────
  const PLAN_FEATURES = {
    free: {
      shareExpiryDays: 30,
      sharesPerMonth: 3,
      allowClone: false,
      allowHD: false,
      allowQR: false,
      allowPassword: false,
      allowBranding: false
    },
    pro: {
      shareExpiryDays: null,
      sharesPerMonth: Infinity,
      allowClone: true,
      allowHD: true,
      allowQR: true,
      allowPassword: true,
      allowBranding: true
    }
  };

  function currentPlan() {
    return STATE.userPlan || 'free';
  }
  function can(feature) {
    return PLAN_FEATURES[currentPlan()][feature] === true ||
           PLAN_FEATURES[currentPlan()][feature] === Infinity ||
           PLAN_FEATURES[currentPlan()][feature] > 0;
  }

  // ───────── LOAD PLAN FROM LOCALSTORAGE ─────────
  try {
    const saved = JSON.parse(localStorage.getItem('id_plan') || '{}');
    if (saved.plan) STATE.userPlan = saved.plan;
    if (saved.expiresAt) STATE.planExpiresAt = saved.expiresAt;
    if (saved.priceMonthly) STATE.proPriceMonthly = saved.priceMonthly;
    if (saved.priceYearly) STATE.proPriceYearly = saved.priceYearly;
    if (saved.shares !== undefined) STATE.sharesThisMonth = saved.shares;
    if (saved.resetAt) STATE.monthResetAt = saved.resetAt;
  } catch(e) {}

  function savePlanLocal() {
    localStorage.setItem('id_plan', JSON.stringify({
      plan: STATE.userPlan,
      expiresAt: STATE.planExpiresAt,
      priceMonthly: STATE.proPriceMonthly,
      priceYearly: STATE.proPriceYearly,
      shares: STATE.sharesThisMonth,
      resetAt: STATE.monthResetAt
    }));
  }

  // ───────── MONTHLY RESET ─────────
  function checkMonthlyReset() {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (!STATE.monthResetAt || now - STATE.monthResetAt > thirtyDays) {
      STATE.sharesThisMonth = 0;
      STATE.monthResetAt = now;
      savePlanLocal();
    }
  }

  // ───────── UPDATE UI ─────────
  function updatePlanUI() {
    checkMonthlyReset();
    const plan = currentPlan();
    const badge = document.getElementById('id-planBadge');
    const usage = document.getElementById('id-planUsage');
    const priceEl = document.getElementById('id-proPriceDisplay');
    const expiryProTag = document.getElementById('id-expiryProTag');
    const pwdProTag = document.getElementById('id-passwordProTag');
    const cloneRow = document.getElementById('id-cloneRow');
    const hdRow = document.getElementById('id-hdRow');
    const brandingRow = document.getElementById('id-brandingRow');
    const qrBtn = document.getElementById('id-shareQR');

    // Badge
    if (plan === 'pro') {
      badge.className = 'id-plan-badge pro';
      badge.textContent = '💎 Pro Plan';
      usage.textContent = 'আনলিমিটেড শেয়ার';
    } else {
      badge.className = 'id-plan-badge free';
      badge.textContent = '🆓 Free Plan';
      const remaining = Math.max(0, PLAN_FEATURES.free.sharesPerMonth - STATE.sharesThisMonth);
      usage.textContent = `${remaining}টি শেয়ার বাকি`;
    }

    // Price display (admin set or default)
    if (priceEl) priceEl.textContent = `৳${STATE.proPriceMonthly}/মাস`;

    // Pro tags — hide if user is already Pro
    if (plan === 'pro') {
      if (expiryProTag) expiryProTag.hidden = true;
      if (pwdProTag) pwdProTag.hidden = true;
      if (cloneRow) cloneRow.classList.remove('id-check-locked');
      if (hdRow) hdRow.classList.remove('id-check-locked');
      if (brandingRow) brandingRow.classList.remove('id-check-locked');
      const cloneCb = document.getElementById('id-permClone');
      const hdCb = document.getElementById('id-permHD');
      const brandCb = document.getElementById('id-permBranding');
      if (cloneCb) { cloneCb.disabled = false; cloneCb.checked = true; }
      if (hdCb)    { hdCb.disabled = false; hdCb.checked = true; }
      if (brandCb) { brandCb.disabled = false; brandCb.checked = true; }
      if (qrBtn) qrBtn.disabled = false;
      if (upgrade) upgrade.hidden = true;
    } else {
      if (expiryProTag) expiryProTag.hidden = false;
      if (pwdProTag) pwdProTag.hidden = false;
      if (cloneRow) cloneRow.classList.add('id-check-locked');
      if (hdRow) hdRow.classList.add('id-check-locked');
      if (brandingRow) brandingRow.classList.add('id-check-locked');
      const cloneCb = document.getElementById('id-permClone');
      const hdCb = document.getElementById('id-permHD');
      const brandCb = document.getElementById('id-permBranding');
      if (cloneCb) { cloneCb.disabled = true; cloneCb.checked = false; }
      if (hdCb)    { hdCb.disabled = true; hdCb.checked = false; }
      if (brandCb) { brandCb.disabled = true; brandCb.checked = false; }
      if (qrBtn) qrBtn.disabled = true;
      if (upgrade) upgrade.hidden = false;
    }
  }

  // ───────── OPEN / CLOSE MODAL ─────────
  openBtn?.addEventListener('click', () => {
    if (!adminId) {
      toast('প্রথমে লগইন করুন', 'error');
      return;
    }
    modal.hidden = false;
    modal.style.display = 'flex';
    result.hidden = true;
    updatePlanUI();
  });

  function closeModal() {
    modal.hidden = true;
    modal.style.display = 'none';
  }
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ───────── GENERATE SHARE ID ─────────
  function generateShareId() {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let id = '';
    for (let i = 0; i < 12; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }

  // ───────── CHECK SHARE LIMIT ─────────
  function canCreateShare() {
    const plan = currentPlan();
    if (plan === 'pro') return { ok: true };
    if (STATE.sharesThisMonth >= PLAN_FEATURES.free.sharesPerMonth) {
      return { ok: false, msg: `এই মাসের ${PLAN_FEATURES.free.sharesPerMonth}টি শেয়ার শেষ। Pro নিন আনলিমিটেডের জন্য।` };
    }
    return { ok: true };
  }

  // ───────── CREATE SHARE ─────────
  createBtn?.addEventListener('click', async () => {
    const limit = canCreateShare();
    if (!limit.ok) {
      toast(limit.msg, 'error', 4000);
      return;
    }

    if (!window.__id_fs || !window.__id_db) {
      toast('Firebase প্রস্তুত নেই', 'error');
      return;
    }

    createBtn.disabled = true;
    createBtn.textContent = '⏳ তৈরি হচ্ছে...';

    try {
      const shareId = generateShareId();
      const plan = currentPlan();

      // Expiry
      const expiryVal = document.getElementById('id-shareExpiry')?.value || '30';
      let expiresAt = null;
      if (expiryVal !== 'never') {
        expiresAt = new Date(Date.now() + parseInt(expiryVal) * 86400000).toISOString();
      }

      // Password
      const pwd = document.getElementById('id-sharePassword')?.value?.trim() || null;

      // Permissions
      const perms = {
        rotate: document.getElementById('id-permRotate')?.checked ?? true,
        colorView: document.getElementById('id-permColor')?.checked ?? false,
        clone: plan === 'pro' ? (document.getElementById('id-permClone')?.checked ?? false) : false,
        hd: plan === 'pro' ? (document.getElementById('id-permHD')?.checked ?? false) : false,
        branding: plan === 'pro' ? (document.getElementById('id-permBranding')?.checked ?? false) : false
      };

      // Snapshot of the design
      const snapshot = {
        room: STATE.room,
        shape: STATE.shape,
        customPoints: STATE.customPoints,
        structure: STATE.structure,
        surfaces: STATE.surfaces,
        tiles: STATE.tiles,
        furniture: STATE.furniture,
        outside: STATE.outside,
        lightMode: STATE.lightMode,
        cameraView: STATE.cameraView,
        paverMode: STATE.paverMode,
        paver: STATE.paver,
        skirting: STATE.skirting,
        wallColors: STATE.wallColors,
        ceilingColor: STATE.ceilingColor
      };

      const { collection, doc, setDoc, serverTimestamp } = window.__id_fs;
      const db = window.__id_db;

      const shareDoc = {
        shareId,
        ownerId: adminId,
        snapshot,
        permissions: perms,
        password: pwd,
        expiresAt,
        isPublic: true,
        viewCount: 0,
        cloneCount: 0,
        plan: plan,          // record which plan created it
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'sharedDesigns', shareId), shareDoc);

      // Update local count
      STATE.sharesThisMonth += 1;
      savePlanLocal();
      updatePlanUI();

      // Build URL
      const baseUrl = location.origin + location.pathname;
      const shareUrl = `${baseUrl}?view=${shareId}`;

      linkInput.value = shareUrl;
      result.hidden = false;

      const meta = document.getElementById('id-shareMeta');
      if (meta) {
        const expTxt = expiresAt
          ? `⏰ ${new Date(expiresAt).toLocaleDateString('bn-BD')} পর্যন্ত`
          : '∞ চিরস্থায়ী';
        meta.textContent = `${expTxt} · 🔒 ${pwd ? 'পাসওয়ার্ড সুরক্ষিত' : 'পাবলিক'}`;
      }

      toast('✅ শেয়ার লিংক তৈরি হয়েছে', 'success');

    } catch (err) {
      console.error(err);
      toast('❌ লিংক তৈরি ব্যর্থ: ' + err.message, 'error', 4000);
    } finally {
      createBtn.disabled = false;
      createBtn.textContent = '🔗 শেয়ার লিংক তৈরি করুন';
    }
  });

  // ───────── COPY LINK ─────────
  copyBtn?.addEventListener('click', async () => {
    const txt = linkInput.value;
    if (!txt) return;
    try {
      await navigator.clipboard.writeText(txt);
      copyBtn.classList.add('copied');
      copyBtn.textContent = '✓';
      toast('📋 লিংক কপি হয়েছে', 'success', 1500);
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.textContent = '📋';
      }, 2000);
    } catch (e) {
      linkInput.select();
      document.execCommand('copy');
      toast('📋 লিংক কপি হয়েছে', 'success', 1500);
    }
  });

  // ───────── QUICK SHARE ─────────
  document.getElementById('id-shareWhatsapp')?.addEventListener('click', () => {
    const url = linkInput.value;
    if (!url) return;
    const text = encodeURIComponent(`আমার ইন্টেরিয়র ডিজাইন দেখুন 🎨\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  });

  document.getElementById('id-shareEmail')?.addEventListener('click', () => {
    const url = linkInput.value;
    if (!url) return;
    const sub = encodeURIComponent('Interior Design Share');
    const body = encodeURIComponent(`আমার ইন্টেরিয়র ডিজাইন দেখুন:\n${url}`);
    location.href = `mailto:?subject=${sub}&body=${body}`;
  });

  document.getElementById('id-shareQR')?.addEventListener('click', () => {
    if (!can('allowQR')) {
      toast('💎 QR কোড Pro ফিচার', 'error', 2500);
      return;
    }
    toast('QR কোড শীঘ্রই আসছে', 'info', 2000);
  });

  // ───────── UPGRADE BUTTON ─────────
  upgradeBtn?.addEventListener('click', () => {
    toast('💎 Payment integration শীঘ্রই আসছে', 'info', 3000);
    // Future: open payment flow
  });

  // ───────── FETCH ADMIN PRICE (Firestore settings/pricing) ─────────
  setTimeout(async () => {
    if (!window.__id_db || !window.__id_fs) return;
    try {
      const { doc, getDoc } = window.__id_fs;
      const db = window.__id_db;
      const snap = await getDoc(doc(db, 'settings', 'pricing'));
      if (snap.exists()) {
        const data = snap.data();
        if (data.proMonthly) STATE.proPriceMonthly = data.proMonthly;
        if (data.proYearly)  STATE.proPriceYearly  = data.proYearly;
        savePlanLocal();
        updatePlanUI();
      }
    } catch (e) {
      // ignore — settings doc may not exist
    }
  }, 2000);

  // Expose
  window.__id_shareSystem = { open: () => openBtn?.click(), updatePlanUI };
})();
showStep(1);
