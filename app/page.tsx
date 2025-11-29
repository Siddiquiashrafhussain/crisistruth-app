"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Users, Search, AlertTriangle, Shield, Globe, Clock, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { LanguageSelector } from "@/components/language-selector"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/Gemini_Generate.png" alt="CrisisTruth Logo" width={90} height={52} className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              {t.nav.features}
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              {t.nav.howItWorks}
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              {t.nav.about}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <a href="/login">
              <Button variant="outline" className="bg-transparent border-2 hover:bg-primary/5">
                {t.nav.signIn}
              </Button>
            </a>
            <a href="/verify">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg">
                {t.nav.startVerifying}
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge variant="secondary" className="mb-6 bg-secondary/10 text-secondary border-secondary/20 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t.home.tagline}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 font-[family-name:var(--font-playfair)] text-balance leading-tight">
                {t.home.heroTitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl text-pretty leading-relaxed">
                {t.home.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8">
                    {t.home.startFactChecking}
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5 bg-transparent px-8"
                >
                  {t.home.viewDemo}
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/professional-fact-checking-dashboard-with-charts-a.png"
                alt="CrisisTruth Dashboard Preview"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl border border-border"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">Live Verification Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Alert Banner */}
      <section className="py-8 px-4 bg-gradient-to-r from-secondary/10 to-primary/10 border-y border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 text-center">
            <AlertTriangle className="h-6 w-6 text-secondary animate-pulse" />
            <p className="text-lg font-medium text-card-foreground">{t.home.crisisAlert}</p>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              Live 
            </Badge>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2.5M+</div>
              <div className="text-muted-foreground">Claims Verified</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">98.7%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">150+</div>
              <div className="text-muted-foreground">Countries Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">24/7</div>
              <div className="text-muted-foreground">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-[family-name:var(--font-playfair)]">
              {t.home.trustedTechnology}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.home.trustedTechnologyDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{t.home.realTimeAnalysis}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {t.home.realTimeAnalysisDesc}
                </CardDescription>
                <div className="mt-4">
                  <Image
                    src="/real-time-data-analysis-dashboard-with-charts-and-.png"
                    alt="Real-time Analysis"
                    width={300}
                    height={200}
                    className="rounded-lg border border-border w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Search className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">
                  {t.home.multiSourceVerification}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {t.home.multiSourceVerificationDesc}
                </CardDescription>
                <div className="mt-4">
                  <Image
                    src="/multiple-news-sources-and-verification-checkmarks-.png"
                    alt="Multi-source Verification"
                    width={300}
                    height={200}
                    className="rounded-lg border border-border w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{t.home.communityVerified}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {t.home.communityVerifiedDesc}
                </CardDescription>
                <div className="mt-4">
                  <Image
                    src="/community-of-fact-checkers-collaborating-on-verifi.png"
                    alt="Community Verification"
                    width={300}
                    height={200}
                    className="rounded-lg border border-border w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-[family-name:var(--font-playfair)]">
              {t.home.howItWorksTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.home.howItWorksDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="h-20 w-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-primary-foreground">1</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">{t.home.submitClaim}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{t.home.submitClaimDesc}</p>
              <Image
                src="/person-submitting-claim-on-mobile-device-interface.png"
                alt="Submit Claim"
                width={250}
                height={150}
                className="rounded-lg border border-border mx-auto"
              />
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="h-20 w-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-secondary-foreground">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-secondary/50 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">{t.home.aiAnalysis}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{t.home.aiAnalysisDesc}</p>
              <Image
                src="/ai-brain-analyzing-data-with-neural-network-connec.png"
                alt="AI Analysis"
                width={250}
                height={150}
                className="rounded-lg border border-border mx-auto"
              />
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="h-20 w-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">{t.home.getResults}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{t.home.getResultsDesc}</p>
              <Image
                src="/verification-results-with-checkmarks-and-confidenc.png"
                alt="Get Results"
                width={250}
                height={150}
                className="rounded-lg border border-border mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-[family-name:var(--font-playfair)]">
              Trusted by Organizations Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Leading news organizations, governments, and NGOs rely on CrisisTruth for accurate information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl font-bold text-card-foreground">ISO 27001 Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center">
                  Enterprise-grade security standards for protecting sensitive information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle className="text-xl font-bold text-card-foreground">Global Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center">
                  Supporting 50+ languages with local fact-checking expertise worldwide.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl font-bold text-card-foreground">24/7 Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center">
                  Continuous monitoring of emerging claims and crisis situations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-8">Trusted by leading organizations</p>
            <div className="flex justify-center items-center gap-12 opacity-60">
              <Image
                src="/generic-news-logo.png"
                alt="Partner 1"
                width={120}
                height={40}
                className="grayscale hover:grayscale-0 transition-all"
              />
              <Image
                src="/generic-government-logo.png"
                alt="Partner 2"
                width={120}
                height={40}
                className="grayscale hover:grayscale-0 transition-all"
              />
              <Image
                src="/ngo-organization-logo.png"
                alt="Partner 3"
                width={120}
                height={40}
                className="grayscale hover:grayscale-0 transition-all"
              />
              <Image
                src="/university-research-logo.png"
                alt="Partner 4"
                width={120}
                height={40}
                className="grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6 font-[family-name:var(--font-playfair)]">
            {t.home.joinFight}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">{t.home.joinFightDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg px-8">
                {t.home.getStartedFree}
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/5 bg-transparent px-8"
            >
              {t.home.learnMore}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Image src="/crisistruth-logo.png" alt="CrisisTruth Logo" width={100} height={24} className="h-6" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                AI-powered fact verification for a more informed world.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    {t.nav.features}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#about" className="hover:text-primary transition-colors">
                    {t.nav.about}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CrisisTruth. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
