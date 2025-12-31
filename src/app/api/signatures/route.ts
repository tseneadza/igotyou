import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST /api/signatures - Sign a petition
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { petitionId, comment, isAnonymous } = body
    
    // Validate required fields
    if (!petitionId) {
      return NextResponse.json(
        { success: false, error: 'Petition ID is required' },
        { status: 400 }
      )
    }
    
    // Get user from session
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || body.userId // Fallback for API testing
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to sign this petition' },
        { status: 401 }
      )
    }
    
    // Check if petition exists and is active
    const petition = await prisma.petition.findUnique({
      where: { id: petitionId },
    })
    
    if (!petition) {
      return NextResponse.json(
        { success: false, error: 'Petition not found' },
        { status: 404 }
      )
    }
    
    if (petition.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'This petition is no longer accepting signatures' },
        { status: 400 }
      )
    }
    
    // Check if user already signed
    const existingSignature = await prisma.signature.findUnique({
      where: {
        petitionId_userId: {
          petitionId,
          userId,
        },
      },
    })
    
    if (existingSignature) {
      return NextResponse.json(
        { success: false, error: 'You have already signed this petition' },
        { status: 400 }
      )
    }
    
    // Determine signature source from referer or body
    let source: 'DIRECT' | 'QR_CODE' | 'SHARE' | 'EMAIL' = 'DIRECT'
    const referer = request.headers.get('referer')
    if (referer?.includes('ref=qr')) source = 'QR_CODE'
    else if (referer?.includes('ref=share')) source = 'SHARE'
    else if (referer?.includes('ref=email')) source = 'EMAIL'
    
    // Get user's verification tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { verificationTier: true },
    })
    
    const verifiedEmployee = user?.verificationTier === 'VERIFIED_EMPLOYEE' || 
                            user?.verificationTier === 'ANONYMIZED_VERIFIED'
    
    // Create signature
    const signature = await prisma.signature.create({
      data: {
        petitionId,
        userId,
        comment: comment || null,
        isAnonymous: isAnonymous || false,
        verifiedEmployee,
        source,
      },
      include: {
        user: {
          select: { name: true, image: true, verificationTier: true },
        },
      },
    })
    
    // Get updated signature count
    const signatureCount = await prisma.signature.count({
      where: { petitionId },
    })
    
    return NextResponse.json({
      success: true,
      data: signature,
      signatureCount,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating signature:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sign petition' },
      { status: 500 }
    )
  }
}

// GET /api/signatures?petitionId=xxx - Get signatures for a petition
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const petitionId = searchParams.get('petitionId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    if (!petitionId) {
      return NextResponse.json(
        { success: false, error: 'Petition ID is required' },
        { status: 400 }
      )
    }
    
    const signatures = await prisma.signature.findMany({
      where: { petitionId },
      include: {
        user: {
          select: { name: true, image: true, verificationTier: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
    
    const total = await prisma.signature.count({
      where: { petitionId },
    })
    
    // Filter out names for anonymous signatures
    const processedSignatures = signatures.map((sig) => ({
      ...sig,
      user: sig.isAnonymous
        ? { name: 'Anonymous', image: null, verificationTier: sig.user.verificationTier }
        : sig.user,
    }))
    
    return NextResponse.json({
      success: true,
      data: processedSignatures,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + signatures.length < total,
      },
    })
  } catch (error) {
    console.error('Error fetching signatures:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch signatures' },
      { status: 500 }
    )
  }
}
