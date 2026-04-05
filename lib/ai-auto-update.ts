/**
 * AI Auto-Update System
 * Manages automatic data fetching from AI APIs with configurable intervals
 */

interface UpdateConfig {
  interval: number // milliseconds
  key: string
  fetcher: () => Promise<any>
}

const updateIntervals = new Map<string, NodeJS.Timeout>()

/**
 * Start auto-updating a data source
 */
export function startAutoUpdate(config: UpdateConfig, onData: (data: any) => void): () => void {
  // Initial fetch
  config.fetcher().then(onData).catch(console.error)

  // Set up recurring fetches
  const interval = setInterval(() => {
    config.fetcher().then(onData).catch(console.error)
  }, config.interval)

  updateIntervals.set(config.key, interval)

  // Return stop function
  return () => stopAutoUpdate(config.key)
}

/**
 * Stop auto-updating a data source
 */
export function stopAutoUpdate(key: string): void {
  const interval = updateIntervals.get(key)
  if (interval) {
    clearInterval(interval)
    updateIntervals.delete(key)
  }
}

/**
 * Auto-update configurations for each section
 */
export const autoUpdateConfigs = {
  dashboard: {
    interval: 30 * 60 * 1000, // 30 minutes
    key: 'dashboard-summary'
  },
  macrodesk: {
    interval: 60 * 60 * 1000, // 1 hour
    key: 'macro-desk-data'
  },
  psychology: {
    interval: 45 * 60 * 1000, // 45 minutes (30-60 range)
    key: 'market-psychology-data'
  },
  predictive: {
    interval: 3 * 60 * 60 * 1000, // 3 hours (2-4 range)
    key: 'predictive-markets-data'
  },
  signals: {
    interval: 4 * 60 * 60 * 1000, // 4 hours
    key: 'trading-signals-data'
  }
}

/**
 * Fetch from existing Claude API endpoint
 */
export async function fetchFromClaudeAPI(prompt: string): Promise<any> {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    
    if (!response.ok) throw new Error('API call failed')
    return await response.json()
  } catch (error) {
    console.error('Claude API error:', error)
    throw error
  }
}

/**
 * Fetch from existing Gemini API endpoint
 */
export async function fetchFromGeminiAPI(prompt: string): Promise<any> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    
    if (!response.ok) throw new Error('API call failed')
    return await response.json()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}

/**
 * Hook for using auto-updates in React components
 */
export function useAutoUpdate(
  config: UpdateConfig,
  onData: (data: any) => void,
  shouldStart: boolean = true
) {
  const [stopFunction, setStopFunction] = React.useState<(() => void) | null>(null)

  React.useEffect(() => {
    if (!shouldStart) return

    const stop = startAutoUpdate(config, onData)
    setStopFunction(() => stop)

    return () => {
      stop()
    }
  }, [config, onData, shouldStart])

  return () => stopFunction?.()
}
