import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateQRCodeBuffer, generateQRCodeSVG } from '@/lib/qr'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petitionId: string }> }
) {
  try {
    const { petitionId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'png'
    
    // Get petition by ID or slug
    const petition = await prisma.petition.findFirst({
      where: {
        OR: [
          { id: petitionId },
          { slug: petitionId },
        ],
      },
    })
    
    if (!petition) {
      return NextResponse.json(
        { success: false, error: 'Petition not found' },
        { status: 404 }
      )
    }
    
    if (format === 'svg') {
      const svg = await generateQRCodeSVG(petition.slug)
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="${petition.slug}-qr.svg"`,
        },
      })
    }
    
    // Default to PNG
    const buffer = await generateQRCodeBuffer(petition.slug)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${petition.slug}-qr.png"`,
      },
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
