const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for API keys and results (would use database and secure storage in production)
const apiKeys = new Map();
const analysisResults = new Map();

/**
 * Analyze content from a transcription
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.analyzeContent = async (req, res) => {
  try {
    const { transcriptionId, language = 'en', apiType = 'openai' } = req.body;
    
    if (!transcriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Transcription ID is required'
      });
    }
    
    // Get transcription data from the transcription controller
    // In a real implementation, this would fetch from a database
    // For this demo, we'll assume the transcriptionController has exposed its data
    const transcriptionController = require('./transcriptionController');
    const transcriptionData = transcriptionController.transcriptions?.get(transcriptionId);
    
    if (!transcriptionData) {
      return res.status(404).json({
        success: false,
        message: 'Transcription not found'
      });
    }
    
    // Get API key
    let apiKey;
    if (apiType === 'openai') {
      apiKey = apiKeys.get('openai') || process.env.OPENAI_API_KEY;
    } else if (apiType === 'google') {
      apiKey = apiKeys.get('google') || process.env.GOOGLE_AI_API_KEY;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid API type. Must be "openai" or "google"'
      });
    }
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: `No ${apiType} API key provided. Please set one in the settings.`
      });
    }
    
    // Prepare transcription text
    const transcriptionText = prepareTranscriptionText(transcriptionData.transcription);
    
    // Analyze content using AI
    let analysisResult;
    if (apiType === 'openai') {
      analysisResult = await analyzeWithOpenAI(transcriptionText, language, apiKey);
    } else {
      analysisResult = await analyzeWithGoogleAI(transcriptionText, language, apiKey);
    }
    
    // Store analysis result
    const analysisId = uuidv4();
    analysisResults.set(analysisId, {
      id: analysisId,
      transcriptionId,
      language,
      apiType,
      result: analysisResult,
      timestamp: new Date().toISOString()
    });
    
    return res.status(200).json({
      success: true,
      data: {
        analysisId,
        result: analysisResult
      }
    });
  } catch (error) {
    console.error('Error analyzing content:', error);
    return res.status(500).json({
      success: false,
      message: 'Error analyzing content',
      error: error.message
    });
  }
};

/**
 * Generate chapters from analysis
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.generateChapters = async (req, res) => {
  try {
    const { analysisId, language = 'en', apiType = 'openai' } = req.body;
    
    if (!analysisId) {
      return res.status(400).json({
        success: false,
        message: 'Analysis ID is required'
      });
    }
    
    // Get analysis result
    const analysisData = analysisResults.get(analysisId);
    
    if (!analysisData) {
      return res.status(404).json({
        success: false,
        message: 'Analysis result not found'
      });
    }
    
    // Get transcription data
    const transcriptionController = require('./transcriptionController');
    const transcriptionData = transcriptionController.transcriptions?.get(analysisData.transcriptionId);
    
    if (!transcriptionData) {
      return res.status(404).json({
        success: false,
        message: 'Transcription not found'
      });
    }
    
    // Get API key
    let apiKey;
    if (apiType === 'openai') {
      apiKey = apiKeys.get('openai') || process.env.OPENAI_API_KEY;
    } else if (apiType === 'google') {
      apiKey = apiKeys.get('google') || process.env.GOOGLE_AI_API_KEY;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid API type. Must be "openai" or "google"'
      });
    }
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: `No ${apiType} API key provided. Please set one in the settings.`
      });
    }
    
    // Generate chapters using AI
    let chapters;
    if (apiType === 'openai') {
      chapters = await generateChaptersWithOpenAI(
        analysisData.result, 
        transcriptionData.transcription,
        language,
        apiKey
      );
    } else {
      chapters = await generateChaptersWithGoogleAI(
        analysisData.result, 
        transcriptionData.transcription,
        language,
        apiKey
      );
    }
    
    return res.status(200).json({
      success: true,
      data: {
        chapters
      }
    });
  } catch (error) {
    console.error('Error generating chapters:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating chapters',
      error: error.message
    });
  }
};

/**
 * Generate metadata (title, description, tags) from analysis
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.generateMetadata = async (req, res) => {
  try {
    const { analysisId, language = 'en', apiType = 'openai' } = req.body;
    
    if (!analysisId) {
      return res.status(400).json({
        success: false,
        message: 'Analysis ID is required'
      });
    }
    
    // Get analysis result
    const analysisData = analysisResults.get(analysisId);
    
    if (!analysisData) {
      return res.status(404).json({
        success: false,
        message: 'Analysis result not found'
      });
    }
    
    // Get API key
    let apiKey;
    if (apiType === 'openai') {
      apiKey = apiKeys.get('openai') || process.env.OPENAI_API_KEY;
    } else if (apiType === 'google') {
      apiKey = apiKeys.get('google') || process.env.GOOGLE_AI_API_KEY;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid API type. Must be "openai" or "google"'
      });
    }
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: `No ${apiType} API key provided. Please set one in the settings.`
      });
    }
    
    // Generate metadata using AI
    let metadata;
    if (apiType === 'openai') {
      metadata = await generateMetadataWithOpenAI(analysisData.result, language, apiKey);
    } else {
      metadata = await generateMetadataWithGoogleAI(analysisData.result, language, apiKey);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        metadata
      }
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating metadata',
      error: error.message
    });
  }
};

/**
 * Save API key
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.saveApiKey = (req, res) => {
  try {
    const { type, key } = req.body;
    
    if (!type || !key) {
      return res.status(400).json({
        success: false,
        message: 'API type and key are required'
      });
    }
    
    if (type !== 'openai' && type !== 'google') {
      return res.status(400).json({
        success: false,
        message: 'Invalid API type. Must be "openai" or "google"'
      });
    }
    
    // Store API key
    // In a real implementation, this would be stored securely
    apiKeys.set(type, key);
    
    return res.status(200).json({
      success: true,
      message: `${type === 'openai' ? 'OpenAI' : 'Google AI'} API key saved successfully`
    });
  } catch (error) {
    console.error('Error saving API key:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving API key',
      error: error.message
    });
  }
};

/**
 * Check if API key exists
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.checkApiKey = (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'API type is required'
      });
    }
    
    if (type !== 'openai' && type !== 'google') {
      return res.status(400).json({
        success: false,
        message: 'Invalid API type. Must be "openai" or "google"'
      });
    }
    
    // Check if API key exists
    const hasKey = apiKeys.has(type) || (
      type === 'openai' && process.env.OPENAI_API_KEY || 
      type === 'google' && process.env.GOOGLE_AI_API_KEY
    );
    
    return res.status(200).json({
      success: true,
      data: {
        hasKey
      }
    });
  } catch (error) {
    console.error('Error checking API key:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking API key',
      error: error.message
    });
  }
};

/**
 * Prepare transcription text for analysis
 * @param {Array} transcription - Transcription data with word timestamps
 * @returns {string} - Formatted transcription text
 */
function prepareTranscriptionText(transcription) {
  // Combine words into sentences (simplified approach)
  let text = '';
  let currentTime = 0;
  const words = [];
  
  transcription.forEach(item => {
    words.push(item.word);
    currentTime = item.endTime;
    
    // Basic sentence detection (period, question mark, exclamation point)
    if (item.word.match(/[.!?]$/)) {
      text += words.join(' ') + '\n';
      words.length = 0;
    }
  });
  
  // Add any remaining words
  if (words.length > 0) {
    text += words.join(' ');
  }
  
  return text;
}

/**
 * Analyze transcription with OpenAI
 * @param {string} transcriptionText - Transcription text
 * @param {string} language - Language code
 * @param {string} apiKey - OpenAI API key
 * @returns {Object} - Analysis result
 */
async function analyzeWithOpenAI(transcriptionText, language, apiKey) {
  const configuration = new Configuration({
    apiKey: apiKey
  });
  const openai = new OpenAIApi(configuration);
  
  const promptLanguage = language === 'he' ? 'Hebrew' : 
                        language === 'en' ? 'English' :
                        language === 'uk' ? 'Ukrainian' :
                        language === 'ar' ? 'Arabic' :
                        language === 'ru' ? 'Russian' :
                        language === 'fr' ? 'French' :
                        language === 'es' ? 'Spanish' :
                        language === 'de' ? 'German' : 'English';
  
  const prompt = `The following is a transcript of a video in ${promptLanguage}. 
Please analyze it and identify the main topics, key points, and the overall structure of the content.
Focus on identifying natural chapter breaks where the topic changes.

TRANSCRIPT:
${transcriptionText}

Provide your analysis in JSON format with the following structure:
{
  "mainTopic": "Brief description of the overall video topic",
  "summary": "A concise summary of the content",
  "keyPoints": ["Key point 1", "Key point 2", ...],
  "suggestedChapters": [
    { "title": "Introduction", "description": "Brief description" },
    { "title": "Topic 1", "description": "Brief description" },
    ...
  ],
  "toneAndStyle": "Description of the presentation tone and style"
}`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
  
  const resultText = response.data.choices[0].text.trim();
  let result;
  
  try {
    // Extract JSON from the response (it might have additional text)
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not extract valid JSON from the response');
    }
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    result = {
      mainTopic: "Error processing analysis",
      summary: "There was an error processing the transcription analysis.",
      keyPoints: [],
      suggestedChapters: [],
      toneAndStyle: ""
    };
  }
  
  return result;
}

/**
 * Generate chapters with OpenAI
 * @param {Object} analysis - Analysis result
 * @param {Array} transcription - Transcription data with word timestamps
 * @param {string} language - Language code
 * @param {string} apiKey - OpenAI API key
 * @returns {Array} - Generated chapters with timestamps
 */
async function generateChaptersWithOpenAI(analysis, transcription, language, apiKey) {
  const configuration = new Configuration({
    apiKey: apiKey
  });
  const openai = new OpenAIApi(configuration);
  
  // Extract key sentence timestamps
  const sentenceTimestamps = extractKeySentenceTimestamps(transcription);
  
  const promptLanguage = language === 'he' ? 'Hebrew' : 
                        language === 'en' ? 'English' :
                        language === 'uk' ? 'Ukrainian' :
                        language === 'ar' ? 'Arabic' :
                        language === 'ru' ? 'Russian' :
                        language === 'fr' ? 'French' :
                        language === 'es' ? 'Spanish' :
                        language === 'de' ? 'German' : 'English';
  
  const prompt = `Based on the analysis of a video in ${promptLanguage} and the key sentence timestamps provided, 
create appropriate chapters with timestamps for the video.

ANALYSIS:
${JSON.stringify(analysis)}

KEY SENTENCE TIMESTAMPS (seconds):
${JSON.stringify(sentenceTimestamps)}

Generate between 5-10 chapters based on the content. The first chapter should start at 0:00.
Each chapter should align with a significant change in topic or content.

Provide your chapter recommendations in JSON format with the following structure:
[
  { 
    "title": "Chapter Title", 
    "startTime": 0, 
    "endTime": 120,
    "description": "Brief description of this chapter's content"
  },
  ...
]

Chapter titles should be concise and descriptive. Times should be in seconds.`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
  
  const resultText = response.data.choices[0].text.trim();
  let chapters;
  
  try {
    // Extract JSON from the response (it might have additional text)
    const jsonMatch = resultText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      chapters = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not extract valid JSON from the response');
    }
  } catch (error) {
    console.error('Error parsing OpenAI chapters response:', error);
    chapters = [
      { title: "Introduction", startTime: 0, endTime: 60, description: "Beginning of the video" }
    ];
  }
  
  // Format timestamps to HH:MM:SS
  chapters.forEach(chapter => {
    chapter.formattedStartTime = formatTimestamp(chapter.startTime);
    chapter.formattedEndTime = formatTimestamp(chapter.endTime);
  });
  
  return chapters;
}

/**
 * Generate metadata with OpenAI
 * @param {Object} analysis - Analysis result
 * @param {string} language - Language code
 * @param {string} apiKey - OpenAI API key
 * @returns {Object} - Generated metadata
 */
async function generateMetadataWithOpenAI(analysis, language, apiKey) {
  const configuration = new Configuration({
    apiKey: apiKey
  });
  const openai = new OpenAIApi(configuration);
  
  const promptLanguage = language === 'he' ? 'Hebrew' : 
                        language === 'en' ? 'English' :
                        language === 'uk' ? 'Ukrainian' :
                        language === 'ar' ? 'Arabic' :
                        language === 'ru' ? 'Russian' :
                        language === 'fr' ? 'French' :
                        language === 'es' ? 'Spanish' :
                        language === 'de' ? 'German' : 'English';
  
  const prompt = `Based on the analysis of a video in ${promptLanguage}, create SEO-optimized metadata for this YouTube video.

ANALYSIS:
${JSON.stringify(analysis)}

Provide the metadata in JSON format with the following structure:
{
  "title": "Engaging, SEO-optimized title (max 100 characters)",
  "description": "Detailed description with keywords, timestamps references, and calls to action (max 5000 characters)",
  "tags": ["tag1", "tag2", "tag3", ...],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", ...]
}

The title should be attention-grabbing and include key terms.
The description should be comprehensive, include keywords, and have a good structure with paragraphs.
Include up to 15 relevant tags for searchability.
Include 5-7 relevant hashtags.

Make sure all content is in ${promptLanguage}.`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
  
  const resultText = response.data.choices[0].text.trim();
  let metadata;
  
  try {
    // Extract JSON from the response (it might have additional text)
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      metadata = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not extract valid JSON from the response');
    }
  } catch (error) {
    console.error('Error parsing OpenAI metadata response:', error);
    metadata = {
      title: analysis.mainTopic || "Video Title",
      description: analysis.summary || "Video Description",
      tags: [],
      hashtags: []
    };
  }
  
  return metadata;
}

/**
 * Analyze transcription with Google AI
 * @param {string} transcriptionText - Transcription text
 * @param {string} language - Language code
 * @param {string} apiKey - Google AI API key
 * @returns {Object} - Analysis result
 */
async function analyzeWithGoogleAI(transcriptionText, language, apiKey) {
  // This is a placeholder for Google AI implementation
  // In a real implementation, this would use Google's AI APIs
  
  // For the demo, we'll return a simplified analysis
  return {
    mainTopic: "Main topic of the video",
    summary: "A summary of the video content",
    keyPoints: ["Key point 1", "Key point 2", "Key point 3"],
    suggestedChapters: [
      { title: "Introduction", description: "Introduction to the topic" },
      { title: "Main Content", description: "The main content of the video" },
      { title: "Conclusion", description: "Concluding thoughts" }
    ],
    toneAndStyle: "Informational and educational"
  };
}

/**
 * Generate chapters with Google AI
 * @param {Object} analysis - Analysis result
 * @param {Array} transcription - Transcription data with word timestamps
 * @param {string} language - Language code
 * @param {string} apiKey - Google AI API key
 * @returns {Array} - Generated chapters with timestamps
 */
async function generateChaptersWithGoogleAI(analysis, transcription, language, apiKey) {
  // This is a placeholder for Google AI implementation
  // In a real implementation, this would use Google's AI APIs
  
  // Extract sentence timestamps (this would still be useful)
  const sentenceTimestamps = extractKeySentenceTimestamps(transcription);
  
  // For the demo, we'll return simplified chapters
  const chapters = [
    { title: "Introduction", startTime: 0, endTime: 60, description: "Introduction to the topic" },
    { title: "Key Point 1", startTime: 60, endTime: 180, description: "Discussion of the first key point" },
    { title: "Key Point 2", startTime: 180, endTime: 300, description: "Exploration of the second key point" },
    { title: "Conclusion", startTime: 300, endTime: 360, description: "Concluding thoughts and summary" }
  ];
  
  // Format timestamps
  chapters.forEach(chapter => {
    chapter.formattedStartTime = formatTimestamp(chapter.startTime);
    chapter.formattedEndTime = formatTimestamp(chapter.endTime);
  });
  
  return chapters;
}

/**
 * Generate metadata with Google AI
 * @param {Object} analysis - Analysis result
 * @param {string} language - Language code
 * @param {string} apiKey - Google AI API key
 * @returns {Object} - Generated metadata
 */
async function generateMetadataWithGoogleAI(analysis, language, apiKey) {
  // This is a placeholder for Google AI implementation
  // In a real implementation, this would use Google's AI APIs
  
  // For the demo, we'll return simplified metadata
  return {
    title: analysis.mainTopic || "Video Title",
    description: analysis.summary || "Video Description",
    tags: ["tag1", "tag2", "tag3", "tag4", "tag5"],
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"]
  };
}

/**
 * Extract key sentence timestamps from transcription
 * @param {Array} transcription - Transcription data with word timestamps
 * @returns {Array} - Array of sentence timestamps (in seconds)
 */
function extractKeySentenceTimestamps(transcription) {
  const sentenceTimestamps = [];
  let sentenceStart = 0;
  let words = [];
  
  transcription.forEach((item, index) => {
    // Mark the first word's time as the sentence start
    if (words.length === 0) {
      sentenceStart = item.startTime;
    }
    
    words.push(item.word);
    
    // Check for sentence endings (period, question mark, exclamation point)
    // OR check if a significant pause occurs (more than 1 second gap to next word)
    const nextItem = transcription[index + 1];
    const hasEndPunctuation = item.word.match(/[.!?]$/);
    const hasSignificantPause = nextItem && (nextItem.startTime - item.endTime > 1);
    
    if (hasEndPunctuation || hasSignificantPause || index === transcription.length - 1) {
      // End of sentence detected
      if (words.length >= 5) {  // Only consider sentences with at least 5 words
        sentenceTimestamps.push({
          time: sentenceStart,
          text: words.join(' ')
        });
      }
      words = [];
    }
  });
  
  return sentenceTimestamps;
}

/**
 * Format seconds to HH:MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
