# WebSnap 📸

WebSnap is a modern **website screenshot tool** built with **Next.js (App Router)** and **Puppeteer**. It allows users and developers to capture high‑quality screenshots of any public website via a clean UI or a simple API endpoint.

Designed with a glassmorphism dashboard UI, dark/light mode, and Vercel‑friendly Chromium support.

---

## ✨ Features

- 🌐 Capture screenshots of any website
- 🖼️ High‑quality JPEG output (1920×1080)
- ⚡ Fast API using Puppeteer + Chromium
- 🧑‍💻 UI + API (GET & POST)
- 🌙 Light / Dark theme toggle
- 📦 Vercel‑compatible (Sparticuz Chromium)
- ⬇️ One‑click image download

---

## 🧱 Tech Stack

- **Next.js 14+ (App Router)**
- **React (Client Components)**
- **Puppeteer Core**
- **@sparticuz/chromium** (Serverless Chromium)
- **CSS (Glassmorphism UI)**

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js                # Screenshot UI
│   ├── docs/page.js           # API Documentation page
│   └── api/
│       └── screenshot/
│           └── route.js       # Screenshot API (GET + POST)
```

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Run Development Server

```bash
npm run dev
```

Open: **http://localhost:3000**

---

## 🖥️ Web UI Usage

1. Enter a domain or URL (example: `google.com`)
2. Click **Capture Screenshot**
3. Preview the image
4. Download the screenshot

---

## 🔌 API Usage

### ✅ GET (Public / Curl / Browser)

**Endpoint**
```
GET /api/screenshot?url={website_url}
```

**Example**
```bash
curl "http://localhost:3000/api/screenshot?url=google.com" -o screenshot.jpg
```

---

### 🔐 POST (Frontend / Secure Apps)

**Endpoint**
```
POST /api/screenshot
```

**Body**
```json
{
  "url": "google.com"
}
```

**Response**
- `image/jpeg`

---

## ⚙️ Environment Notes

### Development
- Uses **local Chrome installation**
- Path auto‑detected for Windows & macOS

### Production (Vercel)
- Uses `@sparticuz/chromium`
- Optimized for serverless
- 9s timeout safe for free tier

---

## 🛡️ Limitations

- Some websites may block bots or headless browsers
- Auth‑protected or CAPTCHA pages may fail
- Heavy pages may timeout

---

## 📌 Customization Ideas

- Full‑page screenshots
- Mobile viewport capture
- PNG / WebP support
- Screenshot history
- API key & rate limiting

---

## 📄 License

MIT License

---

## 🙌 Credits

Built with ❤️ using Next.js & Puppeteer

---

Happy snapping! 📸

