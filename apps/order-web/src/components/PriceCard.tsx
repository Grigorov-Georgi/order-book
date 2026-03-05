import { ArrowDownward, ArrowUpward, Remove } from '@mui/icons-material'
import { Card, CardContent, Stack, Typography } from '@mui/material'

type PriceTrend = 'up' | 'down' | 'flat'

interface PriceCardProps {
  symbol: string
  price: number | null
  trend: PriceTrend
  bestBid: number | null
  bestAsk: number | null
}

const formatPrice = (value: number | null): string =>
  value === null ? 'No market data' : value.toLocaleString(undefined, { maximumFractionDigits: 8 })

const trendStyle = (trend: PriceTrend) => {
  if (trend === 'up') {
    return { color: 'success.main', label: 'Rising', icon: <ArrowUpward fontSize="small" /> }
  }
  if (trend === 'down') {
    return { color: 'error.main', label: 'Falling', icon: <ArrowDownward fontSize="small" /> }
  }
  return { color: 'text.secondary', label: 'Flat', icon: <Remove fontSize="small" /> }
}

export const PriceCard = ({ symbol, price, trend, bestBid, bestAsk }: PriceCardProps) => {
  const trendView = trendStyle(trend)
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Current Price ({symbol})</Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: trendView.color }}>
            {trendView.icon}
            <Typography variant="body2">{trendView.label}</Typography>
          </Stack>
        </Stack>
        <Typography variant="h4" sx={{ mt: 1.5 }}>
          {formatPrice(price)}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Best Bid: {formatPrice(bestBid)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Best Ask: {formatPrice(bestAsk)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
