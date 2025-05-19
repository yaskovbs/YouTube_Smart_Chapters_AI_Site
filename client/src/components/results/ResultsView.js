import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  IconButton,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerIcon from '@mui/icons-material/Timer';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import LabelIcon from '@mui/icons-material/Label';
import TagIcon from '@mui/icons-material/Tag';
import { aiService } from '../../services/apiService';

/**
 * Results view component to display generated chapters and metadata
 * @param {Object} props - Component props
 * @param {Object} props.videoData - Video data
 * @param {Object} props.transcriptionData - Transcription data
 * @param {Object} props.analysisData - Analysis data
 * @param {Array} props.chapters - Generated chapters
 * @param {Object} props.metadata - Generated metadata
 * @param {String} props.language - Current language code
 * @param {Function} props.onChaptersGenerated - Function to call when chapters are generated
 * @param {Function} props.onMetadataGenerated - Function to call when metadata is generated
 * @param {Function} props.onRestart - Function to call when restarting the process
 * @param {Function} props.setLoading - Function to set loading state
 * @param {Function} props.setError - Function to set error state
 */
const ResultsView = ({
  videoData,
  transcriptionData,
  analysisData,
  chapters,
  metadata,
  language,
  onChaptersGenerated,
  onMetadataGenerated,
  onRestart,
  setLoading,
  setError
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // Get texts based on current language
  const getText = () => {
    const texts = {
      chaptersTab: {
        he: 'פרקים',
        en: 'Chapters',
        uk: 'Розділи',
        ar: 'الفصول',
        ru: 'Главы',
        fr: 'Chapitres',
        es: 'Capítulos',
        de: 'Kapitel'
      },
      metadataTab: {
        he: 'מטא־נתונים',
        en: 'Metadata',
        uk: 'Метадані',
        ar: 'البيانات الوصفية',
        ru: 'Метаданные',
        fr: 'Métadonnées',
        es: 'Metadatos',
        de: 'Metadaten'
      },
      generateChapters: {
        he: 'צור פרקים',
        en: 'Generate Chapters',
        uk: 'Створити розділи',
        ar: 'إنشاء فصول',
        ru: 'Создать главы',
        fr: 'Générer des chapitres',
        es: 'Generar capítulos',
        de: 'Kapitel generieren'
      },
      regenerateChapters: {
        he: 'צור פרקים מחדש',
        en: 'Regenerate Chapters',
        uk: 'Створити розділи знову',
        ar: 'إعادة إنشاء الفصول',
        ru: 'Пересоздать главы',
        fr: 'Régénérer les chapitres',
        es: 'Regenerar capítulos',
        de: 'Kapitel neu generieren'
      },
      generateMetadata: {
        he: 'צור מטא־נתונים',
        en: 'Generate Metadata',
        uk: 'Створити метадані',
        ar: 'إنشاء البيانات الوصفية',
        ru: 'Создать метаданные',
        fr: 'Générer des métadonnées',
        es: 'Generar metadatos',
        de: 'Metadaten generieren'
      },
      regenerateMetadata: {
        he: 'צור מטא־נתונים מחדש',
        en: 'Regenerate Metadata',
        uk: 'Створити метадані знову',
        ar: 'إعادة إنشاء البيانات الوصفية',
        ru: 'Пересоздать метаданные',
        fr: 'Régénérer les métadonnées',
        es: 'Regenerar metadatos',
        de: 'Metadaten neu generieren'
      },
      copyAll: {
        he: 'העתק הכל',
        en: 'Copy All',
        uk: 'Копіювати все',
        ar: 'نسخ الكل',
        ru: 'Копировать все',
        fr: 'Tout copier',
        es: 'Copiar todo',
        de: 'Alles kopieren'
      },
      copyChapters: {
        he: 'העתק פרקים',
        en: 'Copy Chapters',
        uk: 'Копіювати розділи',
        ar: 'نسخ الفصول',
        ru: 'Копировать главы',
        fr: 'Copier les chapitres',
        es: 'Copiar capítulos',
        de: 'Kapitel kopieren'
      },
      copyTitle: {
        he: 'העתק כותרת',
        en: 'Copy Title',
        uk: 'Копіювати заголовок',
        ar: 'نسخ العنوان',
        ru: 'Копировать заголовок',
        fr: 'Copier le titre',
        es: 'Copiar título',
        de: 'Titel kopieren'
      },
      copyDescription: {
        he: 'העתק תיאור',
        en: 'Copy Description',
        uk: 'Копіювати опис',
        ar: 'نسخ الوصف',
        ru: 'Копировать описание',
        fr: 'Copier la description',
        es: 'Copiar descripción',
        de: 'Beschreibung kopieren'
      },
      copyTags: {
        he: 'העתק תגיות',
        en: 'Copy Tags',
        uk: 'Копіювати теги',
        ar: 'نسخ العلامات',
        ru: 'Копировать теги',
        fr: 'Copier les tags',
        es: 'Copiar etiquetas',
        de: 'Tags kopieren'
      },
      copied: {
        he: 'הועתק!',
        en: 'Copied!',
        uk: 'Скопійовано!',
        ar: 'تم النسخ!',
        ru: 'Скопировано!',
        fr: 'Copié!',
        es: '¡Copiado!',
        de: 'Kopiert!'
      },
      generating: {
        he: 'מייצר...',
        en: 'Generating...',
        uk: 'Створення...',
        ar: 'جاري الإنشاء...',
        ru: 'Создание...',
        fr: 'Génération...',
        es: 'Generando...',
        de: 'Generierung...'
      },
      title: {
        he: 'כותרת',
        en: 'Title',
        uk: 'Заголовок',
        ar: 'العنوان',
        ru: 'Заголовок',
        fr: 'Titre',
        es: 'Título',
        de: 'Titel'
      },
      description: {
        he: 'תיאור',
        en: 'Description',
        uk: 'Опис',
        ar: 'الوصف',
        ru: 'Описание',
        fr: 'Description',
        es: 'Descripción',
        de: 'Beschreibung'
      },
      tags: {
        he: 'תגיות',
        en: 'Tags',
        uk: 'Теги',
        ar: 'العلامات',
        ru: 'Теги',
        fr: 'Tags',
        es: 'Etiquetas',
        de: 'Tags'
      },
      hashtags: {
        he: 'האשטגים',
        en: 'Hashtags',
        uk: 'Хештеги',
        ar: 'الهاشتاج',
        ru: 'Хэштеги',
        fr: 'Hashtags',
        es: 'Hashtags',
        de: 'Hashtags'
      },
      restart: {
        he: 'התחל מחדש',
        en: 'Start Over',
        uk: 'Почати спочатку',
        ar: 'البدء من جديد',
        ru: 'Начать сначала',
        fr: 'Recommencer',
        es: 'Empezar de nuevo',
        de: 'Neu starten'
      }
    };

    return {
      chaptersTab: texts.chaptersTab[language] || texts.chaptersTab.en,
      metadataTab: texts.metadataTab[language] || texts.metadataTab.en,
      generateChapters: texts.generateChapters[language] || texts.generateChapters.en,
      regenerateChapters: texts.regenerateChapters[language] || texts.regenerateChapters.en,
      generateMetadata: texts.generateMetadata[language] || texts.generateMetadata.en,
      regenerateMetadata: texts.regenerateMetadata[language] || texts.regenerateMetadata.en,
      copyAll: texts.copyAll[language] || texts.copyAll.en,
      copyChapters: texts.copyChapters[language] || texts.copyChapters.en,
      copyTitle: texts.copyTitle[language] || texts.copyTitle.en,
      copyDescription: texts.copyDescription[language] || texts.copyDescription.en,
      copyTags: texts.copyTags[language] || texts.copyTags.en,
      copied: texts.copied[language] || texts.copied.en,
      generating: texts.generating[language] || texts.generating.en,
      title: texts.title[language] || texts.title.en,
      description: texts.description[language] || texts.description.en,
      tags: texts.tags[language] || texts.tags.en,
      hashtags: texts.hashtags[language] || texts.hashtags.en,
      restart: texts.restart[language] || texts.restart.en
    };
  };

  const texts = getText();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Generate chapters
  const handleGenerateChapters = async () => {
    if (!analysisData) {
      setError('No analysis data available');
      return;
    }

    try {
      setLoadingChapters(true);
      setLoading(true);
      
      const requestData = {
        analysisId: analysisData.analysisId,
        language,
        apiType: 'openai' // Could be a user preference
      };
      
      const response = await aiService.generateChapters(requestData);
      
      if (response.success) {
        onChaptersGenerated(response.data.chapters);
      } else {
        setError(response.message || 'Failed to generate chapters');
      }
    } catch (error) {
      setError(error.message || 'Error generating chapters');
    } finally {
      setLoadingChapters(false);
      setLoading(false);
    }
  };

  // Generate metadata
  const handleGenerateMetadata = async () => {
    if (!analysisData) {
      setError('No analysis data available');
      return;
    }

    try {
      setLoadingMetadata(true);
      setLoading(true);
      
      const requestData = {
        analysisId: analysisData.analysisId,
        language,
        apiType: 'openai' // Could be a user preference
      };
      
      const response = await aiService.generateMetadata(requestData);
      
      if (response.success) {
        onMetadataGenerated(response.data.metadata);
      } else {
        setError(response.message || 'Failed to generate metadata');
      }
    } catch (error) {
      setError(error.message || 'Error generating metadata');
    } finally {
      setLoadingMetadata(false);
      setLoading(false);
    }
  };

  // Generate chapters and metadata if they don't exist
  useEffect(() => {
    if (analysisData && !chapters && !loadingChapters) {
      handleGenerateChapters();
    }
    
    if (analysisData && !metadata && !loadingMetadata) {
      handleGenerateMetadata();
    }
  }, [analysisData]);

  // Copy text to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(label);
        setTimeout(() => setCopiedText(''), 2000);
      })
      .catch((error) => {
        console.error('Error copying text:', error);
      });
  };

  // Format chapters for copying
  const formatChaptersForCopy = () => {
    if (!chapters) return '';
    
    return chapters.map(chapter => 
      `${chapter.formattedStartTime} ${chapter.title}`
    ).join('\n');
  };

  // Format all data for copying
  const formatAllForCopy = () => {
    if (!chapters || !metadata) return '';
    
    const chaptersText = chapters.map(chapter => 
      `${chapter.formattedStartTime} ${chapter.title}`
    ).join('\n');
    
    const tagsText = metadata.tags.join(', ');
    const hashtagsText = metadata.hashtags.join(' ');
    
    return `${metadata.title}\n\n${metadata.description}\n\n${chaptersText}\n\n${texts.tags}: ${tagsText}\n${texts.hashtags}: ${hashtagsText}`;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            {videoData?.data?.title || 'Video Results'}
          </Typography>
          <Button
            startIcon={<ReplayIcon />}
            onClick={onRestart}
            variant="outlined"
            color="primary"
          >
            {texts.restart}
          </Button>
        </Box>
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
            >
              <Tab label={texts.chaptersTab} />
              <Tab label={texts.metadataTab} />
            </Tabs>
          </Box>
          
          {/* Chapters Tab */}
          <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 2 }}>
            {tabValue === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateChapters}
                    disabled={loadingChapters || !analysisData}
                    startIcon={loadingChapters ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loadingChapters ? texts.generating : 
                     chapters ? texts.regenerateChapters : texts.generateChapters}
                  </Button>
                  
                  {chapters && (
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard(formatChaptersForCopy(), texts.copyChapters)}
                      disabled={!chapters}
                    >
                      {copiedText === texts.copyChapters ? texts.copied : texts.copyChapters}
                    </Button>
                  )}
                </Box>
                
                {chapters ? (
                  <List>
                    {chapters.map((chapter, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            width: '100%',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' }
                          }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              minWidth: { xs: '100%', sm: '120px' },
                              mb: { xs: 1, sm: 0 }
                            }}>
                              <TimerIcon sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="subtitle2" className="timestamp">
                                {chapter.formattedStartTime}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                flexGrow: 1,
                                fontWeight: 500
                              }}
                            >
                              {chapter.title}
                            </Typography>
                            <Tooltip title={texts.copyTitle}>
                              <IconButton 
                                size="small"
                                onClick={() => copyToClipboard(`${chapter.formattedStartTime} ${chapter.title}`, `Chapter ${index + 1}`)}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                        {index < chapters.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    {loadingChapters ? (
                      <CircularProgress />
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        {analysisData ? 'No chapters generated yet. Click the button above to generate chapters.' : 'Waiting for analysis data...'}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
          
          {/* Metadata Tab */}
          <Box role="tabpanel" hidden={tabValue !== 1} sx={{ py: 2 }}>
            {tabValue === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateMetadata}
                    disabled={loadingMetadata || !analysisData}
                    startIcon={loadingMetadata ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loadingMetadata ? texts.generating : 
                     metadata ? texts.regenerateMetadata : texts.generateMetadata}
                  </Button>
                  
                  {metadata && chapters && (
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard(formatAllForCopy(), texts.copyAll)}
                      disabled={!metadata || !chapters}
                    >
                      {copiedText === texts.copyAll ? texts.copied : texts.copyAll}
                    </Button>
                  )}
                </Box>
                
                {metadata ? (
                  <Grid container spacing={2}>
                    {/* Title */}
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TitleIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">{texts.title}</Typography>
                          </Box>
                          <Typography variant="body1">{metadata.title}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={() => copyToClipboard(metadata.title, texts.copyTitle)}
                          >
                            {copiedText === texts.copyTitle ? texts.copied : texts.copyTitle}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                    
                    {/* Description */}
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">{texts.description}</Typography>
                          </Box>
                          <TextField
                            multiline
                            rows={6}
                            fullWidth
                            variant="outlined"
                            value={metadata.description}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={() => copyToClipboard(metadata.description, texts.copyDescription)}
                          >
                            {copiedText === texts.copyDescription ? texts.copied : texts.copyDescription}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                    
                    {/* Tags */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LabelIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">{texts.tags}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {metadata.tags.map((tag, index) => (
                              <Chip key={index} label={tag} />
                            ))}
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={() => copyToClipboard(metadata.tags.join(', '), texts.copyTags)}
                          >
                            {copiedText === texts.copyTags ? texts.copied : texts.copyTags}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                    
                    {/* Hashtags */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TagIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">{texts.hashtags}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {metadata.hashtags.map((hashtag, index) => (
                              <Chip key={index} label={hashtag} color="primary" variant="outlined" />
                            ))}
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={() => copyToClipboard(metadata.hashtags.join(' '), texts.hashtags)}
                          >
                            {copiedText === texts.hashtags ? texts.copied : texts.copyTags}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    {loadingMetadata ? (
                      <CircularProgress />
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        {analysisData ? 'No metadata generated yet. Click the button above to generate metadata.' : 'Waiting for analysis data...'}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsView;
