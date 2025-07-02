import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FB Tracker Pro',
  description: 'FB Tracker Pro By Ayman Abdelkawy',
  keywords: 'Facebook, Tracker, Analytics, Social Media Monitoring',
  author: 'Ayman Abdelkawy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}