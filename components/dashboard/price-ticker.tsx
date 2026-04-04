'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerPrice {
  symbol: string
  price: number
  change: number
  bid?: number
  ask?: number
}

// BiQuote symbols to subscribe to
const BIQUOTE_SYMBOLS = ['BTCUSD', 'ETHUSD', 'XAUUSD', 'EURUSD', 'US30', 'USOIL']

const symbolDisplayNames: Record<string, string> = {
  BTCUSD: 'BTC/USD',
  ETHUSD: 'ETH/USD',
  XAUUSD: 'XAU/USD',
  EURUSD: 'EUR/USD',
  US30: 'US30',
  USOIL: 'USOIL',
}

export function PriceTicker() {
  const [prices, setPrices] = useState<TickerPrice[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  useEffect(() => {
    const priceCache = new Map<string, TickerPrice>()
    let connection: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    const maxReconnectAttempts = 5

    const connectWebSocket = () => {
      try {
        // Create WebSocket connection to BiQuote
        connection = new WebSocket('wss://biquote.io/hubs/tick')

        connection.onopen = () => {
          console.log('[BiQuote] WebSocket connected')
          setIsConnected(true)
          setError(null)
          setReconnectAttempts(0)

          // Subscribe to symbols
          BIQUOTE_SYMBOLS.forEach((symbol) => {
            const subscribeMessage = {
              H: 'tick',
              M: 'Subscribe',
              A: [symbol],
            }
            connection?.send(JSON.stringify(subscribeMessage))
          })
        }

        connection.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)

            // Handle tick data from BiQuote
            if (message.M && message.M.length > 0) {
              message.M.forEach((method: any) => {
                if (method.M === 'tick') {
                  method.A.forEach((data: any) => {
                    const [symbol, bid, ask, , , , lastTrade] = data

                    const lastPrice = lastTrade || ask || bid || 0
                    const prevPrice = priceCache.get(symbol)?.price || lastPrice
                    const change = ((lastPrice - prevPrice) / prevPrice) * 100

                    const tickPrice: TickerPrice = {
                      symbol,
                      price: lastPrice,
                      change: isNaN(change) ? 0 : change,
                      bid,
                      ask,
                    }

                    priceCache.set(symbol, tickPrice)
                    setPrices((current) => {
                      const existing = current.findIndex((p) => p.symbol === symbol)
                      if (existing >= 0) {
                        const updated = [...current]
                        updated[existing] = tickPrice
                        return updated
                      }
                      return [...current, tickPrice]
                    })
                  })
                }
              })
            }
          } catch (err) {
            console.error('[BiQuote] Error parsing message:', err)
          }
        }

        connection.onerror = (event) => {
          console.error('[BiQuote] WebSocket error:', event)
          setError('Connection error')
          setIsConnected(false)
        }

        connection.onclose = () => {
          console.log('[BiQuote] WebSocket closed')
          setIsConnected(false)

          // Auto-reconnect logic
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
            reconnectTimeout = setTimeout(() => {
              setReconnectAttempts((prev) => prev + 1)
              connectWebSocket()
            }, delay)
          } else {
            setError('Connection failed - max reconnect attempts reached')
          }
        }
      } catch (err) {
        console.error('[BiQuote] Connection error:', err)
        setError('Failed to establish connection')
      }
    }

    connectWebSocket()

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (connection) connection.close()
    }
  }, [reconnectAttempts])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    if (price > 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return price.toFixed(2)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border overflow-hidden">
      <div className="flex items-center h-full ticker-animate" style={{ width: 'max-content' }}>
        {/* Duplicate prices for seamless loop */}
        {[...prices, ...prices].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-4 border-r border-border h-full"
          >
            <span className="text-xs text-muted-foreground">
              {symbolDisplayNames[item.symbol] || item.symbol}
            </span>
            <span className="text-sm font-medium text-foreground">
              {formatPrice(item.price)}
            </span>
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

      {/* Live indicator */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-background rounded">
        <span className={`relative flex h-2 w-2 ${isConnected ? 'animate-pulse' : ''}`}>
          <span
            className={`${
              isConnected ? 'pulse-live absolute inline-flex h-full w-full rounded-full opacity-75' : ''
            } bg-${isConnected ? 'primary' : 'destructive'}`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 bg-${isConnected ? 'primary' : 'destructive'}`}
          ></span>
        </span>
        <span className="text-xs text-muted-foreground">
          {isConnected ? 'LIVE' : error ? 'ERROR' : 'OFFLINE'}
        </span>
      </div>
    </div>
  )
}
