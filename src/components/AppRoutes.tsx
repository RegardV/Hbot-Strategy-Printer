import { Routes, Route } from 'react-router-dom';
import StrategyVisualizer from './StrategyVisualizer';
import ExperimentalStrategy from './ExperimentalStrategy';
import BBStrategy from './BBStrategy';
import MarketOverview from './MarketOverview';
import PMMDynamicStrategy from './PMMDynamicStrategy';
import BaseStrategy from './BaseStrategy';
import CredentialsManager from './CredentialsManager';
import Settings from './Settings';
import TWAPStrategy from './TWAPStrategy';
import FundingArbStrategy from './FundingArbStrategy';
import ExchangeStatus from './ExchangeStatus';

export default function AppRoutes() {
  return (
    <>
      <ExchangeStatus />
      <div className="mt-4">
        <Routes>
          <Route path="/market" element={<MarketOverview />} />
          <Route path="/" element={<StrategyVisualizer />} />
          <Route path="/pmm-dynamic" element={<PMMDynamicStrategy />} />
          <Route path="/base" element={<BaseStrategy />} />
          <Route path="/experimental" element={<ExperimentalStrategy />} />
          <Route path="/bb" element={<BBStrategy />} />
          <Route path="/twap" element={<TWAPStrategy />} />
          <Route path="/funding-arb" element={<FundingArbStrategy />} />
          <Route path="/credentials" element={<CredentialsManager />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
}