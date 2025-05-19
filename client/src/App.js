import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getDirection } from './styles/theme';
import MainNavbar from './components/layout/MainNavbar';
import VideoInput from './components/video/VideoInput';
import ProcessingSteps from './components/processing/ProcessingSteps';
import ResultsView from './components/results/ResultsView';
import SettingsPanel from './components/settings/SettingsPanel';
import ErrorAlert from './components/common/ErrorAlert';
import theme from './styles/theme';
import { checkApiKeys } from './services/apiService';

function App() {
  // State management
  const [language, setLanguage] = useState('he'); // Default to Hebrew
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [chapters, setChapters] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [apiKeysStatus, setApiKeysStatus] = useState({
    openai: false,
    google: false
  });
  const [showSettings, setShowSettings] = useState(false);
  
  // Create a custom theme with the correct direction based on language
  const customTheme = React.useMemo(() => {
    return createTheme({
      ...theme,
      direction: getDirection(language),
    });
  }, [language]);

  // Check API keys on component mount
  useEffect(() => {
    const checkKeys = async () => {
      try {
        const openaiStatus = await checkApiKeys('openai');
        const googleStatus = await checkApiKeys('google');
        
        setApiKeysStatus({
          openai: openaiStatus,
          google: googleStatus
        });
        
        // If no API keys are set, show settings panel
        if (!openaiStatus && !googleStatus) {
          setShowSettings(true);
        }
      } catch (err) {
        console.error('Error checking API keys:', err);
      }
    };
    
    checkKeys();
  }, []);

  // Handle video submission (URL or file)
  const handleVideoSubmit = (data) => {
    setVideoData(data);
    setCurrentStep(1); // Move to transcription step
  };

  // Handle transcription completion
  const handleTranscriptionComplete = (data) => {
    setTranscriptionData(data);
    setCurrentStep(2); // Move to analysis step
  };

  // Handle analysis completion
  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setCurrentStep(3); // Move to results step
  };

  // Handle chapter generation completion
  const handleChaptersComplete = (data) => {
    setChapters(data);
  };

  // Handle metadata generation completion
  const handleMetadataComplete = (data) => {
    setMetadata(data);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Handle settings toggle
  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  // Handle API key update
  const handleApiKeyUpdate = (type, status) => {
    setApiKeysStatus({
      ...apiKeysStatus,
      [type]: status
    });
  };

  // Handle error dismissal
  const handleErrorDismiss = () => {
    setError(null);
  };

  // Handle process restart
  const handleRestart = () => {
    setVideoData(null);
    setTranscriptionData(null);
    setAnalysisData(null);
    setChapters(null);
    setMetadata(null);
    setCurrentStep(0);
    setError(null);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'background.default' 
      }}>
        <MainNavbar 
          language={language} 
          onLanguageChange={handleLanguageChange}
          onSettingsClick={handleSettingsToggle}
        />
        
        <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <ErrorAlert 
              error={error} 
              onDismiss={handleErrorDismiss} 
            />
          )}
          
          {showSettings && (
            <SettingsPanel 
              apiKeysStatus={apiKeysStatus}
              onApiKeyUpdate={handleApiKeyUpdate}
              onClose={handleSettingsToggle}
            />
          )}
          
          <ProcessingSteps 
            currentStep={currentStep} 
            language={language}
          />
          
          {/* Step 0: Video Input */}
          {currentStep === 0 && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {language === 'he' ? 'הזן קישור לסרטון YouTube או העלה קובץ וידאו' :
                 language === 'en' ? 'Enter YouTube URL or Upload Video' :
                 'Enter YouTube URL or Upload Video'}
              </Typography>
              <VideoInput 
                onSubmit={handleVideoSubmit}
                language={language}
                setLoading={setLoading}
                setError={setError}
              />
            </Paper>
          )}
          
          {/* Steps 1-3: Processing (handled by the ProcessingSteps component) */}
          
          {/* Step 4: Results */}
          {currentStep === 3 && (
            <ResultsView 
              videoData={videoData}
              transcriptionData={transcriptionData}
              analysisData={analysisData}
              chapters={chapters}
              metadata={metadata}
              language={language}
              onChaptersGenerated={handleChaptersComplete}
              onMetadataGenerated={handleMetadataComplete}
              onRestart={handleRestart}
              setLoading={setLoading}
              setError={setError}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
