"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Settings,
  UserCheck,
  FileText,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Menu,
} from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Mock admin data
const adminStats = {
  totalUsers: 15847,
  activeFactCheckers: 234,
  pendingReviews: 89,
  systemUptime: "99.9%",
  dailyVerifications: 1429,
  accuracyRate: 94.2,
  flaggedContent: 23,
  resolvedIssues: 156,
}

const pendingReviews = [
  {
    id: 1,
    claim: "New COVID variant spreads faster than previous strains",
    submittedBy: "journalist@news.com",
    priority: "high",
    category: "Health",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    claim: "Government announces new economic stimulus package",
    submittedBy: "reporter@media.org",
    priority: "medium",
    category: "Politics",
    submittedAt: "4 hours ago",
    status: "in-review",
  },
  {
    id: 3,
    claim: "Tech company data breach affects millions of users",
    submittedBy: "tech@blogger.com",
    priority: "high",
    category: "Technology",
    submittedAt: "6 hours ago",
    status: "pending",
  },
]

const factCheckers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@crisistruth.org",
    specialization: "Medical Sciences",
    verificationsCount: 342,
    accuracyRate: 96.8,
    status: "active",
    joinedDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    email: "michael.chen@crisistruth.org",
    specialization: "Climate Science",
    verificationsCount: 289,
    accuracyRate: 94.2,
    status: "active",
    joinedDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@crisistruth.org",
    specialization: "Political Science",
    verificationsCount: 198,
    accuracyRate: 92.5,
    status: "inactive",
    joinedDate: "2023-03-10",
  },
]

const systemAlerts = [
  {
    id: 1,
    type: "warning",
    message: "High volume of claims detected in Health category",
    timestamp: "10 minutes ago",
  },
  {
    id: 2,
    type: "info",
    message: "Weekly backup completed successfully",
    timestamp: "2 hours ago",
  },
  {
    id: 3,
    type: "error",
    message: "API rate limit exceeded for external source verification",
    timestamp: "4 hours ago",
  },
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "inactive":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "in-review":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getAlertIcon(type: string) {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "info":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export default function AdminPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/Gemini_Generate.png" alt="CrisisTruth Logo" width={120} height={32} className="h-8 w-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Public Site
            </a>
            <a href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="/admin" className="text-primary font-medium">
              Admin
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Crisis
              </Button>
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                     <Image src="/Gemini_Generate.png" alt="CrisisTruth Logo" width={120} height={32} className="h-8 w-auto" />
                  </div>
                  <nav className="flex flex-col gap-6 py-6">
                    <a href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      Public Site
                    </a>
                    <a href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      Dashboard
                    </a>
                    <a href="/admin" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-primary">
                      Admin
                    </a>
                  </nav>
                  <div className="mt-auto border-t pt-6 flex flex-col gap-4">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      New Crisis
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2 font-[family-name:var(--font-playfair)]">
            Admin Console
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Manage fact-checkers, moderate content, and monitor system performance
          </p>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{adminStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Fact-Checkers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{adminStats.activeFactCheckers}</div>
              <p className="text-xs text-muted-foreground">+5 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{adminStats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">-23 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{adminStats.systemUptime}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg border border-border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="w-full overflow-x-auto whitespace-nowrap py-2 px-1 grid grid-flow-col auto-cols-max gap-4 sm:grid-cols-5">
            <TabsTrigger value="reviews">Pending Reviews</TabsTrigger>
            <TabsTrigger value="fact-checkers">Fact-Checkers</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Claim Reviews</CardTitle>
                <CardDescription>Claims submitted for fact-checking that require expert review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex flex-col sm:flex-row items-start justify-between p-4 border border-border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <Badge className={getPriorityColor(review.priority)}>{review.priority.toUpperCase()}</Badge>
                          <Badge variant="outline">{review.category}</Badge>
                          <Badge className={getStatusColor(review.status)}>
                            {review.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-foreground mb-2 text-base">{review.claim}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <span>Submitted by: {review.submittedBy}</span>
                          <span>{review.submittedAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-auto sm:ml-4 flex-shrink-0">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Review</span>
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fact-checkers" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Fact-Checker Management</CardTitle>
                    <CardDescription>Manage expert fact-checkers and their performance metrics</CardDescription>
                  </div>
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fact-Checker
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {factCheckers.map((checker) => (
                    <div
                      key={checker.id}
                      className="flex flex-col md:flex-row items-start justify-between p-4 border border-border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{checker.name}</h4>
                          <Badge className={getStatusColor(checker.status)}>{checker.status.toUpperCase()}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{checker.email}</p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <span className="text-muted-foreground">
                            <strong>Specialization:</strong> {checker.specialization}
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Verifications:</strong> {checker.verificationsCount}
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Accuracy:</strong> {checker.accuracyRate}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-auto md:ml-4 flex-shrink-0 self-start md:self-center">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 md:mr-2" />
                           <span className="hidden md:inline">View</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 md:mr-2" />
                           <span className="hidden md:inline">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4 md:mr-2" />
                           <span className="hidden md:inline">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Moderation</CardTitle>
                  <CardDescription>Manage flagged content and moderation queue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600 mb-1">{adminStats.flaggedContent}</div>
                        <div className="text-sm text-muted-foreground">Flagged Content</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600 mb-1">45</div>
                        <div className="text-sm text-muted-foreground">Pending Review</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600 mb-1">{adminStats.resolvedIssues}</div>
                        <div className="text-sm text-muted-foreground">Resolved Today</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      <FileText className="h-4 w-4 mr-2" />
                      Review Flagged Content
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Settings className="h-4 w-4 mr-2" />
                      Moderation Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crisis Management</CardTitle>
                  <CardDescription>Create and manage crisis situations and associated claims</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Crisis
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Globe className="h-4 w-4 mr-2" />
                      Manage Active Crises
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Crisis Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>System performance and usage statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {adminStats.dailyVerifications.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Daily Verifications</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-secondary mb-1">{adminStats.accuracyRate}%</div>
                        <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">{adminStats.resolvedIssues}</div>
                        <div className="text-sm text-muted-foreground">Issues Resolved</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">{adminStats.flaggedContent}</div>
                        <div className="text-sm text-muted-foreground">Flagged Content</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>User activity and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Detailed user engagement analytics and trends would be displayed here with interactive charts and
                    graphs.
                  </p>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Engagement Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Manage system settings and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground">AI Verification Threshold</h4>
                        <p className="text-sm text-muted-foreground">
                          Minimum confidence score required for automatic verification
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Configure
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground">Source Credibility Weights</h4>
                        <p className="text-sm text-muted-foreground">
                          Adjust credibility scoring for different source types
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Configure
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground">Notification Settings</h4>
                        <p className="text-sm text-muted-foreground">Configure system alerts and notifications</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Configure
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground">API Rate Limits</h4>
                        <p className="text-sm text-muted-foreground">Manage API usage limits and quotas</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage security policies and access controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Dashboard
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Users className="h-4 w-4 mr-2" />
                      User Permissions
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Settings className="h-4 w-4 mr-2" />
                      Access Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
