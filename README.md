# Fresnica UI

<div align="center">
    <img src="demo/img/fresnica/fresnica-logo.png" alt="Fresnica" width="320" />
    <p>A React + TypeScript component library for Fresnica Stellar wallet products.</p>
    <img src="https://img.shields.io/badge/tests-561%20✓-brightgreen?style=flat-square" alt="Unit tests" />
    <img src="https://img.shields.io/badge/a11y_tests-49%20✓-brightgreen?style=flat-square" alt="Accessibility tests" />
    <img src="https://img.shields.io/badge/components-48-blue?style=flat-square" alt="Components" />
    <img src="https://img.shields.io/badge/a11y-WAI--ARIA%20APG-brightgreen?style=flat-square" alt="Accessibility" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License: MIT" /></a>
</div>

<p align="center">English | <a href="./docs/README.zh-CN.md">简体中文</a></p>

## Design direction

Fresnica UI provides minimal fintech surfaces for Stellar assets, transfers, swaps, signing and network status.

- Light primary: `#00A875`; dark primary: `#00CA8A`.
- Green filled controls always use white text.
- Swap may use the inverse action: black in light theme and white in dark theme.
- Roboto with `Noto Sans SC` fallback.
- Lucide interface icons; approved Fresnica brand marks are the only image-based icons.
- Runtime theming through semantic `--Fresnica-*` CSS variables.

## Installation

```bash
git clone https://github.com/Pixman022/fresnica-ui.git
cd fresnica-ui
npm install
```

The package is currently developed from this repository and is not published to
npm yet. Package installation instructions will be added when a registry release
is intentionally created.

## Runtime compatibility

- React and React DOM **18.0.0 or newer** are required. React 17 is not supported because
  overlay components such as Modal and Drawer use React 18's `useId` API.
- The development baseline remains React 18.3.1. CI also installs the packed library into
  a clean React 18.0.0 consumer and verifies TypeScript plus a production Vite build using
  Button, the `useId`-based Modal path, and the packaged style entry.

## Quick start

```tsx
import { ArrowRight } from 'lucide-react';
import { Button, Card } from 'fresnica-ui';
import 'fresnica-ui/style';

export function WalletSummary() {
    return (
        <Card>
            <h2>Stellar balance</h2>
            <strong>1,240.50 XLM</strong>
            <Button type="primary" icon={<ArrowRight size={18} />}>
                Send
            </Button>
        </Card>
    );
}
```

## Global UI configuration

Web `1.1.0` adds an optional global Locale layer. It composes with the existing
`FresnicaThemeProvider`; it does not replace or duplicate theme persistence.

```tsx
import { FresnicaThemeProvider, FresnicaUiProvider, zhCN } from 'fresnica-ui';

<FresnicaThemeProvider>
    <FresnicaUiProvider locale={zhCN}>
        <App />
    </FresnicaUiProvider>
</FresnicaThemeProvider>;
```

Existing calls remain valid without `FresnicaUiProvider`. Generic copy resolves in this order:
explicit component copy → component `labels` → Provider Locale → historical component default.
`Button` and `Input` also expose typed DOM refs for focus and integration work.

See [component localization](./docs/design-system/component-localization.md) and
[build and release](./docs/development/build-and-release.md) for the full contract and delivery process.

## Online demo

- [Fresnica website preview — Geometric Light V2.1](https://pixman022.github.io/fresnica-ui/fresnica-website-preview/)
- [Design-system preview](https://pixman022.github.io/fresnica-ui/)
- [Component examples](https://pixman022.github.io/fresnica-ui/examples.html)

The GitHub Pages previews are rebuilt and deployed automatically after successful `main` CI. The website preview remains a pre-release product concept; verified distribution links will only be added after official channels are confirmed.

## Development

```bash
npm install
npm run dev
npm run ci
npm run build:demo
```

`npm run build:demo` produces two independent HTML entries:

- `demo-dist/index.html` — Fresnica design-system introduction, tokens and component documentation.
- `demo-dist/examples.html` — wallet product examples, including Home, Swap, Transfer, Activity, Settings and related Stellar flows.

When opening either file directly shows only the fallback page, run `npm run dev` or `npm run preview:demo` and use the local HTTP address printed by Vite.

## Documentation

- [Design system](./docs/design-system/README.md)
- [Component-development guide](./docs/development/component-development.md)
- [Testing guide](./docs/development/testing.md)
- [Installable Fresnica style skill](./skills/fresnica-ui-style/README.md)
- [Third-party notices](./THIRD_PARTY_NOTICES.md)
- [Project instructions](./AGENTS.md)

## License

MIT License. See [LICENSE](./LICENSE). Copyright (c) 2026 Pixman.

The MIT notice applies to project-owned source and documentation. Third-party
dependencies, fonts and any externally sourced artwork remain subject to their
respective licenses.
