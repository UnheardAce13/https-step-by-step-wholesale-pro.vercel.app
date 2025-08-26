import { NextResponse } from "next/server"
import { envValidator } from "@/lib/environment"

export async function GET() {
  try {
    // Validate environment configuration
    const envValidation = envValidator.validateEnvironment()
    
    if (!envValidation.isValid) {
      return NextResponse.json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        errors: envValidation.errors,
        message: "Environment configuration invalid"
      }, { status: 503 })
    }

    // Basic health check
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      integrations: {
        supabase: envValidator.isIntegrationAvailable('supabase'),
        stripe: envValidator.isIntegrationAvailable('stripe'),
        telnyx: envValidator.isIntegrationAvailable('telnyx'),
        docusign: envValidator.isIntegrationAvailable('docusign'),
        zapier: envValidator.isIntegrationAvailable('zapier')
      },
      memory: process.memoryUsage(),
      pid: process.pid
    }

    return NextResponse.json(healthStatus)
  } catch (error: any) {
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
      message: "Health check failed"
    }, { status: 503 })
  }
}