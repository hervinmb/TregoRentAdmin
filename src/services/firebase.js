import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper function to get env variable with fallback
function getEnvVar(key) {
  // Try Vite's import.meta.env first
  let value = import.meta.env[key];
  
  // If not found, try to read from window (for runtime injection)
  if (!value && typeof window !== 'undefined' && window.__ENV__) {
    value = window.__ENV__[key];
  }
  
  return value;
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

// Debug: Log what Vite is actually reading
console.log('🔍 Debugging environment variables:');
console.log('import.meta.env keys:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_FIREBASE')));
requiredEnvVars.forEach((varName) => {
  const value = import.meta.env[varName];
  console.log(`${varName}:`, value ? `"${value.substring(0, 10)}..." (length: ${value.length})` : 'undefined');
});

const missingVars = requiredEnvVars.filter(
  (varName) => {
    const value = import.meta.env[varName];
    return !value || 
           (typeof value === 'string' && value.trim() === '') || 
           (typeof value === 'string' && value.includes('your_')) || 
           (typeof value === 'string' && value.includes('_here'));
  }
);

if (missingVars.length > 0) {
  console.error('❌ Missing or invalid Firebase environment variables:');
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📝 Please check your .env file in the root directory.');
  console.error('🔄 Make sure to restart the dev server after adding/updating .env file.');
}

// Check if API key is valid (not empty and not placeholder)
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_') || firebaseConfig.apiKey.length < 20) {
  console.warn('Firebase API Key is likely invalid or missing. Check .env file.');
}

// Initialize Firebase
let app;
try {
  console.log('🔥 Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully!');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
