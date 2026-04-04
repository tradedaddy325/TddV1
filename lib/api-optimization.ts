// API Call Cache and Retry Logic
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const apiCache = new Map<string, CacheEntry<any>>()

export async function fetchWithCache<T>(
  url: string,
  options: {
    ttl?: number
    retries?: number
    onError?: (error: Error) => void
  } = {}
) {
  const { ttl = 60000, retries = 3 } = options
  
  // Check cache
  const cached = apiCache.get(url)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data as T
  }

  let lastError: Error | null = null

  // Retry logic
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data: T = await response.json()
      
      // Cache the result
      apiCache.set(url, {
        data,
        timestamp: Date.now(),
        ttl,
      })
      
      return data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // Exponential backoff
      if (attempt < retries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        )
      }
    }
  }

  if (options.onError && lastError) {
    options.onError(lastError)
  }

  throw lastError
}

export function clearCache(pattern?: string) {
  if (!pattern) {
    apiCache.clear()
    return
  }

  for (const key of apiCache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key)
    }
  }
}

// Rate limiting
export class RateLimiter {
  private calls: number[] = []
  private readonly maxCalls: number
  private readonly windowMs: number

  constructor(maxCalls: number = 10, windowMs: number = 60000) {
    this.maxCalls = maxCalls
    this.windowMs = windowMs
  }

  async acquire(): Promise<void> {
    const now = Date.now()
    
    // Remove old calls
    this.calls = this.calls.filter(time => now - time < this.windowMs)

    if (this.calls.length >= this.maxCalls) {
      // Wait until oldest call is outside window
      const oldestCall = this.calls[0]
      const waitTime = this.windowMs - (now - oldestCall)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      
      // Recursively try again
      return this.acquire()
    }

    this.calls.push(now)
  }

  reset(): void {
    this.calls = []
  }
}

// Request queue for batch operations
export class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private readonly concurrency: number
  private activeRequests = 0

  constructor(concurrency: number = 3) {
    this.concurrency = concurrency
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return
    if (this.activeRequests >= this.concurrency) return

    this.processing = true
    this.activeRequests++

    try {
      const request = this.queue.shift()
      if (request) {
        await request()
      }
    } finally {
      this.activeRequests--
      this.processing = false
      
      if (this.queue.length > 0) {
        this.process()
      }
    }
  }
}

// Error handling and logging
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.retryable
  }
  
  if (error instanceof TypeError) {
    return true // Network errors are retryable
  }

  return false
}

export function logAPIError(
  endpoint: string,
  error: unknown,
  context?: Record<string, any>
) {
  console.error(`[API Error] ${endpoint}`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...context,
  })
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now()
    try {
      return await fn()
    } finally {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
    }
  }

  getStats(name: string): {
    count: number
    avg: number
    min: number
    max: number
  } | null {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null

    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }

  printStats(): void {
    for (const [name, values] of this.metrics.entries()) {
      if (values.length === 0) continue
      
      const stats = this.getStats(name)
      if (stats) {
        console.log(
          `[Performance] ${name}: ${stats.avg.toFixed(2)}ms ` +
          `(min: ${stats.min.toFixed(2)}ms, max: ${stats.max.toFixed(2)}ms, count: ${stats.count})`
        )
      }
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
