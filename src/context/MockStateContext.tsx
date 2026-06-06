import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  uid: string;
  name: string;
  email: string;
  rollNumber: string;
};

interface MockStateContextType {
  user: User | null;
  pendingRequests: string[];
  approvedRequests: string[];
  login: () => void;
  logout: () => void;
  requestRegistration: (eventName: string) => void;
  approveRegistration: (eventName: string) => void;
  rejectRegistration: (eventName: string) => void;
}

const MockStateContext = createContext<MockStateContextType | undefined>(undefined);

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<string[]>([]);

  const login = () => {
    setUser({
      uid: 'operative-123',
      name: 'Operative Alpha',
      email: 'alpha@example.com',
      rollNumber: '2024-001'
    });
  };

  const logout = () => {
    setUser(null);
    setPendingRequests([]);
    setApprovedRequests([]);
  };

  const requestRegistration = (eventName: string) => {
    if (!pendingRequests.includes(eventName) && !approvedRequests.includes(eventName)) {
      setPendingRequests(prev => [...prev, eventName]);
    }
  };

  const approveRegistration = (eventName: string) => {
    setPendingRequests(prev => prev.filter(e => e !== eventName));
    if (!approvedRequests.includes(eventName)) {
      setApprovedRequests(prev => [...prev, eventName]);
    }
  };

  const rejectRegistration = (eventName: string) => {
    setPendingRequests(prev => prev.filter(e => e !== eventName));
  };

  return (
    <MockStateContext.Provider value={{
      user,
      pendingRequests,
      approvedRequests,
      login,
      logout,
      requestRegistration,
      approveRegistration,
      rejectRegistration
    }}>
      {children}
    </MockStateContext.Provider>
  );
}

export function useMockState() {
  const context = useContext(MockStateContext);
  if (context === undefined) {
    throw new Error('useMockState must be used within a MockStateProvider');
  }
  return context;
}
