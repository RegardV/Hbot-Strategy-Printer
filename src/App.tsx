import { BrowserRouter as Router } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { ExchangeProvider } from './contexts/ExchangeContext';
import Navigation from './components/Navigation';
import AppRoutes from './components/AppRoutes';

export default function App() {
  return (
    <SettingsProvider>
      <ExchangeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AppRoutes />
              </div>
            </main>
          </div>
        </Router>
      </ExchangeProvider>
    </SettingsProvider>
  );
}