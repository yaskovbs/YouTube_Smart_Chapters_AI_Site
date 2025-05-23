import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #E91E63 0%, #FF5722 100%)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'white'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            marginLeft: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
              <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="white"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>
            YouTube Smart Chapters AI
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: window.innerWidth > 768 ? 'flex' : 'none',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Link 
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease',
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
          >
            בית
          </Link>
          <Link 
            to="/process" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease',
              backgroundColor: isActive('/process') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
          >
            עיבוד סרטון
          </Link>
          <Link 
            to="/about" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease',
              backgroundColor: isActive('/about') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
          >
            אודות
          </Link>
          <Link 
            to="/contact" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease',
              backgroundColor: isActive('/contact') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
          >
            צור קשר
          </Link>
          <Link 
            to="/settings" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease',
              backgroundColor: isActive('/settings') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
          >
            ⚙️ הגדרות
          </Link>
          <Link 
            to="/extension" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            הורד תוסף
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          style={{
            display: window.innerWidth <= 768 ? 'block' : 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          padding: '16px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="container">
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}
              >
                בית
              </Link>
              <Link 
                to="/process" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/process') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}
              >
                עיבוד סרטון
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/about') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}
              >
                אודות
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/contact') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}
              >
                צור קשר
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive('/settings') ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}
              >
                ⚙️ הגדרות
              </Link>
              <Link 
                to="/extension" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                הורד תוסף
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
