# OA brand asset

The OA mark is a geometric monogram drawn in code (`components/monogram.tsx`): an emerald ring for the O overlapping an open apex for the A. It is an inline SVG whose strokes follow the theme tokens (`--brand` for the O, `--text` for the A), so it adapts to dark, light and forced-colors modes without separate raster files. The header/footer contain only the monogram; the home link retains a CMS-derived accessible name.

App icons are generated from `app/icon.svg` (graphite tile, emerald O, white A): `app/apple-icon.png` (180px, opaque) and `app/favicon.ico` (16/32/48px PNG entries). Regenerate both with `sharp` from that SVG if the mark changes.

The user-confirmed GitHub account and Riyadh location are explicit public identity configuration in `lib/public-identity.ts`. Other contact details remain CMS-only. Phone and WhatsApp are optional consumers, with no schema or production data changes.
