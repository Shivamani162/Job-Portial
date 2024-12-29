const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const cookieParser = require('cookie-parser'); // Added for CSRF support
require('dotenv').config();

// Import Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({ origin: 'https://your-frontend-domain.com', credentials: true })); // Adjust origin as needed
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // Required for CSRF parsing

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// CSRF Protection
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1); // Exit process if MongoDB fails to connect
    });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// CSRF Token Endpoint (Optional, for frontends needing the token)
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
