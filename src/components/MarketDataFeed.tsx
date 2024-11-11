import React, { useEffect, useState } from 'react';
import { AscendexConnector } from '../services/AscendexConnector';

interface MarketData {
  close?: string;
  high?: string;
  low?: string;
  volume?: string;
  price_change_percent?: string;
}

interface MarketDataFeedProps {
  symbol: string;
  onDataUpdate: (data: MarketData) => void;
}

export default function MarketDataFeed({ symbol, onDataUpdate }: MarketDataFeedProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connector = new AscendexConnector();
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tickerData, stats24hr] = await Promise.all([
          connector.getMarketData(symbol),
          connector.get24HrStats(symbol)
        ]);

        if (!mounted) return;

        if (!tickerData || !stats24hr) {
          setError('Unable to fetch market data');
          return;
        }

        const combinedData = {
          close: tickerData.price,
          high: stats24hr.high,
          low: stats24hr.low,
          volume: stats24hr.volume,
          price_change_percent: stats24hr.price_change_percent
        };

        setMarketData(combinedData);
        onDataUpdate(combinedData);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to fetch market data');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [symbol, onDataUpdate]);

  if (loading && !marketData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading market data</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Last Price</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {marketData?.close || 'N/A'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">24h Change</label>
          <p className={`mt-1 text-lg font-semibold ${
            parseFloat(marketData?.price_change_percent || '0') >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {marketData?.price_change_percent ? `${marketData.price_change_percent}%` : 'N/A'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">24h High</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {marketData?.high || 'N/A'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">24h Low</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {marketData?.low || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}