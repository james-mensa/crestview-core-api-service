const os = require('os');
const process = require('process');
const mongoose = require('mongoose');

// database connection
const checkDatabaseConnection = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error: 'Database connection error' };
  }
};

// Health check
const getHealthStatus = async () => {
  const healthChecks = await Promise.all([checkDatabaseConnection()]);

  const healthCheck = {
    status: healthChecks.every(check => check.status === 'healthy') ? 'healthy' : 'unhealthy',
    uptime: process.uptime(),
    memoryUsage: {
      rss: process.memoryUsage().rss,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      external: process.memoryUsage().external,
    },
    cpuLoad: os.loadavg(),
    timestamp: new Date().toISOString(),
    services: {
      database: healthChecks[0],
    },
  };

  return healthCheck;
};

module.exports = {
  getHealthStatus,
  checkDatabaseConnection,
};
