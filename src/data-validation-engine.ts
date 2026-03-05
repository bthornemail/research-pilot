/**
 * Data Validation Engine
 * 
 * This module provides comprehensive data validation and integrity checking capabilities
 * for the CBDC research pilot, ensuring data consistency, accuracy, and regulatory compliance.
 */

import * as crypto from 'crypto';
import { CBDCUser, Transaction, TransactionStatus, UserType } from './research-pilot';

export interface ValidationConfig {
  enableCryptographicValidation: boolean;
  enableConsistencyChecks: boolean;
  enableRangeValidation: boolean;
  enableFormatValidation: boolean;
  enableBusinessRuleValidation: boolean;
  validationThresholds: ValidationThresholds;
  checksumAlgorithm: string;
  integrityCheckInterval: number; // milliseconds
}

export interface ValidationThresholds {
  maxTransactionAmount: number;
  minTransactionAmount: number;
  maxUserBalance: number;
  minUserBalance: number;
  maxProcessingTime: number;
  maxErrorRate: number;
  minSuccessRate: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  checksum: string;
  timestamp: Date;
  validationTime: number;
  integrityScore: number;
}

export interface ValidationError {
  id: string;
  type: ValidationErrorType;
  severity: ValidationSeverity;
  message: string;
  field?: string;
  value?: any;
  expectedValue?: any;
  timestamp: Date;
  context: any;
}

export interface ValidationWarning {
  id: string;
  type: ValidationWarningType;
  message: string;
  field?: string;
  value?: any;
  suggestion?: string;
  timestamp: Date;
  context: any;
}

export enum ValidationErrorType {
  FORMAT_ERROR = 'format_error',
  RANGE_ERROR = 'range_error',
  CONSISTENCY_ERROR = 'consistency_error',
  BUSINESS_RULE_ERROR = 'business_rule_error',
  INTEGRITY_ERROR = 'integrity_error',
  COMPLIANCE_ERROR = 'compliance_error',
  SCHEMA_ERROR = 'schema_error',
  CHECKSUM_ERROR = 'checksum_error'
}

export enum ValidationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ValidationWarningType {
  PERFORMANCE_WARNING = 'performance_warning',
  BEST_PRACTICE_WARNING = 'best_practice_warning',
  DEPRECATION_WARNING = 'deprecation_warning',
  SECURITY_WARNING = 'security_warning',
  COMPLIANCE_WARNING = 'compliance_warning'
}

export interface DataIntegrityReport {
  reportId: string;
  timestamp: Date;
  overallIntegrity: number;
  validationResults: ValidationResult[];
  summary: IntegritySummary;
  recommendations: string[];
  metadata: IntegrityMetadata;
}

export interface IntegritySummary {
  totalValidations: number;
  passedValidations: number;
  failedValidations: number;
  warningCount: number;
  errorCount: number;
  criticalErrorCount: number;
  averageIntegrityScore: number;
  dataConsistencyScore: number;
  businessRuleComplianceScore: number;
}

export interface IntegrityMetadata {
  validationDuration: number;
  dataSize: number;
  validationRules: string[];
  checksumAlgorithm: string;
  validationVersion: string;
  environment: string;
}

export interface ConsistencyCheck {
  checkId: string;
  name: string;
  description: string;
  checkFunction: (data: any) => Promise<ConsistencyResult>;
  severity: ValidationSeverity;
  enabled: boolean;
}

export interface ConsistencyResult {
  passed: boolean;
  message: string;
  details: any;
  timestamp: Date;
}

export class DataValidationEngine {
  private config: ValidationConfig;
  private consistencyChecks: Map<string, ConsistencyCheck> = new Map();
  private validationHistory: ValidationResult[] = [];
  private integrityMetrics: IntegrityMetrics;

  constructor(config: ValidationConfig) {
    this.config = config;
    this.integrityMetrics = new IntegrityMetrics();
    this.initializeConsistencyChecks();
  }

  /**
   * Validate transaction data
   */
  async validateTransaction(transaction: Transaction): Promise<ValidationResult> {
    const startTime = Date.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Format validation
    await this.validateTransactionFormat(transaction, errors, warnings);

    // Range validation
    await this.validateTransactionRanges(transaction, errors, warnings);

    // Business rule validation
    await this.validateTransactionBusinessRules(transaction, errors, warnings);

    // Consistency validation
    await this.validateTransactionConsistency(transaction, errors, warnings);

    // Generate checksum
    const checksum = this.generateChecksum(transaction);

    const validationTime = Date.now() - startTime;
    const integrityScore = this.calculateIntegrityScore(errors, warnings);

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      checksum,
      timestamp: new Date(),
      validationTime,
      integrityScore
    };

    this.validationHistory.push(result);
    this.integrityMetrics.recordValidation(result);

    return result;
  }

  /**
   * Validate user data
   */
  async validateUser(user: CBDCUser): Promise<ValidationResult> {
    const startTime = Date.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Format validation
    await this.validateUserFormat(user, errors, warnings);

    // Range validation
    await this.validateUserRanges(user, errors, warnings);

    // Business rule validation
    await this.validateUserBusinessRules(user, errors, warnings);

    // Consistency validation
    await this.validateUserConsistency(user, errors, warnings);

    // Generate checksum
    const checksum = this.generateChecksum(user);

    const validationTime = Date.now() - startTime;
    const integrityScore = this.calculateIntegrityScore(errors, warnings);

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      checksum,
      timestamp: new Date(),
      validationTime,
      integrityScore
    };

    this.validationHistory.push(result);
    this.integrityMetrics.recordValidation(result);

    return result;
  }

  /**
   * Validate data integrity across the system
   */
  async validateSystemIntegrity(
    users: CBDCUser[],
    transactions: Transaction[]
  ): Promise<DataIntegrityReport> {
    const startTime = Date.now();
    const validationResults: ValidationResult[] = [];

    // Validate all users
    for (const user of users) {
      const result = await this.validateUser(user);
      validationResults.push(result);
    }

    // Validate all transactions
    for (const transaction of transactions) {
      const result = await this.validateTransaction(transaction);
      validationResults.push(result);
    }

    // Run consistency checks
    await this.runConsistencyChecks(users, transactions, validationResults);

    // Calculate summary
    const summary = this.calculateIntegritySummary(validationResults);

    // Generate recommendations
    const recommendations = this.generateRecommendations(validationResults);

    const validationDuration = Date.now() - startTime;
    const dataSize = JSON.stringify({ users, transactions }).length;

    return {
      reportId: this.generateReportId(),
      timestamp: new Date(),
      overallIntegrity: summary.averageIntegrityScore,
      validationResults,
      summary,
      recommendations,
      metadata: {
        validationDuration,
        dataSize,
        validationRules: Array.from(this.consistencyChecks.keys()),
        checksumAlgorithm: this.config.checksumAlgorithm,
        validationVersion: '1.0.0',
        environment: 'research'
      }
    };
  }

  /**
   * Verify data integrity using checksums
   */
  async verifyDataIntegrity(data: any, expectedChecksum: string): Promise<boolean> {
    const actualChecksum = this.generateChecksum(data);
    return actualChecksum === expectedChecksum;
  }

  /**
   * Get validation statistics
   */
  getValidationStatistics(): ValidationStatistics {
    const totalValidations = this.validationHistory.length;
    const passedValidations = this.validationHistory.filter(v => v.isValid).length;
    const failedValidations = totalValidations - passedValidations;

    const errorCounts = this.validationHistory.reduce((acc, result) => {
      acc.total += result.errors.length;
      acc.critical += result.errors.filter(e => e.severity === ValidationSeverity.CRITICAL).length;
      acc.high += result.errors.filter(e => e.severity === ValidationSeverity.HIGH).length;
      acc.medium += result.errors.filter(e => e.severity === ValidationSeverity.MEDIUM).length;
      acc.low += result.errors.filter(e => e.severity === ValidationSeverity.LOW).length;
      return acc;
    }, { total: 0, critical: 0, high: 0, medium: 0, low: 0 });

    const warningCount = this.validationHistory.reduce((sum, result) => sum + result.warnings.length, 0);

    const averageIntegrityScore = totalValidations > 0 ?
      this.validationHistory.reduce((sum, result) => sum + result.integrityScore, 0) / totalValidations : 1;

    const averageValidationTime = totalValidations > 0 ?
      this.validationHistory.reduce((sum, result) => sum + result.validationTime, 0) / totalValidations : 0;

    return {
      totalValidations,
      passedValidations,
      failedValidations,
      errorCounts,
      warningCount,
      averageIntegrityScore,
      averageValidationTime,
      integrityTrend: this.calculateIntegrityTrend(),
      lastValidation: this.validationHistory.length > 0 ? this.validationHistory[this.validationHistory.length - 1]?.timestamp || null : null
    };
  }

  // Private helper methods

  private async validateTransactionFormat(
    transaction: Transaction,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate required fields
    if (!transaction.id || typeof transaction.id !== 'string') {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'Transaction ID is required and must be a string',
        'id',
        transaction.id
      ));
    }

    if (!transaction.from || typeof transaction.from !== 'string') {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'Transaction from field is required and must be a string',
        'from',
        transaction.from
      ));
    }

    if (!transaction.to || typeof transaction.to !== 'string') {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'Transaction to field is required and must be a string',
        'to',
        transaction.to
      ));
    }

    if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'Transaction amount must be a valid number',
        'amount',
        transaction.amount
      ));
    }

    if (!transaction.timestamp || !(transaction.timestamp instanceof Date)) {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'Transaction timestamp must be a valid Date object',
        'timestamp',
        transaction.timestamp
      ));
    }

    // Validate ID format
    if (transaction.id && !transaction.id.match(/^tx_\d+_[a-f0-9]+$/)) {
      warnings.push(this.createWarning(
        ValidationWarningType.BEST_PRACTICE_WARNING,
        'Transaction ID format does not follow recommended pattern',
        'id',
        transaction.id,
        'Use format: tx_{timestamp}_{random_hex}'
      ));
    }
  }

  private async validateTransactionRanges(
    transaction: Transaction,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate amount range
    if (transaction.amount < this.config.validationThresholds.minTransactionAmount) {
      errors.push(this.createError(
        ValidationErrorType.RANGE_ERROR,
        ValidationSeverity.MEDIUM,
        `Transaction amount below minimum threshold: ${this.config.validationThresholds.minTransactionAmount}`,
        'amount',
        transaction.amount,
        this.config.validationThresholds.minTransactionAmount
      ));
    }

    if (transaction.amount > this.config.validationThresholds.maxTransactionAmount) {
      errors.push(this.createError(
        ValidationErrorType.RANGE_ERROR,
        ValidationSeverity.HIGH,
        `Transaction amount exceeds maximum threshold: ${this.config.validationThresholds.maxTransactionAmount}`,
        'amount',
        transaction.amount,
        this.config.validationThresholds.maxTransactionAmount
      ));
    }

    // Validate fees
    if (transaction.fees < 0) {
      errors.push(this.createError(
        ValidationErrorType.RANGE_ERROR,
        ValidationSeverity.MEDIUM,
        'Transaction fees cannot be negative',
        'fees',
        transaction.fees,
        0
      ));
    }

    if (transaction.fees > transaction.amount) {
      errors.push(this.createError(
        ValidationErrorType.RANGE_ERROR,
        ValidationSeverity.HIGH,
        'Transaction fees cannot exceed transaction amount',
        'fees',
        transaction.fees,
        transaction.amount
      ));
    }
  }

  private async validateTransactionBusinessRules(
    transaction: Transaction,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate self-transaction
    if (transaction.from === transaction.to) {
      errors.push(this.createError(
        ValidationErrorType.BUSINESS_RULE_ERROR,
        ValidationSeverity.MEDIUM,
        'Transaction cannot be from and to the same user',
        'from/to',
        { from: transaction.from, to: transaction.to }
      ));
    }

    // Validate future timestamp
    if (transaction.timestamp && transaction.timestamp > new Date()) {
      warnings.push(this.createWarning(
        ValidationWarningType.BEST_PRACTICE_WARNING,
        'Transaction timestamp is in the future',
        'timestamp',
        transaction.timestamp,
        'Consider using current timestamp'
      ));
    }

    // Validate very old timestamp
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    if (transaction.timestamp && transaction.timestamp < oneYearAgo) {
      warnings.push(this.createWarning(
        ValidationWarningType.BEST_PRACTICE_WARNING,
        'Transaction timestamp is more than one year old',
        'timestamp',
        transaction.timestamp,
        'Verify timestamp accuracy'
      ));
    }
  }

  private async validateTransactionConsistency(
    transaction: Transaction,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate status consistency
    if (transaction.status === TransactionStatus.COMPLETED && !transaction.utlTransactionId) {
      warnings.push(this.createWarning(
        ValidationWarningType.COMPLIANCE_WARNING,
        'Completed transaction missing UTL transaction ID',
        'utlTransactionId',
        transaction.utlTransactionId,
        'UTL transaction ID should be present for completed transactions'
      ));
    }

    // Validate compliance check consistency
    if (transaction.complianceCheck && !transaction.complianceCheck.approved && 
        transaction.status === TransactionStatus.COMPLETED) {
      errors.push(this.createError(
        ValidationErrorType.CONSISTENCY_ERROR,
        ValidationSeverity.HIGH,
        'Transaction completed despite failed compliance check',
        'status',
        transaction.status,
        TransactionStatus.COMPLIANCE_HOLD
      ));
    }
  }

  private async validateUserFormat(
    user: CBDCUser,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate required fields
    if (!user.id || typeof user.id !== 'string') {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'User ID is required and must be a string',
        'id',
        user.id
      ));
    }

    if (!user.userType || !Object.values(UserType).includes(user.userType)) {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'User type must be a valid UserType enum value',
        'userType',
        user.userType
      ));
    }

    if (!user.economicProfile || typeof user.economicProfile !== 'object') {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'User economic profile is required',
        'economicProfile',
        user.economicProfile
      ));
    }

    if (!user.wallet || typeof user.wallet !== 'object') {
      errors.push(this.createError(
        ValidationErrorType.FORMAT_ERROR,
        ValidationSeverity.CRITICAL,
        'User wallet is required',
        'wallet',
        user.wallet
      ));
    }
  }

  private async validateUserRanges(
    user: CBDCUser,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate economic profile ranges
    if (user.economicProfile) {
      if (user.economicProfile.income < 0) {
        errors.push(this.createError(
          ValidationErrorType.RANGE_ERROR,
          ValidationSeverity.MEDIUM,
          'User income cannot be negative',
          'economicProfile.income',
          user.economicProfile.income,
          0
        ));
      }

      if (user.economicProfile.income > 1000000000) { // 1 billion
        warnings.push(this.createWarning(
          ValidationWarningType.BEST_PRACTICE_WARNING,
          'User income is unusually high',
          'economicProfile.income',
          user.economicProfile.income,
          'Verify income amount accuracy'
        ));
      }

      if (user.economicProfile.riskTolerance < 0 || user.economicProfile.riskTolerance > 1) {
        errors.push(this.createError(
          ValidationErrorType.RANGE_ERROR,
          ValidationSeverity.MEDIUM,
          'Risk tolerance must be between 0 and 1',
          'economicProfile.riskTolerance',
          user.economicProfile.riskTolerance,
          '0-1'
        ));
      }
    }

    // Validate wallet ranges
    if (user.wallet) {
      if (user.wallet.balance < this.config.validationThresholds.minUserBalance) {
        errors.push(this.createError(
          ValidationErrorType.RANGE_ERROR,
          ValidationSeverity.MEDIUM,
          `User balance below minimum threshold: ${this.config.validationThresholds.minUserBalance}`,
          'wallet.balance',
          user.wallet.balance,
          this.config.validationThresholds.minUserBalance
        ));
      }

      if (user.wallet.balance > this.config.validationThresholds.maxUserBalance) {
        warnings.push(this.createWarning(
          ValidationWarningType.BEST_PRACTICE_WARNING,
          'User balance is unusually high',
          'wallet.balance',
          user.wallet.balance,
          'Verify balance amount accuracy'
        ));
      }
    }
  }

  private async validateUserBusinessRules(
    user: CBDCUser,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate economic profile consistency
    if (user.economicProfile) {
      const totalAllocation = user.economicProfile.expenses + user.economicProfile.savings + user.economicProfile.debt;
      const income = user.economicProfile.income;

      if (totalAllocation > income * 1.1) { // Allow 10% tolerance
        warnings.push(this.createWarning(
          ValidationWarningType.BEST_PRACTICE_WARNING,
          'User expenses + savings + debt exceeds income significantly',
          'economicProfile',
          { expenses: user.economicProfile.expenses, savings: user.economicProfile.savings, debt: user.economicProfile.debt, income },
          'Verify economic profile accuracy'
        ));
      }
    }

    // Validate asabiyyah score range
    if (user.asabiyyahScore < 0 || user.asabiyyahScore > 1) {
      errors.push(this.createError(
        ValidationErrorType.RANGE_ERROR,
        ValidationSeverity.MEDIUM,
        'Asabiyyah score must be between 0 and 1',
        'asabiyyahScore',
        user.asabiyyahScore,
        '0-1'
      ));
    }
  }

  private async validateUserConsistency(
    user: CBDCUser,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate last activity consistency
    if (user.lastActivity && user.lastActivity > new Date()) {
      warnings.push(this.createWarning(
        ValidationWarningType.BEST_PRACTICE_WARNING,
        'User last activity is in the future',
        'lastActivity',
        user.lastActivity,
        'Consider using current timestamp'
      ));
    }

    // Validate transaction history consistency
    if (user.transactionHistory && user.transactionHistory.length > 0) {
      const invalidTransactions = user.transactionHistory.filter(tx => 
        !tx.id || !tx.amount || tx.amount <= 0
      );

      if (invalidTransactions.length > 0) {
        errors.push(this.createError(
          ValidationErrorType.CONSISTENCY_ERROR,
          ValidationSeverity.MEDIUM,
          `User has ${invalidTransactions.length} invalid transactions in history`,
          'transactionHistory',
          invalidTransactions.length
        ));
      }
    }
  }

  private async runConsistencyChecks(
    users: CBDCUser[],
    transactions: Transaction[],
    validationResults: ValidationResult[]
  ): Promise<void> {
    for (const [checkId, check] of this.consistencyChecks) {
      if (check.enabled) {
        try {
          const result = await check.checkFunction({ users, transactions });
          if (!result.passed) {
            const error = this.createError(
              ValidationErrorType.CONSISTENCY_ERROR,
              check.severity,
              result.message,
              checkId,
              result.details
            );
            
            // Add error to the most recent validation result
            if (validationResults.length > 0) {
              const lastResult = validationResults[validationResults.length - 1];
              if (lastResult) {
                lastResult.errors.push(error);
              }
            }
          }
        } catch (error) {
          console.error(`Consistency check ${checkId} failed:`, error);
        }
      }
    }
  }

  private initializeConsistencyChecks(): void {
    // Balance consistency check
    this.consistencyChecks.set('balance_consistency', {
      checkId: 'balance_consistency',
      name: 'Balance Consistency Check',
      description: 'Verify that user balances are consistent with transaction history',
      checkFunction: async (data: any) => {
        const { users, transactions } = data;
        let inconsistencies = 0;

        for (const user of users) {
          const userTransactions = transactions.filter((tx: Transaction) => 
            tx.from === user.id || tx.to === user.id
          );

          let calculatedBalance = user.wallet.balance;
          for (const tx of userTransactions) {
            if (tx.from === user.id) {
              calculatedBalance += tx.amount + tx.fees;
            }
            if (tx.to === user.id) {
              calculatedBalance -= tx.amount;
            }
          }

          if (Math.abs(calculatedBalance - user.wallet.balance) > 0.01) {
            inconsistencies++;
          }
        }

        return {
          passed: inconsistencies === 0,
          message: inconsistencies > 0 ? `Found ${inconsistencies} balance inconsistencies` : 'All balances are consistent',
          details: { inconsistencies },
          timestamp: new Date()
        };
      },
      severity: ValidationSeverity.HIGH,
      enabled: true
    });

    // Transaction reference consistency check
    this.consistencyChecks.set('transaction_references', {
      checkId: 'transaction_references',
      name: 'Transaction Reference Consistency Check',
      description: 'Verify that all transaction references point to valid users',
      checkFunction: async (data: any) => {
        const { users, transactions } = data;
        const userIds = new Set(users.map((u: CBDCUser) => u.id));
        let invalidReferences = 0;

        for (const tx of transactions) {
          if (!userIds.has(tx.from) || !userIds.has(tx.to)) {
            invalidReferences++;
          }
        }

        return {
          passed: invalidReferences === 0,
          message: invalidReferences > 0 ? `Found ${invalidReferences} invalid transaction references` : 'All transaction references are valid',
          details: { invalidReferences },
          timestamp: new Date()
        };
      },
      severity: ValidationSeverity.CRITICAL,
      enabled: true
    });
  }

  private createError(
    type: ValidationErrorType,
    severity: ValidationSeverity,
    message: string,
    field?: string,
    value?: any,
    expectedValue?: any
  ): ValidationError {
    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      type,
      severity,
      message,
      ...(field && { field }),
      value,
      expectedValue,
      timestamp: new Date(),
      context: {}
    };
  }

  private createWarning(
    type: ValidationWarningType,
    message: string,
    field?: string,
    value?: any,
    suggestion?: string
  ): ValidationWarning {
    return {
      id: `warning_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      type,
      message,
      ...(field && { field }),
      value,
      ...(suggestion && { suggestion }),
      timestamp: new Date(),
      context: {}
    };
  }

  private generateChecksum(data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash(this.config.checksumAlgorithm).update(dataString).digest('hex');
  }

  private calculateIntegrityScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 1.0;

    // Deduct points for errors
    for (const error of errors) {
      switch (error.severity) {
        case ValidationSeverity.CRITICAL:
          score -= 0.3;
          break;
        case ValidationSeverity.HIGH:
          score -= 0.2;
          break;
        case ValidationSeverity.MEDIUM:
          score -= 0.1;
          break;
        case ValidationSeverity.LOW:
          score -= 0.05;
          break;
      }
    }

    // Deduct points for warnings
    score -= warnings.length * 0.01;

    return Math.max(0, score);
  }

  private calculateIntegritySummary(validationResults: ValidationResult[]): IntegritySummary {
    const totalValidations = validationResults.length;
    const passedValidations = validationResults.filter(v => v.isValid).length;
    const failedValidations = totalValidations - passedValidations;

    const errorCount = validationResults.reduce((sum, result) => sum + result.errors.length, 0);
    const criticalErrorCount = validationResults.reduce((sum, result) => 
      sum + result.errors.filter(e => e.severity === ValidationSeverity.CRITICAL).length, 0
    );
    const warningCount = validationResults.reduce((sum, result) => sum + result.warnings.length, 0);

    const averageIntegrityScore = totalValidations > 0 ?
      validationResults.reduce((sum, result) => sum + result.integrityScore, 0) / totalValidations : 1;

    return {
      totalValidations,
      passedValidations,
      failedValidations,
      warningCount,
      errorCount,
      criticalErrorCount,
      averageIntegrityScore,
      dataConsistencyScore: this.calculateDataConsistencyScore(validationResults),
      businessRuleComplianceScore: this.calculateBusinessRuleComplianceScore(validationResults)
    };
  }

  private calculateDataConsistencyScore(validationResults: ValidationResult[]): number {
    const consistencyErrors = validationResults.reduce((sum, result) => 
      sum + result.errors.filter(e => e.type === ValidationErrorType.CONSISTENCY_ERROR).length, 0
    );
    const totalErrors = validationResults.reduce((sum, result) => sum + result.errors.length, 0);
    
    return totalErrors > 0 ? Math.max(0, 1 - (consistencyErrors / totalErrors)) : 1;
  }

  private calculateBusinessRuleComplianceScore(validationResults: ValidationResult[]): number {
    const businessRuleErrors = validationResults.reduce((sum, result) => 
      sum + result.errors.filter(e => e.type === ValidationErrorType.BUSINESS_RULE_ERROR).length, 0
    );
    const totalErrors = validationResults.reduce((sum, result) => sum + result.errors.length, 0);
    
    return totalErrors > 0 ? Math.max(0, 1 - (businessRuleErrors / totalErrors)) : 1;
  }

  private generateRecommendations(validationResults: ValidationResult[]): string[] {
    const recommendations: string[] = [];
    
    const criticalErrors = validationResults.reduce((sum, result) => 
      sum + result.errors.filter(e => e.severity === ValidationSeverity.CRITICAL).length, 0
    );
    
    if (criticalErrors > 0) {
      recommendations.push('Address critical validation errors immediately');
    }

    const consistencyErrors = validationResults.reduce((sum, result) => 
      sum + result.errors.filter(e => e.type === ValidationErrorType.CONSISTENCY_ERROR).length, 0
    );
    
    if (consistencyErrors > 0) {
      recommendations.push('Review and fix data consistency issues');
    }

    const formatErrors = validationResults.reduce((sum, result) => 
      sum + result.errors.filter(e => e.type === ValidationErrorType.FORMAT_ERROR).length, 0
    );
    
    if (formatErrors > 0) {
      recommendations.push('Implement stricter data format validation');
    }

    return recommendations;
  }

  private generateReportId(): string {
    return `integrity_report_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private calculateIntegrityTrend(): 'improving' | 'declining' | 'stable' {
    if (this.validationHistory.length < 2) return 'stable';
    
    const recent = this.validationHistory.slice(-10);
    const older = this.validationHistory.slice(-20, -10);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, r) => sum + r.integrityScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.integrityScore, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.05) return 'improving';
    if (diff < -0.05) return 'declining';
    return 'stable';
  }
}

// Supporting classes
class IntegrityMetrics {
  private validations: ValidationResult[] = [];

  recordValidation(result: ValidationResult): void {
    this.validations.push(result);
    
    // Keep only last 1000 validations
    if (this.validations.length > 1000) {
      this.validations = this.validations.slice(-1000);
    }
  }

  getAverageIntegrityScore(): number {
    if (this.validations.length === 0) return 1;
    return this.validations.reduce((sum, v) => sum + v.integrityScore, 0) / this.validations.length;
  }

  getValidationTrend(): 'improving' | 'declining' | 'stable' {
    if (this.validations.length < 10) return 'stable';
    
    const recent = this.validations.slice(-5);
    const older = this.validations.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, v) => sum + v.integrityScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + v.integrityScore, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.05) return 'improving';
    if (diff < -0.05) return 'declining';
    return 'stable';
  }
}

// Supporting interfaces
export interface ValidationStatistics {
  totalValidations: number;
  passedValidations: number;
  failedValidations: number;
  errorCounts: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  warningCount: number;
  averageIntegrityScore: number;
  averageValidationTime: number;
  integrityTrend: 'improving' | 'declining' | 'stable';
  lastValidation: Date | null;
}

export default DataValidationEngine;
