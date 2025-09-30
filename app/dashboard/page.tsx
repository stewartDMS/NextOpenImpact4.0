'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthModal } from '@/lib/auth-modal-context'
import { DashboardLayout } from '@/components/DashboardLayout'
import { AnalyticsCard, ESGScoreCard, ProjectCard } from '@/components/DashboardWidgets'
import { ProfileSection, TeamManagement } from '@/components/DashboardComponents'
import { logRoutingEvent, logEnvironmentDiagnostics } from '@/lib/routing-diagnostics'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { openModal } = useAuthModal()

  // Log environment diagnostics on component mount
  useEffect(() => {
    logEnvironmentDiagnostics()
    logRoutingEvent('dashboard_page_mounted', pathname, status, {
      hasSession: !!session,
      timestamp: new Date().toISOString()
    })
  }, [pathname, status, session])

  console.log("DASHBOARD PAGE SESSION:", session, "STATUS:", status)

  useEffect(() => {
    if (status === 'loading') {
      logRoutingEvent('dashboard_auth_loading', pathname, 'loading')
      return // Still loading
    }

    if (!session) {
      logRoutingEvent('dashboard_no_session_redirect', pathname, 'unauthenticated', {
        redirectTo: '/dashboard',
        reason: 'No session found - redirecting to trigger NextAuth flow'
      })
      // Open login modal and redirect to home to trigger authentication flow
      // After successful auth, NextAuth will redirect back to /dashboard
      openModal('login')
      router.push('/')
      return
    }

    logRoutingEvent('dashboard_access_granted', pathname, 'authenticated', {
      userId: session.user?.email,
      accountType: session.user?.accountType || 'general'
    })
  }, [session, status, router, openModal, pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Mock data for analytics
  const mockProjects = [
    {
      name: 'Clean Water Initiative',
      status: 'active' as const,
      progress: 75,
      description: 'Providing clean water access to underserved communities',
      impact: '500 people served',
      dueDate: '2024-12-31'
    },
    {
      name: 'Education Support Program',
      status: 'completed' as const,
      progress: 100,
      description: 'Supporting education in rural areas',
      impact: '200 students helped',
    },
    {
      name: 'Renewable Energy Project',
      status: 'pending' as const,
      progress: 25,
      description: 'Solar panel installation for community center',
      impact: '15 tons CO2 reduced',
      dueDate: '2025-03-15'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Active Projects"
            value="3"
            change="+2 this month"
            changeType="positive"
            icon="📋"
            description="Projects currently in progress"
          />
          <AnalyticsCard
            title="People Impacted"
            value="1,247"
            change="+15% from last month"
            changeType="positive"
            icon="🌍"
            description="Total individuals reached"
          />
          <AnalyticsCard
            title="CO2 Reduced"
            value="45.2 tons"
            change="+8.5 tons this month"
            changeType="positive"
            icon="🌱"
            description="Carbon footprint reduction"
          />
          <AnalyticsCard
            title="Completion Rate"
            value="87%"
            change="+3% from last month"
            changeType="positive"
            icon="🎯"
            description="Project success rate"
          />
        </div>

        {/* ESG Score and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ESGScoreCard
              environmental={78}
              social={85}
              governance={72}
              overall={78}
            />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-green-600">✅</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Project milestone completed</p>
                    <p className="text-xs text-gray-500">Clean Water Initiative - Phase 2 finished</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-blue-600">📊</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Impact report generated</p>
                    <p className="text-xs text-gray-500">Q3 2024 sustainability report is ready</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-purple-600">👥</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New team member joined</p>
                    <p className="text-xs text-gray-500">Carol Davis joined the Analytics team</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Create Project
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>

        {/* Profile and Team Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileSection />
          <TeamManagement />
        </div>
      </div>
    </DashboardLayout>
  )
}
