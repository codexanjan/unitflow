import { CategoryDefinition, UnitDefinition } from '../engine/types';
import { basicCategories } from './basic';
import { physicsCategories } from './physics';
import { electricalCategories } from './electrical';
import { dataCategories } from './data';
import { lightSoundCategories } from './lightSound';
import { specializedCategories } from './specialized';

export const allCategories: CategoryDefinition[] = [
  ...basicCategories,
  ...physicsCategories,
  ...electricalCategories,
  ...dataCategories,
  ...lightSoundCategories,
  ...specializedCategories,
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): CategoryDefinition | undefined {
  return allCategories.find((c) => c.id === id);
}

/**
 * Get unit by category ID and unit ID
 */
export function getUnitById(categoryId: string, unitId: string): UnitDefinition | undefined {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  return category.units.find((u) => u.id === unitId);
}

/**
 * Search units across all categories with fuzzy matching and scoring
 */
export interface UnitSearchResult {
  category: CategoryDefinition;
  unit: UnitDefinition;
  score: number; // Lower is better match
  matchType: 'symbol-exact' | 'name-exact' | 'id-exact' | 'symbol-starts' | 'name-starts' | 'alias' | 'category' | 'partial';
}

export function searchUnitsGlobally(rawQuery: string): UnitSearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const results: UnitSearchResult[] = [];

  for (const category of allCategories) {
    const categoryNameMatch = category.name.toLowerCase().includes(query);

    for (const unit of category.units) {
      const uId = unit.id.toLowerCase();
      const uName = unit.name.toLowerCase();
      const uSymbol = unit.symbol.toLowerCase();
      const aliases = unit.aliases.map((a) => a.toLowerCase());

      // 1. Exact symbol match (Highest priority)
      if (uSymbol === query) {
        results.push({ category, unit, score: 1, matchType: 'symbol-exact' });
        continue;
      }

      // 2. Exact id or name match
      if (uId === query || uName === query) {
        results.push({ category, unit, score: 2, matchType: 'name-exact' });
        continue;
      }

      // 3. Exact alias match
      if (aliases.includes(query)) {
        results.push({ category, unit, score: 3, matchType: 'alias' });
        continue;
      }

      // 4. Starts with symbol
      if (uSymbol.startsWith(query)) {
        results.push({ category, unit, score: 4, matchType: 'symbol-starts' });
        continue;
      }

      // 5. Starts with name or id
      if (uName.startsWith(query) || uId.startsWith(query)) {
        results.push({ category, unit, score: 5, matchType: 'name-starts' });
        continue;
      }

      // 6. Name contains query
      if (uName.includes(query)) {
        results.push({ category, unit, score: 6, matchType: 'partial' });
        continue;
      }

      // 7. Any alias starts with or contains
      if (aliases.some((a) => a.startsWith(query) || a.includes(query))) {
        results.push({ category, unit, score: 7, matchType: 'alias' });
        continue;
      }

      // 8. Category name matches
      if (categoryNameMatch) {
        results.push({ category, unit, score: 8, matchType: 'category' });
      }
    }
  }

  // Sort by score ascending
  return results.sort((a, b) => a.score - b.score);
}
