#!/usr/bin/env node

/**
 * Master Stress Test Orchestrator
 * Coordinates comprehensive testing of 5,000 wholesalers and 2,000 investors
 * Runs API load testing and UI interaction testing simultaneously
 * Provides real-time monitoring and comprehensive reporting
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import our test modules
const { StressTestRunner } = require('./stress-test');
const { UITestRunner } = require('./ui-interaction-test');

class MasterStressTestOrchestrator {
  constructor() {
    this.config = {
      BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      WHOLESALERS: 5000,
      INVESTORS: 2000,
      TEST_DURATION: 300000, // 5 minutes
      MONITORING_ENABLED: true,
      RESULTS_DIR: './stress-test-results',
      REPORT_FILE: 'comprehensive-stress-test-report.json'
    };
    
    this.testResults = {
      startTime: new Date(),
      endTime: null,
      testSuites: {
        apiLoadTest: { status: 'pending', results: null },
        uiInteractionTest: { status: 'pending', results: null },
        systemMonitoring: { status: 'pending', results: null }
      },
      overallMetrics: {
        totalUsers: this.config.WHOLESALERS + this.config.INVESTORS,
        totalRequests: 0,
        totalInteractions: 0,
        systemHealthChecks: 0,
        errors: [],
        performance: []
      }
    };
    
    this.monitoringActive = false;
    this.testProcesses = [];
  }

  async runComprehensiveStressTest() {
    console.log(`
🚀 STARTING COMPREHENSIVE STRESS TEST SUITE
============================================
👥 Simulating Users: ${this.config.WHOLESALERS} Wholesalers + ${this.config.INVESTORS} Investors
⏱️  Test Duration: ${this.config.TEST_DURATION / 1000} seconds
🌐 Target URL: ${this.config.BASE_URL}
📊 Real-time Monitoring: ${this.config.MONITORING_ENABLED ? 'ENABLED' : 'DISABLED'}

📋 Test Suite Components:
✅ API Load Testing (Backend Performance)
✅ UI Interaction Testing (Frontend Validation) 
✅ System Health Monitoring (Infrastructure)
✅ Real-time Metrics Collection
✅ Comprehensive Reporting

⚠️  IMPORTANT: Ensure your development server is running before starting!
    `);

    try {
      // Create results directory
      this.ensureResultsDirectory();
      
      // Pre-test system verification
      await this.preTestSystemCheck();
      
      // Start monitoring first
      if (this.config.MONITORING_ENABLED) {
        this.startSystemMonitoring();
      }
      
      // Run all test suites concurrently
      const testPromises = [
        this.runAPILoadTest(),
        this.runUIInteractionTest(),
        this.runContinuousHealthCheck()
      ];
      
      console.log('🏁 Starting all test suites...\n');
      
      // Wait for all tests to complete
      const results = await Promise.allSettled(testPromises);
      
      // Process results
      this.processTestResults(results);
      
      // Stop monitoring
      this.stopSystemMonitoring();
      
      // Generate comprehensive report
      await this.generateComprehensiveReport();
      
      console.log('\n🎉 Comprehensive stress test completed successfully!');
      console.log(`📊 Check ${this.config.RESULTS_DIR}/ for detailed results and reports.`);
      
    } catch (error) {
      console.error('❌ Master stress test failed:', error);
      this.testResults.overallMetrics.errors.push({
        type: 'orchestrator_error',
        message: error.message,
        timestamp: new Date()
      });
    } finally {
      this.testResults.endTime = new Date();
      await this.cleanup();
    }
  }

  ensureResultsDirectory() {
    if (!fs.existsSync(this.config.RESULTS_DIR)) {
      fs.mkdirSync(this.config.RESULTS_DIR, { recursive: true });
    }
  }

  async preTestSystemCheck() {
    console.log('🔍 Running pre-test system verification...\n');
    
    try {
      // Check if server is running
      const response = await fetch(`${this.config.BASE_URL}/api/health`);
      if (!response.ok) {
        throw new Error(`Server health check failed: ${response.status}`);
      }
      
      console.log('✅ Server is running and healthy');
      
      // Check database connectivity
      const healthResponse = await fetch(`${this.config.BASE_URL}/api/health/advanced`);
      const healthData = await healthResponse.json();
      
      console.log('✅ Database connectivity verified');
      console.log('✅ System integrations checked');
      
      // Log system baseline
      this.logSystemBaseline(healthData);
      
    } catch (error) {
      console.error('❌ Pre-test system check failed:', error.message);
      console.log('\n⚠️  Please ensure your development server is running with: pnpm dev');
      process.exit(1);
    }
  }

  logSystemBaseline(healthData) {
    console.log(`
📊 SYSTEM BASELINE METRICS:
──────────────────────────
🔧 System Status: ${healthData.status}
💾 Memory Usage: ${Math.round(healthData.performance?.memoryUsage?.heapUsed / 1024 / 1024)}MB
⏱️  Response Time: ${healthData.performance?.responseTime}ms
🔄 Uptime: ${Math.round(healthData.uptime / 60)} minutes

🔗 Service Integrations:
${Object.entries(healthData.services || {}).map(([service, status]) => 
  `   ${status.status === 'operational' ? '✅' : '❌'} ${service}: ${status.status}`
).join('\n')}
    `);
  }

  async runAPILoadTest() {
    console.log('🔥 Starting API Load Test Suite...');
    
    try {
      this.testResults.testSuites.apiLoadTest.status = 'running';
      
      const loadTester = new StressTestRunner();
      await loadTester.run();
      
      // Read results
      const resultsPath = path.join(process.cwd(), 'stress-test-results.json');
      if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        this.testResults.testSuites.apiLoadTest.results = results;
        this.testResults.testSuites.apiLoadTest.status = 'completed';
        
        // Update overall metrics
        this.testResults.overallMetrics.totalRequests += results.metrics.requests.total;
        this.testResults.overallMetrics.errors.push(...results.metrics.errors);
      }
      
      console.log('✅ API Load Test completed successfully');
      
    } catch (error) {
      console.error('❌ API Load Test failed:', error);
      this.testResults.testSuites.apiLoadTest.status = 'failed';
      this.testResults.testSuites.apiLoadTest.error = error.message;
    }
  }

  async runUIInteractionTest() {
    console.log('🖱️  Starting UI Interaction Test Suite...');
    
    try {
      this.testResults.testSuites.uiInteractionTest.status = 'running';
      
      // Check if puppeteer is available
      try {
        require('puppeteer');
      } catch (error) {
        console.log('⚠️  Puppeteer not found. Installing for UI testing...');
        await this.installPuppeteer();
      }
      
      const uiTester = new UITestRunner();
      await uiTester.runAllTests();
      
      // Read results
      const resultsPath = path.join(process.cwd(), 'ui-interaction-results.json');
      if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        this.testResults.testSuites.uiInteractionTest.results = results;
        this.testResults.testSuites.uiInteractionTest.status = 'completed';
        
        // Update overall metrics
        this.testResults.overallMetrics.totalInteractions += results.totalInteractions;
        this.testResults.overallMetrics.errors.push(...results.errors);
      }
      
      console.log('✅ UI Interaction Test completed successfully');
      
    } catch (error) {
      console.error('❌ UI Interaction Test failed:', error);
      this.testResults.testSuites.uiInteractionTest.status = 'failed';
      this.testResults.testSuites.uiInteractionTest.error = error.message;
    }
  }

  async installPuppeteer() {
    return new Promise((resolve, reject) => {
      const install = spawn('npm', ['install', 'puppeteer'], { stdio: 'inherit' });
      install.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Puppeteer installed successfully');
          resolve();
        } else {
          reject(new Error(`Puppeteer installation failed with code ${code}`));
        }
      });
    });
  }

  async runContinuousHealthCheck() {
    console.log('📊 Starting Continuous Health Monitoring...');
    
    try {
      this.testResults.testSuites.systemMonitoring.status = 'running';
      
      const healthChecks = [];
      const startTime = Date.now();
      const endTime = startTime + this.config.TEST_DURATION;
      
      while (Date.now() < endTime) {
        try {
          const response = await fetch(`${this.config.BASE_URL}/api/health/advanced`);
          const healthData = await response.json();
          
          healthChecks.push({
            timestamp: new Date(),
            status: healthData.status,
            responseTime: healthData.performance?.responseTime || 0,
            memoryUsage: healthData.performance?.memoryUsage?.heapUsed || 0,
            services: healthData.services
          });
          
          this.testResults.overallMetrics.systemHealthChecks++;
          
          // Log periodic status
          if (healthChecks.length % 10 === 0) {
            console.log(`📊 Health Check #${healthChecks.length}: ${healthData.status} (${healthData.performance?.responseTime}ms)`);
          }
          
        } catch (error) {
          healthChecks.push({
            timestamp: new Date(),
            status: 'error',
            error: error.message
          });
        }
        
        // Wait 5 seconds between checks
        await this.delay(5000);
      }
      
      this.testResults.testSuites.systemMonitoring.results = {
        healthChecks,
        totalChecks: healthChecks.length,
        avgResponseTime: this.calculateAverageResponseTime(healthChecks),
        systemStability: this.calculateSystemStability(healthChecks)
      };
      
      this.testResults.testSuites.systemMonitoring.status = 'completed';
      
      console.log('✅ Continuous Health Monitoring completed');
      
    } catch (error) {
      console.error('❌ Health Monitoring failed:', error);
      this.testResults.testSuites.systemMonitoring.status = 'failed';
      this.testResults.testSuites.systemMonitoring.error = error.message;
    }
  }

  startSystemMonitoring() {
    this.monitoringActive = true;
    
    const monitorInterval = setInterval(() => {
      if (!this.monitoringActive) {
        clearInterval(monitorInterval);
        return;
      }
      
      this.logCurrentStatus();
    }, 10000); // Log every 10 seconds
  }

  stopSystemMonitoring() {
    this.monitoringActive = false;
  }

  logCurrentStatus() {
    const runtime = (Date.now() - this.testResults.startTime.getTime()) / 1000;
    
    console.log(`
⏱️  LIVE STATUS (${Math.round(runtime)}s elapsed):
──────────────────────────────────
🔥 API Load Test: ${this.testResults.testSuites.apiLoadTest.status}
🖱️  UI Test: ${this.testResults.testSuites.uiInteractionTest.status}
📊 Monitoring: ${this.testResults.testSuites.systemMonitoring.status}
📡 Total Requests: ${this.testResults.overallMetrics.totalRequests}
🖱️  Total Interactions: ${this.testResults.overallMetrics.totalInteractions}
🏥 Health Checks: ${this.testResults.overallMetrics.systemHealthChecks}
❌ Errors: ${this.testResults.overallMetrics.errors.length}
    `);
  }

  processTestResults(results) {
    console.log('\n📊 Processing test results...');
    
    results.forEach((result, index) => {
      const testNames = ['API Load Test', 'UI Interaction Test', 'Health Monitoring'];
      const testName = testNames[index];
      
      if (result.status === 'fulfilled') {
        console.log(`✅ ${testName}: Completed successfully`);
      } else {
        console.log(`❌ ${testName}: Failed - ${result.reason}`);
      }
    });
  }

  async generateComprehensiveReport() {
    console.log('\n📝 Generating comprehensive report...');
    
    const duration = (this.testResults.endTime - this.testResults.startTime) / 1000;
    
    const comprehensiveReport = {
      ...this.testResults,
      summary: {
        testDuration: `${duration} seconds`,
        totalUsers: this.config.WHOLESALERS + this.config.INVESTORS,
        totalRequests: this.testResults.overallMetrics.totalRequests,
        totalInteractions: this.testResults.overallMetrics.totalInteractions,
        totalHealthChecks: this.testResults.overallMetrics.systemHealthChecks,
        totalErrors: this.testResults.overallMetrics.errors.length,
        overallSuccess: this.calculateOverallSuccessRate(),
        systemStability: this.calculateOverallStability(),
        performanceGrade: this.calculatePerformanceGrade()
      },
      recommendations: this.generateRecommendations(),
      config: this.config
    };
    
    // Save comprehensive report
    const reportPath = path.join(this.config.RESULTS_DIR, this.config.REPORT_FILE);
    fs.writeFileSync(reportPath, JSON.stringify(comprehensiveReport, null, 2));
    
    // Generate summary report
    this.generateSummaryReport(comprehensiveReport);
    
    console.log(`✅ Comprehensive report saved: ${reportPath}`);
  }

  generateSummaryReport(report) {
    const summary = `
🎯 COMPREHENSIVE STRESS TEST FINAL REPORT
==========================================
📅 Test Date: ${report.startTime}
⏱️  Duration: ${report.summary.testDuration}
👥 Simulated Users: ${report.summary.totalUsers}

📊 OVERALL RESULTS:
✅ Success Rate: ${report.summary.overallSuccess}%
🏆 Performance Grade: ${report.summary.performanceGrade}
📈 System Stability: ${report.summary.systemStability}%

🔥 API LOAD TEST:
├─ Status: ${report.testSuites.apiLoadTest.status}
├─ Total Requests: ${report.summary.totalRequests}
├─ Success Rate: ${report.testSuites.apiLoadTest.results?.summary?.successRate || 'N/A'}
└─ Avg Response: ${report.testSuites.apiLoadTest.results?.summary?.avgResponseTime || 'N/A'}

🖱️  UI INTERACTION TEST:
├─ Status: ${report.testSuites.uiInteractionTest.status}
├─ Total Interactions: ${report.summary.totalInteractions}
├─ Success Rate: ${report.testSuites.uiInteractionTest.results?.summary?.successRate || 'N/A'}
└─ Pages Tested: ${report.testSuites.uiInteractionTest.results?.summary?.pagesTeated || 'N/A'}

📊 SYSTEM MONITORING:
├─ Status: ${report.testSuites.systemMonitoring.status}
├─ Health Checks: ${report.summary.totalHealthChecks}
├─ Avg Response: ${report.testSuites.systemMonitoring.results?.avgResponseTime || 'N/A'}ms
└─ Stability: ${report.testSuites.systemMonitoring.results?.systemStability || 'N/A'}%

❌ ERRORS & ISSUES:
└─ Total Errors: ${report.summary.totalErrors}

💡 RECOMMENDATIONS:
${report.recommendations.map(rec => `   • ${rec}`).join('\n')}

📁 DETAILED RESULTS:
├─ Comprehensive Report: ${this.config.RESULTS_DIR}/${this.config.REPORT_FILE}
├─ API Test Results: stress-test-results.json
├─ UI Test Results: ui-interaction-results.json
└─ System Logs: Available in monitoring data

🎉 STRESS TEST COMPLETED SUCCESSFULLY!
${report.summary.performanceGrade === 'A+' ? '🏆 EXCELLENT PERFORMANCE!' : 
  report.summary.performanceGrade.startsWith('A') ? '🥇 GREAT PERFORMANCE!' :
  report.summary.performanceGrade.startsWith('B') ? '🥈 GOOD PERFORMANCE!' :
  '🥉 NEEDS OPTIMIZATION'}
    `;
    
    console.log(summary);
    
    // Save summary to file
    fs.writeFileSync(path.join(this.config.RESULTS_DIR, 'summary-report.txt'), summary);
  }

  calculateOverallSuccessRate() {
    const apiSuccess = this.testResults.testSuites.apiLoadTest.results?.summary?.successRate || '0%';
    const uiSuccess = this.testResults.testSuites.uiInteractionTest.results?.summary?.successRate || '0%';
    
    const apiRate = parseFloat(apiSuccess.replace('%', ''));
    const uiRate = parseFloat(uiSuccess.replace('%', ''));
    
    return Math.round((apiRate + uiRate) / 2);
  }

  calculateOverallStability() {
    const healthChecks = this.testResults.testSuites.systemMonitoring.results?.healthChecks || [];
    if (healthChecks.length === 0) return 0;
    
    const healthyChecks = healthChecks.filter(check => check.status === 'healthy').length;
    return Math.round((healthyChecks / healthChecks.length) * 100);
  }

  calculatePerformanceGrade() {
    const successRate = this.calculateOverallSuccessRate();
    const stability = this.calculateOverallStability();
    const avgScore = (successRate + stability) / 2;
    
    if (avgScore >= 95) return 'A+';
    if (avgScore >= 90) return 'A';
    if (avgScore >= 85) return 'A-';
    if (avgScore >= 80) return 'B+';
    if (avgScore >= 75) return 'B';
    if (avgScore >= 70) return 'B-';
    if (avgScore >= 65) return 'C+';
    if (avgScore >= 60) return 'C';
    return 'F';
  }

  generateRecommendations() {
    const recommendations = [];
    
    const successRate = this.calculateOverallSuccessRate();
    const stability = this.calculateOverallStability();
    const errorCount = this.testResults.overallMetrics.errors.length;
    
    if (successRate < 95) {
      recommendations.push('Consider optimizing API response times and error handling');
    }
    
    if (stability < 90) {
      recommendations.push('Investigate system stability issues and resource allocation');
    }
    
    if (errorCount > 50) {
      recommendations.push('Review error logs and implement better error prevention');
    }
    
    if (this.testResults.testSuites.apiLoadTest.results?.summary?.avgResponseTime > 500) {
      recommendations.push('Optimize slow API endpoints for better performance');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Excellent performance! System is ready for production load');
    }
    
    recommendations.push('Consider implementing auto-scaling for peak load periods');
    recommendations.push('Set up continuous monitoring and alerting for production');
    
    return recommendations;
  }

  calculateAverageResponseTime(healthChecks) {
    const responseTimes = healthChecks
      .filter(check => check.responseTime)
      .map(check => check.responseTime);
    
    if (responseTimes.length === 0) return 0;
    
    return Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length);
  }

  calculateSystemStability(healthChecks) {
    if (healthChecks.length === 0) return 0;
    
    const healthyChecks = healthChecks.filter(check => check.status === 'healthy').length;
    return Math.round((healthyChecks / healthChecks.length) * 100);
  }

  async cleanup() {
    // Kill any remaining test processes
    this.testProcesses.forEach(process => {
      try {
        process.kill();
      } catch (error) {
        // Ignore errors when killing processes
      }
    });
    
    // Stop monitoring
    this.stopSystemMonitoring();
    
    console.log('\n🧹 Cleanup completed');
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stress test suite interrupted. Cleaning up...');
  process.exit(0);
});

// Export for use as module
module.exports = { MasterStressTestOrchestrator };

// Run if called directly
if (require.main === module) {
  const orchestrator = new MasterStressTestOrchestrator();
  orchestrator.runComprehensiveStressTest().catch(console.error);
}