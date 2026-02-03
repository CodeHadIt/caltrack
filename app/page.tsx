'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AppWrapper } from '@/components/app-wrapper'
import {
  Calculator,
  BarChart3,
  Apple,
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Apple,
    title: 'Track Your Food',
    description: 'Log meals with our extensive food database. Add custom foods with full nutritional info.',
    color: 'bg-gradient-to-br from-coral to-rose',
    iconBg: 'bg-coral/10',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'See your progress with beautiful charts showing daily and weekly calorie trends.',
    color: 'bg-gradient-to-br from-sage to-emerald-400',
    iconBg: 'bg-sage/10',
  },
  {
    icon: Calculator,
    title: 'Smart Calculators',
    description: 'Calculate your TDEE and body fat percentage with scientific formulas.',
    color: 'bg-gradient-to-br from-sky to-blue-400',
    iconBg: 'bg-sky/10',
  },
  {
    icon: Target,
    title: 'Reach Your Goals',
    description: 'Whether losing, maintaining, or gaining weight - track your journey to success.',
    color: 'bg-gradient-to-br from-honey to-amber-400',
    iconBg: 'bg-honey/10',
  },
]

export default function Home() {
  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-16 md:py-28 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-coral/10 dark:bg-coral/20 px-5 py-2.5 rounded-full mb-8 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-coral" />
              <span className="text-sm font-semibold text-coral dark:text-coral-light">Start tracking your nutrition today</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-display mb-8 leading-[1.1] animate-fade-in-up animate-delay-100">
              <span className="text-gradient">Your Personal</span>
              <br />
              <span className="text-foreground">Calorie Tracker</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Track your meals, monitor macros, and achieve your fitness goals with CalTrack.
              <span className="text-foreground font-medium"> No account needed to get started!</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="btn-gradient text-white text-lg px-10 h-14 rounded-2xl shadow-xl shadow-coral/30 font-semibold"
                >
                  Start Tracking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/calculators">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 rounded-2xl border-2 border-coral/20 hover:bg-coral/5 hover:border-coral/40 font-medium"
                >
                  <Calculator className="mr-2 h-5 w-5 text-coral" />
                  Try Calculators
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-sage/10 px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4 text-sage" />
              <span className="text-sm font-semibold text-sage">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Powerful features to help you understand and manage your nutrition
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-0 bg-card/80 backdrop-blur-sm card-glow hover-lift cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"
                    style={{ background: `var(--color-${feature.color.includes('coral') ? 'coral' : feature.color.includes('sage') ? 'sage' : feature.color.includes('sky') ? 'sky' : 'honey'})` }}
                  />
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold font-display text-xl mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24">
          <Card className="border-0 bg-gradient-to-br from-coral via-rose to-peach shadow-2xl shadow-coral/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50" />
            <CardContent className="py-14 relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div className="group">
                  <div className="text-5xl md:text-6xl font-extrabold font-display mb-2 group-hover:scale-110 transition-transform">40+</div>
                  <div className="text-white/80 font-medium">Default Foods</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-extrabold font-display mb-2 group-hover:scale-110 transition-transform">6</div>
                  <div className="text-white/80 font-medium">Categories</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-extrabold font-display mb-2 group-hover:scale-110 transition-transform">2</div>
                  <div className="text-white/80 font-medium">Calculators</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-extrabold font-display mb-2 group-hover:scale-110 transition-transform">0</div>
                  <div className="text-white/80 font-medium">Signup Required</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-coral/20 to-rose/20 flex items-center justify-center">
              <Heart className="h-10 w-10 text-coral" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
              Ready to Transform
              <br />
              <span className="text-gradient">Your Health?</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg max-w-lg mx-auto">
              Join thousands of users who are already tracking their nutrition and achieving their goals.
              <span className="text-foreground font-medium"> Start for free, no credit card required.</span>
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="btn-gradient text-white text-lg px-12 h-16 rounded-2xl shadow-xl shadow-coral/30 font-semibold"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </AppWrapper>
  )
}
