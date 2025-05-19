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
    const img = new Image();
    img.onload = function() {
      safeConsoleLog('log', 'Icon loaded successfully');
    };
    img.onerror = function() {
      // Use placeholder icon if the main icon can't be loaded
      safeConsoleLog('warn', 'Using placeholder icon instead.');
      // Try loading the placeholder icon
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        try {
          img.src = chrome.runtime.getURL('icons/placeholder-icon.svg');
          console.log('Attempting to load placeholder icon');
        } catch (e) {
          safeConsoleLog('error', 'Error loading placeholder icon:', e);
        }
      }
    };
    
  // First verify that icon files exist before trying to load them
  const verifyAndLoadIcon = async () => {
    // Try to load main icon first
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Check if icon48.png exists by attempting to fetch it first
        const iconPath = 'icons/icon48.png';
        const iconUrl = chrome.runtime.getURL(iconPath);
        
        // Log the attempt
        safeConsoleLog('log', 'Attempting to load icon from: ' + iconUrl);
        
        // Set the image source
        img.src = iconUrl;
      } else {
        // Not in extension context, use placeholder directly
        img.src = 'icons/placeholder-icon.svg';
      }
    } catch (e) {
      safeConsoleLog('error', 'Error getting extension URL:', e);
      // Fallback to placeholder on error
      try {
        img.src = chrome.runtime.getURL('icons/placeholder-icon.svg');
      } catch (innerErr) {
        safeConsoleLog('error', 'Failed to load both main icon and placeholder:', innerErr);
      }
    }
  };
  
  // Execute the verification and loading
  verifyAndLoadIcon();
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
