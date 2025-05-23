import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('אנא מלא את כל השדות הנדרשים');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('אנא הכנס כתובת אימייל תקינה');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate form submission (in real app, send to backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      setError('שגיאה בשליחת ההודעה. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="section">
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div className="card">
              <div style={{
                fontSize: '4rem',
                marginBottom: '24px'
              }}>
                ✅
              </div>
              <h1 style={{ color: '#4CAF50', marginBottom: '16px' }}>
                ההודעה נשלחה בהצלחה!
              </h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '24px', color: '#666' }}>
                תודה שפנית אלינו. נחזור אליך בהקדם האפשרי.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-primary"
                >
                  שלח הודעה נוספת
                </button>
                <Link to="/" className="btn btn-secondary">
                  חזור לדף הבית
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            צור קשר
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            יש לך שאלות? צריך עזרה? רוצה להציע שיפורים?
            <br />
            אנחנו כאן בשבילך!
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '40px', alignItems: 'flex-start' }}>
            
            {/* Contact Form */}
            <div className="card">
              <h2 className="card-title">שלח לנו הודעה</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    סוג הפנייה
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-input"
                    disabled={isSubmitting}
                  >
                    <option value="general">פנייה כללית</option>
                    <option value="support">תמיכה טכנית</option>
                    <option value="bug">דיווח על באג</option>
                    <option value="feature">הצעה לתכונה חדשה</option>
                    <option value="business">פנייה עסקית</option>
                    <option value="api">שאלות לגבי API</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="הכנס את שמך המלא"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    כתובת אימייל *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    נושא
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="על מה תרצה לדבר?"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    הודעה *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="כתב כאן את ההודעה שלך..."
                    rows="6"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary btn-large ${isSubmitting ? 'btn-disabled' : ''}`}
                  style={{ width: '100%' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner" style={{ marginLeft: '8px' }}></span>
                      שולח...
                    </>
                  ) : (
                    'שלח הודעה'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info & FAQ */}
            <div>
              {/* Contact Information */}
              <div className="card mb-4">
                <h3 className="card-title">פרטי יצירת קשר</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📧</span>
                    <div>
                      <strong>אימייל:</strong>
                      <br />
                      <a href="mailto:yaskovbs@support-free-to-use-website-builder-and-pluginsai.com" style={{ color: '#E91E63' }}>
                        yaskovbs@support-free-to-use-website-builder-and-pluginsai.com
                      </a>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🌐</span>
                    <div>
                      <strong>GitHub:</strong>
                      <br />
                      <a 
                        href="https://github.com/yaskovbs/YouTube_Smart_Chapters_AI" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#E91E63' }}
                      >
                        github.com/yaskovbs/YouTube_Smart_Chapters_AI
                      </a>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🔧</span>
                    <div>
                      <strong>תוסף Chrome:</strong>
                      <br />
                      <Link to="/extension" style={{ color: '#E91E63' }}>
                        הורד ותתקן מהדף שלנו
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="card">
                <h3 className="card-title">שאלות נפוצות</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px', fontSize: '1rem' }}>
                      כמה זמן לוקח לעבד סרטון?
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      בדרך כלל 2-5 דקות, תלוי באורך הסרטון ובמורכבות התוכן.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px', fontSize: '1rem' }}>
                      האם הנתונים שלי נשמרים?
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      לא, כל הנתונים נמחקים אוטומטית לאחר 24 שעות מהעיבוד.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px', fontSize: '1rem' }}>
                      איך אני מגדיר API keys?
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      בתוסף או באתר, לחץ על "הגדרות" והכנס את המפתחות שלך.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px', fontSize: '1rem' }}>
                      איזה שפות נתמכות?
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      עברית, אנגלית, ערבית, רוסית, אוקראינית, צרפתית, ספרדית וגרמנית.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ color: '#E91E63', marginBottom: '8px', fontSize: '1rem' }}>
                      מה אם יש לי בעיה טכנית?
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      שלח לנו הודעה עם פרטי הבעיה ואנחנו נעזור לפתור במהירות.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                  <h4 style={{ color: '#2e7d32', marginBottom: '8px', fontSize: '1rem' }}>
                    💡 טיפ מהיר
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    לפני שאתה פונה אלינו, נסה לבדוק שהשרת פועל (localhost:8000) 
                    ושמפתחות ה-API מוגדרים נכון.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="section">
            <div className="card">
              <h2 className="card-title text-center">משאבים נוספים</h2>
              
              <div className="grid grid-3" style={{ gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📖</div>
                  <h3 style={{ marginBottom: '12px' }}>מדריך השימוש</h3>
                  <p style={{ marginBottom: '16px', color: '#666' }}>
                    מדריך מפורט לשימוש באתר ובתוסף
                  </p>
                  <Link to="/about" className="btn btn-secondary">
                    קרא עוד
                  </Link>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
                  <h3 style={{ marginBottom: '12px' }}>התחל עכשיו</h3>
                  <p style={{ marginBottom: '16px', color: '#666' }}>
                    עבד את הסרטון הראשון שלך עכשיו
                  </p>
                  <Link to="/process" className="btn btn-primary">
                    התחל עיבוד
                  </Link>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔗</div>
                  <h3 style={{ marginBottom: '12px' }}>תוסף Chrome</h3>
                  <p style={{ marginBottom: '16px', color: '#666' }}>
                    הורד והתקן את התוסף לנוחות מקסימלית
                  </p>
                  <Link to="/extension" className="btn btn-secondary">
                    הורד תוסף
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
