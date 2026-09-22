# Fresnica UI

<div align="center">
    <img src="demo/img/fresnica/fresnica-logo.png" alt="Fresnica" width="320" />
    <p>A React + TypeScript component library for Fresnica Stellar wallet products.</p>
    <img src="https://img.shields.io/badge/tests-504%20✓-brightgreen?style=flat-square" alt="Tests" />
    <img src="https://img.shields.io/badge/components-46-blue?style=flat-square" alt="Components" />
    <img src="https://img.shields.io/badge/a11y-WAI--ARIA%20APG-brightgreen?style=flat-square" alt="Accessibility" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-CC--BY--NC--4.0-orange.svg?style=flat-square" alt="License: CC BY-NC 4.0" /></a>
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
npm install fresnica-ui
```

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
- [Project instructions](./AGENTS.md)

## License

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). See [LICENSE](./LICENSE). Commercial use is prohibited.
