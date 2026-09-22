# Pending deletion register

This register records cleanup candidates and completed cleanup decisions. New candidates must be recorded here first and are
not deleted until explicitly approved. Completed entries remain as an audit trail.

## Candidates

| ID | Scope | Current location | Why it is a candidate | Risk / dependency | Decision |
| --- | --- | --- | --- | --- | --- |
| DEL-001 | Legacy visual assets | `demo/img/` (except `demo/img/fresnica/`), `src/assets/img/`, `docs/img/` | Historical theme artwork was not used by the Fresnica component/demo build. | No runtime references found; Fresnica brand assets were preserved. | Removed 2026-09-11 |
| DEL-002 | Deprecated token aliases | `src/styles/themes/default.less`: `--Fresnica-secondary-*` | Compatibility aliases for the former protocol-purple naming. | No source or demo consumers remained; public contract removal approved for this cleanup. | Removed 2026-09-11 |
| DEL-003 | Deprecated shadow aliases | `src/styles/themes/default.less`: `--Fresnica-shadow-sm`, `--Fresnica-shadow-lg` | Compatibility names retained after the system moved to the explicit `--Fresnica-shadow-base: none` contract. | No source or demo consumers remained; public contract removal approved for this cleanup. | Removed 2026-09-11 |
| DEL-004 | Unused legacy demo routes/components | `src/components/Countdown/`, `src/components/Phone/`, `src/components/Time/`, `src/components/Wallet/` | These empty legacy directories were not part of the current Fresnica Stellar component navigation or `PAGES` map. | A repository-wide usage audit found no runtime, export, Demo route or documentation consumers. | Removed 2026-09-16 after explicit approval |
| DEL-005 | Deprecated compatibility props | `Card.pattern`, `Tabs.stateAnimation`, `Tabs.shadow`, `Input.shadow` | These props were retained for older consumers but had no visual effect in the current Fresnica system. | Public API removal approved; consumers must migrate before upgrading to 2.0.0. | Removed 2026-09-11 |
| DEL-006 | Superseded Banner PNG sources | `demo/img/fresnica/banner01.png` through `banner04.png` | The Image and Carousel demos now use the optimized WebP equivalents. | All runtime and code-example references were migrated to WebP; original PNGs were retained until explicit approval. | Removed 2026-09-18 after explicit approval |

## Not candidates

- `Icon` is not scheduled for deletion: it is the documented Lucide wrapper and has a dedicated demo page.
- `Loading` is not scheduled for deletion: it is a generic wallet feedback state and is used by the demo transition.
- Fresnica brand logo/app icon assets remain approved product assets.

## Review procedure

Before deleting an item, search source, demo, documentation, package exports and published usage for references; run the full
CI suite; update the English and Chinese design-system docs; and record the decision in the changelog. Financial semantic
colors and public tokens must not be merged or removed as part of unrelated cleanup.
