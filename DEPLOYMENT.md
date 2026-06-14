# The QR Generator — Deployment Guide
## theqrgenerator.in

---

## Folder Structure

theqrgenerator/
├── index.html                          # Homepage
├── qr-code-generator.html              # Universal QR tool (all 12 types)
├── website-qr-code-generator.html
├── whatsapp-qr-code-generator.html
├── upi-qr-code-generator.html
├── wifi-qr-code-generator.html
├── instagram-qr-code-generator.html
├── youtube-qr-code-generator.html
├── google-maps-qr-code-generator.html
├── email-qr-code-generator.html
├── sms-qr-code-generator.html
├── phone-qr-code-generator.html
├── twitter-qr-code-generator.html
├── text-qr-code-generator.html
├── about.html
├── contact.html
├── privacy-policy.html
├── terms.html
├── sitemap.xml
├── robots.txt
├── .htaccess
├── manifest.json
├── blog/
│   ├── index.html                      # Blog listing (50 posts)
│   ├── how-qr-codes-work.html
│   ├── upi-qr-code-for-shops.html
│   └── ... (50 blog post files)
└── assets/
    ├── css/
    │   └── style.css                   # Complete theme
    └── js/
        └── main.js                     # QR generation logic

---

## Hosting Options

### Option 1: Shared Hosting (Hostinger, Bluehost, etc.)
1. Upload entire folder to public_html/
2. Point domain theqrgenerator.in to public_html/
3. .htaccess handles clean URLs automatically
4. Enable SSL/HTTPS in cPanel

### Option 2: Netlify (Recommended — Free)
1. Drag and drop the folder to netlify.com/drop
2. Add custom domain theqrgenerator.in in site settings
3. Netlify handles HTTPS automatically
4. Add _redirects file for clean URLs:
   /qr-code-generator    /qr-code-generator.html    200
   /whatsapp-qr-code-generator    /whatsapp-qr-code-generator.html    200
   /blog/:slug    /blog/:slug.html    200

### Option 3: Vercel
1. Push to GitHub
2. Import to vercel.com
3. Add custom domain
4. Add vercel.json for routing

### Option 4: Cloudflare Pages (Free)
1. Push to GitHub/GitLab
2. Connect to Cloudflare Pages
3. Automatic HTTPS and CDN

---

## Google AdSense Setup

1. Sign up at adsense.google.com
2. Add your site theqrgenerator.in
3. Get your publisher ID (ca-pub-XXXXXXXXXX)
4. Replace <!-- Google AdSense: ca-pub-XXXXXXXX --> comments with actual ad code:

```html
<ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

5. Also add to <head> of each page:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

---

## Google Analytics Setup

Add to <head> of each page (replace G-XXXXXXXXXX):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## SEO Checklist

- [ ] Submit sitemap.xml to Google Search Console
- [ ] Submit sitemap.xml to Bing Webmaster Tools
- [ ] Verify domain in Google Search Console
- [ ] Add Google Analytics
- [ ] Set up Google AdSense
- [ ] Create OG image (1200x630px) at assets/img/og.png
- [ ] Create favicon at assets/img/favicon.ico
- [ ] Create PWA icons at assets/img/icon-192.png and icon-512.png
- [ ] Test all pages on mobile
- [ ] Run Lighthouse audit (target 95+ on all scores)
- [ ] Test QR generation on multiple devices

---

## Performance Tips

1. The QRCode.js library is loaded from Cloudflare CDN — fast globally
2. Google Fonts use preconnect — minimal render blocking
3. All CSS/JS is minimal and unminified for readability — minify for production
4. No external dependencies beyond QRCode.js and Google Fonts
5. All QR generation is client-side — zero server load

---

## Pages Summary: 19 HTML pages + 50 blog posts = 69 total indexable pages
