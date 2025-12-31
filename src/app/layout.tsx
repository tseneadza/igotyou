import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'IGotYou - Workplace Petition Platform',
  description: 'AI-powered petition platform for workplace advocacy. Create compelling petitions, build solidarity, and drive change.',
  keywords: ['petition', 'workplace', 'advocacy', 'employee rights', 'solidarity'],
  openGraph: {
    title: 'IGotYou - Workplace Petition Platform',
    description: 'AI-powered petition platform for workplace advocacy',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  )
}
