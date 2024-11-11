import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExchangeService, ExchangeConfig, SUPPORTED_EXCHANGES } from '../services/ExchangeService';
import { ExchangeCredentials } from '../services/CredentialsManager';
import { useSettings } from './SettingsContext';

interface ExchangeContextType {
  currentExchange?: ExchangeService;
  isConnected: boolean;
  connectExchange: (exchange: string, credentials: ExchangeCredentials) => Promise<boolean>;
  disconnectExchange: () => void;
  exchangeConfig?: ExchangeConfig;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

interface ExchangeProviderProps {
  children: ReactNode;
}

export function ExchangeProvider({ children }: ExchangeProviderProps) {
  const [currentExchange, setCurrentExchange] = useState<ExchangeService>();
  const [isConnected, setIsConnected] = useState(false);
  const [exchangeConfig, setExchangeConfig] = useState<ExchangeConfig>();
  const { demoMode } = useSettings();

  useEffect(() => {
    return () => {
      if (currentExchange) {
        currentExchange.disconnect();
      }
    };
  }, []);

  const connectExchange = async (exchange: string, credentials: ExchangeCredentials): Promise<boolean> => {
    if (demoMode) {
      return true;
    }

    try {
      const exchangeService = new ExchangeService(exchange);
      const connected = await exchangeService.connect(credentials);
      
      if (connected) {
        setCurrentExchange(exchangeService);
        setIsConnected(true);
        setExchangeConfig(exchangeService.getExchangeInfo());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect to exchange:', error);
      return false;
    }
  };

  const disconnectExchange = () => {
    if (currentExchange) {
      currentExchange.disconnect();
      setCurrentExchange(undefined);
      setIsConnected(false);
      setExchangeConfig(undefined);
    }
  };

  const value = {
    currentExchange,
    isConnected,
    connectExchange,
    disconnectExchange,
    exchangeConfig
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
}