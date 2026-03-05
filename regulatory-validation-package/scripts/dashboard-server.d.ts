/**
 * Dashboard Server
 *
 * Simple HTTP server to serve the regulatory compliance dashboard
 */
export declare class DashboardServer {
    private server;
    private port;
    constructor(port?: number);
    /**
     * Start the dashboard server
     */
    start(): Promise<void>;
    /**
     * Stop the dashboard server
     */
    stop(): Promise<void>;
    /**
     * Handle HTTP requests
     */
    private handleRequest;
    /**
     * Serve the main dashboard
     */
    private serveDashboard;
    /**
     * Serve health check endpoint
     */
    private serveHealthCheck;
    /**
     * Serve metrics endpoint
     */
    private serveMetrics;
    /**
     * Serve API endpoints
     */
    private serveAPI;
    /**
     * Handle demo start request
     */
    private handleDemoStart;
    /**
     * Handle demo stop request
     */
    private handleDemoStop;
    /**
     * Handle report generation request
     */
    private handleReportGeneration;
    /**
     * Handle stress test request
     */
    private handleStressTest;
    /**
     * Serve 404 error
     */
    private serve404;
    /**
     * Serve 500 error
     */
    private serve500;
}
export default DashboardServer;
//# sourceMappingURL=dashboard-server.d.ts.map