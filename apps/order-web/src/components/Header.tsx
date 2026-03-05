import { AppBar, Box, Button, Container, Stack, TextField, Toolbar, Typography } from '@mui/material'

interface HeaderProps {
  symbol: string
  onSymbolChange: (symbol: string) => void
  onLogin: () => void
  isAuthenticated: boolean
}

export const Header = ({
  symbol,
  onSymbolChange,
  onLogin,
  isAuthenticated,
}: HeaderProps) => (
  <AppBar position="static" elevation={0} color="transparent">
    <Container maxWidth="lg">
      <Toolbar disableGutters sx={{ py: 2, gap: 2, justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          Order Book
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
          <TextField
            size="small"
            label="Symbol"
            value={symbol}
            onChange={(event) => onSymbolChange(event.target.value.toUpperCase())}
            sx={{ minWidth: 160 }}
          />
          <Button variant="contained" onClick={onLogin} disabled={isAuthenticated}>
            {isAuthenticated ? 'Logged In' : 'Login'}
          </Button>
        </Stack>
      </Toolbar>
      <Box sx={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }} />
    </Container>
  </AppBar>
)
