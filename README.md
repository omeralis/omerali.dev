# Portfolio — Phase 1

Existing Next.js 16.1.6 / React 19 / TypeScript / Tailwind 4 configuration is preserved. No packages added.

## Architecture
- app/(entry): root redirect to /en, independent minimal root layout.
- app/[locale]: localized root document with native lang and dir; homepage and project routes.
- components: reusable header, interactive controls, architecture figure.
- lib/i18n.ts: UI translations only. Professional content belongs in localized Strapi documents.
- lib/cms: server-only Strapi 5 REST client and typed content contracts.

## Development
Run npm run dev. Visit /en or /ar. Run npm run lint, npx tsc --noEmit, npm run build.
Copy .env.example to .env.local only when configuring a CMS. Without STRAPI_URL the project list is empty and unknown project details return 404. With a configured CMS, HTTP failures are surfaced rather than disguised as empty content. Keep API tokens server-only and read-only. Set SITE_URL to the real public origin.

## CMS contract for next phase
Use Strapi localization for en and ar. Single types: Profile, About, ContactInformation, Resume. Collection types: Service, Experience, Project, Technology, SocialLink. REST endpoint names and fields are defined in lib/cms/types.ts. Dates are independent per Experience, including employmentType and current; overlapping roles are supported by the model. Project technologies are relations, and coverImage/gallery/resume file are media. Description is plain long text in this initial contract. Use optional demo/repository links. Query results use Strapi 5 flattened attributes.

The sibling Strapi project currently has starter schemas. This phase does not alter its database or schemas. The frontend API contract must be implemented there before setting STRAPI_URL. No fabricated project details are seeded.

## Scope and next phase
Phase 1 delivers routing, visual foundations, navigation, themes, accessible responsive hero and CMS architecture. Remaining homepage sections are anchor shells. UI copy is localized; the user-supplied identity is temporary foundation copy until the Profile content type is connected. CV is visibly unavailable until a file is supplied; GitHub and email remain unconfigured. System fonts avoid network requests and font layout shifts.

Next: implement localized Strapi schemas and runtime validation, connect Profile/About/Service/Experience, seed only verified professional facts (including overlapping full-time roles and Clean Basket part-time January 2025–November 2026), then build those sections. Project case studies, screenshots and contact delivery follow after their content is supplied.

## Phase 2
Hero and About now receive typed data from lib/content/home.ts; a future Strapi adapter can replace getHomeContent without changing their components. Architecture copy is part of the Hero contract. lib/experience.ts calculates completed years from November 2018; the homepage revalidates daily so the displayed duration advances without source changes. CV and GitHub are supported optional links and remain visibly unavailable until configured.

About includes verified biography, role/focus/application-language details, and a categorized stack distinguishing core and supporting technologies. Metrics already communicate start date and location, so these are not repeated in About. RTL uses logical spacing and isolated Latin technology names. The other section shells and project routes remain at Phase 1 scope. No dependencies or backend schemas were changed.

Phase 2 validation: ESLint, TypeScript and production build passed. Experience calculation passed career-start and November anniversary boundary checks. Headless Edge verified English LTR and Arabic RTL at 360, 768, 1280 and 1600 pixels, with no horizontal overflow; mobile/desktop screenshots were visually reviewed. No prohibited technology references were found in project files (generated/dependency folders excluded).

## Phase 3
Services and Experience are server-rendered components that receive typed content. lib/content/career.ts contains the six bilingual engineering capabilities and only the supplied employment facts. Six full-time roles are ordered newest first; Clean Basket occupies a separate, explicitly overlapping part-time track. No dates are changed to eliminate overlaps. Only the supplied Riyadh position receives the current indicator. Dates retain month precision and are formatted using the Gregorian calendar in both locales.

ServiceRecord and ExperienceRecord prepare the requested optional fields for later Strapi data. No backend schemas, responsibilities, achievements, employer technologies or links are fabricated. Unknown optional fields stay absent. All approved Header/Hero/About/stack styling remains unchanged; new section-specific CSS uses the existing palette and logical RTL spacing. Projects and Contact remain at their previous scope.

Phase 3 validation: ESLint, TypeScript and production build passed. Exact employment dates, independent overlaps, unknown optional fields and Arabic Gregorian date formatting were verified. Production browser checks passed English/Arabic at 360, 768, 1280 and 1600 pixels without horizontal overflow, and verified theme switching, reduced motion and no browser script errors. Screenshots were visually reviewed. Portfolio source scans found no prohibited technology references.
# omerali.dev

## Phase 4 — Projects
Projects now use the Strapi 5 Project/Technology contracts via lib/cms/projects.ts with explicit population, published-only locale checks, runtime normalization, stable sorting, filtering/pagination, timeouts and five-minute cache tags. Homepage failures are isolated to the Projects section; list/detail routes distinguish missing content from unavailable CMS data. Missing translations return localized not-found. Technical names remain unchanged. Summary queries omit gallery/Blocks payloads; case studies populate them on demand.

Case studies render safe structured Blocks, optional actual role/responsibilities/features/gallery/links, related published projects, dynamic SEO, canonical/locale links and sitemap entries. Media is constrained to the configured public Strapi/CDN origin. Only HTTP(S) external links are rendered; authorization to expose repositories and images must still be reviewed in the CMS. Never put private URLs or confidential material in published records.

Required server environment: STRAPI_API_URL (legacy STRAPI_URL supported), optional read-only STRAPI_API_TOKEN, SITE_URL, optional STRAPI_MEDIA_ORIGIN, and optional STRAPI_WEBHOOK_SECRET (at least 32 random characters). The protected POST /api/revalidate endpoint checks x-webhook-secret, handles Project/Technology lifecycle events and immediately invalidates all project caches and affected routes. Without a webhook, content refreshes within the timed cache; new slug pages render dynamically. On CMS failure the sitemap retains base pages; its next successful request includes published projects again.

Backend setup and manual deployment instructions are in the API repository's PHASE4.md. Both main branches have deployment workflows; this implementation is pushed to phase-4-projects without triggering production deployment. Production Projects currently returns 404. Configure/deploy backend before approving frontend deployment. Live PostgreSQL, persistent media, actual localized published records and credentials remain unverified. No production database changes or seed execution were performed.

Checks: npm run lint; npx tsc --noEmit; npm run build; node --test tests/project-data.test.mjs. Fixture browser checks use the bundled Playwright runtime and installed Edge; test-only data is not portfolio seed content.

Fixture browser verification: start node tests/strapi-fixture.mjs (localhost:3016), then build and run Next on port 3017 with STRAPI_API_URL=http://localhost:3016, STRAPI_API_TOKEN=fixture-read-token and STRAPI_WEBHOOK_SECRET=fixture-webhook-secret-32-characters-long. Run node tests/project-browser.mjs with Playwright available, or set PLAYWRIGHT_MODULE_PATH to the bundled package directory. These are synthetic test credentials and records, never production data. Stop both test servers and rebuild with the normal environment afterward.

Phase 4 validation: frontend lint, standalone TypeScript, production builds, five API-contract tests, and fixture browser checks passed. Backend TypeScript/build, schema registration/type generation and two schema/seed tests passed without database startup. Browser checks covered English/Arabic at 360/768/1280/1600 pixels, filtering, pagination, case studies, missing slugs/translations, media rendering, metadata, sitemap, language switching, protected webhook invalidation, malformed/outage/empty responses and unchanged prior sections. Screenshots were reviewed. Production API returned 404; real PostgreSQL, published content, read permissions and persistent uploads remain unverified pending approved deployment.

## Current Phase 4 release

The historical preparation notes above are superseded: production Strapi now serves GRC Platform, Cyber Imtithal and Investor / Vendor Portal in English and Arabic. Projects come exclusively from published CMS responses. No descriptions, screenshots, dates, client names, roles or technologies are invented as fallbacks. Missing images show text-based previews; absent optional case-study fields are omitted.

Strapi 5 translations are resolved by their shared documentId, querying the other locale's published record to obtain its actual slug. Legacy localizations population is not used. Metadata and sitemap alternates include only observed published translations. Language switching falls back to the other language's listing if a case study has no published translation. Listing loading UI is scoped to its route group so missing detail pages retain HTTP 404.

The release uses Next.js 16.4.0 and matching ESLint configuration to address confirmed framework security advisories. Runtime dependency audit is clean. Five audit findings remain in development-only lint dependencies through braces; the suggested forced fix would downgrade eslint-config-next to Next.js 14 and is not applied.

### Production environment and content refresh

GitHub Actions sets the public STRAPI_API_URL=https://api.omerali.dev and SITE_URL=https://omerali.dev at both standalone build and PM2 runtime. No public-read API token is required. Existing production environment files and optional webhook secrets are not overwritten. The package records its source SHA in DEPLOYED_COMMIT and the workflow checks the restarted frontend's HTTP health. Pull requests run lint, project tests, TypeScript checking and a production build before release.

Project fetches are cached for 300 seconds with projects and locale cache tags. Homepage ISR also revalidates at 300 seconds. Listings, detail routes, alternate-slug lookup and sitemap support newly published content without rebuilding: after the TTL, the next request initiates refresh and subsequent requests receive refreshed content. This request-driven, time-based policy is the working production fallback while no CMS webhook secret is configured. The optional existing authenticated webhook immediately expires project caches; it returns 503 when unconfigured, and rejects unauthorized requests when configured. No backend settings or content are changed to enable it.

### Verification

Run npm ci, npm run lint, npm run test:projects, npx tsc --noEmit and npm run build. Set TEST_LIVE_CMS=1 for the additional read-only integration test against actual production JSON. Synthetic browser tests additionally cover different translated slugs, missing translations, malformed responses, empty/outage states, authorization, cache invalidation, media, pagination and 404s.

To verify a standalone release using real production content, run tests/project-production-browser.mjs with PLAYWRIGHT_MODULE_PATH configured when using the bundled runtime, BROWSER_ORIGIN pointing to the site under test, and SITE_URL=https://omerali.dev. This reads CMS data, verifies both locales and all six case studies, filters, metadata, sitemap, placeholders, theme/language controls, and responsive layouts. It never changes CMS content. Screenshots and the JSON verification report are saved under ignored test-results/.
# Golden Yellow portfolio theme

The shared design tokens in `app/globals.css` support the approved charcoal/gold dark
palette and white/gold light palette across the homepage, project listing, case
studies and missing/error states. Content, CMS queries, locale routes, metadata,
sitemap and the existing 300-second revalidation policy remain intact.

Gold buttons use dark text on `#FACC15` (hover `#EAB308`). Dark-mode accent text
uses `#FACC15`; light-mode accent text uses the accessible `#854D0E` token on
white and soft gold surfaces. Layout, content, icons and motion are preserved.

The header theme picker defaults to System. A before-paint script resolves the
saved preference or OS preference; React reads the same preference through an
external store with a stable hydration snapshot. Explicit Dark/Light choices
persist in browser storage, System removes the override, and live OS changes are
followed in System mode. Storage failure retains the current session's choice.
Motion is disabled when reduced motion is requested.

Validation:

```sh
npm run test:theme
node tests/theme-browser.mjs
```

The browser suite uses Playwright (or the bundled module identified by
`PLAYWRIGHT_MODULE_PATH`) and defaults to `http://127.0.0.1:3017`. Set
`BROWSER_ORIGIN=https://omerali.dev` to verify production. It tests both themes,
both locales, mobile/tablet/desktop layouts, all three real project detail pages,
mobile navigation, system changes and persistence. Reports and screenshots are
written to ignored `test-results/themes/`. The unit suite also checks WCAG AA
contrast for body, secondary and accent text and primary controls in both themes.

The standalone deployment validates and clears `.next/server/route-cache` while
the frontend process is stopped, before restarting it. Overlay extraction alone
can retain old generated HTML at stable Next.js route-cache keys even when the
new build's prerendered seeds are correct. `npm run test:release` verifies that
only generated render responses are removed and that build seeds, fetch caches,
environment files and application files are preserved; symlink targets fail closed.
