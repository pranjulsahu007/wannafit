import React, { useState } from 'react';
import { MealType, DietPlan, FoodItem, DailyTargets, WeeklyDietPlan, DayOfWeek, DAYS_OF_WEEK } from './types';
import { FoodSearch } from './components/FoodSearch';
import { MealSection } from './components/MealSection';
import { NutritionSidebar } from './components/NutritionSidebar';
import { TemplateModal } from './components/TemplateModal';
import { ClientAssignmentModal } from './components/ClientAssignmentModal';
import { EditFoodModal } from './components/EditFoodModal';
import { ClientMobileApp } from './components/ClientMobileApp';
import { DietTemplate, SAMPLE_TEMPLATES } from './data/templates';
import { LayoutTemplate, Send, Activity, Save, Smartphone, Menu, User, FilePlus } from 'lucide-react';
import { ClientsListModal } from './components/ClientsListModal';

// Helper for deep copy to ensure fresh state
const createEmptyDailyPlan = (): DietPlan => ({
  [MealType.BREAKFAST]: [],
  [MealType.LUNCH]: [],
  [MealType.SNACK]: [],
  [MealType.DINNER]: [],
});

const createEmptyWeeklyPlan = (): WeeklyDietPlan => ({
  Monday: createEmptyDailyPlan(),
  Tuesday: createEmptyDailyPlan(),
  Wednesday: createEmptyDailyPlan(),
  Thursday: createEmptyDailyPlan(),
  Friday: createEmptyDailyPlan(),
  Saturday: createEmptyDailyPlan(),
  Sunday: createEmptyDailyPlan(),
});

const initialWeeklyPlan = createEmptyWeeklyPlan();

const defaultTargets: DailyTargets = {
  calories: 2200,
  protein: 160,
  carbs: 220,
  fat: 75,
};

// Only Planner and Mobile view remain
type View = 'planner' | 'mobile';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('planner');
  
  // State for Weekly Plan
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyDietPlan>(initialWeeklyPlan);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [activeMeal, setActiveMeal] = useState<MealType>(MealType.BREAKFAST);
  
  // Templates State
  const [templates, setTemplates] = useState<DietTemplate[]>(SAMPLE_TEMPLATES);

  // UI States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateModalView, setTemplateModalView] = useState<'list' | 'create'>('list');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  
  // Edit State
  const [editingFood, setEditingFood] = useState<{food: FoodItem, meal: MealType} | null>(null);

  // --- ACTIONS ---

  const handleAddFood = (food: FoodItem, meal: MealType) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [meal]: [...prev[selectedDay][meal], food],
      }
    }));
  };

  const handleRemoveFood = (foodId: string, meal: MealType) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [meal]: prev[selectedDay][meal].filter((f) => f.id !== foodId),
      }
    }));
  };

  const handleEditFood = (food: FoodItem, meal: MealType) => {
    setEditingFood({ food, meal });
  };

  const handleUpdateFood = (updatedFood: FoodItem) => {
    if (!editingFood) return;
    
    setWeeklyPlan((prev) => ({
        ...prev,
        [selectedDay]: {
            ...prev[selectedDay],
            [editingFood.meal]: prev[selectedDay][editingFood.meal].map((f) => 
                f.id === updatedFood.id ? updatedFood : f
            ),
        }
    }));
    
    setEditingFood(null);
  };

  const handleLoadTemplate = (template: DietTemplate) => {
    // Deep copy the template plan to ensure fresh IDs and no reference issues
    setWeeklyPlan(JSON.parse(JSON.stringify(template.weeklyPlan)));
    setIsTemplateModalOpen(false);
    setCurrentView('planner');
  };

  const handleStartNewDraft = () => {
    setWeeklyPlan(createEmptyWeeklyPlan());
    setIsTemplateModalOpen(false);
    setCurrentView('planner');
    setSelectedDay('Monday');
  };

  const handleCreateTemplate = (name: string, description: string) => {
    // Calculate averages for the template metadata
    let totalCals = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    DAYS_OF_WEEK.forEach(day => {
        Object.values(MealType).forEach(meal => {
            weeklyPlan[day][meal].forEach(food => {
                totalCals += food.calories;
                totalP += food.protein;
                totalC += food.carbs;
                totalF += food.fat;
            });
        });
    });

    // Average per day (rounded)
    const avgCals = Math.round(totalCals / 7);
    const avgP = Math.round(totalP / 7);
    const avgC = Math.round(totalC / 7);
    const avgF = Math.round(totalF / 7);

    const newTemplate: DietTemplate = {
        id: crypto.randomUUID(),
        name,
        description,
        tags: ['Custom', `${avgCals} kcal`],
        totalCalories: avgCals,
        macros: { p: avgP, c: avgC, f: avgF },
        weeklyPlan: JSON.parse(JSON.stringify(weeklyPlan)) // Deep copy current state
    };

    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleOpenImport = () => {
      setTemplateModalView('list');
      setIsTemplateModalOpen(true);
  };

  const handleSavePlan = () => {
      // Open the modal in 'create' mode to save the current plan as a template
      setTemplateModalView('create');
      setIsTemplateModalOpen(true);
  };

  // --- VIEW RENDERING ---
  // If in mobile view, render only the mobile app component
  if (currentView === 'mobile') {
      return <ClientMobileApp weeklyPlan={weeklyPlan} onExit={() => setCurrentView('planner')} />;
  }

  const renderPlanner = () => {
    const currentDietPlan = weeklyPlan[selectedDay];

    return (
      <div className="animate-in fade-in duration-300">
         {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Diet Plan Editor</h1>
                <p className="text-slate-500">Drafting a new plan • <span className="text-emerald-600">Unassigned</span></p>
            </div>
            <div className="flex gap-3">
                <button 
                    id="save-btn"
                    onClick={handleSavePlan}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 min-w-[100px] justify-center"
                >
                    <Save size={16} /> Save as Template
                </button>
                <button 
                    onClick={handleOpenImport}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                    <LayoutTemplate size={16} /> Import
                </button>
                <button 
                    onClick={() => setIsAssignmentModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 flex items-center gap-2"
                >
                    <Send size={16} /> Assign to Client
                </button>
            </div>
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-xl border border-slate-200 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between p-1">
            <div className="flex overflow-x-auto no-scrollbar w-full">
                {DAYS_OF_WEEK.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all rounded-lg ${
                            selectedDay === day 
                            ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Search & Meals */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Search Component */}
                <FoodSearch 
                    onAddFood={handleAddFood} 
                    selectedMeal={activeMeal} 
                />

                {/* Meal Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MealSection 
                        mealType={MealType.BREAKFAST}
                        foods={currentDietPlan[MealType.BREAKFAST]}
                        onRemoveFood={handleRemoveFood}
                        onEditFood={handleEditFood}
                        onSelectForAdd={setActiveMeal}
                        isActive={activeMeal === MealType.BREAKFAST}
                    />
                    <MealSection 
                        mealType={MealType.LUNCH}
                        foods={currentDietPlan[MealType.LUNCH]}
                        onRemoveFood={handleRemoveFood}
                        onEditFood={handleEditFood}
                        onSelectForAdd={setActiveMeal}
                        isActive={activeMeal === MealType.LUNCH}
                    />
                    <MealSection 
                        mealType={MealType.SNACK}
                        foods={currentDietPlan[MealType.SNACK]}
                        onRemoveFood={handleRemoveFood}
                        onEditFood={handleEditFood}
                        onSelectForAdd={setActiveMeal}
                        isActive={activeMeal === MealType.SNACK}
                    />
                    <MealSection 
                        mealType={MealType.DINNER}
                        foods={currentDietPlan[MealType.DINNER]}
                        onRemoveFood={handleRemoveFood}
                        onEditFood={handleEditFood}
                        onSelectForAdd={setActiveMeal}
                        isActive={activeMeal === MealType.DINNER}
                    />
                </div>
            </div>

            {/* Right Column: Nutrition Sidebar */}
            <div className="lg:col-span-4">
                <NutritionSidebar 
                    dietPlan={currentDietPlan} 
                    targets={defaultTargets} 
                />
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setCurrentView('planner')}
            >
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                        <Activity size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">
                        Fit<span className="text-emerald-600">Wiser</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsClientListOpen(true)}
                  className="hidden md:flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium text-sm"
                >
                   Clients
                </button>
                <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                
                <button 
                  onClick={() => setCurrentView('mobile')}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                    <Smartphone size={16} /> Client App View
                </button>
                <button className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                    <User size={18} />
                </button>
                <button className="md:hidden p-2 text-slate-600">
                    <Menu size={24} />
                </button>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPlanner()}
      </main>

      {/* Modals */}
      <TemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        onSelectTemplate={handleLoadTemplate}
        onCreateTemplate={handleCreateTemplate}
        onStartNewDraft={handleStartNewDraft}
        initialView={templateModalView}
      />
      
      <ClientAssignmentModal 
        isOpen={isAssignmentModalOpen} 
        onClose={() => setIsAssignmentModalOpen(false)}
        dietPlan={weeklyPlan}
      />

      <EditFoodModal
        isOpen={!!editingFood}
        onClose={() => setEditingFood(null)}
        food={editingFood?.food || null}
        onUpdate={handleUpdateFood}
      />

      <ClientsListModal 
        isOpen={isClientListOpen}
        onClose={() => setIsClientListOpen(false)}
      />

    </div>
  );
};

export default App;