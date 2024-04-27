const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Apply middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Import and use API routes
const api = require('./routes/api');
app.use('/v1', api);

// Wildcard route to serve index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
