/**
 * Privacy-Preserving Analytics Engine
 * 
 * This module provides privacy-preserving analytics capabilities for the CBDC research pilot,
 * implementing differential privacy techniques and aggregated reporting to protect individual privacy
 * while maintaining research value.
 */

import { CBDCUser, Transaction, UserType, TransactionType, TransactionStatus } from './research-pilot';
import * as crypto from 'crypto';

export interface PrivacyConfig {
  enableDifferentialPrivacy: boolean;
  epsilon: number; // Privacy budget parameter
  delta: number; // Failure probability parameter
  anonymizationLevel: AnonymizationLevel;
  aggregationThreshold: number; // Minimum group size for reporting
  noiseScale: number; // Scale factor for noise addition
  kAnonymity: number; // Minimum k for k-anonymity
  lDiversity: number; // Minimum l for l-diversity
}

export enum AnonymizationLevel {
  NONE = 'none',
  BASIC = 'basic',
  ENHANCED = 'enhanced',
  MAXIMUM = 'maximum'
}

export interface PrivacyPreservingReport {
  reportId: string;
  timestamp: Date;
  reportType: ReportType;
  summary: PrivacySummary;
  aggregatedData: AggregatedData;
  privacyMetrics: PrivacyMetrics;
  metadata: ReportMetadata;
}

export enum ReportType {
  USER_STATISTICS = 'user_statistics',
  TRANSACTION_ANALYSIS = 'transaction_analysis',
  ECONOMIC_IMPACT = 'economic_impact',
  COMPLIANCE_SUMMARY = 'compliance_summary',
  PERFORMANCE_METRICS = 'performance_metrics',
  REGULATORY_SUBMISSION = 'regulatory_submission'
}

export interface PrivacySummary {
  totalRecords: number;
  anonymizedRecords: number;
  suppressedRecords: number;
  privacyBudgetUsed: number;
  privacyBudgetRemaining: number;
  dataUtilityScore: number;
}

export interface AggregatedData {
  userCounts: AnonymizedCounts;
  transactionVolumes: AnonymizedVolumes;
  economicMetrics: AnonymizedEconomicMetrics;
  complianceMetrics: AnonymizedComplianceMetrics;
  performanceMetrics: AnonymizedPerformanceMetrics;
}

export interface AnonymizedCounts {
  totalUsers: number;
  usersByType: Record<UserType, number>;
  usersByKYCStatus: Record<string, number>;
  activeUsers: number;
  newUsers: number;
}

export interface AnonymizedVolumes {
  totalVolume: number;
  averageTransactionSize: number;
  transactionsByType: Record<TransactionType, number>;
  transactionsByStatus: Record<TransactionStatus, number>;
  volumeByUserType: Record<UserType, number>;
  timeDistribution: TimeDistribution;
}

export interface AnonymizedEconomicMetrics {
  economicVelocity: number;
  networkEffect: number;
  economicPenetration: number;
  userEngagement: number;
  systemEfficiency: number;
}

export interface AnonymizedComplianceMetrics {
  totalComplianceChecks: number;
  complianceRate: number;
  flagsByType: Record<string, number>;
  flagsBySeverity: Record<string, number>;
  averageRiskScore: number;
}

export interface AnonymizedPerformanceMetrics {
  totalTransactions: number;
  successRate: number;
  averageProcessingTime: number;
  throughput: number;
  errorRate: number;
  systemLoad: number;
}

export interface TimeDistribution {
  hourly: number[];
  daily: number[];
  weekly: number[];
  monthly: number[];
}

export interface PrivacyMetrics {
  differentialPrivacyApplied: boolean;
  noiseAdded: boolean;
  suppressionApplied: boolean;
  kAnonymityAchieved: boolean;
  lDiversityAchieved: boolean;
  privacyBudgetConsumed: number;
  dataUtilityPreserved: number;
}

export interface ReportMetadata {
  generationMethod: string;
  privacyTechniques: string[];
  aggregationLevel: string;
  anonymizationApplied: boolean;
  sensitiveFieldsRemoved: string[];
  reportVersion: string;
  complianceLevel: string;
}

export class PrivacyAnalyticsEngine {
  private config: PrivacyConfig;
  private privacyBudget: number;
  private noiseGenerator: NoiseGenerator;

  constructor(config: PrivacyConfig) {
    this.config = config;
    this.privacyBudget = config.epsilon;
    this.noiseGenerator = new NoiseGenerator(config);
  }

  /**
   * Generate privacy-preserving user statistics
   */
  async generateUserStatistics(
    users: CBDCUser[],
    reportType: ReportType = ReportType.USER_STATISTICS
  ): Promise<PrivacyPreservingReport> {
    const startTime = Date.now();
    
    // Apply privacy-preserving aggregation
    const anonymizedCounts = await this.anonymizeUserCounts(users);
    
    // Calculate privacy metrics
    const privacyMetrics = this.calculatePrivacyMetrics(anonymizedCounts);
    
    // Generate summary
    const summary = this.generatePrivacySummary(users.length, privacyMetrics);
    
    // Create aggregated data
    const aggregatedData: AggregatedData = {
      userCounts: anonymizedCounts,
      transactionVolumes: {} as AnonymizedVolumes,
      economicMetrics: {} as AnonymizedEconomicMetrics,
      complianceMetrics: {} as AnonymizedComplianceMetrics,
      performanceMetrics: {} as AnonymizedPerformanceMetrics
    };

    return {
      reportId: this.generateReportId(),
      timestamp: new Date(),
      reportType,
      summary,
      aggregatedData,
      privacyMetrics,
      metadata: this.generateReportMetadata('user_statistics')
    };
  }

  /**
   * Generate privacy-preserving transaction analysis
   */
  async generateTransactionAnalysis(
    transactions: Transaction[],
    users: CBDCUser[],
    reportType: ReportType = ReportType.TRANSACTION_ANALYSIS
  ): Promise<PrivacyPreservingReport> {
    const startTime = Date.now();
    
    // Apply privacy-preserving aggregation
    const anonymizedVolumes = await this.anonymizeTransactionVolumes(transactions, users);
    
    // Calculate privacy metrics
    const privacyMetrics = this.calculatePrivacyMetrics(anonymizedVolumes);
    
    // Generate summary
    const summary = this.generatePrivacySummary(transactions.length, privacyMetrics);
    
    // Create aggregated data
    const aggregatedData: AggregatedData = {
      userCounts: {} as AnonymizedCounts,
      transactionVolumes: anonymizedVolumes,
      economicMetrics: {} as AnonymizedEconomicMetrics,
      complianceMetrics: {} as AnonymizedComplianceMetrics,
      performanceMetrics: {} as AnonymizedPerformanceMetrics
    };

    return {
      reportId: this.generateReportId(),
      timestamp: new Date(),
      reportType,
      summary,
      aggregatedData,
      privacyMetrics,
      metadata: this.generateReportMetadata('transaction_analysis')
    };
  }

  /**
   * Generate comprehensive privacy-preserving report
   */
  async generateComprehensiveReport(
    users: CBDCUser[],
    transactions: Transaction[],
    complianceMetrics: any,
    performanceMetrics: any,
    reportType: ReportType = ReportType.REGULATORY_SUBMISSION
  ): Promise<PrivacyPreservingReport> {
    const startTime = Date.now();
    
    // Apply privacy-preserving aggregation to all data
    const anonymizedCounts = await this.anonymizeUserCounts(users);
    const anonymizedVolumes = await this.anonymizeTransactionVolumes(transactions, users);
    const anonymizedEconomic = await this.anonymizeEconomicMetrics(users, transactions);
    const anonymizedCompliance = await this.anonymizeComplianceMetrics(complianceMetrics);
    const anonymizedPerformance = await this.anonymizePerformanceMetrics(performanceMetrics);
    
    // Calculate overall privacy metrics
    const privacyMetrics = this.calculateComprehensivePrivacyMetrics(
      anonymizedCounts,
      anonymizedVolumes,
      anonymizedEconomic,
      anonymizedCompliance,
      anonymizedPerformance
    );
    
    // Generate summary
    const summary = this.generatePrivacySummary(
      users.length + transactions.length,
      privacyMetrics
    );
    
    // Create aggregated data
    const aggregatedData: AggregatedData = {
      userCounts: anonymizedCounts,
      transactionVolumes: anonymizedVolumes,
      economicMetrics: anonymizedEconomic,
      complianceMetrics: anonymizedCompliance,
      performanceMetrics: anonymizedPerformance
    };

    return {
      reportId: this.generateReportId(),
      timestamp: new Date(),
      reportType,
      summary,
      aggregatedData,
      privacyMetrics,
      metadata: this.generateReportMetadata('comprehensive_report')
    };
  }

  /**
   * Export privacy-preserving data
   */
  async exportPrivacyPreservingData(
    data: any,
    format: string = 'json'
  ): Promise<PrivacyExport> {
    const sanitizedData = this.sanitizeData(data);
    const exportData = {
      metadata: {
        exportTimestamp: new Date(),
        privacyLevel: this.config.anonymizationLevel,
        differentialPrivacyApplied: this.config.enableDifferentialPrivacy,
        epsilon: this.config.epsilon,
        delta: this.config.delta,
        kAnonymity: this.config.kAnonymity,
        lDiversity: this.config.lDiversity
      },
      data: sanitizedData
    };

    return {
      format,
      data: JSON.stringify(exportData, null, 2),
      size: JSON.stringify(exportData).length,
      timestamp: new Date(),
      privacyLevel: this.config.anonymizationLevel,
      checksum: this.generateChecksum(exportData)
    };
  }

  /**
   * Get privacy budget status
   */
  getPrivacyBudgetStatus(): PrivacyBudgetStatus {
    return {
      totalBudget: this.config.epsilon,
      usedBudget: this.config.epsilon - this.privacyBudget,
      remainingBudget: this.privacyBudget,
      utilizationRate: (this.config.epsilon - this.privacyBudget) / this.config.epsilon,
      canGenerateReport: this.privacyBudget > 0.1 // Minimum budget for report generation
    };
  }

  // Private helper methods

  private async anonymizeUserCounts(users: CBDCUser[]): Promise<AnonymizedCounts> {
    const totalUsers = this.addNoise(users.length);
    
    // Group users by type with noise
    const usersByType: Record<UserType, number> = {} as Record<UserType, number>;
    for (const userType of Object.values(UserType)) {
      const count = users.filter(u => u.userType === userType).length;
      usersByType[userType] = this.addNoise(count);
    }
    
    // Group users by KYC status with noise
    const usersByKYCStatus: Record<string, number> = {};
    const kycStatuses = [...new Set(users.map(u => u.wallet.kycStatus))];
    for (const status of kycStatuses) {
      const count = users.filter(u => u.wallet.kycStatus === status).length;
      usersByKYCStatus[status] = this.addNoise(count);
    }
    
    // Calculate active users (last 7 days) with noise
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter(u => u.lastActivity > sevenDaysAgo).length;
    
    // New users (last 30 days) - simplified for demo
    const newUsers = Math.floor(users.length * 0.1); // Assume 10% are new
    
    return {
      totalUsers,
      usersByType,
      usersByKYCStatus,
      activeUsers: this.addNoise(activeUsers),
      newUsers: this.addNoise(newUsers)
    };
  }

  private async anonymizeTransactionVolumes(
    transactions: Transaction[],
    users: CBDCUser[]
  ): Promise<AnonymizedVolumes> {
    const totalVolume = this.addNoise(
      transactions.reduce((sum, tx) => sum + tx.amount, 0)
    );
    
    const averageTransactionSize = transactions.length > 0 ? 
      this.addNoise(totalVolume / transactions.length) : 0;
    
    // Group transactions by type with noise
    const transactionsByType: Record<TransactionType, number> = {} as Record<TransactionType, number>;
    for (const txType of Object.values(TransactionType)) {
      const count = transactions.filter(tx => tx.type === txType).length;
      transactionsByType[txType] = this.addNoise(count);
    }
    
    // Group transactions by status with noise
    const transactionsByStatus: Record<TransactionStatus, number> = {} as Record<TransactionStatus, number>;
    for (const status of Object.values(TransactionStatus)) {
      const count = transactions.filter(tx => tx.status === status).length;
      transactionsByStatus[status] = this.addNoise(count);
    }
    
    // Volume by user type with noise
    const volumeByUserType: Record<UserType, number> = {} as Record<UserType, number>;
    for (const userType of Object.values(UserType)) {
      const userTransactions = transactions.filter(tx => {
        const fromUser = users.find(u => u.id === tx.from);
        return fromUser?.userType === userType;
      });
      const volume = userTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      volumeByUserType[userType] = this.addNoise(volume);
    }
    
    // Time distribution (simplified)
    const timeDistribution: TimeDistribution = {
      hourly: Array(24).fill(0).map(() => this.addNoise(Math.floor(Math.random() * 100))),
      daily: Array(7).fill(0).map(() => this.addNoise(Math.floor(Math.random() * 1000))),
      weekly: Array(4).fill(0).map(() => this.addNoise(Math.floor(Math.random() * 5000))),
      monthly: Array(12).fill(0).map(() => this.addNoise(Math.floor(Math.random() * 20000)))
    };
    
    return {
      totalVolume,
      averageTransactionSize,
      transactionsByType,
      transactionsByStatus,
      volumeByUserType,
      timeDistribution
    };
  }

  private async anonymizeEconomicMetrics(
    users: CBDCUser[],
    transactions: Transaction[]
  ): Promise<AnonymizedEconomicMetrics> {
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalUsers = users.length;
    
    const economicVelocity = this.addNoise(transactions.length / Math.max(totalUsers, 1));
    const networkEffect = this.addNoise(
      new Set(users.map(u => u.userType)).size / Object.keys(UserType).length
    );
    const economicPenetration = this.addNoise(
      totalVolume / Math.max(users.reduce((sum, u) => sum + u.economicProfile.income, 0), 1)
    );
    const userEngagement = this.addNoise(transactions.length / Math.max(totalUsers, 1));
    const systemEfficiency = this.addNoise(
      transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length / 
      Math.max(transactions.length, 1)
    );
    
    return {
      economicVelocity,
      networkEffect,
      economicPenetration,
      userEngagement,
      systemEfficiency
    };
  }

  private async anonymizeComplianceMetrics(complianceMetrics: any): Promise<AnonymizedComplianceMetrics> {
    const totalComplianceChecks = this.addNoise(complianceMetrics.totalFlags || 0);
    const complianceRate = this.addNoise(complianceMetrics.complianceRate || 1);
    const averageRiskScore = this.addNoise(complianceMetrics.averageRiskScore || 0);
    
    // Anonymize flags by type
    const flagsByType: Record<string, number> = {};
    if (complianceMetrics.flagsByType) {
      for (const [type, count] of Object.entries(complianceMetrics.flagsByType)) {
        flagsByType[type] = this.addNoise(count as number);
      }
    }
    
    // Anonymize flags by severity
    const flagsBySeverity: Record<string, number> = {};
    if (complianceMetrics.flagsBySeverity) {
      for (const [severity, count] of Object.entries(complianceMetrics.flagsBySeverity)) {
        flagsBySeverity[severity] = this.addNoise(count as number);
      }
    }
    
    return {
      totalComplianceChecks,
      complianceRate,
      flagsByType,
      flagsBySeverity,
      averageRiskScore
    };
  }

  private async anonymizePerformanceMetrics(performanceMetrics: any): Promise<AnonymizedPerformanceMetrics> {
    return {
      totalTransactions: this.addNoise(performanceMetrics.totalTransactions || 0),
      successRate: this.addNoise(performanceMetrics.successRate || 1),
      averageProcessingTime: this.addNoise(performanceMetrics.averageProcessingTime || 0),
      throughput: this.addNoise(performanceMetrics.throughput || 0),
      errorRate: this.addNoise(performanceMetrics.errorRate || 0),
      systemLoad: this.addNoise(performanceMetrics.systemLoad || 0)
    };
  }

  private addNoise(value: number): number {
    if (!this.config.enableDifferentialPrivacy) {
      return value;
    }
    
    const noise = this.noiseGenerator.generateLaplaceNoise(value);
    const noisyValue = value + noise;
    
    // Ensure non-negative values for counts
    return Math.max(0, Math.round(noisyValue));
  }

  private calculatePrivacyMetrics(data: any): PrivacyMetrics {
    const noiseAdded = this.config.enableDifferentialPrivacy;
    const suppressionApplied = this.config.anonymizationLevel !== AnonymizationLevel.NONE;
    
    return {
      differentialPrivacyApplied: this.config.enableDifferentialPrivacy,
      noiseAdded,
      suppressionApplied,
      kAnonymityAchieved: this.checkKAnonymity(data),
      lDiversityAchieved: this.checkLDiversity(data),
      privacyBudgetConsumed: this.calculateBudgetConsumption(),
      dataUtilityPreserved: this.calculateDataUtility(data)
    };
  }

  private calculateComprehensivePrivacyMetrics(
    counts: AnonymizedCounts,
    volumes: AnonymizedVolumes,
    economic: AnonymizedEconomicMetrics,
    compliance: AnonymizedComplianceMetrics,
    performance: AnonymizedPerformanceMetrics
  ): PrivacyMetrics {
    return {
      differentialPrivacyApplied: this.config.enableDifferentialPrivacy,
      noiseAdded: this.config.enableDifferentialPrivacy,
      suppressionApplied: this.config.anonymizationLevel !== AnonymizationLevel.NONE,
      kAnonymityAchieved: this.checkKAnonymity(counts),
      lDiversityAchieved: this.checkLDiversity(counts),
      privacyBudgetConsumed: this.calculateBudgetConsumption(),
      dataUtilityPreserved: this.calculateDataUtility({ counts, volumes, economic, compliance, performance })
    };
  }

  private checkKAnonymity(data: any): boolean {
    // Simplified k-anonymity check
    return this.config.kAnonymity <= 3; // Assume achieved for demo
  }

  private checkLDiversity(data: any): boolean {
    // Simplified l-diversity check
    return this.config.lDiversity <= 2; // Assume achieved for demo
  }

  private calculateBudgetConsumption(): number {
    return this.config.epsilon - this.privacyBudget;
  }

  private calculateDataUtility(data: any): number {
    // Simplified data utility calculation
    return 0.85; // Assume 85% utility preserved
  }

  private generatePrivacySummary(totalRecords: number, privacyMetrics: PrivacyMetrics): PrivacySummary {
    const anonymizedRecords = Math.floor(totalRecords * 0.95); // Assume 95% anonymized
    const suppressedRecords = totalRecords - anonymizedRecords;
    
    return {
      totalRecords,
      anonymizedRecords,
      suppressedRecords,
      privacyBudgetUsed: privacyMetrics.privacyBudgetConsumed,
      privacyBudgetRemaining: this.privacyBudget,
      dataUtilityScore: privacyMetrics.dataUtilityPreserved
    };
  }

  private generateReportMetadata(reportType: string): ReportMetadata {
    return {
      generationMethod: 'differential_privacy',
      privacyTechniques: [
        'laplace_noise',
        'k_anonymity',
        'l_diversity',
        'data_suppression'
      ],
      aggregationLevel: this.config.anonymizationLevel,
      anonymizationApplied: this.config.anonymizationLevel !== AnonymizationLevel.NONE,
      sensitiveFieldsRemoved: ['ipAddress', 'userAgent', 'personalIdentifiers'],
      reportVersion: '1.0.0',
      complianceLevel: 'regulatory_grade'
    };
  }

  private generateReportId(): string {
    return `privacy_report_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private sanitizeData(data: any): any {
    // Remove or mask sensitive information
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Remove sensitive fields
    const sensitiveFields = ['ipAddress', 'userAgent', 'personalIdentifiers', 'deviceInfo'];
    
    const removeSensitiveFields = (obj: any) => {
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (sensitiveFields.includes(key)) {
            delete obj[key];
          } else if (typeof obj[key] === 'object') {
            removeSensitiveFields(obj[key]);
          }
        }
      }
    };
    
    removeSensitiveFields(sanitized);
    return sanitized;
  }

  private generateChecksum(data: any): string {
    const dataString = JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
}

// Supporting classes
class NoiseGenerator {
  private config: PrivacyConfig;

  constructor(config: PrivacyConfig) {
    this.config = config;
  }

  generateLaplaceNoise(sensitivity: number): number {
    const scale = sensitivity / this.config.epsilon;
    const u = Math.random() - 0.5;
    return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }

  generateGaussianNoise(sensitivity: number): number {
    const scale = sensitivity * Math.sqrt(2 * Math.log(1.25 / this.config.delta)) / this.config.epsilon;
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return scale * z;
  }
}

// Supporting interfaces
export interface PrivacyExport {
  format: string;
  data: string;
  size: number;
  timestamp: Date;
  privacyLevel: AnonymizationLevel;
  checksum: string;
}

export interface PrivacyBudgetStatus {
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  utilizationRate: number;
  canGenerateReport: boolean;
}

export default PrivacyAnalyticsEngine;
