// Community Verification Service
import { supabase } from './supabase'

export interface CommunityVote {
  id: string
  claim_id: string
  user_id: string
  vote: 'agree' | 'disagree' | 'unsure'
  comment?: string
  created_at: string
}

export interface CommunityVerificationStats {
  total_votes: number
  agree_count: number
  disagree_count: number
  unsure_count: number
  community_confidence: number
  user_vote?: 'agree' | 'disagree' | 'unsure'
}

export class CommunityVerificationService {
  // Submit a community vote
  async submitVote(
    claimId: string,
    userId: string,
    vote: 'agree' | 'disagree' | 'unsure',
    comment?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('community_votes')
        .select('id')
        .eq('claim_id', claimId)
        .eq('user_id', userId)
        .single()

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('community_votes')
          .update({ vote, comment, updated_at: new Date().toISOString() })
          .eq('id', existingVote.id)

        if (error) throw error
      } else {
        // Insert new vote
        const { error } = await supabase
          .from('community_votes')
          .insert({
            claim_id: claimId,
            user_id: userId,
            vote,
            comment
          })

        if (error) throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error submitting community vote:', error)
      return { success: false, error: 'Failed to submit vote' }
    }
  }

  // Get community verification statistics for a claim
  async getStats(claimId: string, userId?: string): Promise<CommunityVerificationStats> {
    try {
      const { data: votes, error } = await supabase
        .from('community_votes')
        .select('vote, user_id')
        .eq('claim_id', claimId)

      if (error) throw error

      const total_votes = votes?.length || 0
      const agree_count = votes?.filter(v => v.vote === 'agree').length || 0
      const disagree_count = votes?.filter(v => v.vote === 'disagree').length || 0
      const unsure_count = votes?.filter(v => v.vote === 'unsure').length || 0

      // Calculate community confidence (0-100)
      // Higher confidence when more people agree, lower when more disagree
      let community_confidence = 50
      if (total_votes > 0) {
        const agreeRatio = agree_count / total_votes
        const disagreeRatio = disagree_count / total_votes
        community_confidence = Math.round((agreeRatio - disagreeRatio) * 50 + 50)
      }

      // Get user's vote if userId provided
      let user_vote: 'agree' | 'disagree' | 'unsure' | undefined
      if (userId && votes) {
        const userVoteData = votes.find(v => v.user_id === userId)
        user_vote = userVoteData?.vote
      }

      return {
        total_votes,
        agree_count,
        disagree_count,
        unsure_count,
        community_confidence,
        user_vote
      }
    } catch (error) {
      console.error('Error fetching community stats:', error)
      return {
        total_votes: 0,
        agree_count: 0,
        disagree_count: 0,
        unsure_count: 0,
        community_confidence: 50
      }
    }
  }

  // Get recent community comments for a claim
  async getComments(claimId: string, limit: number = 10): Promise<CommunityVote[]> {
    try {
      const { data: votes, error } = await supabase
        .from('community_votes')
        .select('*, users(name)')
        .eq('claim_id', claimId)
        .not('comment', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return votes || []
    } catch (error) {
      console.error('Error fetching community comments:', error)
      return []
    }
  }

  // Get user's voting history
  async getUserVotes(userId: string, limit: number = 20): Promise<CommunityVote[]> {
    try {
      const { data: votes, error } = await supabase
        .from('community_votes')
        .select('*, claims(text)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return votes || []
    } catch (error) {
      console.error('Error fetching user votes:', error)
      return []
    }
  }
}

// Singleton instance
export const communityVerificationService = new CommunityVerificationService()
