import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from './LocalStorageContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'streak' | 'milestone' | 'system';
  timestamp: number;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const { history, streak } = useLocalStorage();

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Check for achievements and milestones
  useEffect(() => {
    const checkMilestones = () => {
      // Streak milestones
      if (streak === 3) {
        addNotification({
          title: "Streak Achievement",
          message: "You've maintained a 3-day excuse streak! Keep up the creative avoidance!",
          type: 'streak'
        });
      }

      // Total excuses milestones
      if (history.length === 10) {
        addNotification({
          title: "Milestone Reached",
          message: "You've generated 10 excuses! You're becoming a master of avoidance!",
          type: 'milestone'
        });
      }

      // Workout variety achievement
      const uniqueWorkouts = new Set(history.map(h => h.workout_type)).size;
      if (uniqueWorkouts === 5) {
        addNotification({
          title: "Variety Achievement",
          message: "You've now avoided 5 different types of workouts. Such versatility!",
          type: 'achievement'
        });
      }
    };

    checkMilestones();
  }, [history, streak]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [{
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    }, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}