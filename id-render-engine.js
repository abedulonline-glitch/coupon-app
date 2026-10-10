/* ============================================================
   INTERIOR DESIGN STUDIO — id-render-engine.js  (v3 — clean)
   ============================================================ */

import * as THREE from 'three';
import { RoomEnvironment }   from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls }     from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFLoader }        from 'three/addons/loaders/GLTFLoader.js';

const FT  = 0.3048;
const DEG = Math.PI / 180;

class InteriorEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = null; this.scene = null; this.camera = null;
    this.controls = null; this.transform = null;
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
    this._onDown = this._onDown.bind(this);
    this._onKey  = this._onKey.bind(this);
    this._init();
  }

  _init() {
    const { canvas } = this;
    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
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
    window.addEventListener('keydown', this._onKey);

    const ro = new ResizeObserver(() => this._onResize());
    ro.observe(canvas.parentElement);
    this._onResize();
  }

  _onResize() {
    const wrap = this.canvas.parentElement;
    if (!wrap) return;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this._renderOnce();
  }

  // ---------- SELECTION ----------
  _onDown(e) {
    if (this.transform.dragging) return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const furnTargets = [];
    this.furnitureGrp.children.forEach(g => g.traverse(c => { if (c.isMesh) furnTargets.push(c); }));
    const fHits = this.raycaster.intersectObjects(furnTargets, false);
    if (fHits.length) {
      let obj = fHits[0].object;
      while (obj && obj.parent !== this.furnitureGrp) obj = obj.parent;
      if (obj) { this.selectFurniture(obj); this._clearStructSelection(); return; }
    }

    if (this.structGrp) {
      const sTargets = [];
      this.structGrp.children.forEach(g => g.traverse(c => { if (c.isMesh) sTargets.push(c); }));
      const sHits = this.raycaster.intersectObjects(sTargets, false);
      if (sHits.length) {
        let obj = sHits[0].object;
        while (obj && obj.parent !== this.structGrp) obj = obj.parent;
        if (obj) { this.selectStructure(obj); this.deselectFurniture(); return; }
      }
    }

    this.deselectFurniture();
    this._clearStructSelection();
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
      labels.push({ text: `প্রস্থ: ${p.width.toFixed(2)}m (${(p.width/FT).toFixed(1)}ft)`, localPos: new THREE.Vector3(0, p.height + 0.2, 0) });
      labels.push({ text: `উচ্চতা: ${p.height.toFixed(2)}m (${(p.height/FT).toFixed(1)}ft)`, localPos: new THREE.Vector3(p.width/2 + 0.3, p.height/2, 0) });
    } else if (t === 'window') {
      labels.push({ text: `প্রস্থ: ${p.width.toFixed(2)}m`, localPos: new THREE.Vector3(0, p.sill + p.height + 0.25, 0) });
      labels.push({ text: `সিল: ${p.sill.toFixed(2)}m`, localPos: new THREE.Vector3(-p.width/2 - 0.4, p.sill/2, 0) });
      labels.push({ text: `উচ্চতা: ${p.height.toFixed(2)}m`, localPos: new THREE.Vector3(p.width/2 + 0.3, p.sill + p.height/2, 0) });
    } else if (t === 'pillar') {
      labels.push({ text: `ব্যাস: ${(p.radius*2).toFixed(2)}m`, localPos: new THREE.Vector3(p.radius + 0.3, H/2, 0) });
      labels.push({ text: `উচ্চতা: ${H.toFixed(2)}m (${(H/FT).toFixed(1)}ft)`, localPos: new THREE.Vector3(0, H + 0.2, 0) });
    } else if (t === 'stairs') {
      labels.push({ text: `${p.steps} ধাপ · প্রস্থ ${p.width.toFixed(2)}m`, localPos: new THREE.Vector3(0, H + 0.2, 0) });
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
      color: 0xf5f5f5, roughness: 0.9, side: THREE.DoubleSide
    }));
    ceiling.position.y = H;
    ceiling.name = 'ceiling';
    this.roomGroup.add(ceiling);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.85, metalness: 0.02, side: THREE.DoubleSide
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
      walls.add(m);
    }
    this.roomGroup.add(walls);

    this._roomBounds = { pts, H, L: state.room.length * FT, W: state.room.width * FT };
    this._roomCenter = new THREE.Vector3(0, H / 2, 0);

    this._buildStructure3D(state, pts, H);
  }

   _defaultsForType(type) {
    if (type === 'door')   return { width: 0.9, height: 2.1, offsetX: 0 };
    if (type === 'window') return { width: 1.2, height: 1.2, sill: 0.9, offsetX: 0 };
    if (type === 'pillar') return { radius: 0.15, offsetX: 0, offsetZ: 0 };
    if (type === 'stairs') return { steps: 6, width: 1.2, depth: 0.28, materialSource: 'solid' };
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
      } else if (s.type === 'pillar') {
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(params.radius, params.radius, H, 16),
          new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.7 })
        );
        cyl.position.set(0, H/2, 0); g.add(cyl);
           } else if (s.type === 'stairs') {
        const steps = params.steps, stepW = params.width;
        const stepH = H / (steps + 2), stepD = params.depth || 0.28;
        const mat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.75 });
        for (let i = 0; i < steps; i++) {
          const sBox = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, stepD), mat);
          sBox.position.set(0, stepH * (i + 0.5), -i * stepD);
          g.add(sBox);
        }
      }

      g.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
           // Local offset (position along wall / custom X-Z)
      if (s.type === 'door' || s.type === 'window') {
        g.position.x = 0; // temporary — will be offset after rotation
      }
       g.position.set(wx, 0, wz);
      g.rotation.y = (s.rot || 0) * DEG;
             // apply offset along local axes
      if (s.type === 'door' || s.type === 'window') {
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
    this._renderOnce();
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

    const apply = async (surfaceName, mesh, wMeters, hMeters) => {
      const t = tiles[surfaceName];
      if (!t?.url || !mesh) return;
      const tex = await loadTex(t.url);
      if (!tex) return;
      const tileW = (t.size?.w || 600) / 1000;
      const tileH = (t.size?.h || 600) / 1000;
      const repX = wMeters / tileW;
      const repY = hMeters / tileH;
      const clone = tex.clone();
      clone.wrapS = clone.wrapT = THREE.RepeatWrapping;
      clone.colorSpace = THREE.SRGBColorSpace;
      clone.anisotropy = tex.anisotropy;
      clone.repeat.set(Math.max(repX, 0.01), Math.max(repY, 0.01));
      // Tile offset — individual positioning
      const offX = (t.offsetX || 0) / 1000 / tileW;
      const offY = (t.offsetY || 0) / 1000 / tileH;
      clone.offset.set(offX, offY);
      clone.rotation = (t.rot || 0) * DEG;
      clone.center.set(0.5, 0.5);
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

    // ---------- Apply material to stairs ----------
    if (this.structGrp) {
      const applyToGroup = async (grp, tileKey) => {
        const t = tiles[tileKey];
        if (!t?.url) return;
        const tex = await loadTex(t.url);
        if (!tex) return;
        grp.traverse(c => {
          if (!c.isMesh) return;
          const clone = tex.clone();
          clone.wrapS = clone.wrapT = THREE.RepeatWrapping;
          clone.colorSpace = THREE.SRGBColorSpace;
          clone.repeat.set(1.5, 1.5);
          clone.needsUpdate = true;
          c.material.map = clone;
          c.material.color.set(0xffffff);
          c.material.roughness = 0.4;
          c.material.metalness = 0.06;
          c.material.needsUpdate = true;
        });
      };

      for (const g of this.structGrp.children) {
        if (g.userData.structType !== 'stairs') continue;
        const src = g.userData.params?.materialSource;
        if (!src || src === 'solid') continue;
        await applyToGroup(g, src);
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
        const L = this.currentState.room.length, W = this.currentState.room.width;
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
      case 'sunset': hemiSky=0xffa060; hemiGround=0x504030; hemiInt=0.65; sunColor=0xffb37a; sunInt=2.2; sunPos=[-12,4,10]; ambient=0x2a1f1a; break;
      case 'night':  hemiSky=0x4a5a8a; hemiGround=0x101018; hemiInt=0.25; sunColor=0xc0d0ff; sunInt=0.4; sunPos=[-8,10,6];  ambient=0x101828; break;
      case 'studio': hemiSky=0xffffff; hemiGround=0xdddddd; hemiInt=1.0;  sunColor=0xffffff; sunInt=1.6; sunPos=[8,12,8];   ambient=0x404040; break;
      default:       hemiSky=0xd8ecff; hemiGround=0xa89880; hemiInt=0.85; sunColor=0xfff4e0; sunInt=2.2; sunPos=[14,16,10]; ambient=0x505060;
    }
    const hemi = new THREE.HemisphereLight(hemiSky, hemiGround, hemiInt);
    this.scene.add(hemi); this.lights.push(hemi);
    const amb = new THREE.AmbientLight(ambient, 0.55);
    this.scene.add(amb); this.lights.push(amb);
    const sun = new THREE.DirectionalLight(sunColor, sunInt);
    sun.position.set(...sunPos);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -20; sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;   sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
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

  // ---------- DOLLHOUSE WALL CULLING ----------
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
    this.renderer.render(this.scene, this.camera);
  }

  startLive() {
    if (this.animating) return;
    this.animating = true;
    const loop = () => {
      if (!this.animating) return;
      this.controls.update();
      this._cullWalls();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    loop();
  }
  stopLive() { this.animating = false; }

  // ---------- HD RENDER ----------
  async renderHD(onProgress) {
    this.stopLive();
    const wrap = this.canvas.parentElement;
    const cssW = wrap.clientWidth, cssH = wrap.clientHeight;
    const SS = 2;
    const TW = cssW * SS, TH = cssH * SS;

    const rt = new THREE.WebGLRenderTarget(TW, TH, {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace
    });

    const oldAspect = this.camera.aspect;
    this.camera.aspect = cssW / cssH;
    this.camera.updateProjectionMatrix();
    const oldPR = this.renderer.getPixelRatio();
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(TW, TH, false);

    const FRAMES = 24;
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
      this.renderer.setRenderTarget(rt);
      this.renderer.render(this.scene, this.camera);
      this.renderer.setRenderTarget(null);
      this.renderer.readRenderTargetPixels(rt, 0, 0, TW, TH, buf);
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
    this.renderer.setSize(cssW, cssH, false);
    this.renderer.setPixelRatio(oldPR);
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
