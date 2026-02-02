import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Standard Chromium Path (will be set by Dockerfile)
// If running locally on Mac/Windows, Puppeteer finds it automatically.
const getExecutablePath = () => {
  return process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
};

async function captureScreenshot(url) {
  if (!url) throw new Error('URL is required');
  
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;

  // Launch Standard Chrome
  // 'no-sandbox' is required for running inside Docker
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    executablePath: getExecutablePath(),
    headless: 'new',
  });

  try {
    const page = await browser.newPage();
    
    // Set 1080p Viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set Standard User Agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

    // --- SMART WAIT & TIMEOUT LOGIC ---
    try {
        // Attempt to wait for Network Idle (best quality)
        // Timeout is set to 15 seconds. Render allows this (unlike Netlify).
        await page.goto(targetUrl, { 
            waitUntil: 'networkidle2', 
            timeout: 15000 
        });
    } catch (e) {
        // If 15s passes, don't crash. Just log it and take the photo anyway.
        console.log(`Timeout loading ${targetUrl}, taking partial screenshot.`);
    }

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
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Handler
export async function POST(req) {
  try {
    const body = await req.json();
    const imageBuffer = await captureScreenshot(body.url);
    return new Response(imageBuffer, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}