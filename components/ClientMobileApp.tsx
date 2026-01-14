import React, { useState, useMemo } from 'react';
import { WeeklyDietPlan, MealType, DAYS_OF_WEEK } from '../types';
import { 
  Home, Calendar, User, Dumbbell, MessageSquare, Apple, Bell,
  ChevronLeft, ChevronRight, CheckCircle2, Circle, RefreshCw, 
  Utensils, Flame, Footprints, Moon, Check
} from 'lucide-react';

interface ClientMobileAppProps {
  weeklyPlan: WeeklyDietPlan;
  onExit: () => void;
}

type AppView = 'home' | 'nutrition' | 'workout' | 'chat' | 'profile';

export const ClientMobileApp: React.FC<ClientMobileAppProps> = ({ weeklyPlan, onExit }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentDayIndex, setCurrentDayIndex] = useState(2); // Default to Wednesday
  
  // Tracking State: Record<"Day-Meal-FoodId", boolean>
  // We track individual items now instead of whole meals
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const currentDay = DAYS_OF_WEEK[currentDayIndex];
  const todaysPlan = weeklyPlan[currentDay];

  // --- ACTIONS ---
  const toggleFoodItem = (meal: string, foodId: string) => {
    const key = `${currentDay}-${meal}-${foodId}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- SUB-COMPONENTS ---

  const BottomNav = () => (
    <div className="absolute bottom-6 left-6 right-6 h-16 bg-white rounded-full shadow-2xl flex items-center justify-between px-6 z-30 border border-slate-100">
      <button onClick={() => setCurrentView('home')} className={`p-2 transition-all ${currentView === 'home' ? 'bg-emerald-100 text-emerald-600 rounded-full' : 'text-slate-400'}`}>
        <Home size={24} fill={currentView === 'home' ? "currentColor" : "none"} />
      </button>
      <button onClick={() => setCurrentView('chat')} className={`p-2 transition-all ${currentView === 'chat' ? 'bg-emerald-100 text-emerald-600 rounded-full' : 'text-slate-400'}`}>
        <MessageSquare size={24} />
      </button>
      <button onClick={() => setCurrentView('workout')} className={`p-2 transition-all ${currentView === 'workout' ? 'bg-emerald-100 text-emerald-600 rounded-full' : 'text-slate-400'}`}>
        <Dumbbell size={24} />
      </button>
      <button onClick={() => setCurrentView('nutrition')} className={`p-2 transition-all ${currentView === 'nutrition' ? 'bg-emerald-100 text-emerald-600 rounded-full' : 'text-slate-400'}`}>
        <Apple size={24} />
      </button>
      <button onClick={() => setCurrentView('profile')} className={`p-2 transition-all ${currentView === 'profile' ? 'bg-emerald-100 text-emerald-600 rounded-full' : 'text-slate-400'}`}>
        <User size={24} />
      </button>
    </div>
  );

  const HomeView = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8FAFC] p-5 pb-24">
       {/* Header */}
       <div className="flex items-center justify-between mb-6 pt-2">
          <div>
             <h1 className="text-slate-500 font-medium">Hello Homie,</h1>
             <h2 className="text-2xl font-bold text-slate-900">January 14, 2026</h2>
          </div>
          <div className="flex gap-3">
             <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-slate-700">
                <Bell size={20} />
             </button>
             <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-slate-700">
                <Calendar size={20} />
             </button>
          </div>
       </div>

       {/* Date Pills */}
       <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
          <button className="px-6 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-emerald-200 whitespace-nowrap">
             Today
          </button>
          <button className="px-6 py-2 bg-white text-slate-700 border border-slate-200 rounded-full text-sm font-semibold whitespace-nowrap">
             Last Week
          </button>
          <button className="px-6 py-2 bg-white text-slate-700 border border-slate-200 rounded-full text-sm font-semibold whitespace-nowrap">
             Last Month
          </button>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative">
             <div className="absolute top-5 right-5 text-slate-300"><ChevronRight size={16} /></div>
             <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                <Utensils size={20} />
             </div>
             <div className="text-2xl font-bold text-slate-900">0</div>
             <div className="text-xs text-slate-500 font-medium mt-1">Calories In</div>
          </div>
           <div className="bg-[#FFF8E7] p-5 rounded-3xl shadow-sm border border-[#FDEECC] relative">
             <div className="h-10 w-10 bg-white/50 rounded-full flex items-center justify-center text-amber-500 mb-3">
                <Flame size={20} />
             </div>
             <div className="text-2xl font-bold text-slate-900">0</div>
             <div className="text-xs text-slate-500 font-medium mt-1">Active Calories</div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative">
             <div className="absolute top-5 right-5 text-slate-300"><ChevronRight size={16} /></div>
             <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                <Footprints size={20} />
             </div>
             <div className="text-2xl font-bold text-slate-900">0</div>
             <div className="text-xs text-slate-500 font-medium mt-1">Steps</div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative">
             <div className="absolute top-5 right-5 text-slate-300"><ChevronRight size={16} /></div>
             <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-3">
                <Moon size={20} />
             </div>
             <div className="text-2xl font-bold text-slate-900">0h 0m</div>
             <div className="text-xs text-slate-500 font-medium mt-1">Sleep</div>
          </div>
       </div>

       {/* Weight Progress */}
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold text-slate-900">Weight Progress</h3>
             <div className="flex items-center gap-3">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                   <TrendingUpIcon /> 1.3 kg
                </span>
                <button className="text-slate-400">
                   <RefreshCw size={18} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  const NutritionView = () => {
    // Calculate progress for the progress bar
    const totalItems = Object.values(todaysPlan).flat().length;
    const checkedCount = Object.values(todaysPlan).flat().reduce((acc, food) => {
        // Need to find which meal this food belongs to for the key
        // This is a bit inefficient but fine for small lists
        let mealName = '';
        Object.entries(todaysPlan).forEach(([m, foods]) => {
            if(foods.find(f => f.id === food.id)) mealName = m;
        });
        return acc + (checkedItems[`${currentDay}-${mealName}-${food.id}`] ? 1 : 0);
    }, 0);
    
    const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8FAFC] pb-24">
           {/* Header */}
           <div className="bg-white px-5 pt-12 pb-6 rounded-b-[32px] shadow-sm z-20 relative border-b border-slate-100">
              <div className="flex items-center justify-between mb-6">
                 <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                    <ChevronLeft size={24} />
                 </button>
                 <h1 className="text-xl font-bold text-slate-900">My Nutrition</h1>
                 <div className="w-8"></div> {/* Spacer */}
              </div>
              
              {/* Day Switcher */}
              <div className="flex overflow-x-auto no-scrollbar gap-3 mb-6 pb-2">
                 {DAYS_OF_WEEK.map((day, idx) => (
                    <button 
                        key={day}
                        onClick={() => setCurrentDayIndex(idx)}
                        className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-2xl transition-all ${
                            day === currentDay 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}
                    >
                        <span className="text-[10px] font-bold uppercase opacity-80">{day.substring(0, 3)}</span>
                        <span className="text-lg font-bold">{14 + idx}</span>
                    </button>
                 ))}
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                 <span>Daily Progress</span>
                 <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
           </div>
    
           <div className="px-5 space-y-6 mt-6 pb-6">
              {Object.values(MealType).map((meal) => {
                  const foods = todaysPlan[meal];
                  if (foods.length === 0) return null; // Don't show empty meal cards

                  const totalMealCals = Math.round(foods.reduce((a, b) => a + b.calories, 0));
                  
                  // Check if all items in this meal are checked
                  const allChecked = foods.every(f => checkedItems[`${currentDay}-${meal}-${f.id}`]);

                  return (
                      <div key={meal} className={`transition-all duration-300 ${allChecked ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}>
                          
                          {/* Meal Title Row */}
                          <div className="flex items-end justify-between mb-3 px-1">
                              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                  {meal}
                                  {allChecked && <CheckCircle2 size={16} className="text-emerald-500" />}
                              </h3>
                              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                  {totalMealCals} kcal
                              </span>
                          </div>

                          {/* Checklist Card */}
                          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                              {foods.map((food, idx) => {
                                  const isChecked = checkedItems[`${currentDay}-${meal}-${food.id}`];
                                  
                                  return (
                                      <div 
                                        key={food.id}
                                        onClick={() => toggleFoodItem(meal, food.id)}
                                        className={`relative p-4 flex items-center gap-4 transition-all cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50 active:scale-[0.99] ${
                                            isChecked ? 'bg-slate-50/50' : 'bg-white'
                                        }`}
                                      >
                                          {/* Custom Checkbox */}
                                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                                              isChecked 
                                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                                              : 'border-slate-200 text-transparent'
                                          }`}>
                                              <Check size={14} strokeWidth={3} />
                                          </div>

                                          <div className="flex-1">
                                              {/* Primary Info: Name & Quantity */}
                                              <div className="flex items-center justify-between mb-1">
                                                  <span className={`text-[15px] font-bold transition-all ${isChecked ? 'text-slate-400 line-through decoration-2 decoration-slate-200' : 'text-slate-800'}`}>
                                                      {food.name}
                                                  </span>
                                                  
                                                  {/* Quantity Badge - The "Hero" of the design */}
                                                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                                                      isChecked 
                                                      ? 'bg-slate-100 text-slate-400' 
                                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                  }`}>
                                                      {food.amount} {food.unit}
                                                  </span>
                                              </div>

                                              {/* Secondary Info (Optional stats) */}
                                              {!isChecked && (
                                                  <div className="text-[11px] text-slate-400 font-medium">
                                                      {food.calories} cal • {food.protein}g Protein
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  );
              })}

              <div className="h-8"></div> {/* Spacer */}
           </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      
      {/* Mobile Device Frame */}
      <div className="w-full max-w-[375px] h-[812px] bg-[#F8FAFC] rounded-[40px] shadow-2xl overflow-hidden relative border-[8px] border-slate-800 flex flex-col">
        
        {/* Status Bar */}
        <div className="h-12 bg-white flex items-end justify-between px-6 pb-2 text-xs font-bold text-slate-900 z-10 shrink-0">
            <span>09:41</span>
            <div className="flex gap-1.5 items-center">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
            </div>
        </div>

        {/* Content Area */}
        {currentView === 'home' && <HomeView />}
        {currentView === 'nutrition' && <NutritionView />}
        {(currentView !== 'home' && currentView !== 'nutrition') && (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
               Work in progress...
            </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Exit Button (Overlay) */}
        <button 
            onClick={onExit}
            className="absolute top-3 left-4 z-50 bg-black/80 text-white px-3 py-1 rounded-full text-[10px] backdrop-blur-md hover:bg-black transition-colors"
        >
            Exit
        </button>

      </div>
    </div>
  );
};

// --- Helper Icons for exact look ---
const MoreHorizontalDots = () => (
   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);

const TrendingUpIcon = () => (
   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const SignalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20V2z" /></svg>
);

const WifiIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" /></svg>
);

const BatteryIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
);