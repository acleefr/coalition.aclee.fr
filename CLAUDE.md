# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static French political coalition simulator hosted at `coalition.aclee.fr`. Users check/uncheck party checkboxes to build coalitions; a hemicycle arc chart (D3.js) updates in real-time showing proportional seat distribution and whether the coalition reaches absolute majority.

## Running Locally

No build step — open `index.html` directly in a browser, or serve with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

No package manager, no dependencies to install. D3.js v7 and Font Awesome are loaded from CDN.

## Architecture

Three files, no framework:

- **`index.html`** — party data lives here as `data-seats` and `data-color` attributes on checkboxes. Adding/removing parties means editing this file.
- **`scripts.js`** — all logic: reads checkbox state → computes proportional angles → redraws D3 arcs. `updateResults()` is the single entry point called on every checkbox `change` event and on init.
- **`styles.css`** — layout and visual styling only, no JS-driven class toggling.

## Key Constants & Data

- `majorityThreshold` in `scripts.js`: absolute majority seat count (289 for a 577-seat assembly — `Math.floor(577/2) + 1`).
- Total assembly seats: **577** (French Assemblée Nationale). Party seat counts in `index.html` must always sum to 577.
- SVG dimensions: 600×300px, arc centered at `(300, 150)`, innerRadius 100 / outerRadius 150.
- Party data (name, seats, color) is split across `index.html` attributes — if you refactor, keep them co-located or move entirely to a JS data object.
