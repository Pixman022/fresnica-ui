# Fresnica V3 - M4 isolated preview release

Date: 2026-10-27
Status: GitHub Actions deployment successful; independent end-user browser review is still pending.

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

## Actual GitHub Actions result

- First V3 push run `40461363281` failed before steps under the protected `github-pages` environment. It did not deploy.
- Switching this branch-only workflow to the separate `v3-preview` environment allowed the guarded overlay deployment to run.
- **Successful run:** `40461454033` — https://github.com/Pixman022/fresnica-ui/actions/runs/40461454033
- **Source commit:** `9b64674c9b7ceda38f021e885d0a93aec38c6a79`.
- Verified frozen V2 source: `f3e68515d90fe05a12a640db153f1b14004cad32`.
- Verified new source: `9b64674c9b7ceda38f021e885d0a93aec38c6a79`.
- Workflow check `Overlay V3 without touching any legacy route` succeeded, and output:
  `V2 unchanged (SHA-256): c522893e32d794ade98e7338624e9756d634a744bc93f199f7ea3289824679fe`.
- `Configure Pages`, `Upload Pages artifact`, and `Deploy to GitHub Pages` all succeeded. GitHub reported the site URL as `https://pixman022.github.io/fresnica-ui/`.
- Static V3 routes: `https://pixman022.github.io/fresnica-ui/fresnica-v3-motion-preview/` and `https://pixman022.github.io/fresnica-ui/fresnica-v3-orb-demo/`.
- Direct HTTP page retrieval from the assistant's browsing environment was unavailable, so **GPU/WebGL visual acceptance remains pending**.

## Verification after publishing

- Inspect the triggered workflow's conclusion and the `Overlay V3 without touching any legacy route` logs.
- Open both V2 and V3 routes from a real desktop Chrome browser and confirm they remain distinguishable.
- Confirm the V3 Home orb is smooth on actual GPU, scroll scenes and pinned rail follow the reference, footer changes light to dark, and Reduced Motion leaves the page readable.
- Recheck the V2 URL visually before treating preview as deployed.
- If deployment is blocked by GitHub Pages branch/environment restrictions, do **not** change `main` as a workaround. Use the self-contained HTML files or request a separately hosted preview environment.

## Rollback

Run the existing `Deploy Demo to GitHub Pages` workflow on `main` (or re-run the last successful main Pages deployment) to restore the original frozen artifact. This removes the additional V3 paths but keeps V2 content unchanged.