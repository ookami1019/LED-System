import { describe, it, expect } from 'vitest';
import { calculateFovAndCrop, calculateDoF } from '../math';

describe('math.ts', () => {
  describe('calculateFovAndCrop', () => {
    it('should calculate FoV correctly without crop (original)', () => {
      // 50mm, Full Frame (36x24)
      const result = calculateFovAndCrop(50, 36, 24, 'original', 16, 9);
      
      expect(result.targetRatioStr).toBe('Original');
      expect(result.ew).toBe(36);
      expect(result.eh).toBe(24);
      
      // FoV = 2 * atan(d / 2f)
      // hFov: 2 * atan(36 / 100) * 180 / PI = 39.59
      // vFov: 2 * atan(24 / 100) * 180 / PI = 26.99
      expect(result.hFov).toBeCloseTo(39.59, 1);
      expect(result.vFov).toBeCloseTo(26.99, 1);
      expect(result.dFov).toBeCloseTo(46.79, 1);
    });

    it('should calculate FoV correctly with 16:9 crop on Full Frame', () => {
      // 50mm, Full Frame (36x24) -> 16:9 crop
      const result = calculateFovAndCrop(50, 36, 24, '16:9', 16, 9);
      
      expect(result.targetRatioStr).toBe('16:9');
      expect(result.ew).toBe(36);
      // eh will be cropped because 36/24 (1.5) < 16/9 (1.77)
      // eh = 36 / (16/9) = 20.25
      expect(result.eh).toBe(20.25);
      
      expect(result.hFov).toBeCloseTo(39.59, 1);
      expect(result.vFov).toBeCloseTo(22.89, 1);
    });

    it('should calculate FoV correctly with custom crop', () => {
      const result = calculateFovAndCrop(50, 36, 24, 'custom', 1, 1);
      
      expect(result.targetRatioStr).toBe('1.00:1');
      // 1:1 crop -> 36/24 (1.5) > 1 -> crop width
      // ew = 24 * 1 = 24
      expect(result.ew).toBe(24);
      expect(result.eh).toBe(24);
      
      expect(result.hFov).toBeCloseTo(26.99, 1);
      expect(result.vFov).toBeCloseTo(26.99, 1);
    });
  });

  describe('calculateDoF', () => {
    it('should calculate DoF correctly for standard settings', () => {
      // 50mm, F2.8, 5m, Full Frame (36x24)
      const result = calculateDoF(50, 2.8, 5, 36, 24);
      
      // CoC for full frame = sqrt(36^2 + 24^2) / 1500 = 0.02884mm
      // Hyperfocal = 50^2 / (2.8 * 0.02884) + 50 = 30999mm = 31.0m
      expect(result.hyperfocalM).toBeCloseTo(31.0, 1);
      
      expect(result.nearLimitM).toBeLessThan(5);
      expect(result.farLimitM).toBeGreaterThan(5);
      expect(result.totalDoFM).toBeGreaterThan(0);
      expect(result.frontBokeM).toBe(5 - result.nearLimitM);
      expect(result.rearBokeM).toBe(result.farLimitM - 5);
    });

    it('should return infinity for far limit when focus distance is >= hyperfocal distance', () => {
      // 35mm, F8, 10m, Full Frame
      // Hyperfocal for 35mm F8 is around 5.3m
      const result = calculateDoF(35, 8, 10, 36, 24);
      
      expect(result.hyperfocalM).toBeCloseTo(5.3, 1);
      expect(10).toBeGreaterThan(result.hyperfocalM);
      expect(result.farLimitM).toBe(Infinity);
      expect(result.totalDoFM).toBe(Infinity);
      expect(result.rearBokeM).toBe(Infinity);
    });
  });
});
