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
    <>
      {showNav && (
        <Navbar
          isGuest={isGuest}
          userEmail={user?.email}
          onSignOut={handleSignOut}
        />
      )}
      {children}
    </>
  )
}
