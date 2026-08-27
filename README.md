# Embedded Pandora

A personal, long-term knowledge base for everything learned about
electronics, embedded systems, sensors, protocols, Linux, networking,
bootloaders, and Snap packaging — also a static website, deployable
directly to Vercel.

Every topic lives in its own logically organized folder (domain → category
→ topic): SPI and I2C are separate topics under `protocols/`, TCP/IP/UDP
are separate topics under `networking/`, Linux, bootloaders, and Snap each
evolve independently. Nothing gets dumped into a catch-all folder.

**Browse:** open `index.html` (see "Running locally" below), or visit the
deployed Vercel URL once set up.

**Adding new content, folder conventions, naming, deployment, and the
classification rule that keeps this from turning into a junk drawer:**
see [`GUIDE.md`](./GUIDE.md).

## Quick start

```sh
# serve locally (root-relative asset paths need real HTTP, not file://)
npx serve .
# or
python3 -m http.server 8000

# rebuild the search index after adding/renaming pages
node scripts/build-search-index.js
```

## Stack

Plain HTML, CSS, and a small amount of vanilla JavaScript — no framework,
no build step required to browse it, genuinely static. The only generated
artifact is `assets/search-index.json`, produced by
`scripts/build-search-index.js` for the homepage search box.

## License

MIT — see [`LICENSE`](./LICENSE).
