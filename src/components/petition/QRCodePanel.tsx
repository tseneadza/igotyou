'use client'

import { useState, useCallback } from 'react'
import { QRCode } from 'react-qr-code'
import { Download, Copy, Check, Printer, Share2 } from 'lucide-react'
import { Button } from '@/components/ui'

interface QRCodePanelProps {
  petitionSlug: string
  petitionTitle: string
  baseUrl?: string
}

export function QRCodePanel({
  petitionSlug,
  petitionTitle,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
}: QRCodePanelProps) {
  const [copied, setCopied] = useState(false)
  
  const petitionUrl = `${baseUrl}/p/${petitionSlug}?ref=qr`
  const shareUrl = `${baseUrl}/p/${petitionSlug}?ref=share`
  
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [shareUrl])
  
  const handleDownloadPNG = useCallback(() => {
    const svg = document.getElementById('petition-qr-code')
    if (!svg) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 800
    canvas.height = 800
    
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      
      const pngUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${petitionSlug}-qr-code.png`
      link.href = pngUrl
      link.click()
    }
    
    img.src = url
  }, [petitionSlug])
  
  const handleDownloadSVG = useCallback(() => {
    const svg = document.getElementById('petition-qr-code')
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.download = `${petitionSlug}-qr-code.svg`
    link.href = url
    link.click()
    
    URL.revokeObjectURL(url)
  }, [petitionSlug])
  
  const handlePrintFlyer = useCallback(() => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    const svg = document.getElementById('petition-qr-code')
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>IGotYou - ${petitionTitle}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 2rem;
              text-align: center;
            }
            .logo { font-size: 3rem; margin-bottom: 1rem; }
            .title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; max-width: 400px; }
            .subtitle { color: #666; margin-bottom: 2rem; }
            .qr { margin: 2rem 0; }
            .url { font-size: 0.875rem; color: #666; word-break: break-all; max-width: 300px; }
            .cta { font-size: 1.25rem; font-weight: 600; color: #2563eb; margin-top: 2rem; }
          </style>
        </head>
        <body>
          <div class="logo">✊</div>
          <h1 class="title">${petitionTitle}</h1>
          <p class="subtitle">Scan to sign this petition</p>
          <div class="qr">${svgData}</div>
          <p class="url">${shareUrl}</p>
          <p class="cta">I Got You. Sign today.</p>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }, [petitionTitle, shareUrl])
  
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: petitionTitle,
          text: `Sign this petition: ${petitionTitle}`,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      handleCopyLink()
    }
  }, [petitionTitle, shareUrl, handleCopyLink])
  
  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
        Share Your Petition
      </h3>
      
      {/* QR Code */}
      <div className="flex justify-center p-6 bg-white rounded-lg border border-gray-100 mb-6">
        <QRCode
          id="petition-qr-code"
          value={petitionUrl}
          size={200}
          level="M"
          fgColor="#1e293b"
          bgColor="#ffffff"
        />
      </div>
      
      {/* URL display */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-6">
        <code className="flex-1 text-sm text-gray-600 truncate">
          {shareUrl}
        </code>
        <button
          onClick={handleCopyLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownloadPNG}
          leftIcon={<Download className="w-4 h-4" />}
        >
          PNG
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownloadSVG}
          leftIcon={<Download className="w-4 h-4" />}
        >
          SVG
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrintFlyer}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print Flyer
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleShare}
          leftIcon={<Share2 className="w-4 h-4" />}
        >
          Share
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Perfect for break room flyers, email signatures, and more!
      </p>
    </div>
  )
}
