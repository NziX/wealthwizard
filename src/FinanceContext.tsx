import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

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
  loading: boolean;

  // Computed values
  totalSpent: number;
  remainingBudget: number;
  averageDailySpend: number;
  goalProgress: number;

  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;

  addGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => Promise<void>;
  updateSavingsProgress: (id: string, amount: number) => Promise<void>;

  setMonthlyIncome: (income: number) => Promise<void>;
  clearAllData: () => Promise<void>;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// ============================================================================
// FINANCE PROVIDER COMPONENT
// ============================================================================

export const FinanceProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({
  children,
  userId,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [monthlyIncome, setMonthlyIncomeState] = useState(0);
  const [loading, setLoading] = useState(true);

  // Firestore paths for this user
  const userDocRef = doc(db, 'users', userId);
  const expensesRef = collection(db, 'users', userId, 'expenses');
  const goalsRef = collection(db, 'users', userId, 'goals');

  // ========================================================================
  // FIRESTORE - REAL-TIME LISTENERS
  // ========================================================================

  useEffect(() => {
    // Listen to income document
    const unsubIncome = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMonthlyIncomeState(data.monthlyIncome ?? 0);
      }
    });

    // Listen to expenses collection
    const unsubExpenses = onSnapshot(expensesRef, (snap) => {
      const data: Expense[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense));
      data.sort((a, b) => b.timestamp - a.timestamp);
      setExpenses(data);
    });

    // Listen to goals collection
    const unsubGoals = onSnapshot(goalsRef, (snap) => {
      const data: SavingsGoal[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavingsGoal));
      setSavingsGoals(data);
      setLoading(false);
    });

    return () => {
      unsubIncome();
      unsubExpenses();
      unsubGoals();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = monthlyIncome - totalSpent;
  const averageDailySpend = totalSpent / 30;
  const totalTargetAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentSavings, 0);
  const goalProgress = totalTargetAmount > 0 ? (totalCurrentSavings / totalTargetAmount) * 100 : 0;

  // ========================================================================
  // ACTION HANDLERS - EXPENSES
  // ========================================================================

  const addExpense = async (expense: Omit<Expense, 'id' | 'timestamp'>): Promise<void> => {
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newExpense: Expense = { ...expense, id, timestamp: Date.now() };
    await setDoc(doc(expensesRef, id), newExpense);
  };

  const deleteExpense = async (id: string): Promise<void> => {
    await deleteDoc(doc(expensesRef, id));
  };

  const updateExpense = async (id: string, updates: Partial<Expense>): Promise<void> => {
    const ref = doc(expensesRef, id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await setDoc(ref, { ...snap.data(), ...updates });
    }
  };

  // ========================================================================
  // ACTION HANDLERS - GOALS
  // ========================================================================

  const addGoal = async (goal: Omit<SavingsGoal, 'id'>): Promise<void> => {
    const id = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newGoal: SavingsGoal = { ...goal, id };
    await setDoc(doc(goalsRef, id), newGoal);
  };

  const deleteGoal = async (id: string): Promise<void> => {
    await deleteDoc(doc(goalsRef, id));
  };

  const updateGoal = async (id: string, updates: Partial<SavingsGoal>): Promise<void> => {
    const ref = doc(goalsRef, id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await setDoc(ref, { ...snap.data(), ...updates });
    }
  };

  const updateSavingsProgress = async (id: string, amount: number): Promise<void> => {
    await updateGoal(id, { currentSavings: amount });
  };

  // ========================================================================
  // ACTION HANDLERS - SETTINGS
  // ========================================================================

  const setMonthlyIncome = async (income: number): Promise<void> => {
    if (income >= 0) {
      await setDoc(userDocRef, { monthlyIncome: income }, { merge: true });
      setMonthlyIncomeState(income);
    }
  };

  const clearAllData = async (): Promise<void> => {
    // Delete all expenses
    for (const expense of expenses) {
      await deleteDoc(doc(expensesRef, expense.id));
    }
    // Delete all goals
    for (const goal of savingsGoals) {
      await deleteDoc(doc(goalsRef, goal.id));
    }
    // Reset income
    await setDoc(userDocRef, { monthlyIncome: 0 }, { merge: true });
    setMonthlyIncomeState(0);
  };

  // ========================================================================
  // PROVIDER VALUE
  // ========================================================================

  const value: FinanceContextType = {
    expenses,
    savingsGoals,
    monthlyIncome,
    loading,
    totalSpent,
    remainingBudget,
    averageDailySpend,
    goalProgress,
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
