'use strict';
/* ============================================================
   The Heart Journey — OFFICIAL TRAILER
   Re-cuts the film's scenes (pure functions of t) into a
   57-second teaser: cards → moments → montage → title → CTA.
   ============================================================ */

const wrap = document.getElementById('wrap');
const cvs = document.getElementById('px');
const fxc = document.getElementById('fx');
g = cvs.getContext('2d');
const fg = fxc.getContext('2d');
g.imageSmoothingEnabled = false;

const IDX = {}; SCENES.forEach((s, i) => IDX[s.name] = i);

/* ---------- the cut ----------
   clip: {sc, at, dur}  — play scene `sc` from local time `at`
   card: {card:[lines], cap, dur}
   title:{title:true, dur}                                   */
const SHOTS = [
  { card: ['Có những câu chuyện', 'không cần lời nói…'], cap: 'OFFICIAL TRAILER', dur: 3.8 },
  { sc: 'ch1',    at: 21.0, dur: 5.0 },   // the first meal, morning light
  { sc: 'ch2',    at: 17.0, dur: 4.6 },   // one book, two readers
  { sc: 'chat',   at: 8.8,  dur: 3.2 },   // a heart in a message
  { card: ['Từ những buổi sáng', 'bình thường nhất…'], dur: 3.2 },
  { sc: 'ch3',    at: 24.0, dur: 6.4 },   // the sunrise
  { sc: 'ch4',    at: 9.5,  dur: 3.8 },   // hotpot night
  { sc: 'ch5',    at: 5.0,  dur: 2.6 },   // minions on the screen
  { sc: 'ch5',    at: 11.3, dur: 3.2 },   // he takes her hand
  { sc: 'ch2',    at: 43.4, dur: 2.8 },   // the parking-lot kiss
  { sc: 'ch6',    at: 36.4, dur: 4.0 },   // riding by the sea
  { sc: 'finale', at: 15.0, dur: 1.8 },   // hearts merge
  { sc: 'finale', at: 25.2, dur: 2.4 },   // the blue bouquet
  { card: ['Và một câu hỏi', 'đang chờ câu trả lời…'], dur: 3.2 },
  { title: true, dur: 7.0 }
];
const TS = []; let T_TOTAL = 0;
for (const s of SHOTS) { TS.push(T_TOTAL); T_TOTAL += s.dur; }
/* dip to black only around cards/titles — clip→clip stays a hard cut */
SHOTS.forEach((s, i) => {
  const softL = i === 0 || s.card || s.title || SHOTS[i - 1].card || SHOTS[i - 1].title;
  const softR = i === SHOTS.length - 1 || s.card || s.title || SHOTS[i + 1].card || SHOTS[i + 1].title;
  s.fi = softL ? 0.35 : 0;
  s.fo = softR ? 0.35 : 0;
});
SHOTS[SHOTS.length - 1].fo = 0.8;

/* ---------- music: one rising arc across the cut ---------- */
const CUES = [
  [0,      { bpm: 66, root: 0, prog: [0, 5, 3, 4], pstyle: 'min',    layers: { pad: 0.35, piano: 0.3 }, amb: {} }],
  [TS[1],  { bpm: 66, root: 0, prog: [0, 5, 3, 4], pstyle: 'arp',    layers: { piano: 0.55, pad: 0.45 }, amb: {} }],
  [TS[3],  { bpm: 66, root: 0, prog: [0, 5, 3, 4], pstyle: 'arp',    layers: { piano: 0.5, pad: 0.4, pluck: 0.35 }, amb: {} }],
  [TS[5],  { bpm: 69, root: 0, prog: [0, 4, 5, 3], pstyle: 'chords', layers: { piano: 0.6, pad: 0.55, str: 0.45, mel: 0.7 }, amb: { waves: 0.8 } }],
  [TS[6],  { bpm: 69, root: 0, prog: [0, 4, 5, 3], pstyle: 'chords', layers: { piano: 0.6, pad: 0.5, str: 0.4, mel: 0.7, bass: 0.4 }, amb: { sizzle: 0.8 } }],
  [TS[7],  { bpm: 69, root: 0, prog: [0, 4, 5, 3], pstyle: 'chords', layers: { piano: 0.6, pad: 0.5, str: 0.4, mel: 0.7, bass: 0.4 }, amb: { hum: 0.7 } }],
  [TS[8],  { bpm: 69, root: 0, prog: [0, 4, 5, 3], pstyle: 'chords', layers: { piano: 0.7, pad: 0.6, str: 0.6, mel: 0.85, bass: 0.5 }, amb: {} }],
  [TS[10], { bpm: 76, root: 0, prog: [0, 4, 5, 3], pstyle: 'chords', layers: { piano: 0.85, pad: 0.65, str: 0.85, mel: 0.95, bass: 0.65, pluck: 0.4 }, amb: {} }],
  [TS[13], { bpm: 62, root: 0, prog: [3, 4],       pstyle: 'min',    layers: { pad: 0.4, str: 0.3 }, amb: {} }],
  [TS[14], { bpm: 74, root: 2, prog: [0, 4, 5, 3], pstyle: 'chords', layers: { piano: 0.9, pad: 0.7, str: 0.95, mel: 1, bass: 0.7, pluck: 0.4 }, amb: {} }]
];
const END_CFG = { bpm: 64, root: 0, prog: [0, 5, 3, 4], pstyle: 'min', layers: { pad: 0.4, piano: 0.35 }, amb: {} };
const SFX = [
  [TS[3] + 1.0, 'msg'],
  [TS[5] + 0.6, 'chime'],
  [TS[8] + 0.7, 'heart'],   // the grab
  [TS[9] + 1.4, 'kiss'],
  [TS[11] + 0.15, 'burst'],
  [TS[13] + 0.5, 'beat1'],
  [TS[14] + 0.4, 'ring']
];

/* ---------- text (drawn at native supersampled scale) ---------- */
function txt(s, x, y, size, color, o) {
  o = o || {};
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.font = (o.weight || 600) + ' ' + Math.round(size * PXS) + 'px ' +
           (o.font || '"Segoe UI",system-ui,sans-serif');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  try { if (o.spacing) g.letterSpacing = (o.spacing * PXS) + 'px'; } catch (e) {}
  if (o.glow) { g.shadowColor = o.glow; g.shadowBlur = (o.glowR || 8) * PXS; }
  g.globalAlpha = o.a === undefined ? 1 : clamp(o.a, 0, 1);
  g.fillStyle = color;
  g.fillText(s, x * PXS, y * PXS);
  try { g.letterSpacing = '0px'; } catch (e) {}
  g.restore();
}

/* ---------- special frames ---------- */
function drawCard(shot, lt) {
  vgrad(0, 0, W, H, [[0, '#0b0714'], [0.6, '#150d22'], [1, '#080510']]);
  stars(26, lt * 0.6, 140, 0.35);
  const a = seg(lt, 0.25, 1.0) * (1 - seg(lt, shot.dur - 0.7, shot.dur - 0.15));
  if (shot.cap)
    txt(shot.cap, 192, 60, 7, 'rgba(255,205,200,0.6)', { a: a * 0.9, spacing: 4 });
  shot.card.forEach((ln, i) =>
    txt(ln, 192, 98 + i * 21, 14, '#ffeede', { a, glow: 'rgba(255,120,150,0.4)', glowR: 10 }));
  dim(0.05);
}
function drawTitleCard(lt) {
  vgrad(0, 0, W, H, [[0, '#12091e'], [0.55, '#241030'], [1, '#0c0714']]);
  stars(70, lt, 160, 0.7);
  glow(192, 70, 110, '#ff4d64', 0.12 + 0.05 * Math.sin(lt * 1.6));
  const beat = 1 + 0.07 * Math.pow(Math.sin(lt * 2.4), 8) + 0.05 * Math.pow(Math.sin(lt * 2.4 + 0.3), 8);
  heartSpr(192, 64, 4.6 * beat * (0.4 + 0.6 * seg(lt, 0.1, 0.8)), 0.8);
  for (let i = 0; i < 8; i++) {
    const a = lt * 0.5 + i * TAU / 8;
    sparkle(192 + Math.cos(a) * 52, 64 + Math.sin(a) * 30, 1.5, i % 2 ? '#ffe9a0' : '#ffd7de',
      0.35 + 0.4 * Math.sin(lt * 2 + i * 2));
  }
  txt('The Heart Journey', 192, 122, 22, '#fff2e4',
    { a: seg(lt, 0.6, 1.6), weight: 700, font: 'Georgia,"Palatino Linotype",serif', glow: 'rgba(255,90,130,0.8)', glowR: 14 });
  txt('MỘT BỘ PHIM PIXEL — KHÔNG LỜI', 192, 146, 8, 'rgba(255,231,220,0.78)',
    { a: seg(lt, 1.4, 2.4), spacing: 3.5 });
  petals(lt, 8, { x0: 30, x1: 354, y0: 10, y1: 200 }, 0.4);
}
/* poster shared by menu + end card */
function drawPosterBg(mt, mode) {
  vgrad(0, 0, W, H, [[0, '#12091e'], [0.55, '#241030'], [1, '#0c0714']]);
  stars(70, mt, 160, 0.7);
  glow(192, 96, 120, '#ff4d64', 0.13 + 0.04 * Math.sin(mt * 1.6));
  const beat = 1 + 0.07 * Math.pow(Math.sin(mt * 2.4), 8) + 0.05 * Math.pow(Math.sin(mt * 2.4 + 0.3), 8);
  heartSpr(192, 84, 5.0 * beat, 0.8);
  for (let i = 0; i < 8; i++) {
    const a = mt * 0.5 + i * TAU / 8;
    sparkle(192 + Math.cos(a) * 58, 84 + Math.sin(a) * 34, 1.5, i % 2 ? '#ffe9a0' : '#ffd7de',
      0.35 + 0.4 * Math.sin(mt * 2 + i * 2));
  }
  person(160, 196, { who: 'boy', pose: 'stand', f: 1, shade: 0.25 });
  person(224, 196, { who: 'girl', pose: 'stand', f: -1, shade: 0.25 });
  shadow(160, 196, 12); shadow(224, 196, 12);
  petals(mt, 10, { x0: 30, x1: 354, y0: 10, y1: 200 }, 0.45);
  if (mode === 'menu') {
    txt('THE HEART JOURNEY', 192, 26, 9, 'rgba(255,235,225,0.9)', { spacing: 4, weight: 700 });
    txt('OFFICIAL TRAILER', 192, 40, 7, 'rgba(255,150,175,0.85)', { spacing: 5 });
    const pa = 0.55 + 0.35 * Math.sin(mt * 2.2);
    for (let r2 = 0; r2 < 9; r2++) {
      const half = 4.5 - Math.abs(r2 - 4);
      px(188, 136 + r2, 1 + half * 1.6, 1, rgba('#fff6e2', pa));
    }
    glow(192, 140, 18, '#fff6e2', 0.2 * pa);
    dim(0.05);
  } else {
    dim(0.32);
  }
}

/* ---------- trailer frame ---------- */
const BAR = 14;
function renderTrailer(tt) {
  g.fillStyle = '#05040a'; g.fillRect(0, 0, W, H);
  let k = SHOTS.length - 1;
  while (k > 0 && tt < TS[k]) k--;
  const sh = SHOTS[k], lt = tt - TS[k];
  if (sh.sc) {
    SCENES[IDX[sh.sc]].draw(sh.at + lt);
    px(0, 0, W, BAR, '#020207');
    px(0, H - BAR, W, BAR, '#020207');
  } else if (sh.title) {
    drawTitleCard(lt);
  } else {
    drawCard(sh, lt);
  }
  if (sh.fi) { const a = 1 - seg(lt, 0, sh.fi); if (a > 0.005) flash('#05040a', a); }
  if (sh.fo) { const a = seg(lt, sh.dur - sh.fo, sh.dur); if (a > 0.005) flash('#05040a', a); }
  px(0, H - 2, W * clamp(tt / T_TOTAL, 0, 1), 1, rgba('#ff4d64', 0.5));
}

/* ---------- overlay: bloom + vignette + grain ---------- */
let vScale = 1;
function resize() {
  const vw = innerWidth, vh = innerHeight;
  vScale = Math.min(vw / W, vh / H);
  const cw = Math.round(W * vScale), ch = Math.round(H * vScale);
  if (cvs.width !== W * PXS) { cvs.width = W * PXS; cvs.height = H * PXS; }
  cvs.style.width = cw + 'px'; cvs.style.height = ch + 'px';
  const dpr = Math.min(devicePixelRatio || 1, 2);
  fxc.width = Math.round(cw * dpr); fxc.height = Math.round(ch * dpr);
  fxc.style.width = cw + 'px'; fxc.style.height = ch + 'px';
  makeVignette();
}
let vigCache = null;
function makeVignette() {
  vigCache = document.createElement('canvas');
  vigCache.width = fxc.width; vigCache.height = fxc.height;
  const c = vigCache.getContext('2d');
  const grd = c.createRadialGradient(
    vigCache.width / 2, vigCache.height / 2, vigCache.height * 0.42,
    vigCache.width / 2, vigCache.height / 2, vigCache.height * 0.85);
  grd.addColorStop(0, 'rgba(0,0,0,0)');
  grd.addColorStop(1, 'rgba(4,2,10,0.42)');
  c.fillStyle = grd; c.fillRect(0, 0, vigCache.width, vigCache.height);
}
const grainTiles = [];
for (let k = 0; k < 3; k++) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128;
  const cc = c.getContext('2d'), im = cc.createImageData(128, 128);
  for (let i = 0; i < im.data.length; i += 4) {
    const v = 118 + Math.random() * 137 | 0;
    im.data[i] = v; im.data[i + 1] = v; im.data[i + 2] = v;
    im.data[i + 3] = Math.random() * 26;
  }
  cc.putImageData(im, 0, 0);
  grainTiles.push(c);
}
let frameNo = 0;
function drawOverlay() {
  fg.clearRect(0, 0, fxc.width, fxc.height);
  try {
    fg.save();
    fg.globalCompositeOperation = 'lighter';
    fg.imageSmoothingEnabled = true;
    fg.globalAlpha = 0.10;
    fg.filter = 'blur(' + Math.max(1.5, fxc.width / 480) + 'px)';
    fg.drawImage(cvs, 0, 0, fxc.width, fxc.height);
    fg.globalAlpha = 0.10;
    fg.filter = 'blur(' + Math.max(4, fxc.width / 150) + 'px)';
    fg.drawImage(cvs, 0, 0, fxc.width, fxc.height);
    fg.restore();
    fg.filter = 'none';
  } catch (e) {}
  if (vigCache) fg.drawImage(vigCache, 0, 0);
  const tile = grainTiles[frameNo % 3];
  fg.save();
  fg.globalAlpha = 0.35;
  const pat = fg.createPattern(tile, 'repeat');
  fg.translate((frameNo * 37) % 128, (frameNo * 53) % 128);
  fg.fillStyle = pat;
  fg.fillRect(-128, -128, fxc.width + 256, fxc.height + 256);
  fg.restore();
}

/* ---------- state machine: menu | play | end ---------- */
let state = 'menu';
let tt = 0, prevT = 0, playing = false;
let lastNow = 0, menuT = 0, uiTimer = 0;
const endEl = document.getElementById('end');

function musicFrame(t) {
  let cfg = CUES[0][1];
  for (const cu of CUES) if (t >= cu[0]) cfg = cu[1];
  Music.setCfg(cfg);
  if (playing && t > prevT && t - prevT < 0.5)
    for (const fx2 of SFX) if (fx2[0] > prevT && fx2[0] <= t) Music.sfx(fx2[1]);
  Music.tick(playing);
}

function frame(now) {
  const dt = Math.min((now - lastNow) / 1000, 0.05);
  lastNow = now;
  frameNo++;
  g.setTransform(PXS, 0, 0, PXS, 0, 0);
  if (state === 'menu') {
    menuT += dt;
    drawPosterBg(menuT, 'menu');
  } else if (state === 'end') {
    menuT += dt;
    drawPosterBg(menuT, 'end');
    Music.setCfg(END_CFG); Music.tick(true);
  } else {
    if (playing) { prevT = tt; tt += dt; }
    if (tt >= T_TOTAL) {
      tt = T_TOTAL - 0.01; playing = false;
      state = 'end'; menuT = 0;
      endEl.classList.add('show');
      wrap.classList.remove('hidecur');
      Music.sfx('final');
    } else {
      renderTrailer(tt);
      musicFrame(tt);
      if (playing) prevT = tt;
    }
  }
  drawOverlay();
  requestAnimationFrame(frame);
}

/* ---------- controls ---------- */
function startTrailer() {
  Music.init(); Music.resume();
  state = 'play'; tt = 0; prevT = 0; playing = true;
  wrap.classList.remove('menu');
  endEl.classList.remove('show');
  bumpUI();
}
function setPlaying(p) {
  if (state !== 'play') return;
  playing = p;
  if (p) Music.resume(); else Music.suspend();
  btnPause.innerHTML = p ? ICONS.pause : ICONS.play;
  if (!p) wrap.classList.add('ui');
  bumpUI();
}
function bumpUI() {
  if (state !== 'play') return;
  wrap.classList.add('ui'); wrap.classList.remove('hidecur');
  clearTimeout(uiTimer);
  if (playing) uiTimer = setTimeout(() => {
    wrap.classList.remove('ui');
    if (state === 'play') wrap.classList.add('hidecur');
  }, 2600);
}

const ICONS = {
  play: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1l10 6-10 6z" fill="#fff"/></svg>',
  pause: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="1" width="4" height="12" fill="#fff"/><rect x="8" y="1" width="4" height="12" fill="#fff"/></svg>',
  vol: '<svg width="15" height="15" viewBox="0 0 15 15"><path d="M1 5h3l4-4v13l-4-4H1z" fill="#fff"/><path d="M10 4c2 1.8 2 5.2 0 7" stroke="#fff" fill="none" stroke-width="1.4"/></svg>',
  volOff: '<svg width="15" height="15" viewBox="0 0 15 15"><path d="M1 5h3l4-4v13l-4-4H1z" fill="#fff"/><path d="M10 5l4 5M14 5l-4 5" stroke="#fff" stroke-width="1.4"/></svg>',
  full: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="#fff" fill="none" stroke-width="1.6"/></svg>'
};
const btnPause = document.getElementById('bPause');
const btnMute = document.getElementById('bMute');
const btnFull = document.getElementById('bFull');
btnPause.innerHTML = ICONS.pause;
btnMute.innerHTML = ICONS.vol;
btnFull.innerHTML = ICONS.full;

btnPause.addEventListener('click', e => { e.stopPropagation(); setPlaying(!playing); });
btnMute.addEventListener('click', e => {
  e.stopPropagation();
  Music.setMute(!Music.muted);
  btnMute.innerHTML = Music.muted ? ICONS.volOff : ICONS.vol;
});
btnFull.addEventListener('click', e => {
  e.stopPropagation();
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
});
document.getElementById('ui').addEventListener('click', e => e.stopPropagation());
document.getElementById('btnAgain').addEventListener('click', e => {
  e.stopPropagation(); startTrailer();
});

wrap.addEventListener('click', () => {
  if (state === 'menu') { startTrailer(); return; }
  if (state === 'end') return;                    // the buttons do the talking
  setPlaying(!playing);
});
window.addEventListener('mousemove', bumpUI);
window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (state === 'play') setPlaying(!playing);
    else if (state === 'menu') startTrailer();
  }
  else if (e.key === 'm') btnMute.click();
  else if (e.key === 'f') btnFull.click();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) setPlaying(false); });
window.addEventListener('resize', resize);

/* favicon: the trailer wears the bouquet's ocean blue */
(() => {
  const c = document.createElement('canvas'); c.width = 16; c.height = 16;
  const cc = c.getContext('2d');
  cc.fillStyle = '#4aa8e8';
  const m = ['0110110', '1111111', '1111111', '1111111', '0111110', '0011100'];
  for (let r = 0; r < 6; r++) for (let q = 0; q < 7; q++)
    if (m[r][q] === '1') cc.fillRect(1 + q * 2, 2 + r * 2, 2, 2);
  const l = document.createElement('link');
  l.rel = 'icon'; l.href = c.toDataURL();
  document.head.appendChild(l);
})();

/* headless-harness hooks (no-ops in the browser) */
window.__renderTrailer = renderTrailer;
window.__drawPosterBg = drawPosterBg;
window.__T_TOTAL = T_TOTAL;

resize();
requestAnimationFrame(n => { lastNow = n; requestAnimationFrame(frame); });
