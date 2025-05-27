/**
 * YouTube Transcript Service - extracts captions directly from YouTube
 * Works without server or FFmpeg - completely client-side
 * Updated with better CORS proxies and error handling
 */

class YouTubeTranscriptService {
  constructor() {
    this.corsProxies = [
      // Updated working CORS proxies - prioritizing more reliable ones
      'https://corsproxy.io/?',
      'https://api.allorigins.win/get?url=',
      'https://thingproxy.freeboard.io/fetch/',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://crossorigin.me/',
      'https://cors-anywhere.herokuapp.com/',
    ];
  }

  /**
   * Extract video ID from YouTube URL
   * @param {string} url - YouTube URL
   * @returns {string|null} - Video ID or null if invalid
   */
  extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Get available transcript languages for a video
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Array>} - Array of available language options
   */
  async getAvailableLanguages(videoId) {
    try {
      const response = await this.fetchVideoPage(videoId);
      const languages = this.extractLanguageOptions(response);
      
      return languages.map(lang => ({
        code: lang.code,
        name: lang.name,
        auto: lang.auto || false
      }));
    } catch (error) {
      console.error('Error getting available languages:', error);
      return [];
    }
  }

  /**
   * Get transcript for a YouTube video
   * @param {string} videoId - YouTube video ID
   * @param {string} languageCode - Language code (optional, defaults to auto-detect)
   * @returns {Promise<Object>} - Transcript data with timestamps
   */
  async getTranscript(videoId, languageCode = null) {
    console.log(`🎬 Getting transcript for video: ${videoId} (language: ${languageCode || 'auto'})`);
    
    try {
      // Get the video page HTML
      console.log('📄 Fetching YouTube page...');
      const pageResponse = await this.fetchVideoPage(videoId);
      
      if (!pageResponse || pageResponse.length < 1000) {
        throw new Error('דף YouTube לא נטען כראוי');
      }
      
      // Extract transcript URL from the page
      console.log('🔍 Searching for transcript URL...');
      const transcriptUrl = this.extractTranscriptUrl(pageResponse, languageCode);
      
      if (!transcriptUrl) {
        throw new Error('לא נמצאו תמלילים זמינים לסרטון זה. ייתכן שהסרטון לא כולל תמלילים אוטומטיים או ידניים.');
      }
      
      console.log('📥 Found transcript URL, downloading...');
      // Fetch the actual transcript
      const transcriptResponse = await this.fetchTranscriptData(transcriptUrl);
      
      // Parse and format the transcript
      console.log('⚙️ Parsing transcript...');
      const transcript = this.parseTranscript(transcriptResponse);
      
      console.log('✅ Transcript successfully retrieved!');
      return {
        success: true,
        data: {
          videoId,
          language: languageCode || 'auto',
          transcript: transcript.words,
          fullText: transcript.fullText,
          duration: transcript.duration,
          source: 'youtube_captions'
        }
      };
      
    } catch (error) {
      console.error('❌ Error getting transcript:', error);
      
      // More specific error messages
      let errorMessage = error.message;
      let suggestion = 'נסה עם סרטון אחר או בדוק שיש תמלילים זמינים';
      
      if (error.message.includes('fetch')) {
        errorMessage = 'שגיאת רשת - לא ניתן לגשת לYouTube';
        suggestion = 'בדוק את חיבור האינטרנט שלך ונסה שוב';
      } else if (error.message.includes('תמלילים')) {
        suggestion = 'נסה סרטון אחר שיש לו תמלילים או כתוביות';
      } else if (error.message.includes('proxy')) {
        errorMessage = 'כל שרתי ה-proxy נכשלו - בעיית רשת';
        suggestion = 'נסה שוב מאוחר יותר או בדוק חיבור האינטרנט';
      }
      
      return {
        success: false,
        error: errorMessage,
        suggestion: suggestion
      };
    }
  }

  /**
   * Fetch video page HTML with multiple proxy attempts
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<string>} - Page HTML
   */
  async fetchVideoPage(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`🌐 Trying to fetch: ${url}`);
    
    let lastError = null;
    
    for (let i = 0; i < this.corsProxies.length; i++) {
      const proxy = this.corsProxies[i];
      try {
        console.log(`🔄 Trying proxy ${i + 1}/${this.corsProxies.length}: ${proxy.split('?')[0]}...`);
        
        let proxyUrl;
        if (proxy.includes('allorigins.win')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else if (proxy.includes('codetabs.com')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else if (proxy.includes('thingproxy.freeboard.io')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else if (proxy.includes('crossorigin.me')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else {
          proxyUrl = proxy + encodeURIComponent(url);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/html, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          let data;
          
          if (contentType.includes('application/json')) {
            const jsonData = await response.json();
            data = jsonData.contents || jsonData.body || jsonData.data || jsonData.response || jsonData;
          } else {
            data = await response.text();
          }
          
          if (typeof data === 'string' && data.length > 1000 && (data.includes('youtube') || data.includes('ytInitialData'))) {
            console.log(`✅ Proxy ${i + 1} succeeded (${data.length} chars)`);
            return data;
          } else {
            throw new Error('Invalid response format or too short');
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`❌ Proxy ${i + 1} failed:`, error.message);
        lastError = error;
        
        // Add small delay between proxy attempts
        if (i < this.corsProxies.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        continue;
      }
    }
    
    throw new Error(`כל שרתי ה-proxy נכשלו. השגיאה האחרונה: ${lastError?.message || 'לא ידוע'}`);
  }

  /**
   * Extract transcript URL from page HTML
   * @param {string} html - Page HTML
   * @param {string} languageCode - Preferred language code
   * @returns {string|null} - Transcript URL or null
   */
  extractTranscriptUrl(html, languageCode) {
    try {
      // Multiple patterns to find captions data - more comprehensive search
      const captionPatterns = [
        /"captions":.*?"playerCaptionsTracklistRenderer":\{"captionTracks":\[(.*?)\]/s,
        /"captionTracks":\[(.*?)\]/s,
        /playerCaptionsTracklistRenderer.*?captionTracks.*?\[(.*?)\]/s,
        /"playerCaptionsRenderer".*?"captionTracks":\[(.*?)\]/s
      ];
      
      let match = null;
      let captionsData = null;
      
      for (const pattern of captionPatterns) {
        match = html.match(pattern);
        if (match && match[1]) {
          captionsData = match[1];
          console.log(`📋 Found captions data with pattern ${captionPatterns.indexOf(pattern) + 1}`);
          break;
        }
      }
      
      if (!captionsData) {
        console.log('❌ No captions data found in page');
        console.log('🔍 Page contains ytInitialData:', html.includes('ytInitialData'));
        console.log('🔍 Page contains playerResponse:', html.includes('playerResponse'));
        return null;
      }
      
      console.log(`📋 Found captions data: ${captionsData.substring(0, 200)}...`);
      
      let tracks;
      try {
        // Clean up the JSON before parsing
        let cleanData = captionsData
          .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // Add quotes to property names
          .replace(/:\s*'([^']*?)'/g, ':"$1"') // Replace single quotes with double quotes
          .replace(/,\s*}/g, '}') // Remove trailing commas from objects
          .replace(/,\s*]/g, ']') // Remove trailing commas from arrays
          .replace(/\\\//g, '/'); // Fix escaped slashes
        
        tracks = JSON.parse(`[${cleanData}]`);
      } catch (parseError) {
        console.error('❌ Failed to parse captions JSON:', parseError);
        console.log('📄 Raw captions data:', captionsData.substring(0, 500));
        return null;
      }
      
      if (!Array.isArray(tracks) || tracks.length === 0) {
        console.log('❌ No caption tracks found');
        return null;
      }
      
      console.log(`📺 Found ${tracks.length} caption tracks`);
      tracks.forEach((track, index) => {
        console.log(`  Track ${index + 1}: ${track.languageCode || 'unknown'} (${track.kind || 'manual'}) - ${track.name?.simpleText || 'no name'}`);
      });
      
      // Find the best matching track
      let selectedTrack = null;
      
      if (languageCode) {
        // Look for exact language match
        selectedTrack = tracks.find(track => 
          track.languageCode === languageCode
        );
        console.log(`🎯 Looking for language: ${languageCode} - ${selectedTrack ? 'Found' : 'Not found'}`);
      }
      
      if (!selectedTrack) {
        // Fall back to auto-generated or first available
        selectedTrack = tracks.find(track => track.kind === 'asr') || // Auto-generated first
                      tracks.find(track => track.languageCode === 'en') || // English fallback
                      tracks.find(track => track.languageCode === 'he') || // Hebrew fallback
                      tracks.find(track => track.languageCode === 'es') || // Spanish fallback
                      tracks.find(track => !track.kind || track.kind === '') || // Manual captions
                      tracks[0]; // First available
        
        if (selectedTrack) {
          console.log(`🔄 Using fallback track: ${selectedTrack.languageCode} (${selectedTrack.kind || 'manual'})`);
        }
      }
      
      const transcriptUrl = selectedTrack?.baseUrl;
      if (transcriptUrl) {
        console.log(`📍 Transcript URL found: ${transcriptUrl.substring(0, 100)}...`);
      } else {
        console.log('❌ No transcript URL found in selected track');
        console.log('🔍 Selected track:', selectedTrack);
      }
      
      return transcriptUrl || null;
      
    } catch (error) {
      console.error('❌ Error extracting transcript URL:', error);
      return null;
    }
  }

  /**
   * Extract available language options from page HTML
   * @param {string} html - Page HTML
   * @returns {Array} - Available language options
   */
  extractLanguageOptions(html) {
    try {
      const captionsRegex = /"captions":.*?"playerCaptionsTracklistRenderer":\{"captionTracks":\[(.*?)\]/;
      const match = html.match(captionsRegex);
      
      if (!match) {
        return [];
      }
      
      const captionsData = match[1];
      const tracks = JSON.parse(`[${captionsData}]`);
      
      return tracks.map(track => ({
        code: track.languageCode,
        name: track.name?.simpleText || track.languageCode,
        auto: track.kind === 'asr'
      }));
      
    } catch (error) {
      console.error('Error extracting language options:', error);
      return [];
    }
  }

  /**
   * Fetch transcript data from transcript URL
   * @param {string} url - Transcript URL
   * @returns {Promise<string>} - Transcript XML data
   */
  async fetchTranscriptData(url) {
    console.log(`📥 Fetching transcript data from: ${url.substring(0, 100)}...`);
    
    let lastError = null;
    
    for (let i = 0; i < this.corsProxies.length; i++) {
      const proxy = this.corsProxies[i];
      try {
        console.log(`🔄 Trying proxy ${i + 1}/${this.corsProxies.length} for transcript...`);
        
        let proxyUrl;
        if (proxy.includes('allorigins.win')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else if (proxy.includes('codetabs.com')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else if (proxy.includes('thingproxy.freeboard.io')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else if (proxy.includes('crossorigin.me')) {
          proxyUrl = proxy + encodeURIComponent(url);
        } else {
          proxyUrl = proxy + encodeURIComponent(url);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/xml, */*',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          let data;
          
          if (contentType.includes('application/json')) {
            const jsonData = await response.json();
            data = jsonData.contents || jsonData.body || jsonData.data || jsonData.response || jsonData;
          } else {
            data = await response.text();
          }
          
          if (typeof data === 'string' && (data.includes('<text') || data.includes('<?xml') || data.includes('<transcript>'))) {
            console.log(`✅ Transcript data received (${data.length} characters)`);
            return data;
          } else {
            throw new Error('Invalid transcript format - no XML content found');
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`❌ Proxy ${i + 1} failed for transcript:`, error.message);
        lastError = error;
        
        // Add small delay between proxy attempts
        if (i < this.corsProxies.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        continue;
      }
    }
    
    throw new Error(`לא ניתן לטעון את נתוני התמלול. השגיאה: ${lastError?.message || 'לא ידוע'}`);
  }

  /**
   * Parse transcript XML data
   * @param {string} xml - Transcript XML
   * @returns {Object} - Parsed transcript with words and timing
   */
  parseTranscript(xml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
      // Check for parse errors
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('שגיאה בפענוח XML');
      }
      
      const textElements = doc.querySelectorAll('text');
      console.log(`📝 Found ${textElements.length} text segments`);
      
      if (textElements.length === 0) {
        throw new Error('לא נמצאו רכיבי טקסט בתמלול');
      }
      
      const words = [];
      let fullText = '';
      let duration = 0;
      
      textElements.forEach((element, index) => {
        const start = parseFloat(element.getAttribute('start')) || 0;
        const dur = parseFloat(element.getAttribute('dur')) || 2;
        let text = element.textContent || '';
        
        // Decode HTML entities
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        text = textarea.value.trim();
        
        if (text) {
          // Split text into words for better granularity
          const wordsInSegment = text.split(/\s+/).filter(word => word.length > 0);
          const timePerWord = wordsInSegment.length > 0 ? dur / wordsInSegment.length : dur;
          
          wordsInSegment.forEach((word, wordIndex) => {
            const wordStart = start + (wordIndex * timePerWord);
            const wordEnd = wordStart + timePerWord;
            
            words.push({
              word: word,
              startTime: Math.round(wordStart * 100) / 100, // Round to 2 decimal places
              endTime: Math.round(wordEnd * 100) / 100,
              confidence: 0.9 // YouTube captions generally high confidence
            });
          });
          
          fullText += text + ' ';
          duration = Math.max(duration, start + dur);
        }
      });
      
      console.log(`✅ Parsed ${words.length} words, duration: ${Math.round(duration)}s`);
      
      return {
        words,
        fullText: fullText.trim(),
        duration: Math.round(duration)
      };
      
    } catch (error) {
      console.error('❌ Error parsing transcript:', error);
      throw new Error(`שגיאה בעיבוד נתוני התמלול: ${error.message}`);
    }
  }

  /**
   * Generate demo transcript if real one fails
   * @param {string} videoId - Video ID
   * @param {string} language - Language code
   * @returns {Object} - Demo transcript data
   */
  generateDemoTranscript(videoId, language = 'he') {
    console.log(`🎭 Generating demo transcript for ${videoId} (${language})`);
    
    const demoTexts = {
      'he': [
        'שלום וברוכים הבאים לסרטון החדש שלנו',
        'היום אנחנו נדבר על נושא מעניין במיוחד',
        'זה נושא שמעניין הרבה אנשים בתחום',
        'בואו נתחיל עם ההקדמה הבסיסית',
        'כפי שאתם יכולים לראות כאן',
        'זה דוגמה טובה למה שדיברנו עליו',
        'אני מקווה שזה עוזר לכם להבין את הנושא',
        'תודה לכם על הצפייה ונתראה בסרטון הבא'
      ],
      'en': [
        'Hello and welcome to our new video',
        'Today we are going to talk about a particularly interesting topic',
        'This is a topic that interests many people in the field',
        'Let\'s start with the basic introduction',
        'As you can see here',
        'This is a good example of what we talked about',
        'I hope this helps you understand the topic',
        'Thank you for watching and see you in the next video'
      ]
    };

    const texts = demoTexts[language] || demoTexts['en'];
    const words = [];
    let currentTime = 0;
    
    texts.forEach((text) => {
      const wordsInText = text.split(' ');
      wordsInText.forEach((word) => {
        words.push({
          word: word,
          startTime: Math.round(currentTime * 100) / 100,
          endTime: Math.round((currentTime + 0.5) * 100) / 100,
          confidence: 0.95
        });
        currentTime += 0.6;
      });
      currentTime += 1; // Pause between sentences
    });

    return {
      success: true,
      data: {
        videoId,
        language,
        transcript: words,
        fullText: texts.join(' '),
        duration: Math.round(currentTime),
        source: 'demo',
        isDemoData: true
      }
    };
  }
}

// Export singleton instance
const youtubeTranscriptService = new YouTubeTranscriptService();
export default youtubeTranscriptService;
