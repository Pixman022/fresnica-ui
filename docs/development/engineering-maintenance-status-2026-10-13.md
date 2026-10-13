# Engineering Maintenance Status — 2026-10-13

> **Plan:** Fresnica Engineering Maintenance and Accessibility Follow-up Plan  
> **Repositories:** `Pixman022/fresnica-ui` and `Pixman022/fresnica-ui-native`

## Engineering task status

- **M01 · Production dependency audit gate — Complete.**
  Evidence: Web PR #22 / `cfb87a9c4394b2549c68782bed58105d8982da9b`; Native PR #71 /
  `48fd6e165ac2b8ec2a652d094b9288e258440faa`.
- **M02 · Drawer attribute naming — Complete.** Evidence: Web PR #23 /
  `16639ca349e0b6ee9dfa6a46e0f366604fc6b386`.
- **M03 · Build asset warning — Investigated / retained with verified resources.** Evidence:
  Web PR #24 / `2719c1e356b1522b7f5aa7da32d46bf1971e4683`.
- **M04 · Regression and maintenance record — Complete.** CI and repository-level required-check
  enforcement are both verified.

## M01 audit gate evidence

Both repositories keep the full development audit as report-only and now make
`npm audit --omit=dev --audit-level=moderate` blocking.

Latest successful production audits:

- Web `main` CI `38362703973`: **0 production vulnerabilities**.
- Native `main` CI `38362721044`: **0 production vulnerabilities**.

Temporary non-zero verification did not introduce a vulnerable package:

- Web PR #25 changed only the audit invocation to an intentionally invalid workspace. Its
  `Full quality gate` failed at the production audit command with exit code 1, and the
  React 18 consumer, Demo build and Delivery artifact jobs did not run. The PR was closed
  without merge.
- Native PR #72 used the same invalid-workspace technique. The required `test` job failed
  at the production audit command with exit code 1. The PR was closed without merge.

Web automatic Pages deployment still requires a successful `main` CI run. The manual
`workflow_dispatch` path now runs the same production audit before building and deploying.

### Repository required-check state

Native repository ruleset `Protect main` (ID `24701211`) is active and requires the
`test` status check, so a failed Native production audit prevents the required check from
passing.

Web repository ruleset `Protect main` (ID `24981097`) is active for the default branch and
requires the GitHub Actions `Full quality gate` status check. Temporary PR #27 intentionally
failed the production audit command; GitHub reported `mergeable_state: blocked` while the
required check was red. PR #27 was closed without merge and its verification branch was reset
to `main`. Repository-level merge enforcement is therefore verified, not merely configured.

## M02 Drawer result

Drawer internal markers are normalized to lowercase
`data-fresnica-drawer-portal` and `data-fresnica-drawer-ignore`. Portal exclusion and
background-ignore coverage remain in the Drawer tests. The latest combined Web `main`
test logs contain no React warning for the old `data-Fresnica-drawer-portal` attribute.

Other unrelated test-environment warnings were not globally suppressed.

## M03 asset warning result

The warning

`[vite-plugin-lib-assets]: Failed to obtain the sourcemap when handling the style file...`

still appears in the latest library build. It is intentionally recorded as an investigated
upstream/tooling limitation rather than described as fixed.

Artifact and real-browser verification found no current resource breakage:

- the packed `fresnica-ui-1.1.0.tgz` contains all six referenced Noto Sans SC `.woff2`
  files;
- real Chromium loaded the public packed `dist/index.css` and successfully loaded the
  Simplified Chinese and Latin Noto Sans SC font resources;
- the CI `demo-dist` artifact was exercised with the GitHub Pages `/fresnica-ui/` base:
  the main page produced 17 asset requests with 0 missing, and `examples.html` produced
  13 asset requests with 0 missing; no image-load failure was observed.

No plugin, Vite baseline or dependency version was changed solely to hide the warning.

## M04 final regression evidence

Web `main` at `cf786e45510c9e6da0bbcd8323c0453144b2f29f`:

- CI run `38362703973`: Node 20/22 lint and tests, Full quality gate, coverage,
  React 18.0 packed consumer, Demo build and Delivery artifact — **all successful**.
- Pages run `38363250670` — **successful**.
- Ruleset `Protect main` requires `Full quality gate`; PR #27 verified a failing required
  check produces `mergeable_state: blocked`.

Native `main` at `e02f471b0ea4d4146b7c43eeb08549ae4692d320`:

- CI run `38362721044`: production audit gate, standalone tests, fixed Token-source
  verification, build, packed-package contract and internal delivery candidate — **all successful**.

Shared Token source was not changed by this maintenance work:

- `design-system/tokens.json` blob: `9c4bbc478618d5a5ef5d1ecdd11d41ee8afdeb5c`
- `design-system/platform-token-source.json` blob: `6ee1c1da3a3be52e84bc8247e13bb577fdbb4cc6`

Those values still match `fresnica-ui-native/token-source.lock.json`; no Native Token-lock
advance is required.

## Conditional tasks

- **C01 Android physical-device accessibility:** not started. It still requires a named
  acceptance host, an operable Android device and an actual tester. Native Issue #49 remains
  the deferred integration gate.
- **C02 key color review:** not started. The existing approved brand palette and recorded
  contrast limitations remain unchanged. No formal brand Token change is made.

## Current conclusion

M01–M04 engineering implementation, CI verification and repository-level merge enforcement
are complete. There is no remaining mandatory engineering sub-item in this maintenance round.

C01 and C02 remain conditional tasks and do not block the completed engineering maintenance work.
