import { describe, it, expect } from 'vitest';
import { allCategories } from '../units';
import { convertUnits, convertToAllUnits } from '../engine/converter';

describe('All Categories & Units Integrity Test', () => {
  it('should have unique category IDs', () => {
    const ids = allCategories.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should verify every category has valid baseUnit and units', () => {
    for (const category of allCategories) {
      expect(category.id).toBeTruthy();
      expect(category.name).toBeTruthy();
      expect(category.units.length).toBeGreaterThan(0);

      // Check base unit exists
      const baseUnit = category.units.find((u) => u.id === category.baseUnitId);
      expect(baseUnit, `Category ${category.id} missing baseUnit ${category.baseUnitId}`).toBeDefined();

      // Check all units have matching category id
      for (const unit of category.units) {
        expect(unit.category).toBe(category.id);
        expect(unit.id).toBeTruthy();
        expect(unit.name).toBeTruthy();
        expect(unit.symbol).toBeDefined();

        // Must have factor or custom converter
        const hasFactor = unit.factor !== undefined;
        const hasCustom = !!unit.customFromUnit && !!unit.customToUnit;
        expect(hasFactor || hasCustom, `Unit ${unit.id} in ${category.id} has neither factor nor custom converters`).toBe(true);
      }
    }
  });

  it('should successfully convert standard values across all categories and all unit pairs', () => {
    for (const category of allCategories) {
      const units = category.units;

      for (const fromUnit of units) {
        // Test standard input
        const testInput = category.id === 'numeral_systems'
          ? (fromUnit.id === 'binary' ? '101010' : fromUnit.id === 'hexadecimal' ? '2A' : fromUnit.id === 'roman' ? 'XLII' : '42')
          : 100;

        for (const toUnit of units) {
          const result = convertUnits(testInput, fromUnit, toUnit);
          expect(result).toBeDefined();
          expect(result.formattedOutput).toBeTruthy();
          expect(result.explanation).toBeDefined();
          expect(result.explanation.formula).toBeTruthy();
        }

        // Test convertToAllUnits
        const allResults = convertToAllUnits(testInput, fromUnit, category);
        expect(allResults.length).toBe(units.length);
      }
    }
  });
});
