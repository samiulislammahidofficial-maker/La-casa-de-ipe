import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type User = {
  uid: string;
  name: string;
  email: string;
  rollNumber: string;
};

export interface Team {
  teamName: string;
  leaderUid: string;
  teammateUids: string[];
}

interface MockStateContextType {
  user: User | null;
  pendingRequests: string[];
  approvedRequests: string[];
  registeredTeams: Record<string, Team>;
  activeTerminalSession: { teamName: string; activeUserRoll: string } | null;
  login: () => void;
  logout: () => void;
  requestRegistration: (eventName: string, teamData?: Team) => void;
  approveRegistration: (eventName: string) => void;
  rejectRegistration: (eventName: string) => void;
  setActiveTerminalUser: (teamName: string, rollNumber: string | null) => void;
}

const MockStateContext = createContext<MockStateContextType | undefined>(undefined);

export function MockStateProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, userData, logout: authLogout } = useAuth();

  // Derive user from real AuthContext
  const user: User | null = firebaseUser && userData ? {
    uid: firebaseUser.uid,
    name: userData.name || firebaseUser.displayName || 'Operative',
    email: userData.email || firebaseUser.email || '',
    rollNumber: userData.studentId || '',
  } : null;

  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<string[]>([]);
  const [registeredTeams, setRegisteredTeams] = useState<Record<string, Team>>({});
  const [activeTerminalSession, setActiveTerminalSession] = useState<{ teamName: string; activeUserRoll: string } | null>(null);

  const login = () => {
    // Trigger the global login event — real auth handles the rest
    window.dispatchEvent(new CustomEvent('request-login'));
  };

  const logout = () => {
    authLogout();
    setPendingRequests([]);
    setApprovedRequests([]);
    setRegisteredTeams({});
    setActiveTerminalSession(null);
  };

  const requestRegistration = (eventName: string, teamData?: Team) => {
    if (!pendingRequests.includes(eventName) && !approvedRequests.includes(eventName)) {
      setPendingRequests(prev => [...prev, eventName]);
      if (teamData) {
        setRegisteredTeams(prev => ({ ...prev, [eventName]: teamData }));
      }
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
    setRegisteredTeams(prev => {
      const copy = { ...prev };
      delete copy[eventName];
      return copy;
    });
  };

  const setActiveTerminalUser = (teamName: string, rollNumber: string | null) => {
    if (rollNumber === null) {
      setActiveTerminalSession(null);
    } else {
      setActiveTerminalSession({ teamName, activeUserRoll: rollNumber });
    }
  };

  return (
    <MockStateContext.Provider value={{
      user,
      pendingRequests,
      approvedRequests,
      registeredTeams,
      activeTerminalSession,
      login,
      logout,
      requestRegistration,
      approveRegistration,
      rejectRegistration,
      setActiveTerminalUser
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
