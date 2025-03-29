import React, { createContext, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';

interface HistoryEntry {
  date: string;
  excuse: string;
  workout_type: string;
  saved?: boolean;
}

interface LocalStorageContextType {
  history: HistoryEntry[];
  streak: number;
  addExcuse: (excuse: string, workout_type: string) => void;
  toggleSavedExcuse: (date: string, excuse: string) => void;
  getSavedExcuses: () => HistoryEntry[];
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export function LocalStorageProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('excuseHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('excuseHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(streak));
  }, [streak]);

  const addExcuse = (excuse: string, workout_type: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEntry = {
      date: today,
      excuse,
      workout_type,
      saved: false
    };

    const lastEntry = history[0];
    if (lastEntry && lastEntry.date === today) {
      setHistory([newEntry, ...history.slice(1)]);
    } else if (lastEntry && format(new Date(lastEntry.date), 'yyyy-MM-dd') === format(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd')) {
      setStreak(s => s + 1);
      setHistory([newEntry, ...history]);
    } else {
      setStreak(1);
      setHistory([newEntry, ...history]);
    }
  };

  const toggleSavedExcuse = (date: string, excuse: string) => {
    setHistory(prev => prev.map(entry => {
      if (entry.date === date && entry.excuse === excuse) {
        return { ...entry, saved: !entry.saved };
      }
      return entry;
    }));
  };

  const getSavedExcuses = () => {
    return history.filter(entry => entry.saved);
  };

  return (
    <LocalStorageContext.Provider value={{ 
      history, 
      streak, 
      addExcuse, 
      toggleSavedExcuse,
      getSavedExcuses 
    }}>
      {children}
    </LocalStorageContext.Provider>
  );
}

export function useLocalStorage() {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
}