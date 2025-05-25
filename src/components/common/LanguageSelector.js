import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  label = 'שפת הסרטון',
  className = '',
  disabled = false 
}) => {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor="languageSelector" className="form-label">
        {label}
      </label>
      <select
        id="languageSelector"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="form-input"
        disabled={disabled}
        style={{
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '14px',
          backgroundColor: disabled ? '#f5f5f5' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.nativeName}
          </option>
        ))}
      </select>
      <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
        בחר את השפה שבה מדובר בסרטון לתמלול מדויק
      </small>
    </div>
  );
};

export default LanguageSelector;
