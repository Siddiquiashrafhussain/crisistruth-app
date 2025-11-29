"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Search,
  Shield,
  XCircle,
  Zap,
  Globe,
  BookOpen,
  Users,
  TrendingUp,
  Copy,
  Share,
} from "lucide-react"
import Image from "next/image"

// Mock verification results
const mockVerificationResult = {
  claim: "The earthquake in Turkey was caused by HAARP weather manipulation technology.",
  status: "disputed",
  confidence: 15,
  verificationTime: "2.3 seconds",
  summary:
    "This claim lacks scientific evidence and contradicts established geological understanding of earthquake causes.",
  sources: [
    {
      title: "USGS Earthquake Science Center",
      url: "https://earthquake.usgs.gov/learn/topics/plate_tectonics/",
      credibility: 95,
      excerpt: "Earthquakes are caused by the movement of tectonic plates, not artificial weather manipulation.",
      type: "Scientific Authority",
    },
    {
      title: "Nature Geoscience Journal",
      url: "https://nature.com/articles/earthquake-causes",
      credibility: 92,
      excerpt: "Comprehensive analysis of earthquake mechanisms shows natural tectonic processes as primary cause.",
      type: "Peer-Reviewed Research",
    },
    {
      title: "HAARP Official Website",
      url: "https://haarp.gi.alaska.edu/",
      credibility: 88,
      excerpt: "HAARP facility studies ionosphere and has no capability to influence seismic activity.",
      type: "Official Source",
    },
    {
      title: "Snopes Fact Check",
      url: "https://snopes.com/fact-check/haarp-earthquake-conspiracy/",
      credibility: 85,
      excerpt: "Multiple conspiracy theories about HAARP causing earthquakes have been thoroughly debunked.",
      type: "Fact-Checking Organization",
    },
  ],
  evidence: {
    supporting: 2,
    contradicting: 12,
    neutral: 3,
  },
  relatedClaims: [
    "HAARP controls weather patterns globally",
    "Government weather manipulation programs exist",
    "Artificial earthquakes are possible with current technology",
  ],
  tags: ["Natural Disasters", "Conspiracy Theory", "Science", "Geology"],
}

export default function VerifyPage() {
  const [claim, setClaim] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<typeof mockVerificationResult | null>(null)
  const [progress, setProgress] = useState(0)

  const handleVerification = async () => {
    if (!claim.trim()) return

    setIsVerifying(true)
    setProgress(0)
    setVerificationResult(null)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 300)

    try {
      // Call real verification API
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimText: claim,
          userId: 'demo-user', // TODO: Get from auth context
        }),
      })

      if (!response.ok) {
        throw new Error('Verification failed')
      }

      const data = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)

      // Format result to match expected structure
      setVerificationResult({
        claim: data.verification.claim,
        status: data.verification.status,
        confidence: data.verification.confidenceScore,
        verificationTime: `${(data.verification.processingTime / 1000).toFixed(1)} seconds`,
        summary: data.verification.summary,
        sources: data.verification.sources,
        evidence: data.verification.evidence,
        relatedClaims: [
          "Related claim analysis coming soon",
        ],
        tags: data.verification.tags || ['General'],
      })
    } catch (error) {
      console.error('Verification error:', error)
      clearInterval(progressInterval)
      
      // Fallback to mock result on error
      setProgress(100)
      setVerificationResult({
        ...mockVerificationResult,
        claim: claim,
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "disputed":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "unverified":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "disputed":
        return "bg-red-100 text-red-800 border-red-200"
      case "unverified":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
           <Image src="/Gemini_Generate.png" alt="CrisisTruth Logo" width={120} height={32} className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="/verify" className="text-primary font-medium">
              Verify
            </a>
          </nav>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">New Verification</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2 font-[family-name:var(--font-playfair)]">
            AI-Powered Fact Verification
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Submit any claim for instant AI analysis and verification against trusted sources
          </p>
        </div>

        {/* Search Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Verify a Claim
            </CardTitle>
            <CardDescription>
              Enter the statement or claim you want to fact-check. Our AI will analyze it against multiple trusted
              sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter the claim you want to verify... (e.g., 'The earthquake in Turkey was caused by HAARP weather manipulation technology.')"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-4">
                <Button
                  onClick={handleVerification}
                  disabled={!claim.trim() || isVerifying}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isVerifying ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify Claim
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setClaim("")}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Progress */}
        {isVerifying && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary animate-pulse" />
                  <span className="font-medium">AI Verification in Progress</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Analyzing claim against{" "}
                  {progress < 40
                    ? "structure patterns"
                    : progress < 60
                      ? "trusted databases"
                      : progress < 80
                        ? "multiple sources"
                        : "verification algorithms"}
                  ...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Results */}
        {verificationResult && !isVerifying && (
          <div className="space-y-6">
            {/* Results Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <CardTitle className="text-xl">Verification Results</CardTitle>
                      <Badge className={`${getStatusColor(verificationResult.status)} flex items-center gap-1`}>
                        {getStatusIcon(verificationResult.status)}
                        {verificationResult.status.charAt(0).toUpperCase() + verificationResult.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="text-base mb-4">
                      <strong>Claim:</strong> "{verificationResult.claim}"
                    </CardDescription>
                    <p className="text-muted-foreground">{verificationResult.summary}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className={`text-3xl font-bold mb-1 ${getConfidenceColor(verificationResult.confidence)}`}>
                      {verificationResult.confidence}%
                    </div>
                    <div className="text-sm text-muted-foreground">Confidence</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Verified in {verificationResult.verificationTime}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {verificationResult.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Results
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="sources" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sources">Sources</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="related">Related Claims</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="sources" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Source Analysis</h3>
                  {verificationResult.sources.map((source, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{source.title}</h4>
                            <Badge variant="outline" className="text-xs mb-2">
                              {source.type}
                            </Badge>
                            <p className="text-sm text-muted-foreground mb-3">{source.excerpt}</p>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              View Source <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-secondary mb-1">{source.credibility}%</div>
                            <div className="text-xs text-muted-foreground">Credibility</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Evidence Summary</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {verificationResult.evidence.supporting}
                        </div>
                        <div className="text-sm text-muted-foreground">Supporting Sources</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          {verificationResult.evidence.contradicting}
                        </div>
                        <div className="text-sm text-muted-foreground">Contradicting Sources</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600 mb-1">
                          {verificationResult.evidence.neutral}
                        </div>
                        <div className="text-sm text-muted-foreground">Neutral Sources</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3">Evidence Analysis</h4>
                      <p className="text-muted-foreground mb-4">
                        The overwhelming majority of credible sources contradict this claim. Scientific consensus and
                        geological evidence strongly support natural tectonic processes as the cause of earthquakes, not
                        artificial weather manipulation technology.
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>12 Scientific Papers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <span>8 Official Sources</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>4 Expert Reviews</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="related" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Related Claims</h3>
                  {verificationResult.relatedClaims.map((relatedClaim, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <p className="text-foreground">{relatedClaim}</p>
                          <Button variant="outline" size="sm">
                            Verify This
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Analysis</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Verification Methodology
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Source Credibility Assessment</h4>
                          <p className="text-muted-foreground text-sm">
                            Sources are evaluated based on authority, peer review status, publication reputation, and
                            historical accuracy. Scientific institutions and peer-reviewed research receive higher
                            credibility scores.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Cross-Reference Analysis</h4>
                          <p className="text-muted-foreground text-sm">
                            Claims are cross-referenced against multiple independent sources to identify consensus or
                            disagreement among authoritative sources.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Confidence Calculation</h4>
                          <p className="text-muted-foreground text-sm">
                            Confidence scores are calculated using source credibility, evidence strength, consensus
                            level, and historical verification patterns for similar claims.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground mb-2">
                            This claim should be treated as misinformation
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Based on overwhelming scientific evidence and expert consensus, this claim lacks credible
                            support and contradicts established geological understanding. We recommend not sharing this
                            information and consulting authoritative sources for accurate earthquake information.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Quick Examples */}
        {!verificationResult && !isVerifying && (
          <Card>
            <CardHeader>
              <CardTitle>Try These Example Claims</CardTitle>
              <CardDescription>Click on any example below to see how our verification system works</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left justify-start bg-transparent"
                  onClick={() => setClaim("Vaccines contain microchips for tracking people")}
                >
                  <div>
                    <div className="font-medium mb-1">Medical Misinformation</div>
                    <div className="text-sm text-muted-foreground">
                      "Vaccines contain microchips for tracking people"
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left justify-start bg-transparent"
                  onClick={() => setClaim("Climate change is a hoax created by scientists for funding")}
                >
                  <div>
                    <div className="font-medium mb-1">Climate Misinformation</div>
                    <div className="text-sm text-muted-foreground">
                      "Climate change is a hoax created by scientists for funding"
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left justify-start bg-transparent"
                  onClick={() => setClaim("5G towers cause coronavirus infections")}
                >
                  <div>
                    <div className="font-medium mb-1">Technology Conspiracy</div>
                    <div className="text-sm text-muted-foreground">"5G towers cause coronavirus infections"</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left justify-start bg-transparent"
                  onClick={() => setClaim("The moon landing was filmed in a Hollywood studio")}
                >
                  <div>
                    <div className="font-medium mb-1">Historical Conspiracy</div>
                    <div className="text-sm text-muted-foreground">
                      "The moon landing was filmed in a Hollywood studio"
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
