import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Activity tracking
  const [tracking, setTracking] = useState({ type: null, startTime: null });
  const [steps, setSteps] = useState(4823);
  const [runTime, setRunTime] = useState(0);   // seconds
  const [walkTime, setWalkTime] = useState(0); // seconds
  const [napTime, setNapTime] = useState(0);   // seconds

  // Schedule
  const [schedules, setSchedules] = useState([
    { id: 1, type: 'walk',  name: 'Morning Walk',       time: '07:00', duration: 30, done: true  },
    { id: 2, type: 'med',   name: 'Vitamin D',          time: '08:00', dose: '1 tab', done: true  },
    { id: 3, type: 'run',   name: 'Cardio Run',         time: '10:00', duration: 20, done: false },
    { id: 4, type: 'med',   name: 'Blood Pressure Med', time: '12:00', dose: '5mg',  done: false },
    { id: 5, type: 'nap',   name: 'Power Nap',          time: '14:00', duration: 20, done: false },
    { id: 6, type: 'med',   name: 'Omega-3',            time: '18:00', dose: '2 caps',done: false },
    { id: 7, type: 'walk',  name: 'Evening Walk',       time: '19:00', duration: 45, done: false },
  ]);

  // Recipes store
  const [recipes, setRecipes] = useState([
    {
      id: 1, title: 'Green Detox Smoothie',
      category: 'Smoothie', calories: 180, prepTime: '5 min',
      ingredients: ['Spinach', 'Banana', 'Apple', 'Ginger', 'Lemon juice'],
      instructions: 'Blend all ingredients until smooth. Serve chilled.',
      tags: ['healthy', 'vegan', 'quick'],
      date: '2025-01-10',
    },
    {
      id: 2, title: 'Oats Power Bowl',
      category: 'Breakfast', calories: 320, prepTime: '10 min',
      ingredients: ['Rolled oats', 'Almond milk', 'Chia seeds', 'Honey', 'Mixed berries'],
      instructions: 'Cook oats in almond milk, top with chia seeds, berries and honey.',
      tags: ['fiber', 'energy', 'breakfast'],
      date: '2025-01-11',
    },
    {
      id: 3, title: 'Turmeric Golden Milk',
      category: 'Drink', calories: 120, prepTime: '8 min',
      ingredients: ['Oat milk', 'Turmeric', 'Black pepper', 'Cinnamon', 'Honey'],
      instructions: 'Warm milk, whisk in spices, sweeten with honey. Do not boil.',
      tags: ['anti-inflammatory', 'sleep', 'immunity'],
      date: '2025-01-12',
    },
  ]);

  // Tick tracking timer
  useEffect(() => {
    if (!tracking.type) return;
    const interval = setInterval(() => {
      if (tracking.type === 'run')  setRunTime(t => t + 1);
      if (tracking.type === 'walk') { setWalkTime(t => t + 1); setSteps(s => s + 2); }
      if (tracking.type === 'nap')  setNapTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tracking]);

  const startTracking = useCallback((type) => {
    setTracking({ type, startTime: Date.now() });
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} tracking started!`, 'success');
  }, []);

  const stopTracking = useCallback(() => {
    if (tracking.type) showToast(`${tracking.type} session saved.`, 'success');
    setTracking({ type: null, startTime: null });
  }, [tracking]);

  const toggleSchedule = (id) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const addSchedule = (item) => {
    setSchedules(prev => [...prev, { ...item, id: Date.now(), done: false }]);
    showToast('Schedule item added!', 'success');
  };

  const addRecipe = (recipe) => {
    setRecipes(prev => [{ ...recipe, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...prev]);
    showToast('Recipe saved to your vault!', 'success');
  };

  const deleteRecipe = (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    showToast('Recipe removed.', 'warning');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  return (
    <AppContext.Provider value={{
      activePage, setActivePage,
      sidebarOpen, setSidebarOpen,
      toast, showToast,
      tracking, startTracking, stopTracking,
      steps, runTime, walkTime, napTime,
      schedules, toggleSchedule, addSchedule,
      recipes, addRecipe, deleteRecipe,
      formatTime,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
