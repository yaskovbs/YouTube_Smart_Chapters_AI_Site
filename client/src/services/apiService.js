import axios from 'axios';

// API base URL - configured to match server port
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Video API Service
export const videoService = {
  // Process YouTube URL
  processVideoUrl: async (url) => {
    try {
      const response = await api.post('/video/process-url', { url });
      return response.data;
    } catch (error) {
      console.error('Error processing video URL:', error);
      throw error;
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
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Get video info
  getVideoInfo: async (id) => {
    try {
      const response = await api.get(`/video/${id}/info`);
      return response.data;
    } catch (error) {
      console.error('Error getting video info:', error);
      throw error;
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
      console.error('Error generating transcription:', error);
      throw error;
    }
  },

  // Get transcription
  getTranscription: async (id) => {
    try {
      const response = await api.get(`/transcription/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting transcription:', error);
      throw error;
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
      console.error('Error analyzing content:', error);
      throw error;
    }
  },

  // Generate chapters
  generateChapters: async (data) => {
    try {
      const response = await api.post('/ai/generate-chapters', data);
      return response.data;
    } catch (error) {
      console.error('Error generating chapters:', error);
      throw error;
    }
  },

  // Generate metadata
  generateMetadata: async (data) => {
    try {
      const response = await api.post('/ai/generate-metadata', data);
      return response.data;
    } catch (error) {
      console.error('Error generating metadata:', error);
      throw error;
    }
  },

  // Save API key
  saveApiKey: async (type, key) => {
    try {
      const response = await api.post('/api-key', { type, key });
      return response.data;
    } catch (error) {
      console.error('Error saving API key:', error);
      throw error;
    }
  },
};

// Check if API key exists
export const checkApiKeys = async (type) => {
  try {
    const response = await api.get(`/api-key?type=${type}`);
    return response.data.data.hasKey;
  } catch (error) {
    console.error('Error checking API key:', error);
    return false;
  }
};

export default {
  videoService,
  transcriptionService,
  aiService,
  checkApiKeys,
};
