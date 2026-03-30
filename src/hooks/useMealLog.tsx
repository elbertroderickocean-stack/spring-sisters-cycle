import { useState, useEffect, useCallback } from 'react';

export interface MealNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface MealLogEntry {
  id: string;
  timestamp: string;
  foodName: string;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  skinImpact: string;
  recommendation: string;
  nutrients: MealNutrients;
  imagePreview?: string; // small thumbnail base64
}

const STORAGE_KEY = 'meanwhile_meal_log';
const MAX_ENTRIES = 50;

export const useMealLog = () => {
  const [entries, setEntries] = useState<MealLogEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load meal log:', e);
    }
  }, []);

  const persist = (updated: MealLogEntry[]) => {
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save meal log:', e);
    }
  };

  const addEntry = useCallback((entry: Omit<MealLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: MealLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setEntries(prev => {
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save meal log:', e);
      }
      return updated;
    });
    return newEntry;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  const clearLog = useCallback(() => {
    persist([]);
  }, []);

  const todayEntries = entries.filter(e => {
    const entryDate = new Date(e.timestamp).toDateString();
    return entryDate === new Date().toDateString();
  });

  const todayNutrients: MealNutrients = todayEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.nutrients?.calories || 0),
      protein: acc.protein + (e.nutrients?.protein || 0),
      carbs: acc.carbs + (e.nutrients?.carbs || 0),
      fat: acc.fat + (e.nutrients?.fat || 0),
      fiber: acc.fiber + (e.nutrients?.fiber || 0),
      sugar: acc.sugar + (e.nutrients?.sugar || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );

  return {
    entries,
    todayEntries,
    todayNutrients,
    addEntry,
    removeEntry,
    clearLog,
  };
};
