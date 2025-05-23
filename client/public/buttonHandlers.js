// Global variables for extension
let selectedFile = null;
let handlersInitialized = false; // Prevent multiple initializations

// Get selected language from storage or default to Hebrew
async function getSelectedLanguage() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['selectedLanguage'], function(result) {
                resolve(result.selectedLanguage || 'he');
            });
        } else {
            resolve('he');
        }
    });
}

// Main analyze function - now uses YouTube transcripts directly
async function handleAnalyzeClick() {
    console.log('🎬 Analyze button clicked - using YouTube transcripts');
    const errorEl = document.getElementById('extension-error');
    const button = document.getElementById('analyzeCurrentVideo');
    
    // Clear previous errors
    if (errorEl) {
        errorEl.style.display = 'none';
    }
    
    // Check if we have the transcript service
    if (!window.YouTubeTranscriptService) {
        if (errorEl) {
            errorEl.textContent = 'שירות התמלילים לא זמין. אנא רענן את הדף ונסה שוב.';
            errorEl.style.display = 'block';
        }
        return;
    }
    
    // Get current YouTube tab
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
            if (!tabs || tabs.length === 0) {
                if (errorEl) {
                    errorEl.textContent = 'לא ניתן לגשת לכרטיסייה הפעילה';
                    errorEl.style.display = 'block';
                }
                return;
            }
            
            const currentTab = tabs[0];
            if (!currentTab.url || !currentTab.url.includes('youtube.com/watch')) {
                if (errorEl) {
                    errorEl.textContent = 'זה לא דף של סרטון YouTube. עבור לדף סרטון ונסה שוב.';
                    errorEl.style.display = 'block';
                }
                return;
            }
            
            // Update button state
            if (button) {
                button.textContent = 'מעבד תמלילים...';
                button.disabled = true;
            }
            
            try {
                // Extract video ID from URL
                const transcriptService = new window.YouTubeTranscriptService();
                const videoId = transcriptService.extractVideoId(currentTab.url);
                
                if (!videoId) {
                    throw new Error('לא ניתן לחלץ מזהה הסרטון מהקישור');
                }
                
                console.log(`🎯 Processing YouTube video: ${videoId}`);
                
                // Get selected language from settings
                const selectedLanguage = await getSelectedLanguage();
                console.log(`🌍 Using language: ${selectedLanguage}`);
                
                // Get transcript
                if (button) {
                    button.textContent = 'מוריד תמלילים...';
                }
                
                const transcriptResult = await transcriptService.getTranscript(videoId, selectedLanguage);
                
                if (!transcriptResult.success) {
                    // If real transcripts fail, show demo
                    console.log('Real transcripts failed, showing demo:', transcriptResult.error);
                    if (button) {
                        button.textContent = 'יוצר פרקים דמו...';
                    }
                    
                    const demoResult = transcriptService.generateDemoTranscript(videoId, selectedLanguage);
                    displayResults(videoId, {
                        chapters: demoResult.data.chapters,
                        transcript: demoResult.data.transcript,
                        summary: demoResult.data.summary,
                        isDemoData: true,
                        language: selectedLanguage
                    });
                    
                    // Update button - demo success
                    if (button) {
                        button.textContent = '✅ הושלם בהצלחה! (דמו)';
                        button.style.backgroundColor = '#ff9800';
                        
                        // Reset after 3 seconds
                        setTimeout(() => {
                            button.textContent = 'נתח סרטון נוכחי';
                            button.style.backgroundColor = '';
                            button.disabled = false;
                        }, 3000);
                    }
                    return;
                }
                
                // Basic analysis (without AI for now)
                if (button) {
                    button.textContent = 'יוצר פרקים...';
                }
                
                const transcript = transcriptResult.data.transcript;
                const fullText = transcriptResult.data.fullText;
                const duration = transcriptResult.data.duration;
                
                // Generate basic chapters
                const chapterCount = Math.min(8, Math.max(3, Math.floor(duration / 120))); // 1 chapter per 2 minutes
                const chapterDuration = duration / chapterCount;
                const chapters = [];
                
                const chapterTitles = {
                    'he': [
                        'פתיחה וברכות',
                        'הצגת הנושא',
                        'תוכן מרכזי',
                        'פיתוח הנושא',
                        'דוגמאות ופירוט',
                        'הסבר מתקדם',
                        'דיון והרחבה',
                        'סיכום וסיום'
                    ],
                    'en': [
                        'Opening and Greetings',
                        'Topic Introduction',
                        'Main Content',
                        'Topic Development',
                        'Examples and Details',
                        'Advanced Explanation',
                        'Discussion and Expansion',
                        'Summary and Conclusion'
                    ],
                    'ar': [
                        'الافتتاح والترحيب',
                        'مقدمة الموضوع',
                        'المحتوى الرئيسي',
                        'تطوير الموضوع',
                        'أمثلة وتفاصيل',
                        'شرح متقدم',
                        'مناقشة وتوسيع',
                        'ملخص وختام'
                    ]
                };
                
                const titles = chapterTitles[selectedLanguage] || chapterTitles['he'];
                
                for (let i = 0; i < chapterCount; i++) {
                    const startTime = Math.floor(i * chapterDuration);
                    const endTime = Math.floor(Math.min((i + 1) * chapterDuration, duration));
                    
                    chapters.push({
                        title: titles[i] || `${selectedLanguage === 'en' ? 'Chapter' : 'פרק'} ${i + 1}`,
                        startTime: formatTimestamp(startTime),
                        description: `${selectedLanguage === 'en' ? 'Chapter content' : 'תוכן של פרק'} ${i + 1}`
                    });
                }
                
                // Get language name for display
                const languageNames = {
                    'he': 'עברית',
                    'en': 'English',
                    'ar': 'العربية',
                    'fr': 'Français',
                    'de': 'Deutsch',
                    'es': 'Español',
                    'ru': 'Русский',
                    'uk': 'Українська',
                    'it': 'Italiano',
                    'pt': 'Português',
                    'ja': '日本語',
                    'ko': '한국어',
                    'zh': '中文'
                };
                
                // Create results display
                displayResults(videoId, {
                    chapters,
                    transcript: {
                        wordCount: transcript.length,
                        duration: Math.round(duration),
                        language: languageNames[selectedLanguage] || selectedLanguage,
                        source: transcriptResult.data.source === 'youtube_captions' ? 'תמלילי YouTube' : 'דמו'
                    },
                    summary: fullText.substring(0, 200) + '...',
                    isDemoData: false
                });
                
                // Update button - success
                if (button) {
                    button.textContent = '✅ הושלם בהצלחה!';
                    button.style.backgroundColor = '#4CAF50';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        button.textContent = 'נתח סרטון נוכחי';
                        button.style.backgroundColor = '';
                        button.disabled = false;
                    }, 3000);
                }
                
            } catch (error) {
                console.error('❌ Error in analyze process:', error);
                
                // Show demo instead of error
                if (button) {
                    button.textContent = 'יוצר פרקים דמו...';
                }
                
                const transcriptService = new window.YouTubeTranscriptService();
                const videoId = transcriptService.extractVideoId(currentTab.url);
                const selectedLanguage = await getSelectedLanguage();
                const demoResult = transcriptService.generateDemoTranscript(videoId, selectedLanguage);
                
                displayResults(videoId, {
                    chapters: demoResult.data.chapters,
                    transcript: demoResult.data.transcript,
                    summary: demoResult.data.summary,
                    isDemoData: true,
                    language: selectedLanguage
                });
                
                // Reset button - demo
                if (button) {
                    button.textContent = '✅ הושלם בהצלחה! (דמו)';
                    button.style.backgroundColor = '#ff9800';
                    
                    setTimeout(() => {
                        button.textContent = 'נתח סרטון נוכחי';
                        button.style.backgroundColor = '';
                        button.disabled = false;
                    }, 3000);
                }
            }
        });
    }
}

// Display results in the extension popup
function displayResults(videoId, results) {
    const errorEl = document.getElementById('extension-error');
    
    // Hide error and show success
    if (errorEl) {
        let bgColor, textColor, statusText;
        
        if (results.isDemoData) {
            bgColor = '#fff3cd';
            textColor = '#856404';
            statusText = '🎭 מצב דמו: נתוני דמו מכיוון שלא ניתן לגשת לתמלילים אמיתיים';
        } else {
            bgColor = '#e8f5e9';
            textColor = '#2e7d32';
            statusText = '✅ עיבוד הושלם בהצלחה!';
        }
        
        errorEl.style.backgroundColor = bgColor;
        errorEl.style.color = textColor;
        errorEl.innerHTML = `
            <strong>${statusText}</strong><br>
            <br>
            <strong>מידע על הסרטון:</strong><br>
            📺 מזהה: ${videoId}<br>
            ⏱️ משך: ${results.transcript.duration} שניות<br>
            🗣️ שפה: ${results.transcript.language}<br>
            📝 מקור: ${results.transcript.source}<br>
            📊 מילים: ${results.transcript.wordCount}<br>
            <br>
            <strong>פרקים שנוצרו (${results.chapters.length}):</strong><br>
            ${results.chapters.map(chapter => 
                `${chapter.startTime} - ${chapter.title}`
            ).join('<br>')}<br>
            <br>
            <strong>סיכום:</strong><br>
            ${results.summary}<br>
            <br>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                <small>לתוצאות מלאות עם AI, השתמש באתר הראשי</small>
                <button id="close-results-btn" style="
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 4px 8px;
                    font-size: 11px;
                    cursor: pointer;
                ">סגור</button>
            </div>
        `;
        errorEl.style.display = 'block';
        
        // Add close button handler
        setTimeout(() => {
            const closeBtn = document.getElementById('close-results-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    errorEl.style.display = 'none';
                    errorEl.style.backgroundColor = '';
                    errorEl.style.color = '';
                });
            }
        }, 100);
        
        // Results stay visible until manually closed - no auto-hide timer
    }
}

// Format time from seconds to MM:SS or HH:MM:SS
function formatTimestamp(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Updated upload function - redirect to website since server is not needed anymore
function handleUploadVideoFileClick() {
    console.log('Upload redirecting to website...');
    const errorEl = document.getElementById('extension-error');
    
    if (errorEl) {
        errorEl.style.backgroundColor = '#e3f2fd';
        errorEl.style.color = '#1976d2';
        errorEl.textContent = 'להעלאת קבצים, השתמש באתר הראשי שייפתח עכשיו...';
        errorEl.style.display = 'block';
    }
    
    // Open website for file upload
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: 'https://youtubesmartchaptersai.pages.dev/process' });
    }
    
    // Hide message after 3 seconds
    setTimeout(() => {
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.style.backgroundColor = '';
            errorEl.style.color = '';
        }
    }, 3000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleSettingsClick() {
    console.log('Direct settings button click');
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
        
        // Load current settings when opening panel
        if (panel.style.display === 'block') {
            loadCurrentSettings();
        }
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

// Load current settings into the form
function loadCurrentSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['selectedLanguage', 'apiKeys'], function(result) {
            // Load language selection
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect && result.selectedLanguage) {
                languageSelect.value = result.selectedLanguage;
            }
            
            // Load API keys (but don't display them for security)
            const apiKeys = result.apiKeys || {};
            const openaiKeyInput = document.getElementById('openaiKey');
            const assemblyaiKeyInput = document.getElementById('assemblyaiKey');
            
            if (openaiKeyInput && apiKeys.openai) {
                openaiKeyInput.placeholder = 'מפתח OpenAI קיים (מוסתר)';
            }
            
            if (assemblyaiKeyInput && apiKeys.assemblyai) {
                assemblyaiKeyInput.placeholder = 'מפתח AssemblyAI קיים (מוסתר)';
            }
        });
    }
}

function handleSaveSettings() {
    console.log('Direct save settings button click');
    const languageSelect = document.getElementById('languageSelect');
    const openaiKeyInput = document.getElementById('openaiKey');
    const assemblyaiKeyInput = document.getElementById('assemblyaiKey');
    const settingsMessage = document.getElementById('settingsMessage');
    
    if (!languageSelect || !openaiKeyInput || !assemblyaiKeyInput || !settingsMessage) {
        console.error('Required elements not found');
        return;
    }
    
    try {
        const selectedLanguage = languageSelect.value;
        const openaiKey = openaiKeyInput.value.trim();
        const assemblyaiKey = assemblyaiKeyInput.value.trim();
        
        // Validate keys if provided (basic validation)
        let hasError = false;
        let errorMessage = '';
        
        if (openaiKey && openaiKey.length < 20) {
            hasError = true;
            errorMessage = 'OpenAI API key should be at least 20 characters';
        } else if (openaiKey && !openaiKey.startsWith('sk-')) {
            hasError = true;
            errorMessage = 'OpenAI API key should start with "sk-"';
        } else if (assemblyaiKey && assemblyaiKey.length < 20) {
            hasError = true;
            errorMessage = 'AssemblyAI API key should be at least 20 characters';
        }
        
        if (hasError) {
            // Show error message
            settingsMessage.textContent = errorMessage;
            settingsMessage.style.backgroundColor = '#ffebee';
            settingsMessage.style.color = '#d32f2f';
            settingsMessage.style.display = 'block';
            return;
        }
        
        // Save settings to Chrome storage
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['apiKeys'], function(result) {
                try {
                    const apiKeys = result.apiKeys || {};
                    
                    // Update API keys only if new ones provided
                    if (openaiKey) {
                        apiKeys.openai = openaiKey;
                    }
                    
                    if (assemblyaiKey) {
                        apiKeys.assemblyai = assemblyaiKey;
                    }
                    
                    // Save both language and API keys
                    chrome.storage.sync.set({ 
                        selectedLanguage: selectedLanguage,
                        apiKeys: apiKeys 
                    }, function() {
                        // Show success message
                        let successText = 'הגדרות נשמרו בהצלחה!';
                        
                        settingsMessage.textContent = successText;
                        settingsMessage.style.backgroundColor = '#e8f5e9';
                        settingsMessage.style.color = '#2e7d32';
                        settingsMessage.style.display = 'block';
                        
                        // Clear the input fields for security
                        openaiKeyInput.value = '';
                        assemblyaiKeyInput.value = '';
                        
                        // Update placeholders to show keys exist
                        if (openaiKey) {
                            openaiKeyInput.placeholder = 'מפתח OpenAI קיים (מוסתר)';
                        }
                        if (assemblyaiKey) {
                            assemblyaiKeyInput.placeholder = 'מפתח AssemblyAI קיים (מוסתר)';
                        }
                        
                        // Hide success message after 3 seconds
                        setTimeout(function() {
                            if (settingsMessage) {
                                settingsMessage.style.display = 'none';
                            }
                        }, 3000);
                    });
                } catch (error) {
                    console.error('Error saving settings:', error);
                    const errorEl = document.getElementById('extension-error');
                    if (errorEl) {
                        errorEl.textContent = 'לא ניתן לשמור הגדרות: ' + error.message;
                        errorEl.style.display = 'block';
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error in save settings logic:', error);
        const errorEl = document.getElementById('extension-error');
        if (errorEl) {
            errorEl.textContent = 'שגיאה בשמירת ההגדרות: ' + error.message;
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

function handleShowAssemblyaiKey() {
    const checkbox = document.getElementById('showAssemblyaiKey');
    const input = document.getElementById('assemblyaiKey');
    if (checkbox && input) {
        input.type = checkbox.checked ? 'text' : 'password';
    }
}

function handleOpenWebsite() {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: 'https://youtubesmartchaptersai.pages.dev' });
    }
}

// Add the listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Prevent multiple initializations
    if (handlersInitialized) {
        console.log('Button handlers already initialized, skipping...');
        return;
    }
    
    console.log('Button handlers initializing...');
    handlersInitialized = true;
    
    // Get button references
    const analyzeBtn = document.getElementById('analyzeCurrentVideo');
    const uploadBtn = document.getElementById('uploadVideoFile');
    const settingsBtn = document.getElementById('openSettings');
    const websiteBtn = document.getElementById('openWebsite');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const showOpenaiKeyCheckbox = document.getElementById('showOpenaiKey');
    const showAssemblyaiKeyCheckbox = document.getElementById('showAssemblyaiKey');
    
    // Add click handlers to buttons
    if (analyzeBtn && !analyzeBtn.hasEventListener) {
        analyzeBtn.addEventListener('click', handleAnalyzeClick);
        analyzeBtn.hasEventListener = true;
        console.log('Added analyze button handler');
    }
    
    if (uploadBtn && !uploadBtn.hasEventListener) {
        uploadBtn.addEventListener('click', handleUploadVideoFileClick);
        uploadBtn.hasEventListener = true;
        console.log('Added upload button handler');
    }
    
    if (settingsBtn && !settingsBtn.hasEventListener) {
        settingsBtn.addEventListener('click', handleSettingsClick);
        settingsBtn.hasEventListener = true;
        console.log('Added settings button handler');
    }
    
    if (websiteBtn && !websiteBtn.hasEventListener) {
        websiteBtn.addEventListener('click', handleOpenWebsite);
        websiteBtn.hasEventListener = true;
        console.log('Added website button handler');
    }
    
    if (closeSettingsBtn && !closeSettingsBtn.hasEventListener) {
        closeSettingsBtn.addEventListener('click', handleCloseSettings);
        closeSettingsBtn.hasEventListener = true;
        console.log('Added close settings button handler');
    }
    
    if (saveSettingsBtn && !saveSettingsBtn.hasEventListener) {
        saveSettingsBtn.addEventListener('click', handleSaveSettings);
        saveSettingsBtn.hasEventListener = true;
        console.log('Added save settings button handler');
    }
    
    if (showOpenaiKeyCheckbox && !showOpenaiKeyCheckbox.hasEventListener) {
        showOpenaiKeyCheckbox.addEventListener('change', handleShowOpenaiKey);
        showOpenaiKeyCheckbox.hasEventListener = true;
        console.log('Added show OpenAI key handler');
    }
    
    if (showAssemblyaiKeyCheckbox && !showAssemblyaiKeyCheckbox.hasEventListener) {
        showAssemblyaiKeyCheckbox.addEventListener('change', handleShowAssemblyaiKey);
        showAssemblyaiKeyCheckbox.hasEventListener = true;
        console.log('Added show AssemblyAI key handler');
    }
});
