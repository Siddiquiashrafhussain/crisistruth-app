import { NextRequest, NextResponse } from 'next/server'
import { communityVerificationService } from '@/lib/community-verification'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { claimId, userId, vote, comment } = body

    if (!claimId || !userId || !vote) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['agree', 'disagree', 'unsure'].includes(vote)) {
      return NextResponse.json(
        { error: 'Invalid vote value' },
        { status: 400 }
      )
    }

    const result = await communityVerificationService.submitVote(
      claimId,
      userId,
      vote,
      comment
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to submit vote' },
        { status: 500 }
      )
    }

    // Get updated stats
    const stats = await communityVerificationService.getStats(claimId, userId)

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Community vote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const claimId = searchParams.get('claimId')
    const userId = searchParams.get('userId')

    if (!claimId) {
      return NextResponse.json(
        { error: 'Missing claimId parameter' },
        { status: 400 }
      )
    }

    const stats = await communityVerificationService.getStats(
      claimId,
      userId || undefined
    )

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Get community stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
