import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Settings, 
  BookmarkCheck, 
  Bell, 
  Activity,
  Edit3,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { SavedExcusesPanel } from './SavedExcusesPanel';

interface UserProfileSectionProps {
  onEditProfile: () => void;
  onOpenSettings: () => void;
}

export function UserProfileSection({ onEditProfile, onOpenSettings }: UserProfileSectionProps) {
  const { preferences } = useUserPreferences();
  const { history, streak } = useLocalStorage();
  const { addNotification } = useNotifications();
  const [showSavedExcuses, setShowSavedExcuses] = React.useState(false);

  // Mock data (replace with actual data from your auth context)
  const joinDate = new Date('2024-01-01');
  const isOnline = true;
  const avatarUrl = preferences.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop';

  const recentActivity = history.slice(0, 3);

  const handleSavedExcuses = () => {
    setShowSavedExcuses(true);
  };

  const handleNotifications = () => {
    onOpenSettings();
    addNotification({
      title: "Settings Opened",
      message: "You can manage your notification preferences in the settings panel.",
      type: "system"
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={preferences.nickname || 'User'}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">
                    {preferences.nickname || 'Anonymous User'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Joined {format(joinDate, 'MMMM yyyy')}
                  </p>
                </div>
                <button 
                  onClick={onEditProfile}
                  className="btn btn-secondary"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <Activity className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {history.length}
                  </p>
                  <p className="text-sm text-orange-600/70 dark:text-orange-400/70">
                    Total Excuses
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Clock className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {streak}
                  </p>
                  <p className="text-sm text-purple-600/70 dark:text-purple-400/70">
                    Day Streak
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Star className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(history.length * 0.8)}
                  </p>
                  <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
                    Success Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="font-semibold dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </button>
            <button 
              onClick={handleSavedExcuses}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <BookmarkCheck className="h-5 w-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">Saved Excuses</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </button>
            <button 
              onClick={handleNotifications}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">Notifications</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold dark:text-white">Recent Activity</h3>
            <button className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">{activity.excuse}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(activity.date), 'MMM d, yyyy')} • {activity.workout_type}
                  </p>
                </div>
                <button
                  onClick={() => toggleSavedExcuse(activity.date, activity.excuse)}
                  className={`p-2 rounded-full transition-colors ${
                    activity.saved
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400'
                  }`}
                >
                  <BookmarkCheck className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Excuses Panel */}
      {showSavedExcuses && (
        <SavedExcusesPanel onClose={() => setShowSavedExcuses(false)} />
      )}
    </>
  );
}