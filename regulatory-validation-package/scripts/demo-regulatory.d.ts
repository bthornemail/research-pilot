/**
 * Regulatory Demonstration Script
 *
 * This script provides a comprehensive demonstration of the CBDC Research Pilot's
 * regulatory compliance capabilities for regulatory authorities and stakeholders.
 */
export interface RegulatoryDemoConfig {
    demoDuration: number;
    userCount: number;
    transactionCount: number;
    enableRealTimeUpdates: boolean;
    generateReports: boolean;
    exportData: boolean;
    demoScenarios: DemoScenario[];
}
export interface DemoScenario {
    name: string;
    description: string;
    duration: number;
    parameters: any;
    expectedOutcomes: string[];
}
export declare class RegulatoryDemo {
    private config;
    private pilot;
    private auditTrailEngine;
    private privacyAnalyticsEngine;
    private regulatoryDashboard;
    private dataValidationEngine;
    private reportGenerator;
    private demoResults;
    constructor(config: RegulatoryDemoConfig);
    /**
     * Run the complete regulatory demonstration
     */
    runDemo(): Promise<DemoResults>;
    /**
     * Run a specific demonstration scenario
     */
    runScenario(scenario: DemoScenario): Promise<ScenarioResult>;
    /**
     * Demonstrate system initialization
     */
    private demonstrateSystemInitialization;
    /**
     * Demonstrate user registration and KYC process
     */
    private demonstrateUserRegistration;
    /**
     * Demonstrate transaction processing
     */
    private demonstrateTransactionProcessing;
    /**
     * Demonstrate compliance monitoring
     */
    private demonstrateComplianceMonitoring;
    /**
     * Demonstrate risk assessment
     */
    private demonstrateRiskAssessment;
    /**
     * Demonstrate audit trail generation
     */
    private demonstrateAuditTrail;
    /**
     * Demonstrate privacy-preserving analytics
     */
    private demonstratePrivacyAnalytics;
    /**
     * Demonstrate regulatory reporting
     */
    private demonstrateRegulatoryReporting;
    /**
     * Demonstrate data validation
     */
    private demonstrateDataValidation;
    /**
     * Demonstrate system performance
     */
    private demonstrateSystemPerformance;
    /**
     * Demonstrate economic impact analysis
     */
    private demonstrateEconomicImpact;
    /**
     * Demonstrate stress testing
     */
    private demonstrateStressTesting;
    /**
     * Initialize the demonstration system
     */
    private initializeDemo;
    /**
     * Generate demonstration reports
     */
    private generateDemoReports;
    /**
     * Export demonstration data
     */
    private exportDemoData;
    /**
     * Finalize the demonstration
     */
    private finalizeDemo;
    /**
     * Initialize the system components
     */
    private initializeSystem;
}
export interface DemoResults {
    startTime: Date;
    endTime: Date;
    scenarios: ScenarioResult[];
    metrics: DemoMetrics;
    reports: any[];
    exports: any[];
}
export interface ScenarioResult {
    scenarioName: string;
    startTime: Date;
    endTime: Date;
    success: boolean;
    metrics: ScenarioMetrics;
    outcomes: string[];
    errors: string[];
}
export interface DemoMetrics {
    totalDuration: number;
    scenariosCompleted: number;
    successfulScenarios: number;
    reportsGenerated: number;
    dataExports: number;
}
export interface ScenarioMetrics {
    duration: number;
    success: boolean;
    errorCount: number;
}
export declare const DEFAULT_DEMO_SCENARIOS: DemoScenario[];
export declare function runRegulatoryDemo(config?: Partial<RegulatoryDemoConfig>): Promise<DemoResults>;
export default RegulatoryDemo;
//# sourceMappingURL=demo-regulatory.d.ts.map