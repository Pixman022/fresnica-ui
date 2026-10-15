# iOS Guidelines

This page defines the iOS-specific layer of the Fresnica design system. It does not replace shared
semantic rules and it does not turn Web CSS values into iOS requirements.

## Rule priority

Read rules in this order:

1. Shared semantic meaning and product-independent design principles.
2. This iOS guideline when it explicitly defines an iOS adaptation.
3. Native component contracts and Preview examples for implementation details.
4. Consuming-application rules for navigation, product flows, safe-area composition and system
   services.

When a Web-only rule conflicts with an explicit iOS rule, the iOS rule wins for iPhone. The semantic
purpose of a token or component state must not change silently.

## Scope

- React Native component package, first-round iPhone support.
- iOS 15.1 is the planned package floor inherited from the RN 0.87 template; runtime coverage is
  recorded separately.
- iPad, physical-device acceptance, VoiceOver execution and product-release certification are not
  first-round completion requirements.
- Colors and contrast remain on their existing deferred track.
- The existing Native Modal `fade` behavior remains unchanged.

## Typography

Use the iOS system font as the default review starting point. Do not copy the Web Roboto/Noto Sans
stack as an iOS requirement.

IOS03 keeps the current package mappings for this release:

- `body`
- `supporting`
- `action`
- `sectionTitle`
- `screenTitle`
- `display`

The reviewed Native values remain body 14, supporting 13, action 15, sectionTitle 18,
screenTitle 20 and display 48. The proposed larger iOS-only base mapping was not adopted because
Simulator evidence supported targeted layout changes instead.

Text must remain compatible with Dynamic Type. Long labels and larger text are allowed to change
layout where necessary instead of being forced into a fixed Web line-height model. Bold Text and
large accessibility categories are validated as platform behavior, not simulated only with a fixed
scale multiplier.

## Layout and touch

- Treat 44x44 pt as the default minimum interactive target baseline.
- Preserve content hierarchy before compact density when larger text needs more space.
- The screen host owns outer safe-area and keyboard-avoidance composition unless a component
  contract explicitly owns an internal inset.
- Avoid copying Web pixel widths as device breakpoints. IOS05 records concrete iPhone sizes and
  Simulator scenarios.

## Navigation and presentation

The package does not create or manage an application navigation stack.

- `Header` is a reusable visual/action component, not a replacement for native navigation.
- Back, close and done actions need semantics that match the consuming screen.
- Use the existing `Modal` for tasks that fit its current contract.
- A host that needs a Sheet can compose the appropriate platform presentation. A new shared Sheet
  is considered only after stable reuse is proven.
- Native back gestures, route transitions and full-screen product tasks remain host responsibilities.

## Icons

Component icon slots remain `ReactNode` based.

- Existing brand assets keep their approved identity.
- SF Symbols may be used by a consuming iOS host when appropriate.
- The shared package does not add an SF Symbols bridge until a concrete reusable need justifies the
  dependency and API surface.
- Web's Lucide-only implementation rule does not require a native bridge or identical glyph source.

## System preferences

Record behavior for:

- Light / Dark appearance
- Dynamic Type / larger text
- Bold Text
- Reduce Motion
- Reduce Transparency only when system materials are actually used

Increase Contrast color changes remain deferred with the wider color/contrast work. The current
Native Modal keeps its `fade` behavior; observing Reduce Motion does not imply that the component
has been changed to follow that preference.

## Component state and accessibility contracts

Shared states such as disabled, loading, error, selected and progress keep their semantic meaning.
Native accessibility roles, labels and states are part of the component contract.

Actual VoiceOver speech, gestures and physical-device focus behavior remain a separate device
acceptance activity. Simulator and Jest results must not be described as physical-device VoiceOver
acceptance.

## Validation levels

Keep these conclusions separate:

1. **Package contract passed** — TypeScript/Jest/token/package checks pass.
2. **iOS build passed** — the packed package installs and the generated host compiles.
3. **iOS Simulator runtime passed** — the host launches and the recorded scenario was exercised.
4. **Visual review passed** — a named reviewer approved the recorded frame/scope.
5. **Physical-device acceptance passed** — explicitly deferred unless separately executed.

No lower level implies a higher one.

## Relationship to existing rules

The current Web `design-rules.md` remains valid for Web. Shared principles such as semantic state
meaning, restrained motion, localization responsibility and product-independent component behavior
continue to apply. Web-specific font stacks, CSS focus rings, hover behavior and pixel values do not
become iOS requirements unless repeated here as an explicit iOS rule.

## Component specifications

The versioned [iOS Component Specifications](ios-component-specs.md) map the existing 15 Native
components to iPhone usage, state, accessibility and host-responsibility rules. IOS03 typography
and IOS05 Simulator evidence are finalized for the current design-system scope; physical-device,
VoiceOver, real keyboard/autofill and color/contrast acceptance remain separate.
