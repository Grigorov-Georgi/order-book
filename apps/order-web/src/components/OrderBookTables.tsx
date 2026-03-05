import { useMemo } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { OrderBookResponse, OrderLevel } from '../types/orderBook'

interface OrderBookTablesProps {
  data?: OrderBookResponse
  isLoading: boolean
  isError: boolean
  errorMessage: string
  onRetry: () => void
}

const formatNumber = (value: number): string =>
  value.toLocaleString(undefined, { maximumFractionDigits: 8 })

const OrderTable = ({
  title,
  rows,
  bestPrice,
  highlightColor,
}: {
  title: string
  rows: OrderLevel[]
  bestPrice: number | null
  highlightColor: string
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${row.price}-${row.quantity}-${index}`}
              sx={
                bestPrice !== null && row.price === bestPrice
                  ? { backgroundColor: highlightColor }
                  : undefined
              }
            >
              <TableCell>{formatNumber(row.price)}</TableCell>
              <TableCell>{formatNumber(row.quantity)}</TableCell>
              <TableCell>{row.timestamp ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No orders yet</Typography>
        </Box>
      ) : null}
    </CardContent>
  </Card>
)

const LoadingState = () => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    </Grid>
  </Grid>
)

export const OrderBookTables = ({
  data,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: OrderBookTablesProps) => {
  const bids = useMemo(
    () => [...(data?.bids ?? [])].sort((a, b) => b.price - a.price),
    [data?.bids],
  )
  const asks = useMemo(
    () => [...(data?.asks ?? [])].sort((a, b) => a.price - b.price),
    [data?.asks],
  )

  const bestBid = bids[0]?.price ?? null
  const bestAsk = asks[0]?.price ?? null

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {errorMessage}
      </Alert>
    )
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary">
        Updated at: {data?.timestamp ?? 'Unknown'}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <OrderTable
            title="Bids"
            rows={bids}
            bestPrice={bestBid}
            highlightColor="rgba(16,185,129,0.15)"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <OrderTable
            title="Asks"
            rows={asks}
            bestPrice={bestAsk}
            highlightColor="rgba(244,63,94,0.15)"
          />
        </Grid>
      </Grid>
    </Stack>
  )
}
