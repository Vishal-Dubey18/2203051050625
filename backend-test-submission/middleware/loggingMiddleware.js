const log = require('../../logging-middleware/logger');

const loggingMiddleware = async (req, res, next) => {
  await log("backend", "info", "middleware", `Received ${req.method} request to ${req.url}`);
  next();
};

module.exports = loggingMiddleware;
