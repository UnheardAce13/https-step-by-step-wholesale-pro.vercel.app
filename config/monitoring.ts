/**
 * S.B.S.W.P 2.0 - PRODUCTION MONITORING & OBSERVABILITY
 * Enterprise-grade monitoring for bulletproof production performance
 */

// Monitoring configuration
export const MONITORING_CONFIG = {
  // Application Performance Monitoring
  apm: {
    serviceName: 'sbswp-2.0',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    
    // Performance thresholds
    thresholds: {
      responseTime: 2000, // 2 seconds
      errorRate: 0.01, // 1%
      apdex: 0.85, // Application Performance Index
      throughput: 1000 // requests per minute
    },

    // Critical endpoints to monitor
    criticalEndpoints: [
      '/api/contracts/generate',
      '/api/analytics/predict',
      '/api/auth/signin',
      '/api/properties/analyze',
      '/dashboard/analytics'
    ]
  },

  // Real User Monitoring (RUM)
  rum: {
    enabled: true,
    sampleRate: 0.1, // 10% of users
    trackInteractions: true,
    trackLongTasks: true,
    trackResources: true,
    
    // Core Web Vitals thresholds
    coreWebVitals: {
      lcp: 2500, // Largest Contentful Paint (ms)
      fid: 100,  // First Input Delay (ms)
      cls: 0.1   // Cumulative Layout Shift
    }
  },

  // Error tracking
  errorTracking: {
    enabled: true,
    captureUnhandledRejections: true,
    captureUncaughtExceptions: true,
    
    // Error filtering
    ignoreErrors: [
      'ChunkLoadError',
      'Loading chunk',
      'Network request failed'
    ],

    // Sensitive data scrubbing
    scrubFields: [
      'password',
      'token',
      'apiKey',
      'creditCard',
      'ssn'
    ]
  },

  // Infrastructure monitoring
  infrastructure: {
    // Memory monitoring
    memory: {
      warningThreshold: 0.8, // 80%
      criticalThreshold: 0.9 // 90%
    },

    // Database monitoring
    database: {
      connectionPool: {
        maxConnections: 100,
        warningThreshold: 0.8,
        criticalThreshold: 0.95
      },
      queryPerformance: {
        slowQueryThreshold: 1000, // 1 second
        lockWaitThreshold: 5000   // 5 seconds
      }
    },

    // External service monitoring
    externalServices: {
      openai: {
        timeout: 30000,
        retries: 3,
        healthcheckInterval: 60000
      },
      docusign: {
        timeout: 15000,
        retries: 2,
        healthcheckInterval: 300000
      },
      supabase: {
        timeout: 10000,
        retries: 3,
        healthcheckInterval: 30000
      }
    }
  },

  // Business metrics
  businessMetrics: {
    // Revenue tracking
    revenue: {
      dailyTarget: 50000,
      monthlyTarget: 1500000,
      conversionRate: 0.15
    },

    // User engagement
    engagement: {
      dailyActiveUsers: 1000,
      sessionDuration: 1800000, // 30 minutes
      bounceRate: 0.3
    },

    // Contract generation metrics
    contracts: {
      dailyGeneration: 100,
      avgGenerationTime: 30000, // 30 seconds
      successRate: 0.95
    }
  }
}

// Health check endpoints
export const HEALTH_CHECKS = {
  // Basic health check
  basic: {
    path: '/api/health',
    interval: 30000, // 30 seconds
    timeout: 5000,
    retries: 3
  },

  // Database health check
  database: {
    path: '/api/health/database',
    interval: 60000, // 1 minute
    timeout: 10000,
    retries: 2
  },

  // External services health check
  external: {
    path: '/api/health/external',
    interval: 120000, // 2 minutes
    timeout: 15000,
    retries: 1
  },

  // AI services health check
  ai: {
    path: '/api/health/ai',
    interval: 300000, // 5 minutes
    timeout: 30000,
    retries: 1
  }
}

// Alerting configuration
export const ALERTING_CONFIG = {
  // Alert channels
  channels: {
    email: {
      enabled: true,
      recipients: [
        'admin@sbswp.com',
        'tech@sbswp.com',
        'ops@sbswp.com'
      ]
    },
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: '#alerts-production'
    },
    pagerduty: {
      enabled: true,
      apiKey: process.env.PAGERDUTY_API_KEY,
      serviceId: process.env.PAGERDUTY_SERVICE_ID
    }
  },

  // Alert rules
  rules: [
    {
      name: 'High Error Rate',
      condition: 'error_rate > 0.05', // 5%
      duration: '5m',
      severity: 'critical',
      channels: ['email', 'slack', 'pagerduty']
    },
    {
      name: 'Slow Response Time',
      condition: 'avg_response_time > 5000', // 5 seconds
      duration: '2m',
      severity: 'warning',
      channels: ['slack']
    },
    {
      name: 'Database Connection Issues',
      condition: 'db_connection_errors > 0',
      duration: '1m',
      severity: 'critical',
      channels: ['email', 'pagerduty']
    },
    {
      name: 'AI Service Unavailable',
      condition: 'openai_api_errors > 10',
      duration: '3m',
      severity: 'warning',
      channels: ['slack', 'email']
    },
    {
      name: 'Contract Generation Failure',
      condition: 'contract_generation_success_rate < 0.9',
      duration: '5m',
      severity: 'warning',
      channels: ['email', 'slack']
    },
    {
      name: 'Revenue Drop',
      condition: 'daily_revenue < 30000',
      duration: '1h',
      severity: 'warning',
      channels: ['email']
    }
  ]
}

// Performance optimization
export const PERFORMANCE_CONFIG = {
  // Caching strategies
  caching: {
    // Redis configuration
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: {
        analytics: 300,      // 5 minutes
        predictions: 1800,   // 30 minutes
        contracts: 86400,    // 24 hours
        static: 31536000     // 1 year
      }
    },

    // CDN configuration
    cdn: {
      enabled: true,
      provider: 'cloudflare',
      zones: ['us-east-1', 'us-west-1', 'europe-west-1'],
      cacheBehaviors: {
        static: 'cache-first',
        api: 'network-first',
        dynamic: 'network-only'
      }
    }
  },

  // Database optimization
  database: {
    connectionPooling: {
      enabled: true,
      min: 10,
      max: 100,
      idleTimeout: 300000 // 5 minutes
    },
    queryOptimization: {
      indexing: true,
      queryAnalysis: true,
      slowQueryLogging: true
    }
  },

  // Asset optimization
  assets: {
    compression: {
      enabled: true,
      level: 9,
      threshold: 1024 // 1KB
    },
    minification: {
      css: true,
      js: true,
      html: true
    },
    imageOptimization: {
      enabled: true,
      formats: ['webp', 'avif'],
      quality: 85
    }
  }
}

// Security monitoring
export const SECURITY_CONFIG = {
  // Rate limiting
  rateLimiting: {
    api: {
      windowMs: 60000, // 1 minute
      max: 100        // 100 requests per minute
    },
    auth: {
      windowMs: 900000, // 15 minutes
      max: 5           // 5 attempts per 15 minutes
    },
    contract: {
      windowMs: 300000, // 5 minutes
      max: 10          // 10 contracts per 5 minutes
    }
  },

  // Security headers
  headers: {
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: true,
    xssFilter: true
  },

  // Intrusion detection
  intrusionDetection: {
    enabled: true,
    suspiciousActivity: [
      'multiple_failed_logins',
      'unusual_access_patterns',
      'automated_requests',
      'sql_injection_attempts',
      'xss_attempts'
    ],
    actionThresholds: {
      block: 10,     // Block after 10 suspicious events
      alert: 5      // Alert after 5 suspicious events
    }
  }
}

// Disaster recovery
export const DISASTER_RECOVERY_CONFIG = {
  // Backup strategy
  backup: {
    database: {
      frequency: 'hourly',
      retention: '30 days',
      encryption: true,
      compression: true
    },
    files: {
      frequency: 'daily',
      retention: '90 days',
      encryption: true
    }
  },

  // Failover configuration
  failover: {
    enabled: true,
    healthCheckInterval: 30000, // 30 seconds
    failoverThreshold: 3,       // 3 consecutive failures
    recoveryThreshold: 2,       // 2 consecutive successes
    regions: ['us-east-1', 'us-west-2', 'eu-west-1']
  },

  // Recovery procedures
  recovery: {
    rto: 300,  // Recovery Time Objective: 5 minutes
    rpo: 3600, // Recovery Point Objective: 1 hour
    procedures: [
      'automated_failover',
      'database_restoration',
      'service_verification',
      'user_notification'
    ]
  }
}

// Export all configurations
export default {
  monitoring: MONITORING_CONFIG,
  healthChecks: HEALTH_CHECKS,
  alerting: ALERTING_CONFIG,
  performance: PERFORMANCE_CONFIG,
  security: SECURITY_CONFIG,
  disasterRecovery: DISASTER_RECOVERY_CONFIG
}