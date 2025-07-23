
require('dotenv').config(); 
const fetch = require('node-fetch');

let accessToken = null; 

const LOG_API_ENDPOINT = `${process.env.EVALUATION_SERVICE_BASE_URL}/logs`;

const Log = async ({ stack, level, pkg, message }) => {
    if (!accessToken) {
        console.warn("Backend Logger: Access token not set. Logs will not be sent to central service.");
        console.log(`[CONSOLE LOG - ${level.toUpperCase()}] Stack: ${stack}, Pkg: ${pkg}, Msg: ${message}`);
        return;
    }

   
    const validStacks = ["backend", "frontend"];
    const validLevels = ["debug", "info", "warn", "error", "fatal"];
    const validBackendPackages = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
    const validFrontendPackages = ["api"]; 
    const validCommonPackages = ["auth", "config", "middleware", "utils"];

    if (!validStacks.includes(stack)) {
        console.error(`Logger: Invalid stack '${stack}'. Must be one of ${validStacks.join(', ')}.`);
        return;
    }
    if (!validLevels.includes(level)) {
        console.error(`Logger: Invalid level '${level}'. Must be one of ${validLevels.join(', ')}.`);
        return;
    }

    let isValidPackage = false;
    if (validCommonPackages.includes(pkg)) {
        isValidPackage = true;
    } else if (stack === "backend" && validBackendPackages.includes(pkg)) {
        isValidPackage = true;
    } else if (stack === "frontend" && validFrontendPackages.includes(pkg)) {
        isValidPackage = true;
    }

    if (!isValidPackage) {
        console.error(`Logger: Invalid package '${pkg}' for stack '${stack}'.`);
        return;
    }

    try {
        const response = await fetch(LOG_API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                stack: stack,
                level: level,
                package: pkg,
                message: message
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Backend Logger: Failed to send log (Status: ${response.status}):`, errorData);
        } else {
            
        }
    } catch (error) {
        console.error("Backend Logger: Error sending log:", error.message);
    }
};

const setBackendAccessToken = (token) => {
    accessToken = token;
    Log({ stack: "backend", level: "info", pkg: "auth", message: "Backend access token set for logging." });
};

module.exports = { Log, setBackendAccessToken };