/**
 * Background script for YouTube Smart Chapters AI Chrome Extension
 * 
 * This script runs in the background and handles communication between
 * the extension, content script, and YouTube pages.
 */

// Track processing state
const processingVideos = new Map();

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
        google: ''
      },
      preferences: {
        apiProvider: 'openai', // Default API provider
        autoSuggestChapters: true,
        showNotifications: true
      }
    });
  } else if (details.reason === "update") {
    // Extension update
    console.log(`YouTube Smart Chapters AI extension updated to version ${chrome.runtime.getManifest().version}`);
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
      sendResponse({ 
        success: false, 
        message: 'This video is already being processed' 
      });
      return true;
    }
    
    // Store processing state
    processingVideos.set(videoId, {
      status: 'processing',
      startTime: Date.now(),
      info: videoInfo
    });
    
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
  }
});

/**
 * Process a video through our backend service
 * @param {string} videoId - YouTube video ID
 * @param {Object} videoInfo - Video information
 * @returns {Promise} - Resolves with processing result
 */
async function processVideoOnBackend(videoId, videoInfo) {
  // This function would normally make API calls to the backend service
  // For this implementation, we'll simulate the process
  
  return new Promise((resolve, reject) => {
    // Get the backend URL from storage
    chrome.storage.sync.get(['backendUrl'], async (result) => {
      try {
        const backendUrl = result.backendUrl || 'http://localhost:5000'; // Default to localhost
        
        // First, process the YouTube URL
        const videoResponse = await fetch(`${backendUrl}/api/video/process-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` })
        });
        
        if (!videoResponse.ok) {
          throw new Error('Failed to process video URL');
        }
        
        const videoData = await videoResponse.json();
        
        if (!videoData.success) {
          throw new Error(videoData.message || 'Error processing video');
        }
        
        // Generate transcription
        const transcriptionResponse = await fetch(`${backendUrl}/api/transcription/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'youtube',
            sourceId: videoId,
            language: 'auto' // Auto-detect or use preference
          })
        });
        
        if (!transcriptionResponse.ok) {
          throw new Error('Failed to generate transcription');
        }
        
        const transcriptionData = await transcriptionResponse.json();
        
        if (!transcriptionData.success) {
          throw new Error(transcriptionData.message || 'Error generating transcription');
        }
        
        // Analyze content
        const analysisResponse = await fetch(`${backendUrl}/api/ai/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcriptionId: transcriptionData.data.transcriptionId,
            language: 'auto' // Auto-detect or use preference
          })
        });
        
        if (!analysisResponse.ok) {
          throw new Error('Failed to analyze content');
        }
        
        const analysisData = await analysisResponse.json();
        
        if (!analysisData.success) {
          throw new Error(analysisData.message || 'Error analyzing content');
        }
        
        // Generate chapters
        const chaptersResponse = await fetch(`${backendUrl}/api/ai/generate-chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysisId: analysisData.data.analysisId,
            language: 'auto' // Auto-detect or use preference
          })
        });
        
        if (!chaptersResponse.ok) {
          throw new Error('Failed to generate chapters');
        }
        
        const chaptersData = await chaptersResponse.json();
        
        if (!chaptersData.success) {
          throw new Error(chaptersData.message || 'Error generating chapters');
        }
        
        // Generate metadata
        const metadataResponse = await fetch(`${backendUrl}/api/ai/generate-metadata`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysisId: analysisData.data.analysisId,
            language: 'auto' // Auto-detect or use preference
          })
        });
        
        if (!metadataResponse.ok) {
          throw new Error('Failed to generate metadata');
        }
        
        const metadataData = await metadataResponse.json();
        
        if (!metadataData.success) {
          throw new Error(metadataData.message || 'Error generating metadata');
        }
        
        // Return all results
        resolve({
          videoData: videoData.data,
          transcription: transcriptionData.data,
          analysis: analysisData.data,
          chapters: chaptersData.data.chapters,
          metadata: metadataData.data.metadata
        });
      } catch (error) {
        reject(error);
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
