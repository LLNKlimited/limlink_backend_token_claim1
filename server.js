require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/api/claim', require('./routes/api/claim'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/push', require('./routes/api/push'));
app.use('/api/paypal', require('./routes/api/paypal'));
app.use('/api/llnk', require('./routes/api/llnk'));
app.use('/api/token', require('./routes/api/tokens'));


// Serve frontend
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
