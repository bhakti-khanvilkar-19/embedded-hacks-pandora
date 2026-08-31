# GUIDE — how this repository is organized

Embedded Pandora is a personal, long-term knowledge base for electronics,
embedded systems, sensors, protocols, automotive systems, Linux, networking,
bootloaders, and Snap packaging. It is also a static website (deployable to Vercel with
zero build infrastructure). This document is the single source of truth
for how to keep it organized as it grows — read it before adding anything.

## The core rule

> **Classify first, then place.** Decide domain → category → topic before
> writing a single line. Never drop something into a generic or convenient
> folder just because it's quick — a five-minute misfile costs far more
> than five minutes to untangle a year later.

If a new piece of knowledge could plausibly belong in two places, pick the
more specific one and cross-link from the other, rather than duplicating
the content or picking a vaguer shared folder.

## Folder structure

```
/
├── index.html                 homepage / dashboard
├── GUIDE.md                   this file
├── assets/
│   ├── css/                   base.css (tokens/reset), components.css (UI pieces)
│   ├── js/                    theme.js, includes.js, search.js
│   ├── images/                shared/site-wide images only
│   ├── partials/               header.html, footer.html (injected by includes.js)
│   └── search-index.json      generated — do not hand-edit, see below
├── _templates/                 copy these when starting a new page
├── scripts/                    build-search-index.js
│
├── electronics/                circuit-level fundamentals: V/I/R, components
│   └── <topic>/
├── embedded/                  the microcontroller itself: pins, cores, timing
│   └── <topic>/
├── sensors/                    the sensing element and the physics behind it
│   └── <topic>/
├── protocols/                 wire-level buses: SPI, I2C, UART, CAN, ...
│   └── <topic>/
├── automotive/                 radar/LiDAR/camera sensing, ADAS, UDS, CAPL
│   └── <topic>/
├── networking/                 TCP/IP stack concepts, one layer per topic
│   └── <topic>/
├── linux/                     the OS side: boot, drivers, kernel, processes
│   └── <topic>/
├── bootloaders/                everything before the OS: ROM code, U-Boot
│   └── <topic>/
├── snap/                       Snap packaging, confinement, Ubuntu Core
│   └── <topic>/
└── references/                 material that spans multiple topics
    └── <topic>/
```

Each domain is a top-level folder with its own `index.html` dashboard.
Each topic is a subfolder of exactly one domain, with its own `index.html`.

### Deciding where a domain boundary is

- **Electronics** — circuit-level fundamentals underneath everything else:
  voltage/current/resistance, passive components, semiconductors, data
  converters. Basics-first by design — this is the layer a beginner reads
  before a datasheet.
- **Embedded** — the microcontroller/SoC itself, in isolation: cores, pins,
  interrupts, timers, memory, debugging. Not the protocols it speaks.
- **Sensors** — the sensing element itself and the physics or math behind
  what it measures (GNSS trilateration, MEMS accelerometers, thermocouples).
  Not the wire it's read over — that's Protocols — and not the
  microcontroller reading it — that's Embedded.
- **Protocols** — wire-level communication buses (SPI, I2C, UART, CAN, ...).
  Each protocol is always its own topic, never merged with another just
  because they're "similar" (e.g. SPI and I2C stay separate).
- **Automotive** — the automotive sensing-and-diagnostics stack
  specifically: radar/LiDAR/camera sensors, ADAS features and levels of
  driving automation, and vehicle diagnostic tooling (UDS, CAPL). Kept
  separate from Sensors (which is sensing in general) because this domain
  is about the automotive-specific systems built on top of sensing, not
  the sensing element in isolation.
- **Networking** — the TCP/IP stack and related concepts. Each layer/protocol
  is its own topic (TCP, IP, and UDP are three topics, not one "sockets"
  page), even though they're often learned together.
- **Linux** — the operating system once the kernel is running: kernel
  internals, drivers, processes, memory, filesystems, boot handoff.
- **Bootloaders** — everything that runs *before* an OS exists to run
  anything: ROM code, SPL, U-Boot. Kept separate from Linux because
  bootloader concepts apply even to boards that never run Linux.
- **Snap** — Ubuntu's Snap packaging format and Ubuntu Core. Kept separate
  from Linux because it's a packaging/distribution concern, not an
  OS-internals one.
- **References** — material that genuinely spans multiple topics (books,
  datasheets, curated links). If something is really about one topic, it
  belongs in that topic's own page instead, not here.

If you're about to create a new *domain* (rare — the ten above should
cover almost everything for years), copy an existing domain's `index.html`
as a starting point and add a card for it on the homepage
(`index.html`) and a link in `assets/partials/header.html`.

## Structure of a topic folder

```
<domain>/<topic>/
├── index.html        required — the main concepts/overview page
├── examples.html      optional — only if there's real code worth separating out
├── notes.html         optional — only if "what I learned" entries pile up
└── assets/            optional — topic-specific images/diagrams
```

Don't create `examples.html` or `notes.html` preemptively — start with just
`index.html` and split a section out once it's genuinely too big to sit
inline on the main page.

## How a topic page is written

This is meant to be read for the rest of a career, by people who range
from "never seen this before" to "already an expert looking something
up" — so every page follows the same shape, basics before mechanism
before practice, so a reader can stop the instant they have enough:

1. **Lede** — one or two plain-language sentences. No jargon a beginner
   wouldn't already know.
2. **Quick Reference box** (`<div class="quickref">`) — a 30-second
   summary: what it is, the one-sentence mental model, the key numbers
   worth memorizing, and when to reach for it. This is the part a senior
   engineer skims on the way past and a junior engineer re-reads twice.
3. **Table of contents.**
4. **Concept sections, simplest first.** Prefer `<dl class="kv">` and
   `<ul class="point-list">` bullets over dense paragraphs for anything
   that's fundamentally a list of facts (fields, states, options) — point
   form beats prose for anything meant to be scanned rather than read
   start to end. Save prose paragraphs for where an actual explanation or
   argument is being made, not a list dressed up as sentences.
5. **Real-world Applications** (`<h2 id="applications">`) — concrete
   products or systems this actually shows up in, not abstract use-case
   categories ("used in automotive" is not real-world enough; "the CAN bus
   connecting a car's ECU to its ABS module" is). This is the "how do I
   actually use this" section and should never be skipped — theory
   without a landing point in real hardware isn't finished.
6. **Gotchas / What I learned** — field notes, not textbook facts.

`_templates/topic-index.template.html` has this structure pre-built —
copy it rather than reconstructing it by hand.

## Adding a new topic — step by step

1. **Classify it.** Which domain? Which existing topic, if any, is it
   closest to? If genuinely new, what should the folder be named
   (lowercase, hyphenated, e.g. `one-wire`, not `OneWire` or `one_wire`)?
2. **Copy a template** from `_templates/` into
   `<domain>/<topic>/index.html` and fill in the placeholders. Use an
   existing page in the same domain as a style reference.
3. **Write real content** — concepts, a table or two where useful, a
   callout for gotchas, code examples if they're short (put them in a
   separate `examples.html` if there are many).
4. **Cross-link.** Add `related` entries in the page's `page-meta` JSON
   block to relevant topics elsewhere (e.g. SPI links to GPIO, interrupts,
   and Linux drivers). Add reciprocal links from the other side if it makes
   sense.
5. **Wire up prev/next** if the topic fits into a natural sequence within
   its domain (edit the `prev`/`next` fields in the neighboring pages'
   `page-meta` too).
6. **Update the domain index page** (`<domain>/index.html`): move the topic
   from the "Planned" badge list into the "Topics" list, linking to it.
7. **Rebuild the search index**: `node scripts/build-search-index.js` and
   commit the updated `assets/search-index.json`.

## Naming conventions

- Folders and filenames: lowercase, hyphen-separated (`u-boot`, `one-wire`).
- Page titles: `<Topic> — <Domain> — Embedded Pandora`.
- Use the protocol/technology's own capitalization in visible text (SPI,
  I2C, UART, U-Boot) even though the *folder* name is lowercase.

## Where images and diagrams belong

- Site-wide assets (logo, favicon, shared icons): `assets/images/`.
- A diagram specific to one topic: `<domain>/<topic>/assets/`, referenced
  with a root-relative path, e.g. `/protocols/spi/assets/timing.png`.
- Prefer inline SVG for simple diagrams (see `protocols/spi/index.html`
  for an example) — no extra file, themes automatically via `currentColor`,
  and it's easy to tweak by hand later.

## How pages link to each other

- All internal links are **root-relative** (`/protocols/spi/index.html`,
  not `../spi/index.html` or `spi/index.html`) — this matches how Vercel
  serves the site and keeps links correct regardless of how deep a page is
  nested.
- Breadcrumbs and the site header/footer are injected automatically by
  `assets/js/includes.js` — don't hand-write them into a page.
- Prev/next and related-topic links are driven by the
  `<script type="application/json" id="page-meta">` block near the bottom
  of each page's `<main>` — edit that JSON, not any HTML markup, to change
  them.

## The search index

`assets/search-index.json` is generated, not hand-written. After adding or
retitling any page, regenerate it:

```
node scripts/build-search-index.js
```

Commit the resulting `assets/search-index.json` alongside your content
changes — the homepage search box reads this file directly and does not
run the generator itself (there is no server).

## Running locally

This is a fully static site — no build step is required to view it, but
root-relative asset paths (`/assets/...`) mean you need to serve it over
HTTP rather than opening files directly with `file://`. Any static file
server works, e.g.:

```
npx serve .
# or
python3 -m http.server 8000
```

## Deploying to Vercel

No framework, no server runtime. In the Vercel dashboard:

- **Framework Preset**: Other
- **Build Command**: `node scripts/build-search-index.js`
- **Output Directory**: `.` (repository root)

`vercel.json` in the repo root already encodes this, so importing the repo
into Vercel should need no manual configuration. Every push to the
deployed branch redeploys automatically.

## What this repository is *not*

- Not a blog — pages aren't dated posts, they're living reference pages
  that get updated in place as understanding improves.
- Not framework-dependent — plain HTML/CSS/JS only, so it keeps working
  with zero maintenance for years, and every page is readable as plain
  text straight out of `git show` if needed.
- Not exhaustive on day one — an empty "Planned" badge on a domain page is
  fine and expected; it's a placeholder for where future material goes,
  not a page that needs to exist before the domain is "complete."
