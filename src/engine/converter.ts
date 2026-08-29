import { CategoryDefinition, ConversionResult, FormatOptions, FormulaExplanation, UnitDefinition } from './types';
import { formatNumber } from './formatter';
import { getCategoryById } from '../units';

/**
 * Perform unit conversion between two units in the same category
 */
export function convertUnits(
  input: number | string,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
  options?: Partial<FormatOptions>
): ConversionResult {
  const category = getCategoryById(fromUnit.category) || {
    id: fromUnit.category,
    name: fromUnit.category,
    group: 'Basic',
    iconName: 'Ruler',
    description: '',
    baseUnitId: fromUnit.id,
    units: [fromUnit, toUnit],
  };

  // If same unit
  if (fromUnit.id === toUnit.id) {
    const formatted = typeof input === 'number' ? formatNumber(input, options) : String(input);
    return {
      input,
      output: input,
      formattedOutput: formatted,
      fromUnit,
      toUnit,
      category,
      explanation: {
        formula: `1 ${fromUnit.symbol} = 1 ${toUnit.symbol}`,
        steps: ['Source and target units are identical (Identity conversion).'],
        unitRatioText: `1 ${fromUnit.symbol} = 1 ${toUnit.symbol}`,
        directFactor: 1,
      },
    };
  }

  // 1. Convert input to category base unit
  let baseValue: number | string;

  if (fromUnit.customFromUnit) {
    baseValue = fromUnit.customFromUnit(input);
  } else {
    const numInput = typeof input === 'number' ? input : Number(input);
    const offset = fromUnit.offset || 0;
    const factor = fromUnit.factor ?? 1;
    baseValue = (numInput + offset) * factor;
  }

  // 2. Convert base unit value to target unit
  let targetValue: number | string;

  if (toUnit.customToUnit) {
    targetValue = toUnit.customToUnit(baseValue);
  } else {
    const numBase = typeof baseValue === 'number' ? baseValue : Number(baseValue);
    const factor = toUnit.factor ?? 1;
    const offset = toUnit.offset || 0;
    targetValue = numBase / factor - offset;
  }

  // 3. Format output
  const formattedOutput = formatNumber(targetValue, options);

  // 4. Generate step-by-step formula explanation
  const explanation = generateExplanation(input, baseValue, targetValue, formattedOutput, fromUnit, toUnit, category);

  return {
    input,
    output: targetValue,
    formattedOutput,
    fromUnit,
    toUnit,
    category,
    explanation,
  };
}

/**
 * Generate formula explanation and derivation steps
 */
function generateExplanation(
  input: number | string,
  baseValue: number | string,
  _targetValue: number | string,
  formattedOutput: string,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
  category: CategoryDefinition
): FormulaExplanation {
  const fromSym = fromUnit.symbol || fromUnit.name;
  const toSym = toUnit.symbol || toUnit.name;

  // Temperature specific explanations
  if (category.id === 'temperature') {
    return generateTemperatureExplanation(input, formattedOutput, fromUnit, toUnit);
  }

  // Numeral systems specific explanations
  if (category.id === 'numeral_systems') {
    return {
      formula: `Convert Radix: ${fromUnit.name} → Base 10 Integer → ${toUnit.name}`,
      steps: [
        `Step 1: Parse input "${input}" from ${fromUnit.name} into decimal integer ${baseValue}.`,
        `Step 2: Format decimal integer ${baseValue} into ${toUnit.name} representation "${formattedOutput}".`,
      ],
      unitRatioText: `${input} (${fromSym}) = ${formattedOutput} (${toSym})`,
    };
  }

  // Fuel economy explanations (reciprocal L/100km)
  if (category.id === 'fuel_economy') {
    if (fromUnit.id === 'liters_per_100km' && toUnit.id === 'mpg_us') {
      return {
        formula: `mpg (US) = 235.214583 ÷ (L/100km)`,
        steps: [
          `Reciprocal conversion for fuel consumption:`,
          `235.214583 ÷ ${input} = ${formattedOutput} mpg (US)`,
        ],
        unitRatioText: `100 L/100km = 2.352 mpg (US)`,
      };
    }
    if (fromUnit.id === 'mpg_us' && toUnit.id === 'liters_per_100km') {
      return {
        formula: `L/100km = 235.214583 ÷ (mpg US)`,
        steps: [
          `Reciprocal conversion for fuel consumption:`,
          `235.214583 ÷ ${input} = ${formattedOutput} L/100km`,
        ],
        unitRatioText: `1 mpg (US) = 235.215 L/100km`,
      };
    }
  }

  // Standard Linear Conversions
  if (fromUnit.factor !== undefined && toUnit.factor !== undefined) {
    const directFactor = fromUnit.factor / toUnit.factor;
    const formattedFactor = formatNumber(directFactor, { mode: 'auto' });
    const formattedBase = formatNumber(baseValue, { mode: 'auto' });

    const formula = `Value (${toSym}) = Value (${fromSym}) × ${formattedFactor}`;
    const steps = [
      `1 ${fromSym} = ${formattedFactor} ${toSym}`,
      `Calculation: ${input} × ${formattedFactor} = ${formattedOutput} ${toSym}`,
    ];

    if (fromUnit.id !== category.baseUnitId && toUnit.id !== category.baseUnitId) {
      const baseUnit = category.units.find((u) => u.id === category.baseUnitId);
      const baseSym = baseUnit?.symbol || category.baseUnitId;
      steps.push(
        `Underlying SI Steps:`,
        `• ${input} ${fromSym} × ${formatNumber(fromUnit.factor, { mode: 'auto' })} = ${formattedBase} ${baseSym}`,
        `• ${formattedBase} ${baseSym} ÷ ${formatNumber(toUnit.factor, { mode: 'auto' })} = ${formattedOutput} ${toSym}`
      );
    }

    return {
      formula,
      steps,
      unitRatioText: `1 ${fromSym} = ${formattedFactor} ${toSym}`,
      directFactor,
    };
  }

  return {
    formula: `Conversion using validated category model`,
    steps: [`Calculated ${input} ${fromSym} = ${formattedOutput} ${toSym}`],
    unitRatioText: `1 ${fromSym} ≈ ${formattedOutput} ${toSym}`,
  };
}

/**
 * Generate accurate step-by-step formula for temperature
 */
function generateTemperatureExplanation(
  input: number | string,
  formattedOutput: string,
  from: UnitDefinition,
  to: UnitDefinition
): FormulaExplanation {
  const num = Number(input);

  if (from.id === 'celsius' && to.id === 'fahrenheit') {
    return {
      formula: `°F = (°C × 9/5) + 32`,
      steps: [
        `Step 1: Multiply by 9/5 (1.8): ${num} × 1.8 = ${formatNumber(num * 1.8, { mode: 'auto' })}`,
        `Step 2: Add 32: ${formatNumber(num * 1.8, { mode: 'auto' })} + 32 = ${formattedOutput} °F`,
      ],
      unitRatioText: `0 °C = 32 °F, 100 °C = 212 °F`,
    };
  }

  if (from.id === 'fahrenheit' && to.id === 'celsius') {
    return {
      formula: `°C = (°F − 32) × 5/9`,
      steps: [
        `Step 1: Subtract 32: ${num} − 32 = ${formatNumber(num - 32, { mode: 'auto' })}`,
        `Step 2: Multiply by 5/9: ${formatNumber(num - 32, { mode: 'auto' })} × (5/9) = ${formattedOutput} °C`,
      ],
      unitRatioText: `32 °F = 0 °C, 212 °F = 100 °C`,
    };
  }

  if (from.id === 'celsius' && to.id === 'kelvin') {
    return {
      formula: `K = °C + 273.15`,
      steps: [`Add standard thermal offset: ${num} + 273.15 = ${formattedOutput} K`],
      unitRatioText: `0 °C = 273.15 K`,
    };
  }

  if (from.id === 'kelvin' && to.id === 'celsius') {
    return {
      formula: `°C = K − 273.15`,
      steps: [`Subtract thermal offset: ${num} − 273.15 = ${formattedOutput} °C`],
      unitRatioText: `273.15 K = 0 °C`,
    };
  }

  if (from.id === 'fahrenheit' && to.id === 'kelvin') {
    const c = (num - 32) * (5 / 9);
    return {
      formula: `K = (°F − 32) × 5/9 + 273.15`,
      steps: [
        `Step 1: Convert to Celsius: (${num} − 32) × 5/9 = ${formatNumber(c, { mode: 'auto' })} °C`,
        `Step 2: Add Kelvin offset: ${formatNumber(c, { mode: 'auto' })} + 273.15 = ${formattedOutput} K`,
      ],
      unitRatioText: `32 °F = 273.15 K`,
    };
  }

  if (from.id === 'kelvin' && to.id === 'fahrenheit') {
    const c = num - 273.15;
    return {
      formula: `°F = (K − 273.15) × 9/5 + 32`,
      steps: [
        `Step 1: Convert to Celsius: ${num} − 273.15 = ${formatNumber(c, { mode: 'auto' })} °C`,
        `Step 2: Convert to Fahrenheit: (${formatNumber(c, { mode: 'auto' })} × 1.8) + 32 = ${formattedOutput} °F`,
      ],
      unitRatioText: `273.15 K = 32 °F`,
    };
  }

  return {
    formula: `Standard temperature transformation scale`,
    steps: [`Calculated ${input} ${from.symbol} = ${formattedOutput} ${to.symbol}`],
    unitRatioText: `${input} ${from.symbol} = ${formattedOutput} ${to.symbol}`,
  };
}

/**
 * Convert a value into all other units in the category
 */
export function convertToAllUnits(
  input: number | string,
  fromUnit: UnitDefinition,
  category: CategoryDefinition,
  options?: Partial<FormatOptions>
): { unit: UnitDefinition; value: number | string; formatted: string; isSource: boolean }[] {
  return category.units.map((unit) => {
    const result = convertUnits(input, fromUnit, unit, options);
    return {
      unit,
      value: result.output,
      formatted: result.formattedOutput,
      isSource: unit.id === fromUnit.id,
    };
  });
}
