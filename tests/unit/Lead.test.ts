import { describe, it, expect } from 'vitest';
import { calculateDistressScore } from '../../src/utils/calculations';

describe('Lead Utils', () => {
  it('should calculate distress score correctly', () => {
    const indicators = {
      overgrownLawn: true,
      boardedWindows: true,
      roofDamage: false,
      peelingPaint: false,
      brokenFences: false,
      forSaleSign: false,
      codeViolations: false,
      other: []
    };
    
    expect(calculateDistressScore(indicators)).toBe(29); // 2/7 * 100
  });
});
