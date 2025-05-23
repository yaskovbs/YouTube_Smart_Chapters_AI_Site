/**
 * Background script for YouTube Smart Chapters AI Chrome Extension
 * 
 * This script runs in the background and handles communication between
 * the extension, content script, and YouTube pages.
 */

// Track processing state with timeout mechanism
const processingVideos = new Map();
const PROCESSING_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes timeout

/**
 * Clear a video's processing state after a timeout period
 * @param {string} videoId - YouTube video ID to clear after timeout
 */
function setProcessingTimeout(videoId) {
  setTimeout(() => {
    if (processingVideos.has(videoId)) {
      const currentState = processingVideos.get(videoId);
      // Only clear if it's still in 'processing' status
      if (currentState.status === 'processing') {
        console.log(`Processing timeout reached for video ${videoId}, clearing state`);
        processingVideos.set(videoId, {
          ...currentState,
          status: 'error',
          error: 'Processing timeout reached'
        });
      }
    }
  }, PROCESSING_TIMEOUT_MS);
}

// Listen for installation events
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // First-time installation
    console.log("YouTube Smart Chapters AI extension installed.");
    
    // Initialize settings with default values
    chrome.storage.sync.set({
      language: 'he', // Default language set to Hebrew
      apiKeys: {
        openai: '',
        assemblyai: ''
      },
      preferences: {
        apiProvider: 'assemblyai', // Default API provider (better transcription)
        autoSuggestChapters: true,
        showNotifications: true
      }
    });
  } else if (details.reason === "update") {
    // Extension update - migrate from Google AI to AssemblyAI
    console.log(`YouTube Smart Chapters AI extension updated to version ${chrome.runtime.getManifest().version}`);
    
    // Update settings to use AssemblyAI instead of Google AI
    chrome.storage.sync.get(['apiKeys', 'preferences'], (result) => {
      const apiKeys = result.apiKeys || {};
      const preferences = result.preferences || {};
      
      // If user had Google AI key, suggest they set up AssemblyAI
      if (apiKeys.google && !apiKeys.assemblyai) {
        console.log('Migrating from Google AI to AssemblyAI - user will need to set new API key');
        delete apiKeys.google; // Remove old Google AI key
      }
      
      // Update preferences to use AssemblyAI as default
      preferences.apiProvider = 'assemblyai';
      
      chrome.storage.sync.set({
        apiKeys,
        preferences
      });
    });
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_YOUTUBE_VIDEO_ID') {
    // Extract and return YouTube video ID
    const url = message.url;
    const videoId = extractYouTubeVideoId(url);
    sendResponse({ videoId });
  } else if (message.type === 'EXTRACT_VIDEO_INFO') {
    // Get video information from YouTube page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('youtube.com/watch')) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_VIDEO_INFO' }, (response) => {
          sendResponse(response);
        });
        return true; // Required to use sendResponse asynchronously
      } else {
        sendResponse({ success: false, message: 'Not a YouTube video page' });
      }
    });
    return true; // Required to use sendResponse asynchronously
  } else if (message.type === 'APPLY_CHAPTERS') {
    // Apply generated chapters to YouTube video description
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('youtube.com/')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'APPLY_CHAPTERS',
          chapters: message.chapters
        }, (response) => {
          sendResponse(response);
        });
        return true; // Required to use sendResponse asynchronously
      } else {
        sendResponse({ success: false, message: 'Not a YouTube page' });
      }
    });
    return true; // Required to use sendResponse asynchronously
  } else if (message.type === 'PROCESS_YOUTUBE_VIDEO') {
    // Process YouTube video directly from content script
    const { videoId, videoInfo } = message;
    
    // Check if this video is already being processed
    if (processingVideos.has(videoId)) {
      const currentState = processingVideos.get(videoId);
      
      // If it's stuck in processing for over 10 minutes, reset it
      if (currentState.status === 'processing' && 
          (Date.now() - currentState.startTime) > PROCESSING_TIMEOUT_MS) {
        console.log(`Found stalled processing for video ${videoId}, resetting`);
        // Let it continue to the processing
      } 
      // If it has an error or is in a non-processing state, allow restart
      else if (currentState.status === 'error') {
        console.log(`Found failed processing for video ${videoId}, allowing restart`);
        // Let it continue to the processing
      }
      // Otherwise, it's actively being processed
      else {
        sendResponse({ 
          success: false, 
          message: 'This video is already being processed. Please try again or open the extension popup for more options.'
        });
        return true;
      }
    }
    
    // Store processing state
    processingVideos.set(videoId, {
      status: 'processing',
      startTime: Date.now(),
      info: videoInfo
    });
    
    // Set a timeout to clear the processing state if it gets stuck
    setProcessingTimeout(videoId);
    
    // Begin processing on the backend
    processVideoOnBackend(videoId, videoInfo)
      .then(result => {
        processingVideos.set(videoId, {
          ...processingVideos.get(videoId),
          status: 'completed',
          result
        });
        
        // If we have chapters, send them to the content script for display
        if (result && result.chapters) {
          chrome.tabs.query({}, tabs => {
            // Find any tabs with this video open
            const videoTabs = tabs.filter(tab => 
              tab.url.includes(`youtube.com/watch?v=${videoId}`) ||
              tab.url.includes(`youtube.com/watch?`) && tab.url.includes(`v=${videoId}`)
            );
            
            videoTabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, {
                type: 'DISPLAY_CHAPTERS',
                chapters: result.chapters
              });
            });
          });
        }
      })
      .catch(error => {
        console.error('Error processing video:', error);
        processingVideos.set(videoId, {
          ...processingVideos.get(videoId),
          status: 'error',
          error: error.message
        });
      });
    
    sendResponse({ 
      success: true, 
      message: 'Video processing started' 
    });
    return true;
  } else if (message.type === 'OPEN_EXTENSION_POPUP') {
    // Open the extension popup
    chrome.action.openPopup();
    sendResponse({ success: true });
    return true;
  } else if (message.type === 'GET_PROCESSING_STATUS') {
    // Get status of a processing video
    const { videoId } = message;
    const status = processingVideos.get(videoId) || { status: 'not_found' };
    sendResponse({ success: true, status });
    return true;
  } else if (message.type === 'CANCEL_PROCESSING') {
    // Allow cancellation of a processing video
    const { videoId } = message;
    if (processingVideos.has(videoId)) {
      // Update status to cancelled
      const currentState = processingVideos.get(videoId);
      processingVideos.set(videoId, {
        ...currentState,
        status: 'cancelled',
        endTime: Date.now()
      });
      sendResponse({ success: true, message: 'Processing cancelled' });
    } else {
      sendResponse({ success: false, message: 'Video not being processed' });
    }
    return true;
  } else if (message.type === 'FORCE_RESET_PROCESSING') {
    // Emergency option to force reset processing state for a video
    const { videoId } = message;
    if (videoId) {
      if (processingVideos.has(videoId)) {
        processingVideos.delete(videoId);
        sendResponse({ success: true, message: 'Processing state reset successfully' });
      } else {
        sendResponse({ success: false, message: 'Video not found in processing queue' });
      }
    } else {
      // Reset all processing if no specific videoId provided
      processingVideos.clear();
      sendResponse({ success: true, message: 'All processing states reset successfully' });
    }
    return true;
  }
});

/**
 * Process a video through our backend service
 * @param {string} videoId - YouTube video ID
 * @param {Object} videoInfo - Video information
 * @returns {Promise} - Resolves with processing result
 */
async function processVideoOnBackend(videoId, videoInfo) {
  const MAX_RETRIES = 3; // Maximum number of retries for network operations
  const RETRY_DELAY = 2000; // Delay between retries in milliseconds

  // Helper function to check server availability before making requests
  const checkServerAvailability = async (url) => {
    try {
      console.log(`Checking server availability at: ${url}/health`);
      
      // Use a proper timeout with AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${url}/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Check if response is ok and get status
      const isAvailable = response.ok;
      console.log(`Server availability check: ${isAvailable ? 'Available' : 'Unavailable'}, Status: ${response.status}`);
      
      return isAvailable;
    } catch (error) {
      console.warn(`Server availability check failed: ${error.message}`);
      
      // Log more details about the error to help debug
      if (error.name === 'AbortError') {
        console.warn('Server check timed out after 5 seconds');
      } else if (error.name === 'TypeError') {
        console.warn('Network error when checking server - server might be offline or URL is incorrect');
      }
      
      return false;
    }
  };

  // Helper function to perform fetch with retry logic
  const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        if (retries > 0) {
          console.log(`Network request failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchWithRetry(url, options, retries - 1);
        } else {
          throw new Error('השרת אינו זמין. בדוק את חיבור האינטרנט או שהשרת פעיל.');
        }
      }
      throw error;
    }
  };
  
  return new Promise((resolve, reject) => {
    // Get the backend URL from storage
    chrome.storage.sync.get(['backendUrl'], async (result) => {
      try {
        const backendUrl = result.backendUrl || 'http://localhost:8000'; // Default to localhost
        
        // Check if server is available
        const isServerAvailable = await checkServerAvailability(backendUrl);
        if (!isServerAvailable) {
          throw new Error('השרת אינו זמין כרגע. אנא נסה שוב מאוחר יותר.');
        }
        
        // First, process the YouTube URL
        const videoResponse = await fetchWithRetry(`${backendUrl}/api/video/process-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` })
        });
        
        if (!videoResponse.ok) {
          const errorData = await videoResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to process video URL');
        }
        
        const videoData = await videoResponse.json();
        
        if (!videoData.success) {
          throw new Error(videoData.message || 'Error processing video');
        }
        
        // Generate transcription using AssemblyAI
        const transcriptionResponse = await fetch(`${backendUrl}/api/transcription/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'youtube',
            sourceId: videoId,
            language: 'he' // Default to Hebrew, can be changed based on preference
          })
        });
        
        if (!transcriptionResponse.ok) {
          const errorData = await transcriptionResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to generate transcription');
        }
        
        const transcriptionData = await transcriptionResponse.json();
        
        if (!transcriptionData.success) {
          throw new Error(transcriptionData.message || 'Error generating transcription');
        }
        
        // Analyze content with AI
        const analysisResponse = await fetch(`${backendUrl}/api/ai/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcriptionId: transcriptionData.data.id,
            language: 'he',
            apiType: 'assemblyai' // Use AssemblyAI for basic chapters
          })
        });
        
        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to analyze content');
        }
        
        const analysisData = await analysisResponse.json();
        
        if (!analysisData.success) {
          throw new Error(analysisData.message || 'Error analyzing content');
        }
        
        // Generate chapters (may use OpenAI for enhancement if available)
        const chaptersResponse = await fetch(`${backendUrl}/api/ai/generate-chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysisId: analysisData.data.id,
            language: 'he',
            apiType: 'assemblyai' // Default to AssemblyAI chapters
          })
        });
        
        if (!chaptersResponse.ok) {
          const errorData = await chaptersResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to generate chapters');
        }
        
        const chaptersData = await chaptersResponse.json();
        
        if (!chaptersData.success) {
          throw new Error(chaptersData.message || 'Error generating chapters');
        }
        
        // Generate metadata (prefer OpenAI if available, fallback to AssemblyAI)
        const metadataResponse = await fetch(`${backendUrl}/api/ai/generate-metadata`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysisId: analysisData.data.id,
            language: 'he',
            apiType: 'openai' // Prefer OpenAI for metadata if available
          })
        });
        
        let metadataData;
        if (metadataResponse.ok) {
          metadataData = await metadataResponse.json();
        } else {
          // Fallback to simple metadata generation
          metadataData = {
            success: true,
            data: {
              metadata: {
                title: videoInfo?.title || 'YouTube Video',
                description: 'Generated chapters for this video.',
                tags: [],
                hashtags: []
              }
            }
          };
        }
        
        // Return all results
        resolve({
          videoData: videoData.data,
          transcription: transcriptionData.data,
          analysis: analysisData.data,
          chapters: chaptersData.data.chapters || [],
          metadata: metadataData.data.metadata
        });
      } catch (error) {
        console.error('Error processing video:', error);
        // Extract error message to prevent [object Object] errors
        let errorMessage = 'An unknown error occurred during video processing';
        
        // Network error handling
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          errorMessage = 'לא ניתן להתחבר לשרת. אנא בדוק את חיבור האינטרנט או שהשרת זמין.';
        } else if (error && typeof error === 'object') {
          if (error.message) {
            errorMessage = error.message;
          } else if (error.toString && error.toString() !== '[object Object]') {
            errorMessage = error.toString();
          } else if (error.statusText) {
            errorMessage = error.statusText;
          }
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        // Display more helpful error messages
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'SHOW_ERROR_NOTIFICATION',
              error: errorMessage
            });
          }
        });
        
        reject(new Error(errorMessage));
      }
    });
  });
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not found
 */
function extractYouTubeVideoId(url) {
  if (!url) return null;
  
  // Handle standard YouTube watch URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}
