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

export default function TWAPStrategy() {
  const [config, setConfig] = useState({
    exchange: 'binance_paper_trade',
    tradingPair: 'ETH-USDT',
    totalQuantity: '1.0',
    numIntervals: '10',
    intervalDuration: '300', // 5 minutes in seconds
    startTime: '',
    endTime: '',
    currentInterval: '0',
    quantityPerInterval: '0.1',
    priceLimit: '0.00',
    slippage: '0.1'
  });

  // Generate sample execution data
  const generateExecutionData = () => {
    const intervals = parseInt(config.numIntervals);
    const labels = Array.from({ length: intervals }, (_, i) => `Interval ${i + 1}`);
    const basePrice = 2000;
    const executionPrices = Array.from({ length: intervals }, () => 
      basePrice + (Math.random() - 0.5) * 20
    );
    const quantities = Array(intervals).fill(parseFloat(config.quantityPerInterval));
    
    return {
      labels,
      datasets: [
        {
          label: 'Execution Price',
          data: executionPrices,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Quantity',
          data: quantities,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
          yAxisID: 'quantity'
        }
      ]
    };
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'TWAP Execution Analysis',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Price'
        }
      },
      quantity: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Quantity'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            TWAP Strategy Configuration
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
              <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
              <input
                type="number"
                value={config.totalQuantity}
                onChange={(e) => setConfig({ ...config, totalQuantity: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Intervals</label>
              <input
                type="number"
                value={config.numIntervals}
                onChange={(e) => setConfig({ ...config, numIntervals: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Interval Duration (seconds)</label>
              <input
                type="number"
                value={config.intervalDuration}
                onChange={(e) => setConfig({ ...config, intervalDuration: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price Limit</label>
              <input
                type="number"
                value={config.priceLimit}
                onChange={(e) => setConfig({ ...config, priceLimit: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slippage (%)</label>
              <input
                type="number"
                value={config.slippage}
                onChange={(e) => setConfig({ ...config, slippage: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <Line options={options} data={generateExecutionData()} />
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
                  Time-Weighted Average Price (TWAP) strategy divides a large order into smaller pieces
                  and executes them at regular time intervals to minimize market impact and achieve a price
                  close to the time-weighted average price.
                </p>

                <h4 className="font-medium text-gray-700">Key Parameters</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Total Quantity:</strong> The total amount to be executed</li>
                  <li><strong>Number of Intervals:</strong> How many pieces to divide the order into</li>
                  <li><strong>Interval Duration:</strong> Time between executions</li>
                  <li><strong>Price Limit:</strong> Maximum/minimum acceptable price</li>
                  <li><strong>Slippage:</strong> Allowed deviation from target price</li>
                </ul>

                <h4 className="font-medium text-gray-700">Execution Process</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Calculate quantity per interval</li>
                  <li>Set up execution schedule</li>
                  <li>Monitor market conditions</li>
                  <li>Execute trades at specified intervals</li>
                  <li>Track and analyze performance</li>
                </ol>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}