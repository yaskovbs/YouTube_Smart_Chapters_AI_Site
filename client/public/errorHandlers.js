// Error handlers for YouTube Smart Chapters AI extension

// Safe console log that won't throw errors
function safeConsoleLog(level, ...args) {
    try {
        if (level === 'error' && console && console.error) {
            console.error(...args);
        } else if (level === 'warn' && console && console.warn) {
            console.warn(...args);
        } else if (console && console.log) {
            console.log(...args);
        }
    } catch (e) {
        // Ignore console errors to prevent recursive error loops
    }
}

// Function to check if icon exists
function checkIconExists() {
  try {
    // Check if we're in a valid extension context
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      safeConsoleLog('warn', 'Not in extension context, skipping icon check');
      return;
    }
    
    // Create image element for checking
    const img = new Image();
    
    // Set up onload callback first
    img.onload = function() {
      safeConsoleLog('log', 'Icon loaded successfully: ' + img.src);
    };
    
    // Set up onerror callback to handle fallback
    img.onerror = function() {
      safeConsoleLog('warn', 'Using placeholder icon instead.');
      
      try {
        // Get proper URL for placeholder
        const placeholderUrl = chrome.runtime.getURL('icons/placeholder-icon.svg');
        safeConsoleLog('log', 'Loading placeholder from: ' + placeholderUrl);
        
        // Create new image for placeholder (the current one already failed)
        const placeholderImg = new Image();
        
        placeholderImg.onload = function() {
          safeConsoleLog('log', 'Placeholder icon loaded successfully');
          
          // You might add the icon to the DOM here if needed
          // For example: document.getElementById('extension-icon').src = this.src;
        };
        
        placeholderImg.onerror = function() {
          safeConsoleLog('error', 'Failed to load placeholder icon');
          
          // Try direct path as final fallback
          try {
            const directPathImg = new Image();
            directPathImg.onload = function() {
              safeConsoleLog('log', 'Fallback direct path icon loaded successfully');
            };
            directPathImg.src = 'icons/placeholder-icon.svg';
          } catch (finalError) {
            safeConsoleLog('error', 'All icon loading attempts failed');
          }
        };
        
        // Set source for placeholder image with a timestamp to avoid cache issues
        placeholderImg.src = placeholderUrl + '?t=' + Date.now();
      } catch (e) {
        safeConsoleLog('error', 'Error loading placeholder icon:', e);
      }
    };
    
    try {
      // Get proper URL for main icon
      const iconUrl = chrome.runtime.getURL('icons/icon48.svg');
      safeConsoleLog('log', 'Attempting to load icon from: ' + iconUrl);
      
      // Set source to trigger load attempt
      img.src = iconUrl;
    } catch (e) {
      safeConsoleLog('error', 'Error getting extension URL:', e);
      // Don't try to load placeholder here - the onerror handler will do it
    }
  } catch (e) {
    safeConsoleLog('error', 'Error checking icon:', e);
  }
}

// Error handler for script loading that won't crash
function safeDisplayError(message) {
    try {
        safeConsoleLog('error', message);
        const errorEl = document.getElementById('extension-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    } catch (e) {
        // Fallback error handling - last resort
        try {
            safeConsoleLog('error', 'Error in display error:', e);
        } catch (innerError) {
            // Nothing more we can do
        }
    }
}

// Alias for backward compatibility
function displayError(message) {
    safeDisplayError(message);
}

// Global error handler with safe handling
window.onerror = function(message, source, lineno, colno, error) {
    try {
        safeDisplayError('Error: ' + message);
        safeConsoleLog('error', 'Extension error:', message, 'at', source, ':', lineno, ':', colno);
    } catch (e) {
        // Last-resort error handling
    }
    return true; // Prevents the error from being shown in the console again
};

// Safely check extension context
function safeCheckExtensionContext() {
    try {
        if (typeof chrome === 'undefined') {
            safeDisplayError('Chrome API is not available.');
            return false;
        }
        
        if (!chrome.runtime) {
            safeDisplayError('Chrome runtime is not available.');
            return false;
        }
        
        // Special check for invalidated contexts
        try {
            // This will throw if context is invalidated
            chrome.runtime.getURL('');
        } catch (e) {
            safeDisplayError('Extension context has been invalidated. Please reload the page.');
            return false;
        }
        
        return true;
    } catch (e) {
        safeConsoleLog('error', 'Error checking extension context:', e);
        return false;
    }
}

// Main initialization function that safely checks environment
function initExtension() {
    safeConsoleLog('log', 'Initializing extension error handlers...');
    
    // Check extension context safely
    const contextValid = safeCheckExtensionContext();
    if (!contextValid) {
        safeConsoleLog('warn', 'Extension context is invalid');
    } else {
        safeConsoleLog('log', 'Extension context is valid');
    }
    
    // Safely check if icon exists
    checkIconExists();
}

// Safely initialize when DOM is ready
if (document) {
    try {
        document.addEventListener('DOMContentLoaded', function() {
            safeConsoleLog('log', 'DOM loaded, initializing error handlers');
            initExtension();
        });
    } catch (e) {
        safeConsoleLog('error', 'Failed to add DOM load listener:', e);
        // Try to initialize anyway
        initExtension();
    }
}

// Expose functions globally for other scripts (safely)
try {
    window.displayError = safeDisplayError;
    window.safeDisplayError = safeDisplayError;
    window.safeConsoleLog = safeConsoleLog;
    window.checkExtensionContext = safeCheckExtensionContext;
} catch (e) {
    // Cannot expose global functions
    safeConsoleLog('error', 'Failed to expose global functions:', e);
}
