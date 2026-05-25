'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Member } from './types';

interface AuthContextType {
  user: User | null;
  member: Member | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, member: null, loading: true,
  logout: async () => {}, isAdmin: false, isStaff: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, 'members', u.uid));
        if (snap.exists()) setMember(snap.data() as Member);
      } else {
        setMember(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = async () => { await signOut(auth); setMember(null); };
  const isAdmin = member?.role === 'admin';
  const isStaff = member?.role === 'staff' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, member, loading, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
