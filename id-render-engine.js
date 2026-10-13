/* ============================================================
   INTERIOR DESIGN STUDIO — id-render-engine.js (v5)
   PART 1 of 2
   ============================================================ */

import * as THREE from 'three';
import { RoomEnvironment }   from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls }     from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFLoader }        from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer }    from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }        from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass }          from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass }   from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass }          from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass }        from 'three/addons/postprocessing/OutputPass.js';
import { RGBELoader }        from 'three/addons/loaders/RGBELoader.js';
import { PAVERS, buildShape, generateLayout, calcBlockCount } from './id-paver-library.js';

const FT  = 0.3048;
const MM = 0.001;
const DEG = Math.PI / 180;

function lerpColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  const c = ca.clone().lerp(cb, Math.max(0, Math.min(1, t)));
  return '#' + c.getHexString();
}

class InteriorEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = null; this.scene = null; this.camera = null;
    this.controls = null; this.transform = null;
    this.composer = null; this.ssaoPass = null; this.bloomPass = null; this.smaaPass = null;
    this.roomGroup = null; this.furnitureGrp = null; this.structGrp = null;
    this.lights = []; this.currentState = null;
    this.envTexture = null; this.animating = false;
    this.selected = null; this.selectedStruct = null;
    this.structLabels = []; this._dimLoop = null;
    this._roomBounds = null; this._roomCenter = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.transformMode = 'translate';
    this._hdCanvas = null;
    this.tileMeshes = [];
    this.paverGroup = null; 
    this.paverMeshes = [];
    this.paintGroup = null;
    this._wallMeshes = [];  // reference to wall meshes with wallIndex 
    this._paverRaycaster = new THREE.Raycaster();
    this._paverPointer = new THREE.Vector2();
    this._lastPaverClick = null; 
    this.selectedTile = null;
    this._tileLongPressTimer = null; 
    this._onDown = this._onDown.bind(this);
    this._onContext = this._onContext.bind(this);
    this._onKey = this._onKey.bind(this);
    this._init();
  }

   // ═══════════════════════════════════════════════
  // INDIVIDUAL TILE MODE
  // ═══════════════════════════════════════════════
  _buildIndividualTiles(surface, tileState, roomW, roomH, meshName) {
    const baseMesh = this.roomGroup.getObjectByName(meshName);
    if (!baseMesh) return;
    baseMesh.visible = false;

    const tileW = (tileState.size?.w || 600) / 1000;
    const tileH = (tileState.size?.h || 600) / 1000;
    const grout = (tileState.grout || 2) / 1000;
    const groutW = tileW - grout;
    const groutH = tileH - grout;

    const cols = Math.ceil(roomW / tileW);
    const rows = Math.ceil(roomH / tileH);

    const tex = baseMesh.material?.map;
    const baseColor = baseMesh.material?.color?.clone() || new THREE.Color(0xffffff);

    const grp = new THREE.Group();
    grp.name = `individual-${surface}`;

    const globalRot = (tileState.rot || 0);
    const individualMap = tileState.individual || {};

    // ▶ Room boundary polygon (from ShapeGeometry vertices)
    const roomPts = this._roomBounds?.pts || [];

    const insideRoom = (px, pz) => {
      if (!roomPts.length) return true;
      let inside = false;
      for (let i = 0, j = roomPts.length - 1; i < roomPts.length; j = i++) {
        const xi = roomPts[i].x, zi = roomPts[i].y;
        const xj = roomPts[j].x, zj = roomPts[j].y;
        const intersect = ((zi > pz) !== (zj > pz)) &&
                          (px < (xj - xi) * (pz - zi) / (zj - zi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = -roomW/2 + tileW/2 + c * tileW;
        const pz = -roomH/2 + tileH/2 + r * tileH;

        // ▶ Only add tile if center is inside room polygon
        if (!insideRoom(px, pz)) continue;

        const key = `${r},${c}`;
        const rot = individualMap[key] != null ? individualMap[key] : globalRot;

        const geo = new THREE.PlaneGeometry(groutW, groutH);
        const mat = new THREE.MeshStandardMaterial({
          map: tex ? tex.clone() : null,
          color: baseColor,
          roughness: 0.35,
          metalness: 0.08,
          side: THREE.DoubleSide
        });
        if (mat.map) {
          mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.repeat.set(1, 1);
          mat.map.offset.set(0, 0);
          mat.map.center.set(0.5, 0.5);
          mat.map.rotation = rot * DEG;
          mat.map.needsUpdate = true;
        }

        const m = new THREE.Mesh(geo, mat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(px, 0.001, pz);
        m.receiveShadow = true;
        m.userData.gridR = r;
        m.userData.gridC = c;
        m.userData.surface = surface;
        m.userData.isTile = true;
        grp.add(m);
        this.tileMeshes.push(m);
      }
    }

    this.roomGroup.add(grp);
  }

  highlightTile(r, c, surface) {
    this.clearTileSelection();
    const m = this.tileMeshes.find(t =>
      t.userData.gridR === r && t.userData.gridC === c && t.userData.surface === surface
    );
    if (m) {
      this.selectedTile = m;
      // Add outline
      const edges = new THREE.EdgesGeometry(m.geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x2ecc71, linewidth: 3
      }));
      line.position.copy(m.position);
      line.rotation.copy(m.rotation);
      line.scale.setScalar(1.05);
      line.name = 'tile-selection-outline';
      this.roomGroup.add(line);
    }
  }

  clearTileSelection() {
    this.selectedTile = null;
    const old = this.roomGroup.getObjectByName('tile-selection-outline');
    if (old) this.roomGroup.remove(old);
  }

  _onTilePointerDown(e) {
    // Only in individual mode + step 7
    const st = this.currentState?.tiles?.[this.currentState?.activeTab || 'floor'];
    if (!st?.individualMode) return false;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hits = this.raycaster.intersectObjects(this.tileMeshes, false);
    if (!hits.length) return false;

    const m = hits[0].object;
    const surface = m.userData.surface;
    const r = m.userData.gridR;
    const c = m.userData.gridC;

    // Start long-press timer for mobile
    if (this._tileLongPressTimer) clearTimeout(this._tileLongPressTimer);
    const startX = e.clientX, startY = e.clientY;
    this._tileLongPressTimer = setTimeout(() => {
      window.__id_onTileRotate?.(surface, r, c);
      this._tileLongPressTimer = null;
    }, 550);

    // Register click handlers
    const onUp = (ev) => {
      if (this._tileLongPressTimer) {
        clearTimeout(this._tileLongPressTimer);
        this._tileLongPressTimer = null;
      }
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if (Math.hypot(dx, dy) < 8) {
        // Real click (not drag)
        window.__id_onTileClick?.(surface, r, c);
      }
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointerup', onUp, { once: true });

    // Double-click detection
    const now = Date.now();
    if (this._lastTileClick &&
        this._lastTileClick.r === r &&
        this._lastTileClick.c === c &&
        now - this._lastTileClick.t < 400) {
      window.__id_onTileRotate?.(surface, r, c);
      this._lastTileClick = null;
      return true; // consumed
    }
    this._lastTileClick = { r, c, t: now };

    return true; // consumed
  }
   
   _init() {
    const { canvas } = this;
    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
   this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 0.62;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0f1117');

    this.camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.05, 500);
    this.camera.position.set(8, 6, 12);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 60;
    this.controls.maxPolarAngle = Math.PI * 0.495;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.envTexture;

    this.roomGroup = new THREE.Group();
    this.furnitureGrp = new THREE.Group();
    this.scene.add(this.roomGroup, this.furnitureGrp);

    this.transform = new TransformControls(this.camera, canvas);
    this.transform.setSize(0.7);
    this.transform.addEventListener('dragging-changed', (e) => {
      this.controls.enabled = !e.value;
      if (!e.value && this.selected) this._commitTransform();
    });
    this.scene.add(this.transform);

    canvas.addEventListener('pointerdown', this._onDown);
    canvas.addEventListener('contextmenu', this._onContext);
    window.addEventListener('keydown', this._onKey);

    const ro = new ResizeObserver(() => this._onResize());
    ro.observe(canvas.parentElement);

    this._setupPostFX();
    this._onResize();
  }

   _setupPostFX() {
    const wrap = this.canvas.parentElement;
    const w = wrap.clientWidth || 800;
    const h = wrap.clientHeight || 600;

    this.composer = new EffectComposer(this.renderer);
    const pr = Math.min(window.devicePixelRatio, 2);
    this.composer.setPixelRatio(pr);
    this.composer.setSize(w, h);

    this.composer.addPass(new RenderPass(this.scene, this.camera));

    try {
      this.ssaoPass = new SSAOPass(this.scene, this.camera, w, h);
      this.ssaoPass.output = SSAOPass.OUTPUT.Default;
      this.composer.addPass(this.ssaoPass);
    } catch (err) {
      console.warn('SSAO unavailable:', err);
      this.ssaoPass = null;
    }

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.06, 0.4, 0.92);
    this.composer.addPass(this.bloomPass);

    this.smaaPass = new SMAAPass(w, h);
    this.composer.addPass(this.smaaPass);

       const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
 
       if (this.renderer.toneMapping === THREE.NoToneMapping) {
      // OutputPass নিজেই ACES করে — renderer এটা করবে না
      this.renderer.toneMapping = THREE.NoToneMapping;
    }
   
   }

   async loadHDRI(url) {
    const loader = new RGBELoader();
    loader.setCrossOrigin('anonymous');
    return new Promise((resolve, reject) => {
      loader.load(url, (hdr) => {
        hdr.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(this.renderer);
        const envMap = pmrem.fromEquirectangular(hdr).texture;
        this.scene.environment = envMap;
        this.scene.background = envMap;
        if ('environmentIntensity' in this.scene) this.scene.environmentIntensity = 0.35;
        hdr.dispose(); pmrem.dispose();
        resolve(envMap);
      }, undefined, reject);
    });
  }

  _onResize() {
    const wrap = this.canvas.parentElement;
    if (!wrap) return;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.composer.setSize(w, h);
      if (this.ssaoPass)  this.ssaoPass.setSize(w, h);
      if (this.bloomPass) this.bloomPass.setSize(w, h);
      if (this.smaaPass)  this.smaaPass.setSize(w, h);
    }
    this._renderOnce();
  }

  // ---------- SELECTION ----------
  _onDown(e) {
    if (this.transform.dragging) return;
    // PAINT MODE — highest priority
    if (window.__id_isPaintMode?.()) {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      // Collect wall meshes (only visible ones)
      const wallTargets = (this._wallMeshes || []).filter(w => w.visible);
      const ceilingMesh = this.roomGroup.getObjectByName('ceiling');

      // Combine targets
      const targets = wallTargets.slice();
      if (ceilingMesh && ceilingMesh.visible) targets.push(ceilingMesh);

      if (targets.length) {
        const hits = this.raycaster.intersectObjects(targets, false);
        if (hits.length) {
          const closest = hits[0].object;

          // Ceiling?
          if (closest === ceilingMesh) {
            window.__id_onPaint?.('ceiling', -1);
            return;
          }

          // Wall?
          const idx = closest.userData.wallIndex;
          if (idx != null) {
            window.__id_onPaint?.('wall', idx);
            return;
          }
        }
      }

      // Clicked on nothing paintable — ignore
      return;
    }
         // Paver individual mode click
    if (this.currentState?.paverMode &&
        this.currentState?.paver?.colorMode === 'individual' &&
        this.paverMeshes.length) {
      const rect = this.canvas.getBoundingClientRect();
      this._paverPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this._paverPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this._paverRaycaster.setFromCamera(this._paverPointer, this.camera);
      const hits = this._paverRaycaster.intersectObjects(this.paverMeshes, false);
      if (hits.length) {
        const m = hits[0].object;
        window.__id_onPaverClick?.(m.userData.gridR, m.userData.gridC);
        return;
      }
    }
        // Individual tile mode — check before furniture
    if (this._onTilePointerDown(e)) return; 
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const fT = [];
    this.furnitureGrp.children.forEach(g => g.traverse(c => { if (c.isMesh) fT.push(c); }));
    const fH = this.raycaster.intersectObjects(fT, false);
    if (fH.length) {
      let obj = fH[0].object;
      while (obj && obj.parent !== this.furnitureGrp) obj = obj.parent;
      if (obj) { this.selectFurniture(obj); this._clearStructSelection(); return; }
    }

    if (this.structGrp) {
      const sT = [];
      this.structGrp.children.forEach(g => g.traverse(c => { if (c.isMesh) sT.push(c); }));
      const sH = this.raycaster.intersectObjects(sT, false);
      if (sH.length) {
        let obj = sH[0].object;
        while (obj && obj.parent !== this.structGrp) obj = obj.parent;
        if (obj) { this.selectStructure(obj); this.deselectFurniture(); return; }
      }
    }

    this.deselectFurniture();
    this._clearStructSelection();
  }

  _onContext(e) {
    e.preventDefault();
        // Individual tile mode — right-click rotates
    const st = this.currentState?.tiles?.[this.currentState?.activeTab || 'floor'];
    if (st?.individualMode) {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.tileMeshes, false);
      if (hits.length) {
        const m = hits[0].object;
        window.__id_onTileRotate?.(m.userData.surface, m.userData.gridR, m.userData.gridC);
        return;
      }
    } 
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const fT = [];
    this.furnitureGrp.children.forEach(g => g.traverse(c => { if (c.isMesh) fT.push(c); }));
    const fH = this.raycaster.intersectObjects(fT, false);
    if (fH.length) {
      let obj = fH[0].object;
      while (obj && obj.parent !== this.furnitureGrp) obj = obj.parent;
      if (obj) {
        this.selectFurniture(obj);
        window.__id_showContext?.(e.clientX, e.clientY, 'furniture', obj.userData.stateIndex);
        return;
      }
    }
    if (this.structGrp) {
      const sT = [];
      this.structGrp.children.forEach(g => g.traverse(c => { if (c.isMesh) sT.push(c); }));
      const sH = this.raycaster.intersectObjects(sT, false);
      if (sH.length) {
        let obj = sH[0].object;
        while (obj && obj.parent !== this.structGrp) obj = obj.parent;
        if (obj) {
          this.selectStructure(obj);
          window.__id_showContext?.(e.clientX, e.clientY, 'structure', obj.userData.stateIndex);
          return;
        }
      }
    }
    window.__id_showContext?.(e.clientX, e.clientY, 'empty', -1);
  }

  _onKey(e) {
    if (e.key === 'Escape') { this.deselectFurniture(); this._clearStructSelection(); }
    if (!this.selected) return;
    if (e.key === 'g' || e.key === 'G') this.setTransformMode('translate');
    if (e.key === 'r' || e.key === 'R') this.setTransformMode('rotate');
    if (e.key === 's' || e.key === 'S') this.setTransformMode('scale');
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const idx = this.selected.userData.stateIndex;
      if (idx != null) {
        this.transform.detach();
        this.furnitureGrp.remove(this.selected);
        this.selected = null;
        window.__id_onDeleteFurniture?.(idx);
      }
    }
  }

  selectFurniture(grp) {
    this.selected = grp;
    this.transform.attach(grp);
    this.transform.setMode(this.transformMode);
    window.__id_onSelectFurniture?.(grp.userData.stateIndex);
  }
  deselectFurniture() {
    if (!this.selected) return;
    this.transform.detach();
    this.selected = null;
    window.__id_onSelectFurniture?.(-1);
  }
  setTransformMode(mode) {
    this.transformMode = mode;
    this.transform.setMode(mode);
  }
  _commitTransform() {
    const grp = this.selected;
    if (!grp) return;
    const idx = grp.userData.stateIndex;
    if (idx == null) return;
    window.__id_onTransform?.(idx, {
      x: grp.position.x / FT, y: grp.position.y / FT, z: grp.position.z / FT,
      rot: grp.rotation.y / DEG,
      sx: grp.scale.x, sy: grp.scale.y, sz: grp.scale.z
    });
  }

  // ---------- STRUCTURE SELECTION ----------
  selectStructure(grp) {
    this._clearStructSelection();
    this.selectedStruct = grp;
    this._showDimensions(grp);
    window.__id_onSelectStructure?.(grp.userData.stateIndex);
  }
  _clearStructSelection() {
    this._removeDimLabels();
    this.selectedStruct = null;
    window.__id_onSelectStructure?.(-1);
  }
  _removeDimLabels() {
    this.structLabels.forEach(l => l.element?.remove());
    this.structLabels = [];
  }
  _showDimensions(grp) {
    const p = grp.userData.params || {};
    const H = grp.userData.roomH || 3;
    const t = grp.userData.structType;
    const labels = [];
    if (t === 'door') {
      labels.push({ text: `প্রস্থ: ${p.width.toFixed(2)}m`, localPos: new THREE.Vector3(0, p.height + 0.2, 0) });
      labels.push({ text: `উচ্চতা: ${p.height.toFixed(2)}m`, localPos: new THREE.Vector3(p.width/2 + 0.3, p.height/2, 0) });
    } else if (t === 'window') {
      labels.push({ text: `প্রস্থ: ${p.width.toFixed(2)}m`, localPos: new THREE.Vector3(0, p.sill + p.height + 0.25, 0) });
      labels.push({ text: `সিল: ${p.sill.toFixed(2)}m`, localPos: new THREE.Vector3(-p.width/2 - 0.4, p.sill/2, 0) });
      labels.push({ text: `উচ্চতা: ${p.height.toFixed(2)}m`, localPos: new THREE.Vector3(p.width/2 + 0.3, p.sill + p.height/2, 0) });
    } else if (t === 'ventilator') {
      labels.push({ text: `ভেন্টিলেটর ${p.width.toFixed(2)}×${p.height.toFixed(2)}m`, localPos: new THREE.Vector3(0, p.sill + p.height + 0.25, 0) });
    } else if (t === 'pillar') {
      labels.push({ text: `ব্যাস: ${(p.size*2).toFixed(2)}m`, localPos: new THREE.Vector3(p.size + 0.3, H/2, 0) });
      labels.push({ text: `উচ্চতা: ${H.toFixed(2)}m`, localPos: new THREE.Vector3(0, H + 0.2, 0) });
    } else if (t === 'stairs') {
      labels.push({ text: `${p.steps} ধাপ · ${p.railing !== 'none' ? 'রেলিং ' + p.railing : 'রেলিং নেই'}`, localPos: new THREE.Vector3(0, H + 0.2, 0) });
    }

    const overlay = this._getOverlay();
    labels.forEach(({ text, localPos }) => {
      const worldPos = grp.localToWorld(localPos.clone());
      const el = document.createElement('div');
      el.className = 'id-dim-label';
      el.textContent = text;
      overlay.appendChild(el);
      this.structLabels.push({ element: el, worldPos });
    });

    if (!this._dimLoop) {
      this._dimLoop = () => {
        if (!this.structLabels.length) { this._dimLoop = null; return; }
        const rect = this.canvas.getBoundingClientRect();
        this.structLabels.forEach(({ element, worldPos }) => {
          const v = worldPos.clone().project(this.camera);
          element.style.left = ((v.x * 0.5 + 0.5) * rect.width) + 'px';
          element.style.top  = ((-v.y * 0.5 + 0.5) * rect.height) + 'px';
          element.style.display = v.z < 1 ? 'block' : 'none';
        });
        requestAnimationFrame(this._dimLoop);
      };
      this._dimLoop();
    }
  }
  _getOverlay() {
    let ov = this.canvas.parentElement.querySelector('.id-dim-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.className = 'id-dim-overlay';
      Object.assign(ov.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' });
      this.canvas.parentElement.appendChild(ov);
    }
    return ov;
  }

  // ---------- ROOM SHAPE ----------
  _roomPoints(state) {
    const { shape, room, customPoints } = state;
    const L = room.length * FT, W = room.width * FT;
    const hL = L / 2, hW = W / 2;
    if (shape === 'custom' && customPoints?.length >= 3) {
      const cxs = customPoints.map(p => p.x), cys = customPoints.map(p => p.y);
      const minX = Math.min(...cxs), maxX = Math.max(...cxs);
      const minY = Math.min(...cys), maxY = Math.max(...cys);
      const sx = L / Math.max(maxX - minX, 1), sy = W / Math.max(maxY - minY, 1);
      return customPoints.map(p => new THREE.Vector2((p.x - minX) * sx - L/2, (p.y - minY) * sy - W/2));
    }
    if (shape === 'hex' || shape === 'oct') {
      const n = shape === 'hex' ? 6 : 8;
      const r = Math.max(L, W) / 2;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.PI / n;
        pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
      }
      return pts;
    }
    if (shape === 'L') {
      return [
        new THREE.Vector2(-hL, -hW), new THREE.Vector2( hL, -hW),
        new THREE.Vector2( hL,   0), new THREE.Vector2(  0,   0),
        new THREE.Vector2(  0,  hW), new THREE.Vector2(-hL,  hW)
      ];
    }
    return [
      new THREE.Vector2(-hL, -hW), new THREE.Vector2( hL, -hW),
      new THREE.Vector2( hL,  hW), new THREE.Vector2(-hL,  hW)
    ];
  }

  _buildRoom(state) {
    this._disposeGroup(this.roomGroup);
    this.tileMeshes = [];
    this.selectedTile = null; 
    this._disposeGroup(this.furnitureGrp);
    this._removeDimLabels();
    this.structGrp = null;

    const H = state.room.height * FT;
    const pts = this._roomPoints(state);
    const shape = new THREE.Shape(pts);

    const floorGeo = new THREE.ShapeGeometry(shape);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.55, metalness: 0.05
    }));
    floor.receiveShadow = true;
    floor.name = 'floor';
    this.roomGroup.add(floor);

    const ceilGeo = new THREE.ShapeGeometry(shape);
    ceilGeo.rotateX(Math.PI / 2);
    const ceiling = new THREE.Mesh(ceilGeo, new THREE.MeshStandardMaterial({
      color: 0xc8c8c8, roughness: 0.95, side: THREE.DoubleSide
    }));
    ceiling.position.y = H;
    ceiling.name = 'ceiling';
    this.roomGroup.add(ceiling);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8, roughness: 0.9, metalness: 0.0, side: THREE.DoubleSide
    });
    const walls = new THREE.Group();
    walls.name = 'walls';
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const dx = b.x - a.x, dz = b.y - a.y;
      const len = Math.hypot(dx, dz);
      if (len < 0.01) continue;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(len, H), wallMat.clone());
      m.position.set((a.x + b.x) / 2, H / 2, (a.y + b.y) / 2);
      m.rotation.y = Math.atan2(dx, dz) - Math.PI / 2;
      m.receiveShadow = true;
      m.userData.wallLen = len;
      m.userData.wallIndex = i;
      walls.add(m);
    }
    this.roomGroup.add(walls);

         // Store wall meshes reference for painting
    this._wallMeshes = walls.children.slice();

    this._roomBounds = { pts, H, L: state.room.length * FT, W: state.room.width * FT };
    this._roomCenter = new THREE.Vector3(0, H / 2, 0);
        // Paver mode? hide floor and build pavers
        // Paver mode? hide floor and build pavers
    if (state.paverMode && state.paver && state.paver.id) {
      floor.visible = false;
      const Lp = state.room.length * FT;
      const Wp = state.room.width  * FT;
      this._buildPaverFloor(state, pts, Lp, Wp);
    }

    this._buildStructure3D(state, pts, H);
        // Skirting
    this._buildSkirting(state); 
         // Paint overlays
    this._buildPaint(state);
  }

  _defaultsForType(type) {
    if (type === 'door')       return { width: 0.9, height: 2.1, offsetX: 0 };
    if (type === 'window')     return { width: 1.2, height: 1.2, sill: 0.9, offsetX: 0 };
    if (type === 'ventilator') return { width: 0.6, height: 0.4, sill: 2.0, offsetX: 0 };
    if (type === 'pillar')     return { shape: 'round', size: 0.30, baseSize: 0.45, baseH: 0.15, capH: 0.12, offsetX: 0, offsetZ: 0 };
    if (type === 'stairs')     return {
      steps: 6, width: 1.2, depth: 0.28, riserH: 0.18,
      thickness: 'single', railing: 'none', railingH: 0.9,
      molding: 'none', moldingH: 0.05,
      treadMaterial: 'solid', riserMaterial: 'solid'
    };
    return {};
  }

  _buildStructure3D(state, pts, H) {
    const items = state.structure || [];
    if (!items.length) return;
    const grp = new THREE.Group();
    grp.name = 'structure';
    this.structGrp = grp;

    const xs = pts.map(p => p.x), zs = pts.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const Rw = maxX - minX, Rd = maxZ - minZ;

    items.forEach((s, idx) => {
      const nx = (s.x - 40) / 520, nz = (s.y - 40) / 320;
      const wx = minX + nx * Rw, wz = minZ + nz * Rd;
      const params = Object.assign({}, this._defaultsForType(s.type), s.params || {});
      const g = new THREE.Group();

      if (s.type === 'door') {
        const dw = params.width, dh = params.height;
        const fm = new THREE.MeshStandardMaterial({ color: 0x8b6f47, roughness: 0.6 });
        const fL = new THREE.Mesh(new THREE.BoxGeometry(0.08, dh, 0.12), fm);
        fL.position.set(-dw/2, dh/2, 0); g.add(fL);
        const fR = fL.clone(); fR.position.x = dw/2; g.add(fR);
        const fT = new THREE.Mesh(new THREE.BoxGeometry(dw + 0.16, 0.08, 0.12), fm);
        fT.position.y = dh + 0.04; g.add(fT);
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(dw - 0.04, dh - 0.06, 0.06),
          new THREE.MeshStandardMaterial({ color: 0xc9a876, roughness: 0.5 })
        );
        panel.position.y = dh/2; g.add(panel);
        const knob = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 12, 8),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 })
        );
        knob.position.set(dw/2 - 0.12, dh/2, 0.06); g.add(knob);
      } else if (s.type === 'window') {
        const ww = params.width, wh = params.height, sill = params.sill;
        const fm = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5, metalness: 0.1 });
        const hTop = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.1, 0.06, 0.1), fm);
        hTop.position.set(0, sill + wh, 0);
        const hBot = hTop.clone(); hBot.position.set(0, sill, 0);
        const vL = new THREE.Mesh(new THREE.BoxGeometry(0.06, wh + 0.06, 0.1), fm);
        vL.position.set(-ww/2, sill + wh/2, 0);
        const vR = vL.clone(); vR.position.set(ww/2, sill + wh/2, 0);
        g.add(hTop, hBot, vL, vR);
        const glass = new THREE.Mesh(
          new THREE.PlaneGeometry(ww, wh),
          new THREE.MeshPhysicalMaterial({
            color: 0x88bbdd, transparent: true, opacity: 0.35,
            roughness: 0.05, metalness: 0.1, transmission: 0.9, thickness: 0.02, side: THREE.DoubleSide
          })
        );
        glass.position.set(0, sill + wh/2, 0);
        g.add(glass);
      } else if (s.type === 'ventilator') {
        const vw = params.width, vh = params.height, sill = params.sill;
        const fm = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5, metalness: 0.15 });
        const hTop = new THREE.Mesh(new THREE.BoxGeometry(vw + 0.06, 0.04, 0.08), fm);
        hTop.position.set(0, sill + vh, 0);
        const hBot = hTop.clone(); hBot.position.set(0, sill, 0);
        const vL = new THREE.Mesh(new THREE.BoxGeometry(0.04, vh, 0.08), fm);
        vL.position.set(-vw / 2, sill + vh / 2, 0);
        const vR = vL.clone(); vR.position.set(vw / 2, sill + vh / 2, 0);
        g.add(hTop, hBot, vL, vR);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4, metalness: 0.2 });
        for (let b = 0; b < 3; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(vw, 0.03, 0.06), bladeMat);
          blade.position.set(0, sill + vh * (0.2 + b * 0.3), 0);
          blade.rotation.x = -0.35;
          g.add(blade);
        }
      } else if (s.type === 'pillar') {
        const size = params.size || 0.30;
        const baseSize = params.baseSize || 0.45;
        const baseH = params.baseH || 0.15;
        const capH = params.capH || 0.12;
        const mat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.65, metalness: 0.05 });

        const baseGeo = params.shape === 'round'
          ? new THREE.CylinderGeometry(baseSize, baseSize, baseH, 24)
          : new THREE.BoxGeometry(baseSize * 2, baseH, baseSize * 2);
        const baseMesh = new THREE.Mesh(baseGeo, mat);
        baseMesh.position.y = baseH / 2;
        g.add(baseMesh);

        const shaftH = H - baseH - capH;
        const shaftGeo = params.shape === 'round'
          ? new THREE.CylinderGeometry(size, size, shaftH, 24)
          : new THREE.BoxGeometry(size * 2, shaftH, size * 2);
        const shaft = new THREE.Mesh(shaftGeo, mat);
        shaft.position.y = baseH + shaftH / 2;
        g.add(shaft);

        const capGeo = params.shape === 'round'
          ? new THREE.CylinderGeometry(baseSize, baseSize * 0.9, capH, 24)
          : new THREE.BoxGeometry(baseSize * 2, capH, baseSize * 2);
        const cap = new THREE.Mesh(capGeo, mat);
        cap.position.y = H - capH / 2;
        g.add(cap);
      } else if (s.type === 'stairs') {
        const steps = Math.max(2, params.steps);
        const stepW = params.width;
        const stepD = params.depth;
        const stepH = params.riserH;
        const isDouble = params.thickness === 'double';
        const treadThick = isDouble ? stepH * 0.55 : stepH;
        const riserThick = isDouble ? stepH * 0.45 : stepH;

        const treadMat = new THREE.MeshStandardMaterial({ color: 0xd4cfc4, roughness: 0.6, metalness: 0.05 });
        const riserMat = new THREE.MeshStandardMaterial({ color: 0xb8b0a0, roughness: 0.75, metalness: 0.02 });

        for (let i = 0; i < steps; i++) {
          const tread = new THREE.Mesh(new THREE.BoxGeometry(stepW, treadThick, stepD), treadMat);
          tread.position.set(0, stepH * (i + 1) - treadThick / 2, -i * stepD);
          g.add(tread);

          const riser = new THREE.Mesh(new THREE.BoxGeometry(stepW, riserThick, 0.02), riserMat);
          riser.position.set(0, stepH * i + riserThick / 2, -i * stepD - stepD / 2);
          g.add(riser);

          if (params.molding !== 'none') {
            const moldH = params.moldingH;
            const moldCount = params.molding === 'double' ? 2 : 1;
            for (let m = 0; m < moldCount; m++) {
              const mold = new THREE.Mesh(
                new THREE.BoxGeometry(stepW + 0.02, moldH, 0.03),
                new THREE.MeshStandardMaterial({ color: 0x8a7a60, roughness: 0.4, metalness: 0.15 })
              );
              mold.position.set(0, stepH * (i + 1) - treadThick - moldH / 2 - m * moldH, -i * stepD + stepD / 2 + 0.015);
              g.add(mold);
            }
          }
        }

        if (params.railing !== 'none') {
          const rH = params.railingH;
          const topTotalH = steps * stepH;
          const totalD = steps * stepD;

          for (const side of [-1, 1]) {
            const rx = side * (stepW / 2 + 0.02);
            const railLen = Math.hypot(totalD, topTotalH);
            const angle = Math.atan2(topTotalH, totalD);
            const rail = new THREE.Mesh(
              new THREE.BoxGeometry(0.05, 0.06, railLen),
              new THREE.MeshStandardMaterial({
                color: params.railing === 'wood' ? 0x8b5a3a : 0xcccccc,
                roughness: 0.4, metalness: params.railing === 'metal' ? 0.85 : 0.15
              })
            );
            rail.position.set(rx, topTotalH / 2 + rH, -totalD / 2);
            rail.rotation.x = -angle;
            g.add(rail);

            if (params.railing === 'metal') {
              const balCount = steps * 2;
              for (let b = 0; b <= balCount; b++) {
                const t = b / balCount;
                const bY = t * topTotalH + rH * 0.5;
                const bZ = -t * totalD;
                const bal = new THREE.Mesh(
                  new THREE.CylinderGeometry(0.012, 0.012, rH, 8),
                  new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.25 })
                );
                bal.position.set(rx, bY, bZ);
                g.add(bal);
              }
            } else if (params.railing === 'wood') {
              const balCount = Math.max(3, Math.floor(steps / 2));
              for (let b = 0; b <= balCount; b++) {
                const t = b / balCount;
                const bal = new THREE.Mesh(
                  new THREE.BoxGeometry(0.05, rH, 0.05),
                  new THREE.MeshStandardMaterial({ color: 0x6a4a2a, roughness: 0.6 })
                );
                bal.position.set(rx, t * topTotalH + rH / 2, -t * totalD);
                g.add(bal);
              }
            } else if (params.railing === 'glass') {
              const glass = new THREE.Mesh(
                new THREE.PlaneGeometry(railLen, rH * 0.9),
                new THREE.MeshPhysicalMaterial({
                  color: 0xcfe8f5, transparent: true, opacity: 0.35,
                  roughness: 0.05, transmission: 0.9, thickness: 0.01, side: THREE.DoubleSide
                })
              );
              glass.rotation.x = -angle;
              glass.rotation.y = Math.PI / 2;
              glass.position.set(rx, topTotalH / 2 + rH / 2, -totalD / 2);
              g.add(glass);
            }
          }
        }
      }

      g.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      g.position.set(wx, 0, wz);
      g.rotation.y = (s.rot || 0) * DEG;
      if (s.type === 'door' || s.type === 'window' || s.type === 'ventilator') {
        const ox = params.offsetX || 0;
        g.position.x += Math.cos(-g.rotation.y) * ox;
        g.position.z += Math.sin(-g.rotation.y) * ox;
      } else if (s.type === 'pillar') {
        g.position.x += (params.offsetX || 0);
        g.position.z += (params.offsetZ || 0);
      }
      g.userData.structType = s.type;
      g.userData.stateIndex = idx;
      g.userData.params = params;
      g.userData.roomH = H;
      grp.add(g);
    });

    this.roomGroup.add(grp);
  }

  updateStructure(index, newParams) {
    if (!this.currentState?.structure?.[index]) return;
    this.currentState.structure[index].params =
      Object.assign({}, this.currentState.structure[index].params, newParams);
    const H = this._roomBounds.H, pts = this._roomBounds.pts;
    const old = this.roomGroup.getObjectByName('structure');
    if (old) this.roomGroup.remove(old);
    this.structGrp = null;
    this._removeDimLabels();
    this._buildStructure3D(this.currentState, pts, H);
    if (this.currentState.tiles) {
      this._buildTiles(this.currentState).then(() => this._renderOnce());
    } else {
      this._renderOnce();
    }
    const newGrp = this.structGrp?.children.find(c => c.userData.stateIndex === index);
    if (newGrp) this.selectStructure(newGrp);
  }
  deleteStructure(index) {
    if (!this.currentState?.structure) return;
    this.currentState.structure.splice(index, 1);
    const H = this._roomBounds.H, pts = this._roomBounds.pts;
    const old = this.roomGroup.getObjectByName('structure');
    if (old) this.roomGroup.remove(old);
    this.structGrp = null;
    this._removeDimLabels();
    this._buildStructure3D(this.currentState, pts, H);
    this._renderOnce();
  }

  // Procedural dimple bump texture (like real pavers)
  _makePaverBumpTexture() {
    if (this._paverBumpTex) return this._paverBumpTex;
    const size = 256;
    const cvs = document.createElement('canvas');
    cvs.width = cvs.height = size;
    const ctx = cvs.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);
    const dotR = 3;
    const gap = 14;
    for (let y = gap / 2; y < size; y += gap) {
      for (let x = gap / 2; x < size; x += gap) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, dotR);
        grad.addColorStop(0, '#3a3a3a');
        grad.addColorStop(0.6, '#606060');
        grad.addColorStop(1, '#808080');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    this._paverBumpTex = tex;
    return tex;
  }

  _buildPaverFloor(state, roomPts, roomW_m, roomH_m) {
    if (this.paverGroup) {
      this._disposeGroup(this.paverGroup);
      this.roomGroup.remove(this.paverGroup);
    }
    this.paverMeshes = [];

    const paverDef = PAVERS[state.paver.id];
    if (!paverDef) return;

    const roomW_mm = roomW_m * 1000;
    const roomH_mm = roomH_m * 1000;

    const customW = state.paver.customW || paverDef.dims.w;
    const customH = state.paver.customH || paverDef.dims.h;
    const pattern = state.paver.pattern || 'stack';

    const layout = generateLayout(paverDef, roomW_mm, roomH_mm, customW, customH, pattern);
    const shape = buildShape(paverDef, customW, customH);

    const thickness_m = (paverDef.thickness || 60) * MM;

    let geo;
    try {
      geo = new THREE.ExtrudeGeometry(shape, {
        depth: thickness_m,
        bevelEnabled: true,
        bevelThickness: 0.001,
        bevelSize: 0.0008,
        bevelSegments: 1
      });
      geo.scale(MM, MM, 1);
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, thickness_m, 0);
    } catch (err) {
      console.warn('Paver geometry failed:', err);
      return;
    }

    const surfaceId = state.paver.surface || 'rough';
    const surfaceDef = {
      smooth:  { roughness: 0.35, metalness: 0.05 },
      rough:   { roughness: 0.85, metalness: 0.02 },
      granite: { roughness: 0.55, metalness: 0.15 }
    }[surfaceId] || { roughness: 0.7, metalness: 0.05 };

    const tileTexUrl = state.tiles?.floor?.url;
    const colorA = state.paver.color || paverDef.color || '#a8a8a8';
    const colorB = state.paver.colorB || '#9a9a9a';
    const colorMode = state.paver.colorMode || 'solid';
    const individualMap = state.paver.individualColors || {};

    const bumpTex = this._makePaverBumpTexture();
    const matCache = {};
    const makeMat = (hex) => {
      if (matCache[hex]) return matCache[hex];
      const m = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        roughness: surfaceDef.roughness,
        metalness: surfaceDef.metalness,
        bumpMap: bumpTex,
        bumpScale: 0.008,
        side: THREE.DoubleSide
      });
      matCache[hex] = m;
      return m;
    };

    if (tileTexUrl) {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(tileTexUrl, (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.repeat.set(1, 1);
        tex.needsUpdate = true;
        Object.values(matCache).forEach(m => {
          m.map = tex;
          m.color.set(0xffffff);
          m.needsUpdate = true;
        });
        this._renderOnce();
      }, undefined, () => {});
    }

    const randomPalette = ['#b22222', '#d2691e', '#daa520', '#9a9a9a',
                           '#555555', '#8b6f47', '#d98b8b', '#eeeeee'];

    const insideRoom = (px_m, pz_m) => {
      if (!roomPts?.length) return true;
      let inside = false;
      for (let i = 0, j = roomPts.length - 1; i < roomPts.length; j = i++) {
        const xi = roomPts[i].x, zi = roomPts[i].y;
        const xj = roomPts[j].x, zj = roomPts[j].y;
        const intersect = ((zi > pz_m) !== (zj > pz_m)) &&
                          (px_m < (xj - xi) * (pz_m - zi) / (zj - zi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    const grp = new THREE.Group();
    grp.name = 'paver-floor';

    for (const t of layout) {
      const px_m = t.x * MM;
      const pz_m = t.y * MM;
      if (!insideRoom(px_m, pz_m)) continue;

      let hex = colorA;
      const key = `${t.row},${t.col}`;

      if (colorMode === 'individual' && individualMap[key]) {
        hex = individualMap[key];
      } else if (colorMode === 'alt') {
        hex = (t.col % 2 === 0) ? colorA : colorB;
      } else if (colorMode === 'checker') {
        hex = ((t.row + t.col) % 2 === 0) ? colorA : colorB;
      } else if (colorMode === 'stripes-row') {
        hex = (t.row % 2 === 0) ? colorA : colorB;
      } else if (colorMode === 'stripes-col') {
        hex = (t.col % 2 === 0) ? colorA : colorB;
      } else if (colorMode === 'random') {
        hex = randomPalette[(t.row * 7 + t.col * 3) % randomPalette.length];
      }

      const mat = makeMat(hex);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(px_m, 0, pz_m);
      if (t.rot) mesh.rotation.y = t.rot * DEG;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.isPaver = true;
      mesh.userData.gridR = t.row;
      mesh.userData.gridC = t.col;
      grp.add(mesh);
      this.paverMeshes.push(mesh);
    }

    this.paverGroup = grp;
    this.roomGroup.add(grp);

    this._paverStats = {
      count: grp.children.length,
      layout: layout.length,
      paver: paverDef.name,
      customW, customH,
      pattern,
      colorMode
    };
  }

  // Public: get paver stats
  getPaverStats() { return this._paverStats; }

  // Public: rebuild paver floor only (faster than full render)
  async rebuildPavers() {
    if (!this.currentState) return;
    const pts = this._roomBounds?.pts;
    if (!pts) return;
    const L = this.currentState.room.length * FT;
    const W = this.currentState.room.width * FT;
    this._buildPaverFloor(this.currentState, pts, L, W);
    this._renderOnce();
  }
  
     // ═══════════════════════════════════════════════
  // WALL & CEILING PAINT — Overlay mesh system
  // ═══════════════════════════════════════════════
  _buildPaint(state) {
    const old = this.roomGroup.getObjectByName('paint-overlay');
    if (old) this.roomGroup.remove(old);

    const wallColors = state.wallColors || {};
    const ceilingColor = state.ceilingColor;
    const hasAnyPaint = Object.keys(wallColors).length > 0 ||
                        (ceilingColor && ceilingColor !== '#ffffff');
    if (!hasAnyPaint) return;

    const S = state.skirting;
    const skH = (S?.enabled ? (S.height || 150) : 0) * MM;

    const pts = this._roomBounds?.pts;
    const H = this._roomBounds?.H || 3;
    if (!pts) return;

    const grp = new THREE.Group();
    grp.name = 'paint-overlay';

    // ---------- WALL OVERLAYS ----------
    for (let i = 0; i < pts.length; i++) {
      const hex = wallColors[i];
      if (!hex) continue;

      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const dx = b.x - a.x, dz = b.y - a.y;
      const wallLen = Math.hypot(dx, dz);
      if (wallLen < 0.05) continue;

      const paintHeight = H - skH - 0.005;
      if (paintHeight < 0.1) continue;
             // Skip hidden walls
      const wallMesh = this._wallMeshes?.[i];
      if (wallMesh && !wallMesh.visible) continue;

      const geo = new THREE.PlaneGeometry(wallLen - 0.01, paintHeight);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        roughness: 0.85,
        metalness: 0.02,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geo, mat);
      const mx = (a.x + b.x) / 2;
      const mz = (a.y + b.y) / 2;
      const wallDirX = dx / wallLen;
      const wallDirZ = dz / wallLen;
      let nX = -wallDirZ;
      let nZ = wallDirX;
      if (nX * (-mx) + nZ * (-mz) < 0) { nX = -nX; nZ = -nZ; }

      const offset = 0.008;
      mesh.position.set(
        mx + nX * offset,
        skH + paintHeight / 2,
        mz + nZ * offset
      );
      mesh.rotation.y = Math.atan2(dx, dz) - Math.PI / 2;

      grp.add(mesh);
    }

    // ---------- CEILING OVERLAY ----------
    if (ceilingColor && ceilingColor !== '#ffffff') {
      const shape = new THREE.Shape(pts);
      const geo = new THREE.ShapeGeometry(shape);
      geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(ceilingColor),
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = H - 0.008;
      mesh.name = 'paint-ceiling';
      grp.add(mesh);
    }

    this.paintGroup = grp;
    this.roomGroup.add(grp);
  }

  // Public rebuild
  rebuildPaint() {
    if (!this.currentState) return;
    this._buildPaint(this.currentState);
    this._renderOnce();
  }

  // Public paint actions (called from app via __id_onPaint)
  paintWall(wallIndex) {
    if (!this.currentState) return false;
    if (!this.currentState.wallColors) this.currentState.wallColors = {};
    const hex = window.__id_getPaintColor?.() || '#ffffff';
    this.currentState.wallColors[wallIndex] = hex;
    this._buildPaint(this.currentState);
    this._renderOnce();
    return true;
  }

  paintCeiling() {
    if (!this.currentState) return false;
    const hex = window.__id_getPaintColor?.() || '#ffffff';
    this.currentState.ceilingColor = hex;
    this._buildPaint(this.currentState);
    this._renderOnce();
    return true;
  }
   
   // ═══════════════════════════════════════════════
  // SKIRTING (BASEBOARD) BUILDER
  // ═══════════════════════════════════════════════
  _buildSkirting(state) {
    const S = state.skirting;
    // Remove old
    const old = this.roomGroup.getObjectByName('skirting');
    if (old) this.roomGroup.remove(old);

    if (!S?.enabled) return;

    const H = (S.height || 150) * MM;
    const T = (S.thickness || 12) * MM;
    const pts = this._roomBounds?.pts;
    if (!pts || !pts.length) return;

    const grp = new THREE.Group();
    grp.name = 'skirting';

    const material = this._makeSkirtingMaterial(state, S);

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const dx = b.x - a.x, dz = b.y - a.y;
      const wallLen = Math.hypot(dx, dz);
      if (wallLen < 0.05) continue;

      const wallAngle = Math.atan2(dx, dz);

      // Compute outward/inward test
      const mx = (a.x + b.x) / 2;
      const mz = (a.y + b.y) / 2;
      const tc = { x: -mx, z: -mz }; // toward origin (room center approx)

      // Door gaps on this wall (in wall-space distance)
      const gaps = this._findDoorGapsOnWall(a, b, state.structure || []);

      // Build list of [start, end] segments to draw
      const segs = this._computeSkirtingSegs(wallLen, gaps);

      for (const seg of segs) {
        const segLen = seg.end - seg.start;
        if (segLen < 0.03) continue;

        const tMid = (seg.start + seg.end) / 2;
        const cx = a.x + (dx / wallLen) * tMid;
        const cz = a.y + (dz / wallLen) * tMid;

        const geo = this._makeSkirtingGeo(segLen, H, T, S.profile);
        if (!geo) continue;

        // Build mesh
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.set(cx, 0, cz);
        mesh.rotation.y = wallAngle;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        grp.add(mesh);
      }
    }

    this.roomGroup.add(grp);
  }

  // ----- Helpers -----

  _makeSkirtingMaterial(state, S) {
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Solid color mode
    if (S.material === 'solid') {
      baseMat.color.set(S.color || '#ffffff');
      return baseMat;
    }

    // Otherwise use a tile map
    const tileKey = S.material; // 'floor' | 'wall' | 'accent'
    const tileState = state.tiles?.[tileKey];
    if (tileState?.url) {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(tileState.url, (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        // Set repeat based on tile size
        const tw = (tileState.size?.w || 600) / 1000;
        const th = (tileState.size?.h || 600) / 1000;
        // Use base repeat — actual UV comes from extrude geometry
        tex.repeat.set(1, 1);
        tex.needsUpdate = true;
        baseMat.map = tex;
        baseMat.color.set(0xffffff);
        baseMat.needsUpdate = true;
        this._renderOnce();
      }, undefined, () => {});
    } else {
      // Fallback shades
      if (S.material === 'wall') baseMat.color.set(0xd8d8d8);
      else if (S.material === 'accent') baseMat.color.set(0xffb347);
      else baseMat.color.set(0xeeeeee);
    }
    return baseMat;
  }

  _makeSkirtingGeo(segLen, H, T, profile) {
    // Profile drawn in XY plane:
    //   X: depth (0 → -T, going inward)
    //   Y: height (0 → H)
    // Extruded along +Z by segLen, then centered on Z.
    const shape = new THREE.Shape();

    const bevel = Math.min(T * 0.35, H * 0.15);
    const noseR = Math.min(T * 0.5, H * 0.25);
    const coveR = Math.min(T * 0.6, H * 0.3);

    switch (profile) {

      case 'flat':
      default: {
        shape.moveTo(0, 0);
        shape.lineTo(-T, 0);
        shape.lineTo(-T, H);
        shape.lineTo(0, H);
        shape.closePath();
        break;
      }

      case 'beveled': {
        // Front bottom is chamfered
        shape.moveTo(0, 0);
        shape.lineTo(-T, 0);
        shape.lineTo(-T, H - bevel);
        shape.lineTo(-T + bevel, H);
        shape.lineTo(0, H);
        shape.closePath();
        break;
      }

      case 'bullnose': {
        // Rounded top-front edge
        shape.moveTo(0, 0);
        shape.lineTo(-T, 0);
        shape.lineTo(-T, H - noseR);
        // Quadratic curve to top
        shape.quadraticCurveTo(-T, H, -T + noseR, H);
        shape.lineTo(0, H);
        shape.closePath();
        break;
      }

      case 'cove': {
        // Front face curves at top (concave)
        shape.moveTo(0, 0);
        shape.lineTo(-T, 0);
        shape.lineTo(-T, H - coveR);
        shape.quadraticCurveTo(-T * 0.5, H - coveR * 0.5, 0, H - coveR * 0.3);
        shape.lineTo(0, H);
        shape.closePath();
        break;
      }
    }

    try {
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: segLen,
        bevelEnabled: false,
        curveSegments: 8
      });
      // Center on Z (extrusion direction)
      geo.translate(0, 0, -segLen / 2);

      // Generate UVs for wall tiles
      // Apply a simple planar UV: u = along wall length, v = along height
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      if (pos && uv) {
        for (let i = 0; i < pos.count; i++) {
          const px = pos.getX(i);
          const py = pos.getY(i);
          const pz = pos.getZ(i);
          // u from Z (length direction, normalized by typical tile width 0.6m)
          // v from Y (height direction)
          uv.setXY(i, pz / 0.6, py / 0.6);
        }
        uv.needsUpdate = true;
      }

      return geo;
    } catch (err) {
      console.warn('Skirting geo failed:', err);
      return null;
    }
  }

  // Find door gaps along a wall segment
  _findDoorGapsOnWall(a, b, structure) {
    const dx = b.x - a.x, dz = b.y - a.y;
    const wallLen = Math.hypot(dx, dz);
    if (wallLen < 0.01) return [];
    const wallDirX = dx / wallLen, wallDirZ = dz / wallLen;

    const gaps = [];

    for (const s of structure) {
      if (s.type !== 'door') continue;

      // Door world position (approx) — door is placed similar to how doors are built
      // In _buildStructure3D, doors are placed using wx, wz from SVG coords
      // We don't have wx directly here, so we reconstruct from structure s.x, s.y
      // _buildStructure3D used: nx = (s.x - 40) / 520, nz = (s.y - 40) / 320
      // and mapped into the wall bounding box.

      // We don't have pts min/max here, so we approximate:
      // Use structure s.x, s.y as parametric within room.
      // Better approach: pass state and use same mapping.

      // Simpler: use s.x / 600, s.y / 400 as fractions of the room bounding box
      // The wall segment (a, b) spans real-world coords, so we project s into wall space.

      // Since we don't have room bounds min/max here, we skip this. Instead we rely
      // on door.params.width to create a gap near the door's parametric position.

      // Compute door's "projection" onto this wall using its x,y SVG coords
      // Assume room is at origin, size from wall bounds:
      // We need the room bounds — use this._roomBounds.pts for min/max
      const pts = this._roomBounds?.pts;
      if (!pts) continue;
      const xs = pts.map(p => p.x), zs = pts.map(p => p.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minZ = Math.min(...zs), maxZ = Math.max(...zs);
      const rw = maxX - minX, rd = maxZ - minZ;

      const doorNx = (s.x - 40) / 520;
      const doorNz = (s.y - 40) / 320;
      const doorWx = minX + doorNx * rw;
      const doorWz = minZ + doorNz * rd;

      // Project door onto this wall's line
      const relX = doorWx - a.x;
      const relZ = doorWz - a.y;
      const projT = relX * wallDirX + relZ * wallDirZ; // parametric along wall

      // Distance from door to wall line
      const perpX = relX - projT * wallDirX;
      const perpZ = relZ - projT * wallDirZ;
      const perpDist = Math.hypot(perpX, perpZ);

      // Must be close to wall (within 0.5m)
      if (perpDist > 0.5) continue;

      // Door width in meters
      const doorWidthM = (s.params?.width || 0.9);
      const halfW = doorWidthM / 2 + 0.05; // +5cm extra margin

      gaps.push({
        start: projT - halfW,
        end: projT + halfW
      });
    }

    return gaps;
  }

  _computeSkirtingSegs(wallLen, gaps) {
    // Sort gaps by start
    const sorted = gaps
      .map(g => ({
        start: Math.max(0, g.start),
        end: Math.min(wallLen, g.end)
      }))
      .filter(g => g.end > g.start)
      .sort((a, b) => a.start - b.start);

    const segs = [];
    let cursor = 0;

    for (const g of sorted) {
      if (g.start > cursor) {
        segs.push({ start: cursor, end: g.start });
      }
      cursor = Math.max(cursor, g.end);
    }
    if (cursor < wallLen) {
      segs.push({ start: cursor, end: wallLen });
    }

    // If no gaps, return the whole wall
    if (!segs.length && !sorted.length) {
      return [{ start: 0, end: wallLen }];
    }

    return segs;
  } 
   // ⬇⬇⬇ এখান থেকে PART 2 শুরু হবে — এখনো সেভ করবেন না ⬇⬇⬇

  // ---------- TILES ----------
  async _buildTiles(state) {
    const { tiles = {}, surfaces = {} } = state;
    const texCache = {};
    const loadTex = (url) => new Promise((res) => {
      if (!url) return res(null);
      if (texCache[url]) return res(texCache[url]);
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(url, (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        texCache[url] = tex;
        res(tex);
      }, undefined, () => res(null));
    });

         // ---------- Refresh skirting textures ----------
    const skirtingGrp = this.roomGroup.getObjectByName('skirting');
    if (skirtingGrp && state.skirting?.enabled) {
      const S = state.skirting;
      const tileKey = S.material;
      if (tileKey !== 'solid') {
        const ts = tiles[tileKey];
        if (ts?.url) {
          const tex = await loadTex(ts.url);
          if (tex) {
            const tileW = (ts.size?.w || 600) / 1000;
            const tileH = (ts.size?.h || 600) / 1000;
            skirtingGrp.traverse(mesh => {
              if (!mesh.isMesh) return;
              const m = mesh.material.clone();
              const c = tex.clone();
              c.wrapS = c.wrapT = THREE.RepeatWrapping;
              c.colorSpace = THREE.SRGBColorSpace;
              c.repeat.set(1 / tileW, 1 / tileH);
              c.needsUpdate = true;
              m.map = c;
              m.color.set(0xffffff);
              m.needsUpdate = true;
              mesh.material = m;
            });
          }
        }
      }
    }

    const apply = async (surfaceName, mesh, wMeters, hMeters) => {
      const t = tiles[surfaceName];
      if (!t?.url || !mesh) return;
      const tex = await loadTex(t.url);
      if (!tex) return;
      const tileW = (t.size?.w || 600) / 1000;
      const tileH = (t.size?.h || 600) / 1000;
         // ShapeGeometry UV মিটারে, PlaneGeometry UV 0-1 এ
      const isShape = mesh.geometry.type === 'ShapeGeometry';
      const repX = isShape ? (1 / tileW) : (wMeters / tileW);
      const repY = isShape ? (1 / tileH) : (hMeters / tileH);
      const clone = tex.clone();
      clone.wrapS = clone.wrapT = THREE.RepeatWrapping;
      clone.colorSpace = THREE.SRGBColorSpace;
      clone.anisotropy = tex.anisotropy;
      clone.repeat.set(Math.max(repX, 0.01), Math.max(repY, 0.01));
      const offX = (t.offsetX || 0) / 1000 / tileW;
      const offY = (t.offsetY || 0) / 1000 / tileH;
      clone.offset.set(offX, offY);
      clone.rotation = (t.rot || 0) * DEG;
           // corner start = rotate around UV origin instead of center
      if (t.cornerStart) {
        clone.center.set(0, 0);
      } else {
        clone.center.set(0.5, 0.5);
      }
      clone.needsUpdate = true;
      mesh.material.map = clone;
      mesh.material.color.set(0xffffff);
      mesh.material.roughness = 0.35;
      mesh.material.metalness = 0.08;
      mesh.material.needsUpdate = true;
    };

    const L = state.room.length * FT, W = state.room.width * FT, H = state.room.height * FT;
    const floor = this.roomGroup.getObjectByName('floor');
    const ceil  = this.roomGroup.getObjectByName('ceiling');
    const walls = this.roomGroup.getObjectByName('walls');

    if (surfaces.floor !== false && tiles.floor && floor) await apply('floor', floor, L, W);
    if (surfaces.ceiling && tiles.ceiling && ceil)          await apply('ceiling', ceil, L, W);
    if (tiles.wall && walls) {
      for (const w of walls.children) await apply('wall', w, w.userData.wallLen || L, H);
    }

         // ═══════════════════════════════════════════════
    // INDIVIDUAL TILE MODE
    // ═══════════════════════════════════════════════
    this.tileMeshes = [];
    const indSurfaces = ['floor', 'wall', 'accent', 'ceiling'];
    for (const srf of indSurfaces) {
      const st = tiles[srf];
      if (!st?.individualMode || !st?.url) continue;
      if (srf === 'floor') {
        await this._buildIndividualTiles('floor', st, L, W, 'floor');
      } else if (srf === 'ceiling' && surfaces.ceiling) {
        // ceiling needs its own group, but skip for now
      } else if (srf === 'wall' && walls) {
        // wall individual — skip complex case for now
      }
    }
   
     if (this.structGrp) {
      const makeMat = async (tileKey) => {
        const t = tiles[tileKey];
        if (!t?.url) return null;
        const tex = await loadTex(t.url);
        if (!tex) return null;
        const clone = tex.clone();
        clone.wrapS = clone.wrapT = THREE.RepeatWrapping;
        clone.colorSpace = THREE.SRGBColorSpace;
        clone.repeat.set(1.5, 1.5);
        clone.needsUpdate = true;
        return new THREE.MeshStandardMaterial({
          map: clone, color: 0xffffff, roughness: 0.4, metalness: 0.06
        });
      };

      for (const g of this.structGrp.children) {
        if (g.userData.structType !== 'stairs') continue;
        const tKey = g.userData.params?.treadMaterial;
        const rKey = g.userData.params?.riserMaterial;
        const tMat = (tKey && tKey !== 'solid') ? await makeMat(tKey) : null;
        const rMat = (rKey && rKey !== 'solid') ? await makeMat(rKey) : null;
        if (!tMat && !rMat) continue;
        g.children.forEach(child => {
          if (!child.isMesh) return;
          const geo = child.geometry;
          if (!geo?.parameters) return;
          const p = geo.parameters;
          if (p.depth != null && p.depth < 0.05) {
            if (rMat) child.material = rMat.clone();
          } else if (p.depth != null) {
            if (tMat) child.material = tMat.clone();
          }
        });
      }
    }
  }

  // ---------- FURNITURE ----------
  async _buildFurniture(state) {
    this._disposeGroup(this.furnitureGrp);
    const items = state.furniture || [];
    const lib = window.__id_library?.getItemById;
    if (!lib) return;

    for (let i = 0; i < items.length; i++) {
      const placed = items[i];

      if (placed.isCustom && placed.customUrl) {
        try {
          const grp = await this.loadModelFromURL(placed.customUrl, placed.customName, { targetMeters: 1.5 });
          grp.position.set((placed.x || 0) * FT, (placed.y || 0) * FT, (placed.z || 0) * FT);
          grp.rotation.y = (placed.rot || 0) * DEG;
          grp.scale.multiply(new THREE.Vector3(placed.sx || 1, placed.sy || 1, placed.sz || 1));
          grp.userData.stateIndex = i;
        } catch (e) { console.warn('custom model load failed:', e); }
        continue;
      }

      const def = lib(placed.id);
      if (!def?.parts) continue;
      const grp = new THREE.Group();
      grp.position.set((placed.x || 0) * FT, (placed.y || 0) * FT, (placed.z || 0) * FT);
      grp.rotation.y = (placed.rot || 0) * DEG;
      grp.scale.set(placed.sx || 1, placed.sy || 1, placed.sz || 1);

      for (const p of def.parts) {
        const mesh = this._buildPart(p, placed.color);
        if (mesh) { mesh.castShadow = true; mesh.receiveShadow = true; grp.add(mesh); }
      }
      if (def.light) {
        const lt = this._makeLight(def.light, grp.position);
        this.furnitureGrp.add(lt);
      }
      grp.userData.id = placed.id;
      grp.userData.stateIndex = i;
      this.furnitureGrp.add(grp);
    }
  }

  _buildPart(p, overrideColor) {
    const color = overrideColor || p.c;
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color || '#cccccc'), roughness: 0.6, metalness: 0.08
    });
    let geo;
    switch (p.t) {
      case 'box':   geo = new THREE.BoxGeometry(p.s[0]*FT, p.s[1]*FT, p.s[2]*FT); break;
      case 'cyl':   geo = new THREE.CylinderGeometry(p.rt*FT, p.rb*FT, p.h*FT, 24); break;
      case 'sph':   geo = new THREE.SphereGeometry(p.r*FT, 24, 16); break;
      case 'cone':  geo = new THREE.ConeGeometry(p.r*FT, p.h*FT, 24); break;
      case 'torus': geo = new THREE.TorusGeometry(p.r*FT, p.t*FT, 12, 32); break;
      case 'plane': geo = new THREE.PlaneGeometry(p.w*FT, p.h*FT); break;
      default: return null;
    }
    const mesh = new THREE.Mesh(geo, mat);
    if (p.p) mesh.position.set(p.p[0]*FT, p.p[1]*FT, p.p[2]*FT);
    if (p.r) mesh.rotation.set((p.r[0]||0)*DEG, (p.r[1]||0)*DEG, (p.r[2]||0)*DEG);
    return mesh;
  }

  _makeLight(def, pos) {
    let light;
    if (def.type === 'spot') {
      light = new THREE.SpotLight(def.color || 0xffffff, def.intensity || 1);
      light.angle = (def.angle || 30) * DEG;
      light.penumbra = 0.4;
    } else {
      light = new THREE.PointLight(def.color || 0xffffff, def.intensity || 1, def.dist || 12, 1.8);
    }
    light.position.copy(pos).add(new THREE.Vector3(0, 0.2, 0));
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.0005;
    return light;
  }

  // ---------- FREE MODEL LOADER ----------
  async loadModelFromURL(url, name, opts = {}) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        const model = gltf.scene;
        model.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = opts.targetMeters || 1.5;
        const scale = targetSize / Math.max(maxDim, 0.001);
        model.scale.setScalar(scale);
        bbox.setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());
        model.position.sub(center);
        bbox.setFromObject(model);
        model.position.y -= bbox.min.y;

        const grp = new THREE.Group();
        grp.add(model);
        const L = this.currentState?.room?.length || 12;
        const W = this.currentState?.room?.width  || 10;
        grp.position.set(
          (Math.random() - 0.5) * (L * FT * 0.4),
          0,
          (Math.random() - 0.5) * (W * FT * 0.4)
        );
        grp.userData.id = 'custom-' + Date.now();
        grp.userData.customName = name || 'Custom Model';
        grp.userData.isCustom = true;
        this.furnitureGrp.add(grp);
        resolve(grp);
      }, undefined, (err) => reject(err));
    });
  }

  // ---------- LIGHTS / OUTSIDE / CAMERA ----------
  _setupLights(state) {
    this.lights.forEach(l => this.scene.remove(l));
    this.lights = [];
    const mode = state.lightMode || 'day';
    let hemiSky, hemiGround, hemiInt, sunColor, sunInt, sunPos, ambient;
    switch (mode) {
      case 'sunset': hemiSky=0xffa060; hemiGround=0x403020; hemiInt=0.28; sunColor=0xffb37a; sunInt=1.0; sunPos=[-12,4,10]; ambient=0x1a1208; break;
      case 'night':  hemiSky=0x3a4a6a; hemiGround=0x080808; hemiInt=0.12; sunColor=0xc0d0ff; sunInt=0.18; sunPos=[-8,10,6];  ambient=0x080810; break;
      case 'studio': hemiSky=0xffffff; hemiGround=0xcccccc; hemiInt=0.45; sunColor=0xffffff; sunInt=0.9;  sunPos=[8,12,8];   ambient=0x282828; break;
      default:       hemiSky=0xb8d0e8; hemiGround=0x807060; hemiInt=0.32; sunColor=0xffeed0; sunInt=0.9; sunPos=[14,16,10]; ambient=0x282830;
    }
    const hemi = new THREE.HemisphereLight(hemiSky, hemiGround, hemiInt);
    this.scene.add(hemi); this.lights.push(hemi);
    const amb = new THREE.AmbientLight(ambient, 0.18);
    this.scene.add(amb); this.lights.push(amb);
    const sun = new THREE.DirectionalLight(sunColor, sunInt);
    sun.position.set(...sunPos);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -20; sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;   sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.05;
    this.scene.add(sun); this.lights.push(sun);
  }

  _setupOutside(state) {
    const oid = state.outside?.id || 'out-day';
    const def = window.__id_library?.getItemById?.(oid);
    const top    = def?.sky?.top    || '#4a9eff';
    const bottom = def?.sky?.bottom || '#c7e0ff';
    const cvs = document.createElement('canvas');
    cvs.width = 4; cvs.height = 512;
    const ctx = cvs.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 512);
    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.background = tex;
  }

  _setupCamera(state) {
    const b = this._roomBounds;
    const L = b.L, W = b.W, H = b.H;
    const cy = H / 2;
    let pos, target;
    switch (state.cameraView || 'iso') {
      case 'front':
        pos = [0, cy * 1.4, W * 1.3]; target = [0, cy * 0.9, -W * 0.4]; break;
      case 'top':
        pos = [0.001, Math.max(L, W) * 1.6, 0.001]; target = [0, 0, 0]; break;
      case 'corner':
        pos = [L * 0.7, H * 0.85, W * 0.7]; target = [0, cy * 0.4, 0]; break;
      default:
        pos = [L * 0.85, H * 1.3, W * 0.85]; target = [0, cy * 0.4, 0];
    }
    this.camera.position.set(...pos);
    this.controls.target.set(...target);
    this.controls.update();
  }

  _cullWalls() {
    if (!this.roomGroup || !this._roomCenter) return;
    const walls = this.roomGroup.getObjectByName('walls');
    if (!walls) return;
    const cam = this.camera.position;
    const center = this._roomCenter;
    walls.children.forEach(w => {
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(w.quaternion).normalize();
      const toCam    = new THREE.Vector3().subVectors(cam, w.position).normalize();
      const toCenter = new THREE.Vector3().subVectors(center, w.position).normalize();
      const camSide    = normal.dot(toCam);
      const centerSide = normal.dot(toCenter);
      w.visible = (camSide * centerSide) >= 0;
    });
  }

  // ---------- TIME / EXPOSURE / AMBIENT ----------
  setTimeOfDay(hour) {
    const t = ((hour % 24) + 24) % 24;
    const angle = (t / 24) * Math.PI * 2 - Math.PI / 2;
    const elev = Math.sin(angle);
    const azim = Math.cos(angle);
    const sunY = Math.max(elev, -0.2);

    let top, bottom, sunCol, sunInt, hemiSky, hemiGround, hemiInt, ambCol;
    if (t >= 6 && t < 8) {
      const k = (t - 6) / 2;
      top = lerpColor('#1a2540', '#6ab0e0', k);
      bottom = lerpColor('#ff8040', '#ffe0b0', k);
      sunCol = lerpColor('#ff6020', '#fff4e0', k);
      sunInt = 0.4 + k * 0.6;
      hemiSky = lerpColor('#5a4060', '#b8d0e8', k);
      hemiGround = '#504030'; hemiInt = 0.20 + k * 0.18;
      ambCol = lerpColor('#151018', '#282830', k);
    } else if (t >= 8 && t < 16) {
      top = '#78b0e8'; bottom = '#e8f4ff';
      sunCol = '#fff8e8'; sunInt = 1.0;
      hemiSky = '#c8dcf0'; hemiGround = '#909080'; hemiInt = 0.38;
      ambCol = '#303038';
    } else if (t >= 16 && t < 19) {
      const k = (t - 16) / 3;
      top = lerpColor('#78b0e8', '#3a2050', k);
      bottom = lerpColor('#ffe0b0', '#ff8050', k);
      sunCol = lerpColor('#fff4e0', '#ff7030', k);
      sunInt = 1.0 - k * 0.7;
      hemiSky = lerpColor('#c8dcf0', '#7a4858', k);
      hemiGround = '#504030'; hemiInt = 0.38 - k * 0.15;
      ambCol = lerpColor('#303038', '#1a1218', k);
    } else {
      top = '#0a0a20'; bottom = '#1a1a30';
      sunCol = '#8090b0'; sunInt = 0.12;
      hemiSky = '#2a3048'; hemiGround = '#080808'; hemiInt = 0.08;
      ambCol = '#080818';
    }

    const cvs = document.createElement('canvas');
    cvs.width = 4; cvs.height = 512;
    const ctx = cvs.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 512);
    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.background = tex;

    if (!this.lights || this.lights.length < 3) return;
    const hemi = this.lights.find(l => l.isHemisphereLight);
    const amb  = this.lights.find(l => l.isAmbientLight);
    const sun  = this.lights.find(l => l.isDirectionalLight);

    if (hemi) { hemi.color.set(hemiSky); hemi.groundColor.set(hemiGround); hemi.intensity = hemiInt; }
    if (amb) { amb.color.set(ambCol); }
    if (sun) {
      sun.color.set(sunCol);
      sun.intensity = sunInt;
      const r = 22;
      sun.position.set(azim * r, Math.max(sunY * r, 1.2), elev * 8 + 8);
    }
    this._renderOnce();
  }

  setExposure(v) {
    this.renderer.toneMappingExposure = Math.max(0.2, Math.min(1.2, v));
    this._renderOnce();
  }

  setAmbient(v) {
    const amb = this.lights?.find(l => l.isAmbientLight);
    if (amb) amb.intensity = Math.max(0, Math.min(1.0, v));
    this._renderOnce();
  }

  // ---------- RENDER API ----------
  async render(state) {
    this.currentState = state;
    this._buildRoom(state);
    await this._buildTiles(state);
    await this._buildFurniture(state);
    this._setupLights(state);
    this._setupOutside(state);
    this._setupCamera(state);
    this._renderOnce();
    this.controls.update();
  }

  async renderPreserveCamera(state) {
    const camPos = this.camera.position.clone();
    const camTarget = this.controls.target.clone();
    this.currentState = state;
    this._buildRoom(state);
    await this._buildTiles(state);
    await this._buildFurniture(state);
    this._setupLights(state);
    this._setupOutside(state);
    this.camera.position.copy(camPos);
    this.controls.target.copy(camTarget);
    this.controls.update();
    this._renderOnce();
  }

  _renderOnce() {
    if (!this.renderer || !this.scene || !this.camera) return;
    this._cullWalls();
    const wrap = this.canvas.parentElement;
    if (!wrap) return;
    this.renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  startLive() {
    if (this.animating) return;
    this.animating = true;
    const loop = () => {
      if (!this.animating) return;
      this.controls.update();
      this._cullWalls();
      if (this.composer) this.composer.render();
      else this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    loop();
  }
  stopLive() { this.animating = false; }

  // ---------- HD RENDER ----------
  async renderHD(onProgress) {
    this.stopLive();
    const wrap = this.canvas.parentElement;
    const cssW = wrap.clientWidth || 800;
    const cssH = wrap.clientHeight || 600;

    const maxDim = this.renderer.capabilities.maxTextureSize || 4096;
    let TW = Math.min(cssW * 2, maxDim);
    let TH = Math.min(cssH * 2, maxDim);
    TW = Math.floor(TW / 4) * 4;
    TH = Math.floor(TH / 4) * 4;
    if (TW < 16 || TH < 16) { TW = 1024; TH = 768; }

    const oldAspect = this.camera.aspect;
    this.camera.aspect = cssW / cssH;
    this.camera.updateProjectionMatrix();
    const oldPR = this.renderer.getPixelRatio();
    const oldSize = new THREE.Vector2();
    this.renderer.getSize(oldSize);
    const oldRT = this.renderer.getRenderTarget();

    let rt;
    try {
      rt = new THREE.WebGLRenderTarget(TW, TH, {
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat, type: THREE.UnsignedByteType,
        colorSpace: THREE.SRGBColorSpace,
        depthBuffer: true, stencilBuffer: false
      });
    } catch (e) {
      console.error('RT create failed', e);
      this.camera.aspect = oldAspect;
      this.camera.updateProjectionMatrix();
      return null;
    }

    this.renderer.setPixelRatio(1);
    this.renderer.setSize(TW, TH, false);

    const FRAMES = 16;
    const accum = new Float32Array(TW * TH * 4);
    const buf = new Uint8Array(TW * TH * 4);
    const camBase = this.camera.position.clone();
    const tgtBase = this.controls.target.clone();
    const t0 = performance.now();

    for (let i = 0; i < FRAMES; i++) {
      const jx = (Math.random() - 0.5) * 0.006;
      const jy = (Math.random() - 0.5) * 0.006;
      this.camera.position.copy(camBase).add(new THREE.Vector3(jx, jy, 0));
      this.camera.lookAt(tgtBase);
      try {
        this.renderer.setRenderTarget(rt);
        this.renderer.render(this.scene, this.camera);
        this.renderer.readRenderTargetPixels(rt, 0, 0, TW, TH, buf);
      } catch (e) { console.warn('readback failed', e); break; }
      for (let k = 0; k < buf.length; k++) accum[k] += buf[k];
      const elapsed = (performance.now() - t0) / 1000;
      onProgress?.({ frame: i + 1, total: FRAMES, percent: ((i + 1) / FRAMES) * 100, elapsed });
      await new Promise(r => setTimeout(r, 0));
    }
    for (let k = 0; k < accum.length; k++) accum[k] /= FRAMES;

    const out = document.createElement('canvas');
    out.width = TW; out.height = TH;
    const ctx = out.getContext('2d');
    const imgData = ctx.createImageData(TW, TH);
    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        const src = ((TH - 1 - y) * TW + x) * 4;
        const dst = (y * TW + x) * 4;
        imgData.data[dst]   = accum[src];
        imgData.data[dst+1] = accum[src+1];
        imgData.data[dst+2] = accum[src+2];
        imgData.data[dst+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    this.renderer.setPixelRatio(oldPR);
    this.renderer.setSize(oldSize.x, oldSize.y, false);
    this.renderer.setRenderTarget(oldRT);
    this.camera.aspect = oldAspect;
    this.camera.updateProjectionMatrix();
    this._hdCanvas = out;
    this._renderOnce();
    rt.dispose();
    const total = (performance.now() - t0) / 1000;
    return { canvas: out, seconds: total, width: TW, height: TH };
  }

  downloadHD(filename = `interior-render-${Date.now()}.png`) {
    const src = this._hdCanvas || this.canvas;
    const link = document.createElement('a');
    link.download = filename;
    link.href = src.toDataURL('image/png');
    link.click();
  }

  _disposeGroup(grp) {
    while (grp.children.length) {
      const c = grp.children.pop();
      grp.remove(c);
      c.traverse?.(o => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose?.());
          else o.material.dispose?.();
        }
      });
    }
  }

  dispose() {
    this.stopLive();
    this._disposeGroup(this.roomGroup);
    this._disposeGroup(this.furnitureGrp);
    this.renderer.dispose();
  }
}

if (typeof window !== 'undefined') {
  window.__id_engine = { InteriorEngine };
}
export { InteriorEngine };
