# Aspora Philippines Landing (Astro)

High-fidelity mock landing page scaffold for Aspora focused on the US-to-Philippines remittance corridor and OFWs.

## What is included

- Astro scaffold from scratch
- Localized copy with language switch (`English` / `Filipino`)
- Language persistence via `localStorage`
- Live remittance converter (USD/CAD/GBP/EUR/SGD/AED to PHP)
- Rates API endpoint with 5-minute cache and fallback provider logic
- Dynamic competitor comparison table driven by JSON data
- Hero, savings, trust stats, testimonials carousel, security, gateway roadmap, media strip, final CTA, and localized footer
- Responsive layout and accessible labels/semantic sections

## Project structure

- `src/pages/index.astro` - page layout and client interactivity
- `src/pages/api/rates.json.ts` - exchange rate API proxy/cache endpoint
- `src/data/en.json` - English translations
- `src/data/fil.json` - Filipino translations
- `src/data/competitors.json` - provider margins, fees, delivery metadata, source links
- `src/styles/global.css` - theme, layout, and responsive styles
- `public/flags/*.svg` - lightweight flag icons for testimonial cards

## Run locally

1. Install Node.js 20+
2. Install dependencies
3. Start Astro dev server

```bash
npm install
npm run dev
```

## Notes on data

- Converter pulls rates from `/api/rates.json`, which tries `open.er-api.com` first, then `exchangerate.host`, and falls back to static values if needed.
- Competitor rows are estimation-friendly and update from `src/data/competitors.json`.
- To refresh market assumptions, edit:
  - `midMarketFallback`
  - each provider's `marginPct`, `feeUsd`, `delivery`, and `sourceUrl`

