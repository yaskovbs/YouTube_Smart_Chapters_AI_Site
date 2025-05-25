import React from 'react';
import LanguageSelector from '../common/LanguageSelector';

/**
 * ProcessPageForm - Form component for video processing
 * Handles input selection, settings, and submission
 */
const ProcessPageForm = ({
  // State from hook
  activeTab,
  videoUrl,
  selectedFile,
  selectedLanguage,
  isProcessing,
  error,
  step,
  progress,
  apiKeys,
  useAI,
  
  // Setters from hook
  setActiveTab,
  setVideoUrl,
  setUseAI,
  
  // Handlers from hook
  handleLanguageChange,
  handleApiKeyChange,
  handleFileSelect,
  handleSubmit,
  getStepName
}) => {
  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1>עיבוד וידאו חכם</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
            העלה וידאו או הכנס קישור YouTube כדי ליצור פרקים, תיאורים ותגים אוטומטית
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span style={{ 
              background: '#4CAF50', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.9rem' 
            }}>✓ ללא שרת מקומי</span>
            <span style={{ 
              background: '#2196F3', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.9rem' 
            }}>✓ עובד בדפדפן</span>
            <span style={{ 
              background: '#FF9800', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.9rem' 
            }}>✓ מצב חינם זמין</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-4">
            <h4 style={{ marginBottom: '10px' }}>שגיאת עיבוד</h4>
            <p style={{ marginBottom: '15px' }}>{error}</p>
            <hr style={{ margin: '15px 0', border: '1px solid rgba(0,0,0,0.1)' }} />
            <div>
              <strong>הצעות לפתרון:</strong>
              <ul style={{ marginTop: '10px', marginBottom: '0' }}>
                <li>בדוק את חיבור האינטרנט שלך</li>
                <li>וודא שמפתחות ה-API תקינים</li>
                <li>נסה סרטון אחר או קובץ אחר</li>
                <li>נסה במצב חינם (בלי API keys)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>הגדרות עיבוד</h3>
          
          <form onSubmit={handleSubmit}>
            {/* Tab Selection */}
            <div className="form-group">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <label 
                  style={{ 
                    flex: 1, 
                    textAlign: 'center', 
                    padding: '12px', 
                    border: '2px solid #E91E63', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: activeTab === 'youtube' ? '#E91E63' : 'transparent',
                    color: activeTab === 'youtube' ? 'white' : '#E91E63',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="source"
                    value="youtube"
                    checked={activeTab === 'youtube'}
                    onChange={() => setActiveTab('youtube')}
                    style={{ display: 'none' }}
                  />
                  📺 YouTube URL
                </label>

                <label 
                  style={{ 
                    flex: 1, 
                    textAlign: 'center', 
                    padding: '12px', 
                    border: '2px solid #E91E63', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: activeTab === 'file' ? '#E91E63' : 'transparent',
                    color: activeTab === 'file' ? 'white' : '#E91E63',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="source"
                    value="file"
                    checked={activeTab === 'file'}
                    onChange={() => setActiveTab('file')}
                    style={{ display: 'none' }}
                  />
                  📁 העלאת קובץ
                </label>
              </div>
            </div>

            {/* Content Input */}
            {activeTab === 'youtube' ? (
              <div className="form-group">
                <label className="form-label">קישור YouTube</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={isProcessing}
                />
                <small style={{ color: '#666', fontSize: '0.9rem' }}>
                  הכנס קישור לסרטון YouTube עם תמלילים זמינים
                </small>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">קובץ אודיו/וידאו</label>
                <input
                  type="file"
                  className="form-input"
                  accept="video/*,audio/*"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
                <small style={{ color: '#666', fontSize: '0.9rem' }}>
                  גודל מקסימלי: 1GB. פורמטים נתמכים: MP4, AVI, MOV, MP3, WAV
                </small>
                {selectedFile && (
                  <div style={{ marginTop: '8px' }}>
                    <small style={{ color: '#4CAF50' }}>
                      ✓ {selectedFile.name} ({(() => {
                        const bytes = selectedFile.size;
                        if (bytes === 0) return '0 Bytes';
                        
                        const k = 1024;
                        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                        const i = Math.floor(Math.log(bytes) / Math.log(k));
                        
                        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                      })()})
                    </small>
                  </div>
                )}
              </div>
            )}

            {/* Language Selection */}
            <div className="form-group">
              <label className="form-label">שפת התוכן</label>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                disabled={isProcessing}
              />
            </div>

            {/* AI Features Toggle */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  disabled={isProcessing}
                  style={{ marginLeft: '8px' }}
                />
                השתמש בתכונות AI מתקדמות (דורש API keys)
              </label>
            </div>

            {/* API Keys (conditional) */}
            {useAI && (
              <div className="card" style={{ background: '#f8f8f8', marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>מפתחות API (אופציונלי למצב מתקדם)</h4>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">מפתח OpenAI</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="sk-..."
                      value={apiKeys.openai}
                      onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                      disabled={isProcessing}
                    />
                    <small style={{ color: '#666', fontSize: '0.9rem' }}>
                      לניתוח AI ותמלול מתקדם
                    </small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">מפתח AssemblyAI</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="..."
                      value={apiKeys.assemblyai}
                      onChange={(e) => handleApiKeyChange('assemblyai', e.target.value)}
                      disabled={isProcessing}
                    />
                    <small style={{ color: '#666', fontSize: '0.9rem' }}>
                      לתמלול מקצועי (אופציונלי)
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            {isProcessing && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>שלב {step}/5: {getStepName(step)}</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e0e0e0', 
                  borderRadius: '4px', 
                  overflow: 'hidden' 
                }}>
                  <div 
                    style={{ 
                      width: `${progress}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #E91E63, #FF5722)', 
                      transition: 'width 0.3s ease',
                      animation: isProcessing ? 'pulse 2s infinite' : 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                className={`btn btn-primary btn-large ${isProcessing || (activeTab === 'youtube' && !videoUrl) || (activeTab === 'file' && !selectedFile) ? 'btn-disabled' : ''}`}
                disabled={isProcessing || (activeTab === 'youtube' && !videoUrl) || (activeTab === 'file' && !selectedFile)}
                style={{ minWidth: '200px' }}
              >
                {isProcessing ? (
                  <>
                    <span className="loading-spinner" style={{ marginLeft: '8px' }}></span>
                    מעבד...
                  </>
                ) : (
                  'צור פרקים חכמים'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProcessPageForm;
