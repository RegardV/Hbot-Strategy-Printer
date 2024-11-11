import axios from 'axios';

interface MarketData {
  symbol: string;
  price: string;
  volume: string;
  high: string;
  low: string;
  timestamp: number;
}

interface Stats24hr {
  symbol: string;
  volume: string;
  high: string;
  low: string;
  price_change_percent: string;
}

export class AscendexConnector {
  private readonly baseUrl = 'https://ascendex.com/api/pro/v1';

  async getMarketData(symbol: string): Promise<MarketData | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/ticker?symbol=${symbol}`);
      return {
        symbol: response.data.symbol,
        price: response.data.price,
        volume: response.data.volume,
        high: response.data.high,
        low: response.data.low,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      return null;
    }
  }

  async get24HrStats(symbol: string): Promise<Stats24hr | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/ticker/24hr?symbol=${symbol}`);
      return {
        symbol: response.data.symbol,
        volume: response.data.volume,
        high: response.data.high,
        low: response.data.low,
        price_change_percent: response.data.price_change_percent,
      };
    } catch (error) {
      return null;
    }
  }
}