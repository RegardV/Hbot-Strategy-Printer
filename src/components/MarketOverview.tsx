import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { MarketService } from '../services/MarketService';
import { useSettings } from '../contexts/SettingsContext';
import { SUPPORTED_EXCHANGES } from '../services/ExchangeService';

interface SpreadData {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  spreadPercentage: number;
  volume24h: number;
  lastUpdate: Date;
  price: number;
  priceChange24h: number;
}

export default function MarketOverview() {
  const [isConnected, setIsConnected] = useState(false);
  const [spreads, setSpreads] = useState<SpreadData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const { demoMode, activeCredentials } = useSettings();

  const fetchMarketData = async (marketService: MarketService) => {
    try {
      setError(null);
      const data = await marketService.getTopPairSpreads();
      setSpreads(data);
    } catch (err) {
      setError('Failed to fetch market data');
    }
  };

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const initializeMarketData = async () => {
      if (!demoMode && activeCredentials) {
        setIsLoading(true);
        try {
          const marketService = new MarketService(activeCredentials);
          await marketService.connect();
          setIsConnected(true);
          
          if (mounted) {
            await fetchMarketData(marketService);
            interval = setInterval(() => fetchMarketData(marketService), 10000);
            setRefreshInterval(interval);
          }
        } catch (err) {
          if (mounted) {
            setError('Failed to connect to exchange');
            setIsConnected(false);
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      } else {
        // In demo mode, create market service without credentials
        const marketService = new MarketService();
        await fetchMarketData(marketService);
        interval = setInterval(() => fetchMarketData(marketService), 10000);
        setRefreshInterval(interval);
        setIsConnected(true);
      }
    };

    initializeMarketData();

    return () => {
      mounted = false;
      if (interval) {
        clearInterval(interval);
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [demoMode, activeCredentials]);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Market Overview
              </h3>
              {demoMode && (
                <p className="mt-1 text-sm text-gray-500">
                  Demo Mode: Using simulated market data
                </p>
              )}
              {!demoMode && activeCredentials && (
                <p className="mt-1 text-sm text-gray-500">
                  Connected to: {SUPPORTED_EXCHANGES[activeCredentials.exchange].name}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {(isConnected || demoMode) && !isLoading && (
            <div className="mt-8">
              <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Trading Pair
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Price
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              24h Change
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Spread
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Spread %
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              24h Volume
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Last Update
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {spreads.map((item) => (
                            <tr key={item.symbol}>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {item.symbol}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                                {item.price.toFixed(8)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                <span className={`inline-flex items-center ${
                                  item.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {item.priceChange24h > 0 ? (
                                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                                  ) : (
                                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                                  )}
                                  {Math.abs(item.priceChange24h).toFixed(2)}%
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                                {item.spread.toFixed(8)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                <span className={`inline-flex items-center ${
                                  item.spreadPercentage > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {item.spreadPercentage.toFixed(4)}%
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                                {item.volume24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                                {format(item.lastUpdate, 'HH:mm:ss')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}