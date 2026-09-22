# Design System

This directory is the single source of truth for the fresnica-ui design language. The component library source code is its implementation; every other usage document is a derived summary of what is written here.

## Design language

fresnica-ui is a React + TypeScript cross-platform UI component library for Fresnica products, with mobile, web and desktop adaptations.

The Fresnica product language is a **minimal technology system**: deliberately scarce emerald primary actions, restrained neutral surfaces, separate semantic status colors, responsive layout rules, and Lucide interface icons. Wallet flows are maintained as independent product examples.

- Source: `src/components/<ComponentName>/`
- Demo site: `demo/`
- Build: Vite (library mode), `vite.config.ts` for the library and `vite.config.demo.ts` for the demo
- Style system: Less Modules + design tokens in `src/styles/variables.less`

## Full export inventory

48 components plus 3 companion exports (`FormItem` / `useForm` / `ICON_LIST`), all exported from `src/index.ts`:

| Component      | Responsibility                                                                                                                                                                                    | Interactive | Decorative / display-only |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------- |
| `Button`       | Button, 6 types × 3 sizes                                                                                                                                                                           | ✓           |                           |
| `Input`        | Text input, 3 sizes + clear/prefix/suffix                                                                                                                                                           | ✓           |                           |
| `Switch`       | Toggle, default/small                                                                                                                                                                               | ✓           |                           |
| `Modal`        | Conventional rounded dialog with focus trap and overlay                                                                                                                                             | ✓           |                           |
| `Drawer`       | Rounded drawer with overlay and optional background push (left/right/top/bottom)                                                                                                                     | ✓           |                           |
| `Card`         | Neutral `default`/`dashed` container with semantic callout colors                                                                           |             | ✓                         |
| `Title`        | Semantic section heading with Fresnica typography                                                                                                                                                     |             | ✓                         |
| `Collapse`     | Accordion (animated with CSS Grid 0fr↔1fr, no JS animation)                                                                                                                                         | ✓           |                           |
| `Select`       | Dropdown selector (controlled)                                                                                                                                                                      | ✓           |                           |
| `DatePicker`   | Calendar date selector: date/month/year panels, controlled or uncontrolled, `disabledDate`, `allowClear`, keyboard navigation, start/end range mode (two linked panels)                                                                                                                                      | ✓           |                           |
| `TimePicker`   | Time selector: hour/minute/second scroll columns, `此刻` / `确定` footer, `hourStep` / `minuteStep` / `secondStep`, custom `format`                                                                                                                                                                          | ✓           |                           |
| `Checkbox`     | Checkbox group, horizontal/vertical, 3 sizes                                                                                                                                                        | ✓           |                           |
| `Radio`        | Radio group, 3 sizes, keyboard roving tabindex                                                                                                                                                      | ✓           |                           |
| `Tooltip`      | 12 placements, `hover`/`focus`/`click` triggers, `default`/`accent` styles                                                                                                                             | ✓           |                           |
| `Icon`         | SVG icon set (10 icons)                                                                                                                                                                             |             | ✓                         |
| `Footer`       | Text-only footer (`default`/`compact`)                                                                                                                                                                |             | ✓                         |
| `Divider`      | CSS divider (`subtle`/`solid`/`dashed`/`accent`)                                                                                                                                                      |             | ✓                         |
| `Cursor`       | Scoped cursor wrapper                                                                                                                                                                                 |             | ✓                         |
| `Typewriter`   | Typewriter effect, preserves the ReactNode structure                                                                                                                                                |             | ✓                         |
| `Tabs`         | Keyboard-accessible tab switching with neutral surfaces and a primary active state                                                                                                                    | ✓           |                           |
| `CodeBlock`    | JSX/TS syntax-highlighted code block                                                                                                                                                                |             | ✓                         |
| `Loading`      | Status container with Lucide spinner and accessible label                                                                                                                                             |             | ✓                         |
| `EmptyState`   | Neutral completed-request empty state with optional description and action                                                                                                                            |             | ✓                         |
| `ErrorState`   | Recoverable error state with alert semantics, explanation and retry/back action                                                                                                                       | ✓           |                           |
| `Table`        | Data table, fixed columns, empty state, loading                                                                                                                                                     | ✓           |                           |
| `Form`         | Form container + validation (ships the `FormItem` / `useForm` companion exports, API modeled on mainstream form libraries)                                                                           | ✓           |                           |
| `Tag`          | Capsule tag, 3 sizes × 4 variants × 7 semantic colors, supporting closable / onClick / disabled                                                                                                      | ✓           |                           |
| `Notification` | Imperative global notifications (antd-style): 4 types × 6 positions, supports description / btn / onClick / key reuse for in-place updates / destroy all                                             | ✓           |                           |
| `Progress`     | Token-based progress indicator with 3 sizes, inside/right/top text positions, custom infoFormat, and configurable fill transition duration |             | ✓                         |
| `Skeleton`     | Neutral loading placeholders with 4 variants (`text`/`circle`/`rect`/`paragraph`) plus button/input/avatar sub-components                       |             | ✓                         |
| `BackTop`      | Fixed bottom-right back-to-top button (ArrowUp artwork, easeInOutQuad smooth scroll)                                                                                                                | ✓           |                           |
| `Image`        | Token-based image frame with lazy loading, error fallback and click-to-preview lightbox                                                                                                               | ✓           |                           |
| `Carousel`     | Controlled/uncontrolled carousel with autoplay, looping, arrows, dots and keyboard navigation                                                                                                        | ✓           |                           |

Type exports cover the active Fresnica components and their companion types; legacy Fresnica decorative exports were removed from the public package.

Runtime values: `Notification`, `notificationOpen`, `notificationDestroy`, `NOTIFICATION_DEFAULT_DURATION`, `ICON_LIST`. Companion exports: `FormItem`, `useForm` (the default `Form` export also supports the `Form.Item` / `Form.useForm` spelling).

## Files in this directory

- [design-tokens.md](./design-tokens.md) — colors, typography, spacing, radius, borders, shadows and motion, with exact values.
- [design-rules.md](./design-rules.md) — the seven design laws, the fourteen visual hard rules, and the ❌/✅ anti-pattern quick reference.
- [visual-regression-checklist.md](./visual-regression-checklist.md) — the light/dark mobile visual review baseline for wallet routes and component states.
- [css-variables.md](./css-variables.md) — the complete `:root` variable template for re-implementing the style without the library.
- [token-audit-baseline.md](./token-audit-baseline.md) — the reviewed audit baseline and approved raw-value exceptions.
- [token-architecture.md](./token-architecture.md) — the Primitive → Semantic → Component token model, compatibility bridge and migration map.
- [pending-deletions.md](./pending-deletions.md) — deferred cleanup candidates awaiting a final product/API decision.
- [components/](./components/) — per-component pixel-level specs.
- [demo-site.md](./demo-site.md) — layout specs for the demo and documentation site (not part of the shipped library).
- [composition-evaluation.md](./composition-evaluation.md) — evaluation record for composition-level components such as `WalletScreen` and `PageHeader`.
- [theme-customization.md](./theme-customization.md) — local custom brand color generation, persistence and cross-tab synchronization.
- [cross-platform-core.md](./cross-platform-core.md) — shared principles, semantic tokens, states, accessibility and responsive baseline.
- [platform-adaptation.md](./platform-adaptation.md) — mobile, web and desktop layout and interaction adaptations.
- [navigation-hierarchy.md](./navigation-hierarchy.md) — wallet example primary, secondary and detail navigation responsibilities.
