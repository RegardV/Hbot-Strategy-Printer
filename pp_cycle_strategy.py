from decimal import Decimal
from typing import Dict, List

from pydantic import Field

from hummingbot.client.config.config_data_types import BaseClientModel, ClientFieldData
from hummingbot.connector.connector_base import ConnectorBase
from hummingbot.core.data_type.common import OrderType, PriceType, TradeType
from hummingbot.core.data_type.order_candidate import OrderCandidate
from hummingbot.strategy.script_strategy_base import ScriptStrategyBase


class PPCycleConfig(BaseClientModel):
    script_file_name: str = Field(default_factory=lambda: os.path.basename(__file__))
    exchange: str = Field("binance_paper_trade", client_data=ClientFieldData(
        prompt_on_new=True, prompt=lambda mi: "Exchange where the bot will trade"))
    trading_pair: str = Field("ETH-USDT", client_data=ClientFieldData(
        prompt_on_new=True, prompt=lambda mi: "Trading pair in which the bot will place orders"))
    base_ask_price: Decimal = Field("2000.00000000", client_data=ClientFieldData(
        prompt_on_new=True, prompt=lambda mi: "Base ask price for the trading cycle (8 decimal places)"))
    total_spread: Decimal = Field("100.00000000", client_data=ClientFieldData(
        prompt_on_new=True, prompt=lambda mi: "Total spread between buy and sell orders (8 decimal places)"))
    order_amount: Decimal = Field("0.10000000", client_data=ClientFieldData(
        prompt_on_new=True, prompt=lambda mi: "Order amount denominated in base asset (8 decimal places)"))
    order_refresh_time: int = Field(15, client_data=ClientFieldData(
        prompt_on_new=True, prompt=lambda mi: "Order refresh time (in seconds)"))


class PPCycle(ScriptStrategyBase):
    """
    A price point cycle strategy that places buy and sell orders at calculated price points.
    The strategy:
    1. Calculates buy price as base_ask_price - (total_spread / 2)
    2. Calculates sell price as base_ask_price + (total_spread / 2)
    3. Places orders at these price points
    4. Refreshes orders periodically
    5. Tracks and logs trades for analysis
    """

    markets = {}
    
    @classmethod
    def init_markets(cls, config: PPCycleConfig):
        cls.markets = {config.exchange: {config.trading_pair}}

    def __init__(self, connectors: Dict[str, ConnectorBase], config: PPCycleConfig):
        super().__init__(connectors)
        self.config = config
        self.create_timestamp = 0
        self.buy_price = Decimal(str(config.base_ask_price - (config.total_spread / 2))).quantize(Decimal("0.00000001"))
        self.sell_price = Decimal(str(config.base_ask_price + (config.total_spread / 2))).quantize(Decimal("0.00000001"))

    def on_tick(self):
        if self.create_timestamp <= self.current_timestamp:
            self.cancel_all_orders()
            proposal: List[OrderCandidate] = self.create_proposal()
            proposal_adjusted: List[OrderCandidate] = self.adjust_proposal_to_budget(proposal)
            self.place_orders(proposal_adjusted)
            self.create_timestamp = self.current_timestamp + self.config.order_refresh_time

    def create_proposal(self) -> List[OrderCandidate]:
        buy_order = OrderCandidate(
            trading_pair=self.config.trading_pair,
            is_maker=True,
            order_type=OrderType.LIMIT,
            order_side=TradeType.BUY,
            amount=self.config.order_amount,
            price=self.buy_price
        )

        sell_order = OrderCandidate(
            trading_pair=self.config.trading_pair,
            is_maker=True,
            order_type=OrderType.LIMIT,
            order_side=TradeType.SELL,
            amount=self.config.order_amount,
            price=self.sell_price
        )

        return [buy_order, sell_order]

    def adjust_proposal_to_budget(self, proposal: List[OrderCandidate]) -> List[OrderCandidate]:
        return self.connectors[self.config.exchange].budget_checker.adjust_candidates(proposal, all_or_none=True)

    def place_orders(self, proposal: List[OrderCandidate]) -> None:
        for order in proposal:
            if order.order_side == TradeType.SELL:
                self.sell(
                    connector_name=self.config.exchange,
                    trading_pair=order.trading_pair,
                    amount=order.amount,
                    order_type=order.order_type,
                    price=order.price
                )
            elif order.order_side == TradeType.BUY:
                self.buy(
                    connector_name=self.config.exchange,
                    trading_pair=order.trading_pair,
                    amount=order.amount,
                    order_type=order.order_type,
                    price=order.price
                )

    def cancel_all_orders(self):
        for order in self.get_active_orders(connector_name=self.config.exchange):
            self.cancel(self.config.exchange, order.trading_pair, order.client_order_id)

    def did_fill_order(self, event):
        msg = (
            f"{event.trade_type.name} {event.amount:.8f} {event.trading_pair} "
            f"{self.config.exchange} at {event.price:.8f}"
        )
        self.log_with_clock(logging.INFO, msg)
        self.notify_hb_app_with_timestamp(msg)