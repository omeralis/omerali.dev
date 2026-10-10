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
