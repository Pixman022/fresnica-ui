# Platform adapter contract

This contract turns the approved Web token baseline into platform outputs without
copying the Web implementation. It is a boundary document, not a React Native
or desktop runtime package.

## Source and outputs

`design-system/tokens.json` remains the structured source and
`design-system/tokens.css` remains the Web output. The machine-readable baseline
metadata and reviewed platform adapter values are in
`design-system/platform-token-source.json`. Native Light/Dark `AppTheme` values
are generated into the standalone adapter; platform theme preferences remain
local to each host and are not synchronized between Web, Mobile or Desktop. Native pins an
explicit reviewed Web source revision. Shared Token changes are reviewed in Web first, then
Native deliberately updates its source lock, regenerates outputs and validates the mapping;
ordinary Web commits do not advance the Native lock.

| Layer        | Web                                  | Mobile                                        | Desktop                                   |
| ------------ | ------------------------------------ | --------------------------------------------- | ----------------------------------------- |
| Primitive    | CSS aliases and dimensions           | Typed colors, numbers and font metrics        | Typed values or host variables            |
| Semantic     | CSS custom properties                | Theme object generated from semantic roles    | Theme object or host theme bridge         |
| Component    | Less modules consume semantic tokens | Native components consume the same roles      | Host components consume the same roles    |
| Navigation   | Browser route/top or side navigation | Safe-area-aware bottom navigation when needed | Sidebar/top navigation and keyboard focus |
| Focused task | Dialog, drawer or popover            | Sheet or native dialog                        | Dialog, side panel or popover             |

## Adapter rules

1. Adapters consume semantic roles, not component CSS selectors.
2. Adapters may change layout, input method, focus behavior and system integration;
   they must not silently change the meaning of a semantic token.
3. Native color values are explicit adapter outputs generated from the reviewed
   platform source. Any difference from the Web value requires a recorded reason
   and accessibility review.
4. Platform-specific additions use a platform namespace and do not overwrite the
   shared token name.
5. Existing Web props and default visual values remain compatible while a native
   adapter is introduced.
6. Product-specific wallet flows stay feature-local until at least two features
   demonstrate stable reuse.

## Delivered native adapter surface

The current Native package has 15 delivered primitives: `Typography`, `Button`, `Field`,
`Screen`, `Header`, `ListRow`, `Modal`, `StateView`, `IconButton`, `Divider`, `StatusBadge`,
`InlineMessage`, `Skeleton`, `Progress` and `SegmentedControl`. Additional shared primitives are
promoted only after real, stable reuse is demonstrated; `Toast/Announcement`, `Sheet/ActionSheet`
and other previously suggested components are not current required deliverables.

Native also ships `FresnicaUiProvider`, theme/locale hooks and `enUS`/`zhCN` for generic component
copy. Host apps still own selection/persistence. The Web keeps its existing `FresnicaThemeProvider`;
its global Locale configuration is a separate WS03 implementation rather than a second theme system.

## Explicit non-goals

- No React Native dependency is added to this Web repository in the baseline step.
- No DOM component is presented as a native component.
- No Web visual token is changed to resolve a conflict that has not been supplied
  by a native product baseline.
- Table, pagination, date/time picker and browser navigation remain Web-oriented
  until a platform-specific product requires an adapter.

## Cross-platform behavior responsibility — 2026-10-12

Shared behavior goals do not require identical APIs. Web DOM components own browser focus and
native element refs; Web `Modal` already manages focus entry, trapping and restoration. Native
uses platform refs/lifecycle cooperation for focus and Android-specific behavior. TextInputProps,
Pressable refs, TalkBack, system Back and system bars remain Native-specific. Native NU01–NU08 are
complete; Web WS01–WS06 synchronize the reusable contract without reopening Native delivery.
