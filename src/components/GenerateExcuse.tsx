import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Share2 } from 'lucide-react';
import { TwitterShareButton, FacebookShareButton } from 'react-share';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

interface ExcuseResponse {
  excuse: string;
  counter_motivation: string;
  workout_details: {
    workout_type: string;
    duration_minutes: number;
    intensity: string;
  };
}

export function GenerateExcuse() {
  const { addExcuse } = useLocalStorage();
  const { preferences } = useUserPreferences();
  const [workoutType, setWorkoutType] = useState(preferences.favoriteWorkouts[0] || 'running');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('moderate');
  const [response, setResponse] = useState<ExcuseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.PROD 
        ? '/generate-excuse'
        : 'http://localhost:8000/generate-excuse';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workout_type: workoutType,
          duration: duration,
          intensity: intensity,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate excuse');
      }

      const data = await res.json();
      setResponse(data);
      addExcuse(data.excuse, workoutType);
    } catch (error) {
      setError('Failed to generate excuse. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold dark:text-white">Generate New Excuse</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium dark:text-white mb-2">
              Workout Type
            </label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="w-full rounded-xl border dark:border-gray-700 dark:bg-gray-700 dark:text-white p-3"
            >
              {preferences.favoriteWorkouts.map((workout) => (
                <option key={workout} value={workout}>
                  {workout.charAt(0).toUpperCase() + workout.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-white mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              max="180"
              className="w-full rounded-xl border dark:border-gray-700 dark:bg-gray-700 dark:text-white p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-white mb-2">
              Intensity
            </label>
            <div className="flex gap-4">
              {['light', 'moderate', 'intense'].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="intensity"
                    value={level}
                    checked={intensity === level}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="mr-2"
                  />
                  <span className="dark:text-white capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <RefreshCcw className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              'Generate Excuse'
            )}
          </button>
        </form>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 space-y-4"
            >
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <p className="text-orange-800 dark:text-orange-200">{response.excuse}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <p className="text-purple-800 dark:text-purple-200">{response.counter_motivation}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <TwitterShareButton
                  url={window.location.href}
                  title={`${response.excuse}\n${response.counter_motivation}`}
                >
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-xl">
                    <Share2 className="h-4 w-4" />
                    <span>Tweet</span>
                  </button>
                </TwitterShareButton>

                <FacebookShareButton
                  url={window.location.href}
                  quote={`${response.excuse}\n${response.counter_motivation}`}
                >
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </FacebookShareButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold mb-4">Pro Tips</h2>
        <ul className="space-y-4">
          <li className="flex items-start space-x-2">
            <span className="text-orange-200">•</span>
            <p className="text-sm">Be creative with your excuses - the more unique, the more believable!</p>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-orange-200">•</span>
            <p className="text-sm">Mix up your workout types to maintain variety in your excuse portfolio.</p>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-orange-200">•</span>
            <p className="text-sm">Higher intensity workouts often require more elaborate excuses.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}