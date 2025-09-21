
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  login: (name: string, email: string, role: User['role']) => void;
  signup: (name: string, email: string, password: string, role: User['role']) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('slumber-active-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('slumber-active-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (name: string, email: string, role: User['role']) => {
    const activeUser: User = { id: Date.now().toString(), name, email, role };
    localStorage.setItem('slumber-active-user', JSON.stringify(activeUser));
    setUser(activeUser);
    router.push('/');
  };

  const signup = (name: string, email: string, password: string, role: User['role']) => {
    const newUser: User = { id: Date.now().toString(), name, email, password, role };
    
    // Get existing users or initialize a new array
    const storedUsers = localStorage.getItem('slumber-users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Add new user to the list
    users.push(newUser);
    localStorage.setItem('slumber-users', JSON.stringify(users));

    // Set the new user as the active user
    const activeUser: User = { id: newUser.id, name, email, role };
    localStorage.setItem('slumber-active-user', JSON.stringify(activeUser));
    setUser(activeUser);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('slumber-active-user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
