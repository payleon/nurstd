/**
 * This is a simple production server script that can be used with Render
 * It depends on your built application files being in the dist directory
 */

// Updated to use ES modules since package.json has "type": "module"
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security headers middleware
app.use((req, res, next) => {
  // Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; upgrade-insecure-requests;"
  );

  // HTTP Strict Transport Security (HSTS)
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Cross-Origin-Opener-Policy (COOP)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // X-Frame-Options (XFO) to prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // X-Content-Type-Options to prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  next();
});

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://nursing-nclex-prep.replit.app',
    'https://*.replit.app',
    'https://nurs-td-nclex-prep.com',
    'https://*.nurs-td-nclex-prep.com'
  ];
  
  const origin = req.headers.origin;
  
  // Set CORS headers
  if (origin && (allowedOrigins.includes(origin) || 
      allowedOrigins.some(allowed => {
        if (allowed.startsWith('*.') && origin) {
          const allowedDomain = allowed.slice(2); // Remove *. prefix
          return origin.endsWith(allowedDomain);
        }
        return false;
      }))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Configure MIME types for XML files
app.use((req, res, next) => {
  if (req.path.endsWith('.xml')) {
    res.type('application/xml');
  }
  next();
});

// Serve robots.txt and sitemap.xml at the root
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(__dirname, 'public/robots.txt');
  try {
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      res.type('text/plain').send(robotsContent);
    } else {
      // Fallback in case the file is in a different location
      const alternateRobotsPath = path.join(__dirname, 'dist/robots.txt');
      if (fs.existsSync(alternateRobotsPath)) {
        const robotsContent = fs.readFileSync(alternateRobotsPath, 'utf8');
        res.type('text/plain').send(robotsContent);
      } else {
        // Generate a default robots.txt if file not found
        res.type('text/plain').send(
          "# Allow all crawlers\n" +
          "User-agent: *\n" +
          "Allow: /\n\n" +
          "# Sitemap location\n" +
          "Sitemap: https://nclexxx.me/sitemap.xml"
        );
      }
    }
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    res.status(500).send('Error serving robots.txt');
  }
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, 'public/sitemap.xml');
  try {
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      res.type('application/xml').send(sitemapContent);
    } else {
      // Fallback in case the file is in a different location
      const alternateSitemapPath = path.join(__dirname, 'dist/sitemap.xml');
      if (fs.existsSync(alternateSitemapPath)) {
        const sitemapContent = fs.readFileSync(alternateSitemapPath, 'utf8');
        res.type('application/xml').send(sitemapContent);
      } else {
        res.status(404).send('Sitemap not found');
      }
    }
  } catch (error) {
    console.error('Error serving sitemap.xml:', error);
    res.status(500).send('Error serving sitemap.xml');
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

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

app.get('/api/tests/:id', (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    const testsPath = path.join(__dirname, 'published/tests.json');
    const testsData = JSON.parse(fs.readFileSync(testsPath, 'utf8'));
    
    const test = testsData.find(t => t.id === testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    res.json(test);
  } catch (error) {
    console.error(`Error fetching test ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to load test" });
  }
});

app.get('/api/tests/:id/content', (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    
    // Get tests from tests.json
    const testsPath = path.join(__dirname, 'published/tests.json');
    const testsData = JSON.parse(fs.readFileSync(testsPath, 'utf8'));
    
    // Find the test with the matching ID
    const test = testsData.find(test => test.id === testId);
    
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    // If the test points to a json file like questions.json, return its structure
    if (test.path.endsWith('.json')) {
      const filePath = path.join(__dirname, test.path);
      const content = fs.readFileSync(filePath, 'utf8');
      const jsonContent = JSON.parse(content);
      
      // Return the data as JSON
      res.json(jsonContent);
    } else {
      // For HTML content (though we don't expect this)
      const filePath = path.join(__dirname, test.path);
      const content = fs.readFileSync(filePath, 'utf8');
      res.type('text/html').send(content);
    }
  } catch (error) {
    console.error("Error reading test content:", error);
    res.status(500).json({ message: "Failed to load test content" });
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
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});