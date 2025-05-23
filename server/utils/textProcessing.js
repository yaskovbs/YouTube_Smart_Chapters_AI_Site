/**
 * Text Processing Utilities
 */

/**
 * Prepare transcription text for analysis
 * @param {Array} transcription - Transcription data with word timestamps
 * @returns {string} - Formatted transcription text
 */
function prepareTranscriptionText(transcription) {
  if (!transcription || !Array.isArray(transcription)) {
    return '';
  }

  // Combine words into sentences
  let text = '';
  let currentTime = 0;
  const words = [];
  
  transcription.forEach(item => {
    words.push(item.word);
    currentTime = item.endTime;
    
    // Basic sentence detection
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
 * Extract key sentence timestamps from transcription
 * @param {Array} transcription - Transcription data with word timestamps
 * @returns {Array} - Array of sentence timestamps (in seconds)
 */
function extractKeySentenceTimestamps(transcription) {
  if (!transcription || !Array.isArray(transcription)) {
    return [];
  }

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

/**
 * Format time in MM:SS format (for shorter durations)
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
function formatTimeShort(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Process AssemblyAI chapters for analysis result
 * @param {Object} transcriptionData - Transcription data from AssemblyAI
 * @returns {Object} - Analysis result
 */
function processAssemblyAIChapters(transcriptionData) {
  const analysis = {
    mainTopic: "ניתוח אוטומטי מ-AssemblyAI",
    summary: transcriptionData.fullText ? transcriptionData.fullText.substring(0, 500) + "..." : "סיכום לא זמין",
    keyPoints: [],
    suggestedChapters: [],
    toneAndStyle: "זוהה אוטומטית",
    chapters: transcriptionData.chapters || []
  };
  
  // Extract key points from chapters
  if (transcriptionData.chapters) {
    transcriptionData.chapters.forEach(chapter => {
      if (chapter.headline) {
        analysis.keyPoints.push(chapter.headline);
      }
      if (chapter.summary) {
        analysis.suggestedChapters.push({
          title: chapter.title,
          description: chapter.summary
        });
      }
    });
  }
  
  return analysis;
}

/**
 * Clean and validate text input
 * @param {string} text - Text to clean
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Cleaned text
 */
function cleanText(text, maxLength = 5000) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Remove excessive whitespace and trim
  const cleaned = text.replace(/\s+/g, ' ').trim();
  
  // Truncate if too long
  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength) + '...';
  }
  
  return cleaned;
}

/**
 * Split text into chunks for processing
 * @param {string} text - Text to split
 * @param {number} chunkSize - Maximum size per chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {Array} - Array of text chunks
 */
function splitTextIntoChunks(text, chunkSize = 2000, overlap = 200) {
  if (!text || text.length <= chunkSize) {
    return [text];
  }
  
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.substring(start, end);
    chunks.push(chunk);
    
    if (end === text.length) break;
    start = end - overlap;
  }
  
  return chunks;
}

module.exports = {
  prepareTranscriptionText,
  extractKeySentenceTimestamps,
  formatTimestamp,
  formatTimeShort,
  processAssemblyAIChapters,
  cleanText,
  splitTextIntoChunks
};
