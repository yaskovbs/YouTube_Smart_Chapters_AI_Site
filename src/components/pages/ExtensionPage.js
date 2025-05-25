import React from 'react';
import { Link } from 'react-router-dom';

const ExtensionPage = () => {
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
            תוסף Chrome - YouTube Smart Chapters AI
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            התקן את התוסף וקבל גישה מיידית ליצירת פרקים חכמים
            ישירות מתוך YouTube
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://chromewebstore.google.com/detail/bgabaebkdddhdbpjoedghjnfneakiicc?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-large"
              style={{
                backgroundColor: 'white',
                color: '#E91E63',
                fontWeight: '600',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              🚀 התקן עכשיו מ-Chrome Web Store
            </a>
            <button 
              className="btn btn-large"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: '600',
                border: '2px solid white',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
              }}
              onClick={() => window.open('https://chromewebstore.google.com/search/YouTube%20Smart%20Chapters%20AI', '_blank')}
            >
              🔍 חפש בחנות התוספים
            </button>
          </div>
          <div style={{
            marginTop: '16px',
            fontSize: '14px',
            opacity: 0.8
          }}>
            💡 אם הקישור הישיר לא עובד, השתמש בחיפוש בחנות התוספים
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Installation Instructions */}
            <div className="card mb-4">
              <h2 className="card-title">איך להתקין את התוסף?</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Method 1 - Direct Link */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '12px',
                  border: '2px solid #4CAF50'
                }}>
                  <h3 style={{ color: '#2e7d32', marginBottom: '16px' }}>
                    🚀 התקנה ישירה (מומלץ)
                  </h3>
                  <p style={{ marginBottom: '16px' }}>
                    התוסף כבר פורסם ב-Chrome Web Store! ההתקנה פשוטה וקלה:
                  </p>
                  <ol style={{ marginRight: '20px', lineHeight: '1.8' }}>
                    <li>לחץ על הכפתור למטה</li>
                    <li>בדף התוסף, לחץ "הוסף ל-Chrome"</li>
                    <li>אשר את ההתקנה</li>
                    <li>עבור לכל סרטון YouTube</li>
                    <li>התוסף מוכן לשימוש!</li>
                  </ol>
                  <div style={{ marginTop: '16px' }}>
                    <a 
                      href="https://chromewebstore.google.com/detail/bgabaebkdddhdbpjoedghjnfneakiicc?utm_source=item-share-cb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      🚀 התקן עכשיו
                    </a>
                  </div>
                </div>
                
                {/* Method 2 - Chrome Web Store Search */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '12px',
                  border: '2px solid #2196F3'
                }}>
                  <h3 style={{ color: '#1976d2', marginBottom: '16px' }}>
                    🔍 חיפוש בחנות התוספים
                  </h3>
                  <p style={{ marginBottom: '16px' }}>
                    אם הקישור הישיר לא עובד, חפש את התוסף ישירות בחנות:
                  </p>
                  <ol style={{ marginRight: '20px', lineHeight: '1.8' }}>
                    <li>עבור ל-Chrome Web Store</li>
                    <li>חפש "YouTube Smart Chapters AI"</li>
                    <li>לחץ "הוסף ל-Chrome"</li>
                    <li>אשר את ההתקנה</li>
                    <li>התוסף מוכן לשימוש!</li>
                  </ol>
                  <div style={{ marginTop: '16px' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.open('https://chromewebstore.google.com/search/YouTube%20Smart%20Chapters%20AI', '_blank')}
                    >
                      🔍 חפש בחנות התוספים
                    </button>
                  </div>
                </div>

                {/* Method 3 - Manual Installation */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#fff3e0',
                  borderRadius: '12px',
                  border: '2px solid #FF9800'
                }}>
                  <h3 style={{ color: '#f57c00', marginBottom: '16px' }}>
                    🔧 התקנה ידנית (למפתחים)
                  </h3>
                  <p style={{ marginBottom: '16px' }}>
                    אם אתה מפתח או רוצה לנסות את הגרסה העדכנית ביותר:
                  </p>
                  <ol style={{ marginRight: '20px', lineHeight: '1.8' }}>
                    <li>
                      הורד את הקוד מ-GitHub: 
                      <a 
                        href="https://github.com/yaskovbs/YouTube_Smart_Chapters_AI" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#f57c00', marginRight: '8px' }}
                      >
                        GitHub Repository
                      </a>
                    </li>
                    <li>פתח את Chrome ועבור ל-chrome://extensions/</li>
                    <li>הפעל "Developer mode" (מצב מפתח) בפינה הימנית העליונה</li>
                    <li>לחץ "Load unpacked" (טען לא ארוז)</li>
                    <li>בחר את התיקייה client/public</li>
                    <li>התוסף יותקן ויופיע ברשימה</li>
                  </ol>
                  <div style={{ marginTop: '16px' }}>
                    <a 
                      href="https://github.com/yaskovbs/YouTube_Smart_Chapters_AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      פתח GitHub
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Features */}
            <div className="card mb-4">
              <h2 className="card-title">מה התוסף מציע?</h2>
              
              <div className="grid grid-2" style={{ gap: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '2rem' }}>🚀</span>
                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      אינטגרציה ישירה
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      עובד ישירות בתוך YouTube ללא צורך לעבור לאתר נפרד
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '2rem' }}>⚡</span>
                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      עיבוד מהיר
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      לחיצה אחת והעיבוד מתחיל אוטומטית בתוך הדף
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '2rem' }}>📋</span>
                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      העתקה קלה
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      העתקה ישירה של הפרקים ל-YouTube Studio בלחיצה אחת
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '2rem' }}>🌍</span>
                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      תמיכה בשפות
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      בחירת שפה לתמלול - עברית, אנגלית, וכו'
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div className="card mb-4">
              <h2 className="card-title">צילומי מסך</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    <img 
                      src="/youtube-with-extension.png" 
                      alt="התוסף בפעולה ב-YouTube"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  <h4 style={{ marginBottom: '8px' }}>התוסף בפעולה</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    התוסף מוסיף כפתורים נוחים לכל דף YouTube
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    <img 
                      src="/website-results-screenshot.png" 
                      alt="תוצאות העיבוד - פרקים וכותרות שנוצרו באמצעות AI"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  <h4 style={{ marginBottom: '8px' }}>תצוגת תוצאות</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    תצוגה נוחה של הפרקים והתוצאות שנוצרו באמצעות AI
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="card mb-4">
              <h2 className="card-title">דרישות מערכת</h2>
              
              <div className="grid grid-2" style={{ gap: '20px' }}>
                <div>
                  <h4 style={{ color: '#E91E63', marginBottom: '12px' }}>
                    דפדפן נתמך:
                  </h4>
                  <ul style={{ marginRight: '20px' }}>
                    <li>Google Chrome 88+</li>
                    <li>Microsoft Edge 88+</li>
                    <li>Brave Browser</li>
                    <li>דפדפנים אחרים המבוססים על Chromium</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: '#E91E63', marginBottom: '12px' }}>
                    הרשאות נדרשות:
                  </h4>
                  <ul style={{ marginRight: '20px' }}>
                    <li>גישה לאתרי YouTube</li>
                    <li>אחסון מקומי (לשמירת הגדרות)</li>
                    <li>גישה לטאבים פעילים</li>
                    <li>הרצת scripts באתר YouTube</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="card mb-4">
              <h2 className="card-title">שאלות נפוצות על התוסף</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                    האם התוסף בטוח לשימוש?
                  </h4>
                  <p style={{ margin: 0, color: '#666' }}>
                    כן, התוסף פתוח לקוד (open source) ולא אוסף נתונים אישיים. 
                    כל העיבוד נעשה עם תמלילי YouTube ישירות בדפדפן.
                  </p>
                </div>

                <div>
                  <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                    האם התוסף חינמי?
                  </h4>
                  <p style={{ margin: 0, color: '#666' }}>
                    כן, התוסף חינמי לחלוטין. הוא עובד עם תמלילי YouTube הקיימים 
                    ללא צורך במפתחות API חיצוניים.
                  </p>
                </div>

                <div>
                  <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                    איך משנים שפת תמלול?
                  </h4>
                  <p style={{ margin: 0, color: '#666' }}>
                    בתוסף יש בורר שפות שמאפשר לבחור את שפת התמלול המועדפת.
                    השפה נשמרת ותישמר לשימושים הבאים.
                  </p>
                </div>

                <div>
                  <h4 style={{ color: '#E91E63', marginBottom: '8px' }}>
                    מה אם התוסף לא עובד?
                  </h4>
                  <p style={{ margin: 0, color: '#666' }}>
                    ודא שהסרטון כולל תמלילים (כתוביות), רענן את דף ה-YouTube,
                    או נסה סרטון אחר. אם הבעיה נמשכת, 
                    <Link to="/contact" style={{ color: '#E91E63', marginRight: '4px' }}>
                      צור קשר
                    </Link>
                    איתנו.
                  </p>
                </div>
              </div>
            </div>

            {/* Alternative */}
            <div className="card">
              <h2 className="card-title">חלופה - השתמש באתר</h2>
              <p>
                אם אתה מעדיף לא להתקין תוסף, תוכל להשתמש באתר שלנו ישירות. 
                פשוט הדבק קישור YouTube וקבל אותן תוצאות מעולות.
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
                  השתמש באתר
                </Link>
                <Link 
                  to="/about" 
                  className="btn btn-secondary btn-large"
                >
                  למד עוד על השירות
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ExtensionPage;
