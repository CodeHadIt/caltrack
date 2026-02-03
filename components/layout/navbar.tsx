'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, User, LogOut, Calculator, LayoutDashboard, Apple, UtensilsCrossed, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface NavbarProps {
  isGuest: boolean
  userEmail?: string | null
  onSignOut?: () => void
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/foods', label: 'Foods', icon: Apple },
  { href: '/log', label: 'Log Food', icon: UtensilsCrossed },
  { href: '/calculators', label: 'Calculators', icon: Calculator },
]

export function Navbar({ isGuest, userEmail, onSignOut }: NavbarProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-coral/10 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center group">
            <Image
              src="/caltrack_logo.png"
              alt="CalTrack"
              width={180}
              height={40}
              className="object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'gap-2 font-medium text-muted-foreground hover:text-foreground hover:bg-coral/10 rounded-xl transition-all duration-200',
                      isActive && 'bg-coral/15 text-coral dark:text-coral-light shadow-sm'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', isActive && 'text-coral')} />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isGuest ? (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl font-medium">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="btn-gradient text-white rounded-xl font-semibold shadow-lg shadow-coral/25">
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Sign up
                </Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-coral/30 transition-all">
                  <Avatar className="h-10 w-10 border-2 border-coral/30">
                    <AvatarFallback className="bg-gradient-to-br from-coral to-rose text-white font-semibold">
                      {userEmail?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <div className="flex items-center gap-3 p-2 mb-1">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-coral to-rose text-white text-sm font-semibold">
                      {userEmail?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold truncate max-w-[160px]">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">Free Plan</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-coral/10" />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-coral/10" />
                <DropdownMenuItem onClick={onSignOut} className="rounded-lg cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l-coral/10">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-coral/10 rounded-xl h-12 text-base',
                          isActive && 'bg-coral/15 text-coral dark:text-coral-light'
                        )}
                      >
                        <Icon className={cn('h-5 w-5', isActive && 'text-coral')} />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
