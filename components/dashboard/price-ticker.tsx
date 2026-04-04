'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerPrice {
  symbol: string
  price: number
  change: number
  displayName: string
}

// BiQuote symbols to subscribe to
const BIQUOTE_SYMBOLS = [
  { symbol: 'BTCUSD', display: 'BTC/USD' },
  { symbol: 'ETHUSD', display: 'ETH/USD' },
  { symbol: 'XAUUSD', display: 'XAU/USD' },
  { symbol: 'EURUSD', display: 'EUR/USD' },
  { symbol: 'US30', display: 'US30' },
  { symbol: 'USOIL', display: 'USOIL' },
]

// Demo prices as fallback
const demoPrices: TickerPrice[] = BIQUOTE_SYMBOLS.map((s) => ({
  symbol: s.symbol,
  displayName: s.display,
  price: Math.random() * 100000,
  change: (Math.random() - 0.5) * 5,
}))

export function PriceTicker() {
  const [prices, setPrices] = useState<TickerPrice[]>(demoPrices)
  const [isConnected, setIsConnected] = useState(false)
  const [useBiquote, setUseBiquote] = useState(false)

  useEffect(() => {
    const priceCache = new Map<string, TickerPrice>()
    let connection: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    let messageTimeout: NodeJS.Timeout | null = null
    let reconnectAttempts = 0
    const maxReconnectAttempts = 3

    const initializePrices = () => {
      BIQUOTE_SYMBOLS.forEach((s) => {
        priceCache.set(s.symbol, {
          symbol: s.symbol,
          displayName: s.display,
          price: Math.random() * 100000,
          change: 0,
        })
      })
    }

    const connectWebSocket = () => {
      try {
        console.log('[BiQuote] Attempting connection...')
        connection = new WebSocket('wss://biquote.io/hubs/tick')

        connection.onopen = () => {
          console.log('[BiQuote] WebSocket connected')
          setIsConnected(true)
          reconnectAttempts = 0

          // Send handshake
          try {
            connection?.send(JSON.stringify({ protocol: 'json', version: 1 }) + '\x1e')
          } catch (e) {
            console.error('[BiQuote] Handshake failed:', e)
          }

          // Subscribe to each symbol
          BIQUOTE_SYMBOLS.forEach(({ symbol }) => {
            try {
              const msg = {
                type: 1,
                target: 'Subscribe',
                arguments: [symbol],
              }
              connection?.send(JSON.stringify(msg) + '\x1e')
              console.log('[BiQuote] Subscribed to', symbol)
            } catch (e) {
              console.error('[BiQuote] Subscribe failed for', symbol, e)
            }
          })

          // Set a timeout to verify we're receiving data
          messageTimeout = setTimeout(() => {
            console.log('[BiQuote] No data received, may need reconnection')
          }, 5000)
        }

        connection.onmessage = (event) => {
          try {
            if (messageTimeout) clearTimeout(messageTimeout)

            const rawData = event.data as string
            if (!rawData || rawData.length === 0) return

            // Split by SignalR record separator
            const messages = rawData.split('\x1e').filter((m) => m.length > 0)

            messages.forEach((msg) => {
              if (msg.length === 0) return

              try {
                const parsed = JSON.parse(msg)
                if (parsed.M) {
                  parsed.M.forEach((method: any) => {
                    if (method.M === 'tick' && method.A) {
                      method.A.forEach((tickData: any) => {
                        if (Array.isArray(tickData) && tickData.length > 0) {
                          const symbol = tickData[0]
                          const bid = tickData[1]
                          const ask = tickData[2]
                          const lastTrade = tickData[6]

                          const price = lastTrade || ask || bid
                          if (!price || typeof price !== 'number') return

                          const symConfig = BIQUOTE_SYMBOLS.find((s) => s.symbol === symbol)
                          if (!symConfig) return

                          const prevPrice = priceCache.get(symbol)?.price || price
                          const change = ((price - prevPrice) / prevPrice) * 100

                          const tickPrice: TickerPrice = {
                            symbol,
                            displayName: symConfig.display,
                            price,
                            change: isNaN(change) ? 0 : Math.min(Math.max(change, -100), 100),
                          }

                          priceCache.set(symbol, tickPrice)
                          setUseBiquote(true)

                          setPrices((current) => {
                            const idx = current.findIndex((p) => p.symbol === symbol)
                            if (idx >= 0) {
                              const updated = [...current]
                              updated[idx] = tickPrice
                              return updated
                            }
                            return [...current, tickPrice]
                          })
                        }
                      })
                    }
                  })
                }
              } catch (parseErr) {
                // Silent fail on individual message parse errors
              }
            })
          } catch (err) {
            console.error('[BiQuote] Message error:', err)
          }
        }

        connection.onerror = () => {
          console.error('[BiQuote] Connection error')
          setIsConnected(false)
        }

        connection.onclose = () => {
          console.log('[BiQuote] Connection closed')
          setIsConnected(false)
          if (messageTimeout) clearTimeout(messageTimeout)

          // Attempt reconnect
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000)
            reconnectAttempts++
            console.log(`[BiQuote] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`)
            reconnectTimeout = setTimeout(connectWebSocket, delay)
          } else {
            console.log('[BiQuote] Max reconnect attempts reached, using demo data')
            setUseBiquote(false)
          }
        }
      } catch (err) {
        console.error('[BiQuote] Connection failed:', err)
        setIsConnected(false)
      }
    }

    initializePrices()
    connectWebSocket()

    // Simulate demo price updates if not connected to real data
    const demoInterval = setInterval(() => {
      if (!useBiquote) {
        setPrices((current) =>
          current.map((p) => ({
            ...p,
            price: p.price * (1 + (Math.random() - 0.5) * 0.001),
            change: p.change + (Math.random() - 0.5) * 0.1,
          }))
        )
      }
    }, 2000)

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (messageTimeout) clearTimeout(messageTimeout)
      if (connection) connection.close()
      clearInterval(demoInterval)
    }
  }, [useBiquote])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    if (price > 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return price.toFixed(2)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border overflow-hidden">
      <div className="flex items-center h-full ticker-animate" style={{ width: 'max-content' }}>
        {[...prices, ...prices].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-4 border-r border-border h-full whitespace-nowrap"
          >
            <span className="text-xs text-muted-foreground">{item.displayName}</span>
            <span className="text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                item.change >= 0 ? 'text-primary' : 'text-destructive'
              )}
            >
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {item.change >= 0 ? '+' : ''}
              {Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-background rounded text-xs">
        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
        <span className="text-muted-foreground">{isConnected ? 'LIVE' : 'DEMO'}</span>
      </div>
    </div>
  )
}
