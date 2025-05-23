import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #333 0%, #555 100%)',
      color: 'white',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ padding: '60px 20px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{
              color: '#E91E63',
              marginBottom: '20px',
              fontSize: '1.25rem'
            }}>
              YouTube Smart Chapters AI
            </h3>
            <p style={{
              color: '#ccc',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              פלטפורמה מתקדמת ליצירת פרקים חכמים, כותרות ותיאורים לסרטוני YouTube 
              באמצעות בינה מלאכותית מתקדמת של AssemblyAI ו-OpenAI.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <Link
                to="/extension"
                className="btn btn-primary"
                style={{
                  fontSize: '14px',
                  padding: '8px 16px'
                }}
              >
                הורד תוסף Chrome
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '1.1rem'
            }}>
              קישורים מהירים
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/" 
                  style={{
                    color: '#ccc',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#E91E63'}
                  onMouseLeave={(e) => e.target.style.color = '#ccc'}
                >
                  דף הבית
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/process" 
                  style={{
                    color: '#ccc',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#E91E63'}
                  onMouseLeave={(e) => e.target.style.color = '#ccc'}
                >
                  עיבוד סרטון
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/about" 
                  style={{
                    color: '#ccc',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#E91E63'}
                  onMouseLeave={(e) => e.target.style.color = '#ccc'}
                >
                  אודות האתר
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/contact" 
                  style={{
                    color: '#ccc',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#E91E63'}
                  onMouseLeave={(e) => e.target.style.color = '#ccc'}
                >
                  צור קשר
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/settings" 
                  style={{
                    color: '#ccc',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#E91E63'}
                  onMouseLeave={(e) => e.target.style.color = '#ccc'}
                >
                  הגדרות API
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '1.1rem'
            }}>
              תכונות מתקדמות
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#ccc'
            }}>
              <li style={{ marginBottom: '8px' }}>• תמלול מדויק עם AssemblyAI</li>
              <li style={{ marginBottom: '8px' }}>• פרקים אוטומטיים חכמים</li>
              <li style={{ marginBottom: '8px' }}>• יצירת כותרות SEO</li>
              <li style={{ marginBottom: '8px' }}>• תיאורים מותאמים</li>
              <li style={{ marginBottom: '8px' }}>• תגים והאשטגים</li>
              <li style={{ marginBottom: '8px' }}>• תמיכה בעברית ושפות נוספות</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '1.1rem'
            }}>
              יצירת קשר
            </h4>
            <div style={{ color: '#ccc' }}>
              <p style={{ marginBottom: '12px' }}>
                📧 <a 
                  href="mailto:yaskovbs@support-free-to-use-website-builder-and-pluginsai.com" 
                  style={{ color: '#E91E63', textDecoration: 'none' }}
                >
                  yaskovbs@support-free-to-use-website-builder-and-pluginsai.com
                </a>
              </p>
              <p style={{ marginBottom: '12px' }}>
                🌐 <a 
                  href="https://github.com/yaskovbs/YouTube_Smart_Chapters_AI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#E91E63', textDecoration: 'none' }}
                >
                  github.com/yaskovbs/YouTube_Smart_Chapters_AI
                </a>
              </p>
              <p style={{ marginBottom: '12px' }}>
                📱 תוסף Chrome Extensions
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #555',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ color: '#ccc', fontSize: '14px' }}>
            © 2025 YouTube Smart Chapters AI. כל הזכויות שמורות.
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#ccc' }}>
              פותח עם ❤️ באמצעות React, CLINE, AND CLAUDE-SONNET-4-2025-05-14
            </span>
          </div>
        </div>

        {/* Technical Info */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            האתר והתוסף משתמשים ב-API של AssemblyAI לתמלול מדויק ו-OpenAI לניתוח תוכן מתקדם.
            כל העיבוד נעשה באמצעות שרת מאובטח ונתונים לא נשמרים לאחר העיבוד.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
