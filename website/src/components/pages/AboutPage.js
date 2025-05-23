import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
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
            אודות YouTube Smart Chapters AI
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            פלטפורמה מתקדמת המשלבת בינה מלאכותית חדישה 
            ליצירת תוכן מקצועי לסרטוני YouTube
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Introduction */}
            <div className="card mb-4">
              <h2 className="card-title">מה זה YouTube Smart Chapters AI?</h2>
              <p>
                YouTube Smart Chapters AI הוא כלי מתקדם המשתמש בטכנולוגיות בינה מלאכותית 
                חדישות ביותר כדי לעזור ליוצרי תוכן ב-YouTube ליצור פרקים חכמים, כותרות 
                מותאמות SEO, תיאורים מפורטים ותגים רלוונטיים לסרטונים שלהם.
              </p>
              <p>
                הפלטפורמה שלנו מבוססת על שילוב של <strong>AssemblyAI</strong> לתמלול 
                מדויק ו-<strong>OpenAI GPT</strong> לניתוח תוכן וייצור טקסט איכותי, 
                ומספקת פתרון מקצועי ומהיר ליוצרי תוכן בכל הרמות.
              </p>
            </div>

            {/* Key Features */}
            <div className="card mb-4">
              <h2 className="card-title">התכונות העיקריות</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    flexShrink: 0
                  }}>
                    🎵
                  </div>
                  <div>
                    <h3 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      תמלול מתקדם עם AssemblyAI
                    </h3>
                    <p style={{ margin: 0, color: '#666' }}>
                      משתמשים בטכנולוגיית AssemblyAI המתקדמת לתמלול מדויק של סרטונים 
                      בדיוק של עד 95%. התמיכה כוללת עברית, אנגלית, ערבית, רוסית, 
                      אוקראינית, צרפתית, ספרדית וגרמנית.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    flexShrink: 0
                  }}>
                    📚
                  </div>
                  <div>
                    <h3 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      פרקים אוטומטיים חכמים
                    </h3>
                    <p style={{ margin: 0, color: '#666' }}>
                      יצירה אוטומטית של פרקים עם חותמות זמן מדויקות. המערכת מזהה 
                      אוטומטית מעברים בין נושאים, שינויי רגש ונקודות מפתח בסרטון 
                      ליצירת פרקים משמעותיים.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    flexShrink: 0
                  }}>
                    🎯
                  </div>
                  <div>
                    <h3 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      תוכן מותאם SEO
                    </h3>
                    <p style={{ margin: 0, color: '#666' }}>
                      יצירת כותרות, תיאורים ותגים מותאמים לאלגוריתם של YouTube. 
                      המערכת מנתחת את התוכן ויוצרת מטא-נתונים שמשפרים את הנראות 
                      והגילוי של הסרטונים שלכם.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    flexShrink: 0
                  }}>
                    🔗
                  </div>
                  <div>
                    <h3 style={{ color: '#E91E63', marginBottom: '8px' }}>
                      אינטגרציה מושלמת
                    </h3>
                    <p style={{ margin: 0, color: '#666' }}>
                      זמין הן כאתר web והן כתוסף Chrome למקסימום נוחות. 
                      העתקה ישירה ל-YouTube Studio בלחיצה אחת.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Technology Stack */}
            <div className="card mb-4">
              <h2 className="card-title">הטכנולוגיות שלנו</h2>
              
              <div className="grid grid-2" style={{ gap: '24px' }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#1976d2', marginBottom: '12px' }}>
                    AssemblyAI
                  </h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    פלטפורמת תמלול מתקדמת עם דיוק גבוה ותמיכה בפרקים אוטומטיים. 
                    מספקת תמלול מהיר ומדויק עם זיהוי רגשות ונושאים.
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#2e7d32', marginBottom: '12px' }}>
                    OpenAI GPT-4
                  </h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    מודל בינה מלאכותית מתקדם לניתוח תוכן, יצירת כותרות, 
                    תיאורים ותגים מותאמים לכל סרטון בצורה אישית.
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#fff3e0',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#f57c00', marginBottom: '12px' }}>
                    React & Node.js
                  </h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    ממשק משתמש מתקדם ושרת מהיר ויציב המבטיחים חוויית 
                    משתמש חלקה ועיבוד מהיר של הנתונים.
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#fce4ec',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#c2185b', marginBottom: '12px' }}>
                    Chrome Extension
                  </h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    תוסף Chrome מתקדם המשתלב ישירות עם YouTube 
                    ומאפשר עיבוד מהיר מתוך הדפדפן.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="card mb-4">
              <h2 className="card-title">איך זה עובד?</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
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
                    <h4 style={{ margin: '0 0 4px', color: '#E91E63' }}>
                      הכנסת קישור הסרטון
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      המשתמש מכניס קישור לסרטון YouTube שרוצה לעבד
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
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
                    <h4 style={{ margin: '0 0 4px', color: '#FF5722' }}>
                      הורדה ותמלול
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      המערכת מורידה את הסרטון ושולחת אותו ל-AssemblyAI לתמלול מדויק
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
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
                    <h4 style={{ margin: '0 0 4px', color: '#4CAF50' }}>
                      ניתוח תוכן מתקדם
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      OpenAI מנתח את התמלול ומזהה נושאים, מעברים ונקודות מפתח
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
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
                    <h4 style={{ margin: '0 0 4px', color: '#2196F3' }}>
                      יצירת תוכן מקצועי
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      המערכת יוצרת פרקים, כותרות, תיאורים ותגים מותאמים אישית
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#9C27B0',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    5
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#9C27B0' }}>
                      העתקה ל-YouTube
                    </h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      המשתמש מעתיק את התוצאות ל-YouTube Studio בלחיצה אחת
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="card mb-4">
              <h2 className="card-title">פרטיות ואבטחה</h2>
              <p>
                אנחנו מחויבים להגנה על הפרטיות שלכם. כל הסרטונים והנתונים 
                מעובדים באופן מאובטח ו<strong>לא נשמרים</strong> על השרתים שלנו 
                לאחר סיום העיבוד.
              </p>
              
              <div className="grid grid-2" style={{ gap: '20px', marginTop: '20px' }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#2e7d32', marginBottom: '8px' }}>
                    🔒 עיבוד מאובטח
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    כל הנתונים מועברים בצורה מוצפנת ומעובדים בשרתים מאובטחים
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#1976d2', marginBottom: '8px' }}>
                    🗑️ מחיקה אוטומטית
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    כל הקבצים נמחקים אוטומטית לאחר 24 שעות מהעיבוד
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#fff3e0',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f57c00', marginBottom: '8px' }}>
                    🔑 מפתחות אישיים
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    אפשרות להשתמש במפתחות API אישיים לשליטה מלאה
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#fce4ec',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#c2185b', marginBottom: '8px' }}>
                    🛡️ ללא מעקב
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    אנחנו לא עוקבים או מאחסנים נתוני שימוש אישיים
                  </p>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="card">
              <h2 className="card-title">מוכנים להתחיל?</h2>
              <p>
                בחרו את הדרך הנוחה לכם - השתמשו באתר ישירות או הורידו את 
                התוסף לחוויה מלאה יותר בתוך YouTube.
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
                  to="/extension" 
                  className="btn btn-secondary btn-large"
                >
                  הורד תוסף Chrome
                </Link>
                <Link 
                  to="/contact" 
                  className="btn btn-secondary btn-large"
                >
                  צור קשר
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
