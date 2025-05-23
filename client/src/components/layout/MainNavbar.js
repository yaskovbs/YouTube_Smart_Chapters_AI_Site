import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslateIcon from '@mui/icons-material/Translate';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';

// Language options
const languages = [
  { code: 'he', label: 'עברית' },  // Hebrew
  { code: 'en', label: 'English' }, // English
  { code: 'uk', label: 'Українська' }, // Ukrainian
  { code: 'ar', label: 'العربية' },  // Arabic
  { code: 'ru', label: 'Русский' },  // Russian
  { code: 'fr', label: 'Français' },  // French
  { code: 'es', label: 'Español' },   // Spanish
  { code: 'de', label: 'Deutsch' }    // German
];

/**
 * Main navigation bar component
 * @param {Object} props - Component props
 * @param {string} props.language - Current language code
 * @param {Function} props.onLanguageChange - Language change handler
 * @param {Function} props.onSettingsClick - Settings button click handler
 */
const MainNavbar = ({ language, onLanguageChange, onSettingsClick }) => {
  // Get language label for current language
  const getLanguageLabel = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.label : 'English';
  };

  // Title text based on language
  const getTitleText = () => {
    switch (language) {
      case 'he':
        return 'YouTube פרקים חכמים AI';
      case 'uk':
        return 'YouTube Розумні Розділи AI';
      case 'ar':
        return 'YouTube فصول ذكية AI';
      case 'ru':
        return 'YouTube Умные Главы AI';
      case 'fr':
        return 'YouTube Chapitres Intelligents AI';
      case 'es':
        return 'YouTube Capítulos Inteligentes AI';
      case 'de':
        return 'YouTube Intelligente Kapitel AI';
      case 'en':
      default:
        return 'YouTube Smart Chapters AI';
    }
  };

  // Website button tooltip text based on language
  const getWebsiteTooltip = () => {
    switch (language) {
      case 'he':
        return 'בקר באתר שלנו';
      case 'uk':
        return 'Відвідати наш сайт';
      case 'ar':
        return 'زيارة موقعنا';
      case 'ru':
        return 'Посетить наш сайт';
      case 'fr':
        return 'Visiter notre site';
      case 'es':
        return 'Visitar nuestro sitio';
      case 'de':
        return 'Besuchen Sie unsere Website';
      case 'en':
      default:
        return 'Visit our website';
    }
  };

  // Handle website button click
  const handleWebsiteClick = () => {
    window.open('https://youtubesmartchaptersai.pages.dev', '_blank');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <YouTubeIcon sx={{ mr: 1.5, fontSize: 28 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {getTitleText()}
        </Typography>
        
        {/* Language Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <TranslateIcon sx={{ mr: 1, fontSize: 20 }} />
          <FormControl variant="standard" size="small">
            <Select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              sx={{ 
                color: 'white',
                '.MuiSelect-icon': { color: 'white' },
                '&:before': { borderColor: 'white' },
                '&:after': { borderColor: 'white' },
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Website Button */}
        <Tooltip title={getWebsiteTooltip()}>
          <IconButton 
            color="inherit" 
            onClick={handleWebsiteClick}
            aria-label="website"
            sx={{ mr: 1 }}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
        
        {/* Settings Button */}
        <IconButton 
          color="inherit" 
          onClick={onSettingsClick}
          aria-label="settings"
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavbar;
