const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import controllers
const videoController = require('../controllers/videoController');
const transcriptionController = require('../controllers/transcriptionController');
const aiController = require('../controllers/aiController');

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'יותר מדי בקשות מכתובת IP זו. אנא נסה שוב מאוחר יותר.',
    retryAfter: Math.ceil(15 * 60 / 60) // minutes
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 AI requests per hour
  message: {
    success: false,
    message: 'חרגת ממכסת בקשות ה-AI השעתית. אנא נסה שוב בעוד שעה.',
    retryAfter: Math.ceil(60 * 60 / 60) // minutes
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const transcriptionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour  
  max: 10, // limit each IP to 10 transcription requests per hour
  message: {
    success: false,
    message: 'חרגת ממכסת בקשות התמלול השעתית. אנא נסה שוב בעוד שעה.',
    retryAfter: Math.ceil(60 * 60 / 60) // minutes
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Video routes
router.post('/video/process-url', videoController.processVideoUrl);
router.post('/video/upload', videoController.uploadVideo);
router.get('/video/:id/info', videoController.getVideoInfo);

// Transcription routes (with specific rate limiting)
router.post('/transcription/generate', transcriptionLimiter, transcriptionController.generateTranscription);
router.get('/transcription/:id', transcriptionController.getTranscription);
router.get('/transcription/cache/stats', transcriptionController.getCacheStats);

// AI analysis routes (with specific rate limiting)
router.post('/ai/analyze', aiLimiter, aiController.analyzeContent);
router.post('/ai/generate-chapters', aiLimiter, aiController.generateChapters);
router.post('/ai/generate-metadata', aiLimiter, aiController.generateMetadata);
router.get('/ai/cache/stats', aiController.getCacheStats);

// API key management
router.post('/api-key', aiController.saveApiKey);
router.get('/api-key', aiController.checkApiKey);

// Health and status routes
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'השרת פועל תקין',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      server: 'running',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

module.exports = router;
