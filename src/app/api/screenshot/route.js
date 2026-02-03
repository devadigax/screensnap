import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

const getExecutablePath = () => {
  return process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
};

async function captureScreenshot(url) {
  if (!url) throw new Error('URL is required');
  
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage', // Critical for Docker/Render
      '--disable-gpu',           // Save CPU/RAM
      '--no-first-run',
      '--no-zygote',
      '--single-process',        // More stable on low-memory containers
      '--hide-scrollbars',
      '--mute-audio'
    ],
    executablePath: getExecutablePath(),
    headless: 'new',
  });

  try {
    const page = await browser.newPage();
    
    // REDUCED RESOLUTION (720p)
    // 1920x1080 is too heavy for Free Tier RAM (512MB)
    await page.setViewport({ width: 1280, height: 720 });
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

    // --- SPEED OPTIMIZATION ---
    try {
        // 'domcontentloaded' fires as soon as HTML is parsed. 
        // Much faster than 'networkidle2'.
        await page.goto(targetUrl, { 
            waitUntil: 'domcontentloaded', 
            timeout: 10000 
        });

        // Optional: Small buffer to let critical images render
        // This is safer/faster than waiting for ALL network traffic
        await new Promise(r => setTimeout(r, 2000));

    } catch (e) {
        console.log(`Timeout loading ${targetUrl}, taking partial screenshot.`);
    }

    // Lower quality (70) speeds up encoding and transfer
    const buffer = await page.screenshot({ type: 'jpeg', quality: 70 });
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const imageBuffer = await captureScreenshot(body.url);
    return new Response(imageBuffer, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}