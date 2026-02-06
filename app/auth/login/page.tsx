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
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast.error('Failed to sign in', {
          description: error.message,
        })
        setIsLoading(false)
        return
      }

      toast.success('Welcome back!')
      // Force a full page refresh to ensure cookies are properly set on mobile
      router.refresh()
      router.push('/dashboard')
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
              <CardTitle className="text-3xl font-display font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base mt-2">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="relative pb-8">
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link
                  href="/auth/signup"
                  className="text-coral hover:text-coral font-semibold hover:underline underline-offset-4"
                >
                  Sign up
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
