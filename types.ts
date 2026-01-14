export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  SNACK = 'Snack',
  DINNER = 'Dinner'
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface Client {
  id: string;
  name: string;
  initials: string;
  goal: string;
  targetCalories: number;
  lastCheckIn: string;
  status: 'Active' | 'Pending' | 'Paused';
}

export interface FoodItem {
  id: string;
  name: string;
  // Current calculated values for the assigned portion
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  
  // Display info
  servingSize: string; // Original text description e.g. "1 medium"
  
  // Portion tracking
  unit: string;        // e.g., 'g', 'ml', 'piece', 'cup', 'oz'
  amount: number;      // e.g., 150, 10, 1
  
  // Base values for recalculation (optional, useful for editing later)
  baseUnit?: string;
  baseAmount?: number;
  baseCalories?: number;
  
  category?: string;
}

export interface DietPlan {
  [MealType.BREAKFAST]: FoodItem[];
  [MealType.LUNCH]: FoodItem[];
  [MealType.SNACK]: FoodItem[];
  [MealType.DINNER]: FoodItem[];
}

export type WeeklyDietPlan = {
  [key in DayOfWeek]: DietPlan;
};

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}