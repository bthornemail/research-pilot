/**
 * Regulatory Demonstration Script
 *
 * This script provides a comprehensive demonstration of the CBDC Research Pilot's
 * regulatory compliance capabilities for regulatory authorities and stakeholders.
 */
import { CBDCResearchPilot } from './research-pilot';
import { PrivacyAnalyticsEngine } from './privacy-analytics-engine';
import { RegulatoryDashboard } from './regulatory-dashboard';
import { DataValidationEngine } from './data-validation-engine';
import { RegulatoryReportGenerator } from './regulatory-report-generator';
export class RegulatoryDemo {
    config;
    pilot;
    auditTrailEngine;
    privacyAnalyticsEngine;
    regulatoryDashboard;
    dataValidationEngine;
    reportGenerator;
    demoResults;
    constructor(config) {
        this.config = config;
        this.demoResults = {
            startTime: new Date(),
            endTime: new Date(),
            scenarios: [],
            metrics: {},
            reports: [],
            exports: []
        };
        this.initializeSystem();
    }
    /**
     * Run the complete regulatory demonstration
     */
    async runDemo() {
        console.log('🚀 Starting CBDC Research Pilot Regulatory Demonstration');
        console.log(`📊 Configuration: ${this.config.userCount} users, ${this.config.transactionCount} transactions`);
        try {
            // Initialize the system
            await this.initializeDemo();
            // Run demonstration scenarios
            for (const scenario of this.config.demoScenarios) {
                await this.runScenario(scenario);
            }
            // Generate final reports
            if (this.config.generateReports) {
                await this.generateDemoReports();
            }
            // Export demonstration data
            if (this.config.exportData) {
                await this.exportDemoData();
            }
            // Finalize demonstration
            await this.finalizeDemo();
            console.log('✅ Regulatory demonstration completed successfully');
            return this.demoResults;
        }
        catch (error) {
            console.error('❌ Demonstration failed:', error);
            throw error;
        }
    }
    /**
     * Run a specific demonstration scenario
     */
    async runScenario(scenario) {
        console.log(`\n🎯 Running scenario: ${scenario.name}`);
        console.log(`📝 Description: ${scenario.description}`);
        const startTime = Date.now();
        const result = {
            scenarioName: scenario.name,
            startTime: new Date(),
            endTime: new Date(),
            success: false,
            metrics: {},
            outcomes: [],
            errors: []
        };
        try {
            switch (scenario.name) {
                case 'System Initialization':
                    await this.demonstrateSystemInitialization();
                    break;
                case 'User Registration and KYC':
                    await this.demonstrateUserRegistration(scenario.parameters);
                    break;
                case 'Transaction Processing':
                    await this.demonstrateTransactionProcessing(scenario.parameters);
                    break;
                case 'Compliance Monitoring':
                    await this.demonstrateComplianceMonitoring(scenario.parameters);
                    break;
                case 'Risk Assessment':
                    await this.demonstrateRiskAssessment(scenario.parameters);
                    break;
                case 'Audit Trail Generation':
                    await this.demonstrateAuditTrail(scenario.parameters);
                    break;
                case 'Privacy-Preserving Analytics':
                    await this.demonstratePrivacyAnalytics(scenario.parameters);
                    break;
                case 'Regulatory Reporting':
                    await this.demonstrateRegulatoryReporting(scenario.parameters);
                    break;
                case 'Data Validation':
                    await this.demonstrateDataValidation(scenario.parameters);
                    break;
                case 'System Performance':
                    await this.demonstrateSystemPerformance(scenario.parameters);
                    break;
                case 'Economic Impact Analysis':
                    await this.demonstrateEconomicImpact(scenario.parameters);
                    break;
                case 'Stress Testing':
                    await this.demonstrateStressTesting(scenario.parameters);
                    break;
                default:
                    throw new Error(`Unknown scenario: ${scenario.name}`);
            }
            result.success = true;
            result.outcomes = scenario.expectedOutcomes;
        }
        catch (error) {
            result.errors.push(error instanceof Error ? error.message : 'Unknown error');
            console.error(`❌ Scenario ${scenario.name} failed:`, error);
        }
        result.endTime = new Date();
        result.metrics = {
            duration: Date.now() - startTime,
            success: result.success,
            errorCount: result.errors.length
        };
        this.demoResults.scenarios.push(result);
        console.log(`✅ Scenario ${scenario.name} completed in ${result.metrics.duration}ms`);
        return result;
    }
    /**
     * Demonstrate system initialization
     */
    async demonstrateSystemInitialization() {
        console.log('🔧 Initializing CBDC Research Pilot system...');
        // Initialize the pilot
        await this.pilot.initializePilot();
        // Verify all components are initialized
        const analytics = await this.pilot.getAnalytics();
        const auditTrail = this.pilot.getAuditTrailEngine();
        console.log('✅ System initialization completed');
        console.log(`📊 Initial analytics: ${JSON.stringify(analytics, null, 2)}`);
    }
    /**
     * Demonstrate user registration and KYC process
     */
    async demonstrateUserRegistration(parameters) {
        console.log('👥 Demonstrating user registration and KYC process...');
        const userCount = parameters.userCount || 100;
        const users = await this.pilot.generateUsers(userCount);
        console.log(`✅ Generated ${users.length} users`);
        // Demonstrate KYC compliance
        const kycCompliance = users.filter(user => user.wallet.kycStatus === 'verified').length;
        console.log(`📋 KYC Compliance: ${kycCompliance}/${users.length} users verified`);
        // Log user creation in audit trail
        for (const user of users.slice(0, 5)) { // Log first 5 users as example
            await this.auditTrailEngine.logUserEvent(user, 'USER_CREATED', 'User created during demo', { demoScenario: 'User Registration' });
        }
    }
    /**
     * Demonstrate transaction processing
     */
    async demonstrateTransactionProcessing(parameters) {
        console.log('💸 Demonstrating transaction processing...');
        const transactionCount = parameters.transactionCount || 1000;
        await this.pilot.generateSimulatedTransactions(transactionCount);
        const transactions = Array.from(this.pilot.transactionsMap.values());
        console.log(`✅ Generated ${transactions.length} transactions`);
        // Demonstrate transaction compliance checking
        const complianceResults = await Promise.all(transactions.slice(0, 10).map(async (tx) => {
            const result = await this.pilot.processTransaction(tx);
            return result;
        }));
        const successfulTransactions = complianceResults.filter(r => r.success).length;
        console.log(`📊 Transaction Success Rate: ${successfulTransactions}/${complianceResults.length}`);
        // Demonstrate compliance flagging
        const flaggedTransactions = complianceResults.filter(r => r.complianceFlags && r.complianceFlags.length > 0).length;
        console.log(`🚨 Flagged Transactions: ${flaggedTransactions}/${complianceResults.length}`);
    }
    /**
     * Demonstrate compliance monitoring
     */
    async demonstrateComplianceMonitoring(parameters) {
        console.log('🛡️ Demonstrating compliance monitoring...');
        const dashboardMetrics = await this.regulatoryDashboard.getDashboardMetrics();
        console.log('📊 Compliance Status:');
        console.log(`   Overall Compliance: ${(dashboardMetrics.complianceStatus.complianceRate * 100).toFixed(1)}%`);
        console.log(`   Risk Score: ${dashboardMetrics.complianceStatus.riskScore.toFixed(3)}`);
        console.log(`   Active Flags: ${dashboardMetrics.complianceStatus.activeFlags}`);
        console.log(`   KYC Compliance: ${(dashboardMetrics.complianceStatus.kycCompliance * 100).toFixed(1)}%`);
        console.log(`   AML Compliance: ${(dashboardMetrics.complianceStatus.amlCompliance * 100).toFixed(1)}%`);
        // Demonstrate alert system
        const alerts = dashboardMetrics.alerts;
        console.log(`🚨 Active Alerts: ${alerts.length}`);
        if (alerts.length > 0) {
            console.log('   Recent Alerts:');
            alerts.slice(0, 3).forEach(alert => {
                console.log(`   - ${alert.title}: ${alert.message}`);
            });
        }
    }
    /**
     * Demonstrate risk assessment
     */
    async demonstrateRiskAssessment(parameters) {
        console.log('⚖️ Demonstrating risk assessment...');
        const dashboardMetrics = await this.regulatoryDashboard.getDashboardMetrics();
        console.log('📊 Risk Assessment Results:');
        console.log(`   Overall Risk Score: ${dashboardMetrics.complianceStatus.riskScore.toFixed(3)}`);
        console.log(`   System Health: ${dashboardMetrics.systemHealth.status}`);
        console.log(`   Performance Risk: ${dashboardMetrics.performanceMetrics.errorRate.toFixed(3)}`);
        console.log(`   User Risk: ${dashboardMetrics.userMetrics.userSatisfaction.toFixed(3)}`);
        // Demonstrate risk-based compliance
        const riskLevel = dashboardMetrics.complianceStatus.riskScore > 0.7 ? 'High' :
            dashboardMetrics.complianceStatus.riskScore > 0.4 ? 'Medium' : 'Low';
        console.log(`🎯 Risk Level: ${riskLevel}`);
    }
    /**
     * Demonstrate audit trail generation
     */
    async demonstrateAuditTrail(parameters) {
        console.log('📋 Demonstrating audit trail generation...');
        const auditStats = this.auditTrailEngine.getAuditStatistics();
        console.log('📊 Audit Trail Statistics:');
        console.log(`   Total Entries: ${auditStats.totalEntries}`);
        console.log(`   Verification Rate: ${(auditStats.verificationRate * 100).toFixed(1)}%`);
        console.log(`   Integrity Score: ${auditStats.integrityScore.toFixed(3)}`);
        console.log(`   Compliance Score: ${auditStats.complianceScore.toFixed(3)}`);
        // Demonstrate audit trail verification
        const verificationResults = await this.auditTrailEngine.verifyAuditTrail();
        console.log('🔍 Audit Trail Verification:');
        console.log(`   Verified Entries: ${verificationResults.totalVerified}`);
        console.log(`   Failed Verifications: ${verificationResults.totalFailed}`);
        console.log(`   Integrity Issues: ${verificationResults.integrityIssues.length}`);
        console.log(`   Suspicious Activities: ${verificationResults.suspiciousEntries.length}`);
    }
    /**
     * Demonstrate privacy-preserving analytics
     */
    async demonstratePrivacyAnalytics(parameters) {
        console.log('🔒 Demonstrating privacy-preserving analytics...');
        const users = Array.from(this.pilot.usersMap.values());
        const transactions = Array.from(this.pilot.transactionsMap.values());
        const privacyReport = await this.privacyAnalyticsEngine.generateComprehensiveReport(users, transactions, {}, // Compliance metrics
        {}, // Performance metrics
        'privacy_demo');
        console.log('📊 Privacy Analytics Results:');
        console.log(`   Privacy Budget Used: ${privacyReport.summary.privacyBudgetUsed.toFixed(3)}`);
        console.log(`   Data Utility Score: ${privacyReport.summary.dataUtilityScore.toFixed(3)}`);
        console.log(`   Anonymized Records: ${privacyReport.summary.anonymizedRecords}`);
        console.log(`   Suppressed Records: ${privacyReport.summary.suppressedRecords}`);
        // Demonstrate differential privacy
        const privacyMetrics = privacyReport.privacyMetrics;
        console.log('🔐 Privacy Protection:');
        console.log(`   Differential Privacy: ${privacyMetrics.differentialPrivacyApplied ? 'Applied' : 'Not Applied'}`);
        console.log(`   K-Anonymity: ${privacyMetrics.kAnonymityAchieved ? 'Achieved' : 'Not Achieved'}`);
        console.log(`   L-Diversity: ${privacyMetrics.lDiversityAchieved ? 'Achieved' : 'Not Achieved'}`);
    }
    /**
     * Demonstrate regulatory reporting
     */
    async demonstrateRegulatoryReporting(parameters) {
        console.log('📄 Demonstrating regulatory reporting...');
        const period = {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            end: new Date()
        };
        // Generate various regulatory reports
        const reports = await Promise.all([
            this.reportGenerator.generateComplianceStatusReport(period, 'demo-user'),
            this.reportGenerator.generateTransactionMonitoringReport(period, 'demo-user'),
            this.reportGenerator.generateRiskAssessmentReport(period, 'demo-user'),
            this.reportGenerator.generateAuditTrailReport(period, 'demo-user')
        ]);
        console.log('📊 Generated Reports:');
        reports.forEach(report => {
            console.log(`   ${report.reportType}: ${report.fileSize} bytes (${report.format})`);
        });
        this.demoResults.reports.push(...reports);
    }
    /**
     * Demonstrate data validation
     */
    async demonstrateDataValidation(parameters) {
        console.log('✅ Demonstrating data validation...');
        const users = Array.from(this.pilot.usersMap.values());
        const transactions = Array.from(this.pilot.transactionsMap.values());
        const integrityReport = await this.dataValidationEngine.validateSystemIntegrity(users, transactions);
        console.log('📊 Data Validation Results:');
        console.log(`   Overall Integrity: ${(integrityReport.overallIntegrity * 100).toFixed(1)}%`);
        console.log(`   Total Validations: ${integrityReport.summary.totalValidations}`);
        console.log(`   Passed Validations: ${integrityReport.summary.passedValidations}`);
        console.log(`   Failed Validations: ${integrityReport.summary.failedValidations}`);
        console.log(`   Data Consistency Score: ${(integrityReport.summary.dataConsistencyScore * 100).toFixed(1)}%`);
        // Demonstrate validation statistics
        const validationStats = this.dataValidationEngine.getValidationStatistics();
        console.log('📈 Validation Statistics:');
        console.log(`   Average Integrity Score: ${(validationStats.averageIntegrityScore * 100).toFixed(1)}%`);
        console.log(`   Average Validation Time: ${validationStats.averageValidationTime.toFixed(1)}ms`);
        console.log(`   Integrity Trend: ${validationStats.integrityTrend}`);
    }
    /**
     * Demonstrate system performance
     */
    async demonstrateSystemPerformance(parameters) {
        console.log('⚡ Demonstrating system performance...');
        const dashboardMetrics = await this.regulatoryDashboard.getDashboardMetrics();
        console.log('📊 Performance Metrics:');
        console.log(`   TPS (Transactions Per Second): ${dashboardMetrics.performanceMetrics.tps}`);
        console.log(`   Average Latency: ${dashboardMetrics.performanceMetrics.averageLatency.toFixed(1)}ms`);
        console.log(`   Throughput: ${dashboardMetrics.performanceMetrics.throughput}`);
        console.log(`   Success Rate: ${(dashboardMetrics.performanceMetrics.successRate * 100).toFixed(1)}%`);
        console.log(`   Error Rate: ${(dashboardMetrics.performanceMetrics.errorRate * 100).toFixed(2)}%`);
        // Demonstrate system health
        const systemHealth = dashboardMetrics.systemHealth;
        console.log('🏥 System Health:');
        console.log(`   Status: ${systemHealth.status}`);
        console.log(`   Uptime: ${(systemHealth.uptime * 100).toFixed(1)}%`);
        console.log(`   System Load: ${(systemHealth.systemLoad * 100).toFixed(1)}%`);
        console.log(`   Memory Usage: ${(systemHealth.memoryUsage * 100).toFixed(1)}%`);
        console.log(`   CPU Usage: ${(systemHealth.cpuUsage * 100).toFixed(1)}%`);
    }
    /**
     * Demonstrate economic impact analysis
     */
    async demonstrateEconomicImpact(parameters) {
        console.log('📈 Demonstrating economic impact analysis...');
        const analytics = await this.pilot.getAnalytics();
        console.log('📊 Economic Impact Metrics:');
        console.log(`   Total Volume: $${analytics.economicImpact.totalVolume.toLocaleString()}`);
        console.log(`   Economic Velocity: ${analytics.economicImpact.economicVelocity.toFixed(2)}`);
        console.log(`   Network Effect: ${(analytics.economicImpact.networkEffect * 100).toFixed(1)}%`);
        console.log(`   Economic Penetration: ${(analytics.economicImpact.economicPenetration * 100).toFixed(2)}%`);
        console.log(`   User Engagement: ${analytics.economicImpact.userEngagement.toFixed(2)}`);
        console.log(`   System Efficiency: ${(analytics.economicImpact.systemEfficiency * 100).toFixed(1)}%`);
        // Demonstrate user statistics
        console.log('👥 User Statistics:');
        console.log(`   Total Users: ${analytics.userStatistics.totalUsers}`);
        console.log(`   Active Users: ${analytics.userStatistics.activeUsers}`);
        console.log(`   Average Balance: $${analytics.userStatistics.averageBalance.toLocaleString()}`);
        console.log(`   Total Volume: $${analytics.userStatistics.totalVolume.toLocaleString()}`);
    }
    /**
     * Demonstrate stress testing
     */
    async demonstrateStressTesting(parameters) {
        console.log('💪 Demonstrating stress testing...');
        // Run stress test scenario
        const stressTestConfig = {
            duration: 1, // 1 day
            userCount: this.config.userCount * 2, // Double the users
            transactionCount: this.config.transactionCount * 3, // Triple the transactions
            scenario: 'stress'
        };
        console.log('🔥 Running stress test with increased load...');
        // Generate additional users and transactions for stress test
        const additionalUsers = await this.pilot.generateUsers(stressTestConfig.userCount);
        await this.pilot.generateSimulatedTransactions(stressTestConfig.transactionCount);
        // Monitor system performance under stress
        const stressMetrics = await this.regulatoryDashboard.getDashboardMetrics();
        console.log('📊 Stress Test Results:');
        console.log(`   System Status: ${stressMetrics.systemHealth.status}`);
        console.log(`   Performance Under Load: ${(stressMetrics.performanceMetrics.successRate * 100).toFixed(1)}%`);
        console.log(`   Error Rate Under Stress: ${(stressMetrics.performanceMetrics.errorRate * 100).toFixed(2)}%`);
        console.log(`   System Load: ${(stressMetrics.systemHealth.systemLoad * 100).toFixed(1)}%`);
        // Demonstrate system resilience
        const resilienceScore = stressMetrics.performanceMetrics.successRate > 0.9 ? 'High' :
            stressMetrics.performanceMetrics.successRate > 0.8 ? 'Medium' : 'Low';
        console.log(`🛡️ System Resilience: ${resilienceScore}`);
    }
    /**
     * Initialize the demonstration system
     */
    async initializeDemo() {
        console.log('🔧 Initializing demonstration system...');
        // Initialize all components
        await this.pilot.initializePilot();
        // Generate initial data
        await this.pilot.generateUsers(this.config.userCount);
        await this.pilot.generateSimulatedTransactions(this.config.transactionCount);
        console.log('✅ Demonstration system initialized');
    }
    /**
     * Generate demonstration reports
     */
    async generateDemoReports() {
        console.log('📄 Generating demonstration reports...');
        const period = {
            start: this.demoResults.startTime,
            end: new Date()
        };
        // Generate comprehensive regulatory submission report
        const regulatoryReport = await this.reportGenerator.generateRegulatorySubmissionReport(period, 'regulatory-demo');
        this.demoResults.reports.push(regulatoryReport);
        console.log(`✅ Generated ${this.demoResults.reports.length} demonstration reports`);
    }
    /**
     * Export demonstration data
     */
    async exportDemoData() {
        console.log('📤 Exporting demonstration data...');
        // Export audit trail
        const auditExport = await this.auditTrailEngine.exportAuditTrail('json');
        // Export privacy-preserving data
        const users = Array.from(this.pilot.usersMap.values());
        const transactions = Array.from(this.pilot.transactionsMap.values());
        const privacyExport = await this.privacyAnalyticsEngine.exportPrivacyPreservingData({ users, transactions }, 'json');
        // Export dashboard data
        const dashboardExport = await this.regulatoryDashboard.exportDashboardData('json');
        this.demoResults.exports.push(auditExport, privacyExport, dashboardExport);
        console.log(`✅ Exported ${this.demoResults.exports.length} data files`);
    }
    /**
     * Finalize the demonstration
     */
    async finalizeDemo() {
        this.demoResults.endTime = new Date();
        this.demoResults.metrics = {
            totalDuration: this.demoResults.endTime.getTime() - this.demoResults.startTime.getTime(),
            scenariosCompleted: this.demoResults.scenarios.length,
            successfulScenarios: this.demoResults.scenarios.filter(s => s.success).length,
            reportsGenerated: this.demoResults.reports.length,
            dataExports: this.demoResults.exports.length
        };
        console.log('\n📊 Demonstration Summary:');
        console.log(`   Total Duration: ${(this.demoResults.metrics.totalDuration / 1000).toFixed(1)}s`);
        console.log(`   Scenarios Completed: ${this.demoResults.metrics.scenariosCompleted}`);
        console.log(`   Successful Scenarios: ${this.demoResults.metrics.successfulScenarios}`);
        console.log(`   Reports Generated: ${this.demoResults.metrics.reportsGenerated}`);
        console.log(`   Data Exports: ${this.demoResults.metrics.dataExports}`);
    }
    /**
     * Initialize the system components
     */
    initializeSystem() {
        // Initialize pilot configuration
        const pilotConfig = {
            userCount: this.config.userCount,
            transactionCount: this.config.transactionCount,
            simulationDuration: this.config.demoDuration,
            complianceConfig: {
                amlThreshold: 10000,
                sanctionsCheck: true,
                riskAssessment: true,
                kycRequirements: 'enhanced',
                reportingThreshold: 5000
            }
        };
        // Initialize pilot
        this.pilot = new CBDCResearchPilot(pilotConfig);
        // Initialize other components
        this.auditTrailEngine = this.pilot.getAuditTrailEngine();
        this.privacyAnalyticsEngine = new PrivacyAnalyticsEngine({
            enableDifferentialPrivacy: true,
            epsilon: 1.0,
            delta: 1e-5,
            anonymizationLevel: 'enhanced',
            aggregationThreshold: 5,
            noiseScale: 1.0,
            kAnonymity: 3,
            lDiversity: 2
        });
        this.regulatoryDashboard = new RegulatoryDashboard({
            refreshInterval: 5000,
            enableRealTimeUpdates: this.config.enableRealTimeUpdates,
            enableAlerts: true,
            enableExport: true,
            complianceThresholds: {
                maxRiskScore: 0.7,
                maxErrorRate: 0.05,
                minSuccessRate: 0.95,
                maxLatency: 200,
                maxComplianceFlags: 10,
                minKYCCompliance: 0.9
            },
            kpiTargets: {
                targetTPS: 1000,
                targetLatency: 100,
                targetSuccessRate: 0.99,
                targetComplianceRate: 0.95,
                targetUserSatisfaction: 0.8,
                targetSystemUptime: 0.999
            },
            reportFormats: ['json', 'pdf', 'html']
        }, this.auditTrailEngine, this.privacyAnalyticsEngine);
        this.dataValidationEngine = new DataValidationEngine({
            enableCryptographicValidation: true,
            enableConsistencyChecks: true,
            enableRangeValidation: true,
            enableFormatValidation: true,
            enableBusinessRuleValidation: true,
            validationThresholds: {
                maxTransactionAmount: 100000,
                minTransactionAmount: 1,
                maxUserBalance: 1000000,
                minUserBalance: 0,
                maxProcessingTime: 5000,
                maxErrorRate: 0.01,
                minSuccessRate: 0.95
            },
            checksumAlgorithm: 'sha256',
            integrityCheckInterval: 60000
        });
        this.reportGenerator = new RegulatoryReportGenerator({
            outputDirectory: './demo-reports',
            reportFormats: ['json', 'pdf', 'html'],
            templateDirectory: './templates',
            enableAutomation: true,
            scheduleReports: false,
            reportRetention: 2555, // 7 years
            encryptionEnabled: false,
            compressionEnabled: true
        }, this.auditTrailEngine, this.privacyAnalyticsEngine, this.regulatoryDashboard, this.dataValidationEngine);
    }
}
// Default demonstration scenarios
export const DEFAULT_DEMO_SCENARIOS = [
    {
        name: 'System Initialization',
        description: 'Initialize the CBDC Research Pilot system and verify all components',
        duration: 2,
        parameters: {},
        expectedOutcomes: ['System initialized successfully', 'All components verified', 'Ready for demonstration']
    },
    {
        name: 'User Registration and KYC',
        description: 'Demonstrate user registration and KYC compliance process',
        duration: 3,
        parameters: { userCount: 100 },
        expectedOutcomes: ['Users generated successfully', 'KYC compliance verified', 'Audit trail created']
    },
    {
        name: 'Transaction Processing',
        description: 'Demonstrate transaction processing and compliance checking',
        duration: 5,
        parameters: { transactionCount: 1000 },
        expectedOutcomes: ['Transactions processed', 'Compliance checks performed', 'Success rate calculated']
    },
    {
        name: 'Compliance Monitoring',
        description: 'Demonstrate real-time compliance monitoring and alerting',
        duration: 3,
        parameters: {},
        expectedOutcomes: ['Compliance metrics displayed', 'Risk assessment performed', 'Alerts generated']
    },
    {
        name: 'Risk Assessment',
        description: 'Demonstrate comprehensive risk assessment capabilities',
        duration: 3,
        parameters: {},
        expectedOutcomes: ['Risk scores calculated', 'Risk levels determined', 'Risk mitigation recommended']
    },
    {
        name: 'Audit Trail Generation',
        description: 'Demonstrate immutable audit trail generation and verification',
        duration: 3,
        parameters: {},
        expectedOutcomes: ['Audit trail generated', 'Integrity verified', 'Statistics calculated']
    },
    {
        name: 'Privacy-Preserving Analytics',
        description: 'Demonstrate privacy-preserving analytics with differential privacy',
        duration: 4,
        parameters: {},
        expectedOutcomes: ['Privacy preserved', 'Analytics generated', 'Utility maintained']
    },
    {
        name: 'Regulatory Reporting',
        description: 'Demonstrate automated regulatory report generation',
        duration: 4,
        parameters: {},
        expectedOutcomes: ['Reports generated', 'Multiple formats supported', 'Compliance verified']
    },
    {
        name: 'Data Validation',
        description: 'Demonstrate comprehensive data validation and integrity checking',
        duration: 3,
        parameters: {},
        expectedOutcomes: ['Data validated', 'Integrity verified', 'Consistency checked']
    },
    {
        name: 'System Performance',
        description: 'Demonstrate system performance monitoring and metrics',
        duration: 3,
        parameters: {},
        expectedOutcomes: ['Performance measured', 'Health status displayed', 'Metrics calculated']
    },
    {
        name: 'Economic Impact Analysis',
        description: 'Demonstrate economic impact analysis and user behavior insights',
        duration: 4,
        parameters: {},
        expectedOutcomes: ['Economic metrics calculated', 'User behavior analyzed', 'Impact assessed']
    },
    {
        name: 'Stress Testing',
        description: 'Demonstrate system resilience under stress conditions',
        duration: 5,
        parameters: { loadMultiplier: 2 },
        expectedOutcomes: ['Stress test completed', 'Resilience demonstrated', 'Performance maintained']
    }
];
// Main demonstration function
export async function runRegulatoryDemo(config) {
    const demoConfig = {
        demoDuration: 30,
        userCount: 1000,
        transactionCount: 10000,
        enableRealTimeUpdates: true,
        generateReports: true,
        exportData: true,
        demoScenarios: DEFAULT_DEMO_SCENARIOS,
        ...config
    };
    const demo = new RegulatoryDemo(demoConfig);
    return await demo.runDemo();
}
export default RegulatoryDemo;
//# sourceMappingURL=demo-regulatory.js.map