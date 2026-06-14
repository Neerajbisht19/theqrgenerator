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
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  QR.type = t;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  const panel = document.getElementById('p-' + t);
  if (panel) panel.classList.add('on');
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
      let u = `upi://pay?pa=${encodeURIComponent(id)}`;
      if (nm) u += `&pn=${encodeURIComponent(nm)}`;
      if (am && parseFloat(am) > 0) u += `&am=${am}&cu=INR`;
      if (nt) u += `&tn=${encodeURIComponent(nt)}`;
      u += '&mode=02&purpose=00';
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
      return a ? `https://maps.google.com/?q=${encodeURIComponent(a)}` : null;
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
      width: QR.size, height: QR.size,
      colorDark: '#000000', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch(e) {
    showNotification('Error generating QR. Please check your input.', 'error');
    document.body.removeChild(tmp);
    return;
  }

  setTimeout(() => {
    const src = tmp.querySelector('canvas');
    if (src) renderQR(src);
    document.body.removeChild(tmp);
    const res = document.getElementById('qr-result');
    if (res) {
      res.classList.add('show');
      setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, 150);
}

// Render styled QR to canvas
function renderQR(src) {
  const sz = QR.size;
  const out = document.getElementById('qrc');
  if (!out) return;
  out.width = sz; out.height = sz;
  const ctx = out.getContext('2d');
  const sCtx = src.getContext('2d');
  const srcW = src.width, srcH = src.height;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sz, sz);

  const imgData = sCtx.getImageData(0, 0, srcW, srcH);
  const data = imgData.data;
  const cW = sz / srcW, cH = sz / srcH;

  if (QR.style === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, sz, sz);
    grad.addColorStop(0, QR.color);
    grad.addColorStop(1, lightenColor(QR.color, .4));
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = QR.color;
  }

  for (let row = 0; row < srcH; row++) {
    for (let col = 0; col < srcW; col++) {
      const idx = (row * srcW + col) * 4;
      if (data[idx] >= 128) continue;
      const x = col * cW, y = row * cH;
      const pad = cW * 0.06, s = cW - pad * 2;
      if (QR.style === 'dots') {
        const r = (cW / 2) - pad;
        ctx.beginPath();
        ctx.arc(x + cW / 2, y + cH / 2, Math.max(r, 0.5), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x + pad, y + pad, s, s);
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
  const a = document.createElement('a');
  a.download = `theqrgenerator-${QR.type}.png`;
  a.href = c.toDataURL('image/png');
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
  const links = document.querySelector('.nav-links');
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
