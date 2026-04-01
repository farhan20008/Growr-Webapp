import { useState, useCallback, useEffect } from 'react';
import { MealEntry, WaterEntry, Exercise, defaultMeals, workoutPlan, userProfile } from '@/data/mockData';
import { getOnboardingProfile } from '@/pages/OnboardingPage';

const STORAGE_KEY = 'growr-data';

interface AppState {
  meals: MealEntry[];
  waterEntries: WaterEntry[];
  workoutState: Record<string, number[]>;
  profile: typeof userProfile;
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  const onboarding = getOnboardingProfile();
  const profile = {
    ...userProfile,
    ...(onboarding ? {
      name: onboarding.name,
      currentWeight: onboarding.currentWeight,
      calorieGoal: onboarding.calorieGoal,
      proteinGoal: onboarding.proteinGoal ?? userProfile.proteinGoal,
    } : {}),
  };

  return {
    meals: defaultMeals,
    waterEntries: [
      { amount: 250, timestamp: new Date().toISOString() },
      { amount: 250, timestamp: new Date().toISOString() },
      { amount: 500, timestamp: new Date().toISOString() },
      { amount: 250, timestamp: new Date().toISOString() },
      { amount: 250, timestamp: new Date().toISOString() },
    ],
    workoutState: {},
    profile,
  };
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMeal = useCallback((meal: MealEntry) => {
    setState(prev => ({ ...prev, meals: [...prev.meals, meal] }));
  }, []);

  const removeMeal = useCallback((id: string) => {
    setState(prev => ({ ...prev, meals: prev.meals.filter(m => m.id !== id) }));
  }, []);

  const addWater = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      waterEntries: [...prev.waterEntries, { amount, timestamp: new Date().toISOString() }],
    }));
  }, []);

  const toggleSet = useCallback((exerciseId: string, setIndex: number) => {
    setState(prev => {
      const current = prev.workoutState[exerciseId] || [];
      const updated = current.includes(setIndex)
        ? current.filter(s => s !== setIndex)
        : [...current, setIndex];
      return { ...prev, workoutState: { ...prev.workoutState, [exerciseId]: updated } };
    });
  }, []);

  const totalCalories = state.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = state.meals.reduce((sum, m) => sum + m.protein, 0);
  const totalWater = state.waterEntries.reduce((sum, w) => sum + w.amount, 0);

  const getMealsByType = useCallback((type: MealEntry['mealType']) => {
    return state.meals.filter(m => m.mealType === type);
  }, [state.meals]);

  return {
    ...state,
    addMeal,
    removeMeal,
    addWater,
    toggleSet,
    totalCalories,
    totalProtein,
    totalWater,
    getMealsByType,
  };
}
