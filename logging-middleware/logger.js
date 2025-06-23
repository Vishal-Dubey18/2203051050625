// logging-middleware/logger.js
const axios = require('axios');
const { stacks, levels, packages } = require('./constants');

// ⛳ Put your Bearer token here
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjAzMDUxMDUwNjI1QHBhcnVsdW5pdmVyc2l0eS5hYy5pbiIsImV4cCI6MTc1MDY2NDM4OSwiaWF0IjoxNzUwNjYzNDg5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjIxMGMwZDItNDQ1Ni00OTkxLWE4MzktYjdjMzE0ZTExMGI5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaGFsIGR1YmV5Iiwic3ViIjoiZjc5MjBmMjgtYmE3ZC00MDgyLWI2ZjItZWVmYWNkMjc2YTM5In0sImVtYWlsIjoiMjIwMzA1MTA1MDYyNUBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4iLCJuYW1lIjoidmlzaGFsIGR1YmV5Iiwicm9sbE5vIjoiMjIwMzA1MTA1MDYyNSIsImFjY2Vzc0NvZGUiOiJUUnpnV00iLCJjbGllbnRJRCI6ImY3OTIwZjI4LWJhN2QtNDA4Mi1iNmYyLWVlZmFjZDI3NmEzOSIsImNsaWVudFNlY3JldCI6IlBqR0ZVa3pyeGZXVmh1dXIifQ.UQkPHHB6r7ojQBpPq_rX2PtTJU7ywLUEvVxRno5WpsU";

function validateInput(stack, level, pkg) {
  if (!stacks.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
  if (!levels.includes(level)) throw new Error(`Invalid level: ${level}`);

  const allPackages = [...packages.shared, ...(packages[stack] || [])];
  if (!allPackages.includes(pkg)) throw new Error(`Invalid package for ${stack}: ${pkg}`);
}

const log = async (stack, level, pkg, message) => {
  try {
    validateInput(stack, level, pkg);

    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

    console.log(`✅ Log successful: ${response.data.message}`);
  } catch (err) {
    console.error(`❌ Logging failed:`, err.message);
  }
};

module.exports = log;
