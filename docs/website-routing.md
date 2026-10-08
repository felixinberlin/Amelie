# Website routing and loading

Amélie uses React Router with Vite's `/Amelie/` base and GitHub Pages static hosting. All destinations use trailing slashes. The root remains a gallery entry; navigation uses `/dosen/`.

| Content | Path below `/Amelie/` |
| --- | --- |
| Gallery | `dosen/` |
| Published dose | `dosen/<id>/` |
| Book chapter | `dosen/<id>/book/<slug>/` |
| Simulator collection | `simulators/` |
| Simulator | `simulators/<SimulatorKey>/` |
| Comparison selection | `compare/?items=dose:<id>,cand:<id>` |
| Existing venture record | `ventures/<id>/` |
| Other sections | `<existing-tab-id>/` |

`src/routing/routes.ts` owns route parsing and paths. `scripts/site-pages.mjs` reads the existing registries at build time, supplies lightweight navigation metadata, and emits each known destination's `index.html` plus `route-manifest.json` in `dist/`. New published records and chapters are included automatically. Generated pages contain destination metadata and a shared React shell; readable content prerendering is deferred.

Use the URL helpers rather than constructing links from `window.location.pathname`: that pathname may already be several levels deep. Website links use clean paths. **Emails and documents still use `getDeliveryDoseUrl(id)` and the root `#dose=<id>` anchor**, as required by AGENTS.md. Legacy dose, simulator, book, comparison, and venture links normalize in the browser using history replacement. Only language, admin mode, and mood preferences carry across section navigation.

Locally created doses are linked as `dosen/?dose=<id>`, because a user's local record has no published HTML entry. Such links work only in a browser holding that local record. Unknown destinations show a not-found page; missing static files return HTTP 404. The 404 shell is not used to serve known published routes.

Views and individual simulators load through dynamic imports. Keep counts and metadata out of view implementation modules: importing a view just for its count defeats lazy loading. Chapters retain their existing lazy source loading. Candidate storage is separated from dose storage; the original storage service remains a compatible facade for operator tools and exports. Storage keys and public JSON schemas are unchanged.

## Verification

```sh
npm run lint
npm test
npm run build
npx playwright install chromium --only-shell
npm run test:browser
```

The browser suite serves `dist/` through a plain static server with no SPA rewrite. It checks every generated route and its assets, legacy URLs, history, chapters, simulator isolation, and local records. Its gallery JavaScript budget counts all requested JS chunks, gzipped, against half the previous 1,224,090-byte entry bundle. Font, CSS, image, and map-tile transfers are excluded from that JavaScript metric.

Lazy-load failures display a reload/retry action without automatically reloading or clearing local data. GitHub Pages cannot configure HTML cache headers; a client already open during a deployment may need to reload to obtain current chunk references.

The `Verify site routes` workflow checks PRs. Deployments still occur only when changes reach the existing deployment branches. Route generation runs within `npm run build` for both local verification and deployment.
