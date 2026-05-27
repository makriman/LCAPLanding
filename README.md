# Aspora Philippines Landing

A high-fidelity Astro landing page for the US-to-Philippines remittance corridor.

## Mission

Remittance products win trust when the value is visible. This landing page makes exchange rates, fees, savings, testimonials, and corridor readiness easy to compare for overseas Filipino workers and their families.

## What This Repository Contains

Astro landing page scaffold with English/Filipino copy, a live remittance converter, competitor comparison data, localized testimonials, security sections, and a lightweight rates API endpoint.

## Highlights

- English and Filipino localized copy.
- USD, GBP, EUR, CAD, SGD, and AED to PHP converter.
- Dynamic competitor comparison table driven by JSON.
- Hero, savings, trust stats, testimonials, security, roadmap, media, CTA, and footer sections.

## Tech Stack

- Astro
- TypeScript
- Static data JSON
- Client-side language persistence
- Rates API endpoint with provider fallback

## Getting Started

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run build
```

## Repository Notes

- Market assumptions live in src/data/competitors.json and the rates API fallback values.
- Refresh provider data before using this as production financial copy.

## Contributing

Contributions are welcome. The best contributions are specific, tested, and grounded in the product mission. Good places to help include documentation, accessibility, tests, bug reports, UI polish, data validation, and safer AI behavior.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Please do not open public issues for secrets, auth bypasses, data exposure, provider key leaks, or abuse vectors. Follow [SECURITY.md](SECURITY.md).

## Code of Conduct

This project follows [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Be direct, kind, and useful.

## License

MIT. See [LICENSE](LICENSE).
