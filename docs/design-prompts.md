# Design Prompts

Use this concise brief with UI generation tools. Exact values remain in the canonical [design system](./design-system/README.md).

```text
Design a Fresnica mobile wallet interface for the Stellar network.

Visual direction:
- Minimal, precise fintech aesthetic with softly rounded neutral surfaces.
- Roboto for Latin text and numbers; Noto Sans SC fallback for Chinese.
- Light primary #00A875; dark primary #00CA8A. Green filled controls always use white text.
- Keep primary green scarce: one dominant filled-primary emphasis per screen or action region. Use neutral colors for ordinary icons, metadata, copy, Max/All, direction switches and estimated values.
- Keep brand, success and gain roles separate even when they all appear green; use success for completion/health and gain only for actual positive financial movement.
- Active bottom navigation uses a primary icon and label on a transparent background.
- Swap primary action uses the inverse token: black in light theme, white in dark theme.
- Secondary semantic accents: protocol purple, network blue, liquidity orange and pending yellow.
- Use only Lucide interface icons. Brand marks are limited to the approved Fresnica logo and app icon.
- Use 8–16px control radii and 16–24px card radii; establish hierarchy with subtle borders and surface contrast, not shadows.
- Keep motion between 0.15s and 0.35s with reduced-motion support.
- Show Stellar assets, Horizon network state, signing, fees, transfers and swaps.
- Avoid nature-themed artwork, irregular decorative shapes, textured backgrounds and game-like effects.
```

For code output, require semantic `--Fresnica-*` CSS variables and verify both themes at 320px, 360px, 390–393px and 430px mobile widths, plus 768px and desktop widths.
