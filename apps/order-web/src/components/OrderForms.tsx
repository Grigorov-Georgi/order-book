import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '../api/apiClient'
import { submitBuyOrder, submitSellOrder } from '../api/orderBookApi'
import { orderBookQueryKey } from '../hooks/useOrderBook'
import type { OrderSide, PlaceOrderPayload } from '../types/orderBook'

interface OrderFormsProps {
  symbol: string
}

interface FormState {
  price: string
  quantity: string
}

interface FormErrors {
  price?: string
  quantity?: string
}

const initialFormState: FormState = {
  price: '',
  quantity: '',
}

const validate = (form: FormState): FormErrors => {
  const price = Number(form.price)
  const quantity = Number(form.quantity)
  const errors: FormErrors = {}
  if (!form.price || !Number.isFinite(price) || price <= 0) {
    errors.price = 'Enter a positive price'
  }
  if (!form.quantity || !Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = 'Enter a positive quantity'
  }
  return errors
}

export const OrderForms = ({ symbol }: OrderFormsProps) => {
  const [side, setSide] = useState<OrderSide>('buy')
  const [form, setForm] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const queryClient = useQueryClient()

  const buyMutation = useMutation({
    mutationFn: submitBuyOrder,
    onSuccess: () => {
      toast.success('Buy order submitted')
      setForm(initialFormState)
      void queryClient.invalidateQueries({ queryKey: orderBookQueryKey(symbol) })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const sellMutation = useMutation({
    mutationFn: submitSellOrder,
    onSuccess: () => {
      toast.success('Sell order submitted')
      setForm(initialFormState)
      void queryClient.invalidateQueries({ queryKey: orderBookQueryKey(symbol) })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const isSubmitting = buyMutation.isPending || sellMutation.isPending

  const submit = (): void => {
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    const payload: PlaceOrderPayload = {
      symbol,
      price: Number(form.price),
      quantity: Number(form.quantity),
    }
    if (side === 'buy') {
      buyMutation.mutate(payload)
      return
    }
    sellMutation.mutate(payload)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Place Order
        </Typography>
        <Tabs value={side} onChange={(_, value: OrderSide) => setSide(value)} sx={{ mb: 2 }}>
          <Tab value="buy" label="Buy" />
          <Tab value="sell" label="Sell" />
        </Tabs>
        <Stack spacing={2}>
          <TextField size="small" label="Symbol" value={symbol} disabled />
          <TextField
            size="small"
            type="number"
            label="Price"
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            error={Boolean(errors.price)}
            helperText={errors.price}
          />
          <TextField
            size="small"
            type="number"
            label="Quantity"
            value={form.quantity}
            onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
          />
          <Box>
            <Button
              fullWidth
              variant="contained"
              color={side === 'buy' ? 'success' : 'error'}
              onClick={submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
              Submit {side === 'buy' ? 'Buy' : 'Sell'} Order
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
