const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { calculateCgpa } = require('./cgpaCalculator');
const { User, Calculation } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cgpa-calculator';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register or get user
app.post('/api/user', async (req, res) => {
  try {
    const { fullName, branch } = req.body;

    if (!fullName || !branch) {
      return res.status(400).json({ error: 'Full name and branch are required' });
    }

    const user = new User({ fullName, branch });
    await user.save();

    res.json({ userId: user._id, fullName: user.fullName, branch: user.branch });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      error: err && err.message ? err.message : 'Failed to create user',
    });
  }
});

// Get user history
app.get('/api/user/:userId/history', async (req, res) => {
  try {
    const calculations = await Calculation.find({ userId: req.params.userId })
      .sort({ calculatedAt: -1 })
      .limit(10);

    res.json(calculations);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Calculate CGPA and save
app.post('/api/cgpa', async (req, res) => {
  try {
    const { userId, courseData, userName, userBranch } = req.body;

    const result = calculateCgpa(courseData || {});

    if (userId) {
      const calculation = new Calculation({
        userId,
        userName,
        userBranch,
        courseData,
        result,
      });
      await calculation.save();
    }

    res.json(result);
  } catch (err) {
    console.error('Error computing CGPA:', err);
    res.status(400).json({ error: err.message || 'Invalid input' });
  }
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CGPA Calculator running on http://localhost:${PORT}`);
});
