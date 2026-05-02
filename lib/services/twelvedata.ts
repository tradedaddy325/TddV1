// TwelveData API Service for real-time market data
const TWELVE_DATA_API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  timestamp: number;
}

export interface TimeSeriesData {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

class TwelveDataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  private readonly TERMINAL_CACHE_DURATION = 15 * 1000; // 15 seconds for terminal
  private readonly DASHBOARD_CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours for dashboard

  private getCachedData(key: string, cacheDuration: number): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getQuote(symbol: string, isTerminal: boolean = false): Promise<MarketQuote | null> {
    const cacheKey = `quote_${symbol}`;
    const cacheDuration = isTerminal ? this.TERMINAL_CACHE_DURATION : this.DASHBOARD_CACHE_DURATION;
    
    const cached = this.getCachedData(cacheKey, cacheDuration);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (data.code === 429) {
        console.warn('TwelveData API rate limit reached');
        return cached;
      }

      const quote: MarketQuote = {
        symbol: data.symbol,
        name: data.name,
        price: parseFloat(data.close),
        change: parseFloat(data.change),
        changePercent: parseFloat(data.percent_change),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        open: parseFloat(data.open),
        previousClose: parseFloat(data.previous_close),
        volume: parseFloat(data.volume),
        timestamp: Date.now(),
      };
      this.setCachedData(cacheKey, quote);
      return quote;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return cached;
    }
  }

  async getMultipleQuotes(symbols: string[], isTerminal: boolean = false): Promise<MarketQuote[]> {
    const symbolString = symbols.join(',');
    const cacheKey = `quotes_${symbolString}`;
    const cacheDuration = isTerminal ? this.TERMINAL_CACHE_DURATION : this.DASHBOARD_CACHE_DURATION;
    
    const cached = this.getCachedData(cacheKey, cacheDuration);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${BASE_URL}/quote?symbol=${symbolString}&apikey=${TWELVE_DATA_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (data.code === 429) {
        console.warn('TwelveData API rate limit reached');
        return cached || [];
      }

      const quotesArray = Array.isArray(data) ? data : [data];
      
      const quotes: MarketQuote[] = quotesArray.map((item: any) => ({
        symbol: item.symbol,
        name: item.name,
        price: parseFloat(item.close),
        change: parseFloat(item.change),
        changePercent: parseFloat(item.percent_change),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        open: parseFloat(item.open),
        previousClose: parseFloat(item.previous_close),
        volume: parseFloat(item.volume),
        timestamp: Date.now(),
      }));
      this.setCachedData(cacheKey, quotes);
      return quotes;
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return cached || [];
    }
  }

  async getTimeSeries(
    symbol: string,
    interval: string = '1day',
    outputsize: number = 30
  ): Promise<TimeSeriesData[]> {
    const cacheKey = `timeseries_${symbol}_${interval}_${outputsize}`;
    const cached = this.getCachedData(cacheKey, this.DASHBOARD_CACHE_DURATION);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (data.code === 429) {
        console.warn('TwelveData API rate limit reached');
        return cached || [];
      }

      const timeSeries = data.values || [];
      this.setCachedData(cacheKey, timeSeries);
      return timeSeries;
    } catch (error) {
      console.error(`Error fetching time series for ${symbol}:`, error);
      return cached || [];
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const twelveDataService = new TwelveDataService();
