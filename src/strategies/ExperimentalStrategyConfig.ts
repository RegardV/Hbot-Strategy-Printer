import { ScriptConfigBase } from './ScriptConfigBase';

export class ExperimentalStrategyConfig extends ScriptConfigBase {
  exchange: string = 'binance_paper_trade';
  tradingPair: string = 'ETH-USDT';
  baseAskPrice: string = '0.00000000';
  totalSpread: string = '0.00000000';
  stopLossPercent: string = '2.00';
  
  // Market Data Fields
  high24h: string = '0.00000000';
  low24h: string = '0.00000000';
  volume24h: string = '0.00000000';
  volume36h: string = '0.00000000';
  direction24h: string = '0.00';
  rsiValue: string = '50.00';
  
  // Price Levels
  currentBuyPrice: string = '0.00000000';
  currentSellPrice: string = '0.00000000';
  predictedPrice: string = '0.00000000';
  
  // Risk Management
  minBuyPrice: string = '0.00000000';
  maxBuyPrice: string = '0.00000000';
  minSellPrice: string = '0.00000000';
  maxSellPrice: string = '0.00000000';
}