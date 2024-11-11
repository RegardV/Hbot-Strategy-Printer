import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon, TrashIcon, CheckCircleIcon, QuestionMarkCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CredentialsManager as CredentialsService, ExchangeCredentials } from '../services/CredentialsManager';
import { SUPPORTED_EXCHANGES, ExchangeService } from '../services/ExchangeService';
import { useSettings } from '../contexts/SettingsContext';

interface CredentialsManagerProps {
  onCredentialsSelect?: (credentials: ExchangeCredentials) => void;
  standalone?: boolean;
}

export default function CredentialsManagerComponent({ onCredentialsSelect, standalone = false }: CredentialsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [credentials, setCredentials] = useState<ExchangeCredentials[]>([]);
  const [newCredential, setNewCredential] = useState<Partial<ExchangeCredentials>>({
    exchange: Object.keys(SUPPORTED_EXCHANGES)[0]
  });
  const [additionalFields, setAdditionalFields] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const { setCanDisableDemo, setActiveCredentials } = useSettings();

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    const saved = CredentialsService.getCredentials();
    setCredentials(saved);
  };

  const validateField = (field: string, value: string): string | null => {
    const exchange = SUPPORTED_EXCHANGES[newCredential.exchange!];
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (exchange.fieldValidation?.[field]) {
      return exchange.fieldValidation[field](value) ? null : `Invalid ${field} format`;
    }
    return null;
  };

  const handleSave = () => {
    try {
      if (!newCredential.name?.trim()) {
        setError('Please provide a name for these credentials');
        return;
      }

      const selectedExchange = SUPPORTED_EXCHANGES[newCredential.exchange!];
      const errors: Record<string, string> = {};
      let hasErrors = false;

      selectedExchange.requiredFields.forEach(field => {
        const value = field === 'apiKey' || field === 'secretKey'
          ? newCredential[field]
          : additionalFields[field];
        const error = validateField(field, value || '');
        if (error) {
          errors[field] = error;
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setFieldErrors(errors);
        return;
      }

      const credentialToSave: ExchangeCredentials = {
        id: Date.now().toString(),
        name: newCredential.name.trim(),
        exchange: newCredential.exchange!,
        apiKey: newCredential.apiKey!.trim(),
        secretKey: newCredential.secretKey!.trim(),
        additionalFields: Object.keys(additionalFields).length > 0 
          ? Object.fromEntries(
              Object.entries(additionalFields).map(([k, v]) => [k, v.trim()])
            ) 
          : undefined
      };

      CredentialsService.saveCredentials(credentialToSave);
      loadCredentials();
      resetForm();
      setSuccessMessage('Credentials saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to save credentials');
    }
  };

  const testConnection = async (credentials: ExchangeCredentials) => {
    setIsTesting(prev => ({ ...prev, [credentials.id]: true }));
    setTestResults(prev => ({ ...prev, [credentials.id]: false }));
    try {
      const exchangeService = new ExchangeService(credentials.exchange);
      const connected = await exchangeService.connect(credentials);
      setTestResults(prev => ({ ...prev, [credentials.id]: connected }));
      
      if (connected) {
        setSuccessMessage(`Successfully connected to ${SUPPORTED_EXCHANGES[credentials.exchange].name}`);
        setCanDisableDemo(true);
        setActiveCredentials(credentials);
      } else {
        setError(`Failed to connect to ${SUPPORTED_EXCHANGES[credentials.exchange].name}`);
      }
    } catch (err) {
      setError('Connection test failed');
      setTestResults(prev => ({ ...prev, [credentials.id]: false }));
    } finally {
      setIsTesting(prev => ({ ...prev, [credentials.id]: false }));
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setNewCredential({ exchange: Object.keys(SUPPORTED_EXCHANGES)[0] });
    setAdditionalFields({});
    setError(null);
    setShowHelp(null);
    setFieldErrors({});
  };

  const handleDelete = (id: string) => {
    try {
      CredentialsService.deleteCredentials(id);
      loadCredentials();
      setSuccessMessage('Credentials deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete credentials');
    }
  };

  const handleExchangeChange = (exchange: string) => {
    setNewCredential(prev => ({ ...prev, exchange }));
    setAdditionalFields({});
    setError(null);
    setShowHelp(null);
    setFieldErrors({});
  };

  const renderFieldHelp = (field: string) => {
    const exchange = SUPPORTED_EXCHANGES[newCredential.exchange!];
    return (
      <div className="mt-1 text-sm text-gray-500">
        {exchange.fieldDescriptions?.[field] || `Enter your ${field} from ${exchange.name}`}
        {exchange.fieldLinks?.[field] && (
          <a
            href={exchange.fieldLinks[field]}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-indigo-600 hover:text-indigo-500"
          >
            Learn more
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Exchange Credentials</h3>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
          Add Credentials
        </button>
      </div>

      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {credentials.map((cred) => (
            <li key={cred.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={SUPPORTED_EXCHANGES[cred.exchange]?.icon}
                      alt={cred.exchange}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{cred.name}</div>
                    <div className="text-sm text-gray-500">{SUPPORTED_EXCHANGES[cred.exchange]?.name}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => testConnection(cred)}
                    disabled={isTesting[cred.id]}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                      testResults[cred.id]
                        ? 'text-green-700 bg-green-100 hover:bg-green-200'
                        : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {isTesting[cred.id] ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : testResults[cred.id] ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    ) : (
                      'Test Connection'
                    )}
                  </button>
                  {onCredentialsSelect && (
                    <button
                      type="button"
                      onClick={() => onCredentialsSelect(cred)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Select
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(cred.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {credentials.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No credentials saved yet
            </li>
          )}
        </ul>
      </div>

      <Dialog
        open={isOpen}
        onClose={resetForm}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Add Exchange Credentials
            </Dialog.Title>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newCredential.name || ''}
                  onChange={(e) => setNewCredential({ ...newCredential, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="My Exchange Account"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exchange</label>
                <select
                  value={newCredential.exchange}
                  onChange={(e) => handleExchangeChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {Object.entries(SUPPORTED_EXCHANGES).map(([id, exchange]) => (
                    <option key={id} value={id}>
                      {exchange.name}
                    </option>
                  ))}
                </select>
              </div>

              {newCredential.exchange && SUPPORTED_EXCHANGES[newCredential.exchange].requiredFields.map(field => {
                const isBasicField = field === 'apiKey' || field === 'secretKey';
                const value = isBasicField ? newCredential[field] : additionalFields[field];
                
                return (
                  <div key={field} className="relative">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowHelp(showHelp === field ? null : field)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <QuestionMarkCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="password"
                        value={value || ''}
                        onChange={(e) => {
                          if (isBasicField) {
                            setNewCredential({ ...newCredential, [field]: e.target.value });
                          } else {
                            setAdditionalFields({ ...additionalFields, [field]: e.target.value });
                          }
                        }}
                        className={`block w-full rounded-md ${
                          fieldErrors[field]
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        } sm:text-sm`}
                        placeholder={`Enter ${field}`}
                      />
                      {fieldErrors[field] && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    {fieldErrors[field] && (
                      <p className="mt-2 text-sm text-red-600">{fieldErrors[field]}</p>
                    )}
                    {showHelp === field && renderFieldHelp(field)}
                  </div>
                );
              })}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}