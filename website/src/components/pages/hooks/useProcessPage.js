import { useState, useEffect } from 'react';
import { getUserPreferredLanguage, saveUserPreferredLanguage } from '../../../utils/languages';
import youtubeTranscriptService from '../../../services/youtubeTranscriptService';
import clientAiService from '../../../services/clientAiService';

/**
 * Custom hook for ProcessPage logic
 * Handles all state management and business logic
 */
const useProcessPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('youtube'); // 'youtube' or 'file'
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('he');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('openai_api_key') || '',
    assemblyai: localStorage.getItem('assemblyai_api_key') || ''
  });
  const [useAI, setUseAI] = useState(false);

  // Initialize language from user preferences
  useEffect(() => {
    const preferredLanguage = getUserPreferredLanguage();
    setSelectedLanguage(preferredLanguage);
  }, []);

  // Event handlers
  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    saveUserPreferredLanguage(languageCode);
  };

  const handleApiKeyChange = (type, value) => {
    const newApiKeys = { ...apiKeys, [type]: value };
    setApiKeys(newApiKeys);
    localStorage.setItem(`${type}_api_key`, value);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Check file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv', 'audio/mp3', 'audio/wav', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      setError('סוג קובץ לא נתמך. אנא בחר קובץ וידאו או אודיו');
      return;
    }

    // Check file size (25MB limit for Whisper)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      setError('קובץ גדול מדי. גודל מקסימלי: 25MB');
      return;
    }

    setSelectedFile(file);
  };

  // Utility functions
  const extractVideoId = (url) => {
    return youtubeTranscriptService.extractVideoId(url);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  const getStepName = (stepNum) => {
    const steps = {
      1: activeTab === 'youtube' ? 'טוען תמלילים מ-YouTube' : 'מתמלל קובץ',
      2: 'מנתח תוכן',
      3: 'יוצר פרקים',
      4: 'יוצר מטא-נתונים',
      5: 'מסיים'
    };
    return steps[stepNum] || 'מעבד...';
  };

  // Main processing function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setProgress(0);
    
    if (activeTab === 'youtube') {
      if (!videoUrl) {
        setError('אנא הכנס קישור לסרטון YouTube');
        return;
      }

      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        setError('קישור לא תקין. אנא הכנס קישור תקין לסרטון YouTube');
        return;
      }
    } else {
      if (!selectedFile) {
        setError('אנא בחר קובץ אודיו או וידאו להעלאה');
        return;
      }
      
      if (!apiKeys.openai) {
        setError('מפתח OpenAI נדרש לתמלול קבצים');
        return;
      }
    }

    setIsProcessing(true);
    setStep(1);

    try {
      let transcriptData;
      let isRealYouTubeData = false;
      
      if (activeTab === 'youtube') {
        // Step 1: Get YouTube transcript
        setStep(1);
        setProgress(20);
        
        const videoId = extractVideoId(videoUrl);
        console.log('Attempting to get YouTube transcript for:', videoId);
        
        try {
          const transcriptResult = await youtubeTranscriptService.getTranscript(videoId, selectedLanguage);
          
          if (transcriptResult.success && transcriptResult.data.source === 'youtube_captions') {
            // Real YouTube transcript
            transcriptData = transcriptResult;
            isRealYouTubeData = true;
            console.log('Successfully got real YouTube transcript');
          } else {
            throw new Error('YouTube transcript not available');
          }
        } catch (error) {
          console.warn('YouTube transcript failed, using demo data:', error.message);
          transcriptData = youtubeTranscriptService.generateDemoTranscript(videoId, selectedLanguage);
          isRealYouTubeData = false;
        }
        
      } else {
        // Step 1: Transcribe file with Whisper
        setStep(1);
        setProgress(20);
        
        transcriptData = await clientAiService.transcribeWithWhisper(
          selectedFile, 
          selectedLanguage, 
          apiKeys.openai
        );
        isRealYouTubeData = false;
      }

      // Step 2: Generate analysis
      setStep(2);
      setProgress(40);
      
      let analysis;
      if (useAI && apiKeys.openai) {
        // Use AI analysis
        analysis = await clientAiService.analyzeWithOpenAI(
          transcriptData.data.fullText,
          selectedLanguage,
          apiKeys.openai
        );
      } else {
        // Basic analysis without AI
        analysis = {
          mainTopic: activeTab === 'youtube' ? 'ניתוח סרטון YouTube' : 'ניתוח קובץ',
          summary: transcriptData.data.fullText.substring(0, 200) + '...',
          keyPoints: ['נקודה עיקרית 1', 'נקודה עיקרית 2', 'נקודה עיקרית 3'],
          suggestedChapters: [],
          toneAndStyle: 'טון רגיל'
        };
      }

      // Step 3: Generate chapters
      setStep(3);
      setProgress(60);
      
      let chapters;
      if (useAI && apiKeys.openai) {
        // Use AI chapter generation
        chapters = await clientAiService.generateChaptersWithOpenAI(
          analysis,
          transcriptData.data.transcript,
          selectedLanguage,
          apiKeys.openai
        );
      } else {
        // Basic chapter generation
        chapters = clientAiService.generateBasicChapters(
          transcriptData.data.transcript,
          selectedLanguage
        );
      }

      // Step 4: Generate metadata
      setStep(4);
      setProgress(80);
      
      let metadata;
      if (useAI && apiKeys.openai) {
        // Use AI metadata generation
        metadata = await clientAiService.generateMetadataWithOpenAI(
          analysis,
          selectedLanguage,
          apiKeys.openai
        );
      } else {
        // Basic metadata
        metadata = clientAiService.generateDemoMetadata(analysis, selectedLanguage);
      }

      // Step 5: Complete
      setStep(5);
      setProgress(100);

      // Determine if this is demo data
      const isDemoData = 
        (activeTab === 'youtube' && !isRealYouTubeData) || // YouTube failed and using demo
        (activeTab === 'file' && !useAI) || // File without AI
        (!useAI); // No AI processing

      setResults({
        videoId: activeTab === 'youtube' ? extractVideoId(videoUrl) : null,
        fileName: activeTab === 'file' ? selectedFile.name : null,
        transcript: transcriptData.data,
        analysis,
        chapters,
        metadata,
        language: selectedLanguage,
        source: transcriptData.data.source || 'unknown',
        isDemoData: isDemoData,
        isRealYouTubeData: isRealYouTubeData
      });

    } catch (error) {
      console.error('Error processing video:', error);
      setError(error.message || 'שגיאה בלתי צפויה בעיבוד הסרטון');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    // State
    activeTab,
    videoUrl,
    selectedFile,
    selectedLanguage,
    isProcessing,
    results,
    error,
    step,
    progress,
    apiKeys,
    useAI,
    
    // Setters
    setActiveTab,
    setVideoUrl,
    setResults,
    setUseAI,
    
    // Handlers
    handleLanguageChange,
    handleApiKeyChange,
    handleFileSelect,
    handleSubmit,
    
    // Utilities
    extractVideoId,
    formatTime,
    getStepName
  };
};

export default useProcessPage;
