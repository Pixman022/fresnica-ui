# Build and Release

`npm run build` produces the published artifact: `vite build` emits JavaScript, CSS, and assets into `dist/`, then
`tsc --project tsconfig.build.json --emitDeclarationOnly` emits declarations into `dist/types/`. The rationale behind
the choices below is recorded in [../adr/](../adr/); this page is the contract itself.

## Build Contract

`vite.config.ts` registers five plugins on top of `@vitejs/plugin-react` to make per-component imports work. Changing
build logic without preserving the following breaks consumer tree-shaking:

- **Dual output** — ES into `dist/es/` and CJS into `dist/cjs/`, both with `preserveModules: true` and
  `preserveModulesRoot: 'src'`, so consumers tree-shake per component and the fonts or images of unused components never
  reach their bundle. Do not turn `preserveModules` off.
- **Externals** — `react`, `react-dom`, `react/jsx-runtime`, and `classnames` are never bundled; they are
  peerDependencies.
- **`cssCodeSplit: true` + `injectImportedCssPlugin`** — component CSS is split per module, and the plugin writes the
  `import "./x.css"` (ES) / `require("./x.css")` (CJS) statements back into the emitted JavaScript, so importing a
  component pulls in exactly its styles. Do not turn `cssCodeSplit` off.
- **Assets stay external** — `@laynezh/vite-plugin-lib-assets` (`outputPath: 'files'`, `limit: 0`) writes referenced fonts
  and approved brand assets to `dist/files/` instead of letting library mode inline them.
- **Global stylesheet entry** — `emitGlobalStyleEntryPlugin` aggregates `dist/index.css` (what `fresnica-ui/style`
  resolves to) and prunes orphaned files from `dist/files/`. After changing a component's CSS, confirm those styles
  still appear in `dist/index.css`.
- **woff2 only** — `stripWoffFallbackPlugin` removes the woff fallbacks emitted alongside the woff2 fonts, cutting
  roughly 40% of font weight.
- `pruneEmptyDirsPlugin('dist')` cleans up directories left empty by the steps above.

## Package Contract

`package.json` is already wired for per-component consumption; keep it that way:

- `exports` maps `.` to the ES/CJS/types triple, `./style` to `dist/index.css`, and `./es/*` to the preserved ES modules.
- `sideEffects: false` lets bundlers drop unused modules.
- `files` limits the published tarball to `dist/`, README, LICENSE, and `THIRD_PARTY_NOTICES.md`.
- `lucide-react` is the only direct runtime dependency and provides the shared interface icon system.

`prepublishOnly` runs `npm run build`, so a publish always ships a fresh artifact.

## Badges

`npm run badges` (`scripts/generate-coverage-badges.mjs`) reads `coverage/coverage-summary.json` and
`coverage/vitest-results.json`, writes `coverage/badges/coverage.json`, counts components by scanning
`src/components/` for directories containing a matching `<Name>.tsx`, and rewrites the hardcoded `tests-NN` and
`components-NN` shields in both `README.md` and `docs/README.zh-CN.md`. Run `npm run test:cov` first — the script exits
with an error if the coverage summary is missing.

## Demo Site

`npm run build:demo` builds the demo into `demo-dist/` using `vite.config.demo.ts`. The demo is never part of the npm artifact.

The public preview is deployed by `.github/workflows/pages.yml` after the `CI` workflow succeeds on `main`. The workflow rebuilds `demo-dist/`, uploads it with the official GitHub Pages artifact action, and deploys it to:

- `https://pixman022.github.io/fresnica-ui/`
- `https://pixman022.github.io/fresnica-ui/examples.html`

`npm run preview:demo` remains the local production-preview path. Remote deployment is owned by `.github/workflows/pages.yml`; use its `workflow_dispatch` entry for a manual redeploy rather than a repository-local deployment CLI.

### Asset warning verification

The current `vite-plugin-lib-assets` sourcemap warning is an investigated upstream limitation. Current packed-library and GitHub Pages assets were verified with real Chromium; see [build-asset-warning-2026-10-13.md](./build-asset-warning-2026-10-13.md) for the evidence and retained-warning decision.

## Delivery record

Web `1.1.0` uses its own SemVer progression from `1.0.0`. This minor version is based on
backward-compatible Web API additions and is not coupled to the Native package version.

Run:

```bash
npm ci
npm run delivery:record
```

`delivery:record` reuses the normal library build, runs `npm pack --json --ignore-scripts`,
verifies the required package surface, moves the tarball under `delivery/`, computes SHA-256,
and writes a matching JSON record. The record includes the exact Git source SHA, package version,
tarball filename, Node/React baselines, required packed files, and known limits.

CI runs the same command in the `Delivery artifact` job after the full quality, React 18
consumer, and Demo build gates. CI uploads the `delivery/` directory as an artifact; it does
not publish to npm.

A reviewed delivery must refer to the fixed source SHA and generated checksum from one concrete CI
run. Do not describe floating `main` as the reviewed source.

## Web 1.1 migration

The `1.1.0` changes in this synchronization round are additive:

- Existing `FresnicaThemeProvider` calls remain valid. Add `FresnicaUiProvider` only when
  global generic component copy is useful.
- Existing explicit copy props and per-component `labels` remain valid and keep higher priority
  than Provider Locale.
- Existing calls that do not use a Locale Provider keep their historical component defaults.
- `Button` and `Input` now forward typed DOM refs; callers are not required to provide refs.
- `fresnica-ui/locales` is the stable public language-pack subpath. Do not import locale files from
  `src/` or `dist/` internals.
- No Token value, default visual, wallet business API, Native TalkBack status, iOS status, or Native
  reduced-motion decision changes as part of this Web release.

A future breaking API change requires its own major-version migration plan. It must not be inferred
from the Native package version.
