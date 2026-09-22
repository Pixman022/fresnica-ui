# Navigation hierarchy

This document defines the navigation responsibilities for Fresnica wallet examples. It is a product-example rule layered on top of the cross-platform core; it does not add a new public component to the library.

## Levels

| Level | Purpose | Current examples | Required treatment |
| --- | --- | --- | --- |
| Primary destinations | Move between the app's main areas | Home, Activity, Scan, Explore, Settings | Use the shared five-item `BottomNavigation` on mobile wallet screens. The current item uses primary icon and label color, a transparent background, and `aria-current="page"`. |
| Secondary flow | Complete one task entered from a primary destination | Swap, Send/Receive | Use a top context header with a 44px back target and a centered page title. Keep the flow focused on one primary task; do not add a second primary navigation pattern. |
| Detail / utility surface | Inspect or act on one object or system area | Transaction details, Asset details, Network & Nodes | Use a top context header or sheet header. Put a contextual action on the trailing side only when it belongs to the current object. Do not repeat the primary bottom navigation inside an overlay or detail sheet. |
| System feedback | Explain state or request a decision | Empty, error, confirmation, loading | Keep the current navigation context. Use `EmptyState`, `ErrorState`, `Modal` or the documented confirmation pattern instead of introducing a new navigation layer. |

## Header rules

- The title names the current screen or task, not the previous destination.
- A back control appears only when the route is entered from another screen or is presented as a sheet.
- The back control is a minimum 44px target, uses a semantic Lucide icon and has an accessible label.
- Trailing actions must be contextual to the current screen (for example, more options or close); they must not duplicate a bottom-navigation destination.
- Modal and sheet headers own their close action. A sheet must not also render a second page-level back control.
- Long titles and supporting labels may wrap; the header must not force horizontal scrolling.

## Route mapping

- Primary: `/fresnica-home`, `/fresnica-activity`, `/fresnica-scan`, `/fresnica-explore-dapps`, `/fresnica-settings`.
- Secondary: `/fresnica-swap`, `/fresnica-transfer`.
- Detail / utility: `/fresnica-transaction-details`, `/fresnica-asset-details`, `/fresnica-network-nodes`.

The wallet example shell remains responsible for the mobile canvas and scrolling. The design-system demo uses its own web-oriented sidebar and top bar; it must not inherit the wallet bottom-navigation contract.

## Component extraction boundary

The current secondary headers share behavior but not one stable visual/API contract: Swap and Transfer use centered task titles, Transaction details adds a trailing action, and Asset details / Network & Nodes are sheet-style surfaces. Keep these headers route-local for now. Reconsider a `NavigationHeader` only after at least three screens need the same title, leading action, trailing action, safe-area and accessibility API without route-specific exceptions.
