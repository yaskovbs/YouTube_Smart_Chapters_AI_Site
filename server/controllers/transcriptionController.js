const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const langdetect = require('langdetect');

// Language code mapping for Google Speech-to-Text
const languageCodes = {
  'he': 'he-IL', // Hebrew
  'en': 'en-US', // English
  'uk': 'uk-UA', // Ukrainian
  'ar': 'ar-SA', // Arabic
  'ru': 'ru-RU', // Russian
  'fr': 'fr-FR', // French
  'es': 'es-ES', // Spanish
  'de': 'de-DE'  // German
};

// In-memory storage for transcriptions (would use database in production)
const transcriptions = new Map();

/**
 * Generate a transcription from a video
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.generateTranscription = async (req, res) => {
  try {
    const { source, sourceId, language, customApiKey } = req.body;
    
    if (!source || !sourceId) {
      return res.status(400).json({
        success: false,
        message: 'Source and sourceId are required'
      });
    }
    
    // Set up audio file path
    const audioDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const audioOutputPath = path.join(audioDir, `${uuidv4()}.wav`);
    let audioFilePath;
    
    // Extract audio based on source
    if (source === 'youtube') {
      // Extract audio from YouTube video
      try {
        await extractYoutubeAudio(sourceId, audioOutputPath);
        audioFilePath = audioOutputPath;
      } catch (error) {
        console.error('Error extracting YouTube audio:', error);
        return res.status(500).json({
          success: false,
          message: 'Error extracting audio from YouTube video',
          error: error.message
        });
      }
    } else if (source === 'file') {
      // Extract audio from uploaded file
      const uploadsDir = path.join(__dirname, '../uploads');
      const files = fs.readdirSync(uploadsDir);
      const videoFile = files.find(file => file.startsWith(sourceId));
      
      if (!videoFile) {
        return res.status(404).json({
          success: false,
          message: 'Video file not found'
        });
      }
      
      const videoPath = path.join(uploadsDir, videoFile);
      
      try {
        await extractFileAudio(videoPath, audioOutputPath);
        audioFilePath = audioOutputPath;
      } catch (error) {
        console.error('Error extracting file audio:', error);
        return res.status(500).json({
          success: false,
          message: 'Error extracting audio from video file',
          error: error.message
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid source. Must be "youtube" or "file"'
      });
    }
    
    // Read the audio file
    const audioBytes = fs.readFileSync(audioFilePath).toString('base64');
    
    // Set up Speech-to-Text client
    const speechClient = new speech.SpeechClient({
      credentials: customApiKey ? JSON.parse(customApiKey) : undefined
    });
    
    // Configure language
    let languageCode = 'he-IL'; // Default to Hebrew
    
    if (language) {
      languageCode = languageCodes[language] || languageCode;
    } else {
      // Auto-detect language if not specified (basic implementation)
      try {
        // Get a small sample of audio to detect language
        // (This is a placeholder - actual language detection from audio would require more complex processing)
        const detectedLang = languageCodes['he']; // Default to Hebrew
        languageCode = detectedLang;
      } catch (error) {
        console.error('Error detecting language:', error);
        // Proceed with default language
      }
    }
    
    // Configure recognition request
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: languageCode,
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
      model: 'video',
      useEnhanced: true,
    };
    
    const audio = {
      content: audioBytes,
    };
    
    const request = {
      config: config,
      audio: audio,
    };
    
    // Perform speech recognition
    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();
    
    // Process results
    const transcription = processTranscriptionResults(response);
    
    // Store transcription
    const transcriptionId = uuidv4();
    transcriptions.set(transcriptionId, {
      id: transcriptionId,
      source,
      sourceId,
      languageCode,
      transcription,
      timestamp: new Date().toISOString()
    });
    
    // Clean up audio file
    fs.unlinkSync(audioFilePath);
    
    return res.status(200).json({
      success: true,
      data: {
        transcriptionId,
        languageCode,
        transcription
      }
    });
  } catch (error) {
    console.error('Error generating transcription:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating transcription',
      error: error.message
    });
  }
};

/**
 * Get a previously generated transcription
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getTranscription = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!transcriptions.has(id)) {
      return res.status(404).json({
        success: false,
        message: 'Transcription not found'
      });
    }
    
    const transcriptionData = transcriptions.get(id);
    
    return res.status(200).json({
      success: true,
      data: transcriptionData
    });
  } catch (error) {
    console.error('Error getting transcription:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting transcription',
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
    const audioStream = ytdl(videoUrl, { 
      quality: 'highestaudio',
      filter: 'audioonly' 
    });
    
    ffmpeg(audioStream)
      .audioBitrate(128)
      .audioFrequency(16000)
      .audioChannels(1)
      .format('wav')
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(outputPath);
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
    ffmpeg(videoPath)
      .audioBitrate(128)
      .audioFrequency(16000)
      .audioChannels(1)
      .format('wav')
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(outputPath);
  });
}

/**
 * Process transcription results
 * @param {Object} response - Speech-to-Text response
 * @returns {Array} - Processed transcription with word timestamps
 */
function processTranscriptionResults(response) {
  const transcription = [];
  
  // Process each result (typically one result per utterance)
  response.results.forEach(result => {
    const alternative = result.alternatives[0]; // Take the most likely alternative
    
    // Process each word with its timestamp
    alternative.words.forEach(wordInfo => {
      const startTime = parseFloat(wordInfo.startTime.seconds) + 
                       parseFloat(wordInfo.startTime.nanos) / 1e9;
      const endTime = parseFloat(wordInfo.endTime.seconds) + 
                     parseFloat(wordInfo.endTime.nanos) / 1e9;
      
      transcription.push({
        word: wordInfo.word,
        startTime,
        endTime
      });
    });
  });
  
  return transcription;
}
