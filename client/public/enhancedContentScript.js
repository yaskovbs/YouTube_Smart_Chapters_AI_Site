/**
 * Enhanced Content Script for YouTube Smart Chapters AI Chrome Extension
 * 
 * This script injects a more robust UI into YouTube pages, allowing users to:
 * 1. Generate chapters directly from the current video
 * 2. Apply generated content to YouTube Studio
 * 3. Access the full extension functionality from within YouTube
 */

// Main container for our extension UI
let smartChaptersContainer = null;
let isProcessing = false;
let currentVideoId = null;

// Initialize the enhanced content script
function initialize() {
  console.log('YouTube Smart Chapters AI enhanced content script initialized');
  
  // Only run on YouTube video pages
  if (!window.location.href.includes('youtube.com/watch')) {
    return;
  }
  
  // Get video ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  currentVideoId = urlParams.get('v');
  
  if (!currentVideoId) {
    console.error('Could not find video ID');
    return;
  }
  
  // Create our UI container once the YouTube UI is fully loaded
  waitForYouTubeElement('#meta-contents').then(() => {
    createExtensionUI();
    
    // Monitor URL changes (YouTube is a SPA)
    monitorUrlChanges();
  });
}

/**
 * Wait for a YouTube element to be available in the DOM
 * @param {string} selector - CSS selector to wait for
 * @returns {Promise} - Resolves when element is found
 */
function waitForYouTubeElement(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

/**
 * Monitor URL changes to update UI when navigating between videos
 */
function monitorUrlChanges() {
  let lastUrl = window.location.href;
  
  // Create a new observer instance
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      
      // Check if we're still on a video page
      if (window.location.href.includes('youtube.com/watch')) {
        // Get new video ID
        const urlParams = new URLSearchParams(window.location.search);
        const newVideoId = urlParams.get('v');
        
        if (newVideoId && newVideoId !== currentVideoId) {
          currentVideoId = newVideoId;
          
          // Remove existing UI
          if (smartChaptersContainer) {
            smartChaptersContainer.remove();
          }
          
          // Recreate UI for new video
          waitForYouTubeElement('#meta-contents').then(() => {
            createExtensionUI();
          });
        }
      } else if (smartChaptersContainer) {
        // Not on a video page anymore, remove our UI
        smartChaptersContainer.remove();
      }
    }
  });
  
  // Start observing
  observer.observe(document, { subtree: true, childList: true });
}

/**
 * Create the extension UI and inject it into YouTube's page
 */
function createExtensionUI() {
  // Find the container where we'll insert our UI
  const metaContents = document.querySelector('#meta-contents');
  if (!metaContents) {
    console.error('Could not find YouTube meta contents');
    return;
  }
  
  // Create our container
  smartChaptersContainer = document.createElement('div');
  smartChaptersContainer.className = 'smart-chapters-container';
  smartChaptersContainer.style.cssText = `
    margin: 16px 0;
    padding: 16px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    font-family: 'Roboto', sans-serif;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  `;
  
  const title = document.createElement('h2');
  title.textContent = 'YouTube Smart Chapters AI';
  title.style.cssText = `
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #030303;
  `;
  
  const logo = document.createElement('div');
  logo.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#FF0000"/>
      <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#FF0000"/>
    </svg>
  `;
  
  header.appendChild(logo);
  header.appendChild(title);
  
  // Create content area
  const content = document.createElement('div');
  
  // Create action buttons
  const actionBar = document.createElement('div');
  actionBar.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  `;
  
  const generateButton = createButton('Generate Smart Chapters', '#FF0000', () => {
    if (isProcessing) return;
    
    handleGenerateSmartChapters();
  });
  
  const openExtensionButton = createButton('Open Full Extension', '#065FD4', () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        chrome.runtime.sendMessage({ type: 'OPEN_EXTENSION_POPUP' }, function(response) {
          if (chrome.runtime.lastError) {
            console.error('Error opening extension popup:', chrome.runtime.lastError);
          }
        });
      } catch (error) {
        console.error('Error opening extension popup:', error);
      }
    } else {
      console.error('Chrome runtime not available');
    }
  });
  
  actionBar.appendChild(generateButton);
  actionBar.appendChild(openExtensionButton);
  
  // Assemble UI
  smartChaptersContainer.appendChild(header);
  smartChaptersContainer.appendChild(content);
  smartChaptersContainer.appendChild(actionBar);
  
  // Insert into YouTube page
  metaContents.parentNode.insertBefore(smartChaptersContainer, metaContents);
}

/**
 * Create a styled button element
 * @param {string} text - Button text
 * @param {string} color - Button color
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} - Styled button
 */
function createButton(text, color, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.cssText = `
    background-color: ${color};
    color: white;
    border: none;
    border-radius: 18px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  `;
  
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = lightenColor(color, 10);
  });
  
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = color;
  });
  
  button.addEventListener('click', onClick);
  
  return button;
}

/**
 * Lighten a hex color by a percentage
 * @param {string} color - Hex color
 * @param {number} percent - Percentage to lighten
 * @returns {string} - Lightened color
 */
function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

/**
 * Handle generating smart chapters for the current video
 */
function handleGenerateSmartChapters() {
  isProcessing = true;
  updateContentArea('Loading...', true);
  
  // Extract video information
  const videoInfo = extractVideoInfo();
  
  // Send message to background script to start processing
  try {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      updateContentArea(`
        <div style="color: #d32f2f; padding: 16px; text-align: center;">
          <p>Error: Chrome extension APIs not available.</p>
          <p>Please reload the page or reinstall the extension.</p>
        </div>
      `);
      isProcessing = false;
      return;
    }

    chrome.runtime.sendMessage(
      { 
        type: 'PROCESS_YOUTUBE_VIDEO', 
        videoId: currentVideoId,
        videoInfo: videoInfo && videoInfo.data ? videoInfo.data : { videoId: currentVideoId }
      }, 
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          updateContentArea(`
            <div style="color: #d32f2f; padding: 16px; text-align: center;">
              <p>Error: ${chrome.runtime.lastError.message || 'Could not communicate with extension'}</p>
              <p>Please reload the page or reinstall the extension.</p>
            </div>
          `);
          isProcessing = false;
          return;
        }
        if (response && response.success) {
          // Show instruction to open the extension popup
          updateContentArea(`
            <div style="text-align: center; padding: 16px;">
              <p>Video analysis started! Open the extension popup to view results.</p>
              <p>This may take a few minutes depending on the video length.</p>
            </div>
          `);
        } else {
          // Show error with recovery options
          const errorMessage = response ? response.message : 'Could not start video processing';
          const isAlreadyProcessingError = errorMessage.includes('already being processed');
          
          let errorHtml = `
            <div style="color: #d32f2f; padding: 16px;">
              <p>Error: ${errorMessage}</p>
          `;
          
          // If it's the "already being processed" error, offer more options
          if (isAlreadyProcessingError) {
            errorHtml += `
              <p>This could happen if:</p>
              <ul style="text-align: left; margin-bottom: 16px;">
                <li>You already started processing this video</li>
                <li>A previous processing attempt didn't complete properly</li>
              </ul>
              <div style="display: flex; justify-content: center; gap: 8px; margin-top: 16px;">
                <button id="check-status-btn" style="
                  background-color: #065FD4;
                  color: white;
                  border: none;
                  border-radius: 18px;
                  padding: 8px 16px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                ">Check Status</button>
                <button id="reset-processing-btn" style="
                  background-color: #d32f2f;
                  color: white;
                  border: none;
                  border-radius: 18px;
                  padding: 8px 16px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                ">Reset Processing</button>
              </div>
            `;
          } else {
            errorHtml += `<p>Please try again or open the extension popup for more options.</p>`;
          }
          
          errorHtml += `</div>`;
          updateContentArea(errorHtml);
          
          // Add event listeners for the recovery buttons
          if (isAlreadyProcessingError) {
            setTimeout(() => {
              // Status check button
              const checkStatusBtn = document.getElementById('check-status-btn');
              if (checkStatusBtn) {
                checkStatusBtn.addEventListener('click', () => {
                  checkVideoProcessingStatus();
                });
              }
              
              // Reset processing button
              const resetProcessingBtn = document.getElementById('reset-processing-btn');
              if (resetProcessingBtn) {
                resetProcessingBtn.addEventListener('click', () => {
                  resetVideoProcessing();
                });
              }
            }, 100);
          }
        }
        
        isProcessing = false;
      }
    );
  } catch (error) {
    console.error('Error processing video:', error);
    // Get a meaningful error message even if it's an object
    let errorMessage = 'An unexpected error occurred';
    if (error) {
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.toString && error.toString() !== '[object Object]') {
        errorMessage = error.toString();
      }
    }
    updateContentArea(`
      <div style="color: #d32f2f; padding: 16px; text-align: center;">
        <p>Error: ${errorMessage}</p>
        <p>Please try again later or contact support.</p>
        <p>If this issue persists, check that your API keys are correctly set.</p>
      </div>
    `);
    isProcessing = false;
  }
}

/**
 * Check the current processing status of a video
 */
function checkVideoProcessingStatus() {
  updateContentArea('Checking status...', true);
  
  chrome.runtime.sendMessage(
    { 
      type: 'GET_PROCESSING_STATUS', 
      videoId: currentVideoId
    }, 
    (response) => {
      if (response && response.success) {
        const status = response.status;
        
        if (status.status === 'not_found') {
          updateContentArea(`
            <div style="padding: 16px; text-align: center;">
              <p>This video is not currently being processed.</p>
              <p>You can try generating chapters again.</p>
            </div>
          `);
        } else {
          // Format the status display
          let statusHtml = `
            <div style="padding: 16px;">
              <h3 style="margin-top: 0; font-size: 14px; font-weight: 500;">Processing Status:</h3>
              <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; margin-bottom: 16px;">
                <p><strong>Status:</strong> ${status.status}</p>
                <p><strong>Started:</strong> ${new Date(status.startTime).toLocaleString()}</p>
          `;
          
          if (status.error) {
            statusHtml += `<p><strong>Error:</strong> ${status.error}</p>`;
          }
          
          if (status.status === 'processing') {
            const elapsedMinutes = Math.round((Date.now() - status.startTime) / 60000);
            statusHtml += `<p><strong>Processing time:</strong> ${elapsedMinutes} minutes</p>`;
            
            // Add cancel button for in-progress processing
            statusHtml += `
              </div>
              <div style="display: flex; justify-content: center;">
                <button id="cancel-processing-btn" style="
                  background-color: #d32f2f;
                  color: white;
                  border: none;
                  border-radius: 18px;
                  padding: 8px 16px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                ">Cancel Processing</button>
              </div>
            `;
          } else {
            // For completed or error states, add reset button
            statusHtml += `
              </div>
              <div style="display: flex; justify-content: center;">
                <button id="reset-processing-btn" style="
                  background-color: #065FD4;
                  color: white;
                  border: none;
                  border-radius: 18px;
                  padding: 8px 16px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                ">Reset & Try Again</button>
              </div>
            `;
          }
          
          statusHtml += `</div>`;
          updateContentArea(statusHtml);
          
          // Add event listeners for action buttons
          setTimeout(() => {
            const cancelBtn = document.getElementById('cancel-processing-btn');
            if (cancelBtn) {
              cancelBtn.addEventListener('click', () => {
                cancelVideoProcessing();
              });
            }
            
            const resetBtn = document.getElementById('reset-processing-btn');
            if (resetBtn) {
              resetBtn.addEventListener('click', () => {
                resetVideoProcessing();
              });
            }
          }, 100);
        }
      } else {
        // Get error message in user-friendly format
        let errorMessage = 'Unknown error';
        if (response && response.message) {
          errorMessage = response.message;
        } else if (!response) {
          errorMessage = 'No response received from the extension';
        }
        
        updateContentArea(`
          <div style="color: #d32f2f; padding: 16px; text-align: center;">
            <p>Error checking processing status: ${errorMessage}</p>
            <p>This could be due to connection issues or a server problem.</p>
            <p>Please try refreshing the page or opening the extension popup.</p>
          </div>
        `);
      }
    }
  );
}

/**
 * Cancel an in-progress video processing job
 */
function cancelVideoProcessing() {
  updateContentArea('Cancelling...', true);
  
  chrome.runtime.sendMessage(
    { 
      type: 'CANCEL_PROCESSING', 
      videoId: currentVideoId
    }, 
    (response) => {
      if (response && response.success) {
        updateContentArea(`
          <div style="padding: 16px; text-align: center;">
            <p>Processing cancelled successfully.</p>
            <p>You can now try generating chapters again.</p>
          </div>
        `);
      } else {
        updateContentArea(`
          <div style="color: #d32f2f; padding: 16px; text-align: center;">
            <p>Error cancelling processing: ${response ? response.message : 'Unknown error'}</p>
          </div>
        `);
      }
    }
  );
}

/**
 * Reset the processing state for a video
 */
function resetVideoProcessing() {
  updateContentArea('Resetting...', true);
  
  chrome.runtime.sendMessage(
    { 
      type: 'FORCE_RESET_PROCESSING', 
      videoId: currentVideoId
    }, 
    (response) => {
      if (response && response.success) {
        updateContentArea(`
          <div style="padding: 16px; text-align: center;">
            <p>Processing state reset successfully.</p>
            <p>You can now try generating chapters again.</p>
          </div>
        `);
      } else {
        updateContentArea(`
          <div style="color: #d32f2f; padding: 16px; text-align: center;">
            <p>Error resetting processing: ${response ? response.message : 'Unknown error'}</p>
          </div>
        `);
      }
    }
  );
}

/**
 * Update the content area of our UI
 * @param {string} html - HTML content
 * @param {boolean} loading - Whether to show loading spinner
 */
function updateContentArea(html, loading = false) {
  const content = smartChaptersContainer.querySelector('div:nth-child(2)');
  
  if (loading) {
    content.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; padding: 32px;">
        <div class="smart-chapters-spinner" style="
          width: 24px;
          height: 24px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #FF0000;
          border-radius: 50%;
          animation: smart-chapters-spin 1s linear infinite;
          margin-right: 12px;
        "></div>
        <div style="font-size: 14px;">Processing video...</div>
      </div>
      <style>
        @keyframes smart-chapters-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  } else {
    content.innerHTML = html;
  }
}

/**
 * Display chapters in the content area
 * @param {Array} chapters - Array of chapter objects
 */
function displayChapters(chapters) {
  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    updateContentArea(`
      <div style="color: #d32f2f; padding: 16px; text-align: center;">
        <p>No chapters generated. Please try again.</p>
      </div>
    `);
    return;
  }
  
  let chaptersHtml = `
    <div style="padding: 16px;">
      <h3 style="margin-top: 0; font-size: 14px; font-weight: 500;">Generated Chapters:</h3>
      <div style="max-height: 300px; overflow-y: auto; margin-bottom: 16px;">
        <ul style="list-style-type: none; padding: 0; margin: 0;">
  `;
  
  chapters.forEach(chapter => {
    chaptersHtml += `
      <li style="
        padding: 8px;
        margin-bottom: 8px;
        background-color: #f9f9f9;
        border-radius: 4px;
        display: flex;
        align-items: center;
      ">
        <div style="color: #065FD4; font-weight: 500; margin-right: 12px;">
          ${chapter.formattedStartTime}
        </div>
        <div style="flex-grow: 1;">${chapter.title}</div>
      </li>
    `;
  });
  
  chaptersHtml += `
        </ul>
      </div>
      <div>
        <button id="copy-chapters-btn" style="
          background-color: #065FD4;
          color: white;
          border: none;
          border-radius: 18px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        ">Copy All Chapters</button>
      </div>
    </div>
  `;
  
  updateContentArea(chaptersHtml);
  
  // Add event listener to copy button
  setTimeout(() => {
    const copyButton = document.getElementById('copy-chapters-btn');
    if (copyButton) {
      copyButton.addEventListener('click', () => {
        const formattedChapters = chapters.map(chapter => 
          `${chapter.formattedStartTime} ${chapter.title}`
        ).join('\n');
        
        navigator.clipboard.writeText(formattedChapters).then(() => {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy All Chapters';
          }, 2000);
        });
      });
    }
  }, 100);
}

/**
 * Extract video information from the current YouTube page
 * @returns {Object} Video information
 */
function extractVideoInfo() {
  try {
    // Get video title
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
    const title = titleElement ? titleElement.textContent.trim() : '';
    
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
        videoId: currentVideoId,
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

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_VIDEO_INFO') {
    // Extract video information from the YouTube page
    const videoInfo = extractVideoInfo();
    sendResponse(videoInfo);
  } else if (message.type === 'DISPLAY_CHAPTERS') {
    // Display chapters in our UI
    displayChapters(message.chapters);
    sendResponse({ success: true });
  } else if (message.type === 'SHOW_ERROR_NOTIFICATION') {
    // Display error notification
    showErrorNotification(message.error);
    sendResponse({ success: true });
  }
  return true; // Required to use sendResponse asynchronously
});

/**
 * Show an error notification to the user
 * @param {string} errorMessage - The error message to display
 */
function showErrorNotification(errorMessage) {
  if (!smartChaptersContainer) return;
  
  const content = smartChaptersContainer.querySelector('div:nth-child(2)');
  if (!content) return;
  
  let errorHtml = `
    <div style="color: #d32f2f; padding: 16px; text-align: center; background-color: #ffebee; border-radius: 8px; margin-bottom: 16px;">
      <h3 style="margin-top: 0; font-size: 16px; color: #d32f2f;">שגיאת עיבוד</h3>
      <p style="margin-bottom: 16px;">${errorMessage}</p>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <p style="font-size: 14px; margin: 0;">הצעות לפתרון:</p>
        <ul style="text-align: right; padding-right: 20px; margin-top: 8px;">
          <li>בדוק את חיבור האינטרנט שלך</li>
          <li>וודא שהשרת פועל ונגיש</li>
          <li>בדוק שמפתחות ה-API תקינים</li>
          <li>נסה לרענן את העמוד ולנסות שוב</li>
        </ul>
        <button id="retry-connection-btn" style="
          background-color: #d32f2f;
          color: white;
          border: none;
          border-radius: 18px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 8px;
        ">נסה שוב</button>
      </div>
    </div>
  `;
  
  content.innerHTML = errorHtml;
  
  // Add event listener for retry button
  setTimeout(() => {
    const retryBtn = document.getElementById('retry-connection-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        // Show loading indicator
        updateContentArea('טוען...', true);
        // Wait a moment then try again
        setTimeout(() => {
          handleGenerateSmartChapters();
        }, 1000);
      });
    }
  }, 100);
  
  isProcessing = false;
}

// Run initialization when the page is fully loaded
if (document.readyState === 'complete') {
  initialize();
} else {
  window.addEventListener('load', initialize);
}
