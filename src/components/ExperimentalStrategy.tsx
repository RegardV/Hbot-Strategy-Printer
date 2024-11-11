import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useExchange } from '../contexts/ExchangeContext';
import { useSettings } from '../contexts/SettingsContext';
import CredentialsManager from './CredentialsManager';
import { ExchangeCredentials } from '../services/CredentialsManager';
import { SUPPORTED_EXCHANGES } from '../services/ExchangeService';

export default function ExperimentalStrategy() {
  const { connectExchange, isConnected } = useExchange();
  const { demoMode } = useSettings();
  
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    exchange: 'binance_paper_trade',
    tradingPair: 'ETH-USDT',
    baseAskPrice: '0.00000000',
    totalSpread: '0.00000000',
    stopLossPercent: '2.00',
    high24h: '0.00000000',
    low24h: '0.00000000',
    volume24h: '0.00000000',
    volume36h: '0.00000000',
    direction24h: '0.00',
    rsiValue: '50.00',
    currentBuyPrice: '0.00000000',
    currentSellPrice: '0.00000000',
    predictedPrice: '0.00000000',
    minBuyPrice: '0.00000000',
    maxBuyPrice: '0.00000000',
    minSellPrice: '0.00000000',
    maxSellPrice: '0.00000000'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    let value = e.target.value;
    
    if (value === '') {
      setConfig(prev => ({ ...prev, [field]: value }));
      return;
    }

    value = value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join('')}`;
    }

    if (parts.length === 2 && parts[1].length > 8) {
      value = `${parts[0]}.${parts[1].slice(0, 8)}`;
    }

    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    let value = config[field as keyof typeof config];
    if (value === '') {
      value = '0';
    }
    
    const parts = value.split('.');
    const formattedValue = `${parts[0]}.${(parts[1] || '').padEnd(8, '0')}`;
    
    setConfig(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleCredentialsSelect = async (credentials: ExchangeCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await connectExchange(credentials.exchange, credentials);
      setShowCredentials(false);
    } catch (err) {
      setError('Failed to connect to exchange');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Configuration UI */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Experimental Strategy Configuration
            </h3>
            <div className="flex space-x-4">
              {!demoMode && (
                <button
                  onClick={() => setShowCredentials(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-2" />
                  Credentials
                </button>
              )}
              <button
                onClick={() => setEditMode(!editMode)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editMode ? 'Lock Values' : 'Edit Values'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Exchange Selection */}
          <div className="mb-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Exchange</label>
              <select
                value={config.exchange}
                onChange={(e) => setConfig(prev => ({ ...prev, exchange: e.target.value }))}
                disabled={!editMode}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
              >
                {Object.entries(SUPPORTED_EXCHANGES).map(([id, exchange]) => (
                  <option key={id} value={id}>{exchange.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Trading Pair</label>
              <input
                type="text"
                value={config.tradingPair}
                onChange={(e) => setConfig(prev => ({ ...prev, tradingPair: e.target.value }))}
                disabled={!editMode}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Market Data Section */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Market Data</h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {Object.entries(config)
                .filter(([key]) => ['high24h', 'low24h', 'volume24h', 'volume36h', 'direction24h', 'rsiValue'].includes(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, key)}
                      onBlur={() => handleBlur(key)}
                      disabled={!editMode}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Price Levels Section */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Price Levels</h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {Object.entries(config)
                .filter(([key]) => ['baseAskPrice', 'totalSpread', 'currentBuyPrice', 'currentSellPrice', 'predictedPrice'].includes(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, key)}
                      onBlur={() => handleBlur(key)}
                      disabled={!editMode}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Risk Management Section */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Management</h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {Object.entries(config)
                .filter(([key]) => ['stopLossPercent', 'minBuyPrice', 'maxBuyPrice', 'minSellPrice', 'maxSellPrice'].includes(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, key)}
                      onBlur={() => handleBlur(key)}
                      disabled={!editMode}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Tutorial Section */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white px-4 py-4 text-left text-sm font-medium text-gray-900 shadow hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
              <span>Strategy Details</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-white shadow rounded-lg mt-2">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Overview</h4>
                  <p className="mt-2">
                    This experimental trading strategy implements a dynamic ping-pong trading approach with market direction analysis and risk management.
                    The strategy uses 24-hour market data and RSI indicators to determine optimal entry points and subsequent trading levels.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900">Key Components</h4>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-700">1. Market Analysis</h5>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li><strong>24hr High/Low:</strong> Establishes the trading range baseline</li>
                      <li><strong>24hr Volume:</strong> Indicates market activity level</li>
                      <li><strong>36hr Volume:</strong> Provides volume trend comparison</li>
                      <li><strong>24hr Direction:</strong> Shows overall market trend percentage</li>
                      <li><strong>RSI Indicator:</strong> Determines market momentum and potential direction</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium text-gray-700">2. Entry Strategy</h5>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong>Initial Direction Assessment:</strong>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Uses RSI to determine market direction (Up/Down)</li>
                          <li>Analyzes 24hr trend percentage</li>
                          <li>Decides whether to start with a buy or sell order</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Price Level Determination:</strong>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Base Ask Price: Current market ask price</li>
                          <li>Total Spread: Desired trading range</li>
                          <li>Calculates buy and sell prices based on spread</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium text-gray-700">3. Ping-Pong Trading Levels</h5>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li><strong>Level 1:</strong> Base spread</li>
                      <li><strong>Level 2:</strong> 1.5x base spread</li>
                      <li><strong>Level 3:</strong> 2x base spread</li>
                    </ul>
                    <p className="mt-2">Each level includes buy price, sell price, and ROI calculation.</p>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium text-gray-700">4. Risk Management</h5>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      <li>Stop Loss Percentage</li>
                      <li>Price Boundaries:
                        <ul className="pl-5 space-y-1">
                          <li>Minimum Buy Price</li>
                          <li>Maximum Buy Price</li>
                          <li>Minimum Sell Price</li>
                          <li>Maximum Sell Price</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900">Important Notes</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Always start with small position sizes</li>
                    <li>Monitor ROI calculations for each level</li>
                    <li>Regularly check market direction indicators</li>
                    <li>Adjust spreads based on market volatility</li>
                    <li>Keep stop-loss orders active</li>
                    <li>Review and adjust risk parameters regularly</li>
                  </ul>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Credentials Manager Dialog */}
      {showCredentials && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={() => setShowCredentials(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CredentialsManager onCredentialsSelect={handleCredentialsSelect} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}