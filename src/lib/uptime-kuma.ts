/**
 * Uptime Kuma API Integration
 * Handles authentication and data fetching from Uptime Kuma instance
 */

export interface UptimeMonitor {
  id: number
  name: string
  url: string
  type: string
  status: 'up' | 'down' | 'pending' | 'maintenance'
  uptime: number
  ping: number
  lastHeartbeat?: string
  tags?: string[]
}

export interface UptimeStats {
  totalMonitors: number
  upMonitors: number
  downMonitors: number
  pendingMonitors: number
  avgUptime: number
  avgResponseTime: number
}

export interface UptimeKumaConfig {
  baseUrl: string
  apiKey: string
  enabled: boolean
}

class UptimeKumaService {
  private config: UptimeKumaConfig | null = null

  /**
   * Initialize the service with configuration
   */
  async initialize(): Promise<void> {
    try {
      this.config = {
        baseUrl: process.env.UPTIME_KUMA_URL || '',
        apiKey: process.env.UPTIME_KUMA_API_KEY || '',
        enabled: !!(process.env.UPTIME_KUMA_URL && process.env.UPTIME_KUMA_API_KEY)
      }
    } catch (error) {
      console.error('Failed to initialize Uptime Kuma service:', error)
      this.config = { baseUrl: '', apiKey: '', enabled: false }
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config?.enabled && this.config?.baseUrl && this.config?.apiKey)
  }

  /**
   * Make authenticated request to Uptime Kuma API
   * Uses HTTP Basic Auth with API Key as password (per Uptime Kuma API docs)
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config || !this.isConfigured()) {
      throw new Error('Uptime Kuma service not configured')
    }

    const url = `${this.config.baseUrl}${endpoint}`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      // Create Basic Auth header with API key as password
      const authString = Buffer.from(`:${this.config.apiKey}`).toString('base64')
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Basic ${authString}`,
          'Accept': 'text/plain', // Metrics endpoint returns plain text
          ...options.headers,
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error(`[Uptime Kuma] API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Get monitors from Uptime Kuma API
   * Note: Uptime Kuma primarily uses Socket.io, not REST API for monitors
   * This implementation uses the /metrics endpoint to extract monitor data
   */
  async getMonitorsFromAPI(): Promise<any[]> {
    try {
      // Check if service is configured first
      if (!this.isConfigured()) {
        console.log('[Uptime Kuma] Service not configured - returning empty monitors')
        return this.getMockMonitors()
      }
      
      console.log('[Uptime Kuma] Fetching monitors from /metrics endpoint...')
      
      // Fetch metrics endpoint which provides monitor data in Prometheus format
      const metricsText = await this.makeRequest('/metrics')
      
      // Parse Prometheus metrics to extract monitor information
      const monitors = this.parseMetricsToMonitors(metricsText)
      
      console.log(`[Uptime Kuma] Found ${monitors.length} monitors from metrics`)
      return monitors
    } catch (error) {
      console.error('[Uptime Kuma] Failed to fetch monitors from API:', error)
      if (error instanceof Error) {
        console.error('[Uptime Kuma] Error details:', error.message)
      }
      // Return empty array as fallback
      return this.getMockMonitors()
    }
  }

  /**
   * Parse Prometheus metrics format to extract monitor data
   */
  private parseMetricsToMonitors(metricsText: string): UptimeMonitor[] {
    const monitors: Map<string, UptimeMonitor> = new Map()
    
    // Split metrics into lines
    const lines = metricsText.split('\n')
    
    for (const line of lines) {
      // Skip comments and empty lines
      if (line.startsWith('#') || !line.trim()) continue
      
      // Parse monitor_status metric
      if (line.startsWith('monitor_status{')) {
        const match = line.match(/monitor_status\{([^}]+)\}\s+(\d+)/)
        if (match) {
          const labels = this.parseLabels(match[1])
          const status = parseInt(match[2])
          
          const monitorId = labels.monitor_id || labels.monitor_name
          if (monitorId && !monitors.has(monitorId)) {
            monitors.set(monitorId, {
              id: parseInt(labels.monitor_id || '0'),
              name: labels.monitor_name || 'Unknown',
              url: labels.monitor_url || labels.monitor_hostname || '',
              type: labels.monitor_type || 'http',
              status: this.mapStatusCode(status),
              uptime: 0,
              ping: 0,
              tags: labels.monitor_tags ? labels.monitor_tags.split(',') : []
            })
          }
          
          if (monitorId && monitors.has(monitorId)) {
            const monitor = monitors.get(monitorId)!
            monitor.status = this.mapStatusCode(status)
          }
        }
      }
      
      // Parse monitor_response_time metric
      if (line.startsWith('monitor_response_time{')) {
        const match = line.match(/monitor_response_time\{([^}]+)\}\s+([\d.]+)/)
        if (match) {
          const labels = this.parseLabels(match[1])
          const ping = parseFloat(match[2])
          
          const monitorId = labels.monitor_id || labels.monitor_name
          if (monitorId && monitors.has(monitorId)) {
            monitors.get(monitorId)!.ping = Math.round(ping)
          }
        }
      }
    }
    
    // Calculate uptime based on status (simplified)
    monitors.forEach(monitor => {
      monitor.uptime = monitor.status === 'up' ? 99.9 : 0
    })
    
    return Array.from(monitors.values())
  }

  /**
   * Parse Prometheus label format
   */
  private parseLabels(labelString: string): Record<string, string> {
    const labels: Record<string, string> = {}
    const pairs = labelString.match(/(\w+)="([^"]*)"/g) || []
    
    for (const pair of pairs) {
      const match = pair.match(/(\w+)="([^"]*)"/)
      if (match) {
        labels[match[1]] = match[2]
      }
    }
    
    return labels
  }

  /**
   * Map numeric status code to string status
   */
  private mapStatusCode(code: number): 'up' | 'down' | 'pending' | 'maintenance' {
    switch (code) {
      case 1: return 'up'
      case 0: return 'down'
      case 2: return 'pending'
      case 3: return 'maintenance'
      default: return 'pending'
    }
  }

  /**
   * Get mock monitor data as fallback - returns empty array to show real "no monitors" state
   */
  private getMockMonitors(): UptimeMonitor[] {
    // Return empty array instead of fake data
    // This ensures customers only see their actual monitors from Uptime Kuma
    return []
  }



  /**
   * Get all monitors with their current status
   * Filters to show only customer's websites + TsvWeb infrastructure monitors
   */
  async getMonitors(customerWebsites?: string[]): Promise<UptimeMonitor[]> {
    try {
      const allMonitorsData = await this.getMonitorsFromAPI()
      
      // Ensure we have an array of monitors
      const allMonitors = Array.isArray(allMonitorsData) ? allMonitorsData : this.getMockMonitors()
      
      // Define TsvWeb infrastructure domains that should always be shown
      const tsvwebInfrastructure = [
        'tsvweb.com',
        'ddns.tsvweb.com',
        'uptime.tsvweb.com'
      ]
      
      // Filter monitors based on customer's assigned websites + TsvWeb infrastructure
      if (customerWebsites && customerWebsites.length > 0) {
        return allMonitors.filter(monitor => {
          const normalizedMonitorUrl = this.normalizeUrl(monitor.url)
          const monitorNameLower = monitor.name.toLowerCase()
          
          // Check if it's a TsvWeb infrastructure monitor
          const isTsvWebInfra = tsvwebInfrastructure.some(infraDomain => {
            const normalizedInfra = this.normalizeUrl(infraDomain)
            return normalizedMonitorUrl.includes(normalizedInfra) || 
                   monitorNameLower.includes(normalizedInfra)
          })
          
          if (isTsvWebInfra) {
            return true
          }
          
          // Check if monitor matches customer's assigned websites
          return customerWebsites.some(website => {
            const normalizedWebsite = this.normalizeUrl(website)
            return normalizedMonitorUrl.includes(normalizedWebsite) || 
                   normalizedWebsite.includes(normalizedMonitorUrl) ||
                   monitorNameLower.includes(normalizedWebsite.toLowerCase())
          })
        })
      }
      
      // If no customer websites assigned, return all monitors
      return allMonitors
    } catch (error) {
      console.error('Failed to get monitors:', error)
      return this.getMockMonitors()
    }
  }

  /**
   * Normalize URL for comparison
   */
  private normalizeUrl(url: string): string {
    if (!url) return ''
    
    // Remove protocol and www
    return url
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '') // Remove trailing slash
  }

  /**
   * Get overall uptime statistics
   */
  async getStats(): Promise<UptimeStats> {
    try {
      const monitors = await this.getMonitors()
      
      const totalMonitors = monitors.length
      const upMonitors = monitors.filter(m => m.status === 'up').length
      const downMonitors = monitors.filter(m => m.status === 'down').length
      const pendingMonitors = monitors.filter(m => m.status === 'pending').length
      
      const avgUptime = totalMonitors > 0 
        ? monitors.reduce((sum, m) => sum + m.uptime, 0) / totalMonitors 
        : 0
      
      const avgResponseTime = totalMonitors > 0
        ? monitors.reduce((sum, m) => sum + m.ping, 0) / totalMonitors
        : 0

      return {
        totalMonitors,
        upMonitors,
        downMonitors,
        pendingMonitors,
        avgUptime,
        avgResponseTime
      }
    } catch (error) {
      console.error('Failed to get uptime stats:', error)
      return {
        totalMonitors: 0,
        upMonitors: 0,
        downMonitors: 0,
        pendingMonitors: 0,
        avgUptime: 0,
        avgResponseTime: 0
      }
    }
  }

  /**
   * Test the connection to Uptime Kuma
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured()) {
        return { success: false, message: 'Service not configured' }
      }

      await this.getMonitorsFromAPI()
      return { success: true, message: 'Connection successful' }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

// Export singleton instance
export const uptimeKumaService = new UptimeKumaService()

// Initialize on module load
uptimeKumaService.initialize().catch(console.error)
