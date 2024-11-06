import os from 'os';
import process from 'process';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

//memory and CPU metrics
const getSystemMetrics = () => ({
  uptime: process.uptime(),
  memoryUsage: {
    rss: process.memoryUsage().rss,
    heapTotal: process.memoryUsage().heapTotal,
    heapUsed: process.memoryUsage().heapUsed,
    external: process.memoryUsage().external,
  },
  cpuLoad: os.loadavg(),
  timestamp: new Date().toISOString(),
});


const checkDatabaseConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database is not connected");
    }
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not initialized");
    }

    await db.admin().ping();
    return { status: 'healthy' };
  } catch (error) {
    console.error("Database connection error:", error);
    return { status: 'unhealthy', error: 'Database connection error' };
  }
};

export const getHealthStatus = async (_: Request, res: Response) => {
  try {

    const [dbStatus] = await Promise.all([checkDatabaseConnection()]);

    const overallStatus = {
      status: dbStatus.status === 'healthy' ? 'healthy' : 'unhealthy',
      systemMetrics: getSystemMetrics(),
      services: {
        database: dbStatus,
      },
    };

    res.status(overallStatus.status === 'healthy' ? 200 : 503).json(overallStatus);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'An unexpected error occurred during health check',
      details: (error as Error).message,
    });
  }
};


export default {
  getHealthStatus,
  checkDatabaseConnection,
};
