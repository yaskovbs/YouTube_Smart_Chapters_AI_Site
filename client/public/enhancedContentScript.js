/**
 * Enhanced Content Script for YouTube Smart Chapters AI Chrome Extension
 * Now works directly with YouTube transcripts - no server needed!
 */

// Main container for our extension UI
let smartChaptersContainer = null;
let isProcessing = false;
let currentVideoId = null;
let transcriptService = null;

// Initialize the enhanced content script
function initialize() {
  console.log('🎬 YouTube Smart Chapters AI enhanced content script initialized');
  
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
  
  // Initialize transcript service
  if (window.YouTubeTranscriptService) {
    transcriptService = new window.YouTubeTranscriptService();
    console.log('📝 Transcript service initialized');
  } else {
    console.error('❌ YouTubeTranscriptService not available');
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
  
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      
      if (window.location.href.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(window.location.search);
        const newVideoId = urlParams.get('v');
        
        if (newVideoId && newVideoId !== currentVideoId) {
          currentVideoId = newVideoId;
          
          if (smartChaptersContainer) {
            smartChaptersContainer.remove();
          }
          
          waitForYouTubeElement('#meta-contents').then(() => {
            createExtensionUI();
          });
        }
      } else if (smartChaptersContainer) {
        smartChaptersContainer.remove();
      }
    }
  });
  
  observer.observe(document, { subtree: true, childList: true });
}

/**
 * Create the extension UI and inject it into YouTube's page
 */
function createExtensionUI() {
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
    direction: rtl;
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
  
  header.appendChild(title);
  header.appendChild(logo);
  
  // Create content area
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 8px; text-align: center; color: #666; font-size: 14px;">
      ✨ יצירת פרקים חכמים עם תמלילי YouTube ישירות - ללא שרת!
    </div>
  `;
  
  // Create action buttons
  const actionBar = document.createElement('div');
  actionBar.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
    direction: ltr;
  `;
  
  const generateButton = createButton('🎯 צור פרקים חכמים', '#FF0000', () => {
    if (isProcessing) return;
    handleGenerateSmartChapters();
  });
  
  const openExtensionButton = createButton('🔧 פתח תוסף מלא', '#065FD4', () => {
    // Show clear instructions to user
    updateContentArea(`
      <div style="text-align: center; padding: 20px; background-color: #e3f2fd; border-radius: 12px; margin: 16px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1976d2;">📱 איך לפתוח את התוסף המלא</h3>
        <div style="background-color: white; padding: 16px; border-radius: 8px; margin: 12px 0;">
          <p style="margin: 8px 0; font-size: 16px;"><strong>1.</strong> חפש את אייקון התוסף בסרגל הכלים של Chrome</p>
          <p style="margin: 8px 0; font-size: 16px;"><strong>2.</strong> לחץ על האייקון כדי לפתוח את הפופאפ</p>
          <p style="margin: 8px 0; font-size: 16px;"><strong>3.</strong> לחץ על "נתח סרטון נוכחי" להתחלת הניתוח</p>
        </div>
        <div style="margin-top: 16px;">
          <p style="color: #666; font-size: 14px;">💡 <strong>טיפ:</strong> אם לא רואה את האייקון, לחץ על סמל הפאזל (🧩) ובחר "YouTube Smart Chapters AI"</p>
        </div>
        <button onclick="this.parentElement.parentElement.querySelector('div:nth-child(2)').innerHTML = '<div style=\\'padding: 8px; text-align: center; color: #666; font-size: 14px;\\'>✨ התוסף מוכן לשימוש! לחץ על צור פרקים חכמים להתחלה 🎯</div>'" style="
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          margin-top: 12px;
          cursor: pointer;
          font-size: 14px;
        ">הבנתי! ✅</button>
      </div>
    `);
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
 */
function createButton(text, color, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.cssText = `
    background-color: ${color};
    color: white;
    border: none;
    border-radius: 18px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    flex: 1;
    min-width: 160px;
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
async function handleGenerateSmartChapters() {
  isProcessing = true;
  updateContentArea('🔄 מוריד תמלילים מ-YouTube...', true);
  
  try {
    if (!transcriptService) {
      throw new Error('שירות התמלילים לא זמין');
    }
    
    // Get transcript using our service
    updateContentArea('📝 מעבד תמלילים...', true);
    const transcriptResult = await transcriptService.getTranscript(currentVideoId, 'he');
    
    if (!transcriptResult.success) {
      // If real transcripts fail, show demo
      console.log('Real transcripts failed, showing demo:', transcriptResult.error);
      updateContentArea('🎭 יוצר פרקים דמו...', true);
      
      const demoResult = transcriptService.generateDemoTranscript(currentVideoId, 'he');
      displayResults(demoResult.data, true);
      return;
    }
    
    // Generate chapters from transcript
    updateContentArea('🎯 יוצר פרקים חכמים...', true);
    
    const transcript = transcriptResult.data.transcript;
    const fullText = transcriptResult.data.fullText;
    const duration = transcriptResult.data.duration;
    
    // Generate smart chapters (enhanced logic with natural breaks)
    const chapters = generateSmartChaptersFromTranscript(transcript, duration);
    
    // Create analysis summary
    const analysis = {
      mainTopic: extractMainTopic(fullText),
      summary: fullText.substring(0, 200) + '...',
      keyPoints: extractKeyPoints(fullText)
    };
    
    const results = {
      videoId: currentVideoId,
      chapters,
      analysis,
      transcript: {
        wordCount: transcript.length,
        duration: Math.round(duration),
        language: transcriptResult.data.language,
        source: transcriptResult.data.source
      },
      isRealYouTubeData: transcriptResult.data.source === 'youtube_captions'
    };
    
    displayResults(results, false);
    
  } catch (error) {
    console.error('❌ Error in handleGenerateSmartChapters:', error);
    
    // Show demo instead of error
    updateContentArea('🎭 יוצר פרקים דמו...', true);
    const demoResult = transcriptService.generateDemoTranscript(currentVideoId, 'he');
    displayResults(demoResult.data, true);
  } finally {
    isProcessing = false;
  }
}

/**
 * Generate smart chapters from transcript data with natural breaks
 */
function generateSmartChaptersFromTranscript(transcript, duration) {
  // Find natural break points based on pauses and content
  const naturalBreaks = findNaturalBreaks(transcript);
  
  // If we have too few natural breaks, add some based on timing
  if (naturalBreaks.length < 3) {
    const timeBasedBreaks = generateTimeBasedBreaks(duration, 4);
    naturalBreaks.push(...timeBasedBreaks);
    naturalBreaks.sort((a, b) => a.time - b.time);
  }

  // Limit to reasonable number of chapters
  const maxChapters = Math.min(8, naturalBreaks.length + 1);
  const selectedBreaks = naturalBreaks.slice(0, maxChapters - 1);

  const hebrewChapterTitles = [
    'פתיחה וברכות',
    'הצגת הנושא',
    'תוכן מרכזי',
    'פיתוח הנושא',
    'דוגמאות ופירוט',
    'הסבר מתקדם',
    'דיון והרחבה',
    'סיכום וסיום'
  ];

  const chapters = [];
  let chapterStart = 0;

  selectedBreaks.forEach((breakPoint, index) => {
    const chapterEnd = Math.floor(breakPoint.time);
    
    chapters.push({
      title: hebrewChapterTitles[index] || `פרק ${index + 1}`,
      startTime: Math.floor(chapterStart),
      formattedStartTime: formatTimestamp(chapterStart),
      description: breakPoint.reason || `תוכן של פרק ${index + 1}`
    });
    
    chapterStart = chapterEnd;
  });

  // Add final chapter
  if (chapterStart < duration) {
    chapters.push({
      title: hebrewChapterTitles[chapters.length] || `פרק ${chapters.length + 1}`,
      startTime: Math.floor(chapterStart),
      formattedStartTime: formatTimestamp(chapterStart),
      description: `תוכן של פרק ${chapters.length + 1}`
    });
  }

  return chapters;
}

/**
 * Find natural break points in transcript based on pauses and content
 */
function findNaturalBreaks(transcript) {
  const breaks = [];
  const minChapterLength = 60; // Minimum 60 seconds between chapters
  
  for (let i = 1; i < transcript.length; i++) {
    const currentWord = transcript[i];
    const previousWord = transcript[i - 1];
    
    // Calculate pause between words
    const pause = currentWord.startTime - previousWord.endTime;
    
    // Skip if too early for next chapter
    if (currentWord.startTime < breaks.length * minChapterLength + minChapterLength) {
      continue;
    }
    
    // Look for significant pauses (2+ seconds)
    if (pause >= 2.0) {
      breaks.push({
        time: currentWord.startTime,
        reason: 'הפסקה בדיבור',
        confidence: Math.min(pause / 5.0, 1.0)
      });
      continue;
    }
    
    // Look for sentence endings followed by new topics
    if (previousWord.word.includes('.') || previousWord.word.includes('!') || previousWord.word.includes('?')) {
      const nextFewWords = transcript.slice(i, i + 3).map(w => w.word.toLowerCase()).join(' ');
      
      const topicChangeWords = ['עכשיו', 'הבא', 'נמשיך', 'נעבור', 'אחר כך', 'בנוסף', 'כמו כן', 'וגם', 'now', 'next', 'then', 'also'];
      
      if (topicChangeWords.some(word => nextFewWords.includes(word))) {
        breaks.push({
          time: currentWord.startTime,
          reason: 'מעבר נושא',
          confidence: 0.7
        });
      }
    }
  }
  
  // Sort by confidence and time, keep best ones
  return breaks
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6) // Max 6 natural breaks
    .sort((a, b) => a.time - b.time);
}

/**
 * Generate time-based breaks as fallback
 */
function generateTimeBasedBreaks(totalDuration, count) {
  const breaks = [];
  const interval = totalDuration / (count + 1);
  
  for (let i = 1; i <= count; i++) {
    breaks.push({
      time: interval * i,
      reason: 'חלוקה על פי זמן',
      confidence: 0.5
    });
  }
  
  return breaks;
}

/**
 * Extract main topic from text
 */
function extractMainTopic(text) {
  // Simple topic extraction - first meaningful sentence
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  return sentences[0]?.trim() || 'נושא הסרטון';
}

/**
 * Extract key points from text
 */
function extractKeyPoints(text) {
  // Simple key points extraction
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).map(s => s.trim());
}

/**
 * Format time from seconds to MM:SS or HH:MM:SS
 */
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

/**
 * Update the content area of our UI
 */
function updateContentArea(html, loading = false) {
  const content = smartChaptersContainer.querySelector('div:nth-child(2)');
  
  if (loading) {
    content.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; padding: 32px; direction: rtl;">
        <div class="smart-chapters-spinner" style="
          width: 24px;
          height: 24px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #FF0000;
          border-radius: 50%;
          animation: smart-chapters-spin 1s linear infinite;
          margin-left: 12px;
        "></div>
        <div style="font-size: 14px;">${html}</div>
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
 * Display results in the content area
 */
function displayResults(results, isDemoData) {
  const chapters = results.chapters || [];
  const isRealData = results.isRealYouTubeData || false;
  
  let resultsHtml = `
    <div style="padding: 16px; direction: rtl;">
  `;
  
  // Status header
  if (isDemoData || results.isDemoData) {
    resultsHtml += `
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
        <strong>🎭 מצב דמו:</strong> נתוני דמו מכיוון שלא ניתן לגשת לתמלילים אמיתיים
      </div>
    `;
  } else if (isRealData) {
    resultsHtml += `
      <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
        <strong>✅ תמלילי YouTube אמיתיים:</strong> השתמשנו בתמלילים הקיימים של YouTube
      </div>
    `;
  }
  
  // Important notice about timestamps
  resultsHtml += `
    <div style="background-color: #e3f2fd; border: 1px solid #90caf9; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
      <strong>ℹ️ הערה על חותמות זמן:</strong><br>
      <span style="font-size: 13px;">חותמות הזמן הן קירוב ונועדו לעזור לך למצוא איפה בסרטון נמצא כל נושא. לדיוק מלא, השתמש באתר הראשי עם AI מתקדם.</span>
    </div>
  `;
  
  // Video info
  if (results.transcript) {
    resultsHtml += `
      <div style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">מידע על הסרטון:</h4>
        <div style="font-size: 13px; color: #666;">
          📺 מזהה: ${results.videoId}<br>
          ⏱️ משך: ${results.transcript.duration} שניות<br>
          📝 מקור: ${results.transcript.source === 'youtube_captions' ? 'תמלילי YouTube' : 'דמו'}<br>
          📊 מילים: ${results.transcript.wordCount}
        </div>
      </div>
    `;
  }
  
  // Chapters
  if (chapters.length > 0) {
    resultsHtml += `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="margin: 0; font-size: 14px;">פרקים שנוצרו (${chapters.length}):</h4>
          <button id="copy-chapters-btn" style="
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
          ">העתק הכל</button>
        </div>
        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 8px;">
    `;
    
    chapters.forEach((chapter, index) => {
      resultsHtml += `
        <div style="
          padding: 8px 12px;
          border-bottom: ${index < chapters.length - 1 ? '1px solid #f1f3f4' : 'none'};
          display: flex;
          align-items: center;
        ">
          <div style="color: #065FD4; font-weight: 500; margin-left: 12px; font-family: monospace;">
            ${chapter.formattedStartTime}
          </div>
          <div style="flex-grow: 1; font-size: 14px;">${chapter.title}</div>
        </div>
      `;
    });
    
    resultsHtml += `
        </div>
      </div>
    `;
  }
  
  // Analysis (if available)
  if (results.analysis) {
    resultsHtml += `
      <div style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">ניתוח תוכן:</h4>
        <div style="font-size: 13px;">
          <strong>נושא עיקרי:</strong> ${results.analysis.mainTopic}<br>
          <strong>סיכום:</strong> ${results.analysis.summary}
        </div>
      </div>
    `;
  }
  
  resultsHtml += `
      <div style="text-align: center; margin-top: 16px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
          💡 לתוצאות מלאות עם AI מתקדם:
        </div>
        <button onclick="window.open('https://youtubesmartchaptersai.pages.dev', '_blank')" style="
          background-color: #FF0000;
          color: white;
          border: none;
          border-radius: 16px;
          padding: 8px 16px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
        ">🌐 בקר באתר הראשי</button>
      </div>
    </div>
  `;
  
  updateContentArea(resultsHtml);
  
  // Add event listener to copy button
  setTimeout(() => {
    const copyButton = document.getElementById('copy-chapters-btn');
    if (copyButton && chapters.length > 0) {
      copyButton.addEventListener('click', () => {
        const formattedChapters = chapters.map(chapter => 
          `${chapter.formattedStartTime} ${chapter.title}`
        ).join('\n');
        
        navigator.clipboard.writeText(formattedChapters).then(() => {
          copyButton.textContent = 'הועתק! ✓';
          copyButton.style.backgroundColor = '#20c997';
          setTimeout(() => {
            copyButton.textContent = 'העתק הכל';
            copyButton.style.backgroundColor = '#28a745';
          }, 2000);
        }).catch(() => {
          copyButton.textContent = 'שגיאה';
          setTimeout(() => {
            copyButton.textContent = 'העתק הכל';
          }, 2000);
        });
      });
    }
  }, 100);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_VIDEO_INFO') {
    const videoInfo = extractVideoInfo();
    sendResponse(videoInfo);
  }
  return true;
});

/**
 * Extract video information from the current YouTube page
 */
function extractVideoInfo() {
  try {
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
    const title = titleElement ? titleElement.textContent.trim() : '';
    
    const channelElement = document.querySelector('#channel-name #text');
    const channel = channelElement ? channelElement.textContent.trim() : '';
    
    const timeElement = document.querySelector('.ytp-time-duration');
    const duration = timeElement ? timeElement.textContent.trim() : '';
    
    return {
      success: true,
      data: {
        videoId: currentVideoId,
        title,
        channel,
        duration,
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

// Run initialization when the page is fully loaded
if (document.readyState === 'complete') {
  initialize();
} else {
  window.addEventListener('load', initialize);
}
