import React from 'react';
import { Stepper, Step, StepLabel, Box, Typography } from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

/**
 * Processing steps component to show the current step in the video processing flow
 * @param {Object} props - Component props
 * @param {Number} props.currentStep - Current active step (0-3)
 * @param {String} props.language - Current language code
 */
const ProcessingSteps = ({ currentStep, language }) => {
  // Step labels based on language
  const getStepLabels = () => {
    const labels = {
      videoInput: {
        he: 'הזנת וידאו',
        en: 'Video Input',
        uk: 'Введення відео',
        ar: 'إدخال الفيديو',
        ru: 'Ввод видео',
        fr: 'Entrée vidéo',
        es: 'Entrada de video',
        de: 'Video-Eingabe'
      },
      transcription: {
        he: 'תמלול',
        en: 'Transcription',
        uk: 'Транскрипція',
        ar: 'النسخ',
        ru: 'Транскрипция',
        fr: 'Transcription',
        es: 'Transcripción',
        de: 'Transkription'
      },
      analysis: {
        he: 'ניתוח תוכן',
        en: 'Content Analysis',
        uk: 'Аналіз вмісту',
        ar: 'تحليل المحتوى',
        ru: 'Анализ содержания',
        fr: 'Analyse de contenu',
        es: 'Análisis de contenido',
        de: 'Inhaltsanalyse'
      },
      results: {
        he: 'תוצאות',
        en: 'Results',
        uk: 'Результати',
        ar: 'النتائج',
        ru: 'Результаты',
        fr: 'Résultats',
        es: 'Resultados',
        de: 'Ergebnisse'
      }
    };

    return {
      videoInput: labels.videoInput[language] || labels.videoInput.en,
      transcription: labels.transcription[language] || labels.transcription.en,
      analysis: labels.analysis[language] || labels.analysis.en,
      results: labels.results[language] || labels.results.en,
    };
  };

  const stepLabels = getStepLabels();

  // Define steps with icons and labels
  const steps = [
    { 
      label: stepLabels.videoInput, 
      icon: <VideoLibraryIcon /> 
    },
    { 
      label: stepLabels.transcription, 
      icon: <SubtitlesIcon /> 
    },
    { 
      label: stepLabels.analysis, 
      icon: <AnalyticsIcon /> 
    },
    { 
      label: stepLabels.results, 
      icon: <LibraryBooksIcon /> 
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={() => (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: index <= currentStep ? 'primary.main' : 'text.disabled',
                bgcolor: index <= currentStep ? 'primary.light' : 'background.default',
                borderRadius: '50%',
                p: 1
              }}>
                {step.icon}
              </Box>
            )}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: index <= currentStep ? 'text.primary' : 'text.disabled',
                  fontWeight: index === currentStep ? 'bold' : 'normal'
                }}
              >
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProcessingSteps;
