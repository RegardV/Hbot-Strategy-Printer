import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  BeakerIcon, 
  ChartPieIcon,
  CodeBracketIcon,
  ArrowTrendingUpIcon,
  CurrencyEuroIcon,
  KeyIcon,
  BuildingLibraryIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Navigation() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Market', href: '/market', icon: BuildingLibraryIcon },
    { name: 'Simple PMM', href: '/', icon: CurrencyDollarIcon },
    { name: 'PMM Dynamic', href: '/pmm-dynamic', icon: ChartBarIcon },
    { name: 'Base Strategy', href: '/base', icon: CodeBracketIcon },
    { name: 'Experimental', href: '/experimental', icon: BeakerIcon },
    { name: 'Bollinger Bands', href: '/bb', icon: ChartPieIcon },
    { name: 'TWAP', href: '/twap', icon: ArrowTrendingUpIcon },
    { name: 'Funding Arb', href: '/funding-arb', icon: CurrencyEuroIcon },
    { 
      name: 'Credentials', 
      href: '/credentials', 
      icon: KeyIcon,
      className: 'mt-8 pt-4 border-t border-gray-200'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Cog6ToothIcon,
      className: 'border-b border-gray-200'
    },
  ];

  return (
    <div className="flex-shrink-0 w-64 bg-white shadow-lg">
      <div className="h-full px-3 py-4">
        <div className="mb-8 px-3">
          <h1 className="text-lg font-bold text-gray-900">Trading Strategy Visualizer</h1>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  item.className
                )}
              >
                <item.icon
                  className={clsx(
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}