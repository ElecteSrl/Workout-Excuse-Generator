import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserPreferences {
  nickname: string;
  avatarUrl?: string;
  favoriteWorkouts: string[];
  preferredExcuseTypes: string[];
  notifications: {
    achievements: boolean;
    streaks: boolean;
  };
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  nickname: '',
  favoriteWorkouts: ['running', 'weightlifting', 'yoga', 'swimming', 'cycling', 'HIIT'],
  preferredExcuseTypes: ['creative', 'humorous', 'professional', 'weather-related', 'technical'],
  notifications: {
    achievements: true,
    streaks: true
  }
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
      // Ensure at least one workout type is selected
      favoriteWorkouts: newPreferences.favoriteWorkouts 
        ? newPreferences.favoriteWorkouts.length > 0 
          ? newPreferences.favoriteWorkouts 
          : prev.favoriteWorkouts
        : prev.favoriteWorkouts,
      // Ensure at least one excuse type is selected
      preferredExcuseTypes: newPreferences.preferredExcuseTypes
        ? newPreferences.preferredExcuseTypes.length > 0
          ? newPreferences.preferredExcuseTypes
          : prev.preferredExcuseTypes
        : prev.preferredExcuseTypes
    }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}