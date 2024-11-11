import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExchangeCredentials } from '../services/CredentialsManager';

interface SettingsContextType {
  demoMode: boolean;
  toggleDemoMode: () => void;
  canDisableDemo: boolean;
  setCanDisableDemo: (value: boolean) => void;
  activeCredentials?: ExchangeCredentials;
  setActiveCredentials: (credentials?: ExchangeCredentials) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [demoMode, setDemoMode] = useState(true);
  const [canDisableDemo, setCanDisableDemo] = useState(false);
  const [activeCredentials, setActiveCredentials] = useState<ExchangeCredentials>();

  const toggleDemoMode = () => {
    if (canDisableDemo) {
      setDemoMode(prev => !prev);
    }
  };

  const value = {
    demoMode,
    toggleDemoMode,
    canDisableDemo,
    setCanDisableDemo,
    activeCredentials,
    setActiveCredentials
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}