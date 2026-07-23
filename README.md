# Mkweli.tech — personal hub

Personal homepage for **Gilbert Bouic** at [mkweli.tech](https://mkweli.tech).

Product sites live on subdomains:

- [aml.mkweli.tech](https://aml.mkweli.tech) — Mkweli AML
- [lakazagri.mkweli.tech](https://lakazagri.mkweli.tech) — LakazAgri

## Stack

Static HTML / CSS / JS on **GitHub Pages**. No build step.

## Local preview

```bash
# from this directory
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

1. Push `main` to this repo.
2. GitHub → **Settings → Pages** → Deploy from branch `main` / root.
3. Custom domain cutover is documented in [`DNS-CUTOVER.md`](./DNS-CUTOVER.md).

Do **not** add a `CNAME` file for `mkweli.tech` until Hostinger DNS is ready and the AML site has moved to `aml.mkweli.tech`.
