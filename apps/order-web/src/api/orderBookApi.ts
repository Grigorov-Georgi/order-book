import { apiClient } from './apiClient'
import { API_ENDPOINTS } from './endpoints'
import type { OrderBookResponse, OrderLevel, PlaceOrderPayload } from '../types/orderBook'

const toOrderLevel = (value: unknown): OrderLevel | null => {
  if (!value || typeof value !== 'object') {
    return null
  }
  const item = value as Record<string, unknown>
  const price = Number(item.price)
  const quantity = Number(item.quantity)
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    return null
  }
  return {
    price,
    quantity,
    timestamp: typeof item.timestamp === 'string' ? item.timestamp : undefined,
    orderId: typeof item.orderId === 'string' ? item.orderId : undefined,
  }
}

const toOrderLevels = (value: unknown): OrderLevel[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value.map(toOrderLevel).filter((item): item is OrderLevel => item !== null)
}

const mapOrderBookResponse = (value: unknown, symbol: string): OrderBookResponse => {
  if (!value || typeof value !== 'object') {
    return { symbol, bids: [], asks: [] }
  }
  const payload = value as Record<string, unknown>
  return {
    symbol: typeof payload.symbol === 'string' ? payload.symbol : symbol,
    bids: toOrderLevels(payload.bids),
    asks: toOrderLevels(payload.asks),
    timestamp: typeof payload.timestamp === 'string' ? payload.timestamp : undefined,
  }
}

const createIdempotencyKey = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const fetchOrdersBySymbol = async (symbol: string): Promise<OrderBookResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.ordersBySymbol, {
    params: { symbol },
  })
  return mapOrderBookResponse(response.data, symbol)
}

const postOrder = async (path: string, payload: PlaceOrderPayload): Promise<void> => {
  await apiClient.post(path, payload, {
    headers: {
      'X-Idempotency-Key': createIdempotencyKey(),
    },
  })
}

export const submitBuyOrder = async (payload: PlaceOrderPayload): Promise<void> =>
  postOrder(API_ENDPOINTS.buyOrder, payload)

export const submitSellOrder = async (payload: PlaceOrderPayload): Promise<void> =>
  postOrder(API_ENDPOINTS.sellOrder, payload)
