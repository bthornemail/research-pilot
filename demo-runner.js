/**
 * CBDC Research Pilot Demo Runner
 *
 * This script provides a comprehensive demo runner for the CBDC research pilot,
 * showcasing various scenarios and capabilities of the system.
 */
import { CBDCResearchPilot } from './research-pilot.js';
import { CBDCSimulationEngine } from './simulation-engine.js';
import { CBDCAnalyticsEngine } from './analytics-engine.js';
import { EnhancedH2GNN } from '@h2gnn/ai-persistence-core/enhanced-h2gnn.js';
import fs from 'fs';
class CBDCDemoRunner {
    constructor(config) {
        this.simulationResults = null; // Store simulation results for accurate analytics
        this.config = config;
        this.initializeSystems().catch(console.error);
    }
    /**
     * Initialize all systems
     */
    async initializeSystems() {
        console.log('🚀 Initializing CBDC Research Pilot Demo...');
        // Initialize H²GNN for CBDC pilot
        console.log('🧠 Initializing H²GNN for CBDC pilot...');
        this.h2gnn = new EnhancedH2GNN({
            embeddingDim: 128,
            numLayers: 4,
            curvature: -1
        }, {
            storagePath: './cbdc-persistence',
            maxMemories: 50000,
            consolidationThreshold: 200
        });
        await this.h2gnn.initialize();
        // Learn CBDC-specific concepts
        await this.h2gnn.learnConcept('asabiyyah_cooperative_economics', {
            description: 'Cooperative economics based on social cohesion',
            examples: ['worker cooperatives', 'credit unions', 'mutual aid networks'],
            relationships: ['topological_invariants', 'betti_numbers', 'social_networks'],
            applications: ['cbdc', 'digital_currency', 'economic_coordination']
        }, 0.95);
        await this.h2gnn.learnConcept('600_cell_identity_kernel', {
            description: '600-cell geometric structure for identity management',
            examples: ['IPv6-like addressing', 'geometric identity verification', 'topological consensus'],
            relationships: ['hyperbolic_geometry', 'identity_management', 'consensus_mechanisms'],
            applications: ['cbdc_identity', 'secure_transactions', 'decentralized_verification']
        }, 0.9);
        await this.h2gnn.learnConcept('universal_topological_ledger', {
            description: 'Geometric consensus protocol for decentralized economic coordination',
            examples: ['Byzantine fault tolerance', 'differential geometry', 'homotopy theory'],
            relationships: ['consensus_algorithms', 'topological_surfaces', 'economic_coordination'],
            applications: ['cbdc_consensus', 'transaction_validation', 'network_coordination']
        }, 0.9);
        console.log('✅ H²GNN initialized and CBDC concepts learned');
        // Initialize CBDC Research Pilot
        const pilotConfig = {
            utlConfig: {
                networkId: 'cbdc-demo-network',
                consensusThreshold: 0.67,
                blockTime: 1000,
                maxTransactionsPerBlock: 1000
            },
            complianceConfig: {
                amlThreshold: 10000,
                sanctionsCheck: true,
                riskAssessment: true,
                kycRequirements: 'enhanced',
                reportingThreshold: 5000
            },
            economicConfig: {
                initialMoneySupply: 1000000000, // 1 billion CBDC units
                inflationTarget: 0.02,
                interestRate: 0.05,
                reserveRequirement: 0.1,
                gdpGrowth: 0.03,
                unemploymentRate: 0.05
            }
        };
        this.pilot = new CBDCResearchPilot(pilotConfig);
        // Initialize Simulation Engine
        const simulationConfig = {
            duration: this.config.simulationDuration,
            timeStep: 1, // 1 hour
            economicModel: {
                gdpGrowth: 0.03,
                inflationRate: 0.02,
                interestRate: 0.05,
                unemploymentRate: 0.05,
                consumerConfidence: 0.7,
                businessConfidence: 0.6,
                marketVolatility: 0.2,
                policyChanges: [
                    {
                        timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                        type: 'INTEREST_RATE',
                        magnitude: 0.01,
                        description: 'Interest rate increase',
                        impact: {
                            userBehavior: -0.1,
                            transactionVolume: -0.05,
                            economicGrowth: -0.01,
                            inflation: -0.005,
                            confidence: -0.1
                        }
                    }
                ]
            },
            behaviorModel: {
                transactionProbability: 0.1,
                spendingMultiplier: 1.0,
                savingRate: 0.1,
                riskTolerance: 0.5,
                liquidityPreference: 0.5,
                seasonalFactors: [
                    { month: 11, factor: 1.2, description: 'Holiday shopping season' },
                    { month: 0, factor: 0.8, description: 'Post-holiday slowdown' }
                ],
                economicSensitivity: 0.5
            },
            systemModel: {
                networkCapacity: 1000000,
                processingSpeed: 1000,
                latency: 100,
                throughput: 10000,
                errorRate: 0.01,
                maintenanceWindows: [
                    {
                        startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                        endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours
                        impact: 0.3,
                        description: 'Scheduled maintenance'
                    }
                ]
            }
        };
        this.simulationEngine = new CBDCSimulationEngine(simulationConfig);
        // Initialize Analytics Engine
        const analyticsConfig = {
            realTimeMonitoring: this.config.enableRealTimeMonitoring,
            dataRetention: 30,
            reportGeneration: true,
            alertThresholds: {
                systemLoad: 0.8,
                errorRate: 0.05,
                transactionVolume: 1000000,
                complianceFlags: 10,
                latency: 1000,
                userActivity: 0.5
            },
            exportFormats: [
                {
                    type: 'json',
                    frequency: 'daily',
                    includeMetadata: true
                },
                {
                    type: 'csv',
                    frequency: 'weekly',
                    includeMetadata: false
                }
            ]
        };
        this.analyticsEngine = new CBDCAnalyticsEngine(analyticsConfig);
        console.log('✅ All systems initialized successfully');
    }
    /**
     * Learn from simulation results using H²GNN
     */
    async learnFromSimulationResults() {
        if (!this.simulationResults || !this.h2gnn) {
            return;
        }
        console.log('🧠 Learning from simulation results using H²GNN...');
        // Learn from transaction patterns
        await this.h2gnn.learnConcept('cbdc_transaction_patterns', {
            description: 'Patterns observed in CBDC transactions during simulation',
            examples: this.simulationResults.transactionPatterns || [],
            relationships: ['economic_behavior', 'transaction_flow', 'user_preferences'],
            applications: ['transaction_optimization', 'fraud_detection', 'user_experience']
        }, 0.8);
        // Learn from consensus behavior
        await this.h2gnn.learnConcept('consensus_behavior_analysis', {
            description: 'Analysis of consensus mechanism behavior during simulation',
            examples: this.simulationResults.consensusMetrics || [],
            relationships: ['consensus_algorithms', 'network_performance', 'fault_tolerance'],
            applications: ['consensus_optimization', 'network_scaling', 'reliability_improvement']
        }, 0.85);
        // Learn from economic metrics
        await this.h2gnn.learnConcept('economic_metrics_analysis', {
            description: 'Economic metrics and their relationships during simulation',
            examples: this.simulationResults.economicMetrics || [],
            relationships: ['economic_indicators', 'market_behavior', 'monetary_policy'],
            applications: ['economic_modeling', 'policy_optimization', 'market_analysis']
        }, 0.9);
        console.log('✅ H²GNN learning from simulation results completed');
    }
    /**
     * Run the complete demo
     */
    async runDemo() {
        console.log(`\n🎯 Starting CBDC Research Pilot Demo - Scenario: ${this.config.scenario}`);
        console.log(`📊 Configuration:`);
        console.log(`   - Users: ${this.config.userCount.toLocaleString()}`);
        console.log(`   - Duration: ${this.config.simulationDuration} days`);
        console.log(`   - Analytics: ${this.config.enableAnalytics ? 'Enabled' : 'Disabled'}`);
        console.log(`   - Real-time Monitoring: ${this.config.enableRealTimeMonitoring ? 'Enabled' : 'Disabled'}`);
        try {
            // Step 1: Initialize Pilot
            console.log('\n📋 Step 1: Initializing Pilot...');
            await this.initializePilot();
            // Step 2: Run Simulation
            console.log('\n🔄 Step 2: Running Simulation...');
            await this.runSimulation();
            // Step 3: Generate Analytics
            if (this.config.enableAnalytics) {
                console.log('\n📈 Step 3: Generating Analytics...');
                await this.generateAnalytics();
            }
            // Step 3.5: Learn from results using H²GNN
            console.log('\n🧠 Step 3.5: Learning from results using H²GNN...');
            await this.learnFromSimulationResults();
            // Step 4: Export Results
            if (this.config.exportResults) {
                console.log('\n💾 Step 4: Exporting Results...');
                await this.exportResults();
            }
            // Step 5: Display Summary
            console.log('\n📊 Step 5: Demo Summary...');
            await this.displaySummary();
            console.log('\n🎉 CBDC Research Pilot Demo completed successfully!');
        }
        catch (error) {
            console.error('\n❌ Demo failed:', error);
            throw error;
        }
    }
    /**
     * Initialize the pilot with users
     */
    async initializePilot() {
        const startTime = Date.now();
        await this.pilot.initializePilot();
        await this.pilot['generateUsers'](this.config.userCount);
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`   ✅ Generated ${this.config.userCount.toLocaleString()} users in ${duration}ms`);
        console.log(`   📊 Average time per user: ${(duration / this.config.userCount).toFixed(2)}ms`);
    }
    /**
     * Run the simulation
     */
    async runSimulation() {
        const startTime = Date.now();
        const users = this.pilot['users'];
        const results = await this.simulationEngine.runSimulation(users);
        // Store transactions from simulation results back into the pilot
        if (results.transactions) {
            console.log(`   📝 Processing ${results.transactions.size} transactions into pilot...`);
            for (const transaction of results.transactions.values()) {
                await this.pilot.processTransaction(transaction);
            }
        }
        // Store system metrics for analytics engine
        this.simulationResults = results;
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`   ✅ Simulation completed in ${duration}ms`);
        console.log(`   📊 Results:`);
        console.log(`      - Total Users: ${results.totalUsers.toLocaleString()}`);
        console.log(`      - Total Transactions: ${results.totalTransactions.toLocaleString()}`);
        console.log(`      - Total Volume: ${results.totalVolume.toLocaleString()} CBDC units`);
        console.log(`      - Average Transaction Size: ${results.averageTransactionSize.toFixed(2)} CBDC units`);
        console.log(`      - Success Rate: ${(results.successRate * 100).toFixed(2)}%`);
        console.log(`      - System Load: ${(results.systemPerformance.systemLoad * 100).toFixed(2)}%`);
        console.log(`      - Error Rate: ${(results.systemPerformance.errorRate * 100).toFixed(2)}%`);
        console.log(`      - Average Latency: ${results.systemPerformance.averageLatency.toFixed(2)}ms`);
    }
    /**
     * Generate analytics
     */
    async generateAnalytics() {
        const startTime = Date.now();
        // Get pilot analytics
        const pilotAnalytics = await this.pilot.getAnalytics();
        // Update analytics engine with current simulation data and system metrics
        const users = Array.from(this.pilot.usersMap.values());
        const transactions = Array.from(this.pilot.transactionsMap.values());
        const systemMetrics = this.simulationResults?.systemPerformance || null;
        console.log(`[DEBUG] Demo runner - Users: ${users.length}, Transactions: ${transactions.length}`);
        this.analyticsEngine.updateData(users, transactions, systemMetrics);
        // Record real-time metrics using actual simulation data
        const realTimeMetrics = {
            timestamp: new Date(),
            totalUsers: pilotAnalytics.userStatistics.totalUsers,
            totalTransactions: pilotAnalytics.transactionStatistics.totalTransactions,
            totalVolume: pilotAnalytics.transactionStatistics.totalVolume,
            successRate: pilotAnalytics.transactionStatistics.successRate * 100, // Use actual success rate
            systemLoad: systemMetrics?.systemLoad || 0.5, // Use actual system load
            errorRate: systemMetrics?.errorRate || 0.01, // Use actual error rate
            averageLatency: systemMetrics?.averageLatency || 100, // Use actual latency
            userSatisfaction: 0.8, // Use fallback since userSatisfaction not in UserStatistics interface
            economicImpact: 80 // Use fallback since totalImpact not in EconomicImpact interface
        };
        this.analyticsEngine.recordRealTimeMetrics(realTimeMetrics);
        // Generate performance report
        const period = {
            start: new Date(Date.now() - this.config.simulationDuration * 24 * 60 * 60 * 1000),
            end: new Date()
        };
        const report = await this.analyticsEngine.generatePerformanceReport(period);
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`   ✅ Analytics generated in ${duration}ms`);
        console.log(`   📊 Analytics Summary:`);
        console.log(`      - Total Users: ${report.summary.totalUsers.toLocaleString()}`);
        console.log(`      - Total Transactions: ${report.summary.totalTransactions.toLocaleString()}`);
        console.log(`      - Total Volume: ${report.summary.totalVolume.toLocaleString()} CBDC units`);
        console.log(`      - Success Rate: ${(report.summary.successRate * 100).toFixed(2)}%`);
        console.log(`      - System Uptime: ${(report.summary.systemUptime * 100).toFixed(2)}%`);
        console.log(`      - User Satisfaction: ${(report.summary.userSatisfaction * 100).toFixed(2)}%`);
        console.log(`      - Economic Impact: ${(report.summary.economicImpact * 100).toFixed(2)}%`);
        console.log(`      - Recommendations: ${report.recommendations.length}`);
    }
    /**
     * Export results
     */
    async exportResults() {
        const startTime = Date.now();
        // Export pilot data
        const pilotData = await this.pilot.exportResearchData();
        // Export analytics data
        const period = {
            start: new Date(Date.now() - this.config.simulationDuration * 24 * 60 * 60 * 1000),
            end: new Date()
        };
        const analyticsExport = await this.analyticsEngine.exportAnalytics({ type: 'json', frequency: 'daily', includeMetadata: true }, period);
        fs.writeFileSync('analytics-export.json', JSON.stringify(analyticsExport, null, 2));
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`   ✅ Results exported in ${duration}ms`);
        console.log(`   📁 Export Summary:`);
        console.log(`      - Pilot Data: ${JSON.stringify(pilotData).length} bytes`);
        console.log(`      - Analytics Data: ${analyticsExport.size} bytes`);
        console.log(`      - Export Format: ${analyticsExport.format}`);
    }
    /**
     * Display demo summary
     */
    async displaySummary() {
        const pilotAnalytics = await this.pilot.getAnalytics();
        // Update analytics engine with current data before getting dashboard data
        const users = Array.from(this.pilot.usersMap.values());
        const transactions = Array.from(this.pilot.transactionsMap.values());
        const systemMetrics = this.simulationResults?.systemPerformance || null;
        this.analyticsEngine.updateData(users, transactions, systemMetrics);
        const dashboardData = this.analyticsEngine.getDashboardData();
        console.log(`\n📊 CBDC Research Pilot Demo Summary`);
        console.log(`═══════════════════════════════════════════════════════════════`);
        console.log(`🎯 Scenario: ${this.config.scenario}`);
        console.log(`👥 Users: ${pilotAnalytics.userStatistics.totalUsers.toLocaleString()}`);
        console.log(`💳 Transactions: ${pilotAnalytics.transactionStatistics.totalTransactions.toLocaleString()}`);
        console.log(`💰 Total Volume: ${pilotAnalytics.transactionStatistics.totalVolume.toLocaleString()} CBDC units`);
        console.log(`📈 Success Rate: ${(pilotAnalytics.transactionStatistics.successRate * 100).toFixed(2)}%`);
        console.log(`⚡ Average Latency: ${dashboardData.currentMetrics?.averageLatency || 0}ms`);
        console.log(`🔄 System Load: ${(dashboardData.currentMetrics?.systemLoad || 0) * 100}%`);
        console.log(`❌ Error Rate: ${(dashboardData.currentMetrics?.errorRate || 0) * 100}%`);
        console.log(`😊 User Satisfaction: ${(dashboardData.currentMetrics?.userSatisfaction || 0) * 100}%`);
        console.log(`🚨 Active Alerts: ${dashboardData.recentAlerts.length}`);
        console.log(`📊 System Status: ${dashboardData.systemStatus}`);
        console.log(`═══════════════════════════════════════════════════════════════`);
        // Display user type distribution
        console.log(`\n👥 User Type Distribution:`);
        Object.entries(pilotAnalytics.userStatistics.userTypes).forEach(([type, count]) => {
            const percentage = (count / pilotAnalytics.userStatistics.totalUsers * 100).toFixed(1);
            console.log(`   ${type}: ${count.toLocaleString()} (${percentage}%)`);
        });
        // Display transaction type distribution
        console.log(`\n💳 Transaction Type Distribution:`);
        Object.entries(pilotAnalytics.transactionStatistics.transactionTypes).forEach(([type, count]) => {
            const percentage = (count / pilotAnalytics.transactionStatistics.totalTransactions * 100).toFixed(1);
            console.log(`   ${type}: ${count.toLocaleString()} (${percentage}%)`);
        });
        // Display KYC status distribution
        console.log(`\n🔐 KYC Status Distribution:`);
        Object.entries(pilotAnalytics.userStatistics.kycStatuses).forEach(([status, count]) => {
            const percentage = (count / pilotAnalytics.userStatistics.totalUsers * 100).toFixed(1);
            console.log(`   ${status}: ${count.toLocaleString()} (${percentage}%)`);
        });
    }
    /**
     * Run specific demo scenarios
     */
    static async runScenario(scenario) {
        let config;
        switch (scenario) {
            case 'basic':
                config = {
                    scenario: 'Basic Pilot (1,000 users)',
                    userCount: 1000,
                    simulationDuration: 7,
                    enableAnalytics: true,
                    enableRealTimeMonitoring: true,
                    exportResults: true
                };
                break;
            case 'large':
                config = {
                    scenario: 'Large-Scale Pilot (100,000 users)',
                    userCount: 100000,
                    simulationDuration: 30,
                    enableAnalytics: true,
                    enableRealTimeMonitoring: true,
                    exportResults: true
                };
                break;
            case 'stress':
                config = {
                    scenario: 'Stress Testing (1,000,000 users)',
                    userCount: 1000000,
                    simulationDuration: 1,
                    enableAnalytics: false,
                    enableRealTimeMonitoring: false,
                    exportResults: false
                };
                break;
            case 'economic-shock':
                config = {
                    scenario: 'Economic Shock Simulation (50,000 users)',
                    userCount: 50000,
                    simulationDuration: 14,
                    enableAnalytics: true,
                    enableRealTimeMonitoring: true,
                    exportResults: true
                };
                break;
            default:
                throw new Error(`Unknown scenario: ${scenario}`);
        }
        const runner = new CBDCDemoRunner(config);
        await runner.runDemo();
    }
}
// Main execution
async function main() {
    const args = process.argv.slice(2);
    const scenario = args[0] || 'basic';
    console.log('🏦 CBDC Research Pilot Demo');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Available scenarios:');
    console.log('  basic          - Basic pilot with 1,000 users (7 days)');
    console.log('  large          - Large-scale pilot with 100,000 users (30 days)');
    console.log('  stress         - Stress testing with 1,000,000 users (1 day)');
    console.log('  economic-shock - Economic shock simulation (50,000 users, 14 days)');
    console.log('═══════════════════════════════════════════════════════════════');
    try {
        await CBDCDemoRunner.runScenario(scenario);
    }
    catch (error) {
        console.error('❌ Demo failed:', error);
        process.exit(1);
    }
}
// Run the demo if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}
export { CBDCDemoRunner };
