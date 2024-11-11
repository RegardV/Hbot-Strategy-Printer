import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

export default function BaseStrategy() {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Base Strategy Implementation
          </h3>
          <div className="mt-4 prose prose-sm text-gray-500">
            <p>
              The Base Strategy serves as the foundation for all trading strategies in the system. 
              It provides essential functionality and interfaces that other strategies can build upon.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Core Components</h4>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">ScriptConfigBase</h5>
              <p className="text-sm text-gray-500">
                Base configuration class for script strategies. Provides the foundation for strategy-specific configurations.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">ScriptStrategyBase</h5>
              <p className="text-sm text-gray-500">
                Core strategy class that implements basic functionality and simplifies strategy creation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white px-4 py-4 text-left text-sm font-medium text-gray-900 shadow hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
              <span>Implementation Details</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-white shadow rounded-lg mt-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Key Methods</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li><code>init_markets</code>: Initializes market connectors and trading pairs</li>
                    <li><code>tick</code>: Main entry point for strategy execution</li>
                    <li><code>buy/sell</code>: Wrapper functions for order execution</li>
                    <li><code>get_active_orders</code>: Retrieves current active orders</li>
                    <li><code>format_status</code>: Generates strategy status report</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Features</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Market connector management</li>
                    <li>Order tracking and management</li>
                    <li>Balance monitoring</li>
                    <li>Position management</li>
                    <li>Status reporting</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Usage Example</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg mt-2 overflow-x-auto">
                    <code>{`class MyStrategy(ScriptStrategyBase):
    def __init__(self, connectors: Dict[str, ConnectorBase]):
        super().__init__(connectors)
        
    def on_tick(self):
        # Implement strategy logic here
        pass`}</code>
                  </pre>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Documentation</h4>
          <div className="prose prose-sm text-gray-500">
            <h5 className="font-medium text-gray-700">Strategy Development Flow</h5>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Create a new strategy class inheriting from ScriptStrategyBase</li>
              <li>Define strategy-specific configuration if needed</li>
              <li>Implement the init_markets class method</li>
              <li>Override the on_tick method with strategy logic</li>
              <li>Implement additional helper methods as needed</li>
            </ol>

            <h5 className="font-medium text-gray-700 mt-4">Best Practices</h5>
            <ul className="list-disc pl-5 space-y-2">
              <li>Always call super().__init__() in strategy constructor</li>
              <li>Use provided wrapper methods for order management</li>
              <li>Implement proper error handling</li>
              <li>Maintain clean separation of concerns</li>
              <li>Document strategy-specific parameters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}