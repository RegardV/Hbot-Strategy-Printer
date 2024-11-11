import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Switch } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const { demoMode, toggleDemoMode, canDisableDemo } = useSettings();

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Application Settings
          </h3>
          
          <div className="mt-6">
            <Switch.Group as="div" className="flex items-center">
              <Switch
                checked={demoMode}
                onChange={toggleDemoMode}
                disabled={!canDisableDemo}
                className={`${
                  demoMode ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  !canDisableDemo ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    demoMode ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <Switch.Label as="span" className="ml-3">
                <span className="text-sm font-medium text-gray-900">Demo Mode</span>
                <span className="text-sm text-gray-500 block">
                  When enabled, uses simulated market data instead of live exchange data
                </span>
              </Switch.Label>
            </Switch.Group>

            {!canDisableDemo && (
              <div className="mt-4 rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Demo Mode Required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        To disable demo mode, you need to successfully connect to an exchange. Please add and verify your exchange credentials in the Credentials section.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}