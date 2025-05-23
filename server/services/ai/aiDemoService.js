/**
 * AI Demo Service - Generates demo data for testing when APIs are not available
 */

/**
 * Generate demo analysis data for testing
 * @param {string} transcriptionId - Transcription ID
 * @param {string} language - Language code
 * @returns {Object} - Demo analysis data
 */
function generateDemoAnalysisData(transcriptionId, language) {
  const isHebrew = language === 'he';
  
  const demoAnalysis = {
    mainTopic: isHebrew ? "ניתוח אוטומטי של תוכן הסרטון" : "Automatic video content analysis",
    summary: isHebrew 
      ? "סרטון זה עוסק בנושאים מעניינים ומציג מידע רלוונטי לצופים. התוכן מובנה באופן ברור ומספק ערך רב." 
      : "This video covers interesting topics and presents relevant information to viewers. The content is clearly structured and provides great value.",
    keyPoints: isHebrew 
      ? [
          "הקדמה וברכות",
          "הצגת הנושא המרכזי",
          "הסבר מפורט ודוגמאות",
          "סיכום ומסקנות",
          "קריאה לפעולה"
        ]
      : [
          "Introduction and greetings",
          "Main topic presentation", 
          "Detailed explanation and examples",
          "Summary and conclusions",
          "Call to action"
        ],
    suggestedChapters: isHebrew
      ? [
          { title: "פתיחה", description: "ברכות והצגת הנושא" },
          { title: "תוכן עיקרי", description: "הסבר מפורט של הנושא" },
          { title: "דוגמאות", description: "מקרי מבחן ודוגמאות" },
          { title: "סיכום", description: "מסקנות ותובנות" }
        ]
      : [
          { title: "Opening", description: "Greetings and topic introduction" },
          { title: "Main content", description: "Detailed explanation of the topic" },
          { title: "Examples", description: "Use cases and examples" },
          { title: "Summary", description: "Conclusions and insights" }
        ],
    toneAndStyle: isHebrew ? "טון ידידותי ומקצועי" : "Friendly and professional tone",
    chapters: generateDemoChapters(language)
  };
  
  return demoAnalysis;
}

/**
 * Generate demo chapters data
 * @param {string} language - Language code
 * @returns {Array} - Demo chapters array
 */
function generateDemoChapters(language) {
  const isHebrew = language === 'he';
  
  return [
    {
      id: 1,
      title: isHebrew ? "פתיחה וברכות" : "Opening and Greetings",
      startTime: 0,
      endTime: 30,
      formattedStartTime: "0:00",
      summary: isHebrew ? "ברכות לצופים והצגת הנושא" : "Greetings to viewers and topic introduction"
    },
    {
      id: 2,
      title: isHebrew ? "הצגת הנושא" : "Topic Introduction",
      startTime: 30,
      endTime: 90,
      formattedStartTime: "0:30",
      summary: isHebrew ? "הקדמה לנושא העיקרי" : "Introduction to the main topic"
    },
    {
      id: 3,
      title: isHebrew ? "תוכן מרכזי" : "Main Content",
      startTime: 90,
      endTime: 180,
      formattedStartTime: "1:30",
      summary: isHebrew ? "הסבר מפורט של הנושא" : "Detailed explanation of the topic"
    },
    {
      id: 4,
      title: isHebrew ? "דוגמאות מעשיות" : "Practical Examples",
      startTime: 180,
      endTime: 240,
      formattedStartTime: "3:00",
      summary: isHebrew ? "מקרי מבחן ודוגמאות מהחיים" : "Use cases and real-life examples"
    },
    {
      id: 5,
      title: isHebrew ? "סיכום וסיום" : "Summary and Conclusion",
      startTime: 240,
      endTime: 300,
      formattedStartTime: "4:00",
      summary: isHebrew ? "סיכום הנושא ומסקנות" : "Topic summary and conclusions"
    }
  ];
}

/**
 * Generate demo metadata
 * @param {Object} analysisResult - Analysis result
 * @param {string} language - Language code
 * @returns {Object} - Generated metadata
 */
function generateDemoMetadata(analysisResult, language) {
  const isHebrew = language === 'he';
  
  return {
    title: analysisResult.mainTopic || (isHebrew ? "סרטון מנותח" : "Analyzed Video"),
    description: analysisResult.summary || (isHebrew ? "תיאור הסרטון" : "Video Description"),
    tags: analysisResult.keyPoints?.slice(0, 10) || [],
    hashtags: analysisResult.keyPoints?.slice(0, 5).map(point => 
      `#${point.replace(/\s+/g, '').substring(0, 20)}`
    ) || []
  };
}

module.exports = {
  generateDemoAnalysisData,
  generateDemoChapters,
  generateDemoMetadata
};
