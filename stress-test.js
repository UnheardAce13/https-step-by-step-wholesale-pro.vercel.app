#!/usr/bin/env node

/**
 * Comprehensive Stress Testing Suite
 * Simulates 5,000 wholesalers and 2,000 investors using the platform
 * Tests all UI interactions, API endpoints, AI bots, and system performance
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  WHOLESALERS: 5000,
  INVESTORS: 2000,
  CONCURRENT_BATCHES: 50, // Users per batch to avoid overwhelming
  TEST_DURATION: 300000, // 5 minutes in milliseconds
  MONITORING_INTERVAL: 5000, // 5 seconds
  RESULTS_FILE: 'stress-test-results.json'
};

// Test results tracking
let testResults = {
  startTime: new Date(),
  endTime: null,
  totalUsers: CONFIG.WHOLESALERS + CONFIG.INVESTORS,
  metrics: {
    requests: { total: 0, successful: 0, failed: 0 },
    responseTimes: [],
    errors: [],
    userSessions: { active: 0, completed: 0, failed: 0 },
    systemHealth: [],
    featureUsage: {
      dealAnalyzer: 0,
      predictiveScoring: 0,
      smsOutreach: 0,
      bidding: 0,
      aiBots: { zikk: 0, huntz: 0, automatz: 0, rezz: 0, pipz: 0, agentVetzz: 0 },
      subscriptions: 0,
      promoCodeUsage: 0
    }
  }
};

// User simulation classes
class WholesalerBot {
  constructor(id) {
    this.id = id;
    this.email = `wholesaler${id}@stresstest.com`;
    this.sessionActive = false;
    this.actions = [
      'login',
      'analyzeDeal',
      'sendSMS',
      'useZikkBot',
      'useHuntzBot',
      'useAutomatzBot',
      'useRezzBot',
      'usePipzBot',
      'useAgentVetzzBot',
      'checkAnalytics',
      'manageSubscription',
      'logout'
    ];
  }

  async simulate() {
    try {
      this.sessionActive = true;
      testResults.metrics.userSessions.active++;
      
      console.log(`👤 Wholesaler ${this.id} starting simulation...`);
      
      // Simulate user journey
      await this.performLogin();
      await this.randomDelay(1000, 3000);
      
      // Perform random actions for test duration
      const endTime = Date.now() + (CONFIG.TEST_DURATION / 10); // Shorter individual sessions
      
      while (Date.now() < endTime && this.sessionActive) {
        const action = this.getRandomAction();
        await this.performAction(action);
        await this.randomDelay(2000, 8000); // Realistic user think time
      }
      
      await this.performLogout();
      testResults.metrics.userSessions.completed++;
      
    } catch (error) {
      console.error(`❌ Wholesaler ${this.id} failed:`, error.message);
      testResults.metrics.userSessions.failed++;
      testResults.metrics.errors.push({
        user: `wholesaler-${this.id}`,
        error: error.message,
        timestamp: new Date()
      });
    } finally {
      this.sessionActive = false;
      if (testResults.metrics.userSessions.active > 0) {
        testResults.metrics.userSessions.active--;
      }
    }
  }

  async performLogin() {
    return this.makeRequest('POST', '/api/auth/login', {
      email: this.email,
      password: 'StressTest123!',
      role: 'wholesaler'
    });
  }

  async performLogout() {
    return this.makeRequest('POST', '/api/auth/logout');
  }

  async performAction(action) {
    const startTime = Date.now();
    
    try {
      switch (action) {
        case 'analyzeDeal':
          await this.analyzeDeal();
          break;
        case 'sendSMS':
          await this.sendSMS();
          break;
        case 'useZikkBot':
          await this.useAIBot('zikk');
          break;
        case 'useHuntzBot':
          await this.useAIBot('huntz');
          break;
        case 'useAutomatzBot':
          await this.useAIBot('automatz');
          break;
        case 'useRezzBot':
          await this.useAIBot('rezz');
          break;
        case 'usePipzBot':
          await this.useAIBot('pipz');
          break;
        case 'useAgentVetzzBot':
          await this.useAIBot('agent-vetzz');
          break;
        case 'checkAnalytics':
          await this.checkAnalytics();
          break;
        case 'manageSubscription':
          await this.manageSubscription();
          break;
      }
      
      const responseTime = Date.now() - startTime;
      testResults.metrics.responseTimes.push(responseTime);
      
    } catch (error) {
      console.error(`⚠️  Wholesaler ${this.id} action ${action} failed:`, error.message);
    }
  }

  async analyzeDeal() {
    const dealData = {
      propertyData: {
        address: `${Math.floor(Math.random() * 9999)} Test St, Test City, TX`,
        purchasePrice: Math.floor(Math.random() * 200000) + 50000,
        arv: Math.floor(Math.random() * 300000) + 100000,
        rehabCost: Math.floor(Math.random() * 50000) + 10000,
        sqft: Math.floor(Math.random() * 2000) + 800,
        condition: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)]
      },
      userId: `wholesaler-${this.id}`
    };
    
    await this.makeRequest('POST', '/api/tools/deal-analyzer/analyze', dealData);
    testResults.metrics.featureUsage.dealAnalyzer++;
  }

  async sendSMS() {
    const smsData = {
      to: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      message: `Hi! I have a great investment opportunity. - Wholesaler ${this.id}`,
      type: 'lead_outreach',
      userId: `wholesaler-${this.id}`
    };
    
    await this.makeRequest('POST', '/api/sms/send', smsData);
    testResults.metrics.featureUsage.smsOutreach++;
  }

  async useAIBot(botName) {
    const botEndpoints = {
      'zikk': '/api/wholesaler/zikk/capture',
      'huntz': '/api/wholesaler/huntz/search',
      'automatz': '/api/wholesaler/automatz/workflow',
      'rezz': '/api/wholesaler/rezz/resources',
      'pipz': '/api/wholesaler/pipz/pipeline',
      'agent-vetzz': '/api/wholesaler/agent-vetzz/assist'
    };

    const botData = {
      zikk: {
        leadData: {
          name: `Test Lead ${Math.floor(Math.random() * 1000)}`,
          email: `lead${Math.floor(Math.random() * 1000)}@test.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          propertyAddress: `${Math.floor(Math.random() * 9999)} Lead St`
        },
        wholesalerId: `wholesaler-${this.id}`
      },
      'huntz': {
        searchCriteria: {
          location: 'Dallas, TX',
          maxPrice: Math.floor(Math.random() * 200000) + 50000,
          propertyType: 'single-family'
        },
        wholesalerId: `wholesaler-${this.id}`
      }
    };

    const endpoint = botEndpoints[botName];
    const data = botData[botName] || { userId: `wholesaler-${this.id}` };
    
    await this.makeRequest('POST', endpoint, data);
    testResults.metrics.featureUsage.aiBots[botName]++;
  }

  async checkAnalytics() {
    await this.makeRequest('GET', `/api/analytics/performance/metrics?userId=wholesaler-${this.id}&timeframe=30`);
  }

  async manageSubscription() {
    const plans = ['starter', 'pro', 'empire'];
    const planId = plans[Math.floor(Math.random() * plans.length)];
    
    await this.makeRequest('POST', '/api/stripe/create-subscription', {
      planId,
      userId: `wholesaler-${this.id}`,
      email: this.email
    });
    testResults.metrics.featureUsage.subscriptions++;
  }

  getRandomAction() {
    return this.actions[Math.floor(Math.random() * this.actions.length)];
  }

  async makeRequest(method, endpoint, data = null) {
    const startTime = Date.now();
    
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(`${CONFIG.BASE_URL}${endpoint}`, options);
      const responseTime = Date.now() - startTime;
      
      testResults.metrics.requests.total++;
      
      if (response.ok) {
        testResults.metrics.requests.successful++;
      } else {
        testResults.metrics.requests.failed++;
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      testResults.metrics.responseTimes.push(responseTime);
      return await response.json();
      
    } catch (error) {
      testResults.metrics.requests.total++;
      testResults.metrics.requests.failed++;
      throw error;
    }
  }

  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

class InvestorBot {
  constructor(id) {
    this.id = id;
    this.email = `investor${id}@stresstest.com`;
    this.sessionActive = false;
    this.actions = [
      'login',
      'browsDeals',
      'placeBid',
      'checkPortfolio',
      'viewAnalytics',
      'manageBids',
      'logout'
    ];
  }

  async simulate() {
    try {
      this.sessionActive = true;
      testResults.metrics.userSessions.active++;
      
      console.log(`💰 Investor ${this.id} starting simulation...`);
      
      await this.performLogin();
      await this.randomDelay(1000, 3000);
      
      const endTime = Date.now() + (CONFIG.TEST_DURATION / 10);
      
      while (Date.now() < endTime && this.sessionActive) {
        const action = this.getRandomAction();
        await this.performAction(action);
        await this.randomDelay(3000, 10000); // Investors take more time to make decisions
      }
      
      await this.performLogout();
      testResults.metrics.userSessions.completed++;
      
    } catch (error) {
      console.error(`❌ Investor ${this.id} failed:`, error.message);
      testResults.metrics.userSessions.failed++;
      testResults.metrics.errors.push({
        user: `investor-${this.id}`,
        error: error.message,
        timestamp: new Date()
      });
    } finally {
      this.sessionActive = false;
      if (testResults.metrics.userSessions.active > 0) {
        testResults.metrics.userSessions.active--;
      }
    }
  }

  async performLogin() {
    return this.makeRequest('POST', '/api/auth/login', {
      email: this.email,
      password: 'StressTest123!',
      role: 'investor'
    });
  }

  async performLogout() {
    return this.makeRequest('POST', '/api/auth/logout');
  }

  async performAction(action) {
    try {
      switch (action) {
        case 'browsDeals':
          await this.browseDeals();
          break;
        case 'placeBid':
          await this.placeBid();
          break;
        case 'checkPortfolio':
          await this.checkPortfolio();
          break;
        case 'viewAnalytics':
          await this.viewAnalytics();
          break;
        case 'manageBids':
          await this.manageBids();
          break;
      }
    } catch (error) {
      console.error(`⚠️  Investor ${this.id} action ${action} failed:`, error.message);
    }
  }

  async browseDeals() {
    await this.makeRequest('GET', '/api/deals/browse?limit=20&offset=0');
  }

  async placeBid() {
    const bidData = {
      dealId: `deal-${Math.floor(Math.random() * 1000)}`,
      bidAmount: Math.floor(Math.random() * 150000) + 50000,
      investorId: `investor-${this.id}`
    };
    
    await this.makeRequest('POST', '/api/bidding/place-bid', bidData);
    testResults.metrics.featureUsage.bidding++;
  }

  async checkPortfolio() {
    await this.makeRequest('GET', `/api/investor/portfolio?userId=investor-${this.id}`);
  }

  async viewAnalytics() {
    await this.makeRequest('GET', `/api/analytics/investor/performance?userId=investor-${this.id}`);
  }

  async manageBids() {
    await this.makeRequest('GET', `/api/bidding/my-bids?userId=investor-${this.id}`);
  }

  getRandomAction() {
    return this.actions[Math.floor(Math.random() * this.actions.length)];
  }

  async makeRequest(method, endpoint, data = null) {
    const startTime = Date.now();
    
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(`${CONFIG.BASE_URL}${endpoint}`, options);
      const responseTime = Date.now() - startTime;
      
      testResults.metrics.requests.total++;
      
      if (response.ok) {
        testResults.metrics.requests.successful++;
      } else {
        testResults.metrics.requests.failed++;
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      testResults.metrics.responseTimes.push(responseTime);
      return await response.json();
      
    } catch (error) {
      testResults.metrics.requests.total++;
      testResults.metrics.requests.failed++;
      throw error;
    }
  }

  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

// System monitoring
class SystemMonitor {
  constructor() {
    this.monitoring = false;
  }

  async startMonitoring() {
    this.monitoring = true;
    console.log('📊 Starting system monitoring...');
    
    while (this.monitoring) {
      try {
        const healthData = await this.checkSystemHealth();
        testResults.metrics.systemHealth.push({
          timestamp: new Date(),
          ...healthData
        });
        
        this.logCurrentStats();
        
      } catch (error) {
        console.error('❌ System monitoring error:', error.message);
      }
      
      await this.delay(CONFIG.MONITORING_INTERVAL);
    }
  }

  async checkSystemHealth() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/api/health/advanced`);
      const healthData = await response.json();
      
      return {
        status: healthData.status,
        responseTime: healthData.performance?.responseTime || 0,
        memoryUsage: healthData.performance?.memoryUsage?.heapUsed || 0,
        uptime: healthData.uptime || 0,
        services: healthData.services || {}
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: 0,
        memoryUsage: 0,
        uptime: 0,
        services: {},
        error: error.message
      };
    }
  }

  logCurrentStats() {
    const stats = testResults.metrics;
    const avgResponseTime = stats.responseTimes.length > 0 
      ? Math.round(stats.responseTimes.reduce((a, b) => a + b) / stats.responseTimes.length)
      : 0;
    
    console.log(`
📊 CURRENT STRESS TEST STATS:
👥 Active Users: ${stats.userSessions.active}
✅ Completed Sessions: ${stats.userSessions.completed}
❌ Failed Sessions: ${stats.userSessions.failed}
📡 Total Requests: ${stats.requests.total}
✅ Successful: ${stats.requests.successful}
❌ Failed: ${stats.requests.failed}
⏱️  Avg Response Time: ${avgResponseTime}ms
🎯 Deal Analyzer Uses: ${stats.featureUsage.dealAnalyzer}
📱 SMS Messages: ${stats.featureUsage.smsOutreach}
💰 Bids Placed: ${stats.featureUsage.bidding}
🤖 AI Bot Calls: ${Object.values(stats.featureUsage.aiBots).reduce((a, b) => a + b, 0)}
    `);
  }

  stopMonitoring() {
    this.monitoring = false;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main stress test orchestrator
class StressTestRunner {
  constructor() {
    this.monitor = new SystemMonitor();
    this.userBots = [];
  }

  async run() {
    console.log(`
🚀 STARTING COMPREHENSIVE STRESS TEST
👥 Simulating ${CONFIG.WHOLESALERS} wholesalers + ${CONFIG.INVESTORS} investors
⏱️  Test Duration: ${CONFIG.TEST_DURATION / 1000} seconds
🔄 Concurrent Batches: ${CONFIG.CONCURRENT_BATCHES} users per batch
📊 Monitoring Interval: ${CONFIG.MONITORING_INTERVAL / 1000} seconds
`);

    // Start system monitoring
    const monitoringPromise = this.monitor.startMonitoring();

    // Create user bots
    this.createUserBots();

    // Run stress test in batches
    await this.runInBatches();

    // Stop monitoring
    this.monitor.stopMonitoring();

    // Generate final report
    await this.generateFinalReport();
    
    console.log('🎉 Stress test completed! Check stress-test-results.json for detailed results.');
  }

  createUserBots() {
    // Create wholesaler bots
    for (let i = 1; i <= CONFIG.WHOLESALERS; i++) {
      this.userBots.push(new WholesalerBot(i));
    }

    // Create investor bots
    for (let i = 1; i <= CONFIG.INVESTORS; i++) {
      this.userBots.push(new InvestorBot(i));
    }

    // Shuffle for realistic load distribution
    this.shuffleArray(this.userBots);
  }

  async runInBatches() {
    const batches = [];
    
    // Split users into batches
    for (let i = 0; i < this.userBots.length; i += CONFIG.CONCURRENT_BATCHES) {
      batches.push(this.userBots.slice(i, i + CONFIG.CONCURRENT_BATCHES));
    }

    console.log(`📦 Running ${batches.length} batches of ${CONFIG.CONCURRENT_BATCHES} users each...`);

    // Run batches with staggered start times
    const batchPromises = batches.map((batch, index) => 
      this.runBatch(batch, index * 2000) // 2-second stagger between batches
    );

    await Promise.all(batchPromises);
  }

  async runBatch(batch, delay) {
    if (delay > 0) {
      await this.delay(delay);
    }

    console.log(`🏃‍♂️ Starting batch of ${batch.length} users...`);
    
    const batchPromises = batch.map(bot => bot.simulate());
    await Promise.allSettled(batchPromises);
  }

  async generateFinalReport() {
    testResults.endTime = new Date();
    
    const stats = testResults.metrics;
    const duration = (testResults.endTime - testResults.startTime) / 1000;
    
    // Calculate statistics
    const avgResponseTime = stats.responseTimes.length > 0 
      ? Math.round(stats.responseTimes.reduce((a, b) => a + b) / stats.responseTimes.length)
      : 0;
    
    const maxResponseTime = stats.responseTimes.length > 0 
      ? Math.max(...stats.responseTimes)
      : 0;
    
    const minResponseTime = stats.responseTimes.length > 0 
      ? Math.min(...stats.responseTimes)
      : 0;
    
    const requestsPerSecond = Math.round(stats.requests.total / duration);
    const successRate = stats.requests.total > 0 
      ? ((stats.requests.successful / stats.requests.total) * 100).toFixed(2)
      : 0;

    const finalReport = {
      ...testResults,
      summary: {
        duration: `${duration} seconds`,
        totalUsers: CONFIG.WHOLESALERS + CONFIG.INVESTORS,
        requestsPerSecond,
        successRate: `${successRate}%`,
        avgResponseTime: `${avgResponseTime}ms`,
        maxResponseTime: `${maxResponseTime}ms`,
        minResponseTime: `${minResponseTime}ms`,
        totalFeatureUsage: Object.values(stats.featureUsage.aiBots).reduce((a, b) => a + b, 0) +
                          stats.featureUsage.dealAnalyzer +
                          stats.featureUsage.smsOutreach +
                          stats.featureUsage.bidding +
                          stats.featureUsage.subscriptions
      }
    };

    // Save results to file
    fs.writeFileSync(
      path.join(process.cwd(), CONFIG.RESULTS_FILE),
      JSON.stringify(finalReport, null, 2)
    );

    // Display summary
    console.log(`
🎯 STRESS TEST FINAL REPORT
============================
⏱️  Duration: ${duration} seconds
👥 Total Users: ${CONFIG.WHOLESALERS + CONFIG.INVESTORS}
📡 Total Requests: ${stats.requests.total}
✅ Success Rate: ${successRate}%
⚡ Requests/Second: ${requestsPerSecond}
⏱️  Avg Response Time: ${avgResponseTime}ms
📈 Max Response Time: ${maxResponseTime}ms
📉 Min Response Time: ${minResponseTime}ms

👥 USER SESSIONS:
✅ Completed: ${stats.userSessions.completed}
❌ Failed: ${stats.userSessions.failed}

🎯 FEATURE USAGE:
🧠 Deal Analyzer: ${stats.featureUsage.dealAnalyzer}
📱 SMS Outreach: ${stats.featureUsage.smsOutreach}
💰 Bidding: ${stats.featureUsage.bidding}
💳 Subscriptions: ${stats.featureUsage.subscriptions}
🤖 AI Bots Total: ${Object.values(stats.featureUsage.aiBots).reduce((a, b) => a + b, 0)}
   - Zikk: ${stats.featureUsage.aiBots.zikk}
   - Huntz: ${stats.featureUsage.aiBots.huntz}
   - Automatz: ${stats.featureUsage.aiBots.automatz}
   - Rezz: ${stats.featureUsage.aiBots.rezz}
   - Pipz: ${stats.featureUsage.aiBots.pipz}
   - Agent Vetzz: ${stats.featureUsage.aiBots.agentVetzz}

❌ ERRORS: ${stats.errors.length}
${stats.errors.slice(0, 5).map(err => `   - ${err.user}: ${err.error}`).join('\n')}
${stats.errors.length > 5 ? `   ... and ${stats.errors.length - 5} more` : ''}

📊 Results saved to: ${CONFIG.RESULTS_FILE}
    `);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stress test interrupted. Generating partial results...');
  testResults.endTime = new Date();
  
  fs.writeFileSync(
    path.join(process.cwd(), 'stress-test-partial-results.json'),
    JSON.stringify(testResults, null, 2)
  );
  
  console.log('📊 Partial results saved to stress-test-partial-results.json');
  process.exit(0);
});

// Run the stress test
if (require.main === module) {
  const runner = new StressTestRunner();
  runner.run().catch(console.error);
}

module.exports = { StressTestRunner, WholesalerBot, InvestorBot, SystemMonitor };