 "use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  User,
  Settings,
  CheckCircle,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  Building,
  Edit,
  Save,
  X,
} from "lucide-react"

import Image from "next/image"

// Mock user data
const mockUser = {
  id: 1,
  firstName: "Dr. Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@crisistruth.org",
  role: "fact-checker",
  organization: "Stanford University",
  specialization: "Medical Sciences",
  joinedDate: "2023-01-15",
  avatar: "/professional-woman-doctor.png",
  stats: {
    verificationsCount: 342,
    accuracyRate: 96.8,
    credibilityScore: 95,
    contributionsThisMonth: 23,
  },
  recentActivity: [
    {
      id: 1,
      type: "verification",
      claim: "New COVID variant spreads faster than previous strains",
      result: "verified",
      date: "2 hours ago",
    },
    {
      id: 2,
      type: "verification",
      claim: "Vitamin D supplements prevent respiratory infections",
      result: "disputed",
      date: "1 day ago",
    },
    {
      id: 3,
      type: "verification",
      claim: "mRNA vaccines alter human DNA",
      result: "disputed",
      date: "2 days ago",
    },
  ],
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    organization: user.organization,
    specialization: user.specialization,
  })

  const handleSave = () => {
    setUser((prev) => ({
      ...prev,
      ...editForm,
    }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization,
      specialization: user.specialization,
    })
    setIsEditing(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "fact-checker":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "journalist":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "verified":
        return "text-green-600"
      case "disputed":
        return "text-red-600"
      case "unverified":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
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
            <a href="/verify" className="text-foreground hover:text-primary transition-colors">
              Verify
            </a>
            <a href="/profile" className="text-primary font-medium">
              Profile
            </a>
          </nav>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-lg">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {user.firstName} {user.lastName}
                    </h1>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getRoleColor(user.role)}>{user.role.replace("-", " ").toUpperCase()}</Badge>
                      <span className="text-muted-foreground">{user.specialization}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {user.organization}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {user.joinedDate}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.verificationsCount}</div>
                    <div className="text-xs text-muted-foreground">Verifications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{user.stats.accuracyRate}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{user.stats.credibilityScore}</div>
                    <div className="text-xs text-muted-foreground">Credibility Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{user.stats.contributionsThisMonth}</div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Modal */}
        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={editForm.organization}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, organization: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={editForm.specialization}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, specialization: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Verification Activity</CardTitle>
                <CardDescription>Your latest fact-checking contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className={`h-5 w-5 ${getResultColor(activity.result)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-1">{activity.claim}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge
                            className={`${activity.result === "verified" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs`}
                          >
                            {activity.result.toUpperCase()}
                          </Badge>
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Badges Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="font-semibold text-sm">Expert Verifier</div>
                      <div className="text-xs text-muted-foreground">100+ Verifications</div>
                    </div>
                    <div className="text-center p-4 border border-border rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="font-semibold text-sm">High Accuracy</div>
                      <div className="text-xs text-muted-foreground">95%+ Accuracy Rate</div>
                    </div>
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-sm">Trusted Source</div>
                      <div className="text-xs text-muted-foreground">Verified Expert</div>
                    </div>
                    <div className="text-center p-4 border border-border rounded-lg">
                      <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-sm">Community Leader</div>
                      <div className="text-xs text-muted-foreground">Top Contributor</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">Featured in CrisisTruth Newsletter</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">Medical Sciences Expert Certification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm">Top Fact-Checker of the Month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Verifications</span>
                      <span className="font-semibold">{user.stats.verificationsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Accuracy Rate</span>
                      <span className="font-semibold text-green-600">{user.stats.accuracyRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-semibold">{user.stats.contributionsThisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Credibility Score</span>
                      <span className="font-semibold text-primary">{user.stats.credibilityScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Your verification performance has been consistently excellent over the past 6 months.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy Trend</span>
                      <span className="text-green-600">↗ +2.3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Contributions</span>
                      <span className="text-blue-600">↗ +15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span className="text-green-600">↗ Improved</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new claims and verifications
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">Privacy Settings</h4>
                        <p className="text-sm text-muted-foreground">Control who can see your profile and activity</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">Change Password</h4>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
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
