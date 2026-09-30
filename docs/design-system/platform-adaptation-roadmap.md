# Platform adaptation roadmap

This roadmap records the evaluation findings without treating the current Web
library as a React Native component library. The shared design language remains
the source of truth; each client gets a thin platform adapter for layout,
input, accessibility and system integration.

## Status

### Completed in the public-repository baseline

- The repository is released under the MIT License, which permits commercial use,
  modification, distribution and private integration with attribution notice.
- Repository documentation and demo copy no longer describe the project as
  non-commercial or restricted to learning use.
- The Node toolchain contract is documented as Node 20.19.0 or newer.
- The current Web Token values are frozen as the 1.0.0 cross-platform baseline;
  native adapters must consume them without changing Web visuals.
- Native Light/Dark `AppTheme` colors are generated from the reviewed platform
  adapter source. Theme preferences remain independent per host platform.
- No generic `secondary` action token is introduced in this baseline. `content-secondary`
  remains a supporting-content role, while `accent-blue` remains network-information
  semantics; secondary actions use their component's neutral surface/border roles.

### Adopt now: Web design system

- Keep the existing Primitive → Semantic → Component token architecture.
- Keep the existing light/dark CSS variable implementation and current visual
  values until a cross-platform token decision is approved.
- Keep Web-only patterns such as tables, pagination, date/time pickers and
  browser navigation in the Web layer.
- Keep wallet product flows in the examples/feature layer rather than promoting
  them to generic components.

### In scope now: Android-first native mobile adapter

- The first native client is React Native CLI `0.87.0`, with Android as the
  delivery and validation priority. Its exact toolchain is recorded in
  [mobile-native-baseline.md](./mobile-native-baseline.md).
- Build the first shared slice as Theme/AppTheme, Typography, Button, Field,
  Screen, Header, ListRow, Modal and StateView. Keep the Web package and its
  visual values unchanged.
- Keep navigation, system bars, safe areas, persistence and platform overlays in
  the App shell. Kotlin/Swift are integration escape hatches, not a second UI
  implementation of every component.

### Later: additional mobile and desktop adapters

- Create platform-native primitive components from shared semantic tokens; do not
  import DOM components, CSS Modules or browser portals into React Native.
- Define native theme output for light, dark and system modes, including primary,
  purpose-specific accent, status-bar and system-navigation semantics. A generic
  secondary action role is intentionally not part of this baseline.
- Add platform accessibility contracts: roles, states, labels, hints, focus order,
  announcements, Dynamic Type, keyboard/safe-area handling and reduced motion.
- Add Android TalkBack, Dynamic Type, keyboard, safe-area, system-bar and reduced-
  motion validation in the first native slice. Add iOS VoiceOver and physical-device
  validation when the iOS slice starts.

## Evaluation findings and response

| Finding                                    | Response                                                                                                  | Priority                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Existing license blocked commercial use    | Replaced CC BY-NC with MIT and synchronized all repository copy                                           | Done                            |
| Web implementation is not React Native     | Treat RN as an Android-first adapter, not a direct code reuse target                                      | Resolved for baseline           |
| Web/Mobile token values conflict           | Current Web values are frozen as the 1.0.0 baseline; native overrides require a recorded product decision | Resolved for baseline           |
| Theme contract lacks native outputs        | Generate typed `AppTheme` colors and dimensions in the native adapter; keep image-derived themes deferred | Done for the standalone adapter |
| Generic secondary role is ambiguous        | Keep `content-secondary` and `accent-blue` purpose-specific; do not alias either to a generic secondary action | Resolved for baseline |
| Public components contain default labels   | Added injectable locale/label contracts while preserving current defaults                                 | Done                            |
| Native accessibility rules are absent      | Component roles, labels, hints and states are documented and covered by hostless RN render tests; device behavior remains App-shell work | Component baseline done; device P1 |
| Public README statistics can drift         | Regenerate badges from the latest coverage report before release                                          | P1                              |
| Third-party assets may have separate terms | Inventory is recorded; project-owned artwork has been confirmed for public distribution                   | Done; revisit on asset changes  |

## Migration order

1. Create the Android-first React Native adapter package from the approved
   technical baseline; consume the reviewed Native spacing, radius, typography
   and elevation adapter values without changing the Web baseline.
2. Generate platform outputs from that source; keep CSS variables as the Web
   output and typed numeric values as the native output.
3. Implement shared native primitives (Text, Icon, Field, StatusBadge,
   InlineMessage, Toast, Skeleton, Progress, Sheet and SegmentedControl).
4. Migrate product slices one at a time while keeping wallet-specific components
   feature-local until reuse is proven.
5. Add Android accessibility, Dynamic Type, safe-area, keyboard and system-theme
   acceptance gates in the final App host; add iOS gates when that adapter begins.

## Compatibility rules

- No existing Web token is deleted or silently renamed during the migration.
- New semantic aliases may be introduced before component consumers move to them.
- Existing component props and default labels remain compatible; locale injection
  is additive first, followed by a deprecation window if a default is removed.
- No release is created until the token decision, package metadata, documentation,
  build matrix and visual acceptance are all aligned.
