export type FresnicaThemeMode = 'light' | 'dark';

export const DEFAULT_PRIMARY_COLOR = '#00A875';
export const FRESNICA_THEME_STORAGE_KEY = 'fresnica-theme-settings';

export const getStoredFresnicaThemeMode = (storageKey = FRESNICA_THEME_STORAGE_KEY): FresnicaThemeMode => {
    if (typeof window === 'undefined') return 'light';
    try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
            const parsed = JSON.parse(stored) as { mode?: FresnicaThemeMode };
            if (parsed.mode === 'dark') return 'dark';
        }
        return window.localStorage.getItem('fresnica-theme') === 'dark' ? 'dark' : 'light';
    } catch {
        return 'light';
    }
};

export interface FresnicaThemeSnapshot {
    primaryColor: string;
    mode: FresnicaThemeMode;
    customized: boolean;
}

export type FresnicaThemeTokens = Record<string, string>;

export interface FresnicaThemeAdjustment {
    inputColor: string;
    effectivePrimaryColor: string;
    onPrimaryColor: string;
    contrastRatio: number;
    adjusted: boolean;
    mode: FresnicaThemeMode;
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface OKLCH {
    l: number;
    c: number;
    h: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const parseHex = (value: string): RGB | null => {
    const source = value.trim().replace(/^#/, '');
    const expanded = source.length === 3 || source.length === 4 ? source.replace(/./g, (char) => char + char) : source;
    if (!/^[\da-f]{6}(?:[\da-f]{2})?$/i.test(expanded)) return null;
    return {
        r: parseInt(expanded.slice(0, 2), 16) / 255,
        g: parseInt(expanded.slice(2, 4), 16) / 255,
        b: parseInt(expanded.slice(4, 6), 16) / 255,
    };
};

export const normalizeThemeColor = (value: string): string | null => {
    const rgb = parseHex(value);
    if (!rgb) return null;
    return `#${[rgb.r, rgb.g, rgb.b]
        .map((channel) =>
            Math.round(channel * 255)
                .toString(16)
                .padStart(2, '0')
        )
        .join('')}`.toUpperCase();
};

const toLinear = (value: number) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
const toSrgb = (value: number) => (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);

const rgbToOklch = ({ r, g, b }: RGB): OKLCH => {
    const red = toLinear(r);
    const green = toLinear(g);
    const blue = toLinear(b);
    const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
    const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
    const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue;
    const lRoot = Math.cbrt(l);
    const mRoot = Math.cbrt(m);
    const sRoot = Math.cbrt(s);
    const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
    const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
    const bValue = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
    return { l: lightness, c: Math.sqrt(a * a + bValue * bValue), h: Math.atan2(bValue, a) };
};

const oklchToRgb = ({ l, c, h }: OKLCH): RGB => {
    const a = c * Math.cos(h);
    const b = c * Math.sin(h);
    const lRoot = l + 0.3963377774 * a + 0.2158037573 * b;
    const mRoot = l - 0.1055613458 * a - 0.0638541728 * b;
    const sRoot = l - 0.0894841775 * a - 1.291485548 * b;
    const linearL = lRoot ** 3;
    const linearM = mRoot ** 3;
    const linearS = sRoot ** 3;
    return {
        r: clamp(toSrgb(4.0767416621 * linearL - 3.3077115913 * linearM + 0.2309699292 * linearS)),
        g: clamp(toSrgb(-1.2684380046 * linearL + 2.6097574011 * linearM - 0.3413193965 * linearS)),
        b: clamp(toSrgb(-0.0041960863 * linearL - 0.7034186147 * linearM + 1.707614701 * linearS)),
    };
};

const rgbToHex = (rgb: RGB) =>
    `#${[rgb.r, rgb.g, rgb.b]
        .map((channel) =>
            Math.round(clamp(channel) * 255)
                .toString(16)
                .padStart(2, '0')
        )
        .join('')}`.toUpperCase();

const oklchColor = (base: OKLCH, lightness: number, chroma = base.c) =>
    rgbToHex(oklchToRgb({ l: clamp(lightness), c: clamp(chroma, 0, 0.32), h: base.h }));

const luminance = ({ r, g, b }: RGB) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

const contrastRatio = (first: string, second: string) => {
    const a = parseHex(first);
    const b = parseHex(second);
    if (!a || !b) return 1;
    const light = Math.max(luminance(a), luminance(b));
    const dark = Math.min(luminance(a), luminance(b));
    return (light + 0.05) / (dark + 0.05);
};

const accessibleForeground = (background: string) =>
    contrastRatio(background, '#FFFFFF') >= contrastRatio(background, '#111214') ? '#FFFFFF' : '#111214';

const adjustForForeground = (base: OKLCH, foreground: string, minimumContrast: number, direction: number) => {
    let lightness = clamp(base.l);
    for (let index = 0; index < 24; index += 1) {
        const color = oklchColor(base, lightness);
        if (contrastRatio(color, foreground) >= minimumContrast) return color;
        lightness = clamp(lightness + direction * 0.025);
    }
    return oklchColor(base, direction < 0 ? 0.32 : 0.72, Math.min(base.c, 0.18));
};

export const getFresnicaThemeAdjustment = (primaryColor: string, mode: FresnicaThemeMode): FresnicaThemeAdjustment => {
    const inputColor = normalizeThemeColor(primaryColor) ?? DEFAULT_PRIMARY_COLOR;
    const base = rgbToOklch(parseHex(inputColor)!);
    const effectivePrimaryColor = adjustForForeground(
        base,
        mode === 'light' ? '#FFFFFF' : '#111214',
        4.5,
        mode === 'light' ? -1 : 1
    );
    const onPrimaryColor = accessibleForeground(effectivePrimaryColor);

    return {
        inputColor,
        effectivePrimaryColor,
        onPrimaryColor,
        contrastRatio: Number(contrastRatio(effectivePrimaryColor, onPrimaryColor).toFixed(2)),
        adjusted: effectivePrimaryColor !== inputColor,
        mode,
    };
};

export const deriveFresnicaThemeTokens = (primaryColor: string, mode: FresnicaThemeMode): FresnicaThemeTokens => {
    const adjustment = getFresnicaThemeAdjustment(primaryColor, mode);
    const { inputColor: normalized, effectivePrimaryColor: primary, onPrimaryColor: onPrimary } = adjustment;
    const base = rgbToOklch(parseHex(normalized)!);
    const primaryBase = rgbToOklch(parseHex(primary)!);
    const hover = oklchColor(primaryBase, primaryBase.l + (mode === 'light' ? -0.045 : 0.045));
    const active = oklchColor(primaryBase, primaryBase.l + (mode === 'light' ? -0.085 : -0.035));
    const containerLightness = mode === 'light' ? 0.95 : 0.24;
    const container = oklchColor(base, containerLightness, Math.min(base.c * 0.48, 0.08));
    const onContainer = oklchColor(base, mode === 'light' ? 0.32 : 0.84, Math.min(base.c * 0.8, 0.14));

    return {
        'primary-color': primary,
        'primary-color-hover': hover,
        'primary-color-active': active,
        'primary-color-bg': container,
        'on-primary-color': onPrimary,
        'on-primary-container-color': onContainer,
        'border-color-hover': primary,
        'focus-color': primary,
    };
};

export const FRESNICA_THEME_VARIABLES = Object.keys(deriveFresnicaThemeTokens(DEFAULT_PRIMARY_COLOR, 'light'));

export const applyFresnicaTheme = (
    target: HTMLElement,
    snapshot: FresnicaThemeSnapshot,
    applyCustomTokens = snapshot.customized
) => {
    target.dataset.theme = snapshot.mode;
    target.classList.toggle('dark', snapshot.mode === 'dark');
    target.style.colorScheme = snapshot.mode;
    FRESNICA_THEME_VARIABLES.forEach((name) => target.style.removeProperty(`--Fresnica-${name}`));
    if (applyCustomTokens) {
        const tokens = deriveFresnicaThemeTokens(snapshot.primaryColor, snapshot.mode);
        Object.entries(tokens).forEach(([name, value]) => target.style.setProperty(`--Fresnica-${name}`, value));
    }
};
