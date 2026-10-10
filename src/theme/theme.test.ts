import { describe, expect, it } from 'vitest';
import {
    DEFAULT_PRIMARY_COLOR,
    deriveFresnicaThemeTokens,
    getFresnicaThemeAdjustment,
    normalizeThemeColor,
    applyFresnicaTheme,
} from './theme';

describe('Fresnica custom theme tokens', () => {
    it('normalizes valid HEX values and rejects invalid input', () => {
        expect(normalizeThemeColor('#abc')).toBe('#AABBCC');
        expect(normalizeThemeColor('00a875')).toBe('#00A875');
        expect(normalizeThemeColor('not-a-color')).toBeNull();
    });

    it('generates primary tokens without changing financial semantic tokens', () => {
        const light = deriveFresnicaThemeTokens('#6BCB77', 'light');
        const dark = deriveFresnicaThemeTokens('#6BCB77', 'dark');
        expect(normalizeThemeColor('#6BCB77')).toBe('#6BCB77');
        expect(light['primary-color']).not.toBe(DEFAULT_PRIMARY_COLOR);
        expect(light['on-primary-color']).toMatch(/^#(?:FFFFFF|111214)$/);
        expect(dark['primary-color']).not.toBe(light['primary-color']);
        expect(Object.keys(light)).not.toContain('success-color');
        expect(Object.keys(light)).not.toContain('failure-color');
    });

    it.each(['#00A875', '#6BCB77'])(
        'keeps custom green filled controls on pure white foreground in light and dark: %s',
        (green) => {
            (['light', 'dark'] as const).forEach((mode) => {
                const tokens = deriveFresnicaThemeTokens(green, mode);
                expect(tokens['on-primary-color']).toBe('#FFFFFF');
                expect(tokens['primary-color']).toMatch(/^#[0-9A-F]{6}$/);
                expect(tokens['primary-color-hover']).toMatch(/^#[0-9A-F]{6}$/);
                expect(tokens['primary-color-active']).toMatch(/^#[0-9A-F]{6}$/);
                expect(tokens['primary-color-hover']).not.toBe(tokens['primary-color']);
                expect(tokens['primary-color-active']).not.toBe(tokens['primary-color']);
            });
        }
    );

    it('keeps adaptive foreground behavior for non-green custom primaries', () => {
        const yellow = deriveFresnicaThemeTokens('#F6C65B', 'dark');
        expect(yellow['on-primary-color']).toBe('#111214');
    });

    it('does not replace frozen default brand tokens with inline custom tokens', () => {
        const target = document.createElement('div');

        applyFresnicaTheme(target, {
            primaryColor: DEFAULT_PRIMARY_COLOR,
            mode: 'dark',
            customized: false,
        });

        expect(target.dataset.theme).toBe('dark');
        expect(target.style.getPropertyValue('--Fresnica-primary-color')).toBe('');
        expect(target.style.getPropertyValue('--Fresnica-on-primary-color')).toBe('');
    });

    it('reports when a selected color needs WCAG AA adjustment', () => {
        const adjustment = getFresnicaThemeAdjustment('#FFFFFF', 'light');

        expect(adjustment.inputColor).toBe('#FFFFFF');
        expect(adjustment.adjusted).toBe(true);
        expect(adjustment.effectivePrimaryColor).not.toBe(adjustment.inputColor);
        expect(adjustment.contrastRatio).toBeGreaterThanOrEqual(4.5);
    });
});
