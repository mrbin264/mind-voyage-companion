import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mind Voyage Companion',
  description:
    'A privacy-first habit tracking and journaling application designed to help users build consistent routines, engage in reflective writing with Stoic-inspired prompts, and improve their English through journal-based language learning.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var initialTheme = theme || systemTheme;
                  document.documentElement.classList.add(initialTheme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="min-h-screen bg-[var(--mv-color-bg)] text-[var(--mv-color-text)]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
