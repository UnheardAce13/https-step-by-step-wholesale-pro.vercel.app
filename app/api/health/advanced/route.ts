import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  services: {
    database: ServiceStatus
    authentication: ServiceStatus
    stripe: ServiceStatus
    telnyx: ServiceStatus
    docusign: ServiceStatus
    zapier: ServiceStatus
  }
  performance: {
    responseTime: number
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: number
  }
  errors: string[]
}

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down'
  responseTime?: number
  lastChecked: string
  error?: string
}

export async function GET() {
  const startTime = Date.now()
  const errors: string[] = []
  
  try {
    // Initialize health status
    const health: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: { status: 'down', lastChecked: new Date().toISOString() },
        authentication: { status: 'down', lastChecked: new Date().toISOString() },
        stripe: { status: 'down', lastChecked: new Date().toISOString() },
        telnyx: { status: 'down', lastChecked: new Date().toISOString() },
        docusign: { status: 'down', lastChecked: new Date().toISOString() },
        zapier: { status: 'down', lastChecked: new Date().toISOString() }
      },
      performance: {
        responseTime: 0,
        memoryUsage: process.memoryUsage(),
        cpuUsage: 0
      },
      errors: []
    }

    // Test Database Connection
    try {
      const supabase = createAdminClient()
      const dbStart = Date.now()
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) throw error
      
      health.services.database = {
        status: 'operational',
        responseTime: Date.now() - dbStart,
        lastChecked: new Date().toISOString()
      }
    } catch (error: any) {
      health.services.database.error = error.message
      health.services.database.status = 'down'
      errors.push(`Database: ${error.message}`)
    }

    // Test Authentication
    try {
      const supabase = createAdminClient()
      const authStart = Date.now()
      const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
      
      if (error) throw error
      
      health.services.authentication = {
        status: 'operational',
        responseTime: Date.now() - authStart,
        lastChecked: new Date().toISOString()
      }
    } catch (error: any) {
      health.services.authentication.error = error.message
      health.services.authentication.status = 'down'
      errors.push(`Authentication: ${error.message}`)
    }

    // Test Stripe Connection
    try {
      if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe secret key not configured')
      
      const stripeStart = Date.now()
      const response = await fetch('https://api.stripe.com/v1/customers?limit=1', {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      if (!response.ok) throw new Error(`Stripe API returned ${response.status}`)
      
      health.services.stripe = {
        status: 'operational',
        responseTime: Date.now() - stripeStart,
        lastChecked: new Date().toISOString()
      }
    } catch (error: any) {
      health.services.stripe.error = error.message
      health.services.stripe.status = 'down'
      errors.push(`Stripe: ${error.message}`)
    }

    // Test Telnyx Connection
    try {
      if (!process.env.TELNYX_API_KEY) throw new Error('Telnyx API key not configured')
      
      const telnyxStart = Date.now()
      const response = await fetch('https://api.telnyx.com/v2/messages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) throw new Error(`Telnyx API returned ${response.status}`)
      
      health.services.telnyx = {
        status: 'operational',
        responseTime: Date.now() - telnyxStart,
        lastChecked: new Date().toISOString()
      }
    } catch (error: any) {
      health.services.telnyx.error = error.message
      health.services.telnyx.status = 'down'
      errors.push(`Telnyx: ${error.message}`)
    }

    // Test DocuSign (basic configuration check)
    try {
      if (!process.env.DOCUSIGN_INTEGRATION_KEY) throw new Error('DocuSign integration key not configured')
      if (!process.env.DOCUSIGN_USER_ID) throw new Error('DocuSign user ID not configured')
      
      health.services.docusign = {
        status: 'operational',
        responseTime: 50, // Mock response time for config check
        lastChecked: new Date().toISOString()
      }
    } catch (error: any) {
      health.services.docusign.error = error.message
      health.services.docusign.status = 'down'
      errors.push(`DocuSign: ${error.message}`)
    }

    // Test Zapier Connection
    try {
      if (!process.env.ZAPIER_WEBHOOK_URL) throw new Error('Zapier webhook URL not configured')
      
      health.services.zapier = {
        status: 'operational',
        responseTime: 25, // Mock response time for config check
        lastChecked: new Date().toISOString()
      }
    } catch (error: any) {
      health.services.zapier.error = error.message
      health.services.zapier.status = 'down'
      errors.push(`Zapier: ${error.message}`)
    }

    // Calculate overall health status
    const serviceStatuses = Object.values(health.services).map(s => s.status)
    const downServices = serviceStatuses.filter(s => s === 'down').length
    const degradedServices = serviceStatuses.filter(s => s === 'degraded').length

    if (downServices > 2) {
      health.status = 'unhealthy'
    } else if (downServices > 0 || degradedServices > 1) {
      health.status = 'degraded'
    } else {
      health.status = 'healthy'
    }

    // Performance metrics
    health.performance.responseTime = Date.now() - startTime
    health.performance.cpuUsage = process.cpuUsage().user / 1000000 // Convert to milliseconds
    health.errors = errors

    // Set appropriate HTTP status code
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 207 : 503

    return NextResponse.json(health, { status: statusCode })

  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: Date.now() - startTime
    }, { status: 503 })
  }
}