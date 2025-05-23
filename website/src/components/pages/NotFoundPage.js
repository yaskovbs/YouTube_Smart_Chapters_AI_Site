import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="section">
      <div className="container">
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          textAlign: 'center',
          padding: '60px 20px'
        }}>
          <div style={{
            fontSize: '8rem',
            fontWeight: '700',
            color: '#E91E63',
            marginBottom: '24px',
            lineHeight: '1'
          }}>
            404
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '20px',
            color: '#333'
          }}>
            הדף לא נמצא
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            מצטערים, הדף שחיפשת לא קיים או הועבר למקום אחר.
            אולי תרצה לנסות אחת מהאפשרויות הבאות?
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <Link 
              to="/" 
              className="btn btn-primary btn-large"
            >
              חזור לדף הבית
            </Link>
            
            <Link 
              to="/process" 
              className="btn btn-secondary btn-large"
            >
              התחל עיבוד סרטון
            </Link>
            
            <Link 
              to="/extension" 
              className="btn btn-secondary btn-large"
            >
              הורד תוסף Chrome
            </Link>
          </div>
          
          <div style={{
            padding: '24px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            marginTop: '40px'
          }}>
            <h3 style={{
              color: '#E91E63',
              marginBottom: '16px',
              fontSize: '1.25rem'
            }}>
              מה תוכל לעשות כאן?
            </h3>
            
            <div className="grid grid-2" style={{ gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ 
                  color: '#333', 
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}>
                  🎬 עיבוד סרטונים
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: '#666' 
                }}>
                  הכנס קישור YouTube וקבל פרקים חכמים
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ 
                  color: '#333', 
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}>
                  🔗 תוסף Chrome
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: '#666' 
                }}>
                  הורד תוסף לעבודה ישירה ב-YouTube
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ 
                  color: '#333', 
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}>
                  📖 מידע על השירות
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: '#666' 
                }}>
                  למד איך השירות עובד ומה הוא מציע
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ 
                  color: '#333', 
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}>
                  💬 צור קשר
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: '#666' 
                }}>
                  יש שאלות? אנחנו כאן לעזור
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '40px',
            padding: '20px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#2e7d32'
            }}>
              💡 <strong>טיפ:</strong> אם הגעת לכאן דרך קישור, ייתכן שהוא שגוי או ישן. 
              נסה לחפש במנו הראשי או חזור לדף הבית.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
