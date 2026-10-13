/* ============================================================
   Interior Design Studio — id-viewer.js
   Viewer Mode: ?view=SHAREID
   ============================================================ */

const params   = new URLSearchParams(location.search);
const shareId  = params.get('view');

if (shareId) {
  startViewer(shareId);
}

async function startViewer(id) {
  // Hide main app immediately
  const mainApp = document.getElementById('id-app');
  if (mainApp) mainApp.style.display = 'none';

  const viewerEl = document.getElementById('id-viewerMode');
  if (!viewerEl) return;
  viewerEl.hidden = false;

  const loading = document.getElementById('id-vmLoading');
  const errorEl = document.getElementById('id-vmError');
  const errMsg  = document.getElementById('id-vmErrorMsg');
  const hintEl  = document.getElementById('id-vmHints');

  try {
    // Wait for Firebase to be ready
    let tries = 0;
    while (!window.__id_db && tries < 40) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }
    if (!window.__id_db) throw new Error('Firebase প্রস্তুত নয়');

    // Fetch shared design
    const { doc, getDoc, updateDoc } = window.__id_fs;
    const snap = await getDoc(doc(window.__id_db, 'sharedDesigns', id));

    if (!snap.exists()) throw new Error('লিংক পাওয়া যায়নি বা মুছে ফেলা হয়েছে');

    const data = snap.data();

    // Expiry check
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      throw new Error('⏰ লিংকটির মেয়াদ শেষ');
    }

    // Password check
    if (data.password) {
      const ok = await promptPassword(data.password);
      if (!ok) return;
    }

    // Update title
    const titleEl = document.getElementById('id-vmTitle');
    if (titleEl) titleEl.textContent = 'ইন্টেরিয়র ডিজাইন';
    const subEl = document.getElementById('id-vmSubtitle');
    if (subEl) subEl.textContent = data.snapshot?.room?.type
      ? `🏠 ${data.snapshot.room.type} · ${data.snapshot.room.length}×${data.snapshot.room.width} ft`
      : 'শেয়ার করা ডিজাইন';

    // Meta
    document.getElementById('id-vmViews').textContent  = '👁️ ' + (data.viewCount || 0);
    document.getElementById('id-vmClones').textContent = '💾 ' + (data.cloneCount || 0);

    // Hint based on permissions
    if (hintEl) {
      const p = data.permissions || {};
      let h = '🖱️ ড্র্যাগ করে ঘোরান · 🔍 স্ক্রল দিয়ে জুম';
      if (p.allowHD) h += ' · 📸 HD রেন্ডার চালু';
      hintEl.textContent = h;
    }

    // Clone button
    const cloneBtn = document.getElementById('id-vmClone');
    if (cloneBtn && data.permissions?.clone) {
      cloneBtn.hidden = false;
      cloneBtn.addEventListener('click', () => cloneToMyAccount(id, data));
    }

    // Screenshot
    document.getElementById('id-vmScreenshot')?.addEventListener('click', () => {
      const canvas = document.getElementById('id-vmCanvas');
      if (!canvas) return;
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `design-${id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    });

    // Fullscreen
    document.getElementById('id-vmFullscreen')?.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    });

    // Error button
    document.getElementById('id-vmErrorBtn')?.addEventListener('click', () => {
      location.href = location.origin + location.pathname;
    });

    // ────── INIT 3D ENGINE (readonly) ──────
    const canvas = document.getElementById('id-vmCanvas');
    const { InteriorEngine } = await import('./id-render-engine.js');

    const engine = new InteriorEngine(canvas);
    engine.startLive();

    // Disable edit interactions
    engine.transform.detach();
    engine.transform.enabled = false;

    // Render the snapshot
    await engine.render(data.snapshot);

    // Hide loading
    if (loading) loading.hidden = true;

    // Increment view count (fire and forget)
    try {
      await updateDoc(doc(window.__id_db, 'sharedDesigns', id), {
        viewCount: (data.viewCount || 0) + 1
      });
    } catch (e) { /* permission may block */ }

    // Expose for debugging
    window.__id_viewerEngine = engine;
    window.__id_viewerData = data;

  } catch (err) {
    console.error(err);
    if (loading) loading.hidden = true;
    if (errMsg) errMsg.textContent = err.message || 'লিংক কাজ করছে না';
    if (errorEl) errorEl.hidden = false;
  }
}

// ─────────────────────────────────────────────
// PASSWORD PROMPT
// ─────────────────────────────────────────────
function promptPassword(realPwd) {
  return new Promise(resolve => {
    const modal = document.getElementById('id-vmPasswordModal');
    const input = document.getElementById('id-vmPasswordInput');
    const submit= document.getElementById('id-vmPasswordSubmit');
    const errEl = document.getElementById('id-vmPasswordError');
    if (!modal) return resolve(false);
    modal.hidden = false;
    input.value = '';
    input.focus();
    errEl.hidden = true;

    function check() {
      if (input.value === realPwd) {
        modal.hidden = true;
        resolve(true);
      } else {
        errEl.hidden = false;
        input.value = '';
        input.focus();
      }
    }
    submit.onclick = check;
    input.onkeydown = (e) => { if (e.key === 'Enter') check(); };
  });
}

// ─────────────────────────────────────────────
// CLONE to viewer's own account
// ─────────────────────────────────────────────
async function cloneToMyAccount(shareId, shareData) {
  // Auth check
  let tries = 0;
  while (!window.__id_auth && tries < 40) {
    await new Promise(r => setTimeout(r, 100));
    tries++;
  }
  if (!window.__id_auth) {
    alert('ক্লোন করতে লগইন করুন');
    location.href = './beta.html';
    return;
  }

  const user = window.__id_auth.currentUser;
  if (!user) {
    alert('ক্লোন করতে লগইন করুন');
    location.href = './beta.html';
    return;
  }

  if (!confirm('আপনার অ্যাকাউন্টে ক্লোন করবেন?')) return;

  try {
    const { collection, addDoc, doc, updateDoc, serverTimestamp } = window.__id_fs;
    const db = window.__id_db;

    const cloned = {
      ...shareData.snapshot,
      adminId: user.uid,
      clonedFrom: shareId,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp()
    };
    await addDoc(collection(db, 'interiorDesigns'), cloned);

    // Update clone count (fire and forget)
    try {
      await updateDoc(doc(db, 'sharedDesigns', shareId), {
        cloneCount: (shareData.cloneCount || 0) + 1
      });
    } catch (e) {}

    alert('✅ ক্লোন হয়েছে! এখন আপনার ডিজাইন লিস্টে পাবেন।');
    location.href = location.origin + location.pathname;
  } catch (err) {
    console.error(err);
    alert('❌ ক্লোন ব্যর্থ: ' + err.message);
  }
}
