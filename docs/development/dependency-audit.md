# Dependency Audit Classification — 2026-10-10

This record supports WP06 of the Fresnica quality-remediation plan. It separates
package-production exposure from development/test/build-tool findings and records the
current disposition without treating a green CI run as proof that no dependency risk exists.

## Compatible maintenance result — 2026-10-15

Starting source: Web main `f1b3436f6f19043a4ac0d50e4f954c0f479913f2`.
Compatible lock updates and a Vitest/coverage minimum of 4.1.11 reduce the full audit from
23 findings (1 low, 9 moderate, 13 high) to 11 (1 low, 5 moderate, 5 high). The production
install graph remains at 0. Vitest and coverage stay on major 4; Vite resolves to 7.3.7.
React, TypeScript, runtime dependencies, component APIs and design tokens remain unchanged.

The Native maintenance round reduces 40 findings (5 moderate, 34 high, 1 critical) to
29 (20 moderate, 9 high, 0 critical), with production still at 0. Its current classification
is maintained in the Native repository's `docs/dependency-audit.md`.

Remaining Web findings are the legacy `gh-pages` / glob chain, the declaration-generation
`vite-plugin-dts` / API-extractor chain and `esbuild` 0.27.7. npm proposes an out-of-range
`gh-pages` downgrade or a declaration-tool major upgrade for the first two chains. The
esbuild patched release 0.28.1 is outside Vite 7's declared 0.27 dependency range. These
changes require a separate toolchain compatibility change; no force fix or transitive
range override is applied here. Recheck with compatible upstream fixes or the next verified
build/declaration/deployment-tool update.

The original WP06 classification below is retained as history. Validation of this maintenance
uses the full quality, coverage, React 18 packed-consumer, Demo and delivery checks.

## Historical evidence baseline

### Web — `Pixman022/fresnica-ui`

Evidence: GitHub Actions CI run
[`38332163314`](https://github.com/Pixman022/fresnica-ui/actions/runs/38332163314),
Full quality gate on `e6718b63c0d4e955059d76e3b1c289b5212aa1c5`.

- Full dependency audit: **23 vulnerabilities** — 1 low, 9 moderate, 13 high.
- Production audit (`npm audit --omit=dev --audit-level=moderate`): **0 vulnerabilities**.
- The package's direct runtime dependency is `lucide-react`; React, React DOM and
  classnames are peer dependencies. The current production audit does not report them
  as vulnerable in the install graph used by this repository.
- Therefore the current 23 findings are in development/test/build/deploy tooling, not
  the published package's production dependency graph.

Observed full-audit package families include:

- `@vitest/mocker` / `vitest`: unit-test and coverage tooling. npm suggests
  `npm audit fix`. Retain in WP06; update through a verified Vitest maintenance
  bump, then rerun coverage and accessibility gates.
- `baseline-browser-mapping` / `browserslist`: browser/build metadata. npm
  suggests `npm audit fix`. Retain in WP06; refresh with the owning build-tool
  lock update and rerun both Node matrices.
- `brace-expansion`: transitive ESLint/API-extractor/Vue language tooling. npm
  suggests `npm audit fix`. Retain as transitive dev tooling; recheck on ESLint
  or declaration-tool updates.
- `braces` / `micromatch` / `fast-glob` / `globby` / `gh-pages`: demo
  deployment tooling. npm suggests a force fix for this chain. Retain; do not
  force-upgrade. Re-evaluate if deployment tooling is upgraded or removed.
- `esbuild`, `nanoid`, `postcss`, `source-map-js`: Vite/build chain. npm
  suggests `npm audit fix`. Retain in WP06; update through a verified
  Vite/toolchain lock refresh.
- `fast-uri` / `js-yaml`: lint/config tooling. npm suggests `npm audit fix`.
  Retain as dev/config transitive findings; revisit with owning direct dependency
  updates.
- `sprintf-js` via API extractor / `vite-plugin-dts`: declaration build
  tooling. npm suggests a force fix for this chain. Retain; do not force-upgrade
  because declaration output is a release contract.
- `undici`: transitive development tooling. npm suggests `npm audit fix`.
  Retain as a dev-only transitive finding; recheck on direct toolchain
  maintenance.

This grouping follows the paths shown by npm; it is not a claim that every package
listed is a direct dependency.

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

## Production audit gate — M01

The production audit remains `npm audit --omit=dev --audit-level=moderate`, but it is now a blocking step in the Web `Full quality gate`; only the full development audit remains report-only. A non-zero production-audit exit therefore fails that job instead of being converted into a successful CI result.

The delivery artifact continues to depend on the complete CI chain. Automatic GitHub Pages deployment still starts only after a successful `main` CI run. The manual Pages entry also runs the same production audit before building or deploying, so `workflow_dispatch` cannot bypass the production dependency gate.

Web repository ruleset `Protect main` (ID `24981097`) is active for the default branch and requires the GitHub Actions `Full quality gate` check. Temporary PR #27 intentionally forced the production audit command to fail; GitHub returned `mergeable_state: blocked` while the required check was red. The PR was closed without merge and its branch was reset to `main`. Repository-level required-check enforcement is therefore verified.

The latest audited production install graph still reports **0 vulnerabilities**. This only covers this component repository's current production install graph; consumer applications must audit their own additional runtime dependencies.

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

## Historical WP06 status

The audit split and classification are established. **No dependency version change is applied in WP06**: both package production audits are clean, the reported findings are development/test/build-only, and the affected packages are predominantly transitive to the pinned test/build ecosystems. Ordinary-fix candidates are retained until the owning direct toolchain dependency is intentionally refreshed and the lock diff can be verified through the complete quality/consumer/build gates. Force-only changes are explicitly rejected without a separate compatibility upgrade.

The full audit count remains a reported maintenance signal, while the production audit remains the package-runtime gate. This is a disposition, not a claim that the development findings are harmless or permanently accepted.
