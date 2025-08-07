'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './api-client';

export interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  name?: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        // Store in localStorage (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Update state
        setUser(userData);
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = () => {
    // Clear localStorage (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    
    // Update state
    setUser(null);
    
    // Call backend logout if needed
    authApi.logout();
  };

  const checkAuth = async () => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        setIsLoading(false);
        setHasCheckedAuth(true);
        return;
      }

      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        setUser(null);
        setIsLoading(false);
        setHasCheckedAuth(true);
        return;
      }

      // Verify token with backend
      const response = await authApi.getProfile();
      
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.id,
          email: response.data.email,
          role: response.data.role,
          permissions: response.data.permissions,
          name: response.data.name,
          nationality: response.data.nationality,
          dateOfBirth: response.data.dateOfBirth,
          isActive: response.data.isActive,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        
        setUser(userData);
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Token is invalid, clear everything
        logout();
      }
    } catch (error) {
      // Token is invalid, clear everything
      logout();
    } finally {
      setIsLoading(false);
      setHasCheckedAuth(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Handle redirect to login when not authenticated and auth check is complete
  useEffect(() => {
    if (hasCheckedAuth && !isLoading && !isAuthenticated) {
      // Only redirect if we're not already on login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [hasCheckedAuth, isLoading, isAuthenticated, router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 