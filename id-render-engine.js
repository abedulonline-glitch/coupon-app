/* ============================================================
   INTERIOR DESIGN STUDIO — id-render-engine.js
   Three.js ইঞ্জিন: রুম বিল্ড, টাইল ম্যাপিং, ফার্নিচার, লাইটিং,
   লাইভ প্রিভিউ + HD ফাইনাল রেন্ডার (4× SSAA + progressive)
   প্রিফিক্স: id-  |  নতুন Class নেই
   ============================================================ */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls }    from 'three/addons/controls/OrbitControls.js';

const FT = 0.3048;                 // 1 foot = 0.3048 m
const DEG = Math.PI / 180;

// ============================================================
// ENGINE CLASS
// ============================================================
class InteriorEngine {
  constructor(canvas) {
    this.canvas   = canvas;
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.controls = null;
    this.roomGroup     = null;
    this.furnitureGrp  = null;
    this.tileMats      = { floor: null, wall: null, accent: null, ceiling: null };
    this.lights        = [];
    this.currentState  = null;
    this.envTexture    = null;
    this.animating     = false;
    this._init();
  }

  // ---------- INIT ----------
  _init() {
    const { canvas } = this;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace   = THREE.SRGBColorSpace;
    this.renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled  = true;
    this.renderer.shadowMap.type     = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0f1117');

    this.camera = new THREE.PerspectiveCamera(55, 16/9, 0.05, 500);
    this.camera.position.set(8, 6, 12);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance   = 2;
    this.controls.maxDistance   = 60;
    this.controls.maxPolarAngle = Math.PI * 0.495;

    // Environment (PMREM from RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.envTexture;

    this.roomGroup    = new THREE.Group();
    this.furnitureGrp = new THREE.Group();
    this.scene.add(this.roomGroup, this.furnitureGrp);

    // Resize observer
    const ro = new ResizeObserver(() => this._onResize());
    ro.observe(canvas.parentElement);
    this._onResize();
  }

  _onResize() {
    const wrap = this.canvas.parentElement;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this._renderOnce();
  }

  // ============================================================
  // PUBLIC — render full state
  // state = {
  //   room:{type,length,width,height},
  //   shape:'rect'|'square'|'hex'|'oct'|'L'|'custom',
  //   customPoints:[{x,y}...],       // ft, only for custom
  //   structure:[{type:'door'|'window'|'stairs'|'pillar', x,y,rot}],
  //   surfaces:{floor:bool,wall:bool,ceiling:bool,accent:bool},
  //   tiles:{ floor:{url,size:{w,h},rot,grout},
  //           wall:{...}, accent:{...}, ceiling:{...} },
  //   furniture:[{ id, x, y, z, rot, color }],
  //   outside:{id},
  //   lightMode:'day'|'sunset'|'night'|'studio',
  //   cameraView:'front'|'top'|'iso'|'corner'
  // }
  // ============================================================
  async render(state) {
    this.currentState = state;
    await this._buildRoom(state);
    this._buildTiles(state);
    await this._buildFurniture(state);
    this._setupLights(state);
    this._setupOutside(state);
    this._setupCamera(state);
    this._renderOnce();
    this.controls.update();
  }

  // ---------- ROOM SHAPE ----------
  _roomPoints(state) {
    const { shape, room, customPoints } = state;
    const L = room.length * FT;
    const W = room.width  * FT;
    const hL = L / 2, hW = W / 2;

    if (shape === 'custom' && customPoints?.length >= 3) {
      return customPoints.map(p => new THREE.Vector2(p.x * FT, p.y * FT));
    }
    if (shape === 'hex') {
      const r = Math.max(L, W) / 2;
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
      }
      return pts;
    }
    if (shape === 'oct') {
      const r = Math.max(L, W) / 2;
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
      }
      return pts;
    }
    if (shape === 'L') {
      return [
        new THREE.Vector2(-hL, -hW),
        new THREE.Vector2( hL, -hW),
        new THREE.Vector2( hL,  0),
        new THREE.Vector2( 0,   0),
        new THREE.Vector2( 0,   hW),
        new THREE.Vector2(-hL,  hW)
      ];
    }
    // rect / square
    return [
      new THREE.Vector2(-hL, -hW),
      new THREE.Vector2( hL, -hW),
      new THREE.Vector2( hL,  hW),
      new THREE.Vector2(-hL,  hW)
    ];
  }

  async _buildRoom(state) {
    // clear
    this._disposeGroup(this.roomGroup);
    const H = state.room.height * FT;
    const pts = this._roomPoints(state);
    const shape = new THREE.Shape(pts);

    // FLOOR
    const floorGeo = new THREE.ShapeGeometry(shape);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.55, metalness: 0.05, side: THREE.FrontSide
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    floor.name = 'floor';
    this.roomGroup.add(floor);

    // CEILING
    const ceilGeo = new THREE.ShapeGeometry(shape);
    ceilGeo.rotateX(Math.PI / 2);
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5, roughness: 0.9, metalness: 0, side: THREE.FrontSide
    });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.position.y = H;
    ceiling.name = 'ceiling';
    this.roomGroup.add(ceiling);

    // WALLS  (extrude each edge as a plane)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.85, metalness: 0.02, side: THREE.DoubleSide
    });
    const walls = new THREE.Group();
    walls.name = 'walls';
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const dx = b.x - a.x, dz = b.y - a.y;
      const len = Math.hypot(dx, dz);
      if (len < 0.01) continue;
      const geo = new THREE.PlaneGeometry(len, H);
      const m = new THREE.Mesh(geo, wallMat.clone());
      m.position.set((a.x + b.x) / 2, H / 2, (a.y + b.y) / 2);
      m.rotation.y = Math.atan2(dx, dz) - Math.PI / 2;
      m.receiveShadow = true;
      m.castShadow    = false;
      m.userData.wallIndex = i;
      walls.add(m);
    }
    this.roomGroup.add(walls);
    this._roomBounds = { pts, H };
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
      loader.load(url,
        (tex) => {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
          texCache[url] = tex;
          res(tex);
        },
        undefined,
        () => res(null)
      );
    });

    const applyTile = async (surfaceName, meshList) => {
      const t = tiles[surfaceName];
      if (!t?.url) return;
      const tex = await loadTex(t.url);
      if (!tex) return;
      const sizeW = (t.size?.w || 600) / 1000; // mm → m
      const sizeH = (t.size?.h || 600) / 1000;
      const rot   = (t.rot || 0) * DEG;

      meshList.forEach((mesh) => {
        const clone = tex.clone();
        clone.needsUpdate = true;
        // compute repeat from geometry size
        const bbox = new THREE.Box3().setFromObject(mesh);
        const sz = bbox.getSize(new THREE.Vector3());
        const repX = Math.max(sz.x, 0.01) / Math.max(sizeW, 0.01);
        const repZ = Math.max(sz.z, 0.01) / Math.max(sizeH, 0.01);
        const repY = Math.max(sz.y, 0.01) / Math.max(sizeH, 0.01);

        if (mesh.name === 'floor' || mesh.name === 'ceiling') {
          clone.repeat.set(repX, repZ);
        } else {
          clone.repeat.set(repX || repZ, repY);
        }
        clone.rotation = rot;
        clone.center.set(0.5, 0.5);

        mesh.material.map = clone;
        mesh.material.color.set(0xffffff);
        mesh.material.roughness = 0.35;
        mesh.material.metalness = 0.08;
        mesh.material.needsUpdate = true;
      });
    };

    const floor = this.roomGroup.getObjectByName('floor');
    const ceil  = this.roomGroup.getObjectByName('ceiling');
    const walls = this.roomGroup.getObjectByName('walls');

    if (surfaces.floor !== false && tiles.floor)
      await applyTile('floor', floor ? [floor] : []);
    if (surfaces.ceiling && tiles.ceiling)
      await applyTile('ceiling', ceil ? [ceil] : []);
    if (tiles.wall && walls)
      await applyTile('wall', walls.children);
  }

  // ---------- FURNITURE ----------
  async _buildFurniture(state) {
    this._disposeGroup(this.furnitureGrp);
    const items = state.furniture || [];
    const lib = window.__id_library?.getItemById;
    if (!lib) return;

    for (const placed of items) {
      const def = lib(placed.id);
      if (!def?.parts) continue;
      const grp = new THREE.Group();
      grp.position.set((placed.x || 0) * FT, (placed.y || 0) * FT, (placed.z || 0) * FT);
      grp.rotation.y = (placed.rot || 0) * DEG;

      for (const p of def.parts) {
        const mesh = this._buildPart(p, placed.color);
        if (mesh) {
          mesh.castShadow    = true;
          mesh.receiveShadow = true;
          grp.add(mesh);
        }
      }

      // Point lights inside the group (for lamps)
      if (def.light) {
        const lt = this._makeLight(def.light, grp.position);
        this.furnitureGrp.add(lt);
      }

      grp.userData.id = placed.id;
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
      case 'box':
        geo = new THREE.BoxGeometry(p.s[0] * FT, p.s[1] * FT, p.s[2] * FT);
        break;
      case 'cyl':
        geo = new THREE.CylinderGeometry(
          p.rt * FT, p.rb * FT, p.h * FT, 24
        );
        break;
      case 'sph':
        geo = new THREE.SphereGeometry(p.r * FT, 24, 16);
        break;
      case 'cone':
        geo = new THREE.ConeGeometry(p.r * FT, p.h * FT, 24);
        break;
      case 'torus':
        geo = new THREE.TorusGeometry(p.r * FT, p.t * FT, 12, 32);
        break;
      case 'plane':
        geo = new THREE.PlaneGeometry(p.w * FT, p.h * FT);
        break;
      default:
        return null;
    }
    const mesh = new THREE.Mesh(geo, mat);
    if (p.p) mesh.position.set(p.p[0] * FT, p.p[1] * FT, p.p[2] * FT);
    if (p.r) mesh.rotation.set(
      (p.r[0] || 0) * DEG, (p.r[1] || 0) * DEG, (p.r[2] || 0) * DEG
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

  // ---------- LIGHTING MODES ----------
  _setupLights(state) {
    // remove old scene-lights
    this.lights.forEach(l => this.scene.remove(l));
    this.lights = [];

    // exterior hemisphere + sun
    const mode = state.lightMode || 'day';
    let hemiSky, hemiGround, hemiInt, sunColor, sunInt, sunPos, ambient;

    switch (mode) {
      case 'sunset':
        hemiSky = 0xffa060; hemiGround = 0x504030; hemiInt = 0.65;
        sunColor = 0xffb37a; sunInt = 2.2; sunPos = [-12, 4, 10]; ambient = 0x2a1f1a;
        break;
      case 'night':
        hemiSky = 0x4a5a8a; hemiGround = 0x101018; hemiInt = 0.25;
        sunColor = 0xc0d0ff; sunInt = 0.4; sunPos = [-8, 10, 6]; ambient = 0x101828;
        break;
      case 'studio':
        hemiSky = 0xffffff; hemiGround = 0xdddddd; hemiInt = 1.0;
        sunColor = 0xffffff; sunInt = 1.6; sunPos = [8, 12, 8]; ambient = 0x404040;
        break;
      default: // day
        hemiSky = 0xcfe4ff; hemiGround = 0x8a7a68; hemiInt = 0.75;
        sunColor = 0xfff4e0; sunInt = 2.4; sunPos = [14, 16, 10]; ambient = 0x404050;
    }

    const hemi = new THREE.HemisphereLight(hemiSky, hemiGround, hemiInt);
    this.scene.add(hemi); this.lights.push(hemi);

    const amb = new THREE.AmbientLight(ambient, 0.35);
    this.scene.add(amb); this.lights.push(amb);

    const sun = new THREE.DirectionalLight(sunColor, sunInt);
    sun.position.set(...sunPos);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far  = 80;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    this.scene.add(sun); this.lights.push(sun);
  }

  // ---------- OUTSIDE ----------
  _setupOutside(state) {
    const oid = state.outside?.id || 'out-day';
    const def = window.__id_library?.getItemById?.(oid);
    const top    = def?.sky?.top    || '#4a9eff';
    const bottom = def?.sky?.bottom || '#c7e0ff';

    // Background gradient via simple canvas texture
    const cvs = document.createElement('canvas');
    cvs.width = 4; cvs.height = 512;
    const ctx = cvs.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 512);
    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.background = tex;
  }

  // ---------- CAMERA ----------
  _setupCamera(state) {
    const b = this._roomBounds;
    const H = b.H;
    const cx = 0, cy = H / 2, cz = 0;
    const size = Math.max(6, H * 2);

    let pos, target;
    const view = state.cameraView || 'iso';
    switch (view) {
      case 'front':
        pos = [0, cy, size * 1.6]; target = [0, cy, 0]; break;
      case 'top':
        pos = [0, size * 1.8, 0.01]; target = [0, 0, 0]; break;
      case 'corner':
        pos = [size, size, size]; target = [0, cy * 0.7, 0]; break;
      default: // iso
        pos = [size * 0.9, size * 0.8, size * 0.9]; target = [0, cy * 0.6, 0];
    }
    this.camera.position.set(...pos);
    this.controls.target.set(...target);
    this.controls.update();
  }

  // ============================================================
  // LIVE PREVIEW
  // ============================================================
  _renderOnce() {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.renderer.setSize(
      this.canvas.parentElement.clientWidth,
      this.canvas.parentElement.clientHeight,
      false
    );
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

  // ============================================================
  // FINAL HD RENDER  —  4× SSAA + progressive accumulation
  // ============================================================
  async renderHD(onProgress) {
    this.stopLive();

    const wrap = this.canvas.parentElement;
    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;

    const SS = 2;                    // supersample factor (2 → 4× pixels)
    const TARGET_W = cssW * SS;
    const TARGET_H = cssH * SS;

    // Render offscreen at high res
    const rt = new THREE.WebGLRenderTarget(TARGET_W, TARGET_H, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace
    });

    const oldAspect = this.camera.aspect;
    this.camera.aspect = cssW / cssH;
    this.camera.updateProjectionMatrix();

    const oldPixelRatio = this.renderer.getPixelRatio();
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(TARGET_W, TARGET_H, false);

    // Progressive accumulation: 24 frames with slight camera jitter
    const FRAMES = 24;
    const accum  = new Float32Array(TARGET_W * TARGET_H * 4);
    const buf    = new Uint8Array(TARGET_W * TARGET_H * 4);
    const camBase = this.camera.position.clone();
    const tgtBase = this.controls.target.clone();

    const t0 = performance.now();

    for (let i = 0; i < FRAMES; i++) {
      // jitter camera subpixel
      const jx = (Math.random() - 0.5) * 0.006;
      const jy = (Math.random() - 0.5) * 0.006;
      this.camera.position.copy(camBase).add(
        new THREE.Vector3(jx, jy, 0).applyQuaternion(this.camera.quaternion)
      );
      this.camera.lookAt(tgtBase);

      this.renderer.setRenderTarget(rt);
      this.renderer.render(this.scene, this.camera);
      this.renderer.setRenderTarget(null);

      this.renderer.readRenderTargetPixels(rt, 0, 0, TARGET_W, TARGET_H, buf);

      for (let k = 0; k < buf.length; k++) accum[k] += buf[k];

      const elapsed = (performance.now() - t0) / 1000;
      onProgress?.({
        frame: i + 1,
        total: FRAMES,
        percent: ((i + 1) / FRAMES) * 100,
        elapsed
      });

      // yield to UI
      await new Promise(r => setTimeout(r, 0));
    }

    // average
    for (let k = 0; k < accum.length; k++) accum[k] /= FRAMES;

    // write to 2D canvas (flip Y)
    const out = document.createElement('canvas');
    out.width  = TARGET_W;
    out.height = TARGET_H;
    const ctx = out.getContext('2d');
    const imgData = ctx.createImageData(TARGET_W, TARGET_H);
    for (let y = 0; y < TARGET_H; y++) {
      for (let x = 0; x < TARGET_W; x++) {
        const src = ((TARGET_H - 1 - y) * TARGET_W + x) * 4;
        const dst = (y * TARGET_W + x) * 4;
        imgData.data[dst]     = accum[src];
        imgData.data[dst + 1] = accum[src + 1];
        imgData.data[dst + 2] = accum[src + 2];
        imgData.data[dst + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // draw to visible canvas at CSS size for preview
    this.renderer.setSize(cssW, cssH, false);
    this.renderer.setPixelRatio(oldPixelRatio);
    this.camera.aspect = oldAspect;
    this.camera.updateProjectionMatrix();

    // store HD result for download
    this._hdCanvas = out;
    this.renderer.render(this.scene, this.camera);

    rt.dispose();

    const total = (performance.now() - t0) / 1000;
    return { canvas: out, seconds: total, width: TARGET_W, height: TARGET_H };
  }

  // ---------- DOWNLOAD ----------
  downloadHD(filename = `interior-render-${Date.now()}.png`) {
    const src = this._hdCanvas || this.canvas;
    const link = document.createElement('a');
    link.download = filename;
    link.href = src.toDataURL('image/png');
    link.click();
  }

  // ---------- UTIL ----------
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

// ============================================================
// GLOBAL EXPORT
// ============================================================
if (typeof window !== 'undefined') {
  window.__id_engine = { InteriorEngine };
}

export { InteriorEngine };
