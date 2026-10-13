/* ============================================================
   Interior Design Studio — id-tile-library.js
   IndexedDB-based Tile Storage (Save cropped tiles)
   ============================================================ */

const DB_NAME = 'id_tile_library';
const DB_VERSION = 1;
const STORE_NAME = 'tiles';

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('savedAt', 'savedAt', { unique: false });
        store.createIndex('surface', 'surface', { unique: false });
      }
    };
  });
}

// ───────── Save tile ─────────
export async function saveTile({ blob, name, surface, tileW, tileH }) {
  const db = await openDB();
  const id = 'tile_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  // Generate thumbnail
  const thumb = await makeThumbnail(blob);
  const record = {
    id,
    name: name || `Tile ${new Date().toLocaleString('bn-BD')}`,
    surface: surface || 'floor',
    tileW: tileW || 600,
    tileH: tileH || 600,
    blob,
    thumbnail: thumb,     // data URL
    size: blob.size,
    savedAt: Date.now()
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const st = tx.objectStore(STORE_NAME);
    const req = st.add(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

// ───────── List all tiles ─────────
export async function listTiles(filter = null) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const st = tx.objectStore(STORE_NAME);
    const req = st.getAll();
    req.onsuccess = () => {
      let items = req.result || [];
      items.sort((a, b) => b.savedAt - a.savedAt);
      if (filter && filter !== 'all') {
        items = items.filter(t => t.surface === filter);
      }
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

// ───────── Get single ─────────
export async function getTile(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const st = tx.objectStore(STORE_NAME);
    const req = st.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ───────── Delete ─────────
export async function deleteTile(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const st = tx.objectStore(STORE_NAME);
    const req = st.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ───────── Rename ─────────
export async function renameTile(id, newName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const st = tx.objectStore(STORE_NAME);
    const getReq = st.get(id);
    getReq.onsuccess = () => {
      const rec = getReq.result;
      if (!rec) return reject(new Error('Not found'));
      rec.name = newName;
      const putReq = st.put(rec);
      putReq.onsuccess = () => resolve(rec);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

// ───────── Clear all ─────────
export async function clearAll() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const st = tx.objectStore(STORE_NAME);
    const req = st.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ───────── Storage stats ─────────
export async function getStats() {
  const items = await listTiles();
  const totalSize = items.reduce((sum, t) => sum + (t.size || 0), 0);
  return { count: items.length, totalSize };
}

// ───────── Thumbnail generator ─────────
function makeThumbnail(blob, maxSize = 200) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const cvs = document.createElement('canvas');
      cvs.width = w; cvs.height = h;
      const ctx = cvs.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(cvs.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

// ───────── Convert blob to object URL (for preview) ─────────
export function blobToUrl(blob) {
  return URL.createObjectURL(blob);
}

// ───────── Format size ─────────
export function fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Expose globally
if (typeof window !== 'undefined') {
  window.__id_tilelib = {
    saveTile, listTiles, getTile, deleteTile,
    renameTile, clearAll, getStats, fmtSize
  };
}
