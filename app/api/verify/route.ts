import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyClaim } from '@/lib/neysa-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { claimText, userId } = body

    if (!claimText || !claimText.trim()) {
      return NextResponse.json(
        { error: 'Claim text is required' },
        { status: 400 }
      )
    }

    // Store claim in database
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .insert({
        text: claimText,
        user_id: userId || 'anonymous',
        status: 'processing',
        category: null,
        crisis_id: null,
      })
      .select()
      .single()

    if (claimError) {
      console.error('Error storing claim:', claimError)
      return NextResponse.json(
        { error: 'Failed to store claim' },
        { status: 500 }
      )
    }

    // Verify claim using Neysa AI
    const verificationResult = await verifyClaim(claimText)

    // Store verification result
    const { data: verification, error: verificationError } = await supabase
      .from('verifications')
      .insert({
        claim_id: claim.id,
        status: verificationResult.status,
        confidence_score: verificationResult.confidenceScore,
        summary: verificationResult.summary,
        processing_time_ms: verificationResult.processingTime,
      })
      .select()
      .single()

    if (verificationError) {
      console.error('Error storing verification:', verificationError)
    }

    // Update claim status
    await supabase
      .from('claims')
      .update({ status: verificationResult.status })
      .eq('id', claim.id)

    return NextResponse.json({
      claimId: claim.id,
      verification: {
        ...verificationResult,
        claim: claimText,
        tags: extractTags(claimText),
      },
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function extractTags(text: string): string[] {
  const tags: string[] = []
  const lowerText = text.toLowerCase()

  const tagMap: Record<string, string[]> = {
    'Natural Disasters': ['earthquake', 'tsunami', 'hurricane', 'flood', 'disaster'],
    'Health': ['vaccine', 'covid', 'virus', 'medical', 'health', 'disease'],
    'Politics': ['election', 'government', 'president', 'vote', 'political'],
    'Science': ['scientific', 'research', 'study', 'climate', 'data'],
    'Technology': ['tech', 'ai', '5g', 'internet', 'cyber'],
    'Conspiracy Theory': ['conspiracy', 'hoax', 'fake', 'manipulation', 'haarp'],
  }

  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      tags.push(tag)
    }
  }

  return tags.length > 0 ? tags : ['General']
}
