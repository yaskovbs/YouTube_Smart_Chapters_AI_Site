// Direct button handlers as a fallback if event listeners fail
function handleAnalyzeClick() {
    console.log('Direct analyze button click');
    const errorEl = document.getElementById('extension-error');
    if (errorEl) {
        errorEl.textContent = 'Analyze button clicked directly';
        errorEl.style.display = 'block';
    }
    
    // Try using the Chrome API directly
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs && tabs.length > 0) {
                const currentTab = tabs[0];
                if (currentTab.url && currentTab.url.includes('youtube.com/watch')) {
                    const button = document.getElementById('analyzeCurrentVideo');
                    if (button) {
                        button.textContent = 'Analyzing...';
                        button.disabled = true;
                    }
                } else if (errorEl) {
                    errorEl.textContent = 'Not a YouTube video page';
                }
            }
        });
    }
}

function handleSettingsClick() {
    console.log('Direct settings button click');
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
    }
}

function handleCloseSettings() {
    console.log('Direct close settings button click');
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.style.display = 'none';
    }
    const message = document.getElementById('settingsMessage');
    if (message) {
        message.style.display = 'none';
    }
}

function handleSaveKeys() {
    console.log('Direct save keys button click');
    const openaiKeyInput = document.getElementById('openaiKey');
    const googleKeyInput = document.getElementById('googleKey');
    const settingsMessage = document.getElementById('settingsMessage');
    
    if (!openaiKeyInput || !googleKeyInput || !settingsMessage) {
        console.error('Required elements not found');
        return;
    }
    
    try {
        const openaiKey = openaiKeyInput.value.trim();
        const googleKey = googleKeyInput.value.trim();
        
        // Validate keys (basic validation)
        let hasError = false;
        let errorMessage = '';
        
        if (openaiKey && openaiKey.length < 20) {
            hasError = true;
            errorMessage = 'OpenAI API key should be at least 20 characters';
        } else if (googleKey && googleKey.length < 20) {
            hasError = true;
            errorMessage = 'Google API key should be at least 20 characters';
        }
        
        if (hasError) {
            // Show error message
            settingsMessage.textContent = errorMessage;
            settingsMessage.style.backgroundColor = '#ffebee';
            settingsMessage.style.color = '#d32f2f';
            settingsMessage.style.display = 'block';
            return;
        }
        
        // Save keys to Chrome storage
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['apiKeys'], function(result) {
                try {
                    const apiKeys = result.apiKeys || {};
                    
                    if (openaiKey) {
                        apiKeys.openai = openaiKey;
                    }
                    
                    if (googleKey) {
                        apiKeys.google = googleKey;
                    }
                    
                    chrome.storage.sync.set({ apiKeys }, function() {
                        // Show success message
                        settingsMessage.textContent = 'API keys saved successfully!';
                        settingsMessage.style.backgroundColor = '#e8f5e9';
                        settingsMessage.style.color = '#2e7d32';
                        settingsMessage.style.display = 'block';
                        
                        // Hide success message after 3 seconds
                        setTimeout(function() {
                            if (settingsMessage) {
                                settingsMessage.style.display = 'none';
                            }
                        }, 3000);
                    });
                } catch (error) {
                    console.error('Error saving API keys:', error);
                    const errorEl = document.getElementById('extension-error');
                    if (errorEl) {
                        errorEl.textContent = 'Could not save API keys: ' + error.message;
                        errorEl.style.display = 'block';
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error in save keys logic:', error);
        const errorEl = document.getElementById('extension-error');
        if (errorEl) {
            errorEl.textContent = 'Error saving keys: ' + error.message;
            errorEl.style.display = 'block';
        }
    }
}

function handleShowOpenaiKey() {
    const checkbox = document.getElementById('showOpenaiKey');
    const input = document.getElementById('openaiKey');
    if (checkbox && input) {
        input.type = checkbox.checked ? 'text' : 'password';
    }
}

function handleShowGoogleKey() {
    const checkbox = document.getElementById('showGoogleKey');
    const input = document.getElementById('googleKey');
    if (checkbox && input) {
        input.type = checkbox.checked ? 'text' : 'password';
    }
}

// Add the listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Button handlers initializing...');
    
    // Get button references
    const analyzeBtn = document.getElementById('analyzeCurrentVideo');
    const settingsBtn = document.getElementById('openSettings');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const saveKeysBtn = document.getElementById('saveKeys');
    const showOpenaiKeyCheckbox = document.getElementById('showOpenaiKey');
    const showGoogleKeyCheckbox = document.getElementById('showGoogleKey');
    
    // Add click handlers to buttons
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalyzeClick);
        console.log('Added analyze button handler');
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', handleSettingsClick);
        console.log('Added settings button handler');
    }
    
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', handleCloseSettings);
        console.log('Added close settings button handler');
    }
    
    if (saveKeysBtn) {
        saveKeysBtn.addEventListener('click', handleSaveKeys);
        console.log('Added save keys button handler');
    }
    
    if (showOpenaiKeyCheckbox) {
        showOpenaiKeyCheckbox.addEventListener('change', handleShowOpenaiKey);
        console.log('Added show OpenAI key handler');
    }
    
    if (showGoogleKeyCheckbox) {
        showGoogleKeyCheckbox.addEventListener('change', handleShowGoogleKey);
        console.log('Added show Google key handler');
    }
});
