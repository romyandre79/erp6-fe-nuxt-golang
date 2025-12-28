import { ref, watch, onMounted } from 'vue';

export interface TablePreferences {
  sortBy: string;
  sortDir: 'asc' | 'desc';
  pageSize: number;
  columnFilters: Record<string, string>;
  hiddenColumns: string[];
  columnWidths: Record<string, number>;
  frozenColumns: string[];
  groupByColumns: string[];
  expandedGroups: string[];
}

const STORAGE_PREFIX = 'table_prefs_';

/**
 * Composable to persist table preferences (sort, filters, pageSize, columns) to localStorage
 * @param tableId - Unique identifier for the table (e.g., endpoint name or menu slug)
 */
export function useTablePreferences(tableId: string) {
  const storageKey = STORAGE_PREFIX + tableId.replace(/[^a-zA-Z0-9]/g, '_');

  // Load preferences from localStorage
  const loadPreferences = (): Partial<TablePreferences> => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load table preferences:', e);
    }
    return {};
  };

  // Save preferences to localStorage
  const savePreferences = (prefs: Partial<TablePreferences>) => {
    if (typeof window === 'undefined') return;
    try {
      // Merge with existing to avoid losing data
      const existing = loadPreferences();
      const merged = { ...existing, ...prefs };
      localStorage.setItem(storageKey, JSON.stringify(merged));
    } catch (e) {
      console.warn('Failed to save table preferences:', e);
    }
  };

  // Clear preferences for this table
  const clearPreferences = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Failed to clear table preferences:', e);
    }
  };

  return {
    loadPreferences,
    savePreferences,
    clearPreferences,
  };
}
