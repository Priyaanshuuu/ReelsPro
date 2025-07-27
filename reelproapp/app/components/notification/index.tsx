"use client";

import { createContext, useContext, ReactNode } from "react";

interface NotificationContextType {
  // Add your notification methods here
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Implement your notification logic here
    console.log(`${type}: ${message}`);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationProvider;