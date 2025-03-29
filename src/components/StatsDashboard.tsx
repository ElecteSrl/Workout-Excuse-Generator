import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { Activity, TrendingUp, Award, Clock, Zap } from 'lucide-react';

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6366F1'];

export function StatsDashboard() {
  const { history, streak } = useLocalStorage();

  // Calculate workout type distribution
  const workoutDistribution = history.reduce((acc: Record<string, number>, entry) => {
    acc[entry.workout_type] = (acc[entry.workout_type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(workoutDistribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Calculate weekly trends
  const last7Days = new Array(7).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const weeklyData = last7Days.map(date => ({
    date: date.split('-').slice(1).join('/'),
    excuses: history.filter(entry => entry.date === date).length
  }));

  // Calculate average duration trend
  const durationData = last7Days.map(date => {
    const dayEntries = history.filter(entry => entry.date === date);
    const avgDuration = dayEntries.length > 0
      ? dayEntries.reduce((sum, entry) => sum + (entry.duration || 30), 0) / dayEntries.length
      : 0;
    return {
      date: date.split('-').slice(1).join('/'),
      duration: Math.round(avgDuration)
    };
  });

  // Calculate intensity distribution
  const intensityDistribution = history.reduce((acc: Record<string, number>, entry) => {
    const intensity = entry.intensity || 'moderate';
    acc[intensity] = (acc[intensity] || 0) + 1;
    return acc;
  }, {});

  const intensityData = Object.entries(intensityDistribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Calculate quick stats
  const totalExcuses = history.length;
  const uniqueWorkouts = new Set(history.map(entry => entry.workout_type)).size;
  const avgDuration = history.length > 0
    ? Math.round(history.reduce((sum, entry) => sum + (entry.duration || 30), 0) / history.length)
    : 0;
  const mostCommonWorkout = Object.entries(workoutDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-purple-500" />
          Workout Statistics
        </h2>
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 px-4 py-2 rounded-full">
          <Award className="h-5 w-5 text-purple-500" />
          <span className="text-purple-700 dark:text-purple-300 font-semibold">
            Current Streak: {streak}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Excuses</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalExcuses}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Unique Workouts</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{uniqueWorkouts}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Duration</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{avgDuration} min</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Top Workout</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 capitalize">{mostCommonWorkout}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Weekly Activity
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="excuses" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Workout Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Duration Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="duration" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Intensity Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={intensityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {intensityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}