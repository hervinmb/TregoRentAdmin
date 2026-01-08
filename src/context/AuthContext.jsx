import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if user has admin role in Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setUser(currentUser);
            setIsAdmin(true);
          } else {
            // If not admin, sign out
            console.warn('User is not an admin');
            await firebaseSignOut(auth);
            setUser(null);
            setIsAdmin(false);
            // You might want to show an error message here or in the UI
            // For now, we just ensure state is cleared
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged will handle the role check
      // But we can also do a quick check here if needed to throw error immediately
      // simpler to let onAuthStateChanged handle the flow, 
      // but to provide immediate feedback to the login form, we might want to check here too.
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        await firebaseSignOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const value = {
    user,
    isAdmin,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
