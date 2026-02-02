// src/app/docs/page.js
'use client';

import Link from 'next/link';

export default function Docs() {
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
          <Link href="/" className="logo"><span>WebSnap.</span></Link>
          <div className="sidebar-links mt-4">
            <div className="nav-section-label">Tools</div>
            <Link href="/">Screenshot Tool</Link>
            <div className="nav-section-label">Resources</div>
            <Link href="/docs" className="active">API Documentation</Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="tool-header-card">
          <div className="header-info">
            <h1 className="card-title">API Documentation</h1>
            <p className="card-desc">Integrate powerful website screenshots into your applications.</p>
          </div>
        </div>

        <div className="tool-grid-layout">
          <div className="content-box" style={{ gridColumn: 'span 2' }}>
            
            <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Quick Start</h2>
            <p className="text-muted mb-4">
              Send a GET request with the target URL to receive a JPEG image.
            </p>

            <div className="form-group mb-6">
              <label className="form-label">Endpoint</label>
              <div className="glass" style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--accent)' }}>
                GET /api/screenshot?url={'{website_url}'}
              </div>
            </div>

            <h3 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Terminal Example</h3>
            <div className="mb-6">
              <pre className="glass" style={{ padding: '1.5rem', overflowX: 'auto', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                <code>
{`curl "https://screensnap.netlify.app/api/screenshot?url=google.com" -o test.jpg`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}