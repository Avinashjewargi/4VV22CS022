
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch'); 
const urlRoutes = require('./src/routes/urlRoutes');
const { Log, setBackendAccessToken } = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;
const EVALUATION_SERVICE_BASE_URL = process.env.EVALUATION_SERVICE_BASE_URL;


app.use(cors()); 
app.use(express.json()); /
app.use(express.urlencoded({ extended: true })); /

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
        Log({ stack: "backend", level: "info", pkg: "db", message: "MongoDB connection successful." });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        Log({ stack: "backend", level: "fatal", pkg: "db", message: `MongoDB connection failed: ${err.message}` });
        process.exit(1); 
    });


const registerWithEvaluationService = async () => {
    Log({ stack: "backend", level: "info", pkg: "auth", message: "Registering with evaluation service to obtain access token." });
    try {
        const registrationData = {
            email: process.env.REG_EMAIL,
            name: process.env.REG_NAME,
            rollNo: process.env.REG_ROLL_NO,
            accessCode: process.env.REG_ACCESS_CODE,
            clientID: process.env.REG_CLIENT_ID,
            clientSecret: process.env.REG_CLIENT_SECRET
        };

        const response = await fetch(`${EVALUATION_SERVICE_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
        });

        const data = await response.json();

        if (!response.ok) {
            Log({ stack: "backend", level: "error", pkg: "auth", message: `Failed to register with evaluation service: ${JSON.stringify(data)}` });
            throw new Error(`Failed to register with evaluation service: ${data.message || 'Unknown error'}`);
        }

        setBackendAccessToken(data.access_token);
        console.log('Successfully registered with evaluation service and obtained access token.');
        Log({ stack: "backend", level: "info", pkg: "auth", message: "Successfully obtained access token from evaluation service." });

    } catch (error) {
        console.error('Error during initial registration with evaluation service:', error.message);
        Log({ stack: "backend", level: "fatal", pkg: "auth", message: `Initial registration failed: ${error.message}` });
        
    }
};


registerWithEvaluationService();



app.use('/', urlRoutes); 

// Start the server
app.listen(PORT, () => {
    console.log(`Backend microservice running on port ${PORT}`);
    Log({ stack: "backend", level: "info", pkg: "app", message: `Backend server started on port ${PORT}.` });
});