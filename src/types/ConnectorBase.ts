export interface ConnectorBase {
  ready: boolean;
  name: string;
  getBalance(asset: string): number;
  getAvailableBalance(asset: string): number;
}