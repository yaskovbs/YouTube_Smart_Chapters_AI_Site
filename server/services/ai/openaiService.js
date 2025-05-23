const OpenAI = require('openai');
const { formatTimestamp } = require('../../utils/textProcessing');

/**
 * OpenAI Service for AI-powered analysis
 */

/**
 * Analyze transcription with OpenAI
 * @param {string} transcriptionText - Transcription text
 * @param {string} language - Language code
 * @param {string} apiKey - OpenAI API key
 * @returns {Object} - Analysis result
 */
async function analyzeWithOpenAI(transcriptionText, language, apiKey) {
  const openai = new OpenAI({ apiKey });
  
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
${transcriptionText}

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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const resultText = response.choices[0].message.content.trim();
    let result;
    
    try {
      // Extract JSON from the response
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from the response');
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      result = {
        mainTopic: "שגיאה בעיבוד הניתוח",
        summary: "הייתה שגיאה בעיבוד ניתוח התמלול.",
        keyPoints: [],
        suggestedChapters: [],
        toneAndStyle: ""
      };
    }
    
    return result;
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Generate chapters with OpenAI
 * @param {Object} analysis - Analysis result
 * @param {Array} transcription - Transcription data with word timestamps
 * @param {Array} sentenceTimestamps - Key sentence timestamps
 * @param {string} language - Language code
 * @param {string} apiKey - OpenAI API key
 * @returns {Array} - Generated chapters with timestamps
 */
async function generateChaptersWithOpenAI(analysis, transcription, sentenceTimestamps, language, apiKey) {
  const openai = new OpenAI({ apiKey });
  
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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const resultText = response.choices[0].message.content.trim();
    let chapters;
    
    try {
      // Extract JSON from the response
      const jsonMatch = resultText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        chapters = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from the response');
      }
    } catch (error) {
      console.error('Error parsing OpenAI chapters response:', error);
      chapters = [
        { title: "הקדמה", startTime: 0, endTime: 60, description: "תחילת הסרטון" }
      ];
    }
    
    // Format timestamps to HH:MM:SS
    chapters.forEach(chapter => {
      chapter.formattedStartTime = formatTimestamp(chapter.startTime);
      chapter.formattedEndTime = formatTimestamp(chapter.endTime);
    });
    
    return chapters;
    
  } catch (error) {
    console.error('OpenAI chapters generation error:', error);
    throw error;
  }
}

/**
 * Generate metadata with OpenAI
 * @param {Object} analysis - Analysis result
 * @param {string} language - Language code
 * @param {string} apiKey - OpenAI API key
 * @returns {Object} - Generated metadata
 */
async function generateMetadataWithOpenAI(analysis, language, apiKey) {
  const openai = new OpenAI({ apiKey });
  
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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const resultText = response.choices[0].message.content.trim();
    let metadata;
    
    try {
      // Extract JSON from the response
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        metadata = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from the response');
      }
    } catch (error) {
      console.error('Error parsing OpenAI metadata response:', error);
      metadata = {
        title: analysis.mainTopic || "כותרת הסרטון",
        description: analysis.summary || "תיאור הסרטון",
        tags: [],
        hashtags: []
      };
    }
    
    return metadata;
    
  } catch (error) {
    console.error('OpenAI metadata generation error:', error);
    throw error;
  }
}

module.exports = {
  analyzeWithOpenAI,
  generateChaptersWithOpenAI,
  generateMetadataWithOpenAI
};
