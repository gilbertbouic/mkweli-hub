# Hub + AML subdomain cutover

Target map:

| Host | Site | Repo |
|------|------|------|
| `mkweli.tech` | Personal hub | this repo (`mkweli-hub`) |
| `aml.mkweli.tech` | Mkweli AML product | `mkweli-website` |
| `lakazagri.mkweli.tech` | LakazAgri product | `lakazagri-website` (unchanged) |

## Before you start

- [ ] Hub preview OK at `https://gilbertbouic.github.io/mkweli-hub/`
- [ ] AML repo updated for `aml.mkweli.tech` (CNAME, sitemap, meta, JSON-LD)
- [ ] **Do not remove** Hostinger MX / SPF (email `gilbert@mkweli.tech`)
- [ ] Rotate any passwords that lived in local notes (`website hostinger.odt`)

## Phase B — Stand up AML on the subdomain first

### 1. Hostinger DNS

Domains → `mkweli.tech` → DNS:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `aml` | `gilbertbouic.github.io` | 3600 |

Keep existing apex **A** records pointing at GitHub Pages:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Optional:

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `gilbertbouic.github.io` |

### 2. AML repo (`mkweli-website`)

1. Ensure `CNAME` contains exactly: `aml.mkweli.tech`
2. Push to `main`
3. GitHub → **Settings → Pages → Custom domain** → `aml.mkweli.tech`
4. Wait for DNS check + certificate **approved**
5. Enable **Enforce HTTPS**
6. Smoke-test: `https://aml.mkweli.tech/` and APK download

At this moment the apex may stop serving the old AML site. Proceed immediately to Phase C.

## Phase C — Point apex at the hub

### 1. This repo (`mkweli-hub`)

1. Add a root file `CNAME` with exactly: `mkweli.tech`
2. Push to `main`
3. GitHub → **Settings → Pages → Custom domain** → `mkweli.tech`
4. Wait for certificate **approved**
5. Enable **Enforce HTTPS**

### 2. Smoke-test checklist

- [ ] `https://mkweli.tech` — personal hub
- [ ] Hub links open `aml.` and `lakazagri.`
- [ ] `https://aml.mkweli.tech` — product + APK
- [ ] `https://lakazagri.mkweli.tech` — unchanged
- [ ] Email still works to `gilbert@mkweli.tech`

## Aftercare

- Update LinkedIn, email signature, WhatsApp blurbs, and any one-pagers to `aml.mkweli.tech` for the app.
- Old deep links like `https://mkweli.tech/Mkweli_v1.0.8.apk` will break after cutover (expected). New URL: `https://aml.mkweli.tech/Mkweli_v1.0.8.apk` (or current APK name).
- Optional later: Cloudflare 301s if residual traffic to old product URLs is high.
- Disconnect Carrd custom domain if it still expects `mkweli.tech`.
