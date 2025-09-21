
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { LogEntry } from '@/lib/types';
import { useAuth } from './use-auth';

type LogContextType = {
  logs: LogEntry[];
  addLog: (action: string) => void;
  loading: boolean;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('slumber-logs');
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs).map((l: any) => ({
            ...l,
            timestamp: new Date(l.timestamp),
        }));
        setLogs(parsedLogs);
      }
    } catch (error) {
      console.error('Failed to parse logs from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('slumber-logs', JSON.stringify(logs));
    }
  }, [logs, loading]);
  
  const addLog = useCallback((action: string) => {
    if (!user) return; // Don't log if no user is signed in

    const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        user: user.name,
        action,
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  }, [user]);


  return (
    <LogContext.Provider value={{ logs, addLog, loading }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}
