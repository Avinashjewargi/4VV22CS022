
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress, Alert
} from '@mui/material';
import { Log, setAccessTokenForLogger } from './utils/logger';
import { setApiAccessToken, register } from './services/api';


import UrlShortenerPage from './pages/UrlShortenerPage';
import UrlStatisticsPage from './pages/UrlStatisticsPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const authenticate = async () => {
            Log({ stack: "frontend", level: "info", pkg: "app", message: "Attempting initial authentication/registration." });
            setLoadingAuth(true);
            try {
                // Use your actual registration
                const userData = {
                    "email": "avinashjewargi@gmail.com",
                    "name": "avinash",
                    "rollNo": "4vv22cs022",
                    "accessCode": "tqTSpD",
                    "clientID": "14133455-1915-4f7b-923b-4f2713708780",
                    "clientSecret": "SbTcsajmBPzYmtxn"
                };
                const data = await register(userData);
                setApiAccessToken(data.access_token); // Set token for API service and logger
                setIsAuthenticated(true);
                Log({ stack: "frontend", level: "info", pkg: "app", message: "Authentication successful." });
            } catch (error) {
                setAuthError(error.message);
                Log({ stack: "frontend", level: "fatal", pkg: "app", message: `Authentication failed at startup: ${error.message}` });
            } finally {
                setLoadingAuth(false);
            }
        };

        authenticate();
    }, []);

    if (loadingAuth) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Authenticating with evaluation service...</Typography>
            </Box>
        );
    }

    if (authError) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Authentication Error: {authError}. <br/> Please ensure your .env details are correct and the evaluation service is reachable.
                </Alert>
                <Typography variant="body2">Check console for more details.</Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Alert severity="error">Not authenticated. Cannot proceed.</Alert>
            </Box>
        );
    }

    return (
        <Router>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Affordmed URL Shortener
                        </Typography>
                        <Button color="inherit" component={Link} to="/">
                            Shortener
                        </Button>
                        <Button color="inherit" component={Link} to="/statistics">
                            Statistics
                        </Button>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Routes>
                        <Route path="/" element={<UrlShortenerPage />} />
                        <Route path="/statistics" element={<UrlStatisticsPage />} />
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
}

export default App;