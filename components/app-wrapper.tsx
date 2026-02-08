'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Navbar } from '@/components/layout/navbar'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface AppWrapperProps {
  children: React.ReactNode
  showNav?: boolean
}

export function AppWrapper({ children, showNav = true }: AppWrapperProps) {
  const { isGuest, user, signOut, isLoading } = useAuth()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.push('/')
  }

  if (isSigningOut) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-coral/20 blur-3xl blob-shape" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-rose/20 blur-3xl blob-shape" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-peach/15 blur-3xl blob-shape" style={{ animationDelay: '4s' }} />

        <div className="relative flex flex-col items-center gap-6 animate-fade-in-up">
          {/* Animated icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-coral to-rose flex items-center justify-center shadow-lg shadow-coral/30 animate-pulse">
              <LogOut className="h-9 w-9 text-white" />
            </div>
            {/* Spinning ring */}
            <div className="absolute -inset-3 rounded-[1.75rem] border-2 border-transparent border-t-coral/60 border-r-coral/30 animate-spin" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-semibold font-display text-foreground">Signing out...</p>
            <p className="text-sm text-muted-foreground">See you next time!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <Navbar
          isGuest={isGuest}
          userEmail={user?.email}
          onSignOut={handleSignOut}
        />
      )}
      <div className="flex-1">
        {children}
      </div>
      <footer className="py-6 border-t border-coral/10 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CalTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
