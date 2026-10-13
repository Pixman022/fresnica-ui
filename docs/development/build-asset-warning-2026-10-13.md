# Build Asset Warning Investigation — 2026-10-13

Status: **Investigated / warning retained with verification**

## Trigger

The Web library build on CI run `38332163314` emits:

`[vite-plugin-lib-assets]: Failed to obtain the sourcemap when handling the style file...`

The repository is locked to `@laynezh/vite-plugin-lib-assets@2.1.3`. The library style graph uses
Less `@import` composition and local font files, while the plugin attempts to trace style assets
through Vite's CSS transform sourcemaps. The warning means that the plugin cannot obtain the
sourcemap it prefers for that tracing path; it is not itself proof that an emitted asset is missing.

The upstream project has a newer 2.2.0 release, but its documented change is unrelated to this
warning. Vite 7 CSS sourcemap limitations continue to be discussed upstream, so M03 does not
upgrade the plugin merely to suppress the message.

## Artifact verification

Evidence was taken from the successful `main` CI run `38332163314`.

### Packed library

The generated `fresnica-ui-1.1.0.tgz` contains all six Noto Sans SC `.woff2` files referenced by
the built CSS. Every local `files/...woff2` reference found in the packed CSS resolves to a file
inside the tarball.

A real Chromium 144 session loaded the packed public `dist/index.css` through an intercepted HTTP
origin and requested the real tarball resources. Results:

- `document.fonts.status === "loaded"`
- `document.fonts.check('400 16px "Noto Sans SC"', '中文字体测试') === true`
- the browser requested both the Simplified Chinese and Latin 400-weight `.woff2` files
- no missing CSS/font response was observed

### Demo / GitHub Pages base

The CI `demo-dist` artifact was loaded in real Chromium with
`https://pixman022.github.io/fresnica-ui/` as the document base while requests were served from the
actual CI artifact.

- `index.html`: 17 asset requests, 0 missing; 11 font, 2 CSS, 3 JS and 1 image requests; no failed images.
- `examples.html`: 13 asset requests, 0 missing; 3 font, 3 CSS, 4 JS and 3 image requests; no failed images.
- Both pages rendered their expected Fresnica content and reported loaded fonts.

This verifies the current package and Demo resource paths without claiming that the sourcemap
warning itself has disappeared.

## Ongoing guard

`npm run build` now ends with `npm run verify:assets`. The verifier scans every emitted CSS file,
resolves local `url(...)` and `@import` references relative to that CSS file, rejects references
that escape `dist/`, and fails if a referenced local file is missing.

The existing React 18 packed-consumer, Demo build and delivery checks remain unchanged and continue
to run after the normal quality gates.

## Decision

M03 keeps the upstream sourcemap warning as an accurately documented limitation. The current build
has no discovered missing font/image/CSS resource, and the new asset-reference verifier makes an
actual missing local asset a build failure. Revisit the plugin only when an upstream release
explicitly addresses this warning or when the Vite/toolchain baseline is intentionally upgraded.
