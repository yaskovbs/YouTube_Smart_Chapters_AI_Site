const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.assemblyai.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration with Chrome extension support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow Chrome extensions
    if (origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    // Allow development origins
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] // Add your production domain
      : [
          'http://localhost:3000',
          'http://localhost:8000',
          'https://localhost:3000',
          'https://localhost:8000'
        ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create necessary directories
const createDirectories = () => {
  const dirs = [
    path.join(__dirname, 'temp'),
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'logs')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

createDirectories();

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'} - IP: ${req.ip}`);
  next();
});

// Define routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Root health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files for uploads (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'נתיב לא נמצא',
    path: req.originalUrl
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Handle different types of errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON לא חוקי בבקשה'
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'הקובץ גדול מדי. מקסימום 10MB'
    });
  }
  
  // Rate limiting error
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'יותר מדי בקשות. אנא נסה שוב מאוחר יותר.',
      retryAfter: err.retryAfter
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'שגיאה פנימית בשרת',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Close any database connections, cleanup resources, etc.
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Set port
const PORT = process.env.PORT || 8000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 YouTube Smart Chapters AI Server
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started: ${new Date().toISOString()}
🔗 Health: http://localhost:${PORT}/health
📝 API: http://localhost:${PORT}/api
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

module.exports = app;
