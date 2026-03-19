# Womondo Pegasus — Webflow Embedding Instructions

There are **two ways** to use this Pegasus page. Choose the one that fits best.

---

## Option A: Standalone Site on Vercel (RECOMMENDED)

The easiest and most reliable approach. The Pegasus page lives at its own URL
(e.g., `pegasus.womondo-by-robeta.com`) and you link to it from the main Webflow nav.

**Steps:**
1. Push the `womondo-pegasus` folder to GitHub (e.g., `rkordin/womondo-pegasus`)
2. Connect the repo to Vercel
3. Add a custom domain (subdomain of womondo-by-robeta.com)
4. In Webflow, add a nav link pointing to the subdomain

**Pros:** Zero CSS/JS conflicts, independent deploy, full animation support
**Cons:** Separate domain (but this is normal for product sub-sites)

---

## Option B: Embed Into Webflow Page

Use this if you want the Pegasus page to live at `womondo-by-robeta.com/pegasus`.

### Prerequisites

1. Push the `womondo-pegasus` repo to GitHub at `rkordin/womondo-pegasus`
2. Create a tag/release (e.g., `v1.0`) so jsDelivr can serve the files

### Step 1: Create a Blank Webflow Page

In Webflow Designer:
- Create a new page at `/pegasus`
- Set it to **Blank** (no Webflow nav/footer — we have our own)
- Under Page Settings, check "Exclude from sitemap" if desired

### Step 2: HEAD — Custom Code (Page Settings → Head Code)

Paste this in the **Head Code** section of the Pegasus page:

```html
<!-- Pegasus Page: Fonts + CSS -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Google Fonts (secondary) -->
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
<script>WebFont.load({ google: { families: ["Oswald:200,300,400,500,600,700","Montserrat:300,400,500,600,700,800,900","Host Grotesk:300,400,500,600,700","Inter:300,400,500,600,700"] } });</script>

<!-- Typekit (aktiv-grotesk-condensed) — already loaded site-wide, skip if duplicate -->
<!-- <script src="https://use.typekit.net/hba4whm.js"></script> -->
<!-- <script>try{Typekit.load();}catch(e){}</script> -->

<!-- Pegasus CSS bundle (served from GitHub via jsDelivr) -->
<!-- UPDATE: Replace @v1.0 with your actual tag -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/dist/assets/index-DKMme04x.css">

<!-- Pegasus structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.womondo-by-robeta.com/#org",
      "name": "Womondo by Robeta",
      "url": "https://www.womondo-by-robeta.com/"
    },
    {
      "@type": "Product",
      "name": "Womondo Pegasus",
      "description": "Premium Mercedes-based campervan. Grace, power, and the freedom to soar.",
      "category": "Campervan",
      "brand": { "@type": "Brand", "name": "Womondo" },
      "manufacturer": { "@id": "https://www.womondo-by-robeta.com/#org" },
      "offers": [
        {
          "@type": "Offer",
          "name": "Pegasus Regular",
          "price": "99790",
          "priceCurrency": "EUR"
        },
        {
          "@type": "Offer",
          "name": "Pegasus PRO",
          "price": "115390",
          "priceCurrency": "EUR"
        }
      ]
    }
  ]
}
</script>

<style>
  /* Hide Webflow's default elements on this page */
  .page-wrapper { opacity: 0; visibility: hidden; }
  /* Prevent Webflow body styles from interfering */
  body { background-color: #0f0f0f !important; }
</style>
```

### Step 3: BODY — Page Content

In Webflow Designer, add a single **Embed** element to the page body.
Paste the full HTML body content (everything between `<body>` and `</body>` from the built page).

The body HTML is in: `womondo-pegasus/dist/index.html`
Copy everything from line 119 (after `<body>`) to line 668 (before the scripts).

> **IMPORTANT:** The HTML references images at `/images/...` and videos at `/videos/...`.
> You must replace these paths with either:
>
> **Option 1 — jsDelivr (from GitHub):**
> Replace `/images/HERO.jpg` with
> `https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/images/HERO.jpg`
>
> **Option 2 — Webflow CDN (recommended):**
> Upload all images to Webflow Assets and use the Webflow CDN URLs.
> Many images are already on the Webflow CDN from the existing site.

### Step 4: BODY — Footer Scripts (Page Settings → Footer Code)

Paste this in the **Footer Code** section:

```html
<!-- Pegasus JS bundle (GSAP + animations) -->
<!-- UPDATE: Replace @v1.0 with your actual tag -->
<script type="module" crossorigin src="https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/dist/assets/index-BTo-RvYk.js"></script>

<!-- Pegasus Configurator (5-step wizard modal) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
  window.PEGASUS_CFG = {
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJRrHWEDgLGO4Y0VYpv-R8wZKARPOw8AERmSzDDYn22RuPcx6LEiRurf15ODf25x97ZI8bC8buw-6d/pub?output=csv',
    webhookUrl: 'https://eomp5vj3zurf6as.m.pipedream.net',
    debug: false
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/rkordin/womondo-configurator@11c020f/pegasus-configurator.js" defer></script>
```

### Step 5: Font Files

The CSS bundle references local font files at `/fonts/Satoshi-*.woff2` etc.
For Webflow, you need to either:

1. **Upload fonts to Webflow** (Settings → Fonts → Custom Fonts)
   Then update the CSS `@font-face` URLs — or override them in Head Code

2. **Serve from GitHub** — Add this to Head Code to override font paths:

```html
<style>
@font-face { font-family: Satoshi; src: url('https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/fonts/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: Satoshi; src: url('https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/fonts/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: Satoshi; src: url('https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/fonts/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }
@font-face { font-family: Satoshi; src: url('https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/fonts/Satoshi-Black.woff2') format('woff2'); font-weight: 900; font-display: swap; }
@font-face { font-family: 'Instrument Serif'; src: url('https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/fonts/InstrumentSerif-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Instrument Serif'; src: url('https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/fonts/InstrumentSerif-Italic.woff2') format('woff2'); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: Bebasneue; src: url('https://cdn.jsdelivr.net/gh/rkordin/womondo-pegasus@v1.0/public/fonts/BebasNeue.otf') format('opentype'); font-weight: 400; font-display: swap; }
</style>
```

---

## File Inventory (What's on GitHub)

```
womondo-pegasus/
├── dist/                          ← Built output (what gets served)
│   ├── index.html                 ← Full page HTML
│   └── assets/
│       ├── index-DKMme04x.css     ← All CSS bundled (34 KB)
│       └── index-BTo-RvYk.js     ← All JS bundled inc. GSAP (176 KB)
├── public/                        ← Static assets (copied to dist/ on build)
│   ├── fonts/                     ← Satoshi, Instrument Serif, Bebas Neue, Inter
│   ├── images/                    ← All Pegasus photos, logos, icons
│   └── videos/                    ← Hero background video
├── src/                           ← Source code (for development)
│   ├── css/                       ← 8 CSS files (base, nav, hero, sections, etc.)
│   └── js/                        ← 5 JS modules (main, hero, nav, scroll, form)
├── index.html                     ← Source HTML (Vite entry point)
├── package.json                   ← Vite + GSAP dependencies
└── vite.config.js                 ← Build config
```

## External Dependencies (loaded from CDN, not bundled)

| What | URL | Purpose |
|------|-----|---------|
| jsPDF | `cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js` | PDF quote generation |
| Configurator | `cdn.jsdelivr.net/gh/rkordin/womondo-configurator@11c020f/pegasus-configurator.js` | 5-step wizard modal |
| Google Sheets CSV | `docs.google.com/spreadsheets/...` | Live pricing data |
| Pipedream Webhook | `eomp5vj3zurf6as.m.pipedream.net` | Form submission backup |
| HubSpot Forms | `hubspotonwebflow.com/api/forms/...` | CRM integration |

---

## Potential Conflicts with Webflow

| Issue | Solution |
|-------|----------|
| Webflow loads its own CSS reset | The Pegasus CSS uses scoped class names — minimal conflict |
| Webflow might load GSAP too | The Pegasus JS bundle includes its own GSAP — this is fine, they don't conflict |
| Webflow nav/footer | Use a Blank page template so Webflow doesn't inject its own nav/footer |
| Body background color | Override in Head Code: `body { background-color: #0f0f0f !important; }` |
| Font loading | Override `@font-face` URLs in Head Code to point to CDN |

---

## Quick Checklist

- [ ] Push `womondo-pegasus` to GitHub
- [ ] Create a release tag (e.g., `v1.0`)
- [ ] In Webflow: create blank `/pegasus` page
- [ ] Paste Head Code (CSS link + fonts + structured data)
- [ ] Paste Body HTML via Embed element
- [ ] Replace image paths with Webflow CDN URLs or jsDelivr URLs
- [ ] Paste Footer Code (JS bundle + configurator scripts)
- [ ] Test on desktop and mobile
- [ ] Verify configurator opens and loads pricing from Google Sheets
- [ ] Verify form submission reaches HubSpot + webhook
