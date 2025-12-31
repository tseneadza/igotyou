import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/petitions/[slug] - Get a single petition
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Track QR code scans
    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref')
    
    const petition = await prisma.petition.findUnique({
      where: { slug },
      include: {
        creator: {
          select: { id: true, name: true, image: true, verificationTier: true },
        },
        signatures: {
          include: {
            user: {
              select: { name: true, image: true, verificationTier: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        updates: {
          orderBy: { createdAt: 'desc' },
        },
        responses: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { signatures: true },
        },
      },
    })
    
    if (!petition) {
      return NextResponse.json(
        { success: false, error: 'Petition not found' },
        { status: 404 }
      )
    }
    
    // Increment QR scan count if applicable
    if (ref === 'qr') {
      await prisma.petition.update({
        where: { id: petition.id },
        data: { qrScans: { increment: 1 } },
      })
    }
    
    return NextResponse.json({
      success: true,
      data: petition,
    })
  } catch (error) {
    console.error('Error fetching petition:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch petition' },
      { status: 500 }
    )
  }
}

// PATCH /api/petitions/[slug] - Update a petition
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    
    // TODO: Verify user is the petition owner
    
    const petition = await prisma.petition.findUnique({
      where: { slug },
    })
    
    if (!petition) {
      return NextResponse.json(
        { success: false, error: 'Petition not found' },
        { status: 404 }
      )
    }
    
    const updatedPetition = await prisma.petition.update({
      where: { slug },
      data: {
        title: body.title,
        description: body.description,
        target: body.target,
        goal: body.goal ? parseInt(body.goal) : undefined,
        status: body.status,
      },
    })
    
    return NextResponse.json({
      success: true,
      data: updatedPetition,
    })
  } catch (error) {
    console.error('Error updating petition:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update petition' },
      { status: 500 }
    )
  }
}
