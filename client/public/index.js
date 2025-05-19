// Popup script for YouTube Smart Chapters AI extension - Simplified version

// Global function to display errors on the popup
function displayError(message) {
  console.error(message);
  let errorElement = document.getElementById('extension-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = 'extension-error';
    errorElement.style.cssText = `
      background-color: #ffebee;
      color: #d32f2f;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      font-size: 14px;
    `;
    document.body.insertBefore(errorElement, document.body.firstChild);
  }
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// This function should be called by buttonHandlers.js
function loadApiKeys() {
  try {
    console.log("Loading API keys...");
    const openaiKeyInput = document.getElementById('openaiKey');
    const googleKeyInput = document.getElementById('googleKey');
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['apiKeys'], function(result) {
        const apiKeys = result.apiKeys || {};
        if (apiKeys.openai && openaiKeyInput) {
          openaiKeyInput.value = apiKeys.openai;
        }
        if (apiKeys.google && googleKeyInput) {
          googleKeyInput.value = apiKeys.google;
        }
      });
    }
  } catch (error) {
    console.error('Error loading API keys:', error);
    displayError('Could not load saved API keys. Please try reloading.');
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Extension popup loaded - Initialization from index.js');
  
  // Check if there's an active processing job and update UI accordingly
  try {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs || tabs.length === 0) {
          return;
        }
        
        const currentTab = tabs[0];
        if (currentTab && currentTab.url && currentTab.url.includes('youtube.com/watch')) {
          try {
            const videoId = new URL(currentTab.url).searchParams.get('v');
            
            if (!videoId) {
              return;
            }
            
            // Check status with background script
            chrome.runtime.sendMessage(
              { 
                type: 'GET_PROCESSING_STATUS',
                videoId: videoId
              }, 
              function(response) {
                const analyzeButton = document.getElementById('analyzeCurrentVideo');
                if (response && response.success && response.status && analyzeButton) {
                  if (response.status.status === 'processing') {
                    analyzeButton.textContent = 'Processing...';
                    analyzeButton.disabled = true;
                  } else if (response.status.status === 'completed') {
                    analyzeButton.textContent = 'View Results';
                  }
                }
              }
            );
          } catch (error) {
            console.error('Error extracting video ID:', error);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error checking processing status:', error);
  }
  
  // Check API keys on popup load and show settings if none are set
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['apiKeys'], function(result) {
        const apiKeys = result.apiKeys || {};
        const settingsPanel = document.getElementById('settingsPanel');
        // If no API keys are set, automatically open the settings panel
        if ((!apiKeys.openai && !apiKeys.google) && settingsPanel) {
          settingsPanel.style.display = 'block';
        }
      });
    }
  } catch (error) {
    console.error('Error checking API keys:', error);
  }
});

// Expose functions that might be called from buttonHandlers.js
window.displayError = displayError;
window.loadApiKeys = loadApiKeys;
