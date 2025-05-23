const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const { AssemblyAI } = require('assemblyai');
const NodeCache = require('node-cache');
const { exec } = require('child_process');

// TTL cache for transcriptions (24 hours TTL)
const transcriptionsCache = new NodeCache({ 
  stdTTL: 24 * 60 * 60, // 24 hours in seconds
  checkperiod: 60 * 60 // Check for expired keys every hour
});

// Language code mapping for AssemblyAI
const languageCodes = {
  'he': 'he', // Hebrew
  'en': 'en', // English
  'uk': 'uk', // Ukrainian  
  'ar': 'ar', // Arabic
  'ru': 'ru', // Russian
  'fr': 'fr', // French
  'es': 'es', // Spanish
  'de': 'de'  // German
};

// Check if FFmpeg is available
let ffmpegAvailable = null;

/**
 * Check if FFmpeg is installed and accessible
 * @returns {Promise<boolean>} - True if FFmpeg is available
 */
async function checkFFmpegAvailability() {
  if (ffmpegAvailable !== null) {
    return ffmpegAvailable;
  }
  
  return new Promise((resolve) => {
    exec('ffmpeg -version', (error, stdout, stderr) => {
      ffmpegAvailable = !error;
      console.log(`FFmpeg availability check: ${ffmpegAvailable ? 'Available' : 'Not available'}`);
      if (!ffmpegAvailable) {
        console.log('FFmpeg not found - demo mode will be used');
      }
      resolve(ffmpegAvailable);
    });
  });
}

/**
 * Generate demo transcription data for testing
 * @param {string} sourceId - Source ID (video ID or file ID)
 * @param {string} language - Language code
 * @returns {Object} - Demo transcription data
 */
function generateDemoTranscription(sourceId, language) {
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
  const chapters = [];
  let currentTime = 0;
  
  // Generate demo words with timestamps
  texts.forEach((text, sentenceIndex) => {
    const sentenceWords = text.split(' ');
    sentenceWords.forEach((word, wordIndex) => {
      words.push({
        word: word,
        startTime: currentTime,
        endTime: currentTime + 0.5,
        confidence: 0.95
      });
      currentTime += 0.6;
    });
    currentTime += 1; // Pause between sentences
  });
  
  // Generate demo chapters
  const chapterTitles = {
    'he': [
      'פתיחה וברכות',
      'הצגת הנושא',
      'הסבר מפורט',
      'דוגמאות מעשיות',
      'סיכום וסיום'
    ],
    'en': [
      'Opening and Greetings',
      'Topic Introduction',
      'Detailed Explanation',
      'Practical Examples',
      'Summary and Conclusion'
    ]
  };
  
  const chapterNames = chapterTitles[language] || chapterTitles['en'];
  const chapterDuration = currentTime / chapterNames.length;
  
  chapterNames.forEach((title, index) => {
    chapters.push({
      id: index + 1,
      title: title,
      startTime: index * chapterDuration,
      endTime: (index + 1) * chapterDuration,
      formattedStartTime: formatTime(index * chapterDuration),
      summary: title,
      headline: title,
      gist: title
    });
  });
  
  return {
    words,
    chapters,
    fullText: texts.join(' '),
    confidence: 0.95,
    isDemoData: true
  };
}

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Validation middleware for transcription generation
 */
const validateTranscriptionInput = [
  body('source').isIn(['youtube', 'file']).withMessage('Source must be either "youtube" or "file"'),
  body('sourceId').notEmpty().withMessage('Source ID is required'),
  body('language').optional().isIn(Object.keys(languageCodes)).withMessage('Invalid language code'),
  body('customApiKey').optional().isString().withMessage('Custom API key must be a string'),
];

/**
 * Generate a transcription from a video
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.generateTranscription = [
  ...validateTranscriptionInput,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { source, sourceId, language, customApiKey } = req.body;
      
      // Check if transcription already exists in cache
      const cacheKey = `${source}_${sourceId}_${language || 'auto'}`;
      const cachedTranscription = transcriptionsCache.get(cacheKey);
      
      if (cachedTranscription) {
        console.log(`Returning cached transcription for ${cacheKey}`);
        return res.status(200).json({
          success: true,
          data: cachedTranscription,
          cached: true
        });
      }
      
      // Check FFmpeg availability
      const ffmpegIsAvailable = await checkFFmpegAvailability();
      
      if (!ffmpegIsAvailable) {
        console.log(`FFmpeg not available - generating demo transcription for ${source}:${sourceId}`);
        
        // Generate demo transcription
        const languageCode = language || 'he';
        const demoData = generateDemoTranscription(sourceId, languageCode);
        
        // Store demo transcription in cache
        const transcriptionId = uuidv4();
        const transcriptionRecord = {
          id: transcriptionId,
          source,
          sourceId,
          languageCode,
          transcription: demoData.words,
          chapters: demoData.chapters,
          fullText: demoData.fullText,
          confidence: demoData.confidence,
          isDemoData: true,
          timestamp: new Date().toISOString()
        };
        
        transcriptionsCache.set(cacheKey, transcriptionRecord);
        transcriptionsCache.set(transcriptionId, transcriptionRecord);
        
        return res.status(200).json({
          success: true,
          data: transcriptionRecord,
          message: 'נתונים דמו - התקן FFmpeg לתמלול אמיתי',
          isDemoData: true
        });
      }
      
      // Real processing with FFmpeg (original code)
      const audioDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      const audioOutputPath = path.join(audioDir, `${uuidv4()}.wav`);
      let audioFilePath;
      
      // Extract audio based on source
      if (source === 'youtube') {
        try {
          await extractYoutubeAudio(sourceId, audioOutputPath);
          audioFilePath = audioOutputPath;
        } catch (error) {
          console.error('Error extracting YouTube audio:', error);
          
          // Provide detailed error messages for common issues
          let userMessage = 'שגיאה בחילוץ אודיו מסרטון YouTube';
          let solution = '';
          
          if (error.message.includes('Cannot find ffmpeg')) {
            userMessage = 'חסר תוכנת FFmpeg הנדרשת לחילוץ אודיו';
            solution = 'פתרונות: 1) השתמש בתוסף Chrome במקום האתר 2) העלה קובץ אודיו ישירות 3) התקן FFmpeg במחשב';
          } else if (error.message.includes('Could not extract functions')) {
            userMessage = 'YouTube שינה את המערכת שלהם ומונע הורדת אודיו';
            solution = 'פתרונות: 1) השתמש בתוסף Chrome (יציב יותר) 2) נסה URL פשוט יותר ללא פרמטרים 3) העלה קובץ אודיו';
          } else if (error.message.includes('Video unavailable')) {
            userMessage = 'הסרטון לא זמין או פרטי';
            solution = 'בדוק שהסרטון זמין לציבור ונסה שוב';
          }
          
          return res.status(500).json({
            success: false,
            message: userMessage,
            solution: solution,
            technicalError: error.message,
            recommendation: 'מומלץ להשתמש בתוסף Chrome לתוצאות טובות יותר'
          });
        }
      } else if (source === 'file') {
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
          return res.status(404).json({
            success: false,
            message: 'תיקיית ההעלאות לא נמצאה'
          });
        }
        
        const files = fs.readdirSync(uploadsDir);
        const videoFile = files.find(file => file.startsWith(sourceId));
        
        if (!videoFile) {
          return res.status(404).json({
            success: false,
            message: 'קובץ הוידאו לא נמצא'
          });
        }
        
        const videoPath = path.join(uploadsDir, videoFile);
        
        try {
          await extractFileAudio(videoPath, audioOutputPath);
          audioFilePath = audioOutputPath;
        } catch (error) {
          console.error('Error extracting file audio:', error);
          
          let userMessage = 'שגיאה בחילוץ אודיו מקובץ הוידאו';
          let solution = '';
          
          if (error.message.includes('Cannot find ffmpeg')) {
            userMessage = 'חסר תוכנת FFmpeg הנדרשת לעיבוד קובצי וידאו';
            solution = 'יש להתקין FFmpeg או להשתמש בתוסף Chrome';
          }
          
          return res.status(500).json({
            success: false,
            message: userMessage,
            solution: solution,
            technicalError: error.message
          });
        }
      }
      
      // Initialize AssemblyAI client
      const apiKey = customApiKey || process.env.ASSEMBLYAI_API_KEY;
      if (!apiKey) {
        // Clean up audio file before returning error
        if (fs.existsSync(audioFilePath)) {
          fs.unlinkSync(audioFilePath);
        }
        
        return res.status(400).json({
          success: false,
          message: 'מפתח API של AssemblyAI לא סופק',
          solution: 'עבור להגדרות והכנס את מפתח AssemblyAI שלך',
          instructions: 'ניתן להשיג מפתח בחינם מ- assemblyai.com'
        });
      }
      
      const client = new AssemblyAI({ apiKey });
      
      // Configure language
      let languageCode = 'he'; // Default to Hebrew
      if (language && languageCodes[language]) {
        languageCode = languageCodes[language];
      }
      
      // Upload audio file and create transcript
      try {
        console.log(`Starting transcription for ${source}:${sourceId} in language ${languageCode}`);
        
        // Configure transcription parameters
        const params = {
          audio: audioFilePath,
          language_code: languageCode,
          auto_chapters: true, // Enable automatic chapter detection
          punctuate: true,
          format_text: true,
          speaker_labels: false, // Disable for better performance
          word_boost: [], // Can be configured for domain-specific terms
          boost_param: 'default'
        };
        
        // Create transcript
        const transcript = await client.transcripts.transcribe(params);
        
        if (transcript.status === 'error') {
          throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
        }
        
        // Process results
        const transcriptionData = processAssemblyAIResults(transcript);
        
        // Store transcription in cache
        const transcriptionId = uuidv4();
        const transcriptionRecord = {
          id: transcriptionId,
          source,
          sourceId,
          languageCode,
          transcription: transcriptionData.words,
          chapters: transcriptionData.chapters,
          fullText: transcript.text,
          confidence: transcript.confidence,
          timestamp: new Date().toISOString()
        };
        
        transcriptionsCache.set(cacheKey, transcriptionRecord);
        transcriptionsCache.set(transcriptionId, transcriptionRecord); // Also store by ID for retrieval
        
        console.log(`Transcription completed successfully for ${source}:${sourceId}`);
        
        return res.status(200).json({
          success: true,
          data: transcriptionRecord
        });
        
      } catch (error) {
        console.error('Error with AssemblyAI transcription:', error);
        
        let errorMessage = 'שגיאה ביצירת התמלול';
        let solution = '';
        
        if (error.message.includes('authentication')) {
          errorMessage = 'מפתח API של AssemblyAI לא חוקי';
          solution = 'בדוק שהמפתח נכון והוא פעיל';
        } else if (error.message.includes('quota')) {
          errorMessage = 'חרגת ממכסת השימוש ב-AssemblyAI';
          solution = 'שדרג את התוכנית שלך ב-AssemblyAI או חכה לחידוש המכסה';
        } else if (error.message.includes('file')) {
          errorMessage = 'שגיאה בקובץ האודיו';
          solution = 'בדוק שהקובץ תקין ונסה שוב';
        }
        
        return res.status(500).json({
          success: false,
          message: errorMessage,
          solution: solution,
          technicalError: error.message
        });
        
      } finally {
        // Clean up audio file
        if (fs.existsSync(audioFilePath)) {
          try {
            fs.unlinkSync(audioFilePath);
            console.log(`Cleaned up audio file: ${audioFilePath}`);
          } catch (cleanupError) {
            console.error('Error cleaning up audio file:', cleanupError);
          }
        }
      }
      
    } catch (error) {
      console.error('Error generating transcription:', error);
      return res.status(500).json({
        success: false,
        message: 'שגיאה כללית ביצירת התמלול',
        solution: 'נסה שוב או השתמש בתוסף Chrome',
        technicalError: error.message
      });
    }
  }
];

/**
 * Get a previously generated transcription
 * @param {Object} req - The request object  
 * @param {Object} res - The response object
 */
exports.getTranscription = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'מזהה התמלול נדרש'
      });
    }
    
    const transcriptionData = transcriptionsCache.get(id);
    
    if (!transcriptionData) {
      return res.status(404).json({
        success: false,
        message: 'התמלול לא נמצא או שפג תוקפו'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: transcriptionData
    });
  } catch (error) {
    console.error('Error getting transcription:', error);
    return res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת התמלול',
      error: error.message
    });
  }
};

/**
 * Extract audio from YouTube video
 * @param {string} videoId - YouTube video ID
 * @param {string} outputPath - Output file path
 * @returns {Promise} - Promise that resolves when audio extraction is complete
 */
async function extractYoutubeAudio(videoId, outputPath) {
  return new Promise((resolve, reject) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
      const audioStream = ytdl(videoUrl, { 
        quality: 'highestaudio',
        filter: 'audioonly' 
      });
      
      audioStream.on('error', (error) => {
        reject(new Error(`שגיאה בהורדת אודיו מ-YouTube: ${error.message}`));
      });
      
      ffmpeg(audioStream)
        .audioBitrate(128)
        .audioFrequency(16000)
        .audioChannels(1)
        .format('wav')
        .on('end', () => {
          console.log('YouTube audio extraction completed');
          resolve();
        })
        .on('error', (err) => {
          reject(new Error(`שגיאה בעיבוד אודיו: ${err.message}`));
        })
        .save(outputPath);
        
    } catch (error) {
      reject(new Error(`שגיאה כללית בחילוץ אודיו: ${error.message}`));
    }
  });
}

/**
 * Extract audio from video file
 * @param {string} videoPath - Path to video file
 * @param {string} outputPath - Output file path
 * @returns {Promise} - Promise that resolves when audio extraction is complete
 */
async function extractFileAudio(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(videoPath)) {
      reject(new Error('קובץ הוידאו לא נמצא'));
      return;
    }
    
    ffmpeg(videoPath)
      .audioBitrate(128)
      .audioFrequency(16000)
      .audioChannels(1)
      .format('wav')
      .on('end', () => {
        console.log('File audio extraction completed');
        resolve();
      })
      .on('error', (err) => {
        reject(new Error(`שגיאה בעיבוד קובץ האודיו: ${err.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Process AssemblyAI transcription results
 * @param {Object} transcript - AssemblyAI transcript object
 * @returns {Object} - Processed transcription with word timestamps and chapters
 */
function processAssemblyAIResults(transcript) {
  const words = [];
  const chapters = [];
  
  // Process words with timestamps
  if (transcript.words) {
    transcript.words.forEach(wordInfo => {
      words.push({
        word: wordInfo.text,
        startTime: wordInfo.start / 1000, // Convert from milliseconds to seconds
        endTime: wordInfo.end / 1000,
        confidence: wordInfo.confidence
      });
    });
  }
  
  // Process auto-generated chapters
  if (transcript.chapters) {
    transcript.chapters.forEach((chapter, index) => {
      chapters.push({
        id: index + 1,
        title: chapter.summary || `פרק ${index + 1}`,
        startTime: chapter.start / 1000, // Convert from milliseconds to seconds
        endTime: chapter.end / 1000,
        formattedStartTime: formatTime(chapter.start / 1000),
        summary: chapter.summary,
        headline: chapter.headline,
        gist: chapter.gist
      });
    });
  }
  
  return {
    words,
    chapters
  };
}

/**
 * Get cache statistics (for debugging)
 */
exports.getCacheStats = (req, res) => {
  try {
    const stats = transcriptionsCache.getStats();
    return res.status(200).json({
      success: true,
      data: {
        keys: stats.keys,
        hits: stats.hits,
        misses: stats.misses,
        ksize: stats.ksize,
        vsize: stats.vsize
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error getting cache stats',
      error: error.message
    });
  }
};
