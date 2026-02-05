'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Navbar } from '@/components/layout/navbar'
import { useRouter } from 'next/navigation'

interface AppWrapperProps {
  children: React.ReactNode
  showNav?: boolean
}

export function AppWrapper({ children, showNav = true }: AppWrapperProps) {
  const { isGuest, user, signOut, isLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
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
