'use client';

// React context for managing Admin CMS authentication and authorization state.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getIdToken, signInWithEmailPassword, signOutUser } from '@/lib/firebase/auth';
import { adminApi } from '@/lib/api/admin-api';

interface AdminAuthContextType {
  user: User | null;
  idToken: string | null;
  isAuthorizedAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verifies user token against Express Admin Auth Check endpoint.
  const verifyAdminAccess = useCallback(async () => {
    try {
      setAuthError(null);
      const token = await getIdToken(true);
      setIdToken(token);

      if (!token) {
        setIsAuthorizedAdmin(false);
        setAuthError('Failed to retrieve authentication token.');
        return;
      }

      const checkResponse = await adminApi.checkAuth(token);
      if (checkResponse.authenticated && checkResponse.authorized) {
        setIsAuthorizedAdmin(true);
      } else {
        setIsAuthorizedAdmin(false);
        setAuthError('User does not have active administrator permissions.');
      }
    } catch (err) {
      setIsAuthorizedAdmin(false);
      const message = err instanceof Error ? err.message : 'Administrator authorization failed.';
      setAuthError(message);
    }
  }, []);

  // Syncs Firebase Auth state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyAdminAccess();
      } else {
        setIdToken(null);
        setIsAuthorizedAdmin(false);
        setAuthError(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [verifyAdminAccess]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailPassword(email, pass);
      const loggedUser = userCredential.user;
      setUser(loggedUser);
      await verifyAdminAccess();
    } catch (err) {
      setIsAuthorizedAdmin(false);
      const msg = err instanceof Error ? err.message : 'Authentication failed. Invalid email or password.';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setUser(null);
      setIdToken(null);
      setIsAuthorizedAdmin(false);
      setAuthError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    if (user) {
      setIsLoading(true);
      await verifyAdminAccess();
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        idToken,
        isAuthorizedAdmin,
        isLoading,
        authError,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
