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
          <Link href="/" className="logo"><span>ScreenSnap.</span></Link>
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
              Send a GET request with the target URL to receive a high-quality JPEG image (1920x1080).
            </p>

            <div className="form-group mb-6">
              <label className="form-label">Endpoint</label>
              <div className="glass" style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--accent)' }}>
                GET /api/screenshot?url={'{website_url}'}
              </div>
            </div>

            <h3 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Smart Waiting (Built-in)</h3>
            <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
              The API automatically waits for the <strong>Network Idle</strong> event. This means it intelligently pauses 
              until the website has finished loading its assets (images, fonts, scripts) before taking the snap. 
              <br/>
              <em>Note: There is a hard timeout of 8.5 seconds to prevent crashes on serverless functions.</em>
            </p>

            <h3 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Avoiding Cached Images</h3>
            <p className="text-muted mb-4">
              To ensure you always get a fresh screenshot (and not a cached version from a CDN), append a unique timestamp 
              parameter (like <code>&t=...</code>) to your request.
            </p>

            <h3 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Terminal Example</h3>
            <div className="mb-6">
              <pre className="glass" style={{ padding: '1.5rem', overflowX: 'auto', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                <code>
{`# Basic Request
curl "https://screensnap.netlify.app/api/screenshot?url=google.com" -o test.jpg

# Force Fresh Capture (Recommended)
curl "https://screensnap.netlify.app/api/screenshot?url=google.com&t=$(date +%s)" -o fresh.jpg`}
                </code>
              </pre>
            </div>

            <h3 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: '600' }}>PHP Integration</h3>
            <p className="text-muted mb-4">
              Example using cURL in PHP to save the image locally.
            </p>
            <div className="mb-6">
              <pre className="glass" style={{ padding: '1.5rem', overflowX: 'auto', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                <code style={{ fontSize: '0.9rem' }}>
{`$url = "https://example.com";
$api = "https://screensnap.netlify.app/api/screenshot?url=" . urlencode($url) . "&t=" . time();

$ch = curl_init($api);
$fp = fopen("screenshot.jpg", "wb");
curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_exec($ch);
curl_close($ch);
fclose($fp);`}
                </code>
              </pre>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}