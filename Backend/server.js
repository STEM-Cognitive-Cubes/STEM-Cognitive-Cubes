const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5002;

app.get('/', (req, res) => {
  res.send('Insight Engine Backend API is running');
});
