'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthModal } from '@/lib/auth-modal-context'
import { DashboardLayout } from '@/components/DashboardLayout'
import { AnalyticsCard, ESGScoreCard, ProjectCard } from '@/components/DashboardWidgets'
import { ProfileSection, TeamManagement } from '@/components/DashboardComponents'

export default function CompanyDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { openModal } = useAuthModal()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      openModal('login')
      router.push('/')
      return
    }

    // Redirect general users to regular dashboard
    if (session.user?.accountType !== 'company') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router, openModal])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.accountType !== 'company') {
    return null
  }

  // Mock data for company analytics
  const companyProjects = [
    {
      name: 'Corporate Sustainability Program',
      status: 'active' as const,
      progress: 85,
      description: 'Company-wide sustainability initiatives and carbon neutrality goals',
      impact: '12,500 employees engaged',
      dueDate: '2024-12-31'
    },
    {
      name: 'Supply Chain Optimization',
      status: 'active' as const,
      progress: 60,
      description: 'Optimizing supply chain for reduced environmental impact',
      impact: '2,300 tons CO2 saved',
      dueDate: '2025-02-28'
    },
    {
      name: 'Community Investment Initiative',
      status: 'completed' as const,
      progress: 100,
      description: 'Supporting local communities through education and infrastructure',
      impact: '50,000 people benefited',
    },
    {
      name: 'Renewable Energy Transition',
      status: 'pending' as const,
      progress: 30,
      description: 'Transitioning all facilities to renewable energy sources',
      impact: '85% renewable energy target',
      dueDate: '2025-06-30'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Company Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="ESG Initiatives"
            value="12"
            change="+4 this quarter"
            changeType="positive"
            icon="🌍"
            description="Active sustainability programs"
          />
          <AnalyticsCard
            title="Employees Engaged"
            value="12,547"
            change="+23% engagement rate"
            changeType="positive"
            icon="👥"
            description="Team members participating"
          />
          <AnalyticsCard
            title="Carbon Footprint"
            value="2,340 tons"
            change="-15% from last year"
            changeType="positive"
            icon="🌱"
            description="CO2 equivalent reduced"
          />
          <AnalyticsCard
            title="Investment Impact"
            value="$2.4M"
            change="+$400k this year"
            changeType="positive"
            icon="💰"
            description="Total impact investment"
          />
        </div>

        {/* ESG Score and Industry Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ESGScoreCard
              environmental={82}
              social={88}
              governance={79}
              overall={83}
            />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Benchmarking</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall ESG Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                    <span className="text-sm font-medium">83/100</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Above Average</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Industry Average</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                    <span className="text-sm font-medium">67/100</span>
                    <span className="text-xs text-gray-600">Baseline</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top Performer</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium">94/100</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Target</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Specific Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Impact Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-sm text-gray-600">Community Members Reached</div>
              <div className="text-xs text-green-600 mt-1">↗️ +25% YoY</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Renewable Energy Usage</div>
              <div className="text-xs text-green-600 mt-1">↗️ +12% this year</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Employee Satisfaction</div>
              <div className="text-xs text-green-600 mt-1">↗️ +5% improvement</div>
            </div>
          </div>
        </div>

        {/* Company Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Company Initiatives</h2>
            <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Launch Initiative
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>

        {/* Profile and Team Management for Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileSection />
          <TeamManagement />
        </div>
      </div>
    </DashboardLayout>
  )
}