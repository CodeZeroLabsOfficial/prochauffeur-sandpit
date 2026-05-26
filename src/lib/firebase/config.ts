import type { FirebaseOptions } from "firebase/app";

const REQUIRED_FIREBASE_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
] as const;

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getMissingFirebaseEnvVars(): string[] {
  return REQUIRED_FIREBASE_ENV_VARS.filter((name) => !process.env[name]);
}

export function isFirebaseConfigured(): boolean {
  return getMissingFirebaseEnvVars().length === 0;
}

export function getFirebaseSetupError(): string | null {
  const missing = getMissingFirebaseEnvVars();
  if (missing.length === 0) {
    return null;
  }

  return `Firebase is not configured. Add these environment variables: ${missing.join(", ")}.`;
}

export function getFirebaseConfig(): FirebaseOptions {
  return {
    apiKey: required(
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ),
    authDomain: required(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    ),
    projectId: required(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function getMapboxToken(): string {
  return required(
    "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN",
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  );
}
