# CinemaMeet - Google Meet Watch Party & Movie Stream Platform

CinemaMeet is a modern, real-time Web Application designed for friends to video call each other (Google Meet style), stream movies with zero lag, and manage a shared movie watch party schedule calendar.

---

## 🌟 Key Features

1. **Persistent Authentication ("Always Signed In")**:
   - Signup and Login system using `localStorage` persistence.
   - Once signed in, users never need to log in repeatedly when returning to stream movies.

2. **Google Meet Style Video & Audio Calling**:
   - WebRTC audio/video grid with camera toggle, mic mute/unmute, participant badges, and speaking indicators.
   - **Zero-Lag Screen Sharing**: Stream Netflix, Disney+, YouTube, or any desktop app window directly into the room.

3. **Synchronized Movie Stream Engine**:
   - Synchronized HTML5 video player with frame-accurate drift compensation (<150ms latency).
   - Supports local MP4/WebM files, custom stream URLs, and curated demo videos.
   - Synchronized Play, Pause, and Seek broadcasting across all connected peers.

4. **Movie Schedule Calendar**:
   - Interactive calendar grid showing scheduled movie nights.
   - Add new watch parties with title, date, time, genre, and room codes.
   - One-click join buttons directly from calendar day cells.

---

## 🚀 How to Host & Deploy Online (Free Web Hosting)

CinemaMeet is built to be **100% static-host ready** without requiring a backend server.

### 1. Deploy on Vercel (Recommended - 1 Minute Setup)
1. Push this repository to **GitHub**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Click **Deploy**! Vercel automatically detects Vite and uses the included `vercel.json` for single-page application routing.

### 2. Deploy on Netlify
1. Push code to **GitHub**.
2. Log into [netlify.com](https://netlify.com) and click **"Add new site" -> "Import an existing project"**.
3. Select your repository. Netlify will automatically read `netlify.toml` (`command: npm run build`, `publish: dist`).
4. Click **Deploy Site**!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production Build
npm run build
```

---

## 🛠️ Project Architecture

```
stream/
├── index.html                 # Main entry HTML
├── vite.config.js             # Vite configuration
├── vercel.json                # Vercel deployment rewrite rules
├── netlify.toml               # Netlify deployment configuration
├── src/
│   ├── index.css              # Glassmorphism design tokens & styles
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root app container & views
│   ├── context/
│   │   ├── AuthContext.jsx    # Persistent auth state (localStorage)
│   │   └── RoomContext.jsx    # WebRTC real-time sync & room state
│   └── components/
│       ├── Auth/              # Auth modal & avatar selector
│       ├── Calendar/          # Interactive movie calendar
│       ├── Chat/              # Real-time room chat drawer
│       ├── Meet/              # Google Meet video grid & controls
│       ├── Navigation/        # Top navbar & user badge
│       └── Stream/            # Synced low-lag movie player
```
