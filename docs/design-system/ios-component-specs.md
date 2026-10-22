# iOS Component Specifications

Status: IOS06 complete for the current Simulator-backed design-system scope. The component set,
platform responsibilities, typography mapping and reviewed iPhone evidence are synchronized with
the verified Native implementation.

These specifications describe the existing React Native package. They do not create a SwiftUI/UIKit
component SDK, product navigation model or wallet-specific UI layer.

## Shared rules

- Shared semantic roles and component state meanings remain unchanged.
- iPhone is the first-round target. The host owns outer safe areas, navigation, keyboard avoidance
  and product-level system presentation.
- Interactive controls use the existing 44×44 pt minimum target baseline.
- Text remains compatible with system scaling. IOS03 keeps the current package roles unchanged for
  this release: body 14, supporting 13, action 15, sectionTitle 18, screenTitle 20 and display 48.
- Colors reference the existing semantic theme roles. Color/contrast changes remain deferred.
- Physical-device VoiceOver, real keyboard/autofill and product acceptance remain separate.
- The existing Native Modal keeps its `fade` behavior.

## Typography

**Use for:** body copy, supporting text, actions, section titles, screen titles and large display
emphasis.

**Structure:** React Native `Text` using one of the six public Fresnica typography roles.

**iOS behavior:** use the system font; allow Dynamic Type growth. Do not import the Web font stack or
fixed CSS line-height assumptions.

**Large text:** wrapping and vertical growth are preferred to clipping. The proposed
17/15/17/20/22/34 iOS-only mapping was not adopted because reviewed evidence supports targeted
layout adaptation rather than larger package-wide base values.

**Accessibility:** translated visible text remains readable by the platform screen reader. Heading
semantics belong to components that own a heading role, such as Header.

## Button

**Use for:** primary, secondary, quiet and destructive actions.

**Structure and size:** pressable container, optional icon and text label. Keep the existing minimum
interactive target and allow the control to grow vertically for long or larger text.

**States:** normal, pressed, disabled and loading. Loading remains disabled/busy and keeps the
caller-owned action label as its accessible name.

**Large text:** long labels may wrap/grow where required; do not force a Web-style fixed single line.

**Accessibility:** button role, localized label, disabled/busy state. The host owns action meaning and
submission flow.

## Field

**Use for:** general text, email, numeric/decimal, secure and multiline input.

**Structure:** visible label, native TextInput, optional leading content and supporting/error copy.

**States:** default, focused, error and disabled. Disabled remains authoritative over passthrough
native props.

**iOS input configuration:** the consuming screen selects keyboard type, input mode, content type,
autocomplete, return key and secure-entry settings for the actual content purpose.

**Large text:** label, value and supporting copy remain readable in the reviewed S03/S04/S06
evidence. The current supporting line-height stays unchanged because no clipping or unreachable
action was reproduced.

**Accessibility:** visible label is the default input label; caller copy may override label/hint.
Secrets must never be copied into visible supporting or accessibility strings.

## Screen

**Use for:** reusable content surface and optional scrolling.

**Structure:** themed background plus optional package-owned ScrollView.

**iOS behavior:** the consuming App owns outer safe-area edges, navigation container, system bars and
keyboard-avoidance composition.

**Large text:** use scrolling when content grows beyond the available height.

**Accessibility:** preserve content order; Screen does not group unrelated children into one control.

## Header

**Use for:** reusable screen heading and optional leading/trailing actions.

**Not for:** owning a UINavigationController/navigation stack, route transitions or the iOS back
gesture.

**Structure:** leading area, centered title and trailing area. Standard text sizes keep the existing
two-line truncation behavior.

**Large text:** S04 reproduced destructive title truncation at the maximum accessibility text
category. On iOS at `fontScale >= 1.5`, the title is allowed to grow without the two-line cap.
React-empty optional side content (`undefined`, `null`, booleans and the empty string) does not
reserve an otherwise empty side slot; renderable `0`, non-empty text, elements and real actions
continue to reserve their slot. S03 maximum-standard text keeps the standard layout.

**Accessibility:** the visible title exposes heading semantics. Back/close/done action labels are
caller-owned and must match the consuming task.

## ListRow

**Use for:** labeled list content with either a whole-row action or an independent trailing action.

**Structure:** optional leading content, title/description and optional trailing presentation/control.

**Interaction:** never combine a pressable whole row with a separately actionable trailing control.

**Large text:** rows may grow vertically. S04 reproduced trailing content squeezing the text column
into near single-character wrapping. On iOS at `fontScale >= 1.5`, trailing content moves to a
full-width second line so the copy keeps useful width. S03 maximum-standard text keeps the standard
horizontal layout.

**Accessibility:** a whole-row action exposes one button; a separate trailing action remains its own
control.

## Modal

**Use for:** controlled tasks that fit the existing modal contract.

**Not for:** automatically replacing iOS Sheet or full-screen navigation. Those presentation choices
belong to the host until a stable shared need is proven.

**Structure:** scrim, surface, title, close control and scrollable content.

**States and close paths:** `visible` and `onRequestClose` remain caller-controlled. Host/platform
dismissal paths should converge on the same close callback.

**Large text:** S05 validates title/content/close-control reachability at the maximum accessibility
text category. Scrolling remains preferred to clipping.

**Accessibility:** modal semantics are exposed; the host may coordinate initial/restored focus.
Actual VoiceOver focus behavior remains a physical-device check.

## StateView

**Use for:** empty, error and success result states with optional action.

**Structure:** title, optional description and optional action.

**Large text:** centered copy may grow. Reviewed S03/S04 detail evidence does not reproduce a
description-clipping failure, so the existing description line-height remains unchanged.

**Accessibility:** meaning must be present in text/equivalent labels and not depend on color.

## IconButton

**Use for:** icon-only actions with a stable accessible meaning.

**Structure and size:** 44×44 target containing caller-supplied visual icon content.

**States:** normal and disabled according to the existing contract.

**Accessibility:** caller provides a localized label. The icon source can be a brand asset, custom
ReactNode or host-selected SF Symbol; the shared package does not add an SF Symbols bridge.

## Divider

**Use for:** visual separation between related sections.

**Structure:** themed separator role and hairline-style visual treatment.

**Accessibility:** decorative separation cannot be the only indication of a state or hierarchy.

**Host responsibility:** decide whether a separator is structurally useful; do not use Divider as a
navigation or interaction control.

## StatusBadge

**Use for:** concise positive, negative, warning or neutral status.

**Structure:** pill-like container and readable label.

**Large text:** the badge may grow with its label; avoid using it for long explanatory copy.

**Accessibility:** status meaning includes text, not color alone.

## InlineMessage

**Use for:** info, success, warning or error feedback adjacent to relevant content.

**Structure:** optional icon plus message text.

**Announcement:** use alert delivery only when the component is the announcement owner. Use passive
delivery when the consuming App owns announcement timing.

**Large text:** message copy wraps and grows vertically.

**Accessibility:** do not announce the same error twice through both App logic and alert semantics.

## Skeleton

**Use for:** non-interactive loading placeholder where the final content shape is temporarily absent.

**Structure:** themed placeholder surface with caller-provided localized loading label.

**Accessibility:** expose meaningful loading/busy context without duplicating every decorative shape.

**Motion:** current behavior remains unchanged; Reduce Motion observations do not imply a new global
motion provider.

## Progress

**Use for:** determinate progress values from 0 to 1.

**Structure:** visual progress track/fill plus accessibility progress semantics.

**States:** input is clamped to the supported range.

**Accessibility:** expose min/max/current values and a caller-owned localized progress label.

## SegmentedControl

**Use for:** a short mutually exclusive set of view/filter choices.

**Structure:** group container and equal-width pressable segments.

**States:** one selected segment; selection state is exposed per option.

**Large text:** reviewed IOS05 evidence does not reproduce an unusable horizontal-density failure.
If a future consumer does reproduce one, change the layout rather than adding nested actions.

**Accessibility:** caller provides the group label; each option exposes label and selected state.

## Preview and evidence mapping

The neutral Native Preview is the implementation reference for the component states above. IOS05
uses S01–S06 Simulator scenarios for small/large iPhone layouts, Light/Dark, English/Simplified
Chinese, long content, larger text, keyboard-constrained height and Modal behavior.

IOS06 is complete for the current Simulator-backed design-system scope:

- IOS03 keeps the existing typography role values and rejects the unneeded iOS-only base-size mapping;
- IOS04 records the verified Header/ListRow accessibility-size layout adaptations;
- IOS05 records the S01-S06 Simulator matrix, including validated S05 Modal and S06 software-keyboard
  reachability;
- the component rules above remain aligned with the current Native package API.

This is a design-system specification, not a claim of physical-device VoiceOver, real keyboard/autofill,
color/contrast or wallet-product acceptance.
