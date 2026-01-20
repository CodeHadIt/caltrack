'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AppWrapper } from '@/components/app-wrapper'
import {
  UtensilsCrossed,
  Calculator,
  BarChart3,
  Apple,
  ArrowRight,
  Flame,
  Target,
  TrendingUp,
} from 'lucide-react'

const features = [
  {
    icon: Apple,
    title: 'Track Your Food',
    description: 'Log meals with our extensive food database. Add custom foods with full nutritional info.',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'See your progress with beautiful charts showing daily and weekly calorie trends.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Calculator,
    title: 'Smart Calculators',
    description: 'Calculate your TDEE and body fat percentage with scientific formulas.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Target,
    title: 'Reach Your Goals',
    description: 'Whether losing, maintaining, or gaining weight - track your journey to success.',
    color: 'from-blue-500 to-indigo-500',
  },
]

export default function Home() {
  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-12 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-6">
              <Flame className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Start tracking your nutrition today</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Your Personal Calorie Tracker
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track your meals, monitor macros, and achieve your fitness goals with CalTrack.
              No account needed to get started!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg px-8 h-14 rounded-xl shadow-lg shadow-emerald-500/25"
                >
                  Start Tracking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/calculators">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 rounded-xl border-2"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Try Calculators
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful features to help you understand and manage your nutrition
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 bg-white/60 dark:bg-slate-800/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold font-poppins text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-20">
          <Card className="border-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl">
            <CardContent className="py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div>
                  <div className="text-4xl md:text-5xl font-bold font-poppins mb-2">40+</div>
                  <div className="text-emerald-100">Default Foods</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold font-poppins mb-2">6</div>
                  <div className="text-emerald-100">Categories</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold font-poppins mb-2">2</div>
                  <div className="text-emerald-100">Calculators</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold font-poppins mb-2">0</div>
                  <div className="text-emerald-100">Signup Required</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <TrendingUp className="h-12 w-12 mx-auto mb-6 text-emerald-500" />
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who are already tracking their nutrition and achieving their goals.
              Start for free, no credit card required.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg px-8 h-14 rounded-xl shadow-lg shadow-emerald-500/25"
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
