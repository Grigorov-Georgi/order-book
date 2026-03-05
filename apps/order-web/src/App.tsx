import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Container, Grid, MenuItem, Stack, TextField } from '@mui/material'
import { getApiErrorMessage, setTokenProvider } from './api/apiClient'
import { Header } from './components/Header'
import { OrderBookTables } from './components/OrderBookTables'
import { OrderForms } from './components/OrderForms'
import { PriceCard } from './components/PriceCard'
import { useAuth } from './hooks/useAuth'
import { useOrderBook } from './hooks/useOrderBook'

type PriceTrend = 'up' | 'down' | 'flat'

const DEFAULT_SYMBOL = 'BTC-USD'
const REFRESH_OPTIONS = [2000, 3000, 5000]

const App = () => {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL)
  const [refreshIntervalMs, setRefreshIntervalMs] = useState(3000)
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)
  const auth = useAuth()

  useEffect(() => {
    setTokenProvider(() => auth.token)
  }, [auth.token])

  const { data, isLoading, isError, error, refetch } = useOrderBook(symbol, refreshIntervalMs)

  const bids = useMemo(() => [...(data?.bids ?? [])].sort((a, b) => b.price - a.price), [data?.bids])
  const asks = useMemo(() => [...(data?.asks ?? [])].sort((a, b) => a.price - b.price), [data?.asks])

  const bestBid = bids[0]?.price ?? null
  const bestAsk = asks[0]?.price ?? null

  const currentPrice = useMemo(() => {
    if (bestBid !== null && bestAsk !== null) {
      return (bestBid + bestAsk) / 2
    }
    return bestBid ?? bestAsk
  }, [bestAsk, bestBid])

  const trend: PriceTrend = useMemo(() => {
    if (currentPrice === null || previousPrice === null) {
      return 'flat'
    }
    if (currentPrice > previousPrice) {
      return 'up'
    }
    if (currentPrice < previousPrice) {
      return 'down'
    }
    return 'flat'
  }, [currentPrice, previousPrice])

  useEffect(() => {
    if (currentPrice !== null) {
      setPreviousPrice(currentPrice)
    }
  }, [data?.timestamp, currentPrice])

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      <Header
        symbol={symbol}
        onSymbolChange={setSymbol}
        onLogin={auth.login}
        isAuthenticated={auth.isAuthenticated}
      />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Stack spacing={2.5}>
          <PriceCard
            symbol={symbol}
            price={currentPrice}
            trend={trend}
            bestBid={bestBid}
            bestAsk={bestAsk}
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <OrderForms symbol={symbol} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    select
                    label="Auto-refresh"
                    size="small"
                    value={refreshIntervalMs}
                    onChange={(event) => setRefreshIntervalMs(Number(event.target.value))}
                    sx={{ width: 180 }}
                  >
                    {REFRESH_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option / 1000}s
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                {auth.isAuthenticated ? null : (
                  <Alert severity="info">
                    Auth is mocked in v1. Replace `useAuth()` with Auth0 integration later.
                  </Alert>
                )}
                <OrderBookTables
                  data={data}
                  isLoading={isLoading}
                  isError={isError}
                  errorMessage={isError ? getApiErrorMessage(error) : ''}
                  onRetry={() => {
                    void refetch()
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
