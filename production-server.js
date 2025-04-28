/**
 * This is a simple production server script that can be used with Render
 * It depends on your built application files being in the dist directory
 */

// Use this script if you have trouble with the ESM modules in production
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/client')));

// API routes - add your API routes here or import them
app.get('/api/tests', (req, res) => {
  try {
    // Read from your JSON files or database
    const testsPath = path.join(__dirname, 'published/tests.json');
    const testsData = fs.readFileSync(testsPath, 'utf8');
    res.json(JSON.parse(testsData));
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

app.get('/api/questions', (req, res) => {
  try {
    // Read from your JSON files or database
    const questionsPath = path.join(__dirname, 'published/all_questions.json');
    const questionsData = fs.readFileSync(questionsPath, 'utf8');
    res.json(JSON.parse(questionsData));
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Handle SPA routing - always return index.html for client routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});