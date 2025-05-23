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
   * Basic chapter generation without AI (fallback) - IMPROVED VERSION
   * Now uses actual transcript timing and natural breaks instead of simple division
   * @param {Array} transcript - Transcript with timestamps
   * @param {string} language - Language code
   * @returns {Array} - Smart chapters based on transcript breaks
   */
  generateBasicChapters(transcript, language = 'he') {
    if (!transcript || transcript.length === 0) {
      return [];
    }

    const totalDuration = Math.max(...transcript.map(word => word.endTime));
    
    // Find natural break points in the transcript
    const naturalBreaks = this.findNaturalBreaks(transcript);
    
    // If we have too few natural breaks, add some based on timing
    if (naturalBreaks.length < 3) {
      const timeBasedBreaks = this.generateTimeBasedBreaks(totalDuration, 4);
      naturalBreaks.push(...timeBasedBreaks);
      naturalBreaks.sort((a, b) => a.time - b.time);
    }

    // Limit to reasonable number of chapters
    const maxChapters = Math.min(8, naturalBreaks.length + 1);
    const selectedBreaks = naturalBreaks.slice(0, maxChapters - 1);

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
      ]
    };

    const titles = chapterTitles[language] || chapterTitles['en'];
    const chapters = [];

    // Add first chapter (always starts at 0:00)
    let chapterStart = 0;
    
    selectedBreaks.forEach((breakPoint, index) => {
      const chapterEnd = Math.floor(breakPoint.time);
      
      chapters.push({
        id: index + 1,
        title: titles[index] || `${language === 'he' ? 'פרק' : 'Chapter'} ${index + 1}`,
        startTime: Math.floor(chapterStart),
        endTime: chapterEnd,
        formattedStartTime: this.formatTimestamp(chapterStart),
        formattedEndTime: this.formatTimestamp(chapterEnd),
        description: breakPoint.reason || `${language === 'he' ? 'תוכן של פרק' : 'Chapter content'} ${index + 1}`
      });
      
      chapterStart = chapterEnd;
    });

    // Add final chapter
    if (chapterStart < totalDuration) {
      chapters.push({
        id: chapters.length + 1,
        title: titles[chapters.length] || `${language === 'he' ? 'פרק' : 'Chapter'} ${chapters.length + 1}`,
        startTime: Math.floor(chapterStart),
        endTime: Math.floor(totalDuration),
        formattedStartTime: this.formatTimestamp(chapterStart),
        formattedEndTime: this.formatTimestamp(totalDuration),
        description: `${language === 'he' ? 'תוכן של פרק' : 'Chapter content'} ${chapters.length + 1}`
      });
    }

    return chapters;
  }

  /**
   * Find natural break points in transcript based on pauses and content
   * @param {Array} transcript - Transcript words with timestamps
   * @returns {Array} - Natural break points
   */
  findNaturalBreaks(transcript) {
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
          confidence: Math.min(pause / 5.0, 1.0) // Higher confidence for longer pauses
        });
        continue;
      }
      
      // Look for sentence endings followed by new topics
      if (previousWord.word.includes('.') || previousWord.word.includes('!') || previousWord.word.includes('?')) {
        // Check if next words suggest topic change
        const nextFewWords = transcript.slice(i, i + 3).map(w => w.word.toLowerCase()).join(' ');
        
        const topicChangeWords = {
          'he': ['עכשיו', 'הבא', 'נמשיך', 'נעבור', 'אחר כך', 'בנוסף', 'כמו כן', 'וגם'],
          'en': ['now', 'next', 'then', 'also', 'furthermore', 'additionally', 'moreover', 'so']
        };
        
        const words = topicChangeWords['he'].concat(topicChangeWords['en']);
        
        if (words.some(word => nextFewWords.includes(word))) {
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
