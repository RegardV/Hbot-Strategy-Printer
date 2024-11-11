import { ExchangeCredentials } from './CredentialsManager';
import axios from 'axios';
import { useSettings } from '../contexts/SettingsContext';

export interface MarketData {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  spreadPercentage: number;
  volume24h: number;
  lastUpdate: Date;
  price: number;
  priceChange24h: number;
}

export class MarketService {
  private credentials?: ExchangeCredentials;
  private baseUrl: string;
  private demoMode: boolean;

  constructor(credentials?: ExchangeCredentials) {
    this.credentials = credentials;
    this.baseUrl = this.getBaseUrl(credentials?.exchange);
    const { demoMode } = useSettings();
    this.demoMode = demoMode;
  }

  private getBaseUrl(exchange?: string): string {
    if (!exchange) return '';
    
    switch (exchange) {
      case 'binance':
        return 'https://api.binance.com/api/v3';
      case 'ascendex':
        return 'https://ascendex.com/api/pro/v1';
      case 'kucoin':
        return 'https://api.kucoin.com/api/v1';
      default:
        return '';
    }
  }

  async connect(): Promise<void> {
    if (this.demoMode || !this.credentials) return;

    try {
      await axios.get(`${this.baseUrl}/ping`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      throw new Error('Failed to connect to exchange');
    }
  }

  private getHeaders(): Record<string, string> {
    if (!this.credentials) return {};

    const headers: Record<string, string> = {
      'X-API-KEY': this.credentials.apiKey,
    };

    if (this.credentials.additionalFields?.passphrase) {
      headers['X-API-PASSPHRASE'] = this.credentials.additionalFields.passphrase;
    }

    return headers;
  }

  private generateDemoData(): MarketData[] {
    const symbols = ['BTC-USDT', 'ETH-USDT', 'BNB-USDT', 'SOL-USDT', 'ADA-USDT',
                    'DOT-USDT', 'AVAX-USDT', 'MATIC-USDT', 'LINK-USDT', 'UNI-USDT'];
    
    return symbols.map(symbol => {
      const basePrice = this.getBasePrice(symbol);
      const spread = basePrice * (0.001 + Math.random() * 0.002);
      const bid = basePrice - spread / 2;
      const ask = basePrice + spread / 2;
      const priceChange = (Math.random() - 0.5) * basePrice * 0.05;
      
      return {
        symbol,
        bid,
        ask,
        spread,
        spreadPercentage: (spread / bid) * 100,
        volume24h: Math.random() * 1000000,
        lastUpdate: new Date(),
        price: basePrice,
        priceChange24h: priceChange
      };
    }).sort((a, b) => b.spreadPercentage - a.spreadPercentage);
  }

  private getBasePrice(symbol: string): number {
    const prices: { [key: string]: number } = {
      'BTC-USDT': 45000,
      'ETH-USDT': 3000,
      'BNB-USDT': 300,
      'SOL-USDT': 100,
      'ADA-USDT': 1.2,
      'DOT-USDT': 20,
      'AVAX-USDT': 80,
      'MATIC-USDT': 1.5,
      'LINK-USDT': 15,
      'UNI-USDT': 10
    };
    return prices[symbol] || 100;
  }

  async getTopPairSpreads(): Promise<MarketData[]> {
    if (this.demoMode || !this.credentials) {
      return this.generateDemoData();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/ticker/24hr`, {
        headers: this.getHeaders(),
      });

      const marketData: MarketData[] = response.data
        .map((ticker: any) => ({
          symbol: ticker.symbol,
          bid: parseFloat(ticker.bidPrice),
          ask: parseFloat(ticker.askPrice),
          spread: parseFloat(ticker.askPrice) - parseFloat(ticker.bidPrice),
          spreadPercentage: ((parseFloat(ticker.askPrice) - parseFloat(ticker.bidPrice)) / parseFloat(ticker.bidPrice)) * 100,
          volume24h: parseFloat(ticker.volume),
          lastUpdate: new Date(ticker.closeTime || Date.now()),
          price: parseFloat(ticker.lastPrice),
          priceChange24h: parseFloat(ticker.priceChange)
        }))
        .filter((data: MarketData) => 
          data.bid > 0 && data.ask > 0 && data.volume24h > 0
        )
        .sort((a: MarketData, b: MarketData) => b.spreadPercentage - a.spreadPercentage)
        .slice(0, 10);

      return marketData;
    } catch (error) {
      throw new Error('Failed to fetch market data');
    }
  }
}