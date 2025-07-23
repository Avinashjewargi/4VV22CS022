
const { Log } = require('../utils/logger');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        Log({ stack: "backend", level: "warn", pkg: "middleware", message: "Unauthorized access attempt: Missing or malformed Authorization header." });
        return res.status(401).json({ message: "Unauthorized: Access token required." });
    }

  
    const token = authHeader.split(' ')[1];
    req.token = token; 
    Log({ stack: "backend", level: "debug", pkg: "middleware", message: "Authorization header found. Proceeding." });
    next();
};

module.exports = authenticate;