/* ============================================================
   Interior Design Studio — id-stair-chamber.js  (v8 — Final)
   ============================================================ */

import * as THREE from 'three';

const FT  = 0.3048;
const MM  = 0.001;

// ============================================================
// MIN CHAMBER SIZE CALCULATOR
// ============================================================
export function computeMinChamberSize(cfg) {
  const stairW_m = cfg.stair.width * MM;
  const runM_m   = cfg.stair.treadDepth * MM;
  const totalH   = cfg.stair.totalHeight;

  const totalSteps = cfg.stair.autoSteps
    ? Math.max(3, Math.round(totalH / 180))
    : cfg.stair.totalSteps;

  const stepsPerFlight = Math.ceil(totalSteps / 2);
  const landingDepth_m = stairW_m;

  const middleGap_m = 0.05;
  const wallT_m     = 0.08;
  const clearance_m = 0.20;

  let w_m, l_m;

  if ((cfg.stair.type || 'straight') === 'double-fold') {
    w_m = 2 * stairW_m + middleGap_m + 2 * wallT_m + 0.05;
    l_m = stepsPerFlight * runM_m + landingDepth_m + 2 * clearance_m + 2 * wallT_m;
  } else {
    w_m = stairW_m + 2 * wallT_m + 0.10;
    l_m = totalSteps * runM_m + 2 * clearance_m + 2 * wallT_m;
  }

  return {
    w_ft: Math.ceil((w_m / FT) * 2) / 2,
    l_ft: Math.ceil((l_m / FT) * 2) / 2,
    w_m, l_m
  };
}

// ============================================================
// STAIR STATS
// ============================================================
export function calcStairStats(cfg) {
  const totalH = cfg.stair.totalHeight;
  const treadT = cfg.stair.treadThickness;
  const riserT = cfg.stair.riserThickness;
  const runMm  = cfg.stair.treadDepth;

  let steps = cfg.stair.totalSteps;
  if (cfg.stair.autoSteps) {
    steps = Math.max(3, Math.round(totalH / 180));
  }

  const effectiveRise = totalH / steps;
  const pureRise = effectiveRise - treadT;
  const stairLength = steps * runMm;

  return { steps, effectiveRise, pureRise, stairLength, treadT, riserT, runMm };
}

// ============================================================
// BUILD STAIR CHAMBER
// ============================================================
export function buildStairChamber(scene, cfg, mainRoomBounds, tiles) {
  const minSize = computeMinChamberSize(cfg);
  const actualW_ft = Math.max(cfg.size.w, minSize.w_ft);
  const actualL_ft = Math.max(cfg.size.l, minSize.l_ft);

  const group = new THREE.Group();
  group.name = 'stair-chamber';

  const stats = calcStairStats(cfg);

  const W = actualW_ft * FT;
  const L = actualL_ft * FT;
  const H = cfg.wallHeight * FT;

  const offset = computeChamberOffset(cfg, mainRoomBounds, W, L);

  // FLOOR
  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.floorColor || '#ffffff'),
    roughness: 0.55, metalness: 0.05
  });
  const floorGeo = new THREE.PlaneGeometry(W, L);
  floorGeo.rotateX(-Math.PI / 2);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(offset.x, 0.001, offset.z);
  floor.receiveShadow = true;
  group.add(floor);

  // CEILING
  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd, roughness: 0.9, side: THREE.DoubleSide
  });
  const ceilGeo = new THREE.PlaneGeometry(W, L);
  ceilGeo.rotateX(Math.PI / 2);
  const ceil = new THREE.Mesh(ceilGeo, ceilMat);
  ceil.position.set(offset.x, H, offset.z);
  ceil.userData.isChamberCeiling = true;
  group.add(ceil);

  // WALLS
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.wallColor || '#f0f0f0'),
    roughness: 0.85, metalness: 0.02, side: THREE.DoubleSide
  });

  const halfW = W / 2, halfL = L / 2;
  const attachSide = cfg.position;
  const doorW = (cfg.door.width || 900) * MM;
  const doorH = (cfg.door.height || 2100) * MM;

  const walls = [
    { name: 'north', x: offset.x, z: offset.z - halfL, rY: 0,         len: W },
    { name: 'south', x: offset.x, z: offset.z + halfL, rY: 0,         len: W },
    { name: 'east',  x: offset.x + halfW, z: offset.z, rY: Math.PI/2, len: L },
    { name: 'west',  x: offset.x - halfW, z: offset.z, rY: Math.PI/2, len: L }
  ];

  const attachMap = {
    right: 'west', left: 'east', top: 'south', bottom: 'north'
  };
  const attachWall = attachMap[attachSide] || 'west';

  const center = new THREE.Vector3(offset.x, H / 2, offset.z);
  const chamberWalls = [];

  walls.forEach(w => {
    const isAttach = (w.name === attachWall);
    if (isAttach && cfg.door.enabled) {
      const segs = buildWallWithDoor(w.len, H, doorW, doorH, cfg.door.offsetFromCorner * MM);
      segs.forEach(seg => {
        const g = new THREE.BoxGeometry(seg.w, seg.h, 0.08);
        const m = new THREE.Mesh(g, wallMat.clone());
        m.position.set(w.x, seg.y, w.z);
        m.rotation.y = w.rY;
        const along = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0,1,0), w.rY);
        m.position.x += along.x * seg.offset;
        m.position.z += along.z * seg.offset;
        m.receiveShadow = true;
        m.userData.isChamberWall = true;
        chamberWalls.push(m);
        group.add(m);
      });
    } else {
      const g = new THREE.BoxGeometry(w.len, H, 0.08);
      const m = new THREE.Mesh(g, wallMat.clone());
      m.position.set(w.x, H / 2, w.z);
      m.rotation.y = w.rY;
      m.receiveShadow = true;
      m.userData.isChamberWall = true;
      chamberWalls.push(m);
      group.add(m);
    }
  });

  // STAIRCASE
  const stairGroup = buildStaircase(cfg, stats, W, L, H);

  const doorRotations = {
    'south': 0,
    'north': Math.PI,
    'west': -Math.PI / 2,
    'east': Math.PI / 2
  };
  stairGroup.rotation.y = (doorRotations[attachWall] || 0) + Math.PI / 2;
  stairGroup.position.set(offset.x, 0, offset.z);
  group.add(stairGroup);

  // RAILING (straight only)
    // ─── CHAMBER SKIRTING ───
  _buildChamberSkirting(cfg, walls, attachWall, doorW, doorH, offset, group);

   if (cfg.railing.enabled && (cfg.stair?.type || 'straight') === 'straight') {
    const rails = buildRailing(cfg, stats);
    rails.position.copy(stairGroup.position);
    rails.rotation.copy(stairGroup.rotation);
    group.add(rails);
  }

  scene.add(group);
  return { group, stats, offset, size: { W, L, H }, chamberWalls, center };
}

// ============================================================
// WALL WITH DOOR
// ============================================================
function buildWallWithDoor(wallLen, wallH, doorW, doorH, offsetFromCorner) {
  const segs = [];
  const leftEnd = offsetFromCorner;
  const rightStart = offsetFromCorner + doorW;

  if (leftEnd > 0.01) {
    segs.push({ offset: -wallLen / 2 + leftEnd / 2, w: leftEnd, h: wallH, y: wallH / 2 });
  }
  const rightLen = wallLen - rightStart;
  if (rightLen > 0.01) {
    segs.push({ offset: -wallLen / 2 + rightStart + rightLen / 2, w: rightLen, h: wallH, y: wallH / 2 });
  }
  if (doorH < wallH - 0.01) {
    segs.push({
      offset: -wallLen / 2 + offsetFromCorner + doorW / 2,
      w: doorW, h: wallH - doorH, y: doorH + (wallH - doorH) / 2
    });
  }
  return segs;
}

// ============================================================
// ROUTER
// ============================================================
function buildStaircase(cfg, stats, W, L, H) {
  const type = cfg.stair?.type || 'straight';
  if (type === 'double-fold') return buildDoubleFold(cfg, stats, W, L, H);
  return buildStraight(cfg, stats, W, L, H);
}

// ============================================================
// STEP BUILDER
// ============================================================
function _addStep(grp, cx, yBase, z, stairW, runM, risePerStep, finish, mats, reverse) {
  const dir = reverse ? -1 : 1;

  const treadT = finish.tread.thickness;
  const treadOH = finish.tread.overhang;
  const riserT = finish.riser.thickness;
  const moldPat = finish.molding.pattern;
  const moldT = finish.molding.thickness;
  const moldGap = finish.molding.gap;

  // ── TREAD ──
  const tread = new THREE.Mesh(
    new THREE.BoxGeometry(stairW + treadOH * 2, treadT, runM + treadOH),
    mats.tread
  );
  tread.position.set(
    cx,
    yBase + risePerStep - treadT / 2,
    z + dir * (runM / 2 + treadOH / 2)
  );
  tread.castShadow = true; tread.receiveShadow = true;
  grp.add(tread);

  // ── RISER ──
  const riserH = risePerStep - treadT;
  if (riserH > 0.005) {
    const riser = new THREE.Mesh(
      new THREE.BoxGeometry(stairW, riserH, riserT),
      mats.riser
    );
    riser.position.set(cx, yBase + riserH / 2, z - dir * riserT / 2);
    riser.castShadow = true;
    grp.add(riser);
  }

  // ── MOLDING ──
  if (moldPat === 'none') return;

  const moldZ = z - dir * riserT / 2 - dir * 0.008;
  const moldY0 = yBase + risePerStep - treadT;

  if (moldPat === 'simple') {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, moldT, riserT + 0.016),
      mats.mold1
    );
    m.position.set(cx, moldY0 - moldT / 2, moldZ);
    grp.add(m);
  }
  else if (moldPat === 'double') {
    const m1 = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, moldT, riserT + 0.016),
      mats.mold1
    );
    m1.position.set(cx, moldY0 - moldT / 2, moldZ);
    grp.add(m1);

    const gap = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, moldGap, riserT + 0.016),
      mats.mold2
    );
    gap.position.set(cx, moldY0 - moldT - moldGap / 2, moldZ);
    grp.add(gap);

    const m2 = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, moldT, riserT + 0.016),
      mats.mold1
    );
    m2.position.set(cx, moldY0 - moldT - moldGap - moldT / 2, moldZ);
    grp.add(m2);
  }
  else if (moldPat === 'bevel') {
    const bevel = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, moldT * 1.4, riserT + 0.016),
      mats.mold1
    );
    bevel.position.set(cx, moldY0 - moldT * 0.7, moldZ);
    bevel.rotation.x = -0.25;
    grp.add(bevel);
  }
}

// ============================================================
// FINISH CONFIG EXTRACTOR
// ============================================================
function _getFinish(cfg) {
  const f = cfg.stair.finish || {};
  return {
    tread: {
      source:   f.tread?.source   || 'solid',
      color:    f.tread?.color    || '#1a1a1a',
      imageUrl: f.tread?.imageUrl || null,
      thickness: (f.tread?.thickness || 20) * MM,
      overhang:  (f.tread?.overhang  || 10) * MM
    },
    riser: {
      source:   f.riser?.source   || 'solid',
      color:    f.riser?.color    || '#222222',
      imageUrl: f.riser?.imageUrl || null,
      thickness: (f.riser?.thickness || 18) * MM
    },
    molding: {
      pattern:   f.molding?.pattern || 'simple',
      color1:    f.molding?.color1  || '#ffffff',
      color2:    f.molding?.color2  || '#1a1a1a',
      thickness: (f.molding?.thickness || 5) * MM,
      gap:       (f.molding?.gap       || 8) * MM
    },
    sideSlope: {
      source:   f.sideSlope?.source   || 'wall',
      color:    f.sideSlope?.color    || '#d0d0d0',
      imageUrl: f.sideSlope?.imageUrl || null,
      tileW:    (f.sideSlope?.tileW || 200) * MM,
      tileH:    (f.sideSlope?.tileH || 100) * MM
    },
    bottomFace: {
      color: f.bottomFace?.color || '#d0d0d0'
    }
  };
}

// ============================================================
// FINISH MATERIALS
// ============================================================
function _makeFinishMats(finish) {
  const makeMat = (color, opts = {}) => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: opts.rough ?? 0.4,
    metalness: opts.metal ?? 0.1,
    side: opts.side ?? THREE.FrontSide
  });

  return {
    tread:  makeMat(finish.tread.color,  { rough: 0.25, metal: 0.2 }),
    riser:  makeMat(finish.riser.color,  { rough: 0.4,  metal: 0.1 }),
    mold1:  makeMat(finish.molding.color1, { rough: 0.4, metal: 0.15 }),
    mold2:  makeMat(finish.molding.color2, { rough: 0.4, metal: 0.15 }),
    side:   makeMat(finish.sideSlope.color, { rough: 0.85, metal: 0.02, side: THREE.DoubleSide }),
    bottom: makeMat(finish.bottomFace.color, { rough: 0.9,  metal: 0.0,  side: THREE.DoubleSide })
  };
}

// ============================================================
// CONCRETE CORE — stepped top + sloped bottom (single mesh)
// Materials: [capMaterial, wallMaterial]
//   cap = side slope (visible from sides)
//   wall = bottom face (visible from below)
// ============================================================
function _buildConcreteCore(cfg, stats, W, L, H, cx) {
  const finish = _getFinish(cfg);
  const mats = _makeFinishMats(finish);

  const treadT = finish.tread.thickness;
  const riserT = finish.riser.thickness;
  const runM   = stats.runMm * MM;
  const riseM  = (cfg.stair.totalHeight * MM) / stats.steps;
  const steps  = stats.steps;
  const stairW = Math.min(cfg.stair.width * MM, W - 0.3);

  const slabT = 0.10;   // concrete slab under steps

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);

  // Stepped top
  for (let i = 0; i < steps; i++) {
    const zFront = -i * runM;
    const zBack  = -(i + 1) * runM;
    const yTop   = (i + 1) * riseM - treadT;
    shape.lineTo(zFront, yTop);
    shape.lineTo(zBack,  yTop);
  }

  // Bottom sloped
  const zEnd = -steps * runM;
  const yEnd = steps * riseM - treadT;
  shape.lineTo(zEnd, yEnd - slabT);
  shape.lineTo(0, 0);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: stairW,
    bevelEnabled: false,
    curveSegments: 1
  });

  const core = new THREE.Mesh(geo, [mats.side, mats.bottom]);
  core.rotation.y = -Math.PI / 2;
  core.castShadow = true;
  core.receiveShadow = true;
  return { core, stairW, finish, mats, riserT, treadT, runM, riseM, steps };
}

// ============================================================
// UNDERSIDE SLAB — ঢালু স্ল্যাব (সব ধরনের সিঁড়িতে ব্যবহারের জন্য)
// ============================================================
function _addUndersideSlab(grp, cx, startZ, startY, endZ, endY, width, thickness, material) {
  const start = new THREE.Vector3(cx, startY, startZ);
  const end = new THREE.Vector3(cx, endY, endZ);
  const dir = new THREE.Vector3().subVectors(end, start);
  const length = dir.length();
  if (length < 0.01) return null;
  dir.normalize();

  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(width, thickness, length),
    material
  );

  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    dir
  );
  slab.setRotationFromQuaternion(quat);

  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(quat);
  slab.position.copy(mid).addScaledVector(localUp, -thickness / 2);

  slab.castShadow = true;
  slab.receiveShadow = true;
  grp.add(slab);
  return slab;
}

// ============================================================
// SLAB MATERIAL — ধূসর সিমেন্ট
// ============================================================
function makeSlabMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    roughness: 0.85,
    metalness: 0.02,
    side: THREE.DoubleSide
  });
}

// ============================================================
// STRAIGHT
// ============================================================
function buildStraight(cfg, stats, W, L, H) {
  const grp = new THREE.Group();
  grp.name = 'staircase-straight';

  const innerHalfL = L / 2 - 0.04;
  const startZ = innerHalfL - 0.10;
  const stairW = Math.min(cfg.stair.width * MM, W - 0.3);
  const cx = 0;

  // ── Concrete core ──
  const built = _buildConcreteCore(cfg, stats, W, L, H, cx);
  built.core.position.set(cx + built.stairW / 2, 0, startZ);
  grp.add(built.core);

  const { finish, mats, runM, riseM, steps } = built;

  // ── Treads + Risers + Moldings ──
  for (let i = 0; i < steps; i++) {
    _addStep(
      grp, cx,
      i * riseM,
      startZ - i * runM,
      stairW, runM, riseM,
      finish, mats,
      true
    );
  }

  return grp;
}

// ============================================================
// DOUBLE FOLD — Landing দেওয়াল ঘেঁষে, দুই flight landing থেকে
// ============================================================
// ============================================================
// DOUBLE FOLD — Landing দেওয়াল ঘেঁষে, দুই flight landing থেকে
// ============================================================
function buildDoubleFold(cfg, stats, W, L, H) {
  const grp = new THREE.Group();
  grp.name = 'staircase-double-fold';

  const totalH = cfg.stair.totalHeight * MM;
  const totalSteps = stats.steps;

  const wallT = 0.08;
  const innerHalfW = W / 2 - wallT / 2;
  const innerHalfL = L / 2 - wallT / 2;

  const middleGap = 0.05;

  const maxStairW = (2 * innerHalfW - middleGap) / 2;
  const stairW = Math.min(cfg.stair.width * MM, maxStairW);
  const effectiveStairW = Math.max(stairW, 0.5);

  const stepsPerFlight = Math.ceil(totalSteps / 2);
  const flight2Steps = totalSteps - stepsPerFlight;
  const riseM = totalH / totalSteps;
  const landingY = stepsPerFlight * riseM;

  const finish = _getFinish(cfg);
  const mats = _makeFinishMats(finish);
  const runM = stats.runMm * MM;

  // ★ একবারই declare — সব জায়গায় ব্যবহার হবে
  const slabT = 0.10;
  const treadT = finish.tread.thickness;

  // ─────────────────────────────────────────
  // STEP 1: Landing — back wall ঘেঁষে
  // ─────────────────────────────────────────
  const landingDepth = effectiveStairW;
  const landFarZ  = -innerHalfL + 0.02;
  const landNearZ = landFarZ + landingDepth;

  const landing = new THREE.Mesh(
    new THREE.BoxGeometry(2 * innerHalfW, treadT + slabT, landingDepth),
    mats.tread
  );
  landing.position.set(
    0,
    landingY - (treadT + slabT) / 2,
    (landFarZ + landNearZ) / 2
  );
  landing.castShadow = true;
  landing.receiveShadow = true;
  grp.add(landing);

  // ─────────────────────────────────────────
  // STEP 2: Flight 1 — top step Landing-এর near edge ঘেঁষে
  // ─────────────────────────────────────────
  const f1_cx = -innerHalfW + effectiveStairW / 2;
  const f1_startZ = landNearZ + stepsPerFlight * runM;

  // F1 Concrete Core
  const f1Shape = new THREE.Shape();
  f1Shape.moveTo(0, 0);
  for (let i = 0; i < stepsPerFlight; i++) {
    const yTop = (i + 1) * riseM - treadT;
    f1Shape.lineTo(-i * runM, yTop);
    f1Shape.lineTo(-(i + 1) * runM, yTop);
  }
  f1Shape.lineTo(-stepsPerFlight * runM, stepsPerFlight * riseM - treadT - slabT);
  f1Shape.lineTo(0, 0);
  f1Shape.closePath();

  const f1Geo = new THREE.ExtrudeGeometry(f1Shape, {
    depth: effectiveStairW,
    bevelEnabled: false
  });
  const f1Core = new THREE.Mesh(f1Geo, [mats.side, mats.bottom]);
  f1Core.rotation.y = -Math.PI / 2;
  f1Core.position.set(f1_cx + effectiveStairW / 2, 0, f1_startZ);
  f1Core.castShadow = true;
  f1Core.receiveShadow = true;
  grp.add(f1Core);

  // F1 Steps
  for (let i = 0; i < stepsPerFlight; i++) {
    _addStep(
      grp, f1_cx,
      i * riseM,
      f1_startZ - i * runM,
      effectiveStairW, runM, riseM,
      finish, mats,
      true
    );
  }

  // ─────────────────────────────────────────
  // STEP 3: Flight 2 — Landing-এর near edge থেকে
  // ★ Slab F1-এর মতোই নিচে (y = -(treadT + slabT) থেকে শুরু)
  // ─────────────────────────────────────────
  const f2_cx = innerHalfW - effectiveStairW / 2;
  const f2_startZ = landNearZ;

  // F2 Concrete Core — F1-এর মতো slab সমান
  const f2Shape = new THREE.Shape();
  f2Shape.moveTo(0, -(treadT + slabT));
  for (let i = 0; i < flight2Steps; i++) {
    const yTop = (i + 1) * riseM - treadT;
    f2Shape.lineTo(i * runM, yTop);
    f2Shape.lineTo((i + 1) * runM, yTop);
  }
  f2Shape.lineTo(flight2Steps * runM, flight2Steps * riseM - treadT - slabT);
  f2Shape.lineTo(0, -(treadT + slabT));
  f2Shape.closePath();

  const f2Geo = new THREE.ExtrudeGeometry(f2Shape, {
    depth: effectiveStairW,
    bevelEnabled: false
  });
  const f2Core = new THREE.Mesh(f2Geo, [mats.side, mats.bottom]);
  f2Core.rotation.y = -Math.PI / 2;
  f2Core.position.set(f2_cx + effectiveStairW / 2, landingY, f2_startZ);
  f2Core.castShadow = true;
  f2Core.receiveShadow = true;
  grp.add(f2Core);

  // F2 Steps
  for (let i = 0; i < flight2Steps; i++) {
    _addStep(
      grp, f2_cx,
      landingY + i * riseM,
      f2_startZ + i * runM,
      effectiveStairW, runM, riseM,
      finish, mats,
      false
    );
  }

  return grp;
}
// ============================================================
// MATERIALS
// ============================================================
function makeMats(cfg) {
  return {
    treadMat: new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.stair.treadColor || '#1a1a1a'),
      roughness: 0.35, metalness: 0.1
    }),
    riserMat: new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.stair.riserColor || '#222222'),
      roughness: 0.55, metalness: 0.05
    }),
    mold1Mat: new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.stair.molding1Color || '#ffffff'), roughness: 0.4, metalness: 0.15
    }),
    moldGapMat: new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.stair.moldingGapColor || '#1a1a1a'), roughness: 0.5, metalness: 0.05
    }),
    mold2Mat: new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.stair.molding2Color || '#ffffff'), roughness: 0.4, metalness: 0.15
    })
  };
}

function makeMold(cfg) {
  return {
    m1:  (cfg.stair.molding1  || 5) * MM,
    gap: (cfg.stair.moldingGap|| 8) * MM,
    m2:  (cfg.stair.molding2  || 5) * MM
  };
}

// ============================================================
// RAILING (straight only)
// ============================================================
function buildRailing(cfg, stats) {
  const grp = new THREE.Group();
  grp.name = 'railing';

  const type = cfg.railing.type;
  const H = cfg.railing.height * MM;
  const stairW = cfg.stair.width * MM;
  const riseM = (cfg.stair.totalHeight * MM) / stats.steps;
  const runM = stats.runMm * MM;
  const steps = stats.steps;

  const railMat = new THREE.MeshStandardMaterial({
    color: type === 'wood' ? 0x8b5a3a : (type === 'glass' ? 0xcfe8f5 : 0xcccccc),
    roughness: type === 'metal' ? 0.3 : 0.6,
    metalness: type === 'metal' ? 0.9 : 0.1,
    transparent: type === 'glass',
    opacity: type === 'glass' ? 0.35 : 1
  });

  const sides = cfg.railing.side === 'both' ? [0, stairW] : [stairW];
  const totalLen = steps * runM;
  const totalH = steps * riseM;

  sides.forEach(xOffset => {
    const railLen = Math.hypot(totalLen, totalH);
    const angle = Math.atan2(totalH, totalLen);

    const handrail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, railLen), railMat);
    handrail.position.set(xOffset, totalH / 2 + H, totalLen / 2);
    handrail.rotation.x = -angle;
    grp.add(handrail);

    if (type === 'metal') {
      for (let i = 0; i <= steps; i++) {
        const bal = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, H, 8), railMat);
        bal.position.set(xOffset, i * riseM + H / 2, i * runM);
        grp.add(bal);
      }
    } else if (type === 'wood') {
      for (let i = 0; i <= steps; i += 2) {
        const bal = new THREE.Mesh(new THREE.BoxGeometry(0.05, H, 0.05), railMat);
        bal.position.set(xOffset, i * riseM + H / 2, i * runM);
        grp.add(bal);
      }
    } else if (type === 'glass') {
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(railLen, H * 0.9), railMat);
      glass.rotation.x = -angle;
      glass.rotation.y = Math.PI / 2;
      glass.position.set(xOffset, totalH / 2 + H / 2, totalLen / 2);
      grp.add(glass);
    }
  });

  return grp;
}

// ============================================================
// CHAMBER SKIRTING — দেওয়ালের নিচের অংশ
// ============================================================
function _buildChamberSkirting(cfg, walls, attachWall, doorW, doorH, offset, group) {
   const skirtCfg = cfg.stair.finish?.skirting || {
    height: 100,
    color: '#ffffff',
    boardHeight: 40,
    boardColor: '#ffffff'
  };
  if (!skirtCfg.height || skirtCfg.height <= 0) return;

  const skirtGrp = new THREE.Group();
  skirtGrp.name = 'chamber-skirting';

  const skirtH    = (skirtCfg.height || 100) * MM;
  const skirtT    = 0.012;
  const boardH    = (skirtCfg.boardHeight || 40) * MM;
  const boardT    = 0.018;
  const skirtColor = skirtCfg.color || '#ffffff';
  const boardColor = skirtCfg.boardColor || '#ffffff';
  const doorOffsetM = (cfg.door.offsetFromCorner || 1500) * MM;

  const skirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skirtColor), roughness: 0.5, metalness: 0.05
  });
  const boardMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(boardColor), roughness: 0.4, metalness: 0.1
  });

  walls.forEach(w => {
    const isAttach = (w.name === attachWall);

    const segs = (isAttach && cfg.door.enabled)
      ? buildWallWithDoor(w.len, skirtH + boardH, doorW, doorH, doorOffsetM)
      : [{ offset: 0, w: w.len, h: skirtH + boardH, y: (skirtH + boardH) / 2 }];

    segs.forEach(seg => {
      // ── Skirting board (lower) ──
      const sH = Math.min(seg.h, skirtH);
      if (sH > 0.005) {
        const sk = new THREE.Mesh(new THREE.BoxGeometry(seg.w, sH, skirtT), skirtMat);
        sk.position.set(w.x, seg.y - (skirtH + boardH) / 2 + sH / 2, w.z);
        sk.rotation.y = w.rY;
        const along = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), w.rY);
        sk.position.x += along.x * seg.offset;
        sk.position.z += along.z * seg.offset;
        const normal = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), w.rY);
        const toCenter = new THREE.Vector3(offset.x - w.x, 0, offset.z - w.z).normalize();
        const nDir = normal.dot(toCenter) > 0 ? normal : normal.clone().negate();
        sk.position.x += nDir.x * (skirtT / 2 + 0.005);
        sk.position.z += nDir.z * (skirtT / 2 + 0.005);
        sk.castShadow = true;
        skirtGrp.add(sk);
      }

      // ── Board on top (upper) ──
      if (skirtCfg.boardHeight > 0 && seg.y + seg.h / 2 > skirtH) {
        const bH = Math.min(boardH, seg.h - skirtH);
        if (bH > 0.005) {
          const bd = new THREE.Mesh(new THREE.BoxGeometry(seg.w, bH, boardT), boardMat);
          bd.position.set(w.x, seg.y - (skirtH + boardH) / 2 + skirtH + bH / 2, w.z);
          bd.rotation.y = w.rY;
          const along = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), w.rY);
          bd.position.x += along.x * seg.offset;
          bd.position.z += along.z * seg.offset;
          const normal = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), w.rY);
          const toCenter = new THREE.Vector3(offset.x - w.x, 0, offset.z - w.z).normalize();
          const nDir = normal.dot(toCenter) > 0 ? normal : normal.clone().negate();
          bd.position.x += nDir.x * (boardT / 2 + 0.005);
          bd.position.z += nDir.z * (boardT / 2 + 0.005);
          bd.castShadow = true;
          skirtGrp.add(bd);
        }
      }
    });
  });

  group.add(skirtGrp);
}

// ============================================================
// CHAMBER OFFSET
// ============================================================
function computeChamberOffset(cfg, mainBounds, W, L) {
  if (!mainBounds) return { x: 0, z: 0 };
  const roomW = mainBounds.L;
  const roomL = mainBounds.W;

  switch (cfg.position) {
    case 'right':  return { x: roomW / 2 + W / 2, z: 0 };
    case 'left':   return { x: -roomW / 2 - W / 2, z: 0 };
    case 'top':    return { x: 0, z: -roomL / 2 - L / 2 };
    case 'bottom': return { x: 0, z: roomL / 2 + L / 2 };
    default:       return { x: roomW / 2 + W / 2, z: 0 };
  }
}

if (typeof window !== 'undefined') {
  window.__id_stairChamber = {
    buildStairChamber,
    calcStairStats,
    computeMinChamberSize
  };
}
