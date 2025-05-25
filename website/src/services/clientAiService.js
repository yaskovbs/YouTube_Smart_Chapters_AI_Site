/**
 * Client-side AI Service - works directly with AI APIs
 * No server needed - completely client-side processing
 */

class ClientAiService {
  constructor() {
    this.openAiBaseUrl = 'https://api.openai.com/v1';
    this.assemblyAiBaseUrl = 'https://api.assemblyai.com/v2';
  }

  /**
   * Analyze transcript content with OpenAI
   * @param {string} transcriptText - Full transcript text
   * @param {string} language - Language code
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeWithOpenAI(transcriptText, language = 'he', apiKey) {
    if (!apiKey) {
      throw new Error('מפתח OpenAI נדרש לניתוח מתקדם');
    }

    const promptLanguage = {
      'he': 'עברית',
      'en': 'English',
      'uk': 'українська',
      'ar': 'العربية',
      'ru': 'русский',
      'fr': 'français',
      'es': 'español',
      'de': 'Deutsch'
    }[language] || 'עברית';

    const prompt = `הבא הוא תמלול של סרטון ב${promptLanguage}. 
אנא נתח אותו וזהה את הנושאים העיקריים, נקודות המפתח, והמבנה הכללי של התוכן.
התמקד בזיהוי הפסקות פרקים טבעיות שבהן הנושא משתנה.

תמלול:
${transcriptText}

ספק את הניתוח בפורמט JSON עם המבנה הבא:
{
  "mainTopic": "תיאור קצר של נושא הסרטון הכללי",
  "summary": "סיכום תמציתי של התוכן",
  "keyPoints": ["נקודת מפתח 1", "נקודת מפתח 2", ...],
  "suggestedChapters": [
    { "title": "הקדמה", "description": "תיאור קצר" },
    { "title": "נושא 1", "description": "תיאור קצר" },
    ...
  ],
  "toneAndStyle": "תיאור של טון הרצאה וסגנון"
}`;

    try {
      const response = await fetch(`${this.openAiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה בקריאה ל-OpenAI');
      }

      const data = await response.json();
      const resultText = data.choices[0].message.content.trim();
      
      try {
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('לא ניתן לחלץ JSON מהתשובה');
        }
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        return {
          mainTopic: "שגיאה בעיבוד הניתוח",
          summary: "הייתה שגיאה בעיבוד ניתוח התמלול.",
          keyPoints: [],
          suggestedChapters: [],
          toneAndStyle: ""
        };
      }

    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error.message.includes('401')) {
        throw new Error('מפתח OpenAI לא חוקי - בדוק את המפתח');
      } else if (error.message.includes('429')) {
        throw new Error('חרגת ממכסת השימוש ב-OpenAI');
      } else if (error.message.includes('quota')) {
        throw new Error('מכסת ה-API של OpenAI מוקפאת');
      }
      
      throw error;
    }
  }

  /**
   * Generate chapters from analysis using OpenAI
   * @param {Object} analysis - Analysis results
   * @param {Array} transcript - Transcript with timestamps
   * @param {string} language - Language code
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<Array>} - Generated chapters
   */
  async generateChaptersWithOpenAI(analysis, transcript, language = 'he', apiKey) {
    if (!apiKey) {
      throw new Error('מפתח OpenAI נדרש ליצירת פרקים מתקדמים');
    }

    // Extract key sentence timestamps for better chapter timing
    const sentenceTimestamps = this.extractKeySentenceTimestamps(transcript);

    const promptLanguage = {
      'he': 'עברית',
      'en': 'English',
      'uk': 'українська',
      'ar': 'العربية',
      'ru': 'русский',
      'fr': 'français',
      'es': 'español',
      'de': 'Deutsch'
    }[language] || 'עברית';

    const prompt = `בהתבסס על ניתוח של סרטון ב${promptLanguage} וחותמות הזמן של משפטים מרכזיים שסופקו, 
צור פרקים מתאימים עם חותמות זמן לסרטון.

ניתוח:
${JSON.stringify(analysis)}

חותמות זמן של משפטים מרכזיים (בשניות):
${JSON.stringify(sentenceTimestamps)}

צור בין 5-10 פרקים בהתבסס על התוכן. הפרק הראשון צריך להתחיל ב-0:00.
כל פרק צריך להיות מיושר עם שינוי משמעותי בנושא או תוכן.

ספק את המלצות הפרקים בפורמט JSON עם המבנה הבא:
[
  { 
    "title": "כותרת הפרק", 
    "startTime": 0, 
    "endTime": 120,
    "description": "תיאור קצר של תוכן הפרק"
  },
  ...
]

כותרות הפרקים צריכות להיות תמציתיות ותיאוריות. זמנים צריכים להיות בשניות.`;

    try {
      const response = await fetch(`${this.openAiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה בקריאה ל-OpenAI');
      }

      const data = await response.json();
      const resultText = data.choices[0].message.content.trim();
      
      try {
        const jsonMatch = resultText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const chapters = JSON.parse(jsonMatch[0]);
          
          // Format timestamps to HH:MM:SS
          chapters.forEach(chapter => {
            chapter.formattedStartTime = this.formatTimestamp(chapter.startTime);
            chapter.formattedEndTime = this.formatTimestamp(chapter.endTime);
          });
          
          return chapters;
        } else {
          throw new Error('לא ניתן לחלץ JSON מהתשובה');
        }
      } catch (parseError) {
        console.error('Error parsing OpenAI chapters response:', parseError);
        return [
          { 
            title: "הקדמה", 
            startTime: 0, 
            endTime: 60, 
            formattedStartTime: "0:00",
            formattedEndTime: "1:00",
            description: "תחילת הסרטון" 
          }
        ];
      }

    } catch (error) {
      console.error('OpenAI chapters generation error:', error);
      throw error;
    }
  }

  /**
   * Generate metadata using OpenAI
   * @param {Object} analysis - Analysis results
   * @param {string} language - Language code
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<Object>} - Generated metadata
   */
  async generateMetadataWithOpenAI(analysis, language = 'he', apiKey) {
    if (!apiKey) {
      throw new Error('מפתח OpenAI נדרש ליצירת מטא-נתונים מתקדמים');
    }

    const promptLanguage = {
      'he': 'עברית',
      'en': 'English',
      'uk': 'українська',
      'ar': 'العربية',
      'ru': 'русский',
      'fr': 'français',
      'es': 'español',
      'de': 'Deutsch'
    }[language] || 'עברית';

    const prompt = `בהתבסס על ניתוח של סרטון ב${promptLanguage}, צור מטא-נתונים מותאמי SEO לסרטון YouTube זה.

ניתוח:
${JSON.stringify(analysis)}

ספק את המטא-נתונים בפורמט JSON עם המבנה הבא:
{
  "title": "כותרת מושכת ומותאמת SEO (מקס 100 תווים)",
  "description": "תיאור מפורט עם מילות מפתח, הפניות לחותמות זמן וקריאות לפעולה (מקס 5000 תווים)",
  "tags": ["תג1", "תג2", "תג3", ...],
  "hashtags": ["#האשטג1", "#האשטג2", "#האשטג3", ...]
}

הכותרת צריכה להיות מושכת וכולל מונחי מפתח.
התיאור צריך להיות מקיף, כולל מילות מפתח ומבנה טוב עם פסקאות.
כלול עד 15 תגים רלוונטיים לחיפוש.
כלול 5-7 האשטגים רלוונטיים.

וודא שכל התוכן הוא ב${promptLanguage}.`;

    try {
      const response = await fetch(`${this.openAiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה בקריאה ל-OpenAI');
      }

      const data = await response.json();
      const resultText = data.choices[0].message.content.trim();
      
      try {
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('לא ניתן לחלץ JSON מהתשובה');
        }
      } catch (parseError) {
        console.error('Error parsing OpenAI metadata response:', parseError);
        return {
          title: analysis.mainTopic || "כותרת הסרטון",
          description: analysis.summary || "תיאור הסרטון",
          tags: [],
          hashtags: []
        };
      }

    } catch (error) {
      console.error('OpenAI metadata generation error:', error);
      throw error;
    }
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   * @param {File} audioFile - Audio file to transcribe
   * @param {string} language - Language code
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<Object>} - Transcription results
   */
  async transcribeWithWhisper(audioFile, language = 'he', apiKey) {
    if (!apiKey) {
      throw new Error('מפתח OpenAI נדרש לתמלול עם Whisper');
    }

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    try {
      const response = await fetch(`${this.openAiBaseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה בתמלול עם Whisper');
      }

      const data = await response.json();
      
      // Process Whisper response to match our format
      const words = [];
      if (data.words) {
        data.words.forEach(wordData => {
          words.push({
            word: wordData.word,
            startTime: wordData.start,
            endTime: wordData.end,
            confidence: 0.95 // Whisper generally high confidence
          });
        });
      }

      return {
        success: true,
        data: {
          transcript: words,
          fullText: data.text,
          language: data.language,
          duration: data.duration,
          source: 'openai_whisper'
        }
      };

    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }

  /**
   * Basic chapter generation without AI (fallback) - FIXED VERSION
   * Creates intelligent chapters based on video duration with STRICT rules for short videos
   * @param {Array} transcript - Transcript with timestamps
   * @param {string} language - Language code
   * @returns {Array} - Smart chapters based on duration and content
   */
  generateBasicChapters(transcript, language = 'he') {
    if (!transcript || transcript.length === 0) {
      console.log('🚫 generateBasicChapters: Empty transcript');
      return [];
    }

    const totalDuration = Math.max(...transcript.map(word => word.endTime));
    const isHebrew = language === 'he';
    
    console.log('🎬 generateBasicChapters DEBUG:');
    console.log('   📊 Total Duration:', totalDuration + ' seconds');
    console.log('   🗣️ Language:', language);
    console.log('   📝 Transcript length:', transcript.length + ' words');
    
    // STRICT chapter rules - extremely conservative for quality
    let targetChapterCount = 1;
    let minChapterLength = 60;
    
    // For videos under 2 minutes - ALWAYS single chapter
    if (totalDuration <= 120) {
      console.log('   ⚡ Short video (<= 2 minutes) - SINGLE CHAPTER ONLY');
      targetChapterCount = 1;
      minChapterLength = totalDuration;
    } else if (totalDuration <= 240) {
      // 2-4 minutes: Max 2 chapters
      console.log('   📝 Medium video (2-4 minutes) - Max 2 chapters');
      targetChapterCount = 2;
      minChapterLength = 90;
    } else if (totalDuration <= 480) {
      // 4-8 minutes: Max 3 chapters
      console.log('   📚 Long video (4-8 minutes) - Max 3 chapters');
      targetChapterCount = 3;
      minChapterLength = 120;
    } else if (totalDuration <= 720) {
      // 8-12 minutes: Max 4 chapters
      console.log('   📖 Very long video (8-12 minutes) - Max 4 chapters');
      targetChapterCount = 4;
      minChapterLength = 150;
    } else {
      // 12+ minutes: Max 5 chapters
      console.log('   📗 Extra long video (12+ minutes) - Max 5 chapters');
      targetChapterCount = 5;
      minChapterLength = 180;
    }

    console.log('   🎯 Target Chapter Count:', targetChapterCount);
    console.log('   ⏱️ Min Chapter Length:', minChapterLength + ' seconds');

    const chapterTitles = {
      'he': ['תוכן הסרטון', 'התחלה', 'המשך', 'סיכום', 'סיום'],
      'en': ['Video Content', 'Introduction', 'Main Content', 'Summary', 'Conclusion']
    };

    const titles = chapterTitles[language] || chapterTitles['en'];
    const chapters = [];

    if (targetChapterCount === 1) {
      // Single chapter for short videos
      console.log('   ✅ Creating SINGLE chapter for entire video');
      chapters.push({
        id: 1,
        title: titles[0],
        startTime: 0,
        endTime: Math.floor(totalDuration),
        formattedStartTime: this.formatTimestamp(0),
        formattedEndTime: this.formatTimestamp(totalDuration),
        description: isHebrew ? 'כל התוכן של הסרטון' : 'Complete video content'
      });
    } else {
      // Multiple chapters for longer videos
      console.log('   📋 Creating', targetChapterCount, 'chapters for longer video');
      
      const chapterDuration = totalDuration / targetChapterCount;
      console.log('   📏 Chapter duration:', chapterDuration + ' seconds');
      
      for (let i = 0; i < targetChapterCount; i++) {
        const startTime = Math.floor(i * chapterDuration);
        // FIX: Ensure end time doesn't exceed video duration
        const calculatedEndTime = Math.floor((i + 1) * chapterDuration);
        const endTime = i === targetChapterCount - 1 ? 
          Math.floor(totalDuration) : 
          Math.min(calculatedEndTime, Math.floor(totalDuration));
        
        console.log(`   ⏰ Chapter ${i + 1}: ${startTime}s - ${endTime}s`);
        
        // Skip chapters that start beyond video duration
        if (startTime >= Math.floor(totalDuration)) {
          console.log(`   ⚠️ Skipping chapter ${i + 1} - starts beyond video duration`);
          break;
        }
        
        chapters.push({
          id: i + 1,
          title: titles[i] || `${isHebrew ? 'פרק' : 'Chapter'} ${i + 1}`,
          startTime: startTime,
          endTime: endTime,
          formattedStartTime: this.formatTimestamp(startTime),
          formattedEndTime: this.formatTimestamp(endTime),
          description: `${isHebrew ? 'תוכן פרק' : 'Chapter content'} ${i + 1}`
        });
      }
    }

    console.log('   ✅ Generated', chapters.length, 'chapters');
    chapters.forEach((chapter, index) => {
      console.log(`   📌 Chapter ${index + 1}: "${chapter.title}" (${chapter.formattedStartTime} - ${chapter.formattedEndTime})`);
    });

    return chapters;
  }

  /**
   * Find natural break points in transcript - DISABLED FOR NOW
   * @param {Array} transcript - Transcript words with timestamps
   * @returns {Array} - Empty array (disabled)
   */
  findNaturalBreaks(transcript) {
    // DISABLED - causing too many chapters
    console.log('🚫 findNaturalBreaks: DISABLED to prevent too many chapters');
    return [];
  }

  /**
   * Generate time-based breaks as fallback - SIMPLIFIED
   * @param {number} totalDuration - Total duration in seconds
   * @param {number} count - Number of breaks needed
   * @returns {Array} - Time-based break points
   */
  generateTimeBasedBreaks(totalDuration, count) {
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
   * Extract key sentence timestamps from transcript
   * @param {Array} transcript - Transcript words with timestamps
   * @returns {Array} - Key sentence timestamps
   */
  extractKeySentenceTimestamps(transcript) {
    if (!transcript || transcript.length === 0) {
      return [];
    }

    const sentences = [];
    let currentSentence = [];
    let sentenceStart = transcript[0].startTime;

    transcript.forEach((word, index) => {
      currentSentence.push(word.word);
      
      // Check for sentence ending
      if (word.word.includes('.') || word.word.includes('!') || word.word.includes('?') || 
          index === transcript.length - 1) {
        
        sentences.push({
          text: currentSentence.join(' '),
          startTime: sentenceStart,
          endTime: word.endTime
        });
        
        currentSentence = [];
        if (index < transcript.length - 1) {
          sentenceStart = transcript[index + 1].startTime;
        }
      }
    });

    // Return every 3rd sentence for chapter markers
    return sentences
      .filter((_, index) => index % 3 === 0)
      .map(sentence => ({
        time: sentence.startTime,
        text: sentence.text.substring(0, 50) + '...'
      }));
  }

  /**
   * Format time in MM:SS or HH:MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} - Formatted time string
   */
  formatTimestamp(seconds) {
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
   * Generate demo metadata (fallback)
   * @param {Object} analysis - Analysis results
   * @param {string} language - Language code
   * @returns {Object} - Demo metadata
   */
  generateDemoMetadata(analysis, language = 'he') {
    const isHebrew = language === 'he';
    
    return {
      title: analysis.mainTopic || (isHebrew ? "סרטון מנותח" : "Analyzed Video"),
      description: analysis.summary || (isHebrew ? "תיאור הסרטון" : "Video Description"),
      tags: analysis.keyPoints?.slice(0, 10) || [],
      hashtags: analysis.keyPoints?.slice(0, 5).map(point => 
        `#${point.replace(/\s+/g, '').substring(0, 20)}`
      ) || []
    };
  }
}

// Export singleton instance
const clientAiService = new ClientAiService();
export default clientAiService;
