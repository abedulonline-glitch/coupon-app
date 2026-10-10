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
  activeSub: 'furniture', // step 6 subtab
  furniture: [],          // {id, x, y, z, rot, color}
  outside:   { id: 'out-day' },
  lightMode: 'day',
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
  $$('.id-step').forEach((el, i) => {
    el.hidden = (i + 1) !== n;
  });
  $('#id-progressBar').style.width = `${(n / STATE.maxStep) * 100}%`;
  $('#id-progressText').textContent = `Step ${n} / ${STATE.maxStep}`;
  $('#id-prevBtn').disabled = (n === 1);

  if (n === STATE.maxStep) {
    initEngine();
    refreshRender();
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

function buildStructureSVG() {
  const svg = $('#id-structSvg');
  svg.innerHTML = '';
  const W = 600, H = 400;
  // background floor
  const floor = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  floor.setAttribute('x', 40); floor.setAttribute('y', 40);
  floor.setAttribute('width', W - 80);
  floor.setAttribute('height', H - 80);
  floor.classList.add('floor');
  svg.appendChild(floor);
  // walls
  const wall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  wall.setAttribute('x', 40); wall.setAttribute('y', 40);
  wall.setAttribute('width', W - 80);
  wall.setAttribute('height', H - 80);
  wall.setAttribute('fill', 'none');
  wall.setAttribute('stroke', '#4f8cff');
  wall.setAttribute('stroke-width', 3);
  svg.appendChild(wall);
  // render existing structure
  STATE.structure.forEach((s, i) => drawStructIcon(s, i));
}

function drawStructIcon(s, idx) {
  const svg = $('#id-structSvg');
  const x = s.x, y = s.y;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let el;
  if (s.type === 'door') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', x - 18); el.setAttribute('y', y - 4);
    el.setAttribute('width', 36); el.setAttribute('height', 8);
  } else if (s.type === 'window') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', x - 22); el.setAttribute('y', y - 4);
    el.setAttribute('width', 44); el.setAttribute('height', 8);
  } else if (s.type === 'stairs') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', x - 20); el.setAttribute('y', y - 20);
    el.setAttribute('width', 40); el.setAttribute('height', 40);
  } else if (s.type === 'pillar') {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', x); el.setAttribute('cy', y);
    el.setAttribute('r', 10);
  }
  el.classList.add(s.type);
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    STATE.structure.splice(idx, 1);
    buildStructureSVG();
  });
  g.appendChild(el);
  svg.appendChild(g);
}

$('#id-structSvg')?.addEventListener('click', (e) => {
  if (!activeTool) return;
  const svg = $('#id-structSvg');
  const rect = svg.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width  * 600;
  const y = (e.clientY - rect.top)  / rect.height * 400;
  if (x < 40 || x > 560 || y < 40 || y > 360) return;
  if (activeTool === 'erase') {
    STATE.structure = STATE.structure.filter(s => Math.hypot(s.x - x, s.y - y) > 25);
    buildStructureSVG(); return;
  }
  STATE.structure.push({ type: activeTool, x, y, rot: 0 });
  buildStructureSVG();
});
buildStructureSVG();

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

function openCrop(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const modal = $('#id-cropModal');
    const img   = $('#id-cropImg');
    modal.hidden = false;
    modal.style.display = 'flex';   // ← এই লাইনটাই আগে ছিল না
    img.src = e.target.result;
    if (cropper) { cropper.destroy(); cropper = null; }
    cropper = new Cropper(img, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 1
    });
  };
  reader.readAsDataURL(file);
}

$('#id-cropCancel')?.addEventListener('click', () => {
  if (cropper) { cropper.destroy(); cropper = null; }
  $('#id-cropModal').hidden = true;
  $('#id-cropModal').style.display = 'none';
});
$('#id-cropOk')?.addEventListener('click', async () => {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas({ width: 1024, height: 1024 });
  const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92));
  const url  = await uploadToImgBB(blob);
  if (cropper) { cropper.destroy(); cropper = null; }
  $('#id-cropModal').hidden = true;
  $('#id-cropModal').style.display = 'none';
  if (url) { setTile(url); toast('আপলোড হয়েছে', 'success'); }
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
    gallery.innerHTML = '<p class="id-empty">এখনো কোনো টাইল যোগ করা হয়নি।</p>';
    $('#id-tileSizePanel').hidden = true;
    return;
  }
  const div = document.createElement('div');
  div.className = 'id-gallery-item selected';
  div.innerHTML = `<img src="${cur.url}" alt=""><div class="id-item-label">বর্তমান</div>`;
  gallery.appendChild(div);
  $('#id-tileSizePanel').hidden = false;
  $('#id-tileW').value = cur.size.w;
  $('#id-tileH').value = cur.size.h;
  $('#id-tileRot').value = cur.rot;
  $('#id-tileRotVal').textContent = cur.rot + '°';
  $('#id-grout').value = cur.grout;
  $('#id-groutVal').textContent = cur.grout + 'mm';
  if ($('#id-tileOffsetX')) {
    $('#id-tileOffsetX').value = cur.offsetX || 0;
    $('#id-tileOffXVal').textContent = (cur.offsetX || 0) + 'mm';
  }
  if ($('#id-tileOffsetY')) {
    $('#id-tileOffsetY').value = cur.offsetY || 0;
    $('#id-tileOffYVal').textContent = (cur.offsetY || 0) + 'mm';
  }
}
refreshTileGallery();

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
  } else if (s.type === 'pillar') {
    html += row('ব্যাসার্ধ (m)', 'radius', p.radius, 0.05, 1, 0.01);
    html += row('X অফসেট (m)', 'offsetX', p.offsetX || 0, -5, 5, 0.05);
    html += row('Z অফসেট (m)', 'offsetZ', p.offsetZ || 0, -5, 5, 0.05);
  } else if (s.type === 'stairs') {
    html += row('ধাপ সংখ্যা', 'steps', p.steps, 2, 30, 1);
    html += row('প্রস্থ (m)', 'width', p.width, 0.5, 3, 0.05);
    html += row('প্রতিটি ধাপের গভীরতা (m)', 'depth', p.depth || 0.28, 0.15, 0.6, 0.01);
    html += selectRow('মেটেরিয়াল', 'materialSource', p.materialSource || 'solid', [
      ['solid', 'সাদামাটা (ধূসর)'],
      ['floor', '🟫 ফ্লোর টাইল/গ্রানাইট'],
      ['wall',  '🧱 ওয়াল টাইল']
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
showStep(1);
