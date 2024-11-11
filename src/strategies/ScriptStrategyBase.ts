import { ConnectorBase } from '../types/ConnectorBase';
import { OrderType } from '../types/OrderType';

export abstract class ScriptStrategyBase {
  protected connectors: { [key: string]: ConnectorBase };
  protected readyToTrade: boolean = false;

  constructor(connectors: { [key: string]: ConnectorBase }) {
    this.connectors = connectors;
    this.addMarkets(Object.values(connectors));
  }

  protected addMarkets(connectors: ConnectorBase[]): void {
    // Implementation for adding markets
  }

  tick(timestamp: number): void {
    if (!this.readyToTrade) {
      this.readyToTrade = this.checkConnectorsReady();
      if (!this.readyToTrade) {
        return;
      }
    }
    this.onTick();
  }

  abstract onTick(): void;

  protected checkConnectorsReady(): boolean {
    return Object.values(this.connectors).every(connector => connector.ready);
  }

  protected buy(
    connectorName: string,
    tradingPair: string,
    amount: number,
    orderType: OrderType,
    price?: number
  ): string {
    // Implementation for buy order
    return '';
  }

  protected sell(
    connectorName: string,
    tradingPair: string,
    amount: number,
    orderType: OrderType,
    price?: number
  ): string {
    // Implementation for sell order
    return '';
  }

  protected cancel(connectorName: string, tradingPair: string, orderId: string): void {
    // Implementation for cancel order
  }

  protected getActiveOrders(connectorName: string): any[] {
    // Implementation for getting active orders
    return [];
  }
}