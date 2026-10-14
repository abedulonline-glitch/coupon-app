/* ============================================================
   Interior Design Studio — id-stair-chamber.js
   Complete File (v6)
   ============================================================ */

import * as THREE from 'three';

const FT  = 0.3048;
const MM  = 0.001;
const DEG = Math.PI / 180;

// ============================================================
// CALCULATE STAIR STATS
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

  return {
    steps,
    effectiveRise,
    pureRise,
    stairLength,
    treadT, riserT, runMm
  };
}

// ============================================================
// BUILD STAIR CHAMBER
// ============================================================
export function buildStairChamber(scene, cfg, mainRoomBounds, tiles) {
  const group = new THREE.Group();
  group.name = 'stair-chamber';

  const stats = calcStairStats(cfg);

  const W = cfg.size.w * FT;
  const L = cfg.size.l * FT;
  const H = cfg.wallHeight * FT;

  const offset = computeChamberOffset(cfg, mainRoomBounds, W, L);

  // ─── FLOOR ───
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

  // ─── CEILING ───
  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd, roughness: 0.9, side: THREE.DoubleSide
  });
  const ceilGeo = new THREE.PlaneGeometry(W, L);
  ceilGeo.rotateX(Math.PI / 2);
  const ceil = new THREE.Mesh(ceilGeo, ceilMat);
  ceil.position.set(offset.x, H, offset.z);
  ceil.userData.isChamberCeiling = true;
  group.add(ceil);

  // ─── WALLS ───
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

  // ─── STAIRCASE ───
  const stairGroup = buildStaircase(cfg, stats, tiles);
  // ★ Chamber center এ রাখো — সব position গুলো chamber-এর center relative
  stairGroup.position.set(offset.x, 0, offset.z);
  stairGroup.rotation.y = 0;
  group.add(stairGroup);

  // ─── RAILING ───
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
function buildStaircase(cfg, stats, tiles) {
  const type = cfg.stair?.type || 'straight';
  if (type === 'double-fold') return buildDoubleFold(cfg, stats, tiles);
  return buildStraight(cfg, stats, tiles);
}

// ============================================================
// STEP BUILDER (reusable)
// ============================================================
function _addStep(grp, cx, yBase, z, stairW, runM, risePerStep, treadT, riserT, mats, mold, reverse = false) {
  const { treadMat, riserMat, mold1Mat, moldGapMat, mold2Mat } = mats;
  const { m1: mold1, gap: moldGap, m2: mold2 } = mold;

  const dir = reverse ? -1 : 1;

  const treadZ = z + dir * runM / 2;
  const tread = new THREE.Mesh(
    new THREE.BoxGeometry(stairW, treadT, runM),
    treadMat
  );
  tread.position.set(cx, yBase + risePerStep - treadT / 2, treadZ);
  tread.castShadow = true;
  tread.receiveShadow = true;
  grp.add(tread);

  const riserH = risePerStep - treadT;
  if (riserH > 0.005) {
    const riserZ = z - dir * riserT / 2;
    const riser = new THREE.Mesh(
      new THREE.BoxGeometry(stairW, riserH, riserT),
      riserMat
    );
    riser.position.set(cx, yBase + riserH / 2, riserZ);
    riser.castShadow = true;
    grp.add(riser);
  }

  const moldZ = z - dir * riserT / 2 - dir * 0.01;

  if (mold1 > 0.001) {
    const m1 = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, mold1, riserT + 0.02),
      mold1Mat
    );
    m1.position.set(cx, yBase + risePerStep - treadT - mold1 / 2, moldZ);
    grp.add(m1);
  }
  if (moldGap > 0.001) {
    const mg = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, moldGap, riserT + 0.02),
      moldGapMat
    );
    mg.position.set(cx, yBase + risePerStep - treadT - mold1 - moldGap / 2, moldZ);
    grp.add(mg);
  }
  if (mold2 > 0.001) {
    const m2 = new THREE.Mesh(
      new THREE.BoxGeometry(stairW + 0.02, mold2, riserT + 0.02),
      mold2Mat
    );
    m2.position.set(cx, yBase + risePerStep - treadT - mold1 - moldGap - mold2 / 2, moldZ);
    grp.add(m2);
  }
}

// ============================================================
// STRAIGHT STAIRCASE
// ============================================================
function buildStraight(cfg, stats, tiles) {
  const grp = new THREE.Group();
  grp.name = 'staircase-straight';

  const treadT = stats.treadT * MM;
  const riserT = stats.riserT * MM;
  const runM   = stats.runMm * MM;
  const stairW = cfg.stair.width * MM;

  const mats = {
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
  const mold = {
    m1:  (cfg.stair.molding1  || 5) * MM,
    gap: (cfg.stair.moldingGap|| 8) * MM,
    m2:  (cfg.stair.molding2  || 5) * MM
  };

  const risePerStep = (cfg.stair.totalHeight * MM) / stats.steps;
  const steps = stats.steps;

  for (let i = 0; i < steps; i++) {
    _addStep(grp, stairW / 2, i * risePerStep, i * runM, stairW, runM, risePerStep, treadT, riserT, mats, mold, false);
  }

  return grp;
}

// ============================================================
// DOUBLE FOLD (U-SHAPE)
// ============================================================
function buildDoubleFold(cfg, stats, tiles) {
  const grp = new THREE.Group();
  grp.name = 'staircase-double-fold';

  const treadT = stats.treadT * MM;
  const riserT = stats.riserT * MM;
  const runM   = stats.runMm * MM;
  const totalH = cfg.stair.totalHeight * MM;
  const totalSteps = stats.steps;

  const chamberW = cfg.size.w * FT;
  const chamberL = cfg.size.l * FT;
  const wallT = 0.08;

  // Inner bounds (দেওয়ালের ভিতরের face)
  const innerHalfW = chamberW / 2 - wallT / 2;
  const innerHalfL = chamberL / 2 - wallT / 2;

  const middleGap = 0.05;

  // Auto-fit flight width
  const maxStairW = (2 * innerHalfW - middleGap) / 2;
  const stairW = Math.min(cfg.stair.width * MM, maxStairW);
  const effectiveStairW = Math.max(stairW, 0.5);

  const stepsPerFlight = Math.ceil(totalSteps / 2);
  const flight2Steps = totalSteps - stepsPerFlight;
  const risePerStep = totalH / totalSteps;
  const landingY = stepsPerFlight * risePerStep;
  const landingDepth = effectiveStairW;

  const mats = {
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
  const mold = {
    m1:  (cfg.stair.molding1  || 5) * MM,
    gap: (cfg.stair.moldingGap|| 8) * MM,
    m2:  (cfg.stair.molding2  || 5) * MM
  };

  // ══════════════════════════════════════════════════════
  // FLIGHT 1 — LEFT side, দেওয়াল ঘেঁষে, ascend −Z
  // Top step back wall ঘেঁষে
  // ══════════════════════════════════════════════════════
  const f1_cx = -innerHalfW + effectiveStairW / 2;
  const f1TotalRun = stepsPerFlight * runM;

  const backWallZ = -innerHalfL;
  const frontWallZ = innerHalfL;

  // Top step back edge at backWallZ + 0.10
  const f1StartZ_raw = backWallZ + 0.10 + f1TotalRun;
  const f1StartZ = Math.min(f1StartZ_raw, frontWallZ - 0.10);

  for (let i = 0; i < stepsPerFlight; i++) {
    _addStep(
      grp, f1_cx,
      i * risePerStep,
      f1StartZ - i * runM,
      effectiveStairW, runM, risePerStep, treadT, riserT,
      mats, mold,
      true
    );
  }

  // ══════════════════════════════════════════════════════
  // LANDING — full width, দেওয়াল ঘেঁষে
  // ══════════════════════════════════════════════════════
  const f1TopTreadEnd = f1StartZ - stepsPerFlight * runM;
  let landNearZ = f1TopTreadEnd;
  let landFarZ = landNearZ - landingDepth;

  // North wall clamp
  const northWallZ = -innerHalfL;
  if (landFarZ < northWallZ + 0.05) {
    const shift = (northWallZ + 0.05) - landFarZ;
    landFarZ += shift;
    landNearZ += shift;
  }

  const landing = new THREE.Mesh(
    new THREE.BoxGeometry(2 * innerHalfW, treadT, landingDepth),
    mats.treadMat
  );
  landing.position.set(0, landingY - treadT / 2, (landFarZ + landNearZ) / 2);
  landing.castShadow = true;
  landing.receiveShadow = true;
  grp.add(landing);

  // ══════════════════════════════════════════════════════
  // FLIGHT 2 — RIGHT side, দেওয়াল ঘেঁষে, ascend +Z
  // Landing er far edge থেকে শুরু
  // ══════════════════════════════════════════════════════
  const f2_cx = innerHalfW - effectiveStairW / 2;
  const f2StartZ = landFarZ;

  for (let i = 0; i < flight2Steps; i++) {
    _addStep(
      grp, f2_cx,
      landingY + i * risePerStep,
      f2StartZ + i * runM,
      effectiveStairW, runM, risePerStep, treadT, riserT,
      mats, mold,
      false
    );
  }

  return grp;
}

// ============================================================
// RAILING (for straight stairs only)
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

    const handrail = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.06, railLen),
      railMat
    );
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

// Expose globally
if (typeof window !== 'undefined') {
  window.__id_stairChamber = {
    buildStairChamber,
    calcStairStats
  };
}
