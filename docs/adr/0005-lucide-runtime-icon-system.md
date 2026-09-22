# ADR 0005: Lucide Runtime Icon System

## Status

Accepted

## Context

Fresnica UI requires a consistent, accessible interface icon language across wallet actions, navigation and feedback. The
project adopted Lucide icons in the component and demo layers. Unlike the peer-rendering packages, the icon implementation
must be shipped with the library so consumers do not need to install a second icon package or recreate the icon mapping.

## Decision

`lucide-react` is the library's only direct runtime dependency. Components import named icons from that package, and the
library build keeps React, React DOM, `react/jsx-runtime` and `classnames` external while bundling the used Lucide modules.
Image-based icons are limited to approved Fresnica brand marks.

## Consequences

- Every component and demo uses the same Lucide stroke language and inherits `currentColor` for theme-aware states.
- Consumers receive the icons needed by imported components without a second icon-system setup step.
- The former zero-runtime-dependency decision in ADR 0001 remains historical for peer-rendering dependencies; this ADR
  supersedes its claim that the package has no direct runtime dependencies.
- Future icon additions must come from `lucide-react` unless a new architecture decision explicitly approves another source.
