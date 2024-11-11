import { ArrowPathIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  onStrategySelect: (strategy: string) => void;
}

const strategies = [
  {
    name: 'Simple PMM',
    description: 'A basic market making strategy that maintains buy and sell orders around a reference price.',
    icon: CurrencyDollarIcon,
    difficulty: 'Beginner',
    category: 'Market Making',
    metrics: {
      avgSpread: '0.1-0.5%',
      refreshRate: '15s',
      profitPotential: 'Medium',
    },
  },
  // More strategies can be added here
];

const features = [
  {
    name: 'Real-time Visualization',
    description: 'See how your strategy parameters affect order placement and pricing in real-time.',
    icon: ChartBarIcon,
  },
  {
    name: 'Dynamic Updates',
    description: 'Watch how orders are refreshed and adjusted based on market conditions.',
    icon: ArrowPathIcon,
  },
];

export default function Dashboard({ onStrategySelect }: DashboardProps) {
  const navigate = useNavigate();

  const handleStrategySelect = (strategyName: string) => {
    onStrategySelect(strategyName);
    navigate('/visualizer');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Trading Strategy Visualizer
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Explore and understand different trading strategies through interactive visualizations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-12 lg:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
              <feature.icon className="h-8 w-8 text-indigo-500" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-base text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Strategies</h3>
        <div className="grid grid-cols-1 gap-6">
          {strategies.map((strategy) => (
            <div
              key={strategy.name}
              className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleStrategySelect(strategy.name)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <strategy.icon className="h-8 w-8 text-indigo-500" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">{strategy.name}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {strategy.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{strategy.description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Avg. Spread</dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900">{strategy.metrics.avgSpread}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Refresh Rate</dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900">{strategy.metrics.refreshRate}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Profit Potential</dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900">{strategy.metrics.profitPotential}</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}