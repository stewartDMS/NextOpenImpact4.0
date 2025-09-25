'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface DashboardLayoutProps {
  children: ReactNode
}

const navigationItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: '📊',
    general: true,
    company: true
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: '📋',
    general: true,
    company: true
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: '📈',
    general: true,
    company: true
  },
  {
    name: 'Company Dashboard',
    href: '/dashboard/company',
    icon: '🏢',
    general: false,
    company: true
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: '👥',
    general: true,
    company: true
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: '👤',
    general: true,
    company: true
  }
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (!session) {
    router.push('/login')
    return null
  }

  const accountType = session.user?.accountType || 'general'
  const filteredNavItems = navigationItems.filter(item => 
    accountType === 'general' ? item.general : item.company
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
          <Link href="/" className="text-xl font-bold text-white">
            NextOpenImpact 4.0
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user?.name || 'User'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {session.user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {session.user?.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {accountType === 'company' ? '🏢' : '👤'} {accountType}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                {pathname === '/dashboard' && 'Dashboard Overview'}
                {pathname === '/dashboard/company' && 'Company Dashboard'}
                {pathname === '/dashboard/projects' && 'Projects'}
                {pathname === '/dashboard/analytics' && 'Analytics'}
                {pathname === '/dashboard/team' && 'Team Management'}
                {pathname === '/dashboard/profile' && 'Profile'}
              </h1>
              <div className="text-sm text-gray-500">
                Welcome back, {session.user?.name}!
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}