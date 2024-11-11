import React from 'react';

export default function Tutorial() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Simple PMM Strategy Tutorial
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <h4 className="font-medium text-gray-700 mt-4">Overview</h4>
          <p className="mt-2">
            The Simple PMM (Pure Market Making) strategy is a basic market making bot that places and maintains buy and sell orders around a reference price.
          </p>

          <h4 className="font-medium text-gray-700 mt-4">Key Parameters</h4>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Exchange:</strong> The exchange where the bot will trade</li>
            <li><strong>Trading Pair:</strong> The trading pair for placing orders (e.g., ETH-USDT)</li>
            <li><strong>Order Amount:</strong> Size of each order in base asset</li>
            <li><strong>Bid/Ask Spread:</strong> Distance from reference price for buy/sell orders</li>
            <li><strong>Order Refresh Time:</strong> How often orders are canceled and replaced</li>
            <li><strong>Price Type:</strong> Reference price source (mid price or last traded price)</li>
          </ul>

          <h4 className="font-medium text-gray-700 mt-4">How It Works</h4>
          <ol className="list-decimal pl-5 mt-2 space-y-2">
            <li>The bot calculates a reference price based on the selected price type</li>
            <li>Places buy order below reference price by bid spread percentage</li>
            <li>Places sell order above reference price by ask spread percentage</li>
            <li>Cancels and replaces orders every refresh interval</li>
            <li>Automatically adjusts orders based on available balance</li>
          </ol>
        </div>
      </div>
    </div>
  );
}