import './globals.css';

export const metadata = {
  title: 'Cloud-Diary — Personal Diary, Calendar & Jitsi Meetings',
  description: 'Frontend-first web app for personal diaries, calendar event scheduling, Jitsi video calls, and personal notes backed by Supabase Auth & Postgres RLS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#090d16] text-gray-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
