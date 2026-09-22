# Fresnica UI

<div align="center">
    <img src="../demo/img/fresnica/fresnica-logo.png" alt="Fresnica" width="320" />
    <p>面向 Fresnica Stellar 钱包产品的 React + TypeScript 组件库。</p>
    <img src="https://img.shields.io/badge/tests-504%20✓-brightgreen?style=flat-square" alt="测试" />
    <img src="https://img.shields.io/badge/components-46-blue?style=flat-square" alt="组件" />
    <img src="https://img.shields.io/badge/a11y-WAI--ARIA%20APG-brightgreen?style=flat-square" alt="无障碍" />
    <a href="../LICENSE"><img src="https://img.shields.io/badge/license-CC--BY--NC--4.0-orange.svg?style=flat-square" alt="License: CC BY-NC 4.0" /></a>
</div>

<p align="center"><a href="../README.md">English</a> | 简体中文</p>

## 设计方向

Fresnica UI 为 Stellar 资产、转账、兑换、签名与网络状态提供简约金融科技界面。

- 浅色主色：`#00A875`；深色主色：`#00CA8A`。
- 绿色实心控件始终使用白色文字。
- Swap 可使用反转操作色：浅色主题黑色，深色主题白色。
- Roboto 字体，中文回退为 `Noto Sans SC`。
- 界面图标统一使用 Lucide；图片图标仅限已批准的 Fresnica 品牌标志。
- 通过语义 `--Fresnica-*` CSS 变量实现运行时主题切换。

## 安装

```bash
npm install fresnica-ui
```

## 快速上手

```tsx
import { ArrowRight } from 'lucide-react';
import { Button, Card } from 'fresnica-ui';
import 'fresnica-ui/style';

export function WalletSummary() {
    return (
        <Card>
            <h2>Stellar 余额</h2>
            <strong>1,240.50 XLM</strong>
            <Button type="primary" icon={<ArrowRight size={18} />}>
                转账
            </Button>
        </Card>
    );
}
```

## 本地开发

```bash
npm install
npm run dev
npm run ci
npm run build:demo
```

如果直接打开 `demo-dist/index.html` 只看到回退提示，请运行 `npm run dev` 或 `npm run preview:demo`，并访问 Vite 输出的本地 HTTP 地址。

## 文档

- [设计系统](./design-system/README.md)
- [组件开发指南](./development/component-development.md)
- [测试指南](./development/testing.md)
- [可安装的 Fresnica 风格 Skill](../skills/fresnica-ui-style/README.md)
- [项目工作说明](../AGENTS.md)

## License

知识共享 署名-非商业性使用 4.0 国际（CC BY-NC 4.0）。完整文本见 [LICENSE](../LICENSE)，禁止商业使用。
