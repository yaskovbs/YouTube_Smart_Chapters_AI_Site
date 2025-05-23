const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

// Import services
const { apiKeys, analysisResults, transcriptions, getAllCacheStats } = require('../services/ai/aiCacheService');
const { generateDemoAnalysisData, generateDemoChapters, generateDemoMetadata } = require('../services/ai/aiDemoService');
const { analyzeWithOpenAI, generateChaptersWithOpenAI, generateMetadataWithOpenAI } = require('../services/ai/openaiService');
const { prepareTranscriptionText, extractKeySentenceTimestamps, processAssemblyAIChapters } = require('../utils/textProcessing');

/**
 * Validation middleware for content analysis
 */
const validateAnalysisInput = [
  body('transcriptionId').notEmpty().withMessage('Transcription ID is required'),
  body('language').optional().isIn(['he', 'en', 'uk', 'ar', 'ru', 'fr', 'es', 'de']).withMessage('Invalid language code'),
  body('apiType').optional().isIn(['openai', 'assemblyai']).withMessage('Invalid API type'),
];

const validateChaptersInput = [
  body('analysisId').notEmpty().withMessage('Analysis ID is required'),
  body('language').optional().isIn(['he', 'en', 'uk', 'ar', 'ru', 'fr', 'es', 'de']).withMessage('Invalid language code'),
  body('apiType').optional().isIn(['openai', 'assemblyai']).withMessage('Invalid API type'),
];

const validateMetadataInput = [
  body('analysisId').notEmpty().withMessage('Analysis ID is required'),
  body('language').optional().isIn(['he', 'en', 'uk', 'ar', 'ru', 'fr', 'es', 'de']).withMessage('Invalid language code'),
  body('apiType').optional().isIn(['openai', 'assemblyai']).withMessage('Invalid API type'),
];

/**
 * Analyze content from a transcription
 */
exports.analyzeContent = [
  ...validateAnalysisInput,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'שגיאת אימות נתונים',
          errors: errors.array()
        });
      }

      const { transcriptionId, language = 'he', apiType = 'openai' } = req.body;
      
      // Check cache first
      const cacheKey = analysisResults.generateKey(transcriptionId, language, apiType);
      const cachedAnalysis = analysisResults.get(cacheKey);
      
      if (cachedAnalysis) {
        console.log(`Returning cached analysis for ${cacheKey}`);
        return res.status(200).json({
          success: true,
          data: cachedAnalysis,
          cached: true
        });
      }
      
      // Try to get transcription data
      let transcriptionData = transcriptions.get(transcriptionId);
      
      // If transcription not found, create demo analysis
      if (!transcriptionData) {
        console.log(`Transcription ${transcriptionId} not found, creating demo analysis data`);
        
        const demoAnalysisResult = generateDemoAnalysisData(transcriptionId, language);
        
        // Store demo analysis result
        const analysisId = uuidv4();
        const analysisRecord = {
          id: analysisId,
          transcriptionId,
          language,
          apiType: 'demo',
          result: demoAnalysisResult,
          isDemoData: true,
          timestamp: new Date().toISOString()
        };
        
        analysisResults.save(cacheKey, analysisRecord);
        analysisResults.save(analysisId, analysisRecord);
        
        return res.status(200).json({
          success: true,
          data: analysisRecord,
          message: language === 'he' 
            ? 'נתונים דמו - התקן מפתחות API לניתוח אמיתי' 
            : 'Demo data - install API keys for real analysis',
          isDemoData: true
        });
      }
      
      // For AssemblyAI, use chapters directly from transcription
      if (apiType === 'assemblyai') {
        if (transcriptionData.chapters && transcriptionData.chapters.length > 0) {
          const analysisResult = processAssemblyAIChapters(transcriptionData);
          
          const analysisId = uuidv4();
          const analysisRecord = {
            id: analysisId,
            transcriptionId,
            language,
            apiType,
            result: analysisResult,
            timestamp: new Date().toISOString()
          };
          
          analysisResults.save(cacheKey, analysisRecord);
          analysisResults.save(analysisId, analysisRecord);
          
          return res.status(200).json({
            success: true,
            data: analysisRecord
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'התמלול מ-AssemblyAI לא כולל פרקים אוטומטיים'
          });
        }
      }
      
      // Get API key for OpenAI
      const apiKey = apiKeys.get('openai');
      
      if (!apiKey) {
        console.log('No OpenAI API key found, returning demo analysis data');
        
        const demoAnalysisResult = generateDemoAnalysisData(transcriptionId, language);
        
        const analysisId = uuidv4();
        const analysisRecord = {
          id: analysisId,
          transcriptionId,
          language,
          apiType: 'demo',
          result: demoAnalysisResult,
          isDemoData: true,
          timestamp: new Date().toISOString()
        };
        
        analysisResults.save(cacheKey, analysisRecord);
        analysisResults.save(analysisId, analysisRecord);
        
        return res.status(200).json({
          success: true,
          data: analysisRecord,
          message: language === 'he' 
            ? 'נתונים דמו - הגדר מפתח OpenAI לניתוח אמיתי' 
            : 'Demo data - set OpenAI key for real analysis',
          isDemoData: true
        });
      }
      
      // Prepare transcription text and analyze with OpenAI
      const transcriptionText = prepareTranscriptionText(transcriptionData.transcription);
      const analysisResult = await analyzeWithOpenAI(transcriptionText, language, apiKey);
      
      // Store analysis result
      const analysisId = uuidv4();
      const analysisRecord = {
        id: analysisId,
        transcriptionId,
        language,
        apiType,
        result: analysisResult,
        timestamp: new Date().toISOString()
      };
      
      analysisResults.save(cacheKey, analysisRecord);
      analysisResults.save(analysisId, analysisRecord);
      
      return res.status(200).json({
        success: true,
        data: analysisRecord
      });
      
    } catch (error) {
      console.error('Error analyzing content:', error);
      
      let errorMessage = 'שגיאה בניתוח התוכן';
      if (error.message.includes('rate limit')) {
        errorMessage = 'חרגת ממכסת השימוש ב-API. אנא נסה שוב מאוחר יותר.';
      } else if (error.message.includes('authentication')) {
        errorMessage = 'מפתח ה-API לא חוקי. אנא בדוק את המפתח בהגדרות.';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.message
      });
    }
  }
];

/**
 * Generate chapters from analysis
 */
exports.generateChapters = [
  ...validateChaptersInput,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'שגיאת אימות נתונים',
          errors: errors.array()
        });
      }

      const { analysisId, language = 'he', apiType = 'openai' } = req.body;
      
      // Get analysis result
      const analysisData = analysisResults.get(analysisId);
      
      if (!analysisData) {
        return res.status(404).json({
          success: false,
          message: 'תוצאת הניתוח לא נמצאה או שפג תוקפה'
        });
      }
      
      // For demo data or AssemblyAI, chapters are already generated
      if (analysisData.isDemoData || analysisData.apiType === 'assemblyai' || analysisData.apiType === 'demo') {
        if (analysisData.result && analysisData.result.chapters) {
          return res.status(200).json({
            success: true,
            data: {
              chapters: analysisData.result.chapters,
              isDemoData: analysisData.isDemoData
            }
          });
        }
      }
      
      // Get transcription data for OpenAI processing
      const transcriptionData = transcriptions.get(analysisData.transcriptionId);
      
      if (!transcriptionData) {
        const demoChapters = generateDemoChapters(language);
        return res.status(200).json({
          success: true,
          data: {
            chapters: demoChapters,
            isDemoData: true
          },
          message: language === 'he' 
            ? 'פרקים דמו - נתוני התמלול לא נמצאו'
            : 'Demo chapters - transcription data not found'
        });
      }
      
      // Get API key
      const apiKey = apiKeys.get('openai');
      
      if (!apiKey) {
        const demoChapters = generateDemoChapters(language);
        return res.status(200).json({
          success: true,
          data: {
            chapters: demoChapters,
            isDemoData: true
          },
          message: language === 'he' 
            ? 'פרקים דמו - הגדר מפתח OpenAI לפרקים אמיתיים'
            : 'Demo chapters - set OpenAI key for real chapters'
        });
      }
      
      // Generate chapters using OpenAI
      const sentenceTimestamps = extractKeySentenceTimestamps(transcriptionData.transcription);
      const chapters = await generateChaptersWithOpenAI(
        analysisData.result, 
        transcriptionData.transcription,
        sentenceTimestamps,
        language,
        apiKey
      );
      
      return res.status(200).json({
        success: true,
        data: { chapters }
      });
      
    } catch (error) {
      console.error('Error generating chapters:', error);
      
      let errorMessage = 'שגיאה ביצירת הפרקים';
      if (error.message.includes('rate limit')) {
        errorMessage = 'חרגת ממכסת השימוש ב-API. אנא נסה שוב מאוחר יותר.';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.message
      });
    }
  }
];

/**
 * Generate metadata from analysis
 */
exports.generateMetadata = [
  ...validateMetadataInput,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'שגיאת אימות נתונים',
          errors: errors.array()
        });
      }

      const { analysisId, language = 'he', apiType = 'openai' } = req.body;
      
      // Get analysis result
      const analysisData = analysisResults.get(analysisId);
      
      if (!analysisData) {
        return res.status(404).json({
          success: false,
          message: 'תוצאת הניתוח לא נמצאה או שפג תוקפה'
        });
      }
      
      // Get API key
      const apiKey = apiKeys.get('openai');
      
      // Generate metadata using AI or demo data
      let metadata;
      if (!apiKey || analysisData.isDemoData || analysisData.apiType === 'demo') {
        metadata = generateDemoMetadata(analysisData.result, language);
        
        return res.status(200).json({
          success: true,
          data: {
            metadata,
            isDemoData: true
          },
          message: language === 'he' 
            ? 'מטא-נתונים דמו - הגדר מפתח API למטא-נתונים אמיתיים'
            : 'Demo metadata - set API key for real metadata'
        });
      } else if (apiType === 'openai') {
        metadata = await generateMetadataWithOpenAI(analysisData.result, language, apiKey);
      } else {
        metadata = generateDemoMetadata(analysisData.result, language);
      }
      
      return res.status(200).json({
        success: true,
        data: { metadata }
      });
      
    } catch (error) {
      console.error('Error generating metadata:', error);
      
      let errorMessage = 'שגיאה ביצירת המטא-נתונים';
      if (error.message.includes('rate limit')) {
        errorMessage = 'חרגת ממכסת השימוש ב-API. אנא נסה שוב מאוחר יותר.';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.message
      });
    }
  }
];

/**
 * Save API key
 */
exports.saveApiKey = [
  body('type').isIn(['openai', 'assemblyai']).withMessage('Invalid API type'),
  body('key').notEmpty().withMessage('API key is required'),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'שגיאת אימות נתונים',
          errors: errors.array()
        });
      }

      const { type, key } = req.body;
      
      apiKeys.save(type, key);
      
      return res.status(200).json({
        success: true,
        message: `מפתח ${type === 'openai' ? 'OpenAI' : 'AssemblyAI'} נשמר בהצלחה`
      });
      
    } catch (error) {
      console.error('Error saving API key:', error);
      return res.status(500).json({
        success: false,
        message: 'שגיאה בשמירת מפתח ה-API',
        error: error.message
      });
    }
  }
];

/**
 * Check if API key exists
 */
exports.checkApiKey = (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type || !['openai', 'assemblyai'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'סוג API לא חוקי. חייב להיות "openai" או "assemblyai"'
      });
    }
    
    const hasKey = apiKeys.has(type);
    
    return res.status(200).json({
      success: true,
      data: { hasKey }
    });
    
  } catch (error) {
    console.error('Error checking API key:', error);
    return res.status(500).json({
      success: false,
      message: 'שגיאה בבדיקת מפתח ה-API',
      error: error.message
    });
  }
};

/**
 * Get cache statistics (for debugging)
 */
exports.getCacheStats = (req, res) => {
  try {
    const stats = getAllCacheStats();
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error getting cache stats',
      error: error.message
    });
  }
};
