/* ============================================================
   INTERIOR DESIGN STUDIO — id-render-engine.js  (v2)
   নতুন: টাইল ক্যালক ফিক্স, 3D দরজা/জানালা/পিলার/সিঁড়ি,
         ফার্নিচার TransformControls (G/R/S), scale support
   ============================================================ */

import * as THREE from 'three';
import { RoomEnvironment }    from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls }      from 'three/addons/controls/OrbitControls.js';
import { TransformControls }  from 'three/addons/controls/TransformControls.js';

const FT  = 0.3048;
const DEG = Math.PI / 180;

class InteriorEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = null; this.scene = null; this.camera = null;
    this.controls = null; this.transform = null;
    this.roomGroup = null; this.furnitureGrp = null;
    this.lights = []; this.currentState = null;
    this.envTexture = null; this.animating = false;
    this.selected = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.transformMode = 'translate';
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
    this.controls.minDistance = 2;
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

  // ---------- SELECTION / TRANSFORM ----------
  _onDown(e) {
    if (this.transform.dragging) return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const targets = [];
    this.furnitureGrp.children.forEach(g => {
      g.traverse(c => { if (c.isMesh) targets.push(c); });
    });
    const hits = this.raycaster.intersectObjects(targets, false);
    if (hits.length) {
      let obj = hits[0].object;
      while (obj && obj.parent !== this.furnitureGrp) obj = obj.parent;
      if (obj) { this.selectFurniture(obj); return; }
    }
    this.deselectFurniture();
  }

  _onKey(e) {
    if (!this.selected) return;
    if (e.key === 'g' || e.key === 'G') this.setTransformMode('translate');
    if (e.key === 'r' || e.key === 'R') this.setTransformMode('rotate');
    if (e.key === 's' || e.key === 'S') this.setTransformMode('scale');
    if (e.key === 'Escape') this.deselectFurniture();
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const idx = this.selected.userData.stateIndex;
      if (idx != null) {
        const g = this.selected;
        this.transform.detach();
        this.furnitureGrp.remove(g);
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
      x: grp.position.x / FT,
      y: grp.position.y / FT,
      z: grp.position.z / FT,
      rot: grp.rotation.y / DEG,
      sx: grp.scale.x, sy: grp.scale.y, sz: grp.scale.z
    });
  }

  // ---------- ROOM SHAPE ----------
  _roomPoints(state) {
    const { shape, room, customPoints } = state;
    const L = room.length * FT, W = room.width * FT;
    const hL = L / 2, hW = W / 2;

    if (shape === 'custom' && customPoints?.length >= 3) {
      const cxs = customPoints.map(p => p.x);
      const cys = customPoints.map(p => p.y);
      const minX = Math.min(...cxs), maxX = Math.max(...cxs);
      const minY = Math.min(...cys), maxY = Math.max(...cys);
      const sx = L / Math.max(maxX - minX, 1);
      const sy = W / Math.max(maxY - minY, 1);
      return customPoints.map(p => new THREE.Vector2(
        (p.x - minX) * sx - L / 2,
        (p.y - minY) * sy - W / 2
      ));
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

  // ---------- ROOM BUILD ----------
  async _buildRoom(state) {
    this._disposeGroup(this.roomGroup);
    this._disposeGroup(this.furnitureGrp);

    const H = state.room.height * FT;
    const pts = this._roomPoints(state);
    const shape = new THREE.Shape(pts);

    // FLOOR
    const floorGeo = new THREE.ShapeGeometry(shape);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(
      floorGeo,
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.05 })
    );
    floor.receiveShadow = true;
    floor.name = 'floor';
    this.roomGroup.add(floor);

    // CEILING
    const ceilGeo = new THREE.ShapeGeometry(shape);
    ceilGeo.rotateX(Math.PI / 2);
    const ceiling = new THREE.Mesh(
      ceilGeo,
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.9 })
    );
    ceiling.position.y = H;
    ceiling.name = 'ceiling';
    this.roomGroup.add(ceiling);

    // WALLS
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
      m.userData.wallIndex = i;
      walls.add(m);
    }
    this.roomGroup.add(walls);
    this._roomBounds = { pts, H, L: state.room.length * FT, W: state.room.width * FT };

    // STRUCTURE — 3D doors/windows/pillars/stairs
    this._buildStructure3D(state, pts, H);
  }

  _buildStructure3D(state, pts, H) {
    const items = state.structure || [];
    if (!items.length) return;

    const grp = new THREE.Group();
    grp.name = 'structure';

    const xs = pts.map(p => p.x);
    const zs = pts.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const Rw = maxX - minX, Rd = maxZ - minZ;

    for (const s of items) {
      const nx = (s.x - 40) / 520;
      const nz = (s.y - 40) / 320;
      const wx = minX + nx * Rw;
      const wz = minZ + nz * Rd;

      if (s.type === 'door') {
        const g = new THREE.Group();
        const doorW = 0.9, doorH = 2.1;
        const fm = new THREE.MeshStandardMaterial({ color: 0x8b6f47, roughness: 0.6 });
        const fL = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.12), fm);
        fL.position.set(-doorW / 2, doorH / 2, 0); g.add(fL);
        const fR = fL.clone(); fR.position.x = doorW / 2; g.add(fR);
        const fT = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.16, 0.08, 0.12), fm);
        fT.position.y = doorH + 0.04; g.add(fT);
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(doorW - 0.04, doorH - 0.06, 0.06),
          new THREE.MeshStandardMaterial({ color: 0xa08060, roughness: 0.55 })
        );
        panel.position.y = doorH / 2; g.add(panel);
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 }));
        knob.position.set(doorW / 2 - 0.12, 1.05, 0.06); g.add(knob);
        g.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
        g.position.set(wx, 0, wz);
        grp.add(g);
      }
      else if (s.type === 'window') {
        const g = new THREE.Group();
        const winW = 1.2, winH = 1.2, sill = 0.9;
        const fm = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5, metalness: 0.1 });
        const hTop = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.1, 0.06, 0.1), fm);
        const hBot = hTop.clone();
        hTop.position.set(0, sill + winH, 0); hBot.position.set(0, sill, 0);
        const vL = new THREE.Mesh(new THREE.BoxGeometry(0.06, winH + 0.06, 0.1), fm);
        const vR = vL.clone();
        vL.position.set(-winW / 2, sill + winH / 2, 0);
        vR.position.set( winW / 2, sill + winH / 2, 0);
        g.add(hTop, hBot, vL, vR);
        const glass = new THREE.Mesh(
          new THREE.PlaneGeometry(winW, winH),
          new THREE.MeshPhysicalMaterial({
            color: 0x88bbdd, transparent: true, opacity: 0.35,
            roughness: 0.05, metalness: 0.1, transmission: 0.9, thickness: 0.02
          })
        );
        glass.position.set(0, sill + winH / 2, 0);
        g.add(glass);
        g.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
        g.position.set(wx, 0, wz);
        grp.add(g);
      }
      else if (s.type === 'pillar') {
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, H, 16),
          new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.7 })
        );
        cyl.position.set(wx, H / 2, wz);
        cyl.castShadow = true; cyl.receiveShadow = true;
        grp.add(cyl);
      }
      else if (s.type === 'stairs') {
        const g = new THREE.Group();
        const steps = 6, stepH = H / (steps + 2), stepD = 0.28, stepW = 1.2;
        const mat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.75 });
        for (let i = 0; i < steps; i++) {
          const sBox = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, stepD), mat);
          sBox.position.set(0, stepH * (i + 0.5), -i * stepD);
          sBox.castShadow = true; sBox.receiveShadow = true;
          g.add(sBox);
        }
        g.position.set(wx, 0, wz);
        grp.add(g);
      }
    }
    this.roomGroup.add(grp);
  }

  // ---------- TILES (FIXED) ----------
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

      const tileW = (t.size?.w || 600) / 1000;   // mm → m
      const tileH = (t.size?.h || 600) / 1000;

      // ✅ সরাসরি room dimension থেকে হিসাব — সঠিক
      const repX = wMeters / tileW;
      const repY = hMeters / tileH;

      const clone = tex.clone();
      clone.wrapS = clone.wrapT = THREE.RepeatWrapping;
      clone.colorSpace = THREE.SRGBColorSpace;
      clone.anisotropy = tex.anisotropy;
      clone.repeat.set(Math.max(repX, 0.01), Math.max(repY, 0.01));
      clone.rotation = (t.rot || 0) * DEG;
      clone.center.set(0.5, 0.5);
      clone.needsUpdate = true;

      mesh.material.map = clone;
      mesh.material.color.set(0xffffff);
      mesh.material.roughness = 0.35;
      mesh.material.metalness = 0.08;
      mesh.material.needsUpdate = true;
    };

    const L = state.room.length * FT;
    const W = state.room.width * FT;
    const H = state.room.height * FT;

    const floor = this.roomGroup.getObjectByName('floor');
    const ceil  = this.roomGroup.getObjectByName('ceiling');
    const walls = this.roomGroup.getObjectByName('walls');

    if (surfaces.floor !== false && tiles.floor && floor)
      await apply('floor', floor, L, W);
    if (surfaces.ceiling && tiles.ceiling && ceil)
      await apply('ceiling', ceil, L, W);
    if (tiles.wall && walls) {
      for (const w of walls.children) {
        await apply('wall', w, w.userData.wallLen || L, H);
      }
    }
    if (tiles.accent && walls) {
      const first = walls.children[0];
      if (first) await apply('accent', first, first.userData.wallLen || L, H);
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
      color: new THREE.Color(color || '#cccccc'),
      roughness: 0.6, metalness: 0.08
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
    if (p.r) mesh.rotation.set(
      (p.r[0]||0)*DEG, (p.r[1]||0)*DEG, (p.r[2]||0)*DEG
    );
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
      default:       hemiSky=0xcfe4ff; hemiGround=0x8a7a68; hemiInt=0.75; sunColor=0xfff4e0; sunInt=2.4; sunPos=[14,16,10]; ambient=0x404050;
    }
    const hemi = new THREE.HemisphereLight(hemiSky, hemiGround, hemiInt);
    this.scene.add(hemi); this.lights.push(hemi);
    const amb = new THREE.AmbientLight(ambient, 0.35);
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
    const H = b.H, cy = H / 2;
    const size = Math.max(6, H * 2);
    let pos, target;
    switch (state.cameraView || 'iso') {
      case 'front':  pos=[0, cy, size*1.6]; target=[0, cy, 0]; break;
      case 'top':    pos=[0, size*1.8, 0.01]; target=[0, 0, 0]; break;
      case 'corner': pos=[size, size, size]; target=[0, cy*0.7, 0]; break;
      default:       pos=[size*0.9, size*0.8, size*0.9]; target=[0, cy*0.6, 0];
    }
    this.camera.position.set(...pos);
    this.controls.target.set(...target);
    this.controls.update();
  }

  async render(state) {
    this.currentState = state;
    await this._buildRoom(state);
    await this._buildTiles(state);
    await this._buildFurniture(state);
    this._setupLights(state);
    this._setupOutside(state);
    this._setupCamera(state);
    this._renderOnce();
    this.controls.update();
  }

  // ফার্নিচার যোগ করলে ক্যামেরা না সরিয়ে রিফ্রেশ
  async renderPreserveCamera(state) {
    const camPos = this.camera.position.clone();
    const camTarget = this.controls.target.clone();
    this.currentState = state;
    await this._buildRoom(state);
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
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    loop();
  }
  stopLive() { this.animating = false; }

  async renderHD(onProgress) {
    this.stopLive();
    const wrap = this.canvas.parentElement;
    const cssW = wrap.clientWidth, cssH = wrap.clientHeight;
    const SS = 2;
    const TARGET_W = cssW * SS, TARGET_H = cssH * SS;

    const rt = new THREE.WebGLRenderTarget(TARGET_W, TARGET_H, {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace
    });

    const oldAspect = this.camera.aspect;
    this.camera.aspect = cssW / cssH;
    this.camera.updateProjectionMatrix();
    const oldPR = this.renderer.getPixelRatio();
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(TARGET_W, TARGET_H, false);

    const FRAMES = 24;
    const accum = new Float32Array(TARGET_W * TARGET_H * 4);
    const buf = new Uint8Array(TARGET_W * TARGET_H * 4);
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
      this.renderer.readRenderTargetPixels(rt, 0, 0, TARGET_W, TARGET_H, buf);
      for (let k = 0; k < buf.length; k++) accum[k] += buf[k];
      const elapsed = (performance.now() - t0) / 1000;
      onProgress?.({ frame: i + 1, total: FRAMES, percent: ((i + 1) / FRAMES) * 100, elapsed });
      await new Promise(r => setTimeout(r, 0));
    }
    for (let k = 0; k < accum.length; k++) accum[k] /= FRAMES;

    const out = document.createElement('canvas');
    out.width = TARGET_W; out.height = TARGET_H;
    const ctx = out.getContext('2d');
    const imgData = ctx.createImageData(TARGET_W, TARGET_H);
    for (let y = 0; y < TARGET_H; y++) {
      for (let x = 0; x < TARGET_W; x++) {
        const src = ((TARGET_H - 1 - y) * TARGET_W + x) * 4;
        const dst = (y * TARGET_W + x) * 4;
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
    this.renderer.render(this.scene, this.camera);
    rt.dispose();
    const total = (performance.now() - t0) / 1000;
    return { canvas: out, seconds: total, width: TARGET_W, height: TARGET_H };
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
