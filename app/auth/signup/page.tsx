'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AppWrapper } from '@/components/app-wrapper'
import { useAuth } from '@/lib/hooks/use-auth'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        toast.error('Failed to sign up', {
          description: error.message,
        })
        setIsLoading(false)
        return
      }

      toast.success('Account created!', {
        description: 'Please check your email to verify your account.',
      })
      // Use hard redirect to ensure cookies are properly set on mobile
      window.location.href = '/dashboard'
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <AppWrapper showNav={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center mb-10 group">
            <Image
              src="/caltrack_logo.png"
              alt="CalTrack"
              width={200}
              height={90}
              className="object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          <Card className="border-0 card-glow bg-card/90 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 rounded-full bg-coral/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 -ml-10 -mb-10 rounded-full bg-peach/10 blur-3xl" />
            <CardHeader className="text-center relative pt-8">
              <CardTitle className="text-3xl font-display font-bold">Create Account</CardTitle>
              <CardDescription className="text-base mt-2">
                Sign up to sync your data across devices
              </CardDescription>
            </CardHeader>
            <CardContent className="relative pb-8">
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-coral/10 to-rose/10 border border-coral/20">
                <div className="flex items-center gap-2 text-coral">
                  <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold">Your guest data will be synced!</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-10">
                  All food logs and custom foods will be transferred to your new account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-coral" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-14 h-12 rounded-xl border-coral/20 focus:border-coral/40 focus:ring-coral/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium">Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-coral" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-14 h-12 rounded-xl border-coral/20 focus:border-coral/40 focus:ring-coral/20"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-medium">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-coral" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-14 h-12 rounded-xl border-coral/20 focus:border-coral/40 focus:ring-coral/20"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-gradient text-white h-12 rounded-xl font-semibold shadow-lg shadow-coral/25 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link
                  href="/auth/login"
                  className="text-coral hover:text-coral font-semibold hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Continue as guest →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppWrapper>
  )
}
