// Initialization script for YouTube Smart Chapters AI extension

// This script handles the initialization of the extension
// and ensures all components are loaded properly

// Function to initialize the extension
function initializeExtension() {
    console.log('Extension initialization starting...');
    
    // Check if running in extension context
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.storage) {
        console.warn('Not running in a valid Chrome extension context');
        
        // Display error if displayError function is available
        if (typeof displayError === 'function') {
            displayError('Extension context error. Please reload or reinstall the extension.');
        }
        return;
    }
    
    // Load API keys when extension is opened
    loadApiKeysOnOpen();
    
    // Check for active processing jobs
    checkActiveProcessingJobs();
    
    console.log('Extension initialization complete!');
}

// Load API keys when the extension is opened
function loadApiKeysOnOpen() {
    try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['apiKeys'], function(result) {
                const apiKeys = result.apiKeys || {};
                const settingsPanel = document.getElementById('settingsPanel');
                
                // If no API keys are set, automatically open the settings panel
                if ((!apiKeys.openai && !apiKeys.google) && settingsPanel) {
                    settingsPanel.style.display = 'block';
                }
                
                // Update input fields if they exist
                const openaiKeyInput = document.getElementById('openaiKey');
                const googleKeyInput = document.getElementById('googleKey');
                
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
        if (typeof displayError === 'function') {
            displayError('Could not load saved API keys. Please try reloading.');
        }
    }
}

// Check if there are any active processing jobs
function checkActiveProcessingJobs() {
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
}

// Initialize the extension when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing extension...');
    initializeExtension();
});
