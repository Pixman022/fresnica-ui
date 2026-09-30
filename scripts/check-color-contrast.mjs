import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const variablesSource = fs.readFileSync(path.join(root, 'src/styles/variables.less'), 'utf8');
const themeSource = fs.readFileSync(path.join(root, 'src/styles/themes/default.less'), 'utf8');

const lessVariables = new Map(
    [...variablesSource.matchAll(/^\s*(@[\w-]+)\s*:\s*([^;]+);/gm)].map(([, name, value]) => [name, value.trim()])
);

const resolveLessValue = (value) => value.replace(/@[\w-]+/g, (name) => lessVariables.get(name) ?? name).trim();

const readThemeBlock = (source) =>
    Object.fromEntries(
        [...source.matchAll(/(--Fresnica-[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
            name,
            resolveLessValue(value),
        ])
    );

const lightEnd = themeSource.indexOf("[data-theme='dark']");
const light = readThemeBlock(lightEnd >= 0 ? themeSource.slice(0, lightEnd) : themeSource);
const dark = readThemeBlock(lightEnd >= 0 ? themeSource.slice(lightEnd) : '');

const parseColor = (input) => {
    const value = input.trim().toLowerCase();
    if (value === 'transparent') return [0, 0, 0, 0];
    if (value === 'white') return [255, 255, 255, 1];
    if (value === 'black') return [0, 0, 0, 1];
    if (/^#[0-9a-f]{3,8}$/i.test(value)) {
        const hex = value.slice(1);
        const expanded = hex.length <= 4 ? [...hex].map((part) => part + part).join('') : hex;
        const channels = [0, 2, 4].map((offset) => Number.parseInt(expanded.slice(offset, offset + 2), 16));
        const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;
        return [...channels, alpha];
    }
    const match = value.match(/^rgba?\(([^)]+)\)$/);
    if (!match) throw new Error(`Unsupported color value: ${input}`);
    const parts = match[1].split(',').map((part) => part.trim());
    const channels = parts
        .slice(0, 3)
        .map((part) => (part.endsWith('%') ? (Number.parseFloat(part) / 100) * 255 : Number.parseFloat(part)));
    const alpha = parts[3] === undefined ? 1 : Number.parseFloat(parts[3]);
    return [...channels, alpha];
};

const composite = (foreground, background) => {
    const alpha = foreground[3] + background[3] * (1 - foreground[3]);
    if (alpha === 0) return [0, 0, 0, 0];
    return [0, 1, 2]
        .map(
            (index) =>
                (foreground[index] * foreground[3] + background[index] * background[3] * (1 - foreground[3])) / alpha
        )
        .concat(alpha);
};

const luminance = ([red, green, blue]) => {
    const linearize = (channel) => {
        const normalized = channel / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
};

const contrast = (foreground, background) => {
    const foregroundLuminance = luminance(composite(parseColor(foreground), parseColor(background)));
    const backgroundLuminance = luminance(parseColor(background));
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);
    return (lighter + 0.05) / (darker + 0.05);
};

const checks = [
    ['content-primary/background', '--Fresnica-text-color', '--Fresnica-bg-color', 4.5],
    ['content-secondary/background', '--Fresnica-text-color-secondary', '--Fresnica-bg-color', 4.5],
    ['content-primary/surface', '--Fresnica-text-color', '--Fresnica-surface', 4.5],
    ['content-secondary/surface', '--Fresnica-text-color-secondary', '--Fresnica-surface', 4.5],
    [
        'on-primary-container/primary-container',
        '--Fresnica-on-primary-container-color',
        '--Fresnica-primary-color-bg',
        4.5,
    ],
    [
        'on-success-container/success-container',
        '--Fresnica-on-success-container-color',
        '--Fresnica-success-color-bg',
        4.5,
    ],
    [
        'on-failure-container/failure-container',
        '--Fresnica-on-failure-container-color',
        '--Fresnica-failure-color-bg',
        4.5,
    ],
    [
        'on-warning-container/warning-container',
        '--Fresnica-on-warning-container-color',
        '--Fresnica-warning-color-bg',
        4.5,
    ],
];

const failures = [];
for (const [mode, theme] of Object.entries({ light, dark })) {
    for (const [name, foregroundToken, backgroundToken, minimum] of checks) {
        const foreground = theme[foregroundToken];
        const background = theme[backgroundToken];
        if (!foreground || !background) {
            failures.push(`${mode} ${name}: missing ${foregroundToken} or ${backgroundToken}`);
            continue;
        }
        const ratio = contrast(foreground, background);
        console.log(`${mode} ${name}: ${ratio.toFixed(2)}:1 (minimum ${minimum.toFixed(1)}:1)`);
        if (ratio < minimum) failures.push(`${mode} ${name}: ${ratio.toFixed(2)}:1 < ${minimum.toFixed(1)}:1`);
    }
}

if (failures.length) {
    console.error('\nColor contrast check failed:');
    console.error(failures.map((failure) => `  - ${failure}`).join('\n'));
    process.exitCode = 1;
} else {
    console.log('\nColor contrast checks passed for reviewed text/container pairs.');
}
