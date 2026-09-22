import React from 'react';
import { Carousel } from '../../../src';
import { ApiRow, ApiTable, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const banner02 = new URL('../../img/fresnica/banner02.webp', import.meta.url).href;
const banner03 = new URL('../../img/fresnica/banner03.webp', import.meta.url).href;
const banner04 = new URL('../../img/fresnica/banner04.webp', import.meta.url).href;
const slideImages = [banner02, banner03, banner04];

const CAROUSEL_API: ApiRow[] = [
    { prop: 'children', desc: '每个直接子元素为一张', type: 'ReactNode', defaultVal: '-', required: true },
    { prop: 'activeIndex', desc: '当前索引（受控）', type: 'number', defaultVal: '-' },
    { prop: 'defaultActiveIndex', desc: '初始索引', type: 'number', defaultVal: '0' },
    { prop: 'onChange', desc: '切换回调', type: '(index: number) => void', defaultVal: '-' },
    { prop: 'autoplay', desc: '自动播放', type: 'boolean', defaultVal: 'false' },
    { prop: 'interval', desc: '自动播放间隔（ms）', type: 'number', defaultVal: '3000' },
    { prop: 'loop', desc: '首尾循环', type: 'boolean', defaultVal: 'true' },
    { prop: 'showArrows', desc: '显示箭头', type: 'boolean', defaultVal: 'true' },
    { prop: 'showDots', desc: '显示圆点', type: 'boolean', defaultVal: 'true' },
    { prop: 'pauseOnHover', desc: '悬停或聚焦时暂停', type: 'boolean', defaultVal: 'true' },
];

const slides = [
    { title: 'Portfolio overview', desc: '查看 Stellar 账户的总资产与 24 小时变化。' },
    { title: 'Secure transfer', desc: '确认收款地址和网络费用后再提交交易。' },
    { title: 'Explore Stellar', desc: '发现可信 dApp 与最新的网络活动。' },
];

const CarouselDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Carousel <DemoTag>轮播图</DemoTag> <DemoTag>键盘可用</DemoTag>
        </div>

        <div style={labelStyle}>自动播放（悬停或聚焦时暂停）</div>
        <Carousel
            autoplay
            interval={3500}
            aria-label="Fresnica wallet highlights"
            style={{ width: '100%', maxWidth: 760 }}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.title}
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: 'clamp(240px, 56vw, 360px)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 'clamp(var(--Fresnica-spacing-lg), 4vw, var(--Fresnica-spacing-xl))',
                        boxSizing: 'border-box',
                        color: 'var(--Fresnica-on-primary-color)',
                    }}
                >
                    <img
                        src={slideImages[index]}
                        alt=""
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, transparent 20%, var(--Fresnica-mask-bg-strong))',
                        }}
                    />
                    <div style={{ paddingBottom: 30 }}>
                        <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 900 }}>{slide.title}</div>
                        <div
                            style={{
                                marginTop: 'var(--Fresnica-spacing-sm)',
                                fontSize: 'var(--Fresnica-font-size-base)',
                                fontWeight: 600,
                            }}
                        >
                            {slide.desc}
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>

        <CodeBlock
            code={`import { Carousel } from 'fresnica-ui';

<Carousel autoplay interval={3500} aria-label="Fresnica wallet highlights">
    <img src="/assets/fresnica/banner02.webp" alt="Portfolio overview" />
    <img src="/assets/fresnica/banner03.webp" alt="Secure transfer" />
    <img src="/assets/fresnica/banner04.webp" alt="Explore Stellar" />
</Carousel>`}
        />
        <ApiTable rows={CAROUSEL_API} />
    </div>
);

export default CarouselDemo;
