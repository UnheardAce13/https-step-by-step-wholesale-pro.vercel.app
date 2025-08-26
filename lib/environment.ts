/**
 * Environment Configuration Validator
 * Ensures all required environment variables are properly configured
 * according to project specifications for third-party integrations
 */

interface EnvironmentConfig {
  // Supabase Configuration
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey: string
  }
  
  // Stripe Configuration
  stripe: {
    secretKey: string
    publishableKey: string
    webhookSecret?: string
  }
  
  // Telnyx SMS Configuration
  telnyx: {
    apiKey: string
    fromNumber: string
  }
  
  // DocuSign Configuration
  docusign: {
    integrationKey: string
    userId: string
    accountId: string
    privateKey: string
  }
  
  // Zapier Configuration
  zapier: {
    webhookUrl: string
  }
  
  // Application Configuration
  app: {
    siteUrl: string
    environment: 'development' | 'production' | 'staging'
  }
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator
  private config: EnvironmentConfig | null = null
  private errors: string[] = []

  private constructor() {}

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator()
    }
    return EnvironmentValidator.instance
  }

  /**
   * Validates and loads environment configuration
   */
  public validateEnvironment(): { isValid: boolean; config?: EnvironmentConfig; errors: string[] } {
    this.errors = []
    
    try {
      this.config = {
        supabase: {
          url: this.getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
          anonKey: this.getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
          serviceRoleKey: this.getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')
        },
        stripe: {
          secretKey: this.getRequiredEnv('STRIPE_SECRET_KEY'),
          publishableKey: this.getRequiredEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
          webhookSecret: this.getOptionalEnv('STRIPE_WEBHOOK_SECRET')
        },
        telnyx: {
          apiKey: this.getRequiredEnv('TELNYX_API_KEY'),
          fromNumber: this.getRequiredEnv('TELNYX_SMS_FROM_NUMBER')
        },
        docusign: {
          integrationKey: this.getRequiredEnv('DOCUSIGN_INTEGRATION_KEY'),
          userId: this.getRequiredEnv('DOCUSIGN_USER_ID'),
          accountId: this.getRequiredEnv('DOCUSIGN_ACCOUNT_ID'),
          privateKey: this.getRequiredEnv('DOCUSIGN_RSA_PRIVATE_KEY')
        },
        zapier: {
          webhookUrl: this.getRequiredEnv('ZAPIER_WEBHOOK_URL')
        },
        app: {
          siteUrl: this.getRequiredEnv('NEXT_PUBLIC_SITE_URL'),
          environment: (process.env.NODE_ENV as any) || 'development'
        }
      }

      // Additional validation rules
      this.validateUrls()
      this.validatePhoneNumber()
      this.validateKeys()

      return {
        isValid: this.errors.length === 0,
        config: this.config,
        errors: this.errors
      }
    } catch (error) {
      this.errors.push(`Environment validation failed: ${error}`)
      return {
        isValid: false,
        errors: this.errors
      }
    }
  }

  /**
   * Gets the current validated configuration
   */
  public getConfig(): EnvironmentConfig {
    if (!this.config) {
      const result = this.validateEnvironment()
      if (!result.isValid) {
        throw new Error(`Environment not properly configured: ${result.errors.join(', ')}`)
      }
    }
    return this.config!
  }

  /**
   * Checks if a specific integration is available
   */
  public isIntegrationAvailable(integration: keyof EnvironmentConfig): boolean {
    try {
      const config = this.getConfig()
      const integrationConfig = config[integration]
      
      if (typeof integrationConfig === 'object') {
        return Object.values(integrationConfig).every(value => 
          value !== undefined && value !== null && value !== ''
        )
      }
      
      return integrationConfig !== undefined && integrationConfig !== null && integrationConfig !== ''
    } catch {
      return false
    }
  }

  /**
   * Gets configuration for a specific integration
   */
  public getIntegrationConfig<T extends keyof EnvironmentConfig>(integration: T): EnvironmentConfig[T] {
    const config = this.getConfig()
    return config[integration]
  }

  private getRequiredEnv(key: string): string {
    const value = process.env[key]
    if (!value) {
      this.errors.push(`Missing required environment variable: ${key}`)
      return ''
    }
    return value
  }

  private getOptionalEnv(key: string): string | undefined {
    return process.env[key]
  }

  private validateUrls(): void {
    if (this.config) {
      // Validate Supabase URL
      if (!this.config.supabase.url.startsWith('https://')) {
        this.errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL')
      }

      // Validate Site URL
      if (!this.config.app.siteUrl.startsWith('http')) {
        this.errors.push('NEXT_PUBLIC_SITE_URL must be a valid HTTP/HTTPS URL')
      }

      // Validate Zapier Webhook URL
      if (!this.config.zapier.webhookUrl.startsWith('https://')) {
        this.errors.push('ZAPIER_WEBHOOK_URL must be a valid HTTPS URL')
      }
    }
  }

  private validatePhoneNumber(): void {
    if (this.config) {
      const phoneNumber = this.config.telnyx.fromNumber
      if (!phoneNumber.startsWith('+')) {
        this.errors.push('TELNYX_SMS_FROM_NUMBER must be in E.164 format (starting with +)')
      }
    }
  }

  private validateKeys(): void {
    if (this.config) {
      // Validate Stripe keys
      if (!this.config.stripe.secretKey.startsWith('sk_')) {
        this.errors.push('STRIPE_SECRET_KEY must be a valid Stripe secret key (starts with sk_)')
      }
      
      if (!this.config.stripe.publishableKey.startsWith('pk_')) {
        this.errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a valid Stripe publishable key (starts with pk_)')
      }

      // Validate Supabase keys
      if (this.config.supabase.serviceRoleKey.length < 50) {
        this.errors.push('SUPABASE_SERVICE_ROLE_KEY appears to be invalid (too short)')
      }
    }
  }

  /**
   * Generates a configuration report for debugging
   */
  public generateConfigReport(): string {
    const validation = this.validateEnvironment()
    
    let report = '=== Environment Configuration Report ===\n\n'
    
    if (validation.isValid) {
      report += '✅ Environment validation: PASSED\n\n'
      
      report += 'Configured Integrations:\n'
      const integrations: (keyof EnvironmentConfig)[] = ['supabase', 'stripe', 'telnyx', 'docusign', 'zapier', 'app']
      
      integrations.forEach(integration => {
        const available = this.isIntegrationAvailable(integration)
        report += `  ${available ? '✅' : '❌'} ${integration.toUpperCase()}: ${available ? 'Available' : 'Missing/Invalid'}\n`
      })
    } else {
      report += '❌ Environment validation: FAILED\n\n'
      report += 'Errors:\n'
      validation.errors.forEach(error => {
        report += `  - ${error}\n`
      })
    }
    
    report += '\n=== End Report ===\n'
    return report
  }
}

// Export singleton instance
export const envValidator = EnvironmentValidator.getInstance()

// Export types
export type { EnvironmentConfig }

// Utility functions
export function validateEnvironment() {
  return envValidator.validateEnvironment()
}

export function getConfig() {
  return envValidator.getConfig()
}

export function isIntegrationAvailable(integration: keyof EnvironmentConfig) {
  return envValidator.isIntegrationAvailable(integration)
}

export function getIntegrationConfig<T extends keyof EnvironmentConfig>(integration: T): EnvironmentConfig[T] {
  return envValidator.getIntegrationConfig(integration)
}