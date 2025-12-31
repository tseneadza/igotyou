import QRCode from 'qrcode'

/**
 * Generate a QR code as a data URL (base64 PNG)
 */
export async function generateQRCodeDataURL(
  petitionSlug: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): Promise<string> {
  const url = `${baseUrl}/p/${petitionSlug}?ref=qr`
  
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: '#1a1a2e',  // Dark blue/purple
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  })
}

/**
 * Generate a QR code as SVG string
 */
export async function generateQRCodeSVG(
  petitionSlug: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): Promise<string> {
  const url = `${baseUrl}/p/${petitionSlug}?ref=qr`
  
  return QRCode.toString(url, {
    type: 'svg',
    width: 400,
    margin: 2,
    color: {
      dark: '#1a1a2e',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  })
}

/**
 * Generate a QR code as a Buffer (for file downloads)
 */
export async function generateQRCodeBuffer(
  petitionSlug: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): Promise<Buffer> {
  const url = `${baseUrl}/p/${petitionSlug}?ref=qr`
  
  return QRCode.toBuffer(url, {
    width: 800,  // Higher res for downloads
    margin: 2,
    color: {
      dark: '#1a1a2e',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',  // Higher error correction for printed materials
  })
}

/**
 * Get the petition URL for a given slug
 */
export function getPetitionUrl(
  petitionSlug: string,
  source?: 'qr' | 'share' | 'email',
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): string {
  const url = new URL(`/p/${petitionSlug}`, baseUrl)
  if (source) {
    url.searchParams.set('ref', source)
  }
  return url.toString()
}
