# Theme customization

The library exposes `FresnicaThemeProvider` for local, user-selected branding colors. The provider changes only brand and interaction tokens; financial semantic colors such as success, failure, gain, loss, warning and high risk remain independent.

```tsx
import { FresnicaThemeProvider } from 'fresnica-ui';

<FresnicaThemeProvider>
    <App />
</FresnicaThemeProvider>;
```

## Behavior

- `primaryColor` is one HEX color (`#RRGGBB`, with 3-digit input accepted).
- Light and dark values are generated from the same color; dark mode is not configured separately.
- Generated foreground colors are adjusted to meet WCAG AA contrast for primary actions.
- When adjustment is needed, the preview control explains that the selected color could reduce text and icon visibility and shows the effective HEX color used to keep content clear.
- Settings persist in `localStorage` under `fresnica-theme-settings` and synchronize through the browser `storage` event.
- `reset()` restores the default Fresnica brand color and stylesheet tokens.
- The provider has no network dependency and does not export theme files.

The demo sites expose the same control as “主题色 / Theme color” in the global appearance controls. This is a preview aid; consumers can use the provider directly in their own application.

## Token scope

Custom generation updates `primary-color`, hover/active variants, `primary-color-bg`, `on-primary-color`, `on-primary-container-color`, `border-color-hover`, and `focus-color`. Neutral surfaces, typography, spacing, radius, shadows and all financial semantic colors continue to come from the selected light/dark design-system baseline.

`getFresnicaThemeAdjustment(color, mode)` can be used when an application needs to explain an adjustment. It returns the normalized input color, effective primary color, foreground color, contrast ratio and an `adjusted` flag.
