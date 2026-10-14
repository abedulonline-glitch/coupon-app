/* ============================================================
   Interior Design Studio — id-stair-chamber.js
   Stair Chamber Geometry Builder
   ============================================================ */

import * as THREE from 'three';

const FT  = 0.3048;
const MM  = 0.001;
const DEG = Math.PI / 180;

// ============================================================
// CALCULATE STAIR RISE (1mm precision)
// ============================================================
export function calcStairStats(cfg) {
  const totalH = cfg.stair.totalHeight;          // mm
  const treadT = cfg.stair.treadThickness;       // mm
  const riserT = cfg.stair.riserThickness;       // mm
  const runMm  = cfg.stair.treadDepth;           // mm

  // Steps count
  let steps = cfg.stair.totalSteps;
  if (cfg.stair.autoSteps) {
    steps = Math.max(3, Math.round(totalH / 180));  // ~180mm default rise
  }

  // Real rise per step: totalH divided, adjusted by tread+riser
  // Rise_master = (totalH / steps) - treadT  (top surface of tread to next top)
  // Actually: sum of riser heights + tread thickness = totalH
  const effectiveRise = totalH / steps;         // center-to-center
  const pureRise = effectiveRise - treadT;      // visible riser height

  const stairLength = steps * runMm;            // total run length (mm)

  return {
    steps,
    effectiveRise,
    pureRise,
    stairLength,
    treadT, riserT, runMm
  };
}

// ============================================================
// BUILD STAIR CHAMBER + STAIRCASE
// ============================================================
export function buildStairChamber(scene, cfg, mainRoomBounds, tiles) {
  const group = new THREE.Group();
  group.name = 'stair-chamber';

  const stats = calcStairStats(cfg);

  // Chamber size in meters
  const W = cfg.size.w * FT;
  const L = cfg.size.l * FT;
  const H = cfg.wallHeight * FT;

  // Chamber position — attach to main room
  const offset = computeChamberOffset(cfg, mainRoomBounds, W, L);

  // ─────────────────────────────────────────
  // 1. FLOOR
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // 2. CEILING
  // ─────────────────────────────────────────
  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd, roughness: 0.9, side: THREE.DoubleSide
  });
  const ceilGeo = new THREE.PlaneGeometry(W, L);
  ceilGeo.rotateX(Math.PI / 2);
  const ceil = new THREE.Mesh(ceilGeo, ceilMat);
  ceil.userData.isChamberCeiling = true; 
  ceil.position.set(offset.x, H, offset.z);
  group.add(ceil);

  // ─────────────────────────────────────────
  // 3. WALLS (4 sides) — with door cut on main-room side
  // ─────────────────────────────────────────
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.wallColor || '#f0f0f0'),
    roughness: 0.85, metalness: 0.02, side: THREE.DoubleSide
  });

  const halfW = W / 2, halfL = L / 2;

  // Which wall connects to main room?
  const attachSide = cfg.position;
  const doorW = (cfg.door.width || 900) * MM;
  const doorH = (cfg.door.height || 2100) * MM;

  // 4 walls
  const walls = [
    { name: 'north', x: offset.x,           z: offset.z - halfL, rY: 0,           len: W },
    { name: 'south', x: offset.x,           z: offset.z + halfL, rY: 0,           len: W },
    { name: 'east',  x: offset.x + halfW,   z: offset.z,         rY: Math.PI/2,   len: L },
    { name: 'west',  x: offset.x - halfW,   z: offset.z,         rY: Math.PI/2,   len: L }
  ];

  // Map attachSide → wall name
  const attachMap = {
    right:  'west',
    left:   'east',
    top:    'south',
    bottom: 'north'
  };
  const attachWall = attachMap[attachSide] || 'west';

  // Chamber center for culling
  const center = new THREE.Vector3(offset.x, H / 2, offset.z);
  const chamberWalls = [];

  walls.forEach(w => {
    const isAttach = (w.name === attachWall);

    if (isAttach && cfg.door.enabled) {
      // Build wall with door gap (split into segments)
      const segs = buildWallWithDoor(w.len, H, doorW, doorH, cfg.door.offsetFromCorner * MM);
      segs.forEach(seg => {
        const g = new THREE.BoxGeometry(seg.w, seg.h, 0.08);
        const m = new THREE.Mesh(g, wallMat.clone());
        m.position.set(w.x, seg.y, w.z);
        m.rotation.y = w.rY;
        // Offset along wall direction for segments
        const along = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0,1,0), w.rY);
        m.position.x += along.x * seg.offset;
        m.position.z += along.z * seg.offset;
        m.receiveShadow = true;
        m.userData.isChamberWall = true;
        chamberWalls.push(m);
        group.add(m);
      });
    } else {
      // Full wall
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

  // ─────────────────────────────────────────
  // 4. STAIRCASE — starts right after door, INSIDE chamber
  // ─────────────────────────────────────────
  const stairGroup = buildStaircase(cfg, stats, tiles);

  const dir = cfg.stair.direction;   // 'along-length' | 'along-width'
  const clearance = 0.15;            // clearance from wall

  let sx, sz, sRotY = 0;

  if (dir === 'along-length') {
    // Stair runs along Z (length direction), starts at north edge
    sx = offset.x - W / 2 + clearance;
    sz = offset.z - L / 2 + clearance;
    sRotY = 0;
  } else {
    // Stair runs along X (width direction)
    sx = offset.x - W / 2 + clearance;
    sz = offset.z - L / 2 + clearance;
    sRotY = -Math.PI / 2;
  }

  stairGroup.position.set(sx, 0, sz);
  stairGroup.rotation.y = sRotY;
  group.add(stairGroup);

  // ─────────────────────────────────────────
  // 5. RAILING
  // ─────────────────────────────────────────
    if (cfg.railing.enabled && (cfg.stair?.type || 'straight') === 'straight') {
    const rails = buildRailing(cfg, stats);
    rails.position.copy(stairGroup.position);
    rails.rotation.copy(stairGroup.rotation);
    group.add(rails);
  }

  scene.add(group);
  return {
    group,
    stats,
    offset,
    size: { W, L, H },
    chamberWalls,
    center
  };
}

// ============================================================
// WALL WITH DOOR GAP
// ============================================================
function buildWallWithDoor(wallLen, wallH, doorW, doorH, offsetFromCorner) {
  const segs = [];
  const leftEnd = offsetFromCorner;
  const rightStart = offsetFromCorner + doorW;

  // Left segment (before door)
  if (leftEnd > 0.01) {
    segs.push({
      offset: -wallLen / 2 + leftEnd / 2,
      w: leftEnd,
      h: wallH,
      y: wallH / 2
    });
  }
  // Right segment (after door)
  const rightLen = wallLen - rightStart;
  if (rightLen > 0.01) {
    segs.push({
      offset: -wallLen / 2 + rightStart + rightLen / 2,
      w: rightLen,
      h: wallH,
      y: wallH / 2
    });
  }
  // Top lintel (above door)
  if (doorH < wallH - 0.01) {
    segs.push({
      offset: -wallLen / 2 + offsetFromCorner + doorW / 2,
      w: doorW,
      h: wallH - doorH,
      y: doorH + (wallH - doorH) / 2
    });
  }
  return segs;
}

// ============================================================
// STAIRCASE (tread + riser + double molding)
// ============================================================
function buildStraight(cfg, stats, tiles) {
  const grp = new THREE.Group();
  grp.name = 'staircase';

  const treadT  = stats.treadT * MM;
  const riserT  = stats.riserT * MM;
  const runM    = stats.runMm * MM;
  const riseM   = stats.effectiveRise * MM;
  const stairW  = cfg.stair.width * MM;

  const mold1   = cfg.stair.molding1 * MM;
  const moldGap = cfg.stair.moldingGap * MM;
  const mold2   = cfg.stair.molding2 * MM;

  // Materials
  const treadMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.treadColor || '#1a1a1a'),
    roughness: 0.35, metalness: 0.1
  });
  const riserMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.riserColor || '#222222'),
    roughness: 0.55, metalness: 0.05
  });
  const mold1Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.molding1Color || '#ffffff'),
    roughness: 0.4, metalness: 0.15
  });
  const moldGapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.moldingGapColor || '#1a1a1a'),
    roughness: 0.5, metalness: 0.05
  });
  const mold2Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.molding2Color || '#ffffff'),
    roughness: 0.4, metalness: 0.15
  });

  const steps = stats.steps;
  const risePerStep = (cfg.stair.totalHeight * MM) / steps;

  for (let i = 0; i < steps; i++) {
       const z = i * runM;
    const yBase = i * risePerStep;

    // ── TREAD (top slab) ──
    const tread = new THREE.Mesh(
      new THREE.BoxGeometry(stairW, treadT, runM),
      treadMat
    );
        tread.position.set(stairW / 2, yBase + risePerStep - treadT / 2, z + runM / 2);
    tread.castShadow = true;
    tread.receiveShadow = true;
    grp.add(tread);

    // ── RISER (vertical front face) ──
    const riserHeight = risePerStep - treadT;
    if (riserHeight > 0.005) {
      const riser = new THREE.Mesh(
        new THREE.BoxGeometry(stairW, riserHeight, riserT),
        riserMat
      );
         riser.position.set(stairW / 2, yBase + riserHeight / 2, z - riserT / 2);
      riser.castShadow = true;
      grp.add(riser);
    }

    // ── MOLDING 1 (top, under tread) ──
    if (mold1 > 0.001) {
      const m1 = new THREE.Mesh(
        new THREE.BoxGeometry(stairW + 0.02, mold1, riserT + 0.02),
        mold1Mat
      );
      m1.position.set(stairW / 2, yBase + risePerStep - treadT - mold1 / 2,     z - riserT / 2 + 0.01);
      grp.add(m1);
    }

    // ── MOLDING GAP ──
    if (moldGap > 0.001) {
      const mg = new THREE.Mesh(
        new THREE.BoxGeometry(stairW + 0.02, moldGap, riserT + 0.02),
        moldGapMat
      );
      mg.position.set(
        stairW / 2,
        yBase + risePerStep - treadT - mold1 - moldGap / 2,
            z - riserT / 2 - 0.01
      );
      grp.add(mg);
    }

    // ── MOLDING 2 (bottom) ──
    if (mold2 > 0.001) {
      const m2 = new THREE.Mesh(
        new THREE.BoxGeometry(stairW + 0.02, mold2, riserT + 0.02),
        mold2Mat
      );
      m2.position.set(
        stairW / 2,
        yBase + risePerStep - treadT - mold1 - moldGap - mold2 / 2,
            z - riserT / 2 + 0.01
      );
      grp.add(m2);
    }
  }

  return grp;
}

// ============================================================
// ROUTER — চয়েজ অনুযায়ী সঠিক বিল্ডার কল
// ============================================================
function buildStaircase(cfg, stats, tiles) {
  const type = cfg.stair?.type || 'straight';
  if (type === 'double-fold') return buildDoubleFold(cfg, stats, tiles);
  return buildStraight(cfg, stats, tiles);
}

// ============================================================
// REUSABLE STEP BUILDER (তিনটি layer molding + tread + riser)
// ============================================================
function _addStep(grp, cx, yBase, z, stairW, runM, risePerStep, treadT, riserT, mats, mold, reverse = false) {
  const { treadMat, riserMat, mold1Mat, moldGapMat, mold2Mat } = mats;
  const { m1: mold1, gap: moldGap, m2: mold2 } = mold;

  // Direction factor: forward (+1) or reverse (-1)
  const dir = reverse ? -1 : 1;

  // Tread — front edge at z, extends in direction
  const treadZ = z + dir * runM / 2;
  const tread = new THREE.Mesh(
    new THREE.BoxGeometry(stairW, treadT, runM),
    treadMat
  );
  tread.position.set(cx, yBase + risePerStep - treadT / 2, treadZ);
  tread.castShadow = true;
  tread.receiveShadow = true;
  grp.add(tread);

  // Riser — at front edge of tread (visible from ascending direction)
  const riserH = risePerStep - treadT;
  if (riserH > 0.005) {
    const riserZ = z - dir * riserT / 2;   // ← reversed by direction
    const riser = new THREE.Mesh(
      new THREE.BoxGeometry(stairW, riserH, riserT),
      riserMat
    );
    riser.position.set(cx, yBase + riserH / 2, riserZ);
    riser.castShadow = true;
    grp.add(riser);
  }

  // Moldings — same side as riser
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
// DOUBLE FOLD (U-SHAPE) — দুই flight + মাঝে landing
// Flight 1: সোজা উপরে (+Z), Flight 2: ১৮০° ঘুরে (−Z)
// ============================================================
function buildDoubleFold(cfg, stats, tiles) {
  const grp = new THREE.Group();
  grp.name = 'staircase-double-fold';

  const treadT = stats.treadT * MM;
  const riserT = stats.riserT * MM;
  const runM = stats.runMm * MM;
  const stairW = cfg.stair.width * MM;
  const totalH = cfg.stair.totalHeight * MM;
  const totalSteps = stats.steps;

  // Split into two flights
  const stepsPerFlight = Math.ceil(totalSteps / 2);
  const flight2Steps = totalSteps - stepsPerFlight;
  const risePerStep = totalH / totalSteps;
  const landingY = stepsPerFlight * risePerStep;
  const landingDepth = stairW * 1.0;    // square landing

  // Materials
  const treadMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.treadColor || '#1a1a1a'),
    roughness: 0.35, metalness: 0.1
  });
  const riserMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.riserColor || '#222222'),
    roughness: 0.55, metalness: 0.05
  });
  const mold1Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.molding1Color || '#ffffff'), roughness: 0.4, metalness: 0.15
  });
  const moldGapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.moldingGapColor || '#1a1a1a'), roughness: 0.5, metalness: 0.05
  });
  const mold2Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.stair.molding2Color || '#ffffff'), roughness: 0.4, metalness: 0.15
  });

  const mats = { treadMat, riserMat, mold1Mat, moldGapMat, mold2Mat };
  const mold = {
    m1:  (cfg.stair.molding1  || 5) * MM,
    gap: (cfg.stair.moldingGap|| 8) * MM,
    m2:  (cfg.stair.molding2  || 5) * MM
  };

  // ───── FLIGHT 1: LEFT side (X: 0 → stairW), ascends +Z ─────
  for (let i = 0; i < stepsPerFlight; i++) {
    const yBase = i * risePerStep;
    const z = i * runM;
    _addStep(
      grp,
      stairW / 2,        // X center of left half
      yBase, z,
      stairW, runM, risePerStep, treadT, riserT,
      mats, mold,
      false             // forward direction
    );
  }

  // ───── LANDING: spans full width (X: 0 → 2*stairW) ─────
  const landing = new THREE.Mesh(
    new THREE.BoxGeometry(stairW * 2, treadT, landingDepth),
    treadMat
  );
  landing.position.set(
    stairW,                              // X center
    landingY - treadT / 2,               // top surface at landingY
    stepsPerFlight * runM + landingDepth / 2  // Z center
  );
  landing.castShadow = true;
  landing.receiveShadow = true;
  grp.add(landing);

  // ───── FLIGHT 2: RIGHT side (X: stairW → 2*stairW) ─────
  // Trick: build as forward flight, then rotate 180° around Y
  // and position at far edge of landing
  const flight2Group = new THREE.Group();

  for (let i = 0; i < flight2Steps; i++) {
    const yBase = i * risePerStep;      // local — starts at 0
    const z = i * runM;                 // local — goes +Z (forward in local space)
    _addStep(
      flight2Group,
      0,                                 // X center local = 0
      yBase, z,
      stairW, runM, risePerStep, treadT, riserT,
      mats, mold,
      false                              // local direction is forward
    );
  }

  // After 180° rotation around Y:
  //   local +X → world -X
  //   local +Z → world -Z
  // So we position so that the ROTATED group's local origin sits at:
  //   X = 2*stairW (so after rotation flight sits at X: stairW → 2*stairW)
  //   Z = stepsPerFlight*runM + landingDepth  (far edge of landing)
  //   Y = landingY (starts at landing height)
  flight2Group.position.set(
    stairW * 2,
    landingY,
    stepsPerFlight * runM + landingDepth
  );
  flight2Group.rotation.y = Math.PI;
  grp.add(flight2Group);

  return grp;
}

// ============================================================
// RAILING
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
    // Sloped handrail (main bar)
    const railLen = Math.hypot(totalLen, totalH);
    const angle = Math.atan2(totalH, totalLen);
    const handrail = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.06, railLen),
      railMat
    );
        handrail.position.set(xOffset, totalH / 2 + H, totalLen / 2);
       handrail.rotation.x = -angle;
    grp.add(handrail);

    // Balusters
    if (type === 'metal') {
      for (let i = 0; i <= steps; i++) {
        const bal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, H, 8),
          railMat
        );
                bal.position.set(xOffset, i * riseM + H / 2, i * runM);
        grp.add(bal);
      }
    } else if (type === 'wood') {
      for (let i = 0; i <= steps; i += 2) {
        const bal = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, H, 0.05),
          railMat
        );
                bal.position.set(xOffset, i * riseM + H / 2, i * runM);
        grp.add(bal);
      }
    } else if (type === 'glass') {
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(railLen, H * 0.9),
        railMat
      );
            glass.rotation.x = -angle;
      glass.rotation.y = Math.PI / 2;
            glass.position.set(xOffset, totalH / 2 + H / 2, totalLen / 2);
      grp.add(glass);
    }
  });

  return grp;
}

// ============================================================
// CHAMBER OFFSET — attach to main room
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
