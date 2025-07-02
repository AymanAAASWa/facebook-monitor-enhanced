import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FB Tracker Pro',
  description: 'FB Tracker Pro By Ayman Abdelkawy - Professional Facebook Analytics & Monitoring Tool',
  keywords: 'Facebook, Tracker, Analytics, Social Media Monitoring, FB Tracker Pro',
  author: 'Ayman Abdelkawy - +201003465095',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full m-0 p-0">{children}</body>
    </html>
  )
}