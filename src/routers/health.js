const express = require("express");
const { getHealthStatus } = require("../services/healthCheck.service");
const routers = express.Router();


routers.route("/health").get(async (req, res) => {
    try {
        const healthStatus = await getHealthStatus();
        res.status(200).json(healthStatus);
      } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ status: 'unhealthy', error: 'Internal Server Error' });
      }
});


module.exports = routers;
