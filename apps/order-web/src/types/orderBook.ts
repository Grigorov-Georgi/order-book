export type OrderSide = 'buy' | 'sell'

export interface OrderLevel {
  price: number
  quantity: number
  timestamp?: string
  orderId?: string
}

export interface OrderBookResponse {
  symbol: string
  bids: OrderLevel[]
  asks: OrderLevel[]
  timestamp?: string
}

export interface PlaceOrderPayload {
  symbol: string
  price: number
  quantity: number
}
