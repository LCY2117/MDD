import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserMode = 'patient' | 'caregiver';

interface UserContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userMode, setUserMode] = useState<UserMode>(() => {
    const saved = localStorage.getItem('userMode');
    return (saved as UserMode) || 'patient';
  });

  useEffect(() => {
    localStorage.setItem('userMode', userMode);
  }, [userMode]);

  return (
    <UserContext.Provider value={{ userMode, setUserMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
