import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, User, Dumbbell, MessageSquare } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

const WORKOUT_TYPES = ['running', 'weightlifting', 'yoga', 'swimming', 'cycling', 'HIIT'];
const EXCUSE_TYPES = ['creative', 'humorous', 'professional', 'weather-related', 'technical'];
const COLOR_THEMES = [
  { primary: 'purple', secondary: 'blue', accent: 'pink' },
  { primary: 'blue', secondary: 'cyan', accent: 'indigo' },
  { primary: 'green', secondary: 'emerald', accent: 'teal' },
  { primary: 'rose', secondary: 'pink', accent: 'purple' },
  { primary: 'amber', secondary: 'orange', accent: 'red' },
];

export function UserPreferencesPanel() {
  const { preferences, updatePreferences, updateTheme } = useUserPreferences();
  const [activeTab, setActiveTab] = useState<'profile' | 'workouts' | 'excuses' | 'theme'>('profile');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-bold dark:text-white">Preferences</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <User className="h-4 w-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'workouts'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Dumbbell className="h-4 w-4" />
          Workouts
        </button>
        <button
          onClick={() => setActiveTab('excuses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'excuses'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Excuses
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'theme'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Palette className="h-4 w-4" />
          Theme
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                value={preferences.nickname}
                onChange={(e) => updatePreferences({ nickname: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                placeholder="Enter your nickname"
              />
            </div>
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Select your favorite workout types:</p>
            <div className="grid grid-cols-2 gap-3">
              {WORKOUT_TYPES.map((workout) => (
                <label key={workout} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.favoriteWorkouts.includes(workout)}
                    onChange={(e) => {
                      const newWorkouts = e.target.checked
                        ? [...preferences.favoriteWorkouts, workout]
                        : preferences.favoriteWorkouts.filter(w => w !== workout);
                      updatePreferences({ favoriteWorkouts: newWorkouts });
                    }}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{workout}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'excuses' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Select your preferred excuse types:</p>
            <div className="grid grid-cols-2 gap-3">
              {EXCUSE_TYPES.map((type) => (
                <label key={type} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.preferredExcuseTypes.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...preferences.preferredExcuseTypes, type]
                        : preferences.preferredExcuseTypes.filter(t => t !== type);
                      updatePreferences({ preferredExcuseTypes: newTypes });
                    }}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose your color theme:</p>
            <div className="grid grid-cols-2 gap-4">
              {COLOR_THEMES.map((theme, index) => (
                <button
                  key={index}
                  onClick={() => updateTheme(theme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.theme.primary === theme.primary
                      ? `border-${theme.primary}-500`
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex gap-2">
                    <div className={`w-8 h-8 rounded-full bg-${theme.primary}-500`} />
                    <div className={`w-8 h-8 rounded-full bg-${theme.secondary}-500`} />
                    <div className={`w-8 h-8 rounded-full bg-${theme.accent}-500`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}