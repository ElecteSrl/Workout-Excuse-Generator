import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Flame, 
  Target, 
  Clock, 
  Calendar, 
  Award, 
  TrendingUp, 
  Zap 
} from 'lucide-react';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { format } from 'date-fns';
import { UserProfileSection } from './UserProfileSection';

interface OverviewProps {
  onViewAll?: () => void;
  onEditProfile: () => void;
  onOpenSettings: () => void;
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
  color: string;
  trend?: number;
}

const StatCard = ({ icon: Icon, title, value, description, color, trend }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br ${color} rounded-2xl p-6 relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
      <div className="w-24 h-24 bg-white/10 rounded-full" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-6 w-6 text-white" />
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-white/70">{description}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className={`h-4 w-4 ${trend >= 0 ? 'text-green-300' : 'text-red-300'}`} />
          <span className={`text-sm ${trend >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        </div>
      )}
    </div>
  </motion.div>
);

interface ActivityItemProps {
  excuse: string;
  date: string;
  workoutType: string;
  intensity?: string;
}

const ActivityItem = ({ excuse, date, workoutType, intensity = 'moderate' }: ActivityItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-gray-900 dark:text-white font-medium">{excuse}</p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(date), 'MMM d, yyyy')}
          </span>
          <span className="text-sm text-orange-500 capitalize flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            {workoutType}
          </span>
          <span className="text-sm text-purple-500 capitalize flex items-center gap-1">
            <Zap className="h-4 w-4" />
            {intensity}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export function Overview({ onViewAll, onEditProfile, onOpenSettings }: OverviewProps) {
  const { history, streak } = useLocalStorage();
  const [showSettings, setShowSettings] = React.useState(false);

  // Calculate statistics
  const totalExcuses = history.length;
  const uniqueWorkouts = new Set(history.map(entry => entry.workout_type)).size;
  const totalDuration = history.reduce((acc, curr) => acc + 30, 0);
  const successRate = Math.round((history.length / (history.length + 5)) * 100);

  // Calculate workout type distribution
  const workoutDistribution = history.reduce((acc: Record<string, number>, curr) => {
    acc[curr.workout_type] = (acc[curr.workout_type] || 0) + 1;
    return acc;
  }, {});

  const mostSkippedWorkout = Object.entries(workoutDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  return (
    <div className="space-y-8">
      {/* User Profile Section */}
      <UserProfileSection 
        onEditProfile={onEditProfile}
        onOpenSettings={onOpenSettings}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Dumbbell}
          title="Total Excuses"
          value={totalExcuses}
          description="Workouts successfully avoided"
          color="from-cyan-500 to-blue-600"
          trend={15}
        />
        <StatCard
          icon={Flame}
          title="Current Streak"
          value={streak}
          description="Days of consistent excuses"
          color="from-orange-500 to-red-600"
          trend={25}
        />
        <StatCard
          icon={Target}
          title="Success Rate"
          value={`${successRate}%`}
          description="Excuse acceptance rate"
          color="from-purple-500 to-pink-600"
          trend={5}
        />
        <StatCard
          icon={Clock}
          title="Time Saved"
          value={`${totalDuration}m`}
          description="Minutes of exercise avoided"
          color="from-green-500 to-emerald-600"
          trend={10}
        />
      </div>

      {/* Recent Activity and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Recent Activity
            </h2>
            <button 
              onClick={onViewAll}
              className="text-sm text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {history.slice(0, 5).map((entry, index) => (
              <ActivityItem
                key={index}
                excuse={entry.excuse}
                date={entry.date}
                workoutType={entry.workout_type}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Quick Stats
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Most Skipped</span>
                <Dumbbell className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-lg font-medium dark:text-white mt-1 capitalize">{mostSkippedWorkout}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Unique Workouts</span>
                <Target className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-lg font-medium dark:text-white mt-1">{uniqueWorkouts} types</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Best Streak</span>
                <Flame className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-lg font-medium dark:text-white mt-1">{streak} days</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Avg. Duration</span>
                <Clock className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-lg font-medium dark:text-white mt-1">30 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}