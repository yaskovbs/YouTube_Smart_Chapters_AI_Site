/**
 * Content script for YouTube Smart Chapters AI Chrome Extension
 * 
 * This script is injected into YouTube pages and allows the extension
 * to interact with YouTube's interface.
 */

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_VIDEO_INFO') {
    // Extract video information from the YouTube page
    const videoInfo = extractVideoInfo();
    sendResponse(videoInfo);
  } else if (message.type === 'APPLY_CHAPTERS') {
    // Apply generated chapters to video description
    const result = applyChaptersToDescription(message.chapters);
    sendResponse(result);
  }
  return true; // Required to use sendResponse asynchronously
});

/**
 * Extract video information from the current YouTube page
 * @returns {Object} Video information
 */
function extractVideoInfo() {
  try {
    // Get video title
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
    const title = titleElement ? titleElement.textContent.trim() : '';
    
    // Get video ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    
    // Get channel name
    const channelElement = document.querySelector('#channel-name #text');
    const channel = channelElement ? channelElement.textContent.trim() : '';
    
    // Get video duration
    const timeElement = document.querySelector('.ytp-time-duration');
    const duration = timeElement ? timeElement.textContent.trim() : '';
    
    // Get description
    const descriptionElement = document.querySelector('#description-text');
    const description = descriptionElement ? descriptionElement.textContent.trim() : '';
    
    return {
      success: true,
      data: {
        videoId,
        title,
        channel,
        duration,
        description,
        url: window.location.href
      }
    };
  } catch (error) {
    console.error('Error extracting video info:', error);
    return {
      success: false,
      message: 'Error extracting video information',
      error: error.message
    };
  }
}

/**
 * Apply generated chapters to video description
 * This is a simulation as YouTube doesn't allow programmatic editing of descriptions
 * In a real scenario, we would show the user how to copy-paste the chapters
 * @param {Array} chapters - Array of chapter objects
 * @returns {Object} Result of the operation
 */
function applyChaptersToDescription(chapters) {
  try {
    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return {
        success: false,
        message: 'No chapters provided'
      };
    }
    
    // Format chapters for description
    const formattedChapters = chapters.map(chapter => 
      `${chapter.formattedStartTime} ${chapter.title}`
    ).join('\n');
    
    // Create a modal dialog to show the formatted chapters
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modal.style.zIndex = '9999';
    modal.style.maxWidth = '80%';
    modal.style.maxHeight = '80%';
    modal.style.overflow = 'auto';
    
    const title = document.createElement('h2');
    title.textContent = 'Generated Chapters';
    title.style.marginTop = '0';
    title.style.marginBottom = '16px';
    
    const instructions = document.createElement('p');
    instructions.textContent = 'Copy these chapters and add them to your video description:';
    instructions.style.marginBottom = '16px';
    
    const textarea = document.createElement('textarea');
    textarea.value = formattedChapters;
    textarea.style.width = '100%';
    textarea.style.minHeight = '200px';
    textarea.style.padding = '8px';
    textarea.style.marginBottom = '16px';
    textarea.style.border = '1px solid #ccc';
    textarea.style.borderRadius = '4px';
    textarea.style.fontFamily = 'monospace';
    
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy to Clipboard';
    copyButton.style.backgroundColor = '#1976d2';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.padding = '8px 16px';
    copyButton.style.borderRadius = '4px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.marginRight = '8px';
    copyButton.onclick = () => {
      textarea.select();
      document.execCommand('copy');
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy to Clipboard';
      }, 2000);
    };
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#6c757d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 16px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);
    
    modal.appendChild(title);
    modal.appendChild(instructions);
    modal.appendChild(textarea);
    modal.appendChild(buttonContainer);
    
    document.body.appendChild(modal);
    
    return {
      success: true,
      message: 'Chapters displayed to user'
    };
  } catch (error) {
    console.error('Error applying chapters:', error);
    return {
      success: false,
      message: 'Error applying chapters to description',
      error: error.message
    };
  }
}

// Initialize the content script
function initialize() {
  console.log('YouTube Smart Chapters AI content script initialized');
  
  // Check if we're on a YouTube video page
  if (window.location.href.includes('youtube.com/watch')) {
    // Could add event listeners or other initialization code here
    // For example, we could add a custom button to the YouTube interface
  }
}

// Run initialization when the page is fully loaded
if (document.readyState === 'complete') {
  initialize();
} else {
  window.addEventListener('load', initialize);
}
