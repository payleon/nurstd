import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Import path for resolving file paths
import path from "path";
// Import xss-clean for XSS protection
import xssClean from "xss-clean";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply XSS protection middleware
app.use(xssClean());

// CORS middleware - restrict to specific origins in production
app.use((req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Allow specific origins in production, more permissive in development
  const allowedOrigins = isDevelopment
    ? ['*'] 
    : [
        'https://nursing-nclex-prep.replit.app',
        'https://*.replit.app',
        'https://nurs-td-nclex-prep.com',
        'https://*.nurs-td-nclex-prep.com'
      ];
    
  const origin = req.headers.origin;
  
  // Set CORS headers
  if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin) || 
      allowedOrigins.some(allowed => {
        // Handle wildcard domains (*.example.com)
        if (allowed.startsWith('*.') && origin) {
          const allowedDomain = allowed.slice(2); // Remove *. prefix
          return origin.endsWith(allowedDomain);
        }
        return false;
      }))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    
    // Only set additional CORS headers if origin is allowed
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

// Security headers middleware
app.use((req, res, next) => {
  // Content Security Policy (CSP)
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // In development we need more permissive settings for HMR and debugging
  const cspValue = isDevelopment 
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.replit.dev wss://*.replit.dev; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self';"
    : "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; upgrade-insecure-requests;";
  
  res.setHeader('Content-Security-Policy', cspValue);

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

  // Referrer-Policy to control the information sent in the Referer header
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (formerly Feature-Policy)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from environment or default to 5000
  // this serves both the API and the client
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
