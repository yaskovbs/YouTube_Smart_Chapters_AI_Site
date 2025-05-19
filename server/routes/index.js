const express = require('express');
const router = express.Router();

// Import controllers
const videoController = require('../controllers/videoController');
const transcriptionController = require('../controllers/transcriptionController');
const aiController = require('../controllers/aiController');

// Video routes
router.post('/video/process-url', videoController.processVideoUrl);
router.post('/video/upload', videoController.uploadVideo);
router.get('/video/:id/info', videoController.getVideoInfo);

// Transcription routes
router.post('/transcription/generate', transcriptionController.generateTranscription);
router.get('/transcription/:id', transcriptionController.getTranscription);

// AI analysis routes
router.post('/ai/analyze', aiController.analyzeContent);
router.post('/ai/generate-chapters', aiController.generateChapters);
router.post('/ai/generate-metadata', aiController.generateMetadata);

// API key management
router.post('/api-key', aiController.saveApiKey);
router.get('/api-key', aiController.checkApiKey);

module.exports = router;
