import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Dumbbell, 
  MessageSquare,
  Save,
  X
} from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

const WORKOUT_TYPES = ['running', 'weightlifting', 'yoga', 'swimming', 'cycling', 'HIIT'];
const EXCUSE_TYPES = ['creative', 'humorous', 'professional', 'weather-related', 'technical'];

interface SettingsPanelProps {
  onClose: () => void;
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
}

export function SettingsPanel({ onClose, darkMode, onDarkModeChange }: SettingsPanelProps) {
  const { preferences, updatePreferences } = useUserPreferences();
  const [localPreferences, setLocalPreferences] = React.useState(preferences);

  const handleSave = () => {
    updatePreferences(localPreferences);
    onClose();
  };

  const handleNotificationChange = (type: 'achievements' | 'streaks', value: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full my-8"
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {/* Profile Settings */}
            <div>
              <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-purple-500" />
                Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={localPreferences.nickname}
                    onChange={(e) => setLocalPreferences(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your nickname"
                  />
                </div>
              </div>
            </div>

            {/* Workout Preferences */}
            <div>
              <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2 mb-4">
                <Dumbbell className="h-5 w-5 text-orange-500" />
                Workout Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Favorite Workout Types
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {WORKOUT_TYPES.map((type) => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={localPreferences.favoriteWorkouts.includes(type)}
                          onChange={(e) => {
                            const newWorkouts = e.target.checked
                              ? [...localPreferences.favoriteWorkouts, type]
                              : localPreferences.favoriteWorkouts.filter(w => w !== type);
                            if (newWorkouts.length > 0) {
                              setLocalPreferences(prev => ({ ...prev, favoriteWorkouts: newWorkouts }));
                            }
                          }}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Excuse Preferences */}
            <div>
              <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-green-500" />
                Excuse Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Excuse Types
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {EXCUSE_TYPES.map((type) => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={localPreferences.preferredExcuseTypes.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...localPreferences.preferredExcuseTypes, type]
                              : localPreferences.preferredExcuseTypes.filter(t => t !== type);
                            if (newTypes.length > 0) {
                              setLocalPreferences(prev => ({ ...prev, preferredExcuseTypes: newTypes }));
                            }
                          }}
                          className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {type.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div>
              <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2 mb-4">
                Display
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onDarkModeChange(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    !darkMode
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => onDarkModeChange(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    darkMode
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-purple-500" />
                Notifications
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Achievement Notifications
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Get notified when you earn new achievements
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localPreferences.notifications.achievements}
                    onChange={(e) => handleNotificationChange('achievements', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Streak Updates
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Get notified about your excuse streak
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localPreferences.notifications.streaks}
                    onChange={(e) => handleNotificationChange('streaks', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}