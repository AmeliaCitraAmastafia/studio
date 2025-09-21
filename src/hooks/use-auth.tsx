
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  login: (email: string, role: User['role']) => void;
  signup: (name: string, email: string, role: User['role']) => void;
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
      const storedUser = localStorage.getItem('slumber-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('slumber-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, role: User['role']) => {
    const name = email.split('@')[0].replace(/^\w/, c => c.toUpperCase());
    const newUser: User = { id: Date.now().toString(), name, email, role };
    // In a real app, you would fetch user details from a server.
    // For this demo, we just recreate the user object.
    localStorage.setItem('slumber-user', JSON.stringify(newUser));
    setUser(newUser);
    if (role === 'guest') {
      router.push('/');
    } else {
      router.push('/dashboard');
    }
  };

  const signup = (name: string, email: string, role: User['role']) => {
    const newUser: User = { id: Date.now().toString(), name, email, role };
    localStorage.setItem('slumber-user', JSON.stringify(newUser));
    setUser(newUser);
    if (role === 'guest') {
      router.push('/');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('slumber-user');
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
