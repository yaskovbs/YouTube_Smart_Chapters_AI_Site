import React from 'react';

/**
 * ProcessPageResults - Results display component
 * Shows analysis, chapters, and metadata with copy functionality
 */
const ProcessPageResults = ({
  // Data from hook
  results,
  activeTab,
  
  // Utilities from hook
  formatTime,
  
  // Reset function
  setResults
}) => {
  // Clipboard functionality
  const copyToClipboard = (text, buttonElement) => {
    navigator.clipboard.writeText(text).then(() => {
      if (buttonElement) {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'הועתק!';
        buttonElement.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
          buttonElement.textContent = originalText;
          buttonElement.style.backgroundColor = '';
        }, 2000);
      }
    }).catch(() => {
      alert('שגיאה בהעתקה ללוח');
    });
  };

  // Format chapters for copying
  const formatChapters = (chapters) => {
    return chapters.map(chapter => 
      `${chapter.formattedStartTime} ${chapter.title}`
    ).join('\n');
  };

  if (!results) {
    return null;
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card mb-4">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>תוצאות עיבוד</h3>
            <button 
              className="btn btn-secondary" 
              onClick={() => setResults(null)}
            >
              עיבוד חדש
            </button>
          </div>

          {/* Demo Data Alert */}
          {results.isDemoData && (
            <div className="alert alert-info mb-4">
              <strong>מצב דמו:</strong> התוצאות מבוססות על נתוני דמו. לא ניתן לגשת לתמלילים הקיימים. או נתונים אמיתיים.
            </div>
          )}

          {/* Real YouTube Data Success */}
          {results.isRealYouTubeData && (
            <div className="alert alert-success mb-4">
              <strong>✓ תמלילי YouTube אמיתיים:</strong> השתמשנו בתמלילים הקיימים של YouTube לסרטון זה.
            </div>
          )}

          {/* Video Info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4>מידע כללי:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {results.videoId && <li><strong>YouTube ID:</strong> {results.videoId}</li>}
              {results.fileName && <li><strong>קובץ:</strong> {results.fileName}</li>}
              <li><strong>שפה:</strong> {results.language}</li>
              <li><strong>מקור תמלול:</strong> {results.source}</li>
              {results.transcript.duration && (
                <li><strong>משך:</strong> {formatTime(results.transcript.duration)}</li>
              )}
            </ul>
          </div>

          {/* Analysis */}
          <div className="card mb-4">
            <h4 style={{ marginBottom: '1rem' }}>ניתוח תוכן</h4>
            <div style={{ marginBottom: '1rem' }}>
              <strong>נושא עיקרי:</strong>
              <p style={{ marginTop: '0.5rem' }}>{results.analysis.mainTopic}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>סיכום:</strong>
              <p style={{ marginTop: '0.5rem' }}>{results.analysis.summary}</p>
            </div>
            {results.analysis.keyPoints?.length > 0 && (
              <div>
                <strong>נקודות מפתח:</strong>
                <ul style={{ marginTop: '0.5rem' }}>
                  {results.analysis.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Chapters */}
          <div className="card mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>פרקים ({results.chapters.length})</h4>
              <button
                className="btn btn-secondary"
                onClick={(e) => copyToClipboard(formatChapters(results.chapters), e.target)}
              >
                העתק פרקים
              </button>
            </div>
            {results.chapters.map((chapter, index) => (
              <div key={index} style={{ 
                borderBottom: index < results.chapters.length - 1 ? '1px solid #eee' : 'none', 
                paddingBottom: '1rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{chapter.title}</strong>
                  <small style={{ color: '#666' }}>{chapter.formattedStartTime}</small>
                </div>
                {chapter.description && (
                  <small style={{ color: '#666' }}>{chapter.description}</small>
                )}
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div className="card mb-4">
            <h4 style={{ marginBottom: '1rem' }}>מטא-נתונים לYouTube</h4>
            
            {/* Title */}
            <div className="form-group">
              <label className="form-label"><strong>כותרת:</strong></label>
              <textarea
                className="form-textarea"
                rows={2}
                value={results.metadata.title}
                readOnly
                style={{ marginBottom: '0.5rem' }}
              />
              <button
                className="btn btn-secondary"
                onClick={(e) => copyToClipboard(results.metadata.title, e.target)}
              >
                העתק כותרת
              </button>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label"><strong>תיאור:</strong></label>
              <textarea
                className="form-textarea"
                rows={6}
                value={results.metadata.description}
                readOnly
                style={{ marginBottom: '0.5rem' }}
              />
              <button
                className="btn btn-secondary"
                onClick={(e) => copyToClipboard(results.metadata.description, e.target)}
              >
                העתק תיאור
              </button>
            </div>

            {/* Tags */}
            {results.metadata.tags?.length > 0 && (
              <div className="form-group">
                <label className="form-label"><strong>תגים:</strong></label>
                <div style={{ marginBottom: '0.5rem' }}>
                  {results.metadata.tags.map((tag, index) => (
                    <span key={index} style={{ 
                      background: '#666', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.9rem',
                      marginLeft: '5px',
                      marginBottom: '5px',
                      display: 'inline-block'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => copyToClipboard(results.metadata.tags.join(', '), e.target)}
                >
                  העתק תגים
                </button>
              </div>
            )}

            {/* Hashtags */}
            {results.metadata.hashtags?.length > 0 && (
              <div className="form-group">
                <label className="form-label"><strong>האשטגים:</strong></label>
                <div style={{ marginBottom: '0.5rem' }}>
                  {results.metadata.hashtags.map((hashtag, index) => (
                    <span key={index} style={{ 
                      background: '#2196F3', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.9rem',
                      marginLeft: '5px',
                      marginBottom: '5px',
                      display: 'inline-block'
                    }}>
                      {hashtag}
                    </span>
                  ))}
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => copyToClipboard(results.metadata.hashtags.join(' '), e.target)}
                >
                  העתק האשטגים
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessPageResults;
