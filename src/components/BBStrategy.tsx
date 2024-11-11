import React, { useState, useEffect } from 'react';
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

export default function BBStrategy() {
  const [config, setConfig] = useState({
    exchange: 'binance_paper_trade',
    tradingPair: 'ETH-USDT',
    interval: '3m',
    bbLength: 100,
    bbStd: 2.0,
    bbLongThreshold: 0.0,
    bbShortThreshold: 1.0,
  });

  // Simulated price data
  const generatePriceData = () => {
    const basePrice = 2000;
    const periods = 100;
    const prices = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < periods; i++) {
      currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02);
      prices.push(currentPrice);
    }
    return prices;
  };

  // Calculate Bollinger Bands
  const calculateBB = (prices: number[], length: number, std: number) => {
    const middle = [];
    const upper = [];
    const lower = [];

    for (let i = 0; i < prices.length; i++) {
      if (i < length - 1) {
        middle.push(null);
        upper.push(null);
        lower.push(null);
        continue;
      }

      const slice = prices.slice(i - length + 1, i + 1);
      const avg = slice.reduce((a, b) => a + b) / length;
      const stdDev = Math.sqrt(slice.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / length);

      middle.push(avg);
      upper.push(avg + stdDev * std);
      lower.push(avg - stdDev * std);
    }

    return { middle, upper, lower };
  };

  const prices = generatePriceData();
  const labels = Array.from({ length: prices.length }, (_, i) => i.toString());
  const bb = calculateBB(prices, config.bbLength, config.bbStd);

  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'BB Middle',
        data: bb.middle,
        borderColor: 'rgb(128, 128, 128)',
        borderDash: [5, 5],
        tension: 0.1,
      },
      {
        label: 'BB Upper',
        data: bb.upper,
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1,
      },
      {
        label: 'BB Lower',
        data: bb.lower,
        borderColor: 'rgb(53, 162, 235)',
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bollinger Bands Strategy Visualization',
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Bollinger Bands Strategy Configuration
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Exchange</label>
              <select
                value={config.exchange}
                onChange={(e) => setConfig({ ...config, exchange: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="binance_paper_trade">Binance Paper Trade</option>
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
              <label className="block text-sm font-medium text-gray-700">Interval</label>
              <select
                value={config.interval}
                onChange={(e) => setConfig({ ...config, interval: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="1m">1m</option>
                <option value="3m">3m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1h">1h</option>
                <option value="4h">4h</option>
                <option value="1d">1d</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">BB Length</label>
              <input
                type="number"
                value={config.bbLength}
                onChange={(e) => setConfig({ ...config, bbLength: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">BB Standard Deviation</label>
              <input
                type="number"
                value={config.bbStd}
                onChange={(e) => setConfig({ ...config, bbStd: parseFloat(e.target.value) })}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Long Threshold</label>
              <input
                type="number"
                value={config.bbLongThreshold}
                onChange={(e) => setConfig({ ...config, bbLongThreshold: parseFloat(e.target.value) })}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Threshold</label>
              <input
                type="number"
                value={config.bbShortThreshold}
                onChange={(e) => setConfig({ ...config, bbShortThreshold: parseFloat(e.target.value) })}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <Line options={options} data={data} />
      </div>

      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white px-4 py-4 text-left text-sm font-medium text-gray-900 shadow hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
              <span>Strategy Tutorial</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-white shadow rounded-lg mt-2">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Overview</h4>
                <p>
                  The Bollinger Bands strategy is a technical analysis tool that uses standard deviations of price movement to generate trading signals.
                </p>

                <h4 className="font-medium text-gray-700">Key Parameters</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>BB Length:</strong> The number of periods used to calculate the moving average</li>
                  <li><strong>BB Standard Deviation:</strong> The number of standard deviations for the bands</li>
                  <li><strong>Long/Short Thresholds:</strong> Trigger points for entering positions based on BB position</li>
                  <li><strong>Interval:</strong> The timeframe for each candle</li>
                </ul>

                <h4 className="font-medium text-gray-700">How It Works</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Calculates a simple moving average (middle band)</li>
                  <li>Computes standard deviation of price movement</li>
                  <li>Creates upper and lower bands using standard deviations</li>
                  <li>Generates buy signals when price crosses below lower threshold</li>
                  <li>Generates sell signals when price crosses above upper threshold</li>
                </ol>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}