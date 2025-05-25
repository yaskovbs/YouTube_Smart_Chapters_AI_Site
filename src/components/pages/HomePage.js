import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #E91E63 0%, #FF5722 100%)',
        color: 'white',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="animate-fade-in">
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              marginBottom: '24px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              YouTube Smart Chapters AI
            </h1>
            <p style={{
              fontSize: '1.5rem',
              marginBottom: '40px',
              opacity: 0.9,
              maxWidth: '800px',
              margin: '0 auto 40px'
            }}>
              יצירת פרקים חכמים, כותרות ותיאורים לסרטוני YouTube
              <br />
              באמצעות בינה מלאכותית מתקדמת
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/process" 
                className="btn btn-large"
                style={{
                  backgroundColor: 'white',
                  color: '#E91E63',
                  fontWeight: '600',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                }}
              >
                התחל עכשיו
              </Link>
              <Link 
                to="/extension" 
                className="btn btn-large btn-secondary"
                style={{
                  borderColor: 'white',
                  color: 'white'
                }}
              >
                הורד תוסף Chrome
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>תכונות מתקדמות</h2>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              פלטפורמה מקצועית עם יכולות AI חדישות
            </p>
          </div>
          
          <div className="grid grid-3">
            <div className="card">
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🎵
              </div>
              <h3 className="card-title">תמלול מדויק</h3>
              <p>
                תמלול מתקדם באמצעות AssemblyAI עם דיוק של עד 95%.
                תמיכה מלאה בעברית, אנגלית ושפות נוספות.
              </p>
            </div>

            <div className="card">
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                📚
              </div>
              <h3 className="card-title">פרקים אוטומטיים</h3>
              <p>
                יצירת פרקים חכמים עם חותמות זמן מדויקות.
                זיהוי אוטומטי של נושאים ומעברים בסרטון.
              </p>
            </div>

            <div className="card">
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🎯
              </div>
              <h3 className="card-title">SEO מותאם</h3>
              <p>
                כותרות, תיאורים ותגים מותאמים SEO.
                שיפור הנראות והגילוי של הסרטונים שלך.
              </p>
            </div>

            <div className="card">
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                ⚡
              </div>
              <h3 className="card-title">עיבוד מהיר</h3>
              <p>
                עיבוד מהיר וחכם של סרטונים עד 60 דקות.
                תוצאות מקצועיות תוך דקות ספורות.
              </p>
            </div>

            <div className="card">
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🛡️
              </div>
              <h3 className="card-title">פרטיות מלאה</h3>
              <p>
                נתונים לא נשמרים על השרת לאחר העיבוד.
                הגנה מלאה על הפרטיות והתוכן שלך.
              </p>
            </div>

            <div className="card">
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🔗
              </div>
              <h3 className="card-title">אינטגרציה קלה</h3>
              <p>
                תוסף Chrome ואתר web למקסימום נוחות.
                העתקה ישירה ל-YouTube Studio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="section-title">
            <h2>איך זה עובד?</h2>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              4 שלבים פשוטים לפרקים מושלמים
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#E91E63',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '600',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <h3 style={{ marginBottom: '8px', color: '#E91E63' }}>
                  הכנס קישור YouTube
                </h3>
                <p style={{ margin: 0, color: '#666' }}>
                  הדבק את הקישור לסרטון YouTube שלך
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#FF5722',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '600',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <h3 style={{ marginBottom: '8px', color: '#FF5722' }}>
                  AI מתמלל ומנתח
                </h3>
                <p style={{ margin: 0, color: '#666' }}>
                  AssemblyAI מתמלל ו-OpenAI מנתח את התוכן
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '600',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <h3 style={{ marginBottom: '8px', color: '#4CAF50' }}>
                  יצירת פרקים וכותרות
                </h3>
                <p style={{ margin: 0, color: '#666' }}>
                  יצירה אוטומטית של פרקים, כותרות ותיאורים
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#2196F3',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '600',
                flexShrink: 0
              }}>
                4
              </div>
              <div>
                <h3 style={{ marginBottom: '8px', color: '#2196F3' }}>
                  העתק ל-YouTube
                </h3>
                <p style={{ margin: 0, color: '#666' }}>
                  העתק את התוצאות ישירות ל-YouTube Studio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container text-center">
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{
              color: '#E91E63',
              marginBottom: '20px'
            }}>
              מוכן להתחיל?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              marginBottom: '40px'
            }}>
              הפוך את סרטוני ה-YouTube שלך למקצועיים יותר עם פרקים חכמים וכותרות מותאמות SEO
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/process" 
                className="btn btn-primary btn-large"
              >
                נסה עכשיו בחינם
              </Link>
              <Link 
                to="/about" 
                className="btn btn-secondary btn-large"
              >
                למד עוד
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="grid grid-3 text-center">
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#E91E63',
                marginBottom: '8px'
              }}>
                95%
              </div>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                דיוק תמלול
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#FF5722',
                marginBottom: '8px'
              }}>
                60
              </div>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                דקות סרטון מקסימום
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#4CAF50',
                marginBottom: '8px'
              }}>
                7
              </div>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                שפות נתמכות
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
