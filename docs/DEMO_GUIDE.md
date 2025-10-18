# CBDC Research Pilot Demo Guide

## Quick Start

### 1. Install Dependencies
```bash
cd demos/cbdc-research-pilot
npm install
```

### 2. Run Basic Demo
```bash
npm run demo:basic
```

### 3. Run Large Scale Demo
```bash
npm run demo:large
```

### 4. Run Stress Test
```bash
npm run demo:stress
```

## Demo Scenarios

### Basic Demo (1,000 users)
- **Duration**: 5 minutes
- **Users**: 1,000 simulated users
- **Transactions**: ~10,000 transactions
- **Purpose**: Quick validation and testing

### Large Scale Demo (100,000 users)
- **Duration**: 30 minutes
- **Users**: 100,000 simulated users
- **Transactions**: ~1,000,000 transactions
- **Purpose**: Full-scale research simulation

### Stress Test Demo (1,000,000 users)
- **Duration**: 60 minutes
- **Users**: 1,000,000 simulated users
- **Transactions**: ~10,000,000 transactions
- **Purpose**: System limits and performance testing

### Economic Shock Demo
- **Duration**: 45 minutes
- **Users**: 100,000 simulated users
- **Scenario**: Economic crisis simulation
- **Purpose**: Stress testing under extreme conditions
- **Note**: This scenario is not fully implemented. It currently runs the same simulation as the "Large Scale Demo".

## Understanding the Output

### Real-time Metrics
- **TPS**: Transactions per second
- **Latency**: Average transaction processing time
- **Throughput**: Total transactions processed
- **Active Users**: Currently active users
- **Queue Size**: Pending transactions

### Final Report
- **Performance Metrics**: TPS, latency, throughput
- **Economic Analysis**: Network effects
- **Compliance Report**: Regulatory compliance status (Note: currently a placeholder)
- **Recommendations**: System optimization suggestions

## Customization

### Modify User Behavior
Edit `research-pilot.ts` to adjust:
- Transaction frequency
- Transaction amounts
- User interaction patterns
- Economic behavior models

### Adjust Simulation Parameters
Edit `simulation-engine.ts` to modify:
- Simulation duration
- User count
- Transaction types
- Network topology

### Custom Analytics
Edit `analytics-engine.ts` to add:
- Custom metrics
- New analysis algorithms
- Additional reporting
- Performance optimizations

## Troubleshooting

### Common Issues

1. **Out of Memory**
   - Reduce user count
   - Increase system memory
   - Use streaming processing

2. **Slow Performance**
   - Check system resources
   - Reduce simulation complexity
   - Enable performance optimizations

3. **Test Failures**
   - Check dependencies
   - Verify system requirements
   - Review error logs

### Performance Tips

1. **Optimize System Resources**
   - Use SSD storage
   - Increase RAM
   - Enable multi-core processing

2. **Adjust Simulation Parameters**
   - Reduce transaction complexity
   - Limit user interactions
   - Use batch processing

3. **Monitor System Health**
   - Check CPU usage
   - Monitor memory consumption
   - Watch disk I/O

## Advanced Usage

### Custom Scenarios
Create custom demo scenarios by modifying the demo runner:

```typescript
// Custom scenario example
const customScenario = {
  name: 'Custom Economic Model',
  duration: 20 * 60 * 1000, // 20 minutes
  userCount: 50000,
  transactionTypes: ['payment', 'transfer', 'exchange'],
  economicModel: 'custom',
  parameters: {
    transactionFrequency: 0.1,
    averageAmount: 100,
    networkEffects: true
  }
};
```

### Integration with External Systems
The demo can be integrated with external systems:

```typescript
// External system integration
const externalIntegration = {
  dataSource: 'external-api',
  realTimeUpdates: true,
  customAnalytics: true,
  exportFormat: 'json'
};
```

### Research Extensions
Extend the demo for specific research needs:

```typescript
// Research extension example
const researchExtension = {
  focus: 'asabiyyah-analysis',
  metrics: ['cooperation', 'trust', 'network-effects'],
  reporting: 'detailed',
  export: 'research-format'
};
```

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review the documentation
3. Check system requirements
4. Contact the development team

## Contributing

To contribute to the demo:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
