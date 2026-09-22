import { describe, expect, it } from 'vitest';
import {
    DEFAULT_PRIMARY_COLOR,
    deriveFresnicaThemeTokens,
    getFresnicaThemeAdjustment,
    normalizeThemeColor,
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

    it('reports when a selected color needs WCAG AA adjustment', () => {
        const adjustment = getFresnicaThemeAdjustment('#FFFFFF', 'light');

        expect(adjustment.inputColor).toBe('#FFFFFF');
        expect(adjustment.adjusted).toBe(true);
        expect(adjustment.effectivePrimaryColor).not.toBe(adjustment.inputColor);
        expect(adjustment.contrastRatio).toBeGreaterThanOrEqual(4.5);
    });
});
