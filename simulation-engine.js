/**
 * CBDC Simulation Engine
 *
 * This module provides the core simulation engine for the CBDC research pilot,
 * handling economic modeling, user behavior simulation, and system dynamics.
 */
import { UserType, TransactionType } from './research-pilot';
export var PolicyChangeType;
(function (PolicyChangeType) {
    PolicyChangeType["INTEREST_RATE"] = "interest_rate";
    PolicyChangeType["RESERVE_REQUIREMENT"] = "reserve_requirement";
    PolicyChangeType["MONEY_SUPPLY"] = "money_supply";
    PolicyChangeType["REGULATION"] = "regulation";
    PolicyChangeType["TAX_POLICY"] = "tax_policy";
    PolicyChangeType["FISCAL_POLICY"] = "fiscal_policy";
})(PolicyChangeType || (PolicyChangeType = {}));
export class CBDCSimulationEngine {
    constructor(config) {
        this.config = config;
        this.economicModel = config.economicModel;
        this.behaviorModel = config.behaviorModel;
        this.systemModel = config.systemModel;
        this.eventQueue = [];
        this.metrics = new SimulationMetrics();
        this.initializeState();
    }
    /**
     * Initialize simulation state
     */
    initializeState() {
        this.state = {
            currentTime: new Date(),
            day: 0,
            hour: 0,
            economicConditions: {
                gdp: 1000000, // Base GDP
                inflation: 0.02, // 2% inflation
                unemployment: 0.05, // 5% unemployment
                consumerConfidence: 0.7,
                businessConfidence: 0.6,
                economicGrowth: 0.03 // 3% growth
            },
            systemMetrics: {
                activeUsers: 0,
                totalTransactions: 0,
                transactionVolume: 0,
                averageLatency: 0,
                errorRate: 0,
                systemLoad: 0,
                networkCongestion: 0
            },
            userBehavior: {
                averageTransactionSize: 0,
                transactionFrequency: 0,
                spendingRate: 0,
                savingRate: 0,
                riskTolerance: 0,
                confidenceLevel: 0
            },
            transactionMetrics: {
                totalCount: 0,
                totalVolume: 0,
                averageSize: 0,
                successRate: 0,
                averageFees: 0,
                typeDistribution: {}
            }
        };
    }
    /**
     * Run the complete simulation
     */
    async runSimulation(users) {
        console.log('Starting CBDC simulation...');
        this.users = users;
        this.transactions = new Map();
        const startTime = Date.now();
        const totalSteps = this.config.duration * 24 / this.config.timeStep;
        for (let step = 0; step < totalSteps; step++) {
            await this.simulateStep();
            if (step % 100 === 0) {
                const progress = (step / totalSteps) * 100;
                console.log(`Simulation progress: ${progress.toFixed(1)}%`);
            }
        }
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Simulation completed in ${duration}ms`);
        return this.generateResults();
    }
    /**
     * Simulate a single time step
     */
    async simulateStep() {
        // Update economic conditions
        this.updateEconomicConditions();
        // Update user behavior based on economic conditions
        this.updateUserBehavior();
        // Generate transactions based on user behavior
        await this.generateTransactions();
        // Process system events
        this.processSystemEvents();
        // Update metrics
        this.updateMetrics();
        // Advance time
        this.advanceTime();
    }
    /**
     * Update economic conditions based on model
     */
    updateEconomicConditions() {
        const conditions = this.state.economicConditions;
        const model = this.economicModel;
        // Apply economic model updates
        conditions.gdp *= (1 + model.gdpGrowth / 365);
        conditions.inflation = Math.max(0, conditions.inflation + (model.inflationRate - conditions.inflation) * 0.01);
        conditions.unemployment = Math.max(0, Math.min(1, conditions.unemployment + (model.unemploymentRate - conditions.unemployment) * 0.01));
        conditions.consumerConfidence = Math.max(0, Math.min(1, conditions.consumerConfidence + (model.consumerConfidence - conditions.consumerConfidence) * 0.01));
        conditions.businessConfidence = Math.max(0, Math.min(1, conditions.businessConfidence + (model.businessConfidence - conditions.businessConfidence) * 0.01));
        conditions.economicGrowth = model.gdpGrowth;
        // Apply policy changes
        this.applyPolicyChanges();
        // Apply seasonal factors
        this.applySeasonalFactors();
    }
    /**
     * Apply policy changes to economic conditions
     */
    applyPolicyChanges() {
        const currentTime = this.state.currentTime;
        for (const policyChange of this.economicModel.policyChanges) {
            if (policyChange.timestamp <= currentTime) {
                const impact = policyChange.impact;
                // Apply policy impact to economic conditions
                this.state.economicConditions.consumerConfidence += impact.confidence * 0.1;
                this.state.economicConditions.businessConfidence += impact.confidence * 0.1;
                this.state.economicConditions.inflation += impact.inflation * 0.01;
                this.state.economicConditions.economicGrowth += impact.economicGrowth * 0.01;
                // Apply impact to user behavior
                this.behaviorModel.transactionProbability *= (1 + impact.userBehavior * 0.1);
                this.behaviorModel.spendingMultiplier *= (1 + impact.transactionVolume * 0.1);
            }
        }
    }
    /**
     * Apply seasonal factors to economic conditions
     */
    applySeasonalFactors() {
        const month = this.state.currentTime.getMonth();
        for (const factor of this.behaviorModel.seasonalFactors) {
            if (factor.month === month) {
                this.behaviorModel.transactionProbability *= factor.factor;
                this.behaviorModel.spendingMultiplier *= factor.factor;
            }
        }
    }
    /**
     * Update user behavior based on economic conditions
     */
    updateUserBehavior() {
        const conditions = this.state.economicConditions;
        const behavior = this.behaviorModel;
        // Update behavior based on economic conditions
        behavior.transactionProbability *= (1 + conditions.consumerConfidence * 0.1);
        behavior.spendingMultiplier *= (1 + conditions.consumerConfidence * 0.1);
        behavior.savingRate *= (1 + conditions.inflation * 0.1);
        behavior.riskTolerance *= (1 + conditions.businessConfidence * 0.1);
        // Update user behavior metrics
        this.state.userBehavior.averageTransactionSize *= behavior.spendingMultiplier;
        this.state.userBehavior.transactionFrequency = behavior.transactionProbability;
        this.state.userBehavior.spendingRate = behavior.spendingMultiplier;
        this.state.userBehavior.savingRate = behavior.savingRate;
        this.state.userBehavior.riskTolerance = behavior.riskTolerance;
        this.state.userBehavior.confidenceLevel = conditions.consumerConfidence;
    }
    /**
     * Generate transactions based on user behavior
     */
    async generateTransactions() {
        const users = Array.from(this.users.values());
        const activeUsers = users.filter(user => this.isUserActive(user));
        this.state.systemMetrics.activeUsers = activeUsers.length;
        // Calculate expected transactions for this time step
        const expectedTransactions = Math.floor(activeUsers.length *
            this.behaviorModel.transactionProbability *
            (this.config.timeStep / 24));
        // Generate transactions
        for (let i = 0; i < expectedTransactions; i++) {
            const transaction = this.generateTransaction(activeUsers);
            if (transaction) {
                this.transactions.set(transaction.id, transaction);
                this.state.transactionMetrics.totalCount++;
                this.state.transactionMetrics.totalVolume += transaction.amount;
            }
        }
        // Update transaction metrics
        this.updateTransactionMetrics();
    }
    /**
     * Generate a single transaction
     */
    generateTransaction(activeUsers) {
        if (activeUsers.length < 2)
            return null;
        const fromUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        const toUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        if (fromUser?.id === toUser?.id)
            return null;
        const amount = this.calculateTransactionAmount(fromUser);
        const type = this.determineTransactionType(fromUser, toUser);
        const transaction = {
            id: `sim_tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            from: fromUser.id,
            to: toUser.id,
            amount,
            currency: 'CBDC',
            type,
            timestamp: new Date(this.state.currentTime),
            status: this.determineTransactionStatus(),
            fees: this.calculateFees(amount, type),
            metadata: {
                description: `Simulated ${type} transaction`,
                category: type.toString(),
                location: fromUser.location
            },
            complianceCheck: {
                amlCheck: true,
                sanctionsCheck: true,
                riskAssessment: Math.random(),
                flags: [],
                approved: true
            }
        };
        return transaction;
    }
    /**
     * Calculate transaction amount based on user profile and behavior
     */
    calculateTransactionAmount(user) {
        const baseAmount = user.behaviorModel.averageTransactionSize;
        const behaviorMultiplier = this.behaviorModel.spendingMultiplier;
        const economicMultiplier = 1 + this.state.economicConditions.consumerConfidence * 0.2;
        const variation = 0.5; // 50% variation
        return baseAmount * behaviorMultiplier * economicMultiplier * (1 + (Math.random() - 0.5) * variation);
    }
    /**
     * Determine transaction type based on users
     */
    determineTransactionType(fromUser, toUser) {
        const typeProbabilities = {
            [UserType.INDIVIDUAL]: {
                [UserType.INDIVIDUAL]: TransactionType.TRANSFER,
                [UserType.MERCHANT]: TransactionType.MERCHANT_PAYMENT,
                [UserType.BUSINESS]: TransactionType.PAYMENT
            },
            [UserType.BUSINESS]: {
                [UserType.INDIVIDUAL]: TransactionType.PAYMENT,
                [UserType.BUSINESS]: TransactionType.TRANSFER,
                [UserType.MERCHANT]: TransactionType.MERCHANT_PAYMENT
            },
            [UserType.MERCHANT]: {
                [UserType.INDIVIDUAL]: TransactionType.REFUND,
                [UserType.BUSINESS]: TransactionType.PAYMENT
            }
        };
        const probabilities = typeProbabilities[fromUser.userType]?.[toUser.userType];
        if (probabilities) {
            return probabilities;
        }
        return TransactionType.TRANSFER;
    }
    /**
     * Determine transaction status based on system conditions
     */
    determineTransactionStatus() {
        const errorRate = this.state.systemMetrics.errorRate;
        const systemLoad = this.state.systemMetrics.systemLoad;
        if (Math.random() < errorRate) {
            return 'failed';
        }
        else if (systemLoad > 0.8 && Math.random() < 0.1) {
            return 'pending';
        }
        else {
            return 'completed';
        }
    }
    /**
     * Calculate transaction fees
     */
    calculateFees(amount, type) {
        const feeRates = {
            [TransactionType.PAYMENT]: 0.001,
            [TransactionType.TRANSFER]: 0.0005,
            [TransactionType.DEPOSIT]: 0,
            [TransactionType.WITHDRAWAL]: 0.002,
            [TransactionType.REFUND]: 0,
            [TransactionType.INTEREST_PAYMENT]: 0,
            [TransactionType.GOVERNMENT_TRANSFER]: 0,
            [TransactionType.MERCHANT_PAYMENT]: 0.0015
        };
        return amount * (feeRates[type] || 0.001);
    }
    /**
     * Check if user is active
     */
    isUserActive(user) {
        const hoursSinceLastActivity = (this.state.currentTime.getTime() - user.lastActivity.getTime()) / (1000 * 60 * 60);
        const activityThreshold = 24; // 24 hours
        return hoursSinceLastActivity < activityThreshold;
    }
    /**
     * Update transaction metrics
     */
    updateTransactionMetrics() {
        const transactions = Array.from(this.transactions.values());
        if (transactions.length === 0)
            return;
        this.state.transactionMetrics.averageSize = this.state.transactionMetrics.totalVolume / this.state.transactionMetrics.totalCount;
        this.state.transactionMetrics.successRate = transactions.filter(tx => tx.status === 'completed').length / transactions.length;
        this.state.transactionMetrics.averageFees = transactions.reduce((sum, tx) => sum + tx.fees, 0) / transactions.length;
        // Update type distribution
        const typeDistribution = {};
        for (const tx of transactions) {
            typeDistribution[tx.type] = (typeDistribution[tx.type] || 0) + 1;
        }
        this.state.transactionMetrics.typeDistribution = typeDistribution;
    }
    /**
     * Process system events
     */
    processSystemEvents() {
        // Check for maintenance windows
        this.checkMaintenanceWindows();
        // Process event queue
        this.processEventQueue();
        // Update system metrics
        this.updateSystemMetrics();
    }
    /**
     * Check for maintenance windows
     */
    checkMaintenanceWindows() {
        const currentTime = this.state.currentTime;
        for (const window of this.systemModel.maintenanceWindows) {
            if (currentTime >= window.startTime && currentTime <= window.endTime) {
                this.state.systemMetrics.systemLoad += window.impact * 0.1;
                this.state.systemMetrics.errorRate += window.impact * 0.05;
            }
        }
    }
    /**
     * Process event queue
     */
    processEventQueue() {
        const currentTime = this.state.currentTime;
        const eventsToProcess = this.eventQueue.filter(event => event.timestamp <= currentTime);
        for (const event of eventsToProcess) {
            this.processEvent(event);
        }
        // Remove processed events
        this.eventQueue = this.eventQueue.filter(event => event.timestamp > currentTime);
    }
    /**
     * Process a single event
     */
    processEvent(event) {
        switch (event.type) {
            case 'economic_shock':
                this.handleEconomicShock(event);
                break;
            case 'system_failure':
                this.handleSystemFailure(event);
                break;
            case 'policy_change':
                this.handlePolicyChange(event);
                break;
            case 'user_behavior_change':
                this.handleUserBehaviorChange(event);
                break;
        }
    }
    /**
     * Handle economic shock event
     */
    handleEconomicShock(event) {
        const shock = event.data;
        this.state.economicConditions.consumerConfidence += shock.confidenceImpact;
        this.state.economicConditions.businessConfidence += shock.confidenceImpact;
        this.state.economicConditions.inflation += shock.inflationImpact;
        this.state.economicConditions.unemployment += shock.unemploymentImpact;
        // Clamp values to valid ranges
        this.state.economicConditions.consumerConfidence = Math.max(0, Math.min(1, this.state.economicConditions.consumerConfidence));
        this.state.economicConditions.businessConfidence = Math.max(0, Math.min(1, this.state.economicConditions.businessConfidence));
        this.state.economicConditions.inflation = Math.max(0, this.state.economicConditions.inflation);
        this.state.economicConditions.unemployment = Math.max(0, Math.min(1, this.state.economicConditions.unemployment));
    }
    /**
     * Handle system failure event
     */
    handleSystemFailure(event) {
        const failure = event.data;
        this.state.systemMetrics.errorRate += failure.errorRateIncrease;
        this.state.systemMetrics.systemLoad += failure.loadIncrease;
        this.state.systemMetrics.networkCongestion += failure.congestionIncrease;
    }
    /**
     * Handle policy change event
     */
    handlePolicyChange(event) {
        const policyChange = event.data;
        this.economicModel.policyChanges.push(policyChange);
    }
    /**
     * Handle user behavior change event
     */
    handleUserBehaviorChange(event) {
        const behaviorChange = event.data;
        this.behaviorModel.transactionProbability *= behaviorChange.transactionProbabilityMultiplier;
        this.behaviorModel.spendingMultiplier *= behaviorChange.spendingMultiplier;
        this.behaviorModel.savingRate *= behaviorChange.savingRateMultiplier;
        this.behaviorModel.riskTolerance *= behaviorChange.riskToleranceMultiplier;
    }
    /**
     * Update system metrics
     */
    updateSystemMetrics() {
        const transactions = Array.from(this.transactions.values());
        const recentTransactions = transactions.filter(tx => (this.state.currentTime.getTime() - tx.timestamp.getTime()) < 3600000 // Last hour
        );
        this.state.systemMetrics.totalTransactions = transactions.length;
        this.state.systemMetrics.transactionVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        this.state.systemMetrics.averageLatency = this.calculateAverageLatency(recentTransactions);
        this.state.systemMetrics.errorRate = this.calculateErrorRate(recentTransactions);
        this.state.systemMetrics.systemLoad = this.calculateSystemLoad();
        this.state.systemMetrics.networkCongestion = this.calculateNetworkCongestion();
    }
    /**
     * Calculate average latency
     */
    calculateAverageLatency(transactions) {
        if (transactions.length === 0)
            return 0;
        // Simulate latency based on system load and network congestion
        const baseLatency = 100; // 100ms base latency
        const loadFactor = this.state.systemMetrics.systemLoad;
        const congestionFactor = this.state.systemMetrics.networkCongestion;
        return baseLatency * (1 + loadFactor + congestionFactor);
    }
    /**
     * Calculate error rate
     */
    calculateErrorRate(transactions) {
        if (transactions.length === 0)
            return 0;
        const failedTransactions = transactions.filter(tx => tx.status === 'failed').length;
        return failedTransactions / transactions.length;
    }
    /**
     * Calculate system load
     */
    calculateSystemLoad() {
        const baseLoad = 0.3; // 30% base load
        const transactionLoad = Math.min(0.5, this.state.transactionMetrics.totalCount / 1000000); // Scale with transaction count
        const maintenanceLoad = this.getMaintenanceLoad();
        return Math.min(1, baseLoad + transactionLoad + maintenanceLoad);
    }
    /**
     * Calculate network congestion
     */
    calculateNetworkCongestion() {
        const baseCongestion = 0.1; // 10% base congestion
        const transactionCongestion = Math.min(0.4, this.state.transactionMetrics.totalCount / 2000000); // Scale with transaction count
        const maintenanceCongestion = this.getMaintenanceLoad() * 0.5;
        return Math.min(1, baseCongestion + transactionCongestion + maintenanceCongestion);
    }
    /**
     * Get maintenance load
     */
    getMaintenanceLoad() {
        const currentTime = this.state.currentTime;
        let maintenanceLoad = 0;
        for (const window of this.systemModel.maintenanceWindows) {
            if (currentTime >= window.startTime && currentTime <= window.endTime) {
                maintenanceLoad += window.impact;
            }
        }
        return Math.min(1, maintenanceLoad);
    }
    /**
     * Update metrics
     */
    updateMetrics() {
        this.metrics.recordState(this.state);
    }
    /**
     * Advance simulation time
     */
    advanceTime() {
        const timeStepMs = this.config.timeStep * 60 * 60 * 1000; // Convert hours to milliseconds
        this.state.currentTime = new Date(this.state.currentTime.getTime() + timeStepMs);
        this.state.hour += this.config.timeStep;
        if (this.state.hour >= 24) {
            this.state.hour = 0;
            this.state.day++;
        }
    }
    /**
     * Generate simulation results
     */
    generateResults() {
        return {
            duration: this.config.duration,
            totalUsers: this.users.size,
            totalTransactions: this.transactions.size,
            totalVolume: Array.from(this.transactions.values()).reduce((sum, tx) => sum + tx.amount, 0),
            averageTransactionSize: this.state.transactionMetrics.averageSize,
            successRate: this.state.transactionMetrics.successRate,
            systemPerformance: this.state.systemMetrics,
            economicImpact: this.calculateEconomicImpact(),
            userBehavior: this.state.userBehavior,
            transactionMetrics: this.state.transactionMetrics,
            detailedMetrics: this.metrics.getDetailedMetrics(),
            transactions: this.transactions
        };
    }
    /**
     * Calculate economic impact
     */
    calculateEconomicImpact() {
        const transactions = Array.from(this.transactions.values());
        const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const totalFees = transactions.reduce((sum, tx) => sum + tx.fees, 0);
        return {
            totalVolume,
            totalFees,
            averageTransactionSize: totalVolume / transactions.length,
            transactionCount: transactions.length,
            economicGrowth: this.state.economicConditions.economicGrowth,
            inflation: this.state.economicConditions.inflation,
            consumerConfidence: this.state.economicConditions.consumerConfidence,
            businessConfidence: this.state.economicConditions.businessConfidence
        };
    }
    /**
     * Add event to simulation
     */
    addEvent(event) {
        this.eventQueue.push(event);
    }
    /**
     * Get current simulation state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Get simulation metrics
     */
    getMetrics() {
        return this.metrics;
    }
}
export var EventType;
(function (EventType) {
    EventType["ECONOMIC_SHOCK"] = "economic_shock";
    EventType["SYSTEM_FAILURE"] = "system_failure";
    EventType["POLICY_CHANGE"] = "policy_change";
    EventType["USER_BEHAVIOR_CHANGE"] = "user_behavior_change";
})(EventType || (EventType = {}));
export class SimulationMetrics {
    constructor() {
        this.states = [];
        this.startTime = new Date();
    }
    recordState(state) {
        this.states.push({ ...state });
    }
    getDetailedMetrics() {
        return {
            states: this.states,
            duration: Date.now() - this.startTime.getTime(),
            totalStates: this.states.length
        };
    }
}
export default CBDCSimulationEngine;
