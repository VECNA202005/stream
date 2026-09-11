# Cloud-Diary ☁️

Cloud-Diary is a frontend-first web application for personal diaries: users sign up, schedule calendar events, launch instant Jitsi video meetings per event, and save personal notes backed by **Supabase Auth** and **Postgres Row Level Security (RLS)**.

---

## 🚀 Quick Vercel Deployment

1. **Push to GitHub**: Push this repository to your GitHub account.
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your repository.
   - Set **Root Directory** to `web`.
   - Add Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://<your-project-ref>.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_key_here`
   - Click **Deploy**!

---

## 🗄️ Supabase Database Setup & RLS

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and run the contents of [`web/supabase/schema.sql`](file:///c:/Users/GOKUL/Downloads/stream/web/supabase/schema.sql).

This automatically creates the `events` and `notes` tables, indexes, and applies strict per-user Row Level Security (RLS) policies:
```sql
-- SELECT, INSERT, UPDATE, DELETE policies enforce auth.uid() = owner
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
```

---

## 🛠️ Local Development

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Run dev server
npm run dev

# Run build verification
npm run build
```

---

## 📁 Architecture Overview

```
web/
├── app/
│   ├── globals.css         # Tailwind CSS directives & glassmorphism theme
│   ├── layout.jsx          # Root layout shell
│   └── page.jsx            # Main app container (Auth, Calendar, Notes, Jitsi)
├── components/
│   ├── Auth/
│   │   └── AuthModal.jsx   # Supabase signUp & signInWithPassword
│   ├── Calendar/
│   │   └── CalendarView.jsx # Monthly calendar, date click event creation
│   ├── Meeting/
│   │   └── JitsiModal.jsx  # Embedded meet.jit.si iframe per event ID
│   └── Notes/
│       └── NotesView.jsx   # Personal diary notes with search & RLS binding
├── lib/
│   └── supabaseClient.js   # Supabase JS client with local fallback preview
├── supabase/
│   └── schema.sql          # SQL migration script for tables & RLS policies
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```
