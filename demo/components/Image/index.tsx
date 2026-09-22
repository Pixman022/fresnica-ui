import React from 'react';
import { Image, type ImageColor } from '../../../src';
import { labelStyle, sectionStyle, sectionTitleStyle, DemoTag, ApiTable, ApiRow, CodeBlock } from '../../tools';
const banner01 = new URL('../../img/fresnica/banner01.webp', import.meta.url).href;
const placeholder = banner01;

const IMAGE_COLORS: { color: ImageColor; label: string }[] = [
    { color: 'white', label: 'White 白色' },
    { color: 'default', label: 'Default 中性色' },
    { color: 'purple', label: 'Purple 紫色' },
    { color: 'app-blue', label: 'App Blue 应用蓝' },
    { color: 'app-yellow', label: 'App Yellow 应用黄' },
    { color: 'app-orange', label: 'App Orange 应用橙' },
    { color: 'app-teal', label: 'App Teal 应用青' },
    { color: 'app-red', label: 'App Red 应用红' },
];

const IMAGE_API: ApiRow[] = [
    { prop: 'src', desc: '图片地址', type: 'string', defaultVal: '-', required: true },
    { prop: 'alt', desc: '图片替代文本（无障碍）；留空表示装饰性图片', type: 'string', defaultVal: "''" },
    { prop: 'width', desc: '图片宽度', type: 'number | string', defaultVal: '-' },
    { prop: 'height', desc: '图片高度', type: 'number | string', defaultVal: '-' },
    {
        prop: 'color',
        desc: '媒体容器的语义背景色；正式钱包界面优先使用 default 或 white',
        type: `'white' | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'`,
        defaultVal: "'white'",
    },
    { prop: 'lazy', desc: '是否启用懒加载', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'preview',
        desc: '点击图片弹出大图预览（默认开启；支持 ESC / 点击遮罩 / 关闭按钮）',
        type: 'boolean',
        defaultVal: 'true',
    },
    { prop: 'onLoad', desc: '图片加载完成回调', type: '(e) => void', defaultVal: '-' },
    { prop: 'onError', desc: '图片加载失败回调', type: '(e) => void', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const ImageDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Image <DemoTag>10 props</DemoTag>
        </div>

        {/* 点击预览 */}
        <div style={labelStyle}>点击预览（preview 默认开启，点击图片弹出大图，ESC / 遮罩 / 关闭按钮均可关闭）</div>
        <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Image src={placeholder} alt="点击预览大图" width={330} height={200} preview />
        </div>

        {/* 基础用法 */}
        <div style={labelStyle}>基础用法（自定义宽高）</div>
        <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Image src={placeholder} alt="Stellar 资产预览" width={330} height={200} />
            <Image src={placeholder} alt="Fresnica 钱包功能预览" width={480} height={300} />
        </div>

        {/* 背景颜色 */}
        <div style={labelStyle}>语义背景颜色（正式界面优先 default / white）</div>
        <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
            {IMAGE_COLORS.map((c) => (
                <div key={c.color} style={{ textAlign: 'center' }}>
                    <Image src={placeholder} alt={c.label} width={330} height={200} color={c.color} />
                    <div
                        style={{
                            fontSize: 'var(--Fresnica-font-size-sm)',
                            color: 'var(--Fresnica-text-color-secondary)',
                            marginTop: 'var(--Fresnica-spacing-sm)',
                        }}
                    >
                        {c.label}
                    </div>
                </div>
            ))}
        </div>

        {/* 懒加载 */}
        <div style={labelStyle}>懒加载（lazy，滚动到视口附近才加载）</div>
        <Image src={placeholder} alt="懒加载的 Stellar 资产预览" width={360} height={230} lazy />

        <div style={labelStyle}>正式素材规格建议</div>
        <ul
            style={{
                color: 'var(--Fresnica-text-color-secondary)',
                fontSize: 'var(--Fresnica-font-size-base)',
                lineHeight: 'var(--Fresnica-line-height-base)',
                margin: 0,
                paddingInlineStart: 'var(--Fresnica-spacing-xl)',
            }}
        >
            <li>资产图标：40–64px，1:1，优先 WebP 或 PNG。</li>
            <li>二维码与凭证：240–320px，1:1，确保边缘清晰并保留安静区。</li>
            <li>横幅与文档图：16:9，优先 WebP；照片类素材可使用 JPEG。</li>
            <li>透明 Logo：优先 SVG，无法提供矢量时使用透明 PNG。</li>
            <li>固定显示尺寸的位图应提供 2x 源图，例如显示 64px 时提供 128px 素材。</li>
        </ul>

        {/* 错误占位 */}
        <div style={labelStyle}>错误占位（加载失败时显示占位）</div>
        <div style={{ display: 'flex', gap: 'var(--Fresnica-spacing-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Image src="./no-such-image.png" alt="加载失败" width={210} height={210} />
        </div>

        <CodeBlock
            code={`import React from 'react';
import { Image } from 'fresnica-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Image src="/path/to/stellar-asset-preview.webp" alt="Stellar 资产预览" width={200} height={150} />

            {/* 懒加载 */}
            <Image src="/path/to/stellar-asset-preview.webp" alt="懒加载的 Stellar 资产预览" width={240} height={150} lazy />

            {/* 点击预览：弹出大图 */}
            <Image src="/path/to/stellar-asset-preview.webp" alt="Stellar 资产预览" width={200} height={130} preview />

            {/* 失败占位：加载失败显示内置占位 */}
            <Image src="/broken.png" alt="失败" width={140} height={140} />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={IMAGE_API} />
    </div>
);

export default ImageDemo;
