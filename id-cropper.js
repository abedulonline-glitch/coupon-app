/* ============================================================
   Interior Design Studio — id-cropper.js
   4-corner Perspective Cropper (CamScanner style)
   ============================================================ */

export class PerspectiveCropper {
  constructor(image) {
    this.img = image;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'id-pc-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.corners = [
      { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 1, y: 1 }, { x: 0, y: 1 }
    ];
    this.rotation = 0;
    this.dragIdx = -1;
    this.handleR = 16;
    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp   = this._onUp.bind(this);
    this.canvas.addEventListener('pointerdown', this._onDown);
    this.canvas.addEventListener('pointermove', this._onMove);
    this.canvas.addEventListener('pointerup',   this._onUp);
    this.canvas.addEventListener('pointercancel', this._onUp);
    this.canvas.style.touchAction = 'none';
    this.canvas.style.display = 'block';
  }

  get element() { return this.canvas; }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const pw = parent.clientWidth - 8;
    const ph = parent.clientHeight - 8;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const iw = this.img.naturalWidth;
    const ih = this.img.naturalHeight;
    const rot = this.rotation % 360;
    const rw = (rot === 90 || rot === 270) ? ih : iw;
    const rh = (rot === 90 || rot === 270) ? iw : ih;
    const scale = Math.min(pw / rw, ph / rh);
    this.dispW = Math.floor(rw * scale);
    this.dispH = Math.floor(rh * scale);
    this.canvas.width  = this.dispW * dpr;
    this.canvas.height = this.dispH * dpr;
    this.canvas.style.width  = this.dispW + 'px';
    this.canvas.style.height = this.dispH + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redraw();
  }

  setRotation(deg) {
    this.rotation = ((deg % 360) + 360) % 360;
    this.corners = [
      { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 1, y: 1 }, { x: 0, y: 1 }
    ];
    this.resize();
  }

  reset() {
    this.corners = [
      { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 1, y: 1 }, { x: 0, y: 1 }
    ];
    this.rotation = 0;
    this.resize();
  }

  autoDetect() {
    this.corners = [
      { x: 0.04, y: 0.04 }, { x: 0.96, y: 0.04 },
      { x: 0.96, y: 0.96 }, { x: 0.04, y: 0.96 }
    ];
    this.redraw();
  }

  _toDisp(c) { return { x: c.x * this.dispW, y: c.y * this.dispH }; }

  _getPos(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  _onDown(e) {
    e.preventDefault();
    const p = this._getPos(e);
    let nearest = -1, minD = Infinity;
    this.corners.forEach((c, i) => {
      const d = this._toDisp(c);
      const dist = Math.hypot(d.x - p.x, d.y - p.y);
      if (dist < this.handleR + 20 && dist < minD) { minD = dist; nearest = i; }
    });
    if (nearest >= 0) {
      this.dragIdx = nearest;
      try { this.canvas.setPointerCapture(e.pointerId); } catch(x){}
    }
  }

  _onMove(e) {
    const p = this._getPos(e);
    if (this.dragIdx < 0) {
      let hover = -1;
      this.corners.forEach((c, i) => {
        const d = this._toDisp(c);
        if (Math.hypot(d.x - p.x, d.y - p.y) < this.handleR + 20) hover = i;
      });
      this.canvas.style.cursor = hover >= 0 ? 'grab' : 'default';
      return;
    }
    e.preventDefault();
    const nx = Math.max(0, Math.min(1, p.x / this.dispW));
    const ny = Math.max(0, Math.min(1, p.y / this.dispH));
    this.corners[this.dragIdx] = { x: nx, y: ny };
    this.redraw();
  }

  _onUp(e) {
    if (this.dragIdx >= 0) {
      try { this.canvas.releasePointerCapture(e.pointerId); } catch(x){}
    }
    this.dragIdx = -1;
  }

  redraw() {
    const ctx = this.ctx;
    const W = this.dispW, H = this.dispH;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W/2, H/2);
    ctx.rotate(this.rotation * Math.PI / 180);
    const rot = this.rotation % 360;
    if (rot === 90 || rot === 270) {
      ctx.drawImage(this.img, -H/2, -W/2, H, W);
    } else {
      ctx.drawImage(this.img, -W/2, -H/2, W, H);
    }
    ctx.restore();

    const quad = this.corners.map(c => this._toDisp(c));

    // Dark overlay outside quad
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.moveTo(quad[0].x, quad[0].y);
    ctx.lineTo(quad[1].x, quad[1].y);
    ctx.lineTo(quad[2].x, quad[2].y);
    ctx.lineTo(quad[3].x, quad[3].y);
    ctx.closePath();
    ctx.fill('evenodd');
    ctx.restore();

    // Quad border
    ctx.strokeStyle = '#4f8cff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(quad[0].x, quad[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(quad[i].x, quad[i].y);
    ctx.closePath();
    ctx.stroke();

    // Grid (thirds)
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      const t = i / 3;
      const a = { x: quad[0].x + (quad[1].x - quad[0].x) * t, y: quad[0].y + (quad[1].y - quad[0].y) * t };
      const b = { x: quad[3].x + (quad[2].x - quad[3].x) * t, y: quad[3].y + (quad[2].y - quad[3].y) * t };
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      const c = { x: quad[0].x + (quad[3].x - quad[0].x) * t, y: quad[0].y + (quad[3].y - quad[0].y) * t };
      const d = { x: quad[1].x + (quad[2].x - quad[1].x) * t, y: quad[1].y + (quad[2].y - quad[1].y) * t };
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.stroke();
    }

    // Handles
    quad.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.handleR, 0, Math.PI * 2);
      ctx.fillStyle = i === this.dragIdx ? '#ffb347' : '#4f8cff';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });
  }

  async crop(outW, outH) {
    const rot = this.rotation % 360;
    const iw = this.img.naturalWidth;
    const ih = this.img.naturalHeight;
    const sw = (rot === 90 || rot === 270) ? ih : iw;
    const sh = (rot === 90 || rot === 270) ? iw : ih;

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = sw;
    srcCanvas.height = sh;
    const sctx = srcCanvas.getContext('2d');
    sctx.save();
    sctx.translate(sw/2, sh/2);
    sctx.rotate(this.rotation * Math.PI / 180);
    sctx.drawImage(this.img, -iw/2, -ih/2, iw, ih);
    sctx.restore();

    const srcQuad = this.corners.map(c => [c.x * sw, c.y * sh]);
    return this._warp(srcCanvas, srcQuad, outW, outH);
  }

  _warp(srcCanvas, srcQuad, outW, outH) {
    return new Promise((resolve) => {
      const sw = srcCanvas.width;
      const sh = srcCanvas.height;
      const sctx = srcCanvas.getContext('2d');
      const srcData = sctx.getImageData(0, 0, sw, sh).data;

      const out = document.createElement('canvas');
      out.width = outW;
      out.height = outH;
      const octx = out.getContext('2d');
      const dstImg = octx.createImageData(outW, outH);
      const dst = dstImg.data;

      const dstCorners = [[0,0],[outW,0],[outW,outH],[0,outH]];
      const H = _homography(dstCorners, srcQuad);

      for (let y = 0; y < outH; y++) {
        for (let x = 0; x < outW; x++) {
          const w = H[6]*x + H[7]*y + H[8];
          if (Math.abs(w) < 1e-8) continue;
          const u = (H[0]*x + H[1]*y + H[2]) / w;
          const v = (H[3]*x + H[4]*y + H[5]) / w;
          const x0 = Math.floor(u), y0 = Math.floor(v);
          const x1 = x0 + 1, y1 = y0 + 1;
          const dx = u - x0, dy = v - y0;
          const oi = (y * outW + x) * 4;
          if (x0 >= 0 && x1 < sw && y0 >= 0 && y1 < sh) {
            const i00 = (y0 * sw + x0) * 4;
            const i01 = (y0 * sw + x1) * 4;
            const i10 = (y1 * sw + x0) * 4;
            const i11 = (y1 * sw + x1) * 4;
            for (let c = 0; c < 3; c++) {
              const v00 = srcData[i00 + c];
              const v01 = srcData[i01 + c];
              const v10 = srcData[i10 + c];
              const v11 = srcData[i11 + c];
              const v0 = v00 + (v01 - v00) * dx;
              const v1 = v10 + (v11 - v10) * dx;
              dst[oi + c] = v0 + (v1 - v0) * dy;
            }
            dst[oi + 3] = 255;
          }
        }
      }
      octx.putImageData(dstImg, 0, 0);
      resolve(out);
    });
  }
}

function _homography(from, to) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [fx, fy] = from[i];
    const [tx, ty] = to[i];
    A.push([fx, fy, 1, 0, 0, 0, -fx*tx, -fy*tx]); b.push(tx);
    A.push([0, 0, 0, fx, fy, 1, -fx*ty, -fy*ty]); b.push(ty);
  }
  const h = _solveLinear(A, b);
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

function _solveLinear(A, b) {
  const n = 8;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < n; i++) {
    let maxR = i;
    for (let k = i+1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[maxR][i])) maxR = k;
    [M[i], M[maxR]] = [M[maxR], M[i]];
    for (let k = i+1; k < n; k++) {
      const f = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j];
    }
  }
  const x = new Array(n);
  for (let i = n-1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i+1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}
