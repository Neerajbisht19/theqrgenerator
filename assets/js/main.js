/* =============================================
   THE QR GENERATOR — Core JS
   theqrgenerator.in
   ============================================= */

// State
const QR = {
  type: 'url',
  style: 'classic',
  color: '#000000',
  size: 260
};

const TYPE_LABELS = {
  url: 'WEBSITE URL',
  whatsapp: 'WHATSAPP',
  upi: 'UPI PAYMENT',
  wifi: 'WIFI NETWORK',
  instagram: 'INSTAGRAM',
  youtube: 'YOUTUBE',
  phone: 'PHONE CALL',
  email: 'EMAIL',
  maps: 'GOOGLE MAPS',
  sms: 'SMS MESSAGE',
  twitter: 'TWITTER / X',
  text: 'PLAIN TEXT'
};

// Step navigation
function goStep(n) {
  [1,2,3].forEach(i => {
    const s = document.getElementById('s' + i);
    const sp = document.getElementById('sp' + i);
    if (s) s.style.display = i === n ? 'block' : 'none';
    if (sp) {
      sp.className = 'step' + (i < n ? ' done' : i === n ? ' active' : '');
    }
    if (i < 3) {
      const line = document.getElementById('sl' + i);
      if (line) line.classList.toggle('done', i < n);
    }
  });
  const res = document.getElementById('qr-result');
  if (res) res.classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectType(t, el) {

  const toolPages = {
    url: '/website-qr-code-generator',
    whatsapp: '/whatsapp-qr-code-generator',
    upi: '/upi-qr-code-generator',
    wifi: '/wifi-qr-code-generator',
    instagram: '/instagram-qr-code-generator',
    youtube: '/youtube-qr-code-generator',
    maps: '/google-maps-qr-code-generator',
    email: '/email-qr-code-generator',
    sms: '/sms-qr-code-generator',
    phone: '/phone-qr-code-generator',
    twitter: '/twitter-qr-code-generator',
    text: '/text-qr-code-generator'
  };

  if (toolPages[t]) {
    window.location.href = toolPages[t];
  }
}

function selectStyle(s, el) {
  document.querySelectorAll('.style-opt').forEach(o => o.classList.remove('on'));
  el.classList.add('on');
  QR.style = s;
}

function selectColor(el) {
  document.querySelectorAll('.color-swatch').forEach(d => d.classList.remove('on'));
  el.classList.add('on');
  QR.color = el.dataset.c;
}

function selectCustomColor(v) {
  document.querySelectorAll('.color-swatch').forEach(d => d.classList.remove('on'));
  QR.color = v;
}

function selectSize(s, btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  QR.size = s;
}

// Get QR data string for current type
function getQRData() {
  const v = id => (document.getElementById(id)?.value.trim() || '');

  switch (QR.type) {
    case 'url':
      return v('v-url') || 'https://theqrgenerator.in';

    case 'whatsapp': {
      const ph = v('v-waph').replace(/\D/g, '');
      if (!ph) return null;
      const cc = document.getElementById('v-wacc')?.value || '91';
      const msg = v('v-wamsg');
      return `https://wa.me/${cc}${ph}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
    }

    case 'upi': {
  const id = v('v-upiid');
  if (!id) return null;

  const nm = v('v-upinm');
  const am = v('v-upiam');
  const nt = v('v-upinote');

  let u = `upi://pay?pa=${id.trim()}`;

  if (nm) u += `&pn=${encodeURIComponent(nm)}`;
  if (am && parseFloat(am) > 0) u += `&am=${parseFloat(am)}`;
  u += `&cu=INR`;
  if (nt) u += `&tn=${encodeURIComponent(nt)}`;

  return u;
    }

    case 'wifi': {
      const ss = v('v-wfss');
      if (!ss) return null;
      const pw = document.getElementById('v-wfpw')?.value || '';
      const sc = document.getElementById('v-wfsc')?.value || 'WPA';
      const esc = s => s.replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/"/g,'\\"').replace(/:/g,'\\:');
      return `WIFI:T:${sc};S:${esc(ss)};P:${esc(pw)};;`;
    }

    case 'instagram': {
      const u = v('v-ig').replace('@', '');
      return u ? `https://www.instagram.com/${u}/` : null;
    }

    case 'youtube': {
      const h = v('v-yt');
      if (!h) return null;
      return h.startsWith('http') ? h : `https://www.youtube.com/${h.startsWith('@') ? h : '@' + h}`;
    }

    case 'phone': {
      const p = v('v-ph');
      return p ? `tel:${p}` : null;
    }

    case 'email': {
      const to = v('v-emto');
      if (!to) return null;
      const sub = v('v-emsub'), body = v('v-embody');
      return `mailto:${to}${sub || body ? '?' : ''}${sub ? 'subject=' + encodeURIComponent(sub) : ''}${sub && body ? '&' : ''}${body ? 'body=' + encodeURIComponent(body) : ''}`;
    }

    case 'maps': {
      const a = v('v-mp');
      if (!a) return null;
      // Smart Logic: Check if it's already a direct Google Maps URL
      if (a.toLowerCase().startsWith('http://') || a.toLowerCase().startsWith('https://')) {
        return a;
      }
      // If it's just a text address, format it as a search query
      return `https://maps.google.com/maps?q=${encodeURIComponent(a)}`;
    }

    case 'sms': {
      const p = v('v-smph');
      if (!p) return null;
      const m = v('v-smmsg');
      return `sms:${p}${m ? '?body=' + encodeURIComponent(m) : ''}`;
    }

    case 'twitter': {
      const u = v('v-tw').replace('@', '');
      return u ? `https://twitter.com/${u}` : null;
    }

    case 'text':
      return v('v-tx') || null;

    default:
      return null;
  }
}

// Generate QR
function generateQR() {
  const data = getQRData();
  if (!data) { showNotification('Please fill in the required details.', 'error'); return; }

  // Mark all steps done
  [1,2,3].forEach(i => {
    const sp = document.getElementById('sp' + i);
    if (sp) sp.className = 'step done';
    const s = document.getElementById('s' + i);
    if (s) s.style.display = 'none';
    if (i < 3) { const line = document.getElementById('sl' + i); if (line) line.classList.add('done'); }
  });

  // Update badge
  const badge = document.getElementById('qr-type-badge');
  if (badge) badge.textContent = TYPE_LABELS[QR.type] || QR.type.toUpperCase();

  const tmp = document.createElement('div');
  tmp.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;';
  document.body.appendChild(tmp);

  try {
    new QRCode(tmp, {
      text: data,
      // FIX Bug 5a: Generate at 4× the display size internally so qrcodejs gives us
      // a high-density source canvas. renderQR will then scale DOWN to QR.size,
      // which is always safe (downscaling never blurs module edges when we
      // sample at integer module-center coordinates).
      width: QR.size * 4, height: QR.size * 4,
      colorDark: '#000000', colorLight: '#ffffff',
      // FIX Bug 5b: Upgrade from M (15%) to H (30%) error correction.
      // UPI QR codes are printed and laminated — H gives them resilience against
      // scratches, dirt, and print artifacts that M cannot recover from.
      correctLevel: QRCode.CorrectLevel.H
    });
  } catch(e) {
    showNotification('Error generating QR. Please check your input.', 'error');
    document.body.removeChild(tmp);
    return;
  }

  setTimeout(() => {
    const src = tmp.querySelector('canvas');
    // FIX: pass the originally-requested display size so renderQR can use it
    // for module detection (qrcodejs canvas != QR.size due to floor arithmetic)
    if (src) renderQR(src, QR.size * 4);
    document.body.removeChild(tmp);
    const res = document.getElementById('qr-result');
    if (res) {
      res.classList.add('show');
      setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, 150);
}

// ---------------------------------------------------------------------------
// detectModuleCount — derives QR version from qrcodejs source canvas dimensions
// ---------------------------------------------------------------------------
// qrcodejs computes: cellSize = Math.floor(requestedSize / moduleCount)
// actual canvas size = cellSize * moduleCount  (≤ requestedSize)
// Valid module counts: 21 + 4*(version-1) for version 1–40
// We try every valid count and check which one satisfies the equation.
function detectModuleCount(srcW, requestedSize) {
  for (let version = 1; version <= 40; version++) {
    const mc = 21 + 4 * (version - 1);
    const cs = Math.floor(requestedSize / mc);
    if (cs >= 1 && cs * mc === srcW) {
      return { moduleCount: mc, cellSize: cs };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// renderQR — fixed version
// ---------------------------------------------------------------------------
// requestedSize: the width/height we passed to `new QRCode(...)`. We need this
// to reverse-engineer the module count, because qrcodejs sets the canvas to
// Math.floor(requestedSize/moduleCount)*moduleCount, NOT requestedSize itself.
function renderQR(src, requestedSize) {
  const sz = QR.size;           // display output size (e.g. 260)
  const out = document.getElementById('qrc');
  if (!out) return;

  const sCtx = src.getContext('2d');
  const srcW = src.width;       // actual qrcodejs canvas width (≤ requestedSize)
  const srcH = src.height;

  // ------------------------------------------------------------------
  // FIX Bug 1a: Detect the module grid so we can work in integer space.
  // ------------------------------------------------------------------
  const detected = detectModuleCount(srcW, requestedSize);
  if (!detected) {
    // Fallback: if detection fails (should not happen for QR v1-40),
    // just blit with drawImage — better than garbage output.
    out.width = sz; out.height = sz;
    const ctx = out.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sz, sz);
    ctx.drawImage(src, 4, 4, sz - 8, sz - 8);
    return;
  }
  const { moduleCount, cellSize: srcCell } = detected;

  // ------------------------------------------------------------------
  // FIX Bug 3: Quiet zone — ISO 18004 requires ≥4 modules of white
  // border around the symbol. We allocate a fixed 12px quiet zone on
  // each side (≥ 4 modules at the smallest module size we render).
  // ------------------------------------------------------------------
  const QZ = 12;  // quiet-zone pixels in output canvas

  // FIX Bug 1b: Compute integer output cell width so every module lands
  // on a whole-pixel boundary — eliminates sub-pixel anti-aliasing.
  const outCell = Math.floor((sz - QZ * 2) / moduleCount);

  // If outCell is somehow 0 (extremely small canvas), bail to fallback.
  if (outCell < 1) {
    out.width = sz; out.height = sz;
    const ctx = out.getContext('2d');
    ctx.drawImage(src, 0, 0, sz, sz);
    return;
  }

  // Centre the symbol inside the canvas (remaining pixels split as margin).
  const qrPx = outCell * moduleCount;
  const xOff = Math.floor((sz - qrPx) / 2);  // left/top offset (includes QZ)
  const yOff = xOff;

  // ------------------------------------------------------------------
  // FIX Bug 6: Disable anti-aliasing on the output canvas context.
  // ------------------------------------------------------------------
  out.width = sz;
  out.height = sz;
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // White background (covers quiet zone too).
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sz, sz);

  // ------------------------------------------------------------------
  // Read pixel data from the source once (avoids repeated getImageData).
  // ------------------------------------------------------------------
  const imgData = sCtx.getImageData(0, 0, srcW, srcH);
  const pixels = imgData.data;

  // Helper: is a source module (col, row) dark?
  // Sample from the CENTER of the source cell to avoid edge anti-aliasing
  // that qrcodejs may have introduced at the 1px level.
  function isDark(col, row) {
    const px = (row * srcCell + Math.floor(srcCell / 2)) * srcW + (col * srcCell + Math.floor(srcCell / 2));
    return pixels[px * 4] < 128;  // R channel: 0=black, 255=white
  }

  // ------------------------------------------------------------------
  // Choose draw style. Dots require outCell ≥ 6 to be scannable
  // (radius must be ≥ 2px for scanner cameras to resolve).
  // FIX Bug 4: classic style gets zero padding — solid modules are
  //   required for finder patterns to decode correctly.
  // FIX Bug 5: dots fall back to classic when outCell < 6.
  // ------------------------------------------------------------------
  const style = (QR.style === 'dots' && outCell < 6) ? 'classic' : QR.style;

  // Set fill colour / gradient for the whole pass.
  if (style === 'gradient') {
    const grad = ctx.createLinearGradient(xOff, yOff, xOff + qrPx, yOff + qrPx);
    grad.addColorStop(0, QR.color);
    grad.addColorStop(1, lightenColor(QR.color, 0.4));
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = QR.color;
  }

  // ------------------------------------------------------------------
  // Main render loop — integer coordinates throughout.
  // ------------------------------------------------------------------
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!isDark(col, row)) continue;

      // Integer pixel position — NO fractional values, NO anti-aliasing.
      const x = xOff + col * outCell;
      const y = yOff + row * outCell;

      if (style === 'dots') {
        // FIX Bug 5: integer radius, minimum 2px so camera can resolve it.
        const r = Math.max(2, Math.floor(outCell / 2) - 1);
        const cx = x + Math.floor(outCell / 2);
        const cy = y + Math.floor(outCell / 2);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // classic & gradient: solid square, zero padding.
        // FIX Bug 4: removed the 6% pad that was fragmenting finder patterns.
        ctx.fillRect(x, y, outCell, outCell);
      }
    }
  }
}

function lightenColor(hex, amt) {
  let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  r = Math.min(255, Math.round(r + (255-r)*amt));
  g = Math.min(255, Math.round(g + (255-g)*amt));
  b = Math.min(255, Math.round(b + (255-b)*amt));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

// Download
function downloadPNG() {
  const c = document.getElementById('qrc');
  if (!c) return;
  // FIX: Export at 2× the display size for crisp print quality.
  // We re-render into a temporary off-screen canvas at double resolution
  // using the same integer-coordinate approach so the download is always
  // pixel-perfect and scannable regardless of screen DPI.
  const scale = 2;
  const offscreen = document.createElement('canvas');
  offscreen.width = c.width * scale;
  offscreen.height = c.height * scale;
  const octx = offscreen.getContext('2d');
  octx.imageSmoothingEnabled = false;
  octx.drawImage(c, 0, 0, offscreen.width, offscreen.height);
  const a = document.createElement('a');
  a.download = `theqrgenerator-${QR.type}.png`;
  a.href = offscreen.toDataURL('image/png');
  a.click();
}

function downloadSVG() {
  const c = document.getElementById('qrc');
  if (!c) return;
  const sz = QR.size;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}"><image href="${c.toDataURL('image/png')}" width="${sz}" height="${sz}"/></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const a = document.createElement('a');
  a.download = `theqrgenerator-${QR.type}.svg`;
  a.href = url; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function reEdit() {
  const res = document.getElementById('qr-result');
  if (res) res.classList.remove('show');
  goStep(3);
}

// FAQ
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// Notification
function showNotification(msg, type = 'info') {
  const n = document.createElement('div');
  n.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    padding:14px 20px;border-radius:10px;
    font-size:14px;font-weight:600;
    background:${type === 'error' ? '#e8000d' : '#111'};
    color:#fff;border:1px solid rgba(255,255,255,.15);
    box-shadow:0 8px 32px rgba(0,0,0,.5);
    animation:slideIn .3s ease;
    max-width:320px;
  `;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4000);
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!');
  }).catch(() => {
    showNotification('Could not copy.', 'error');
  });
}

// Copy page URL
function copyPageURL() {
  copyToClipboard(window.location.href);
}

// Mobile nav toggle
function initNav() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    
});
  }
}

// Scroll animation
function initScrollAnim() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnim();
});

/* ─── NAV FIX: overwrite initNav so it doesn't conflict with inline onclick ─── */
function initNav() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  // Remove any inline onclick from the button so there's no double-toggle
  toggle.removeAttribute('onclick');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when a nav link is tapped (mobile UX)
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
