# Platform adaptation

Platform adaptation explains how the shared core is expressed for mobile, web and desktop clients. It may change layout and input behavior while preserving the same semantic tokens and task hierarchy.

## Mobile

- Use a single-column layout below the responsive transition where content requires it.
- Use a mobile top header for title, back and page-level actions.
- Use bottom navigation only for mobile primary destinations; keep it safe-area aware and transparent when the design calls for it.
- Keep interactive targets at least 44 CSS px where practical.
- Handle virtual keyboards, long addresses and large amounts without horizontal clipping.
- Use sheets or dialogs for focused tasks and provide an explicit close or cancel path.
- Validate the 320, 360, 390–393 and 430px presets, plus the 768px tablet transition.

## Web

- Use top navigation or a sidebar for primary navigation; do not make mobile bottom navigation the default web shell.
- Provide mouse hover and keyboard `:focus-visible` states without making hover the only affordance.
- Preserve logical Tab order and support browser zoom up to 200% without clipped content.
- Use URL/deep-linkable routes and preserve browser back/forward behavior.
- Use popovers, menus, tooltips and wider tables when they improve discoverability or data density.

## Desktop client

- Support a resizable content area with a documented minimum useful width.
- Prefer sidebar + content or multi-column layouts when users compare data.
- Distinguish hover, keyboard focus and pressed states.
- Define keyboard shortcuts only for stable, high-frequency actions.
- Use context menus and command palettes only when the desktop product has a confirmed need.
- Keep window chrome, system tray and minimize/resize behavior in the desktop shell rather than the shared component library.

## Shared mapping rules

| Concern | Shared core | Platform adaptation |
| --- | --- | --- |
| Primary navigation | Current destination is clear and accessible | Mobile bottom navigation; web top/side navigation; desktop sidebar |
| Focused task | Has a clear entry, completion and cancellation path | Mobile sheet; web dialog/popover; desktop dialog or side panel |
| Data density | Amounts, statuses and labels remain readable | Single column; responsive table; multi-column desktop view |
| Theme | Semantic tokens and contrast requirements | CSS variables, native assets or desktop theme bridge |

## Platform terminology

Use “mobile”, “mobile viewport” and “mobile bottom navigation” in this project. Mention iOS or Android only when documenting a platform-specific integration or a reference source; the design system itself is not OS-specific.
