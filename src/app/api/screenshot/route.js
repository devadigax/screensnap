import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const getLocalExecutablePath = () => {
  if (process.platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (process.platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }
  return null;
};

async function captureScreenshot(url) {
  if (!url) throw new Error('URL is required');
  
  // Ensure protocol
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;
  
  const isDev = process.env.NODE_ENV === 'development';
  let executablePath;

  if (isDev) {
    executablePath = getLocalExecutablePath();
    if (!executablePath) throw new Error("Local Chrome not found");
  } else {
    executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar"
    );
  }

  const browser = await puppeteer.launch({
    args: isDev ? [] : [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await browser.newPage();
    
    // Set 1080p viewport
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
    
    // --- SMART WAIT LOGIC ---
    // 'networkidle2' = Wait until there are no more than 2 network connections for at least 500ms.
    // This detects when the page is "visually ready" without waiting for every single background tracking script.
    // We set a 20s timeout as a safety net.
    await page.goto(targetUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 20000 
    });
    
    const buffer = await page.screenshot({ type: 'jpeg', quality: 80 });
    await browser.close();
    return buffer;

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    
    const imageBuffer = await captureScreenshot(url);

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        // CRITICAL: Force no caching so you never get a stale "Google" image
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const imageBuffer = await captureScreenshot(body.url);
    return new Response(imageBuffer, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}