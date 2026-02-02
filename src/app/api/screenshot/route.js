import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Helper to find local Chrome on Windows/Mac
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
  
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;
  
  const isDev = process.env.NODE_ENV === 'development';
  let executablePath;

  if (isDev) {
    executablePath = getLocalExecutablePath();
    if (!executablePath) throw new Error("Local Chrome not found");
  } else {
    // NETLIFY FIX:
    // We pass a URL to 'executablePath'. This tells the library to download 
    // the binary to /tmp at runtime, bypassing the "input directory" error.
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
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set User Agent to look like a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
    
    // Timeout logic (Netlify has a 10s limit on free tier functions!)
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 8500 });
    
    const buffer = await page.screenshot({ type: 'jpeg', quality: 80 });
    await browser.close();
    return buffer;

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

// GET Handler
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const imageBuffer = await captureScreenshot(url);

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST Handler
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