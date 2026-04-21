const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ======================
// ✅ FIXED CORS (PRODUCTION SAFE)
// ======================
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// IMPORTANT: handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// ======================
// MongoDB Connection
// ======================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// ======================
// Routes
// ======================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));