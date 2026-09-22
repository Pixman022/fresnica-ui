# React project usage

Scenario: a real React project where `fresnica-ui` is (or can be) installed from npm.
For a no-build single HTML file, use [standalone-html.md](standalone-html.md) instead.

## Setup (once per project)

```bash
npm install fresnica-ui
```

```ts
// app entry (main.tsx / _app.tsx / App.tsx)
import 'fresnica-ui/style'; // MUST be imported before any component renders
// Fonts (Roboto / Noto Sans SC) follow the project typography tokens; no component-level font override is needed.
```

Peer requirements: `react >= 17`, `react-dom >= 17` (plus `classnames` as a peer dependency).
The build supports per-component tree-shaking — import from the package root only.

## Explore the real API before writing code

The installed package ships complete TypeScript declarations. They are the ground truth
for props, legal values, and defaults — prefer them over any document:

- Resolve the package's type entry from its `package.json` (`types` / `exports`), then read
  the exported component and prop types.
- The [components/](components/) reference files in this skill are quick per-category
  summaries of the same API — convenient, but the declarations win on any conflict.

## Minimal boilerplate

```tsx
// App.tsx
import { Cursor, Button, Card, Input, Footer, Title } from 'fresnica-ui';

export default function App() {
    return (
        <Cursor>
            <main style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
                <Title size="large">Wallet activity</Title>
                <Card>
                    <Input placeholder="Search Stellar assets" allowClear />
                    <Button type="primary" block style={{ marginTop: 16 }}>
                        View assets
                    </Button>
                </Card>
            </main>
            <Footer type="compact" />
        </Cursor>
    );
}
```

## Common recipes

Confirm dialog:

```tsx
<Modal open={open} title="Remove trusted asset?" onClose={close}
    footer={
        <>
            <Button onClick={close}>Cancel</Button>
            <Button type="primary" danger onClick={() => { removeAsset(); close(); }}>Remove</Button>
        </>
    }
>
    The asset can be added again later, but it will disappear from the current wallet view.
</Modal>
```

Wallet help page:

```tsx
<main>
    <Title size="large">Stellar wallet help</Title>
    <Divider type="subtle" />
    {faqs.map((f) => (
        <Collapse key={f.id} question={f.q} answer={f.a} />
    ))}
    <Footer type="compact" />
</main>
```

Transaction confirmation:

```tsx
<Modal open={open} title="Confirm transfer" onClose={close} onOk={submit} typewriter={false}>
    Review the Stellar destination, amount and network fee before signing.
</Modal>
```

## Styling app-specific UI around the components

- Use the runtime tokens: `color: var(--Fresnica-text-color)`, `background: var(--Fresnica-bg-color)`,
  `border-radius: var(--Fresnica-border-radius-lg)` etc., so custom layout stays on-palette.
- Theme by overriding `--Fresnica-*` custom properties after `import 'fresnica-ui/style'`.
- Pixel-exact values (exact hex/px/keyframes, per-component CSS) live in the canonical
  design system:
  [design-tokens.md](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/design-tokens.md) ·
  [design-rules.md](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/design-rules.md) ·
  [components/](https://github.com/Pixman022/fresnica-ui/tree/main/docs/design-system/components)

## Scenario-specific rules

- One `import 'fresnica-ui/style'` at the entry — never per component file.
- No deep imports (`fresnica-ui/lib/...`, `fresnica-ui/src/...`); the public surface is
  the package root and `fresnica-ui/style`.
- Import types from the package root (`import type { ButtonProps } from 'fresnica-ui'`).
- All hard rules from [SKILL.md](../SKILL.md) apply.
