"use client";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { getFirebaseSetupError, isFirebaseConfigured } from "@/lib/firebase/config";
import { fetchUserProfile } from "@/lib/prochauffeur/firestore";
import type { AppUser } from "@/lib/prochauffeur/types";

type AuthState = {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupError = getFirebaseSetupError();
    if (!isFirebaseConfigured()) {
      setError(setupError);
      setLoading(false);
      return;
    }

    let auth;
    try {
      auth = getFirebaseAuth();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not initialize Firebase.");
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setAppUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await fetchUserProfile(user.uid);
        if (!profile || profile.role !== "admin") {
          await firebaseSignOut(auth);
          setAppUser(null);
          setError("Only fleet administrator accounts can access this console.");
          setLoading(false);
          return;
        }
        setAppUser(profile);
        setError(null);
      } catch (e) {
        setAppUser(null);
        setError(e instanceof Error ? e.message : "Could not load your profile.");
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const setupError = getFirebaseSetupError();
    if (setupError) {
      setError(setupError);
      throw new Error(setupError);
    }

    setError(null);
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password
      );
      const profile = await fetchUserProfile(credential.user.uid);
      if (!profile || profile.role !== "admin") {
        await firebaseSignOut(getFirebaseAuth());
        throw new Error("Only fleet administrator accounts can access this console.");
      }
      setAppUser(profile);
      setFirebaseUser(credential.user);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Sign in failed. Check your credentials.";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(getFirebaseAuth());
    setAppUser(null);
    setFirebaseUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      appUser,
      loading,
      isAdmin: appUser?.role === "admin",
      error,
      signIn,
      signOut,
      clearError,
    }),
    [appUser, clearError, error, firebaseUser, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
