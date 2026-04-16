import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  googleProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ?? null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginComGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const loginComEmail = (email, senha) => {
    return signInWithEmailAndPassword(auth, email, senha);
  };

  const cadastrarComEmail = (email, senha) => {
    return createUserWithEmailAndPassword(auth, email, senha);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      loginComGoogle,
      loginComEmail,
      cadastrarComEmail,
      logout,
    }),
    [currentUser, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
