/**
 * Audit Trail Engine
 * 
 * This module provides comprehensive audit trail capabilities for the CBDC research pilot,
 * including immutable logging, cryptographic verification, and regulatory compliance reporting.
 */

import * as crypto from 'crypto';
import { Transaction, CBDCUser, TransactionStatus } from './research-pilot.js';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  entityId: string;
  entityType: EntityType;
  action: string;
  details: any;
  previousState?: any;
  newState?: any;
  hash: string;
  previousHash?: string;
  verified: boolean;
  metadata: AuditMetadata;
}

export enum AuditEventType {
  TRANSACTION_CREATED = 'transaction_created',
  TRANSACTION_PROCESSED = 'transaction_processed',
  TRANSACTION_COMPLETED = 'transaction_completed',
  TRANSACTION_FAILED = 'transaction_failed',
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  COMPLIANCE_CHECK = 'compliance_check',
  COMPLIANCE_FLAG = 'compliance_flag',
  SYSTEM_EVENT = 'system_event',
  POLICY_CHANGE = 'policy_change',
  DATA_EXPORT = 'data_export',
  ACCESS_GRANTED = 'access_granted',
  ACCESS_DENIED = 'access_denied'
}

export enum EntityType {
  TRANSACTION = 'transaction',
  USER = 'user',
  SYSTEM = 'system',
  COMPLIANCE = 'compliance',
  POLICY = 'policy',
  AUDIT = 'audit'
}

export interface AuditMetadata {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  source: string;
  version: string;
  environment: string;
}

export interface AuditTrailConfig {
  enableCryptographicVerification: boolean;
  enableImmutableLogging: boolean;
  retentionPeriod: number; // days
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  exportFormats: string[];
  alertThresholds: AuditAlertThresholds;
}

export interface AuditAlertThresholds {
  failedVerifications: number;
  suspiciousActivity: number;
  dataIntegrityIssues: number;
  accessViolations: number;
}

export interface AuditReport {
  period: DateRange;
  summary: AuditSummary;
  entries: AuditEntry[];
  verificationResults: VerificationResults;
  complianceMetrics: ComplianceAuditMetrics;
  recommendations: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface AuditSummary {
  totalEntries: number;
  entriesByType: Record<AuditEventType, number>;
  entriesByEntity: Record<EntityType, number>;
  verificationRate: number;
  integrityScore: number;
  complianceScore: number;
}

export interface VerificationResults {
  totalVerified: number;
  totalFailed: number;
  verificationRate: number;
  integrityIssues: IntegrityIssue[];
  suspiciousEntries: AuditEntry[];
}

export interface IntegrityIssue {
  entryId: string;
  issueType: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface ComplianceAuditMetrics {
  totalComplianceChecks: number;
  complianceViolations: number;
  complianceRate: number;
  flaggedTransactions: number;
  resolvedFlags: number;
  pendingFlags: number;
}

export class AuditTrailEngine {
  private entries: AuditEntry[] = [];
  private config: AuditTrailConfig;
  private alerts: AuditAlert[] = [];
  private verificationCache: Map<string, boolean> = new Map();

  constructor(config: AuditTrailConfig) {
    this.config = config;
  }

  /**
   * Create a new audit entry
   */
  async createEntry(
    eventType: AuditEventType,
    entityId: string,
    entityType: EntityType,
    action: string,
    details: any,
    previousState?: any,
    newState?: any,
    metadata?: Partial<AuditMetadata>
  ): Promise<AuditEntry> {
    const timestamp = new Date();
    const id = this.generateEntryId();
    
    // Get previous hash for chain verification
    const previousHash = this.entries.length > 0 ? this.entries[this.entries.length - 1]?.hash : undefined;
    
    // Create entry data for hashing
    const entryData = {
      id,
      timestamp: timestamp.toISOString(),
      eventType,
      entityId,
      entityType,
      action,
      details,
      previousState,
      newState,
      previousHash
    };

    // Generate cryptographic hash
    const hash = this.config.enableCryptographicVerification ? 
      this.generateHash(entryData) : this.generateSimpleHash(entryData);

    // Create audit entry
    const entry: AuditEntry = {
      id,
      timestamp,
      eventType,
      entityId,
      entityType,
      action,
      details,
      previousState,
      newState,
      hash,
      ...(previousHash && { previousHash }),
      verified: false,
      metadata: {
        source: 'cbdc-research-pilot',
        version: '1.0.0',
        environment: 'research',
        ...metadata
      }
    };

    // Verify entry integrity
    if (this.config.enableCryptographicVerification) {
      entry.verified = await this.verifyEntry(entry);
    } else {
      entry.verified = true;
    }

    // Add to audit trail
    this.entries.push(entry);

    // Check for alerts
    await this.checkAlerts(entry);

    return entry;
  }

  /**
   * Log transaction events
   */
  async logTransactionEvent(
    transaction: Transaction,
    eventType: AuditEventType,
    details: any,
    metadata?: Partial<AuditMetadata>
  ): Promise<AuditEntry> {
    return this.createEntry(
      eventType,
      transaction.id,
      EntityType.TRANSACTION,
      `Transaction ${eventType}`,
      {
        transactionId: transaction.id,
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to,
        type: transaction.type,
        status: transaction.status,
        ...details
      },
      undefined,
      transaction,
      metadata
    );
  }

  /**
   * Log user events
   */
  async logUserEvent(
    user: CBDCUser,
    eventType: AuditEventType,
    action: string,
    details: any,
    previousState?: any,
    metadata?: Partial<AuditMetadata>
  ): Promise<AuditEntry> {
    return this.createEntry(
      eventType,
      user.id,
      EntityType.USER,
      action,
      {
        userId: user.id,
        userType: user.userType,
        ...details
      },
      previousState,
      user,
      metadata
    );
  }

  /**
   * Log compliance events
   */
  async logComplianceEvent(
    entityId: string,
    action: string,
    details: any,
    metadata?: Partial<AuditMetadata>
  ): Promise<AuditEntry> {
    return this.createEntry(
      AuditEventType.COMPLIANCE_CHECK,
      entityId,
      EntityType.COMPLIANCE,
      action,
      details,
      undefined,
      undefined,
      metadata
    );
  }

  /**
   * Log system events
   */
  async logSystemEvent(
    action: string,
    details: any,
    metadata?: Partial<AuditMetadata>
  ): Promise<AuditEntry> {
    return this.createEntry(
      AuditEventType.SYSTEM_EVENT,
      'system',
      EntityType.SYSTEM,
      action,
      details,
      undefined,
      undefined,
      metadata
    );
  }

  /**
   * Verify audit trail integrity
   */
  async verifyAuditTrail(): Promise<VerificationResults> {
    const results: VerificationResults = {
      totalVerified: 0,
      totalFailed: 0,
      verificationRate: 0,
      integrityIssues: [],
      suspiciousEntries: []
    };

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (!entry) continue;
      
      const isVerified = await this.verifyEntry(entry);
      
      if (isVerified) {
        results.totalVerified++;
      } else {
        results.totalFailed++;
        results.integrityIssues.push({
          entryId: entry.id,
          issueType: 'hash_verification_failed',
          description: 'Hash verification failed for audit entry',
          severity: 'high',
          timestamp: entry.timestamp
        });
      }

      // Check for suspicious patterns
      if (this.isSuspiciousEntry(entry)) {
        results.suspiciousEntries.push(entry);
      }
    }

    results.verificationRate = this.entries.length > 0 ? 
      results.totalVerified / this.entries.length : 1;

    return results;
  }

  /**
   * Generate audit report
   */
  async generateAuditReport(period: DateRange): Promise<AuditReport> {
    const periodEntries = this.entries.filter(entry => 
      entry.timestamp >= period.start && entry.timestamp <= period.end
    );

    const summary = this.calculateAuditSummary(periodEntries);
    const verificationResults = await this.verifyAuditTrail();
    const complianceMetrics = this.calculateComplianceMetrics(periodEntries);
    const recommendations = this.generateRecommendations(summary, verificationResults, complianceMetrics);

    return {
      period,
      summary,
      entries: periodEntries,
      verificationResults,
      complianceMetrics,
      recommendations
    };
  }

  /**
   * Export audit trail
   */
  async exportAuditTrail(format: string, period?: DateRange): Promise<AuditExport> {
    const entries = period ? 
      this.entries.filter(entry => entry.timestamp >= period.start && entry.timestamp <= period.end) :
      this.entries;

    const exportData = {
      metadata: {
        exportTimestamp: new Date(),
        totalEntries: entries.length,
        format,
        version: '1.0.0'
      },
      entries: entries.map(entry => ({
        ...entry,
        // Remove sensitive data if needed
        details: this.sanitizeDetails(entry.details)
      }))
    };

    return {
      format,
      data: JSON.stringify(exportData, null, 2),
      size: JSON.stringify(exportData).length,
      timestamp: new Date(),
      checksum: this.generateHash(exportData)
    };
  }

  /**
   * Get audit trail statistics
   */
  getAuditStatistics(): AuditStatistics {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentEntries = this.entries.filter(entry => entry.timestamp >= last24Hours);
    const weeklyEntries = this.entries.filter(entry => entry.timestamp >= last7Days);

    return {
      totalEntries: this.entries.length,
      entriesLast24Hours: recentEntries.length,
      entriesLast7Days: weeklyEntries.length,
      averageEntriesPerDay: weeklyEntries.length / 7,
      verificationRate: this.calculateVerificationRate(),
      integrityScore: this.calculateIntegrityScore(),
      complianceScore: this.calculateComplianceScore(),
      alertsCount: this.alerts.length,
      lastEntryTimestamp: this.entries.length > 0 ? this.entries[this.entries.length - 1]?.timestamp || null : null
    };
  }

  // Private helper methods

  private generateEntryId(): string {
    return `audit_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private generateHash(data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  private generateSimpleHash(data: any): string {
    const dataString = JSON.stringify(data);
    return crypto.createHash('md5').update(dataString).digest('hex');
  }

  private async verifyEntry(entry: AuditEntry): Promise<boolean> {
    if (!this.config.enableCryptographicVerification) {
      return true;
    }

    // Check cache first
    if (this.verificationCache.has(entry.id)) {
      return this.verificationCache.get(entry.id)!;
    }

    // Recreate entry data for verification
    const entryData = {
      id: entry.id,
      timestamp: entry.timestamp.toISOString(),
      eventType: entry.eventType,
      entityId: entry.entityId,
      entityType: entry.entityType,
      action: entry.action,
      details: entry.details,
      previousState: entry.previousState,
      newState: entry.newState,
      previousHash: entry.previousHash
    };

    const calculatedHash = this.generateHash(entryData);
    const isValid = calculatedHash === entry.hash;

    // Cache result
    this.verificationCache.set(entry.id, isValid);

    return isValid;
  }

  private isSuspiciousEntry(entry: AuditEntry): boolean {
    // Check for suspicious patterns
    if (entry.eventType === AuditEventType.ACCESS_DENIED) {
      return true;
    }

    if (entry.eventType === AuditEventType.COMPLIANCE_FLAG) {
      return true;
    }

    // Check for rapid successive entries
    const recentEntries = this.entries.filter(e => 
      e.entityId === entry.entityId && 
      Math.abs(e.timestamp.getTime() - entry.timestamp.getTime()) < 60000 // 1 minute
    );

    return recentEntries.length > 10;
  }

  private async checkAlerts(entry: AuditEntry): Promise<void> {
    // Check for failed verifications
    if (!entry.verified) {
      this.alerts.push({
        id: `alert_${Date.now()}`,
        type: 'verification_failed',
        severity: 'high',
        message: `Audit entry verification failed: ${entry.id}`,
        timestamp: new Date(),
        entryId: entry.id
      });
    }

    // Check for suspicious activity
    if (this.isSuspiciousEntry(entry)) {
      this.alerts.push({
        id: `alert_${Date.now()}`,
        type: 'suspicious_activity',
        severity: 'medium',
        message: `Suspicious activity detected: ${entry.action}`,
        timestamp: new Date(),
        entryId: entry.id
      });
    }
  }

  private calculateAuditSummary(entries: AuditEntry[]): AuditSummary {
    const entriesByType = entries.reduce((acc, entry) => {
      acc[entry.eventType] = (acc[entry.eventType] || 0) + 1;
      return acc;
    }, {} as Record<AuditEventType, number>);

    const entriesByEntity = entries.reduce((acc, entry) => {
      acc[entry.entityType] = (acc[entry.entityType] || 0) + 1;
      return acc;
    }, {} as Record<EntityType, number>);

    const verifiedEntries = entries.filter(entry => entry.verified).length;
    const verificationRate = entries.length > 0 ? verifiedEntries / entries.length : 1;

    return {
      totalEntries: entries.length,
      entriesByType,
      entriesByEntity,
      verificationRate,
      integrityScore: this.calculateIntegrityScore(),
      complianceScore: this.calculateComplianceScore()
    };
  }

  private calculateComplianceMetrics(entries: AuditEntry[]): ComplianceAuditMetrics {
    const complianceEntries = entries.filter(entry => 
      entry.eventType === AuditEventType.COMPLIANCE_CHECK ||
      entry.eventType === AuditEventType.COMPLIANCE_FLAG
    );

    const flaggedEntries = entries.filter(entry => 
      entry.eventType === AuditEventType.COMPLIANCE_FLAG
    );

    const resolvedFlags = flaggedEntries.filter(entry => 
      entry.details?.resolved === true
    ).length;

    const pendingFlags = flaggedEntries.length - resolvedFlags;

    return {
      totalComplianceChecks: complianceEntries.length,
      complianceViolations: flaggedEntries.length,
      complianceRate: complianceEntries.length > 0 ? 
        (complianceEntries.length - flaggedEntries.length) / complianceEntries.length : 1,
      flaggedTransactions: flaggedEntries.filter(entry => 
        entry.entityType === EntityType.TRANSACTION
      ).length,
      resolvedFlags,
      pendingFlags
    };
  }

  private generateRecommendations(
    summary: AuditSummary,
    verificationResults: VerificationResults,
    complianceMetrics: ComplianceAuditMetrics
  ): string[] {
    const recommendations: string[] = [];

    if (summary.verificationRate < 0.95) {
      recommendations.push('Improve audit trail verification processes');
    }

    if (complianceMetrics.complianceRate < 0.9) {
      recommendations.push('Review and strengthen compliance procedures');
    }

    if (verificationResults.integrityIssues.length > 0) {
      recommendations.push('Investigate and resolve data integrity issues');
    }

    if (summary.integrityScore < 0.8) {
      recommendations.push('Implement additional data integrity checks');
    }

    return recommendations;
  }

  private sanitizeDetails(details: any): any {
    // Remove sensitive information from export
    const sanitized = { ...details };
    
    // Remove or mask sensitive fields
    if (sanitized.ipAddress) {
      sanitized.ipAddress = '***.***.***.***';
    }
    
    if (sanitized.userAgent) {
      sanitized.userAgent = '***';
    }

    return sanitized;
  }

  private calculateVerificationRate(): number {
    if (this.entries.length === 0) return 1;
    const verified = this.entries.filter(entry => entry.verified).length;
    return verified / this.entries.length;
  }

  private calculateIntegrityScore(): number {
    const verificationRate = this.calculateVerificationRate();
    const suspiciousEntries = this.entries.filter(entry => this.isSuspiciousEntry(entry)).length;
    const suspiciousRate = this.entries.length > 0 ? suspiciousEntries / this.entries.length : 0;
    
    return Math.max(0, verificationRate - suspiciousRate);
  }

  private calculateComplianceScore(): number {
    const complianceEntries = this.entries.filter(entry => 
      entry.eventType === AuditEventType.COMPLIANCE_CHECK
    );
    
    if (complianceEntries.length === 0) return 1;
    
    const violations = this.entries.filter(entry => 
      entry.eventType === AuditEventType.COMPLIANCE_FLAG
    ).length;
    
    return Math.max(0, 1 - (violations / complianceEntries.length));
  }
}

// Supporting interfaces
export interface AuditAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  entryId: string;
}

export interface AuditExport {
  format: string;
  data: string;
  size: number;
  timestamp: Date;
  checksum: string;
}

export interface AuditStatistics {
  totalEntries: number;
  entriesLast24Hours: number;
  entriesLast7Days: number;
  averageEntriesPerDay: number;
  verificationRate: number;
  integrityScore: number;
  complianceScore: number;
  alertsCount: number;
  lastEntryTimestamp: Date | null;
}

export default AuditTrailEngine;
