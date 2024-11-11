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

export default function StrategyVisualizer() {
  const [config, setConfig] = useState({
    exchange: 'binance_paper_trade',
    tradingPair: 'ETH-USDT',
    orderAmount: 0.01,
    bidSpread: 0.001,
    askSpread: 0.001,
    orderRefreshTime: 15,
    priceType: 'mid',
    makerFee: 0.001,
    takerFee: 0.002,
    bounceCount: 3,
    priceVolatility: 0.005
  });

  const calculatePnL = (prices: number[], fees: { maker: number; taker: number }) => {
    let pnl = 0;
    let position = 0;
    const pnlHistory = [];
    
    for (let i = 1; i < prices.length; i++) {
      const prevPrice = prices[i - 1];
      const currentPrice = prices[i];
      
      if (currentPrice < prevPrice && position <= 0) {
        position = 1;
        pnl -= currentPrice * fees.maker;
      } else if (currentPrice > prevPrice && position >= 0) {
        position = -1;
        pnl -= currentPrice * fees.maker;
      }
      
      if (position !== 0) {
        pnl += position * (currentPrice - prevPrice);
      }
      
      pnlHistory.push(pnl);
    }
    
    return pnlHistory;
  };

  const generatePriceData = () => {
    const mockPrice = 2000;
    const periods = 100;
    const prices = [];
    let currentPrice = mockPrice;
    let trend = 1;
    let bounceCount = 0;
    
    for (let i = 0; i < periods; i++) {
      if (bounceCount < config.bounceCount) {
        currentPrice = currentPrice * (1 + (trend * config.priceVolatility));
        if (Math.abs(currentPrice - mockPrice) / mockPrice > config.askSpread * 2) {
          trend *= -1;
          bounceCount++;
        }
      } else {
        currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.002);
      }
      prices.push(currentPrice);
    }
    return prices;
  };

  const prices = generatePriceData();
  const pnlData = calculatePnL(prices, {
    maker: config.makerFee,
    taker: config.takerFee
  });

  const labels = Array.from({ length: prices.length }, (_, i) => i.toString());
  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Bid Price',
        data: prices.map(p => p * (1 - config.bidSpread)),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Ask Price',
        data: prices.map(p => p * (1 + config.askSpread)),
        borderColor: 'rgb(53, 162, 235)',
        borderDash: [5, 5],
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Cumulative PnL',
        data: pnlData,
        borderColor: 'rgb(128, 0, 128)',
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
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
        text: 'Price Levels and PnL Visualization',
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
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'PnL'
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
            Strategy Configuration
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
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
              <label className="block text-sm font-medium text-gray-700">Order Amount</label>
              <input
                type="number"
                value={config.orderAmount}
                onChange={(e) => setConfig({ ...config, orderAmount: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bid Spread</label>
              <input
                type="number"
                value={config.bidSpread}
                onChange={(e) => setConfig({ ...config, bidSpread: parseFloat(e.target.value) })}
                step="0.0001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ask Spread</label>
              <input
                type="number"
                value={config.askSpread}
                onChange={(e) => setConfig({ ...config, askSpread: parseFloat(e.target.value) })}
                step="0.0001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Maker Fee</label>
              <input
                type="number"
                value={config.makerFee}
                onChange={(e) => setConfig({ ...config, makerFee: parseFloat(e.target.value) })}
                step="0.0001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Taker Fee</label>
              <input
                type="number"
                value={config.takerFee}
                onChange={(e) => setConfig({ ...config, takerFee: parseFloat(e.target.value) })}
                step="0.0001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bounce Count</label>
              <input
                type="number"
                value={config.bounceCount}
                onChange={(e) => setConfig({ ...config, bounceCount: parseInt(e.target.value) })}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price Volatility</label>
              <input
                type="number"
                value={config.priceVolatility}
                onChange={(e) => setConfig({ ...config, priceVolatility: parseFloat(e.target.value) })}
                step="0.001"
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
                  The Simple PMM (Pure Market Making) strategy is a basic market making bot that places and maintains buy and sell orders around a reference price, with PnL projection based on price bounces and fees.
                </p>

                <h4 className="font-medium text-gray-700">Key Parameters</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Exchange & Trading Pair:</strong> The exchange and pair where the bot will trade</li>
                  <li><strong>Order Amount:</strong> Size of each order in base asset</li>
                  <li><strong>Bid/Ask Spread:</strong> Distance from reference price for buy/sell orders</li>
                  <li><strong>Maker/Taker Fees:</strong> Exchange fees for providing/taking liquidity</li>
                  <li><strong>Bounce Count:</strong> Number of price reversals to simulate</li>
                  <li><strong>Price Volatility:</strong> Magnitude of price movements</li>
                </ul>

                <h4 className="font-medium text-gray-700">PnL Calculation</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Simulates trading based on price movements</li>
                  <li>Includes maker and taker fees in calculations</li>
                  <li>Shows cumulative PnL over time</li>
                  <li>Projects potential returns based on bounce patterns</li>
                </ul>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}