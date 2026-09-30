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
local to each host and are not synchronized between Web, Mobile or Desktop.

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

## Minimum native adapter surface

The first native slice should cover `Text/Typography`, `Icon`, `IconButton`,
`Field`, `StatusBadge`, `InlineMessage`, `Toast/Announcement`, `Skeleton`,
`Progress`, `Sheet/ActionSheet` and `SegmentedControl`. It must also define
roles, labels, hints, state announcements, Dynamic Type behavior, safe-area
handling, keyboard avoidance, reduced motion and system theme synchronization.

## Explicit non-goals

- No React Native dependency is added to this Web repository in the baseline step.
- No DOM component is presented as a native component.
- No Web visual token is changed to resolve a conflict that has not been supplied
  by a native product baseline.
- Table, pagination, date/time picker and browser navigation remain Web-oriented
  until a platform-specific product requires an adapter.
