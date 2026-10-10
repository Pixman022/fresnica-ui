# Fresnica UI Project Status Brief — 2026-10-10

> **Status:** Complete / Maintenance  
> **Scope:** Fresnica Web design system + React Native shared UI primitives only.  
> Wallet product implementation, key management, signing, transaction execution, Mainnet, and product-level physical-device release acceptance are outside this project scope.

## Executive summary

The current Fresnica UI / Native design-system scope is complete.

- Web quality-remediation plan WP01–WP06: complete.
- Native phase-one delivery DS-01–DS-14: complete.
- Wallet UI integration-readiness plan IR-01–IR-04: complete.
- Existing 15 Native shared primitives are sufficient to start a future consumer integration; no additional shared primitive is justified by current evidence.
- Image-derived theming is not required.
- Default Fresnica brand green/light-text contrast is a documented known limitation; no blanket WCAG AA claim is made.
- CI, coverage, React 18 minimum-consumer verification, Demo build and dependency audit gates are in place.
- Web GitHub Actions checkout/setup-node workflows use v7 and passed the full existing quality pipeline before merge.

## Current repository status

### `Pixman022/fresnica-ui`

- Open PRs: none at the time of this brief.
- Open issues: none at the time of this brief.
- Latest quality-remediation plan: WP01–WP06 complete.
- Production dependency audit: 0 known vulnerabilities at the recorded WP06 baseline.
- CI validates Node 20 / 22, full quality gate, coverage, React 18 minimum consumer and Demo build.

### `Pixman022/fresnica-ui-native`

- Open PRs: none at the time of this brief.
- Phase-one UI-library delivery: complete.
- 15 shared primitives delivered.
- Wallet-product Issues #21 and #22 are closed as `not planned` for this project because wallet product work is out of scope.
- Issue #49 remains open only as a deferred future consumer-integration accessibility evidence gate; it does not block project completion.

## Scope boundary

### Included

- Web design-system components and documentation
- shared design tokens and platform mapping
- Native shared UI primitives
- Light / Dark / System theme behavior
- component contracts and accessibility fundamentals
- automated tests, CI, coverage and package-consumer checks
- visual baselines and integration guidance
- maintenance fixes for regressions, dependencies and toolchain compatibility

### Excluded

- wallet product pages as production features
- wallet generation/import/recovery implementation
- key storage, signing and transaction execution
- Horizon/Mainnet product behavior
- product security architecture
- product-level Android/iOS physical-device release acceptance
- image-derived theme generation

## Deferred but non-blocking

The only intentionally open Native follow-up is Issue #49: physical-device TalkBack/focus/keyboard/font-scale/system-UI evidence for a future real consumer integration.

This is not a current implementation task. It becomes relevant only when a real consuming application exists and chooses to run that acceptance gate.

## Maintenance triggers

Reopen design-system work only when one of the following occurs:

1. a shared component or token regression is reported;
2. production dependency audit begins reporting a vulnerability;
3. React, Node, React Native or GitHub Actions/tooling changes break an existing supported contract;
4. two or more real consumer Features prove the same missing cross-Feature primitive is needed;
5. an explicit new design-system requirement is approved.

## Current conclusion

There are **no mandatory implementation tasks remaining** in the current Fresnica UI / Native design-system scope.

The project should remain in **Complete / Maintenance** state until a maintenance trigger or a new in-scope design-system requirement appears.
