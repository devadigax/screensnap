// src/app/api/screenshot/route.js
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Helper: Logic to capture screenshot
async function captureScreenshot(url) {
  if (!url) throw new Error('URL is required');
  
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // Determine Environment
  const isDev = process.env.NODE_ENV === 'development';
  let executablePath = isDev 
    ? (process.platform === 'win32' 
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    : await chromium.executablePath();

  if (isDev && !executablePath) throw new Error("Local Chrome not found");

  const browser = await puppeteer.launch({
    args: isDev ? [] : [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
    
    // Timeout 9s for Vercel Free Tier
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 9000 });
    
    const buffer = await page.screenshot({ type: 'jpeg', quality: 80 });
    await browser.close();
    return buffer;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

// --- HANDLERS ---

// 1. GET Handler (For Browser / Curl)
// Usage: GET /api/screenshot?url=google.com
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    
    const imageBuffer = await captureScreenshot(url);

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*' // Allow other sites to embed your images
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// 2. POST Handler (For Frontend / Secure Apps)
export async function POST(req) {
  try {
    const body = await req.json();
    const imageBuffer = await captureScreenshot(body.url);

    return new Response(imageBuffer, {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}