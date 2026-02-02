// src/app/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link'; // Import Link for navigation

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const handleCapture = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setImageSrc(null);

    try {
      const res = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error('Failed to capture');

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageSrc(objectUrl);
    } catch (err) {
      setError('Could not capture website. It might be blocking bots or timing out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Background Blobs */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Sidebar */}
      <aside className="sidebar glass">
        <div>
          <Link href="/" className="logo"><span>ScreenSnap.</span></Link>
          <div className="sidebar-links mt-4">
            <div className="nav-section-label">Tools</div>
            <Link href="/" className="active">Screenshot Tool</Link>
            
            {/* Link to the Docs Page */}
            <div className="nav-section-label">Resources</div>
            <Link href="/docs">API Documentation</Link>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="tool-header-card">
          <div className="header-info">
            <h1 className="card-title" style={{ fontSize: '2rem' }}>Website Screenshot</h1>
            <p className="card-desc">Enter a domain to capture a high-quality screenshot.</p>
          </div>
        </div>

        <div className="tool-grid-layout">
          <div className="content-box">
            <div className="form-group mb-4">
              <label className="form-label">Target URL</label>
              <div className="input-group">
                <span className="input-icon">🌐</span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
                />
              </div>
            </div>

            <button 
              className="btn btn-primary mb-4" 
              style={{ width: '100%' }}
              onClick={handleCapture}
              disabled={loading}
            >
              {loading ? 'Capturing...' : 'Capture Screenshot'}
            </button>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <div className="screenshot-container glass" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {!imageSrc && !loading && <span className="text-muted">Screenshot will appear here</span>}
              {loading && <div className="loader"></div>}
              {imageSrc && (
                <img src={imageSrc} className="screenshot-result" alt="Screenshot" style={{ maxWidth: '100%', borderRadius: '8px' }} />
              )}
            </div>
            
            {imageSrc && (
              <div className="mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
                 <a href={imageSrc} download="screenshot.jpg" className="btn btn-primary">Download Image</a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}