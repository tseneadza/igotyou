import type { Metadata } from 'next'
import { Instrument_Sans, Archivo_Black } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const archivoBlack = Archivo_Black({
  variable: '--font-clash',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
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
      <body className={`${instrumentSans.variable} ${archivoBlack.variable} font-sans antialiased`}>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  )
}
