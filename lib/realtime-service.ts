// Real-time updates service using Supabase Realtime
import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export type VerificationUpdate = {
  claim_id: string
  status: 'verified' | 'disputed' | 'unverified'
  confidence_score: number
  timestamp: string
}

export type CrisisUpdate = {
  crisis_id: string
  total_claims: number
  verified_count: number
  disputed_count: number
  unverified_count: number
  timestamp: string
}

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()

  // Subscribe to verification updates for a specific claim
  subscribeToClaimUpdates(
    claimId: string,
    callback: (update: VerificationUpdate) => void
  ): () => void {
    const channelName = `claim:${claimId}`
    
    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName)
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'verifications',
          filter: `claim_id=eq.${claimId}`
        },
        (payload) => {
          const update: VerificationUpdate = {
            claim_id: claimId,
            status: payload.new.status,
            confidence_score: payload.new.confidence_score,
            timestamp: new Date().toISOString()
          }
          callback(update)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => this.unsubscribe(channelName)
  }

  // Subscribe to all verification updates
  subscribeToAllVerifications(
    callback: (update: VerificationUpdate) => void
  ): () => void {
    const channelName = 'all-verifications'
    
    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName)
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'verifications'
        },
        (payload) => {
          const update: VerificationUpdate = {
            claim_id: payload.new.claim_id,
            status: payload.new.status,
            confidence_score: payload.new.confidence_score,
            timestamp: new Date().toISOString()
          }
          callback(update)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => this.unsubscribe(channelName)
  }

  // Subscribe to crisis updates
  subscribeToCrisisUpdates(
    crisisId: string,
    callback: (update: CrisisUpdate) => void
  ): () => void {
    const channelName = `crisis:${crisisId}`
    
    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName)
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims',
          filter: `crisis_id=eq.${crisisId}`
        },
        async () => {
          // Fetch updated statistics
          const stats = await this.getCrisisStatistics(crisisId)
          if (stats) {
            callback(stats)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => this.unsubscribe(channelName)
  }

  // Subscribe to all crisis updates
  subscribeToAllCrises(
    callback: (crisisId: string) => void
  ): () => void {
    const channelName = 'all-crises'
    
    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName)
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crises'
        },
        (payload) => {
          callback(payload.new.id)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => this.unsubscribe(channelName)
  }

  // Get crisis statistics
  private async getCrisisStatistics(crisisId: string): Promise<CrisisUpdate | null> {
    try {
      const { data: claims, error } = await supabase
        .from('claims')
        .select('status')
        .eq('crisis_id', crisisId)

      if (error) throw error

      const stats = {
        crisis_id: crisisId,
        total_claims: claims.length,
        verified_count: claims.filter(c => c.status === 'verified').length,
        disputed_count: claims.filter(c => c.status === 'disputed').length,
        unverified_count: claims.filter(c => c.status === 'unverified' || c.status === 'pending').length,
        timestamp: new Date().toISOString()
      }

      return stats
    } catch (error) {
      console.error('Error fetching crisis statistics:', error)
      return null
    }
  }

  // Unsubscribe from a channel
  private unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll(): void {
    this.channels.forEach((_, channelName) => {
      this.unsubscribe(channelName)
    })
  }
}

// Singleton instance
export const realtimeService = new RealtimeService()
