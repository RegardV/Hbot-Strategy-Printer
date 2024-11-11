import { ExchangeCredentials } from './CredentialsManager';
import axios from 'axios';

export interface ExchangeConfig {
  name: string;
  baseUrl: string;
  wsUrl: string;
  icon: string;
  requiredFields: string[];
  description: string;
  features: string[];
  fieldDescriptions?: Record<string, string>;
  fieldLinks?: Record<string, string>;
  fieldValidation?: Record<string, (value: string) => boolean>;
}

export const SUPPORTED_EXCHANGES: Record<string, ExchangeConfig> = {
  binance: {
    name: 'Binance',
    baseUrl: 'https://api.binance.com/api/v3',
    wsUrl: 'wss://stream.binance.com:9443/ws',
    icon: '/exchange-logos/binance.png',
    requiredFields: ['apiKey', 'secretKey'],
    description: 'Leading global cryptocurrency exchange',
    features: ['spot', 'futures', 'margin'],
    fieldDescriptions: {
      apiKey: 'Create this key in your Binance account security settings',
      secretKey: 'Save this key when created, it cannot be viewed again'
    },
    fieldLinks: {
      apiKey: 'https://www.binance.com/en/support/faq/how-to-create-api-keys-360002502072'
    }
  },
  ascendex: {
    name: 'AscendEX',
    baseUrl: 'https://ascendex.com/api/pro/v1',
    wsUrl: 'wss://ascendex.com/api/pro/v1/stream',
    icon: '/exchange-logos/ascendex.png',
    requiredFields: ['apiKey', 'secretKey', 'accountGroup'],
    description: 'Professional digital asset trading platform',
    features: ['spot', 'futures'],
    fieldDescriptions: {
      apiKey: 'Generate API key from your AscendEX account settings',
      secretKey: 'Store this key safely, it cannot be recovered',
      accountGroup: 'Your account group number from AscendEX (e.g., 1, 2, 3)'
    },
    fieldValidation: {
      accountGroup: (value: string) => /^\d+$/.test(value)
    }
  },
  kucoin: {
    name: 'KuCoin',
    baseUrl: 'https://api.kucoin.com/api/v1',
    wsUrl: 'wss://ws-api.kucoin.com/endpoint',
    icon: '/exchange-logos/kucoin.png',
    requiredFields: ['apiKey', 'secretKey', 'passphrase'],
    description: 'Global cryptocurrency exchange',
    features: ['spot', 'futures', 'margin'],
    fieldDescriptions: {
      apiKey: 'Create API key in KuCoin security settings',
      secretKey: 'Save this key immediately after creation',
      passphrase: 'Required for API authentication'
    },
    fieldLinks: {
      apiKey: 'https://support.kucoin.plus/hc/en-us/articles/360015051773'
    }
  }
};

export class ExchangeService {
  private credentials?: ExchangeCredentials;
  private config: ExchangeConfig;
  private wsConnection?: WebSocket;

  constructor(exchange: string) {
    const config = SUPPORTED_EXCHANGES[exchange];
    if (!config) {
      throw new Error(`Unsupported exchange: ${exchange}`);
    }
    this.config = config;
  }

  async connect(credentials: ExchangeCredentials): Promise<boolean> {
    try {
      const headers = this.getHeaders(credentials);
      const response = await axios.get(`${this.config.baseUrl}/ping`, { headers });
      
      if (response.status === 200) {
        this.credentials = credentials;
        this.initWebSocket();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Exchange connection failed:', error);
      return false;
    }
  }

  private getHeaders(credentials: ExchangeCredentials): Record<string, string> {
    const headers: Record<string, string> = {
      'X-API-KEY': credentials.apiKey
    };

    if (credentials.additionalFields?.passphrase) {
      headers['X-API-PASSPHRASE'] = credentials.additionalFields.passphrase;
    }

    if (credentials.additionalFields?.accountGroup) {
      headers['X-ACCOUNT-GROUP'] = credentials.additionalFields.accountGroup;
    }

    return headers;
  }

  private initWebSocket(): void {
    if (!this.credentials) return;

    this.wsConnection = new WebSocket(this.config.wsUrl);
    
    this.wsConnection.onopen = () => {
      console.log(`WebSocket connected to ${this.config.name}`);
    };

    this.wsConnection.onclose = () => {
      console.log(`WebSocket disconnected from ${this.config.name}`);
      setTimeout(() => this.initWebSocket(), 5000);
    };

    this.wsConnection.onerror = (error) => {
      console.error(`WebSocket error with ${this.config.name}:`, error);
    };
  }

  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = undefined;
    }
    this.credentials = undefined;
  }

  isConnected(): boolean {
    return !!this.credentials && !!this.wsConnection;
  }

  getExchangeInfo(): ExchangeConfig {
    return this.config;
  }
}