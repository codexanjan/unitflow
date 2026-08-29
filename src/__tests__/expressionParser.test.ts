import { describe, it, expect } from 'vitest';
import { evaluateExpression } from '../engine/expressionParser';

describe('Safe Math Expression Evaluator', () => {
  it('should parse simple integers and floats', () => {
    expect(evaluateExpression('42').value).toBe(42);
    expect(evaluateExpression('3.14159').value).toBe(3.14159);
    expect(evaluateExpression('-17.5').value).toBe(-17.5);
  });

  it('should evaluate addition and subtraction', () => {
    expect(evaluateExpression('25 + 5').value).toBe(30);
    expect(evaluateExpression('100 - 45.5').value).toBe(54.5);
    expect(evaluateExpression('10 - 20 + 5').value).toBe(-5);
  });

  it('should evaluate multiplication and division with precedence', () => {
    expect(evaluateExpression('100 / 2').value).toBe(50);
    expect(evaluateExpression('10 * 3').value).toBe(30);
    expect(evaluateExpression('10 + 5 * 2').value).toBe(20);
    expect(evaluateExpression('100 - 20 / 4').value).toBe(95);
  });

  it('should support alternative math symbols (×, ÷, −)', () => {
    expect(evaluateExpression('10 × 5').value).toBe(50);
    expect(evaluateExpression('100 ÷ 4').value).toBe(25);
    expect(evaluateExpression('50 − 20').value).toBe(30);
  });

  it('should evaluate parentheses and nested groups', () => {
    expect(evaluateExpression('(50 + 25) / 5').value).toBe(15);
    expect(evaluateExpression('((10 + 5) * 2) / 3').value).toBe(10);
    expect(evaluateExpression('2 * (3 + 4 * (2 - 1))').value).toBe(14);
  });

  it('should evaluate power (^) and modulo (%)', () => {
    expect(evaluateExpression('2 ^ 3').value).toBe(8);
    expect(evaluateExpression('10 % 3').value).toBe(1);
    expect(evaluateExpression('2 ^ 3 ^ 2').value).toBe(512); // right-associative: 2^(3^2) = 2^9 = 512
  });

  it('should handle scientific notation literals', () => {
    expect(evaluateExpression('1.5e3').value).toBe(1500);
    expect(evaluateExpression('2e-2').value).toBe(0.02);
    expect(evaluateExpression('1e3 + 500').value).toBe(1500);
  });

  it('should reject division by zero', () => {
    const res = evaluateExpression('100 / 0');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Division by zero');
  });

  it('should reject invalid syntax and unclosed brackets safely', () => {
    expect(evaluateExpression('(50 + 25').success).toBe(false);
    expect(evaluateExpression('50 + * 2').success).toBe(false);
    expect(evaluateExpression('eval("alert(1)")').success).toBe(false);
    expect(evaluateExpression('').success).toBe(false);
  });
});
