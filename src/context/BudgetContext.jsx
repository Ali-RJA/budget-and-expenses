import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { DEFAULT_DATA } from '../utils/constants';
import { generateId } from '../utils/calculations';

const STORAGE_KEY = 'budget-dashboard-data';

// Action types
const ACTIONS = {
  SET_DATA: 'SET_DATA',
  SET_ACTIVE_SCENARIO: 'SET_ACTIVE_SCENARIO',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  ADD_INCOME: 'ADD_INCOME',
  UPDATE_INCOME: 'UPDATE_INCOME',
  DELETE_INCOME: 'DELETE_INCOME',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  ADD_DEBT: 'ADD_DEBT',
  UPDATE_DEBT: 'UPDATE_DEBT',
  DELETE_DEBT: 'DELETE_DEBT',
  REORDER_DEBTS: 'REORDER_DEBTS',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  DELETE_GOAL: 'DELETE_GOAL',
  REORDER_GOALS: 'REORDER_GOALS',
  TOGGLE_THEME: 'TOGGLE_THEME',
  IMPORT_DATA: 'IMPORT_DATA',
  RESET_DATA: 'RESET_DATA',
};

// Initial state
const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        activeScenario: 'current',
        activeTab: 'dashboard',
      };
    }
  } catch (e) {
    console.error('Error loading saved data:', e);
  }
  
  return {
    ...DEFAULT_DATA,
    activeScenario: 'current',
    activeTab: 'dashboard',
  };
};

// Reducer
const budgetReducer = (state, action) => {
  const { activeScenario } = state;
  
  switch (action.type) {
    case ACTIONS.SET_DATA:
      return { ...state, ...action.payload };
    
    case ACTIONS.SET_ACTIVE_SCENARIO:
      return { ...state, activeScenario: action.payload };
    
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case ACTIONS.ADD_INCOME:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            income: [...state.scenarios[activeScenario].income, action.payload],
          },
        },
      };
    
    case ACTIONS.UPDATE_INCOME:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            income: state.scenarios[activeScenario].income.map(item =>
              item.id === action.payload.id ? { ...item, ...action.payload } : item
            ),
          },
        },
      };
    
    case ACTIONS.DELETE_INCOME:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            income: state.scenarios[activeScenario].income.filter(item => item.id !== action.payload),
          },
        },
      };
    
    case ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            expenses: [...state.scenarios[activeScenario].expenses, action.payload],
          },
        },
      };
    
    case ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            expenses: state.scenarios[activeScenario].expenses.map(item =>
              item.id === action.payload.id ? { ...item, ...action.payload } : item
            ),
          },
        },
      };
    
    case ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            expenses: state.scenarios[activeScenario].expenses.filter(item => item.id !== action.payload),
          },
        },
      };
    
    case ACTIONS.ADD_DEBT:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            debts: [...state.scenarios[activeScenario].debts, action.payload],
          },
        },
      };
    
    case ACTIONS.UPDATE_DEBT:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            debts: state.scenarios[activeScenario].debts.map(item =>
              item.id === action.payload.id ? { ...item, ...action.payload } : item
            ),
          },
        },
      };
    
    case ACTIONS.DELETE_DEBT:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            debts: state.scenarios[activeScenario].debts.filter(item => item.id !== action.payload),
          },
        },
      };
    
    case ACTIONS.REORDER_DEBTS:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            debts: action.payload.map((debt, index) => ({ ...debt, order: index })),
          },
        },
      };
    
    case ACTIONS.ADD_GOAL:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            goals: [...state.scenarios[activeScenario].goals, action.payload],
          },
        },
      };
    
    case ACTIONS.UPDATE_GOAL:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            goals: state.scenarios[activeScenario].goals.map(item =>
              item.id === action.payload.id ? { ...item, ...action.payload } : item
            ),
          },
        },
      };
    
    case ACTIONS.DELETE_GOAL:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            goals: state.scenarios[activeScenario].goals.filter(item => item.id !== action.payload),
          },
        },
      };
    
    case ACTIONS.REORDER_GOALS:
      return {
        ...state,
        scenarios: {
          ...state.scenarios,
          [activeScenario]: {
            ...state.scenarios[activeScenario],
            goals: action.payload.map((goal, index) => ({ ...goal, order: index })),
          },
        },
      };
    
    case ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };
    
    case ACTIONS.IMPORT_DATA:
      return {
        ...action.payload,
        activeScenario: state.activeScenario,
        activeTab: state.activeTab,
      };
    
    case ACTIONS.RESET_DATA:
      return {
        ...DEFAULT_DATA,
        activeScenario: 'current',
        activeTab: 'dashboard',
      };
    
    default:
      return state;
  }
};

// Context
const BudgetContext = createContext(null);

// Provider component
export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, null, getInitialState);
  
  // Auto-save to localStorage
  useEffect(() => {
    const dataToSave = {
      scenarios: state.scenarios,
      version: state.version,
      theme: state.theme,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [state.scenarios, state.version, state.theme]);
  
  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);
  
  // Get current scenario data
  const currentScenario = state.scenarios[state.activeScenario];
  
  // Actions
  const setActiveScenario = useCallback((scenario) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_SCENARIO, payload: scenario });
  }, []);
  
  const setActiveTab = useCallback((tab) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
  }, []);
  
  // Income actions
  const addIncome = useCallback((income) => {
    dispatch({
      type: ACTIONS.ADD_INCOME,
      payload: { ...income, id: generateId('inc') },
    });
  }, []);
  
  const updateIncome = useCallback((income) => {
    dispatch({ type: ACTIONS.UPDATE_INCOME, payload: income });
  }, []);
  
  const deleteIncome = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_INCOME, payload: id });
  }, []);
  
  // Expense actions
  const addExpense = useCallback((expense) => {
    dispatch({
      type: ACTIONS.ADD_EXPENSE,
      payload: { ...expense, id: generateId('exp') },
    });
  }, []);
  
  const updateExpense = useCallback((expense) => {
    dispatch({ type: ACTIONS.UPDATE_EXPENSE, payload: expense });
  }, []);
  
  const deleteExpense = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_EXPENSE, payload: id });
  }, []);
  
  // Debt actions
  const addDebt = useCallback((debt) => {
    const order = currentScenario.debts.length;
    dispatch({
      type: ACTIONS.ADD_DEBT,
      payload: { ...debt, id: generateId('debt'), order },
    });
  }, [currentScenario.debts.length]);
  
  const updateDebt = useCallback((debt) => {
    dispatch({ type: ACTIONS.UPDATE_DEBT, payload: debt });
  }, []);
  
  const deleteDebt = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_DEBT, payload: id });
  }, []);
  
  const reorderDebts = useCallback((debts) => {
    dispatch({ type: ACTIONS.REORDER_DEBTS, payload: debts });
  }, []);
  
  // Goal actions
  const addGoal = useCallback((goal) => {
    const order = currentScenario.goals.length;
    dispatch({
      type: ACTIONS.ADD_GOAL,
      payload: { ...goal, id: generateId('goal'), order },
    });
  }, [currentScenario.goals.length]);
  
  const updateGoal = useCallback((goal) => {
    dispatch({ type: ACTIONS.UPDATE_GOAL, payload: goal });
  }, []);
  
  const deleteGoal = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_GOAL, payload: id });
  }, []);
  
  const reorderGoals = useCallback((goals) => {
    dispatch({ type: ACTIONS.REORDER_GOALS, payload: goals });
  }, []);
  
  // Theme toggle
  const toggleTheme = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_THEME });
  }, []);
  
  // Import/Export
  const exportData = useCallback(() => {
    const dataToExport = {
      scenarios: state.scenarios,
      version: state.version,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.scenarios, state.version]);
  
  const importData = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate data structure
          if (!data.scenarios || !data.scenarios.current || !data.scenarios.plan) {
            throw new Error('Invalid file format');
          }
          
          dispatch({
            type: ACTIONS.IMPORT_DATA,
            payload: {
              scenarios: data.scenarios,
              version: data.version || 1,
              theme: state.theme,
            },
          });
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [state.theme]);
  
  const resetData = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_DATA });
  }, []);
  
  const value = {
    // State
    state,
    currentScenario,
    activeScenario: state.activeScenario,
    activeTab: state.activeTab,
    theme: state.theme,
    
    // Scenario actions
    setActiveScenario,
    setActiveTab,
    
    // Income actions
    addIncome,
    updateIncome,
    deleteIncome,
    
    // Expense actions
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Debt actions
    addDebt,
    updateDebt,
    deleteDebt,
    reorderDebts,
    
    // Goal actions
    addGoal,
    updateGoal,
    deleteGoal,
    reorderGoals,
    
    // Theme
    toggleTheme,
    
    // Import/Export
    exportData,
    importData,
    resetData,
  };
  
  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

// Hook
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

