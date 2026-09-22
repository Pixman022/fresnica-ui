# Standalone single-file HTML usage

Use this path when the deliverable is one `index.html` without npm or a bundler. Recreate only the components the page needs and preserve their documented public behavior.

## Inputs

Read the current canonical sources before generating:

- [CSS variables](https://raw.githubusercontent.com/Pixman022/fresnica-ui/main/docs/design-system/css-variables.md)
- [Design rules](https://raw.githubusercontent.com/Pixman022/fresnica-ui/main/docs/design-system/design-rules.md)
- The relevant files under [component specs](https://github.com/Pixman022/fresnica-ui/tree/main/docs/design-system/components)

## File contract

- Return one complete `index.html`.
- Put tokens and component styles in one `<style>` block, with `:root` and dark-theme overrides first.
- Use one React/Babel script block when React is needed; a plain semantic HTML implementation is acceptable when it preserves the requested behavior.
- Load Roboto 400–700 and Noto Sans SC 400/500/700.
- Use Lucide icons from its supported browser distribution; keep accessible labels on icon-only controls.
- Do not require image assets except an explicitly supplied Fresnica logo or app icon.

## Implementation rules

- Use `--Fresnica-*` variables throughout custom layout and component styles.
- Light primary is `#00A875`; dark primary is `#00CA8A`; green filled controls use white text.
- Swap may use the inverse action treatment.
- Build conventional rounded Modal and Drawer surfaces with focus management and keyboard dismissal.
- Use 8–16px radii for controls and 16–24px for cards and floating surfaces.
- Use short token-driven motion and a `prefers-reduced-motion` fallback.
- Limit product copy to Stellar assets, Mainnet/Testnet, Horizon, signing, fees, transfers and swaps.
- Verify the result at 320px, 360px, 390–393px and 430px mobile widths, plus 768px and a desktop width, in both themes.

All hard rules in [SKILL.md](../SKILL.md) also apply.
