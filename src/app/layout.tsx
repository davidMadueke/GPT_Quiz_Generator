import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GPT Quiz Generator',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={
        cn(inter.className, "antialiased, min-h-screen, pt-16")
      }
      suppressHydrationWarning={true}>
        <Providers>
        <div className='min-h-screen relative '>
        <Navbar />
        {children}
        </div>
        <Toaster />
        </Providers>
      </body>
    </html>
  )
}
