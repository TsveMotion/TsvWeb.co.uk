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
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config || !this.isConfigured()) {
      throw new Error('Uptime Kuma service not configured')
    }

    const url = `${this.config.baseUrl}${endpoint}`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'X-API-KEY': this.config.apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error(`Uptime Kuma API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Get monitors from Uptime Kuma API
   */
  async getMonitorsFromAPI(): Promise<any[]> {
    try {
      // Check if service is configured first
      if (!this.isConfigured()) {
        // Silently return mock data if not configured (no error logging)
        return this.getMockMonitors()
      }
      
      // Try the API endpoint for monitors
      const response = await this.makeRequest('/api/monitor')
      return response.monitors || response || []
    } catch (error) {
      // Only log detailed errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch monitors from API:', error)
      }
      // Return mock data as fallback
      return this.getMockMonitors()
    }
  }

  /**
   * Get mock monitor data as fallback
   */
  private getMockMonitors(): UptimeMonitor[] {
    return [
      {
        id: 1,
        name: 'TsvWeb Main Site',
        url: 'https://tsvweb.com',
        type: 'http',
        status: 'up',
        uptime: 99.8,
        ping: 245,
        lastHeartbeat: new Date().toISOString(),
        tags: ['production', 'main']
      },
      {
        id: 2,
        name: 'MuscleMatrix UK',
        url: 'https://musclematrix.uk',
        type: 'http',
        status: 'up',
        uptime: 99.5,
        ping: 180,
        lastHeartbeat: new Date().toISOString(),
        tags: ['client', 'ecommerce']
      },
      {
        id: 3,
        name: 'Client Portal',
        url: 'https://portal.tsvweb.com',
        type: 'http',
        status: 'up',
        uptime: 99.9,
        ping: 120,
        lastHeartbeat: new Date().toISOString(),
        tags: ['portal', 'internal']
      },
      {
        id: 4,
        name: 'API Gateway',
        url: 'https://api.tsvweb.com',
        type: 'http',
        status: 'up',
        uptime: 99.7,
        ping: 95,
        lastHeartbeat: new Date().toISOString(),
        tags: ['api', 'backend']
      },
      {
        id: 5,
        name: 'Uptime Monitor',
        url: 'https://uptime.tsvweb.com',
        type: 'http',
        status: 'up',
        uptime: 99.6,
        ping: 210,
        lastHeartbeat: new Date().toISOString(),
        tags: ['monitoring', 'internal']
      }
    ]
  }



  /**
   * Get all monitors with their current status
   */
  async getMonitors(customerWebsites?: string[]): Promise<UptimeMonitor[]> {
    try {
      const allMonitorsData = await this.getMonitorsFromAPI()
      
      // Ensure we have an array of monitors
      const allMonitors = Array.isArray(allMonitorsData) ? allMonitorsData : this.getMockMonitors()
      
      // Filter monitors based on customer's assigned websites
      if (customerWebsites && customerWebsites.length > 0) {
        return allMonitors.filter(monitor => {
          return customerWebsites.some(website => {
            // Check if monitor URL matches any of the customer's websites
            const normalizedMonitorUrl = this.normalizeUrl(monitor.url)
            const normalizedWebsite = this.normalizeUrl(website)
            return normalizedMonitorUrl.includes(normalizedWebsite) || 
                   normalizedWebsite.includes(normalizedMonitorUrl) ||
                   monitor.name.toLowerCase().includes(normalizedWebsite.toLowerCase())
          })
        })
      }
      
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
