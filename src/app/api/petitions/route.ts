import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'

// GET /api/petitions - List petitions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'ACTIVE'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const where: Record<string, unknown> = {
      status,
      visibility: 'PUBLIC',
    }
    
    if (category) {
      where.category = category
    }
    
    const petitions = await prisma.petition.findMany({
      where,
      include: {
        creator: {
          select: { name: true, image: true },
        },
        _count: {
          select: { signatures: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
    
    const total = await prisma.petition.count({ where })
    
    return NextResponse.json({
      success: true,
      data: petitions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + petitions.length < total,
      },
    })
  } catch (error) {
    console.error('Error fetching petitions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch petitions' },
      { status: 500 }
    )
  }
}

// POST /api/petitions - Create a new petition
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, target, targetEmail, company, category, goal, visibility } = body
    
    // Validate required fields
    if (!title || !description || !target || !category || !goal) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get user from session
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id
    
    // If not authenticated, use demo user for development
    if (!userId) {
      if (process.env.NODE_ENV === 'development') {
        userId = 'demo-user-id'
      } else {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }
    }
    
    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50)
    const slug = `${baseSlug}-${nanoid(6)}`
    
    const petition = await prisma.petition.create({
      data: {
        slug,
        title,
        description,
        target,
        targetEmail,
        company,
        category,
        goal: parseInt(goal),
        visibility: visibility || 'PUBLIC',
        status: 'ACTIVE',
        creatorId: userId,
      },
      include: {
        creator: {
          select: { name: true, image: true },
        },
      },
    })
    
    return NextResponse.json({
      success: true,
      data: petition,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating petition:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create petition' },
      { status: 500 }
    )
  }
}
