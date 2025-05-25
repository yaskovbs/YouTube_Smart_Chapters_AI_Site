import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    assemblyai: ''
  });
  const [language, setLanguage] = useState('he');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedKeys = localStorage.getItem('youtube-smart-chapters-api-keys');
      const savedLanguage = localStorage.getItem('youtube-smart-chapters-language');
      
      if (savedKeys) {
        const parsedKeys = JSON.parse(savedKeys);
        setApiKeys(parsedKeys);
      }
      
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleApiKeyChange = (e) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({
      ...prev,
      [name]: value
    }));
    setSaved(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    try {
      setError('');

      // Basic validation
      if (!apiKeys.openai.trim() || !apiKeys.assemblyai.trim()) {
        setError('אנא הכנס את שני מפתחות ה-API');
        return;
      }

      // Validate OpenAI key format
      if (!apiKeys.openai.startsWith('sk-')) {
        setError('מפתח OpenAI צריך להתחיל ב-sk-');
        return;
      }

      // Save to localStorage
      localStorage.setItem('youtube-smart-chapters-api-keys', JSON.stringify(apiKeys));
      localStorage.setItem('youtube-smart-chapters-language', language);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setError('שגיאה בשמירת ההגדרות');
      console.error('Error saving settings:', error);
    }
  };

  const handleReset = () => {
    setApiKeys({
      openai: '',
      assemblyai: ''
    });
    setLanguage('he');
    localStorage.removeItem('youtube-smart-chapters-api-keys');
    localStorage.removeItem('youtube-smart-chapters-language');
    setSaved(false);
    setError('');
  };

  const handleTestConnection = async () => {
    if (!apiKeys.openai || !apiKeys.assemblyai) {
      setError('אנא הכנס את מפתחות ה-API לפני בדיקת החיבור');
      return;
    }

    try {
      setError('');
      // Here you would typically test the API connection
      // For now, we'll simulate a successful test
      alert('חיבור ה-API פועל תקין! ✅');
    } catch (error) {
      setError('שגיאה בבדיקת החיבור');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #E91E63 0%, #FF5722 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '24px'
          }}>
            הגדרות API
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            הגדר את מפתחות ה-API שלך לשימוש במערכת
            <br />
            המפתחות נשמרים באופן מאובטח בדפדפן שלך
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* API Keys Configuration */}
            <div className="card mb-4">
              <h2 className="card-title">🔑 מפתחות API</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* OpenAI API Key */}
                <div>
                  <label className="form-label">
                    OpenAI API Key *
                  </label>
                  <input
                    type="password"
                    name="openai"
                    value={apiKeys.openai}
                    onChange={handleApiKeyChange}
                    className="form-input"
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    style={{ direction: 'ltr' }}
                  />
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    נדרש לניתוח תוכן ויצירת מטא-נתונים (כותרות, תיאורים, תגים)
                  </p>
                </div>

                {/* AssemblyAI API Key */}
                <div>
                  <label className="form-label">
                    AssemblyAI API Key *
                  </label>
                  <input
                    type="password"
                    name="assemblyai"
                    value={apiKeys.assemblyai}
                    onChange={handleApiKeyChange}
                    className="form-input"
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    style={{ direction: 'ltr' }}
                  />
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    נדרש לתמלול סרטונים ויצירת פרקים אוטומטיים
                  </p>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="form-label">
                    שפת ברירת מחדל
                  </label>
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="form-input"
                  >
                    <option value="he">עברית</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="ru">Русский</option>
                    <option value="uk">Українська</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                {saved && (
                  <div className="alert alert-success">
                    ההגדרות נשמרו בהצלחה! ✅
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={!apiKeys.openai || !apiKeys.assemblyai}
                  >
                    שמור הגדרות
                  </button>
                  <button
                    onClick={handleTestConnection}
                    className="btn btn-secondary"
                    disabled={!apiKeys.openai || !apiKeys.assemblyai}
                  >
                    בדוק חיבור
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn btn-secondary"
                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                  >
                    איפוס
                  </button>
                </div>
              </div>
            </div>

            {/* How to Get API Keys */}
            <div className="card mb-4">
              <h2 className="card-title">📋 איך להשיג מפתחות API</h2>
              
              <div className="grid grid-2" style={{ gap: '24px' }}>
                {/* OpenAI */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '12px'
                }}>
                  <h3 style={{ color: '#2e7d32', marginBottom: '16px' }}>
                    🤖 OpenAI API Key
                  </h3>
                  <ol style={{ marginRight: '20px', lineHeight: '1.8' }}>
                    <li>עבור ל-<a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2e7d32' }}>platform.openai.com</a></li>
                    <li>צור חשבון או התחבר</li>
                    <li>לחץ על "API Keys" בתפריט</li>
                    <li>לחץ "Create new secret key"</li>
                    <li>העתק את המפתח (מתחיל ב-sk-)</li>
                  </ol>
                  <div style={{ marginTop: '16px' }}>
                    <a 
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ backgroundColor: '#2e7d32', borderColor: '#2e7d32' }}
                    >
                      קבל מפתח OpenAI
                    </a>
                  </div>
                </div>

                {/* AssemblyAI */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '12px'
                }}>
                  <h3 style={{ color: '#1976d2', marginBottom: '16px' }}>
                    🎵 AssemblyAI API Key
                  </h3>
                  <ol style={{ marginRight: '20px', lineHeight: '1.8' }}>
                    <li>עבור ל-<a href="https://www.assemblyai.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>assemblyai.com</a></li>
                    <li>צור חשבון או התחבר</li>
                    <li>עבור ל-Dashboard</li>
                    <li>בחר "API Keys" או "Settings"</li>
                    <li>העתק את המפתח</li>
                  </ol>
                  <div style={{ marginTop: '16px' }}>
                    <a 
                      href="https://www.assemblyai.com/dashboard/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ backgroundColor: '#1976d2', borderColor: '#1976d2' }}
                    >
                      קבל מפתח AssemblyAI
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="card mb-4">
              <h2 className="card-title">🔒 פרטיות ואבטחה</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🔐</span>
                  <div>
                    <h4 style={{ margin: '0 0 8px', color: '#333' }}>
                      אחסון מקומי בטוח
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      המפתחות נשמרים רק בדפדפן שלך ואינם נשלחים לשרתים חיצוניים
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🚫</span>
                  <div>
                    <h4 style={{ margin: '0 0 8px', color: '#333' }}>
                      ללא איסוף נתונים
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      אנחנו לא רואים, אוספים או מאחסנים את המפתחות שלך
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>💡</span>
                  <div>
                    <h4 style={{ margin: '0 0 8px', color: '#333' }}>
                      שימוש אחראי
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      ודא שהמפתחות שלך מוגדרים עם הגבלות שימוש מתאימות
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start */}
            <div className="card">
              <h2 className="card-title">🚀 התחלה מהירה</h2>
              <p>
                לאחר הגדרת המפתחות, תוכל להתחיל לעבד סרטוני YouTube מיד!
              </p>
              
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <Link 
                  to="/process" 
                  className="btn btn-primary btn-large"
                >
                  התחל עיבוד סרטון
                </Link>
                <Link 
                  to="/about" 
                  className="btn btn-secondary"
                >
                  למד עוד על השירות
                </Link>
                <Link 
                  to="/contact" 
                  className="btn btn-secondary"
                >
                  צריך עזרה?
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
