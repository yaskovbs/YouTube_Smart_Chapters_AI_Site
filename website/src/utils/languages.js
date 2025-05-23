export const SUPPORTED_LANGUAGES = [
  { 
    code: 'he', 
    name: 'עברית', 
    nativeName: 'עברית',
    direction: 'rtl'
  },
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    direction: 'ltr'
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية',
    direction: 'rtl'
  },
  { 
    code: 'ru', 
    name: 'Russian', 
    nativeName: 'Русский',
    direction: 'ltr'
  },
  { 
    code: 'uk', 
    name: 'Ukrainian', 
    nativeName: 'Українська',
    direction: 'ltr'
  },
  { 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français',
    direction: 'ltr'
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español',
    direction: 'ltr'
  },
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch',
    direction: 'ltr'
  }
];

export const DEFAULT_LANGUAGE = 'he';

/**
 * Get language by code
 * @param {string} code - Language code
 * @returns {Object|null} Language object or null if not found
 */
export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || null;
};

/**
 * Get user's preferred language from localStorage or browser
 * @returns {string} Language code
 */
export const getUserPreferredLanguage = () => {
  // First check localStorage
  const saved = localStorage.getItem('preferredLanguage');
  if (saved && SUPPORTED_LANGUAGES.find(lang => lang.code === saved)) {
    return saved;
  }
  
  // Then check browser language
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang)) {
    return browserLang;
  }
  
  // Default to Hebrew
  return DEFAULT_LANGUAGE;
};

/**
 * Save user's preferred language
 * @param {string} languageCode - Language code to save
 */
export const saveUserPreferredLanguage = (languageCode) => {
  localStorage.setItem('preferredLanguage', languageCode);
};

/**
 * Get language display name for UI
 * @param {string} code - Language code
 * @returns {string} Display name
 */
export const getLanguageDisplayName = (code) => {
  const language = getLanguageByCode(code);
  return language ? language.nativeName : code;
};
