
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/services/social';
import toast from 'react-hot-toast';
import { SpaceMission } from '@/services/space-missions';

// Extend the User interface to include trackedMissions, which are now populated objects
export interface UserWithTracking extends User {
    trackedMissions?: SpaceMission[];
    followers?: Partial<User>[];
    following?: Partial<User>[];
}

type UpdateUserAction = (prevUser: UserWithTracking | null) => UserWithTracking | null;

interface AuthContextType {
  user: UserWithTracking | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
  updateUser: (action: UpdateUserAction) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithTracking | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load token from localStorage on initial mount
  useEffect(() => {
    let initialToken: string | null = null;
    try {
      initialToken = localStorage.getItem('authToken');
    } catch (e) {
      console.warn('Could not access localStorage');
    }
    if (initialToken) {
      setTokenState(initialToken);
    } else {
      setIsLoading(false);
    }
  }, []);


  // Fetch user profile whenever the token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        setIsLoading(true);
        try {
          // Use the local, proxied path
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const profileData = await response.json();
             if (profileData && !profileData.error) {
                setUser(profileData);
                try {
                  localStorage.setItem('authToken', token);
                } catch(e) {
                  console.warn("could not set item in localstorage")
                }
              } else {
                 const errorMessage = profileData ? profileData.error : 'Received invalid profile data.';
                 console.error('Failed to fetch profile, logging out:', errorMessage);
                 logout();
              }
          } else {
            // If the token is invalid (401), just log out silently.
            // For other errors, log them.
            if (response.status !== 401) {
              const errorData = await response.json().catch(() => null);
              console.error('Failed to fetch profile, logging out. Status:', response.status, errorData ? errorData.error : 'No error data');
            }
            logout();
          }
        } catch (error) {
          console.error('Failed to fetch profile, logging out:', error);
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        // No token, ensure user is null and clear storage
        setUser(null);
        try {
            localStorage.removeItem('authToken');
        } catch(e) {
            console.warn("could not remove item from localstorage")
        }
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            setTokenState(data.token);
            // The useEffect will handle fetching the profile and updating state
        } else {
            throw new Error(data.error || 'Login failed.');
        }
    } catch (error: any) {
        // Re-throw the error to be caught in the component
        throw error;
    }
  }, []);

  // After user is fetched, handle redirects
  useEffect(() => {
    if (!isLoading && user?.username && (pathname === '/login' || pathname === '/register')) {
        router.replace(`/profile/${user.username}`);
    }
  }, [user, isLoading, router, pathname]);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
     try {
        localStorage.removeItem('authToken');
    } catch(e) {
        console.warn("could not remove item from localstorage")
    }
    toast.success("You have been logged out.");
    router.push('/login');
  };

  // Function to update user in context
  const updateUser = (action: UpdateUserAction) => {
    setUser(action);
  }

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    setToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
