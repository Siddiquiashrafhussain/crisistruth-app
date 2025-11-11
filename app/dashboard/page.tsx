import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Globe,
  MapPin,
  Search,
  Shield,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"

import Image from "next/image"

// Mock data for crisis cards
const crisisData = [
  {
    id: 1,
    title: "Earthquake Relief Misinformation",
    location: "Turkey-Syria Border",
    status: "verified",
    confidence: 95,
    claimsCount: 23,
    verifiedClaims: 18,
    disputedClaims: 3,
    pendingClaims: 2,
    lastUpdated: "2 hours ago",
    description: "Multiple false claims about relief efforts and casualty numbers being spread on social media.",
    tags: ["Natural Disaster", "Relief Efforts", "Social Media"],
    priority: "high",
  },
  {
    id: 2,
    title: "Election Security Claims",
    location: "United States",
    status: "disputed",
    confidence: 72,
    claimsCount: 45,
    verifiedClaims: 12,
    disputedClaims: 28,
    pendingClaims: 5,
    lastUpdated: "4 hours ago",
    description: "Various claims about voting machine security and ballot counting procedures under investigation.",
    tags: ["Politics", "Elections", "Security"],
    priority: "high",
  },
  {
    id: 3,
    title: "Climate Data Manipulation",
    location: "Global",
    status: "unverified",
    confidence: 45,
    claimsCount: 12,
    verifiedClaims: 2,
    disputedClaims: 1,
    pendingClaims: 9,
    lastUpdated: "6 hours ago",
    description: "Claims about temperature data being manipulated by climate research institutions.",
    tags: ["Climate", "Science", "Data"],
    priority: "medium",
  },
  {
    id: 4,
    title: "Medical Treatment Misinformation",
    location: "Brazil",
    status: "verified",
    confidence: 88,
    claimsCount: 34,
    verifiedClaims: 29,
    disputedClaims: 4,
    pendingClaims: 1,
    lastUpdated: "8 hours ago",
    description: "False information about alternative treatments spreading during health crisis.",
    tags: ["Health", "Medical", "Treatment"],
    priority: "high",
  },
  {
    id: 5,
    title: "Economic Policy Impact",
    location: "European Union",
    status: "disputed",
    confidence: 63,
    claimsCount: 18,
    verifiedClaims: 7,
    disputedClaims: 8,
    pendingClaims: 3,
    lastUpdated: "12 hours ago",
    description: "Conflicting claims about the economic impact of new trade policies.",
    tags: ["Economics", "Policy", "Trade"],
    priority: "medium",
  },
  {
    id: 6,
    title: "Technology Security Breach",
    location: "Singapore",
    status: "unverified",
    confidence: 38,
    claimsCount: 8,
    verifiedClaims: 1,
    disputedClaims: 0,
    pendingClaims: 7,
    lastUpdated: "1 day ago",
    description: "Unconfirmed reports of major data breach affecting government systems.",
    tags: ["Technology", "Security", "Government"],
    priority: "low",
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "verified":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "disputed":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "unverified":
      return <Clock className="h-4 w-4 text-yellow-600" />
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />
  }
}

function getStatusColor(status: string) {
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

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Image src="/crisistruth-logo.png" alt="CrisisTruth Logo" width={120} height={32} className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/dashboard" className="text-primary font-medium">
              Dashboard
            </a>
            <a href="/verify" className="text-foreground hover:text-primary transition-colors">
              Verify
            </a>
          </nav>
          <a href="/verify">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">New Verification</Button>
          </a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 font-[family-name:var(--font-playfair)]">
            Crisis Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Real-time fact verification and crisis information monitoring</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Crises</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <p className="text-xs text-muted-foreground">+12 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Claims Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">1,429</div>
              <p className="text-xs text-muted-foreground">+89 today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">94.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2,847</div>
              <p className="text-xs text-muted-foreground">+156 this hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search crises, locations, or claims..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Crisis Cards Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Crises</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="disputed">Disputed</TabsTrigger>
            <TabsTrigger value="unverified">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6">
              {crisisData.map((crisis) => (
                <Card key={crisis.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(crisis.priority)}`} />
                          <CardTitle className="text-xl font-bold text-card-foreground">{crisis.title}</CardTitle>
                          <Badge className={`${getStatusColor(crisis.status)} flex items-center gap-1`}>
                            {getStatusIcon(crisis.status)}
                            {crisis.status.charAt(0).toUpperCase() + crisis.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {crisis.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {crisis.claimsCount} claims
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {crisis.lastUpdated}
                          </div>
                        </div>
                        <CardDescription className="text-base mb-4">{crisis.description}</CardDescription>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary mb-1">{crisis.confidence}%</div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">{crisis.verifiedClaims} Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 font-medium">{crisis.disputedClaims} Disputed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-600 font-medium">{crisis.pendingClaims} Pending</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {crisis.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Verify Claims
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verified" className="mt-6">
            <div className="grid gap-6">
              {crisisData
                .filter((crisis) => crisis.status === "verified")
                .map((crisis) => (
                  <Card key={crisis.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(crisis.priority)}`} />
                            <CardTitle className="text-xl font-bold text-card-foreground">{crisis.title}</CardTitle>
                            <Badge className={`${getStatusColor(crisis.status)} flex items-center gap-1`}>
                              {getStatusIcon(crisis.status)}
                              {crisis.status.charAt(0).toUpperCase() + crisis.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {crisis.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              {crisis.claimsCount} claims
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {crisis.lastUpdated}
                            </div>
                          </div>
                          <CardDescription className="text-base mb-4">{crisis.description}</CardDescription>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-primary mb-1">{crisis.confidence}%</div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">{crisis.verifiedClaims} Verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 font-medium">{crisis.disputedClaims} Disputed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600 font-medium">{crisis.pendingClaims} Pending</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {crisis.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Verify Claims
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="disputed" className="mt-6">
            <div className="grid gap-6">
              {crisisData
                .filter((crisis) => crisis.status === "disputed")
                .map((crisis) => (
                  <Card key={crisis.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(crisis.priority)}`} />
                            <CardTitle className="text-xl font-bold text-card-foreground">{crisis.title}</CardTitle>
                            <Badge className={`${getStatusColor(crisis.status)} flex items-center gap-1`}>
                              {getStatusIcon(crisis.status)}
                              {crisis.status.charAt(0).toUpperCase() + crisis.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {crisis.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              {crisis.claimsCount} claims
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {crisis.lastUpdated}
                            </div>
                          </div>
                          <CardDescription className="text-base mb-4">{crisis.description}</CardDescription>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-primary mb-1">{crisis.confidence}%</div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">{crisis.verifiedClaims} Verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 font-medium">{crisis.disputedClaims} Disputed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600 font-medium">{crisis.pendingClaims} Pending</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {crisis.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Verify Claims
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="unverified" className="mt-6">
            <div className="grid gap-6">
              {crisisData
                .filter((crisis) => crisis.status === "unverified")
                .map((crisis) => (
                  <Card key={crisis.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(crisis.priority)}`} />
                            <CardTitle className="text-xl font-bold text-card-foreground">{crisis.title}</CardTitle>
                            <Badge className={`${getStatusColor(crisis.status)} flex items-center gap-1`}>
                              {getStatusIcon(crisis.status)}
                              {crisis.status.charAt(0).toUpperCase() + crisis.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {crisis.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              {crisis.claimsCount} claims
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {crisis.lastUpdated}
                            </div>
                          </div>
                          <CardDescription className="text-base mb-4">{crisis.description}</CardDescription>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-primary mb-1">{crisis.confidence}%</div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">{crisis.verifiedClaims} Verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 font-medium">{crisis.disputedClaims} Disputed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600 font-medium">{crisis.pendingClaims} Pending</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {crisis.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Verify Claims
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
