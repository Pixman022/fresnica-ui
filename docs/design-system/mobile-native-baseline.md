# Mobile native baseline

This document is the implementation baseline for bringing native mobile clients into
the Fresnica design-system scope. Android is the first delivery target. React Native
is the shared UI implementation, while Kotlin and Swift remain available for app-shell
and platform integration that cannot be expressed safely in TypeScript.

The version and platform values are transcribed from the approved project document
`技术栈基线.md`. This repository copy is the reviewable source for implementation;
if that document changes, update this file and the machine-readable metadata together.

## Delivery scope

| Area | First phase | Later phase |
| --- | --- | --- |
| Platform | Android implementation and acceptance | iOS implementation and device acceptance |
| Shared UI | Theme, Typography, Button, Field, Screen, Header, ListRow, Modal and StateView | Additional components after reuse is proven |
| Native code | App shell, system bars, lifecycle and unavoidable platform bridges | Capability-specific integration approved case by case |
| Product UI | Feature-local composition using shared primitives | Promote only after stable reuse across at least two features |

The Web package remains independent. React Native code must not import DOM
components, CSS, Less, Web Portal or browser storage APIs.

## Toolchain baseline

- React Native CLI, not Expo.
- React Native `0.87.0`, React `19.2.3`, TypeScript `6.0.3`.
- Node.js `>=22.13.0`, npm and a committed `package-lock.json`.
- Hermes and React Native New Architecture enabled.
- Android: minSdk 26, targetSdk 36, compileSdk 37, Kotlin 2.2.0 and NDK
  27.1.12297006.
- iOS later phase: iOS 15.1 minimum, CocoaPods, Simulator and physical-device
  support.

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
- Image-derived theme generation is deferred pending a separate product decision. It
  is not part of phase one.
- Financial feedback roles remain independent from user-selected brand colors.

The system status bar and navigation bar follow the current page surface. Their icon
appearance is derived automatically for legibility. Brand primary is not used as a
default system-bar background.

## Localization and regional behavior

Phase one supports English and Simplified Chinese. Components expose stable enums,
labels, hints, errors and accessibility copy as injectable props; the app's existing
localization provider supplies the actual strings. Components do not own a global
locale provider and do not embed wallet business terminology.

Dates, times, number grouping and hour-cycle presentation follow the system locale and
region. Stored timestamps and domain values remain locale-neutral.

## Icons and motion

Until native icon dependencies are approved, component APIs accept a `ReactNode` icon.
If adopted, `lucide-react-native` and `react-native-svg` must be reviewed and recorded
in the third-party notice before use. The existing Web `lucide-react` package cannot be
imported into native code.

Basic motion uses React Native `Animated` and respects reduced-motion preferences.
Reanimated and Gesture Handler require a separate dependency decision; components must
not introduce them implicitly.

## Accessibility and acceptance gates

Every interactive native component defines role, label, hint, state, disabled,
selected, checked and busy behavior as applicable. It must preserve a logical focus
order, support `onAccessibilityTap`, Dynamic Type, long translated copy and at least a
44×44 touch target. State cannot be communicated by color alone.

Phase-one gates are:

1. TypeScript, ESLint, Prettier and Jest pass.
2. Light, Dark and System theme tests pass without raw colors or repeated design
   constants in components.
3. Disabled, loading, error and pressed states have component tests.
4. Accessibility role/state/label tests pass; asynchronous failures use one active
   announcement path only.
5. Android rendering, TalkBack, keyboard, safe-area, system-bar, reduced-motion and
   Dynamic Type behavior are manually accepted.
6. Layout is checked at 320, 360, 390–393 and 430 logical-pixel widths.

iOS VoiceOver and physical-device acceptance remain a later delivery gate, not a claim
of phase-one completion.
