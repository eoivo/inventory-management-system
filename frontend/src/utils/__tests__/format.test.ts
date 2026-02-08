import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber } from '../format';

describe('format utils', () => {
    describe('formatCurrency', () => {
        it('should format numbers correctly to BRL', () => {
            expect(formatCurrency(100)).toBe('R$ 100,00');
            expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
            expect(formatCurrency(0)).toBe('R$ 0,00');
        });

        it('should handle string inputs', () => {
            expect(formatCurrency('100')).toBe('R$ 100,00');
            expect(formatCurrency('1234.56')).toBe('R$ 1.234,56');
        });

        it('should return R$ 0,00 for invalid inputs', () => {
            expect(formatCurrency('invalid')).toBe('R$ 0,00');
            expect(formatCurrency(NaN)).toBe('R$ 0,00');
        });
    });

    describe('formatNumber', () => {
        it('should format numbers correctly', () => {
            expect(formatNumber(100)).toBe('100,00');
            expect(formatNumber(1234.567, 2)).toBe('1.234,57');
            expect(formatNumber(1234.567, 3)).toBe('1.234,567');
        });

        it('should handle string inputs', () => {
            expect(formatNumber('100')).toBe('100,00');
            expect(formatNumber('1234.56')).toBe('1.234,56');
        });

        it('should return 0,00 for invalid inputs', () => {
            expect(formatNumber('invalid')).toBe('0,00');
            expect(formatNumber(NaN)).toBe('0,00');
        });

        it('should handle custom decimal places', () => {
            expect(formatNumber(10, 0)).toBe('10');
            expect(formatNumber(10.5, 1)).toBe('10,5');
        });
    });
});
