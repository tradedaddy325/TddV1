'use client'

import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerPrice {
  symbol: string
  price: number
  change: number
  displayName: string
}

const MARKET_SYMBOLS = [
  { symbol: 'BTCUSD', display: 'BTC/USD' },
  { symbol: 'ETHUSD', display: 'ETH/USD' },
  { symbol: 'XAUUSD', display: 'XAU/USD' },
  { symbol: 'EURUSD', display: 'EUR/USD' },
  { symbol: 'US30', display: 'US30' },
  { symbol: 'USOIL', display: 'USOIL' },
]

export function PriceTicker() {
  const [prices, setPrices] = useState<TickerPrice[]>([])
  const [isLive, setIsLive] = useState(false)
  const priceMapRef = React.useRef(new Map<string, { price: number; lastPrice: number }>())

  useEffect(() => {
    let connection: signalR.HubConnection | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5

    const connectSignalR = async () => {
      try {
        connection = new signalR.HubConnectionBuilder()
          .withUrl('https://biquote.io/hubs/tick')
          .withAutomaticReconnect([0, 0, 3000, 5000, 10000, 15000])
          .withHubProtocol(new signalR.JsonHubProtocol())
          .build()

        connection.on('ReceiveTick', (tick) => {
          handleTickData(tick)
        })

        connection.onreconnecting(() => {
          console.log('[BiQuote] Reconnecting...')
          setIsLive(false)
        })

        connection.onreconnected(() => {
          console.log('[BiQuote] Reconnected')
          setIsLive(true)
        })

        connection.onclose(async () => {
          console.log('[BiQuote] Connection closed')
          setIsLive(false)
          
          // Manual reconnect with backoff
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
            reconnectAttempts++
            console.log(`[BiQuote] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`)
            reconnectTimeout = setTimeout(connectSignalR, delay)
          }
        })

        await connection.start()
        console.log('[BiQuote] Connected')
        setIsLive(true)
        reconnectAttempts = 0

        // Subscribe to symbols
        await connection.invoke('Subscribe', MARKET_SYMBOLS.map((s) => s.symbol))
        console.log('[BiQuote] Subscribed to market symbols')
      } catch (err) {
        console.error('[BiQuote] Connection error:', err)
        setIsLive(false)

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
          reconnectAttempts++
          reconnectTimeout = setTimeout(connectSignalR, delay)
        }
      }
    }

    const handleTickData = (tick: any) => {
      const symbol = tick.symbol
      const lastPrice = tick.last || tick.ask || tick.bid

      if (!lastPrice) return

      const symConfig = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
      if (!symConfig) return

      const priceMap = priceMapRef.current
      const prev = priceMap.get(symbol)
      const prevPrice = prev?.lastPrice || lastPrice
      const change = ((lastPrice - prevPrice) / prevPrice) * 100

      priceMap.set(symbol, { price: lastPrice, lastPrice })

      setPrices((current) => {
        const existing = current.find((p) => p.symbol === symbol)
        const newPrice: TickerPrice = {
          symbol,
          displayName: symConfig.display,
          price: lastPrice,
          change: isNaN(change) ? 0 : Math.min(Math.max(change, -100), 100),
        }

        if (existing) {
          return current.map((p) => (p.symbol === symbol ? newPrice : p))
        }
        return [...current, newPrice]
      })
    }

    connectSignalR()

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (connection) {
        connection.stop().catch((err) => console.error('[BiQuote] Error stopping connection:', err))
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    if (price > 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return price.toFixed(2)
  }

  if (prices.length === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border flex items-center px-4">
        <span className="text-xs text-muted-foreground">Connecting to live market data...</span>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border overflow-hidden">
      <div className="flex items-center h-full ticker-animate" style={{ width: 'max-content' }}>
        {[...prices, ...prices].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-3 border-r border-border h-full whitespace-nowrap"
          >
            <span className="text-xs text-muted-foreground font-medium">{item.displayName}</span>
            <span className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</span>
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                item.change >= 0 ? 'text-primary' : 'text-destructive'
              )}
            >
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">
                {item.change >= 0 ? '+' : ''}
                {Math.abs(item.change).toFixed(2)}%
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-background rounded text-xs">
        <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
        <span className="text-muted-foreground text-xs">{isLive ? 'LIVE' : 'CONNECTING'}</span>
      </div>
    </div>
  )
}

// Add React to the imports at the top
import React from 'react'
