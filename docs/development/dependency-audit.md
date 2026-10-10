# Dependency Audit Classification — 2026-10-10

This record supports WP06 of the Fresnica quality-remediation plan. It separates
package-production exposure from development/test/build-tool findings and records the
current disposition without treating a green CI run as proof that no dependency risk exists.

## Evidence baseline

### Web — `Pixman022/fresnica-ui`

Evidence: GitHub Actions CI run
[`38017055794`](https://github.com/Pixman022/fresnica-ui/actions/runs/38017055794),
Full quality gate.

- Full dependency audit: **23 vulnerabilities** — 1 low, 9 moderate, 13 high.
- Production audit (`npm audit --omit=dev --audit-level=moderate`): **0 vulnerabilities**.
- The package's direct runtime dependency is `lucide-react`; React, React DOM and
  classnames are peer dependencies. The current production audit does not report them
  as vulnerable in the install graph used by this repository.
- Therefore the current 23 findings are in development/test/build/deploy tooling, not
  the published package's production dependency graph.

Observed full-audit package families include:

| Package/family | Observed path or purpose | Audit suggestion | Current classification |
| --- | --- | --- | --- |
| `@vitest/mocker` / `vitest` | unit-test / coverage toolchain | `npm audit fix` | Retain in WP06; update through a verified Vitest maintenance bump, then rerun coverage/a11y gates |
| `baseline-browser-mapping`, `browserslist` | browser/build metadata | `npm audit fix` | Retain in WP06; refresh with the owning build-tool lock update and rerun both Node matrices |
| `brace-expansion` | transitive ESLint/API extractor/Vue language tooling | `npm audit fix` | Retain as transitive dev tooling; recheck on ESLint / declaration-tool updates |
| `braces` / `micromatch` / `fast-glob` / `globby` / `gh-pages` | demo deployment tooling | **force suggested for this chain** | Retain; no force upgrade. Re-evaluate if deployment tooling is upgraded or removed |
| `esbuild`, `nanoid`, `postcss`, `source-map-js` | Vite/build chain | `npm audit fix` | Retain in WP06; update through a verified Vite/toolchain lock refresh |
| `fast-uri`, `js-yaml` | lint/config tooling | `npm audit fix` | Retain as dev/config transitive findings; revisit with owning direct dependency updates |
| `sprintf-js` via API extractor / `vite-plugin-dts` | declaration build tooling | **force suggested for this chain** | Retain; no force upgrade because declaration output is a release contract |
| `undici` | transitive development tooling | `npm audit fix` | Retain as dev-only transitive finding; recheck on direct toolchain maintenance |

This table groups the paths shown by npm; it is not a claim that every package listed
is a direct dependency.

### Native — `Pixman022/fresnica-ui-native`

Evidence: recent Native CI audit output on the current React Native 0.87/Jest toolchain.

- Full dependency audit: **40 vulnerabilities** — 5 moderate, 34 high, 1 critical.
- Production audit (`npm audit --omit=dev --audit-level=moderate`): **0 vulnerabilities**.
- The reusable Native package has React / React Native as peer dependencies and no
  ordinary runtime `dependencies` entry. Current audit findings are therefore in the
  repository's development/test/build graph.
- Observed paths include Jest/Babel/Istanbul, Metro/React Native tooling, `braces` /
  `micromatch`, `shell-quote` (critical, npm reports a non-force fix is available)
  and `sprintf-js` / YAML-related test tooling.

The **0 production findings** apply only to this component-package install graph. They
must not be generalized to a future Fresnica wallet App, which will own additional
runtime dependencies.

## Disposition policy

1. Keep the full and production audits separate in CI.
2. Prefer compatible, non-force lock/dependency updates when they keep the declared
   React, React Native, Node and build baselines intact.
3. Do **not** run or imitate `npm audit fix --force` merely to reduce the count. A
   force-only fix may change `gh-pages`, API-extractor/declaration tooling, Jest,
   Metro or React Native compatibility and requires its own verified upgrade.
4. Any applied dependency change must pass the repository's full CI and the relevant
   consumer/build verification.
5. Findings retained after compatible updates remain documented here with their
   development-only exposure and a re-review trigger.

## Re-review triggers

Re-run classification when any of these occurs:

- Vite/Vitest, Jest, Metro, React Native or declaration-tooling baselines are upgraded;
- a currently dev-only package becomes part of runtime output;
- npm reports a production vulnerability;
- the first real wallet host adds its own runtime dependency graph;
- an ordinary non-force fix becomes available for a previously force-only chain.

## Current WP06 status

The audit split and classification are established. **No dependency version change is applied in WP06**: both package production audits are clean, the reported findings are development/test/build-only, and the affected packages are predominantly transitive to the pinned test/build ecosystems. Ordinary-fix candidates are retained until the owning direct toolchain dependency is intentionally refreshed and the lock diff can be verified through the complete quality/consumer/build gates. Force-only changes are explicitly rejected without a separate compatibility upgrade.

The full audit count remains a reported maintenance signal, while the production audit remains the package-runtime gate. This is a disposition, not a claim that the development findings are harmless or permanently accepted.
