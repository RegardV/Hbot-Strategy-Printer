import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FundingArbStrategy() {
  const [config, setConfig] = useState({
    spotExchange: 'binance_spot',
    perpExchange: 'binance_futures',
    tradingPair: 'ETH-USDT',
    positionSize: '1.0',
    minFundingRate: '0.01',
    maxLeverage: '3',
    stopLoss: '2.0',
    hedgeRatio: '1.0',
    minSpread: '0.1',
    rebalanceThreshold: '1.0'
  });

  // Generate sample funding rate data
  const generateFundingData = () => {
    const periods = 24; // 24 hours
    const labels = Array.from({ length: periods }, (_, i) => `Hour ${i}`);
    const fundingRates = Array.from({ length: periods }, () => 
      (Math.random() - 0.5) * 0.1
    );
    const spreads = Array.from({ length: periods }, () => 
      Math.random() * 0.5
    );
    
    return {
      labels,
      datasets: [
        {
          label: 'Funding Rate (%)',
          data: fundingRates,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Spot-Perp Spread (%)',
          data: spreads,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Funding Rate and Spread Analysis',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Rate (%)'
        }
      }
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Funding Rate Arbitrage Strategy Configuration
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Spot Exchange</label>
              <select
                value={config.spotExchange}
                onChange={(e) => setConfig({ ...config, spotExchange: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="binance_spot">Binance Spot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Perpetual Exchange</label>
              <select
                value={config.perpExchange}
                onChange={(e) => setConfig({ ...config, perpExchange: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="binance_futures">Binance Futures</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Trading Pair</label>
              <input
                type="text"
                value={config.tradingPair}
                onChange={(e) => setConfig({ ...config, tradingPair: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position Size</label>
              <input
                type="number"
                value={config.positionSize}
                onChange={(e) => setConfig({ ...config, positionSize: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Funding Rate (%)</label>
              <input
                type="number"
                value={config.minFundingRate}
                onChange={(e) => setConfig({ ...config, minFundingRate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Leverage</label>
              <input
                type="number"
                value={config.maxLeverage}
                onChange={(e) => setConfig({ ...config, maxLeverage: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stop Loss (%)</label>
              <input
                type="number"
                value={config.stopLoss}
                onChange={(e) => setConfig({ ...config, stopLoss: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hedge Ratio</label>
              <input
                type="number"
                value={config.hedgeRatio}
                onChange={(e) => setConfig({ ...config, hedgeRatio: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <Line options={options} data={generateFundingData()} />
      </div>

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
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Overview</h4>
                <p>
                  The Funding Rate Arbitrage strategy capitalizes on the difference between spot and perpetual
                  futures markets, taking advantage of funding rate payments while maintaining a delta-neutral position.
                </p>

                <h4 className="font-medium text-gray-700">Key Parameters</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Position Size:</strong> Total position value to trade</li>
                  <li><strong>Min Funding Rate:</strong> Minimum rate to trigger positions</li>
                  <li><strong>Max Leverage:</strong> Maximum allowed leverage</li>
                  <li><strong>Hedge Ratio:</strong> Ratio for hedging positions</li>
                  <li><strong>Stop Loss:</strong> Maximum allowable loss</li>
                </ul>

                <h4 className="font-medium text-gray-700">Strategy Process</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Monitor funding rates across exchanges</li>
                  <li>Identify profitable opportunities</li>
                  <li>Open hedged positions</li>
                  <li>Collect funding payments</li>
                  <li>Manage risk and rebalance as needed</li>
                </ol>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}