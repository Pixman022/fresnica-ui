# Fresnica V3 - M4 isolated preview release

Date: 2026-10-27
Status: workflow prepared; deployment result must be checked separately.

## Goal

Expose the M3-reviewed V3 website at its own GitHub Pages path without modifying `main`, the V2 archive, or the bytes served by the existing V2 preview route.

## Frozen source, overlay and destination

- Frozen V2 commit: `f3e68515d90fe05a12a640db153f1b14004cad32`.
- V3 branch: `design/website-vision-motion-concept-2026-10-27` (exact triggering SHA).
- Existing route: `https://pixman022.github.io/fresnica-ui/fresnica-website-preview/`.
- New route: `https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/`.
- Separate Hero study: `https://pixman022.github.io/fresnica-ui/fresnica-v3-orb-demo/`.

## Workflow safety contract

1. GitHub Actions builds the demo from the frozen V2 commit, not from the V3 branch.
2. It copies only the two static self-contained V3 HTML files into **new** subdirectories in the built Pages artifact.
3. It verifies that the existing V2 preview entry file matches the frozen V2 file byte for byte (`cmp`) both before and after the overlay. It also checks the two V3 paths did not already exist in the frozen output.
4. A `push` release is allowed only for the exact V3 branch, and only when the workflow or V3 preview content changes; the existing default branch workflow is not modified.
5. If the audit, frozen-file check, or deployment branch policy fails, the action aborts rather than uploading a partially altered site.
6. Both V3 HTML documents ask crawlers not to index them; **noindex is not authentication**. The previews remain publicly reachable by anyone with the URLs.

## Operational caveat

GitHub Pages is one site per repo. This is **path isolation within the same Pages site**, not a separate hosting account or separately deployed domain. The root artifact is republished on success, but the V2 preview file is preserved from the frozen commit. A later ordinary main-branch Pages deployment may remove these preview-only paths. For durable independent hosting, provision a separate repository or another hosting site with explicit authorization.

## Verification after publishing

- Inspect the triggered workflow's conclusion and the `Overlay V3 without touching any legacy route` logs.
- Open both V2 and V3 routes from a real desktop Chrome browser and confirm they remain distinguishable.
- Confirm the V3 Home orb is smooth on actual GPU, scroll scenes and pinned rail follow the reference, footer changes light to dark, and Reduced Motion leaves the page readable.
- Recheck the V2 URL visually before treating preview as deployed.
- If deployment is blocked by GitHub Pages branch/environment restrictions, do **not** change `main` as a workaround. Use the self-contained HTML files or request a separately hosted preview environment.

## Rollback

Run the existing `Deploy Demo to GitHub Pages` workflow on `main` (or re-run the last successful main Pages deployment) to restore the original frozen artifact. This removes the additional V3 paths but keeps V2 content unchanged.