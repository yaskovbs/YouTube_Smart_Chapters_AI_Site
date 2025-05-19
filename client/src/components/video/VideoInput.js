/* global chrome */
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  Grid
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { videoService } from '../../services/apiService';

/**
 * Component for accepting YouTube URL or video file uploads
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {String} props.language - Current language code
 * @param {Function} props.setLoading - Function to set loading state
 * @param {Function} props.setError - Function to set error state
 * @param {Object} props.error - Current error object
 * @param {Object} props.processingStatus - Processing status information
 * @param {Function} props.onResetProcessing - Function to reset processing state
 * @param {Function} props.onCheckStatus - Function to check processing status
 */
const VideoInput = ({ 
  onSubmit, 
  language, 
  setLoading, 
  setError, 
  error,
  processingStatus,
  onResetProcessing,
  onCheckStatus
}) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [inputMethod, setInputMethod] = useState('url'); // 'url' or 'file'
  const [currentVideoId, setCurrentVideoId] = useState(null);
  // Using processingStatus from props instead of local state

  // Get texts based on current language
  const getText = () => {
    const texts = {
      urlLabel: {
        he: 'הזן קישור ל-YouTube',
        en: 'Enter YouTube URL',
        uk: 'Введіть посилання на YouTube',
        ar: 'أدخل رابط يوتيوب',
        ru: 'Введите ссылку на YouTube',
        fr: 'Entrez l\'URL YouTube',
        es: 'Introduce la URL de YouTube',
        de: 'YouTube-URL eingeben'
      },
      urlPlaceholder: {
        he: 'https://www.youtube.com/watch?v=...',
        en: 'https://www.youtube.com/watch?v=...',
        uk: 'https://www.youtube.com/watch?v=...',
        ar: 'https://www.youtube.com/watch?v=...',
        ru: 'https://www.youtube.com/watch?v=...',
        fr: 'https://www.youtube.com/watch?v=...',
        es: 'https://www.youtube.com/watch?v=...',
        de: 'https://www.youtube.com/watch?v=...'
      },
      urlButton: {
        he: 'ניתוח סרטון',
        en: 'Process Video',
        uk: 'Обробити відео',
        ar: 'معالجة الفيديو',
        ru: 'Обработать видео',
        fr: 'Traiter la vidéo',
        es: 'Procesar video',
        de: 'Video verarbeiten'
      },
      fileUpload: {
        he: 'או העלה קובץ וידאו',
        en: 'Or upload a video file',
        uk: 'Або завантажте відеофайл',
        ar: 'أو قم بتحميل ملف فيديو',
        ru: 'Или загрузите видеофайл',
        fr: 'Ou téléchargez un fichier vidéo',
        es: 'O sube un archivo de video',
        de: 'Oder eine Videodatei hochladen'
      },
      dragDrop: {
        he: 'גרור ושחרר קובץ כאן או',
        en: 'Drag and drop a file here or',
        uk: 'Перетягніть файл сюди або',
        ar: 'اسحب وأفلت ملفًا هنا أو',
        ru: 'Перетащите файл сюда или',
        fr: 'Glissez-déposez un fichier ici ou',
        es: 'Arrastra y suelta un archivo aquí o',
        de: 'Datei hierher ziehen oder'
      },
      browse: {
        he: 'עיין',
        en: 'browse',
        uk: 'огляд',
        ar: 'تصفح',
        ru: 'обзор',
        fr: 'parcourir',
        es: 'explorar',
        de: 'durchsuchen'
      },
      fileSelected: {
        he: 'קובץ שנבחר:',
        en: 'Selected file:',
        uk: 'Вибраний файл:',
        ar: 'الملف المحدد:',
        ru: 'Выбранный файл:',
        fr: 'Fichier sélectionné:',
        es: 'Archivo seleccionado:',
        de: 'Ausgewählte Datei:'
      },
      uploadButton: {
        he: 'העלה והמשך',
        en: 'Upload and Continue',
        uk: 'Завантажити та продовжити',
        ar: 'تحميل والمتابعة',
        ru: 'Загрузить и продолжить',
        fr: 'Télécharger et continuer',
        es: 'Subir y continuar',
        de: 'Hochladen und fortfahren'
      },
      uploading: {
        he: 'מעלה...',
        en: 'Uploading...',
        uk: 'Завантаження...',
        ar: 'جاري التحميل...',
        ru: 'Загрузка...',
        fr: 'Téléchargement...',
        es: 'Subiendo...',
        de: 'Hochladen...'
      },
      urlTab: {
        he: 'קישור YouTube',
        en: 'YouTube URL',
        uk: 'Посилання YouTube',
        ar: 'رابط يوتيوب',
        ru: 'Ссылка YouTube',
        fr: 'URL YouTube',
        es: 'URL de YouTube',
        de: 'YouTube-URL'
      },
      fileTab: {
        he: 'העלאת קובץ',
        en: 'File Upload',
        uk: 'Завантаження файлу',
        ar: 'تحميل ملف',
        ru: 'Загрузка файла',
        fr: 'Téléchargement de fichier',
        es: 'Carga de archivo',
        de: 'Datei-Upload'
      }
    };

    return {
      urlLabel: texts.urlLabel[language] || texts.urlLabel.en,
      urlPlaceholder: texts.urlPlaceholder[language] || texts.urlPlaceholder.en,
      urlButton: texts.urlButton[language] || texts.urlButton.en,
      fileUpload: texts.fileUpload[language] || texts.fileUpload.en,
      dragDrop: texts.dragDrop[language] || texts.dragDrop.en,
      browse: texts.browse[language] || texts.browse.en,
      fileSelected: texts.fileSelected[language] || texts.fileSelected.en,
      uploadButton: texts.uploadButton[language] || texts.uploadButton.en,
      uploading: texts.uploading[language] || texts.uploading.en,
      urlTab: texts.urlTab[language] || texts.urlTab.en,
      fileTab: texts.fileTab[language] || texts.fileTab.en
    };
  };

  const texts = getText();

  // Extract video ID from URL
  const extractYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle standard YouTube watch URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Update current video ID when URL changes
  useEffect(() => {
    const videoId = extractYouTubeVideoId(url);
    setCurrentVideoId(videoId);
  }, [url]);

  // Handle URL submission
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    
    if (!url || !url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    // Extract video ID and update state
    const videoId = extractYouTubeVideoId(url.trim());
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }
    
    setCurrentVideoId(videoId);
    
    try {
      setLoading(true);
      const response = await videoService.processVideoUrl(url.trim());
      
      if (response.success) {
        onSubmit({
          type: 'youtube',
          data: response.data
        });
      } else {
        setError(response.message || 'Failed to process YouTube URL');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing YouTube URL');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reset processing state
  const handleResetProcessing = () => {
    if (!currentVideoId) return;
    
    // Use the passed in handler
    if (onResetProcessing) {
      setLoading(true);
      chrome.runtime.sendMessage(
        { type: 'FORCE_RESET_PROCESSING', videoId: currentVideoId },
        (response) => {
          setLoading(false);
          if (response && response.success) {
            onResetProcessing();
          } else {
            setError('Failed to reset processing state');
          }
        }
      );
    }
  };
  
  // Handle check processing status
  const handleCheckStatus = () => {
    if (!currentVideoId) return;
    
    // Use the passed in handler
    if (onCheckStatus) {
      setLoading(true);
      chrome.runtime.sendMessage(
        { type: 'GET_PROCESSING_STATUS', videoId: currentVideoId },
        (response) => {
          setLoading(false);
          if (response && response.success) {
            onCheckStatus(response.status);
          } else {
            setError('Failed to check processing status');
          }
        }
      );
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 500 * 1024 * 1024) { // 500MB limit
        setError('File size exceeds 500MB limit');
        return;
      }
      
      const allowedTypes = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Unsupported file type. Please upload a video file (MP4, AVI, MOV, WMV)');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setUploading(true);
      setLoading(true);
      
      const formData = new FormData();
      formData.append('video', file);
      
      const response = await videoService.uploadVideo(formData);
      
      if (response.success) {
        onSubmit({
          type: 'file',
          data: response.data
        });
      } else {
        setError(response.message || 'Failed to upload video');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading video');
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.size > 500 * 1024 * 1024) { // 500MB limit
        setError('File size exceeds 500MB limit');
        return;
      }
      
      const allowedTypes = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv'];
      if (!allowedTypes.includes(droppedFile.type)) {
        setError('Unsupported file type. Please upload a video file (MP4, AVI, MOV, WMV)');
        return;
      }
      
      setFile(droppedFile);
    }
  };

  return (
    <Box>
      {/* Input Method Selection */}
      <Grid container sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={inputMethod === 'url' ? 'contained' : 'outlined'}
            onClick={() => setInputMethod('url')}
            startIcon={<LinkIcon />}
            sx={{ borderRadius: '4px 0 0 4px' }}
          >
            {texts.urlTab}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={inputMethod === 'file' ? 'contained' : 'outlined'}
            onClick={() => setInputMethod('file')}
            startIcon={<FileUploadIcon />}
            sx={{ borderRadius: '0 4px 4px 0' }}
          >
            {texts.fileTab}
          </Button>
        </Grid>
      </Grid>
      
      {/* YouTube URL Input */}
      {inputMethod === 'url' && (
        <Box component="form" onSubmit={handleUrlSubmit}>
          <TextField
            fullWidth
            label={texts.urlLabel}
            variant="outlined"
            placeholder={texts.urlPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            InputProps={{
              startAdornment: <YouTubeIcon color="error" sx={{ mr: 1 }} />,
            }}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            fullWidth
            disabled={!url.trim()}
          >
            {texts.urlButton}
          </Button>
        </Box>
      )}
      
      {/* File Upload */}
      {inputMethod === 'file' && (
        <Box component="form" onSubmit={handleFileUpload}>
          <Paper
            variant="outlined"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              p: 3,
              mb: 2,
              textAlign: 'center',
              borderStyle: 'dashed',
              cursor: 'pointer',
              bgcolor: 'background.default'
            }}
            onClick={() => document.getElementById('file-input').click()}
          >
            <FileUploadIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
            <Typography>{texts.dragDrop}</Typography>
            <Button
              component="span"
              color="primary"
              sx={{ textTransform: 'lowercase' }}
            >
              {texts.browse}
            </Button>
            <input
              id="file-input"
              type="file"
              hidden
              accept="video/*"
              onChange={handleFileChange}
            />
          </Paper>
          
          {file && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">
                {texts.fileSelected} <b>{file.name}</b> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            fullWidth
            disabled={!file || uploading}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {uploading ? texts.uploading : texts.uploadButton}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VideoInput;
