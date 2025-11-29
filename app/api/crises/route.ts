import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    let query = supabase
      .from('crises')
      .select(`
        *,
        claims (count)
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    const { data: crises, error } = await query

    if (error) {
      console.error('Error fetching crises:', error)
      return NextResponse.json(
        { error: 'Failed to fetch crises' },
        { status: 500 }
      )
    }

    // Enrich with statistics
    const enrichedCrises = await Promise.all(
      (crises || []).map(async (crisis) => {
        const { data: claimsData } = await supabase
          .from('claims')
          .select('status')
          .eq('crisis_id', crisis.id)

        const stats = {
          totalClaims: claimsData?.length || 0,
          verifiedClaims: claimsData?.filter(c => c.status === 'verified').length || 0,
          disputedClaims: claimsData?.filter(c => c.status === 'disputed').length || 0,
          pendingClaims: claimsData?.filter(c => c.status === 'pending' || c.status === 'processing').length || 0,
        }

        return {
          ...crisis,
          statistics: stats,
        }
      })
    )

    return NextResponse.json({
      crises: enrichedCrises,
    })
  } catch (error) {
    console.error('Crises API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, location, priority, tags } = body

    if (!title || !location) {
      return NextResponse.json(
        { error: 'Title and location are required' },
        { status: 400 }
      )
    }

    // Create crisis
    const { data: crisis, error: crisisError } = await supabase
      .from('crises')
      .insert({
        title,
        description,
        location,
        priority: priority || 'medium',
        status: 'active',
      })
      .select()
      .single()

    if (crisisError) {
      console.error('Error creating crisis:', crisisError)
      return NextResponse.json(
        { error: 'Failed to create crisis' },
        { status: 500 }
      )
    }

    // Add tags if provided
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tag: string) => ({
        crisis_id: crisis.id,
        tag,
      }))

      await supabase.from('crisis_tags').insert(tagInserts)
    }

    return NextResponse.json(crisis, { status: 201 })
  } catch (error) {
    console.error('Create crisis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
