/* global chrome */
import axios from 'axios';

// API base URL - configured to match server port
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper to check if running in extension context
const isExtensionContext = () => {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync;
};

// Create axios instance with improved error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Add request interceptor to check server availability
api.interceptors.request.use(
  async config => {
    try {
      // Check server availability before making the request
      const serverAvailable = await checkServerAvailability();
      if (!serverAvailable) {
        throw new Error('השרת אינו זמין. אנא וודא שהשרת פועל ונסה שוב מאוחר יותר.');
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

// Helper function to check if server is available
async function checkServerAvailability() {
  try {
    // Simple health check
    // Remove '/api' from API_BASE_URL since our health endpoint is at root level
    const healthUrl = API_BASE_URL.replace('/api', '') + '/health';
    const response = await fetch(healthUrl, { 
      method: 'GET',
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.warn('Server availability check failed:', error.message);
    return false;
  }
}

// Video API Service
export const videoService = {
  // Process YouTube URL
  processVideoUrl: async (url) => {
    try {
      const response = await api.post('/video/process-url', { url });
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error processing video URL';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },

  // Upload video file
  uploadVideo: async (formData) => {
    try {
      const response = await api.post('/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error uploading video';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },

  // Get video info
  getVideoInfo: async (id) => {
    try {
      const response = await api.get(`/video/${id}/info`);
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error getting video info';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },
};

// Transcription API Service
export const transcriptionService = {
  // Generate transcription
  generateTranscription: async (data) => {
    try {
      const response = await api.post('/transcription/generate', data);
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error generating transcription';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },

  // Get transcription
  getTranscription: async (id) => {
    try {
      const response = await api.get(`/transcription/${id}`);
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error getting transcription';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },
};

// AI API Service
export const aiService = {
  // Analyze content
  analyzeContent: async (data) => {
    try {
      const response = await api.post('/ai/analyze', data);
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error analyzing content';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },

  // Generate chapters
  generateChapters: async (data) => {
    try {
      const response = await api.post('/ai/generate-chapters', data);
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error generating chapters';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },

  // Generate metadata
  generateMetadata: async (data) => {
    try {
      const response = await api.post('/ai/generate-metadata', data);
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = 'Error generating metadata';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },

// Save API key
  saveApiKey: async (type, key) => {
    try {
      // For testing without a server, save to Chrome storage instead
      // First try to use the Chrome extension API if available
      if (isExtensionContext()) {
        return new Promise((resolve) => {
          chrome.storage.sync.get(['apiKeys'], (result) => {
            const apiKeys = result.apiKeys || {};
            apiKeys[type] = key;
            
            chrome.storage.sync.set({ apiKeys }, () => {
              resolve({
                success: true,
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} API key saved successfully`,
                data: { hasKey: true }
              });
            });
          });
        });
      }
      
      // Fall back to server-side storage if Chrome storage is not available
      const response = await api.post('/api-key', { type, key });
      return response.data;
    } catch (error) {
      // Format error message properly
      let errorMessage = `Error saving ${type} API key`;
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`${errorMessage}:`, error);
      // Create a new error with the proper message
      const formattedError = new Error(errorMessage);
      formattedError.originalError = error;
      throw formattedError;
    }
  },
};

// Check if API key exists
export const checkApiKeys = async (type) => {
  try {
    // First try to check in Chrome storage if available
    if (isExtensionContext()) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['apiKeys'], (result) => {
          const apiKeys = result.apiKeys || {};
          resolve(!!apiKeys[type]);
        });
      });
    }
    
    // Fall back to server-side check if Chrome storage is not available
    const response = await api.get(`/api-key?type=${type}`);
    return response.data.data.hasKey;
  } catch (error) {
    console.error('Error checking API key:', error);
    return false;
  }
};

// Fix ESLint warning by assigning to a variable first
const apiServices = {
  videoService,
  transcriptionService,
  aiService,
  checkApiKeys,
};

export default apiServices;
