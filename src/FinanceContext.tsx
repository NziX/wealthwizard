import React, { createContext, useContext, useEffect, useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Health' | 'Other';
  date: string;
  description: string;
  timestamp: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface FinanceContextType {
  // State
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  monthlyIncome: number;
  
  // Computed values
  totalSpent: number;
  remainingBudget: number;
  averageDailySpend: number;
  goalProgress: number;
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => Expense;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => SavingsGoal;
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  updateSavingsProgress: (id: string, amount: number) => void;
  
  setMonthlyIncome: (income: number) => void;
  clearAllData: () => void;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'wealthwizard_data';
const INCOME_KEY = 'wealthwizard_income';

const defaultState = {
  expenses: [],
  savingsGoals: [],
  monthlyIncome: 500000, // Default 500,000 RWF
};

// ============================================================================
// FINANCE PROVIDER COMPONENT
// ============================================================================

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(defaultState.expenses);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(defaultState.savingsGoals);
  const [monthlyIncome, setMonthlyIncomeState] = useState(defaultState.monthlyIncome);

  // ========================================================================
  // LOCAL STORAGE - LOAD ON MOUNT
  // ========================================================================
  
  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem(STORAGE_KEY);
      const storedIncome = localStorage.getItem(INCOME_KEY);
      
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
      if (storedIncome) {
        setMonthlyIncomeState(JSON.parse(storedIncome));
      }
      
      // Load goals from localStorage (assuming we want to persist them too)
      const storedGoals = localStorage.getItem('wealthwizard_goals');
      if (storedGoals) {
        setSavingsGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, []);

  // ========================================================================
  // LOCAL STORAGE - PERSIST EXPENSES
  // ========================================================================
  
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Failed to save expenses to localStorage:', error);
    }
  }, [expenses]);

  // ========================================================================
  // LOCAL STORAGE - PERSIST GOALS
  // ========================================================================
  
  useEffect(() => {
    try {
      localStorage.setItem('wealthwizard_goals', JSON.stringify(savingsGoals));
    } catch (error) {
      console.error('Failed to save goals to localStorage:', error);
    }
  }, [savingsGoals]);

  // ========================================================================
  // LOCAL STORAGE - PERSIST INCOME
  // ========================================================================
  
  useEffect(() => {
    try {
      localStorage.setItem(INCOME_KEY, JSON.stringify(monthlyIncome));
    } catch (error) {
      console.error('Failed to save income to localStorage:', error);
    }
  }, [monthlyIncome]);

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================
  
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = monthlyIncome - totalSpent;
  
  // Calculate average daily spend (assuming month has 30 days)
  const averageDailySpend = totalSpent / 30;
  
  // Calculate overall goal progress (0-100)
  const totalTargetAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentSavings, 0);
  const goalProgress = totalTargetAmount > 0 ? (totalCurrentSavings / totalTargetAmount) * 100 : 0;

  // ========================================================================
  // ACTION HANDLERS - EXPENSES
  // ========================================================================
  
  const addExpense = (expense: Omit<Expense, 'id' | 'timestamp'>): Expense => {
    const newExpense: Expense = {
      ...expense,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const deleteExpense = (id: string): void => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const updateExpense = (id: string, updates: Partial<Expense>): void => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  // ========================================================================
  // ACTION HANDLERS - GOALS
  // ========================================================================
  
  const addGoal = (goal: Omit<SavingsGoal, 'id'>): SavingsGoal => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setSavingsGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  };

  const deleteGoal = (id: string): void => {
    setSavingsGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>): void => {
    setSavingsGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const updateSavingsProgress = (id: string, amount: number): void => {
    updateGoal(id, { currentSavings: amount });
  };

  // ========================================================================
  // ACTION HANDLERS - SETTINGS
  // ========================================================================
  
  const setMonthlyIncome = (income: number): void => {
    if (income > 0) {
      setMonthlyIncomeState(income);
    }
  };

  const clearAllData = (): void => {
    setExpenses([]);
    setSavingsGoals([]);
    setMonthlyIncomeState(defaultState.monthlyIncome);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('wealthwizard_goals');
    localStorage.removeItem(INCOME_KEY);
  };

  // ========================================================================
  // PROVIDER VALUE
  // ========================================================================
  
  const value: FinanceContextType = {
    // State
    expenses,
    savingsGoals,
    monthlyIncome,
    
    // Computed
    totalSpent,
    remainingBudget,
    averageDailySpend,
    goalProgress,
    
    // Actions
    addExpense,
    deleteExpense,
    updateExpense,
    addGoal,
    deleteGoal,
    updateGoal,
    updateSavingsProgress,
    setMonthlyIncome,
    clearAllData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK TO USE CONTEXT
// ============================================================================

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
