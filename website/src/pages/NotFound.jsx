import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#e8e8e8',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px'
    }}>
      {/* Faded background 404 */}
      <div style={{
        position: 'absolute',
        fontSize: '400px',
        fontWeight: '900',
        color: 'rgba(200, 180, 180, 0.15)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        lineHeight: '1',
        zIndex: 0,
        whiteSpace: 'nowrap'
      }}>
        404
      </div>

      {/* Content */}
      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '600',
          color: '#333',
          margin: '0 0 20px 0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#999',
          margin: '0 0 40px 0',
          lineHeight: '1.6',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          Duis dolor sit amet, consectetur adipiscing elit vestibulum in pharitra.
        </p>

        <Link
          to="/"
          style={{
            background: '#ff5722',
            color: '#fff',
            padding: '14px 40px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#ff6f42';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 87, 34, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#ff5722';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(255, 87, 34, 0.3)';
          }}
        >
          Go To Home →
        </Link>
      </div>
    </div>
  );
};

export default NotFound;