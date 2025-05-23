const NodeCache = require('node-cache');

// TTL cache for API keys and results (24 hours TTL)
const apiKeysCache = new NodeCache({ 
  stdTTL: 24 * 60 * 60, // 24 hours
  checkperiod: 60 * 60 // Check every hour
});

const analysisResultsCache = new NodeCache({ 
  stdTTL: 24 * 60 * 60, // 24 hours
  checkperiod: 60 * 60 // Check every hour
});

// Shared cache instance for transcriptions (matching transcriptionController)
const transcriptionsCache = new NodeCache({ 
  stdTTL: 24 * 60 * 60, // 24 hours
  checkperiod: 60 * 60 // Check every hour
});

/**
 * API Keys Cache Management
 */
const apiKeys = {
  /**
   * Save API key
   * @param {string} type - API type (openai, assemblyai)
   * @param {string} key - API key
   */
  save: (type, key) => {
    apiKeysCache.set(type, key);
  },

  /**
   * Get API key
   * @param {string} type - API type (openai, assemblyai)
   * @returns {string|undefined} - API key or undefined
   */
  get: (type) => {
    const envKey = type === 'openai' ? process.env.OPENAI_API_KEY : process.env.ASSEMBLYAI_API_KEY;
    return apiKeysCache.get(type) || envKey;
  },

  /**
   * Check if API key exists
   * @param {string} type - API type (openai, assemblyai)
   * @returns {boolean} - Whether key exists
   */
  has: (type) => {
    const envKey = type === 'openai' ? process.env.OPENAI_API_KEY : process.env.ASSEMBLYAI_API_KEY;
    return apiKeysCache.has(type) || Boolean(envKey);
  },

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getStats: () => {
    const stats = apiKeysCache.getStats();
    return {
      keys: stats.keys || 0,
      hits: stats.hits || 0,
      misses: stats.misses || 0
    };
  }
};

/**
 * Analysis Results Cache Management
 */
const analysisResults = {
  /**
   * Save analysis result
   * @param {string} key - Cache key
   * @param {Object} data - Analysis data
   */
  save: (key, data) => {
    analysisResultsCache.set(key, data);
  },

  /**
   * Get analysis result
   * @param {string} key - Cache key
   * @returns {Object|undefined} - Analysis data or undefined
   */
  get: (key) => {
    return analysisResultsCache.get(key);
  },

  /**
   * Check if analysis result exists
   * @param {string} key - Cache key
   * @returns {boolean} - Whether result exists
   */
  has: (key) => {
    return analysisResultsCache.has(key);
  },

  /**
   * Generate cache key for analysis
   * @param {string} transcriptionId - Transcription ID
   * @param {string} language - Language code
   * @param {string} apiType - API type
   * @returns {string} - Cache key
   */
  generateKey: (transcriptionId, language, apiType) => {
    return `analysis_${transcriptionId}_${language}_${apiType}`;
  },

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getStats: () => {
    const stats = analysisResultsCache.getStats();
    return {
      keys: stats.keys || 0,
      hits: stats.hits || 0,
      misses: stats.misses || 0
    };
  }
};

/**
 * Transcriptions Cache Management
 */
const transcriptions = {
  /**
   * Save transcription data
   * @param {string} key - Cache key
   * @param {Object} data - Transcription data
   */
  save: (key, data) => {
    transcriptionsCache.set(key, data);
  },

  /**
   * Get transcription data
   * @param {string} key - Cache key
   * @returns {Object|undefined} - Transcription data or undefined
   */
  get: (key) => {
    return transcriptionsCache.get(key);
  },

  /**
   * Check if transcription exists
   * @param {string} key - Cache key
   * @returns {boolean} - Whether transcription exists
   */
  has: (key) => {
    return transcriptionsCache.has(key);
  }
};

/**
 * Get comprehensive cache statistics
 * @returns {Object} - All cache statistics
 */
function getAllCacheStats() {
  return {
    apiKeysCache: apiKeys.getStats(),
    analysisCache: analysisResults.getStats(),
    transcriptionsCache: {
      keys: transcriptionsCache.keys().length,
      hits: transcriptionsCache.getStats().hits || 0,
      misses: transcriptionsCache.getStats().misses || 0
    }
  };
}

module.exports = {
  apiKeys,
  analysisResults,
  transcriptions,
  getAllCacheStats
};
