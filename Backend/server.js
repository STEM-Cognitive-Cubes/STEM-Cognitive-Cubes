const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5002;

// Routes
const sessionRoutes = require('./src/routes/sessionRoutes');
app.use('/api/session', sessionRoutes);

app.get('/', (req, res) => {
  res.send('Insight Engine Backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
