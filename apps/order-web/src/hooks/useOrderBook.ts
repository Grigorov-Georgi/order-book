import { useQuery } from '@tanstack/react-query'
import { fetchOrdersBySymbol } from '../api/orderBookApi'

export const orderBookQueryKey = (symbol: string) => ['order-book', symbol] as const

export const useOrderBook = (symbol: string, refreshIntervalMs: number) =>
  useQuery({
    queryKey: orderBookQueryKey(symbol),
    queryFn: () => fetchOrdersBySymbol(symbol),
    enabled: symbol.trim().length > 0,
    refetchInterval: refreshIntervalMs,
  })
