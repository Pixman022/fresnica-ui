# Mobile native baseline

This document is the implementation baseline for bringing native mobile clients into
the Fresnica design-system scope. Android was the first delivery and validation target;
the current React Native package also has a Simulator-backed iPhone component baseline.
React Native is the shared UI implementation, while Kotlin and Swift remain available
for app-shell and platform integration that cannot be expressed safely in TypeScript.

The version and platform values are transcribed from the approved project document
`技术栈基线.md`. This repository copy is the reviewable source for implementation;
if that document changes, update this file and the machine-readable metadata together.

## Delivery scope

| Area | Current delivered scope | Deferred / later scope |
| --- | --- | --- |
| Platform | Android implementation/acceptance plus Simulator-backed iPhone component support | Physical-device iOS/VoiceOver acceptance and broader product device matrices |
| Shared UI | 15 delivered primitives: Typography, Button, Field, Screen, Header, ListRow, Modal, StateView, IconButton, Divider, StatusBadge, InlineMessage, Skeleton, Progress and SegmentedControl | Additional components only after stable reuse is proven |
| Native code | App shell, system bars, lifecycle and unavoidable platform bridges | Capability-specific integration approved case by case |
| Product UI | Feature-local composition using shared primitives | Promote only after stable reuse across at least two features |

The Web package remains independent. React Native code must not import DOM
components, CSS, Less, Web Portal or browser storage APIs.

### Cross-platform synchronization status — updated 2026-10-20

Native NU01–NU08 are complete; see the [Native optimization completion record](https://github.com/Pixman022/fresnica-ui-native/blob/ea40207351d9a2a62c58226c2c361f06444ee309/docs/native-library-optimization-status-2026-10-10.md).
The Web Locale provider and connected generic component copy are now delivered; see
[component localization](component-localization.md). The iPhone React Native slice has also completed
its current Simulator-backed design-system round; physical-device, VoiceOver and product-release
acceptance remain separate deferred gates.

## Toolchain baseline

- React Native CLI, not Expo.
- React Native `0.87.0`, React `19.2.3`, TypeScript `6.0.3`.
- Node.js `>=22.13.0`, npm and a committed `package-lock.json`.
- Hermes and React Native New Architecture enabled.
- Android: minSdk 26, targetSdk 36, compileSdk 37, Kotlin 2.2.0 and NDK
  27.1.12297006.
- iOS support round: planned package floor iOS 15.1 from the RN 0.87 template; Xcode 16.4 / iOS 18.5 SDK is the current CI build baseline. Simulator runtime coverage is recorded separately, and physical-device acceptance remains deferred. See [iOS Guidelines](ios-guidelines.md).

The native package uses React Native `StyleSheet`, colocated `styles.ts`, function
components and Hooks. React and React Native are peer dependencies. UI components
prefer TypeScript/React Native implementations and do not add native modules silently.

## Architecture boundary

The component package must not create a `NavigationContainer`, decide product routes,
perform network requests, own wallet/account/transaction state, or depend on Realm,
Stellar SDK, Fresnica Native SDK, product Features, global mutable services or stores.

The app shell owns navigation, safe-area composition, StatusBar, system navigation
bar, persistence and platform overlays. Components communicate through props and
callbacks. The approved navigation baseline is React Navigation 7 with native stack
and bottom tabs, `react-native-safe-area-context`, `react-native-screens` and NetInfo.

For shared behavior, platform responsibility can differ without changing the target outcome.
The Web `Modal` owns its DOM focus entry/trap/restoration behavior. Native exposes refs and
lifecycle cooperation so the host can move and restore accessibility focus around the modal.

## Theme and token policy

- The three layers remain Primitive → Semantic → Component.
- Semantic names and meanings are shared across platforms. A platform may use a
  different value only through an explicit platform override with a reason and an
  accessibility check; it must not silently redefine the role.
- Web 1.0.0 values remain frozen. Native outputs are generated separately as typed
  colors, dimensions and font metrics for `AppTheme`.
- Native themes support Light, Dark and System. The user chooses one brand color;
  light and dark roles are derived together.
- Android system dynamic accent color is not consumed. Fresnica brand and semantic
  roles remain deterministic across supported devices.
- The Native package accepts a complete custom `AppTheme`; generated Light/Dark themes remain the built-in defaults.
  Image selection, cropping, color extraction, theme generation and persistence belong to the consuming
  application and are not implemented by the component package. The historical Fresnica product decision not
  to build image-derived theming remains scoped to that product and does not restrict other consumers from
  supplying a complete custom theme.
- Financial feedback roles remain independent from user-selected brand colors.

Native pins an reviewed Web Token source revision instead of following floating `main`.
When either shared Token source changes, review and merge the Web source first; then update
the Native source lock explicitly, regenerate Native outputs, inspect the mapping diff and
run Native validation. Ordinary Web code or documentation changes do not require advancing
the Native Token lock.

The system status bar and navigation bar follow the current page surface. Their icon
appearance is derived automatically for legibility. Brand primary is not used as a
default system-bar background.

## Localization and regional behavior

Phase one supports English and Simplified Chinese. The Native package now provides
`FresnicaUiProvider`, `useUiTheme`, `useUiLocale`, and built-in `enUS`/`zhCN` packs for
component-generic copy. The consuming app still owns locale/theme selection and persistence,
and explicit component copy remains the most specific override. The package does not embed
wallet business terminology. The Web package now ships its optional global Locale provider
alongside the existing per-component `labels` and explicit-copy contract; eligible generic
component copy is connected through the documented precedence rules.

Dates, times, number grouping and hour-cycle presentation follow the system locale and
region. Stored timestamps and domain values remain locale-neutral.

## Icons and motion

Until native icon dependencies are approved, component APIs accept a `ReactNode` icon.
If adopted, `lucide-react-native` and `react-native-svg` must be reviewed and recorded
in the third-party notice before use. The existing Web `lucide-react` package cannot be
imported into native code.

Basic component motion should stay minimal. The current shared `Modal` keeps its existing native `fade` behavior by owner decision; no reduced-motion compliance claim is made for that behavior. Full reduced-motion reassessment belongs to the future product accessibility/release gate. Reanimated and Gesture Handler require a separate dependency decision; components must not introduce them implicitly.

## Accessibility and acceptance gates

Every interactive native component defines role, label, hint, state, disabled,
selected, checked and busy behavior as applicable. It must preserve a logical focus
order, support Dynamic Type, long translated copy and at least a 44×44 touch target.
State cannot be communicated by color alone.

### Component-package engineering gate

The reusable package is ready for internal consumption when:

1. TypeScript, ESLint, Prettier and Jest pass.
2. Light, Dark and System theme tests pass without raw colors or repeated design constants in components.
3. Disabled, loading, error and pressed states have component tests.
4. Accessibility role/state/label contracts are covered by tests where applicable.
5. Layout is checked at 320, 360, 390–393 and 430 logical-pixel widths.
6. The neutral Preview has reviewable Android emulator evidence.

Passing this gate does **not** claim physical-device TalkBack, complete reduced-motion,
or wallet-product accessibility acceptance.

### First wallet integration hard gate

Before the first consuming Fresnica wallet App is marked **UI integration complete**,
verify on a real supported Android device:

1. TalkBack reading and focus order across primary flows.
2. Accessible labels/states for buttons, icon actions, fields and modal content,
   including sensible focus restoration after modal close.
3. Real soft-keyboard avoidance and Android system Back behavior.
4. Safe-area behavior and status/navigation-bar legibility in Light and Dark.
5. At least 1.3× system font scale without critical clipping or hidden primary actions.
6. 44dp touch targets and status/error communication that does not rely on color alone.
7. English and Simplified Chinese long-content behavior.

### Release-stage gate

Before production release, add the product-specific multi-device/system-version matrix,
final contrast review and full reduced-motion reassessment. The iPhone implementation now
has Simulator-backed package evidence; physical-device VoiceOver and device acceptance remain
required only when the consuming product reaches its corresponding integration/release gate.


## iOS rule priority

Shared semantic meaning remains platform-independent. For iPhone implementation, read [iOS Guidelines](ios-guidelines.md) before applying Web-specific font, CSS focus, hover or pixel rules. Native component contracts and Preview evidence define implementation details; the consuming App owns navigation, outer safe-area composition, keyboard avoidance and product-level system services.
