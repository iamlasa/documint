import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Zap, History, Box } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-semibold">
              <span className="text-primary">docu</span>mint
            </span>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center pt-16">
        <div className="container px-4 py-32">
          <div className="mx-auto max-w-[800px] text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <span className="text-primary">New</span>
              <span className="mx-2">•</span>
              <span className="text-muted-foreground">Bulk content management is here</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Manage Contentful with
              <span className="block text-primary">unmatched speed</span>
            </h1>
            
            <p className="mx-auto max-w-[600px] text-xl text-muted-foreground">
              Replace complex Contentful workflows with Documint, the only platform designed to make your content team faster—and happier.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Book a demo
              </Button>
            </div>

            <div className="pt-8 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <span>⭐️ 4.9</span>
                <span>•</span>
                <span>500+ teams use Documint</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/50 py-24" id="features">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage content
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features that help your team work faster and smarter.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl bg-background p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Smart Search</h3>
              <p className="text-muted-foreground">
                Find content instantly with our powerful search engine designed for content teams.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-background p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Bulk Operations</h3>
              <p className="text-muted-foreground">
                Edit multiple entries simultaneously. Save hours of manual work.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-background p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Version Control</h3>
              <p className="text-muted-foreground">
                Track changes and restore previous versions with comprehensive history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="relative overflow-hidden rounded-3xl bg-primary">
            <div className="relative z-10 px-8 py-16 text-white md:px-16 md:py-24">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to transform your content workflow?
                </h2>
                <p className="mt-4 text-lg opacity-90">
                  Join hundreds of teams who have already simplified their Contentful management.
                </p>
                <div className="mt-8">
                  <Button size="lg" variant="secondary">
                    Get started now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-semibold">
                <span className="text-primary">docu</span>mint
              </span>
              <span className="text-sm text-muted-foreground">
                © 2024 Documint. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}