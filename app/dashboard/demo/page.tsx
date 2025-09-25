'use client'

import { ReactNode, useState } from 'react'

// Dashboard Layout that doesn't require authentication
function DemoDashboardLayout({ children, mockUser }: { 
  children: ReactNode, 
  mockUser: { name?: string; email?: string; accountType?: string } 
}) {
  const accountType = mockUser?.accountType || 'general'

  const navigationItems = [
    {
      name: 'Overview',
      href: '/dashboard/demo',
      icon: '📊',
      general: true,
      company: true
    },
    {
      name: 'Projects',
      href: '/dashboard/demo/projects',
      icon: '📋',
      general: true,
      company: true
    },
    {
      name: 'Analytics',
      href: '/dashboard/demo/analytics',
      icon: '📈',
      general: true,
      company: true
    },
    {
      name: 'Company Dashboard',
      href: '/dashboard/demo/company',
      icon: '🏢',
      general: false,
      company: true
    },
    {
      name: 'Team',
      href: '/dashboard/demo/team',
      icon: '👥',
      general: true,
      company: true
    },
    {
      name: 'Profile',
      href: '/dashboard/demo/profile',
      icon: '👤',
      general: true,
      company: true
    }
  ]

  const filteredNavItems = navigationItems.filter(item => 
    accountType === 'general' ? item.general : item.company
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="text-xl font-bold text-white">
            NextOpenImpact 4.0
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {filteredNavItems.map((item) => (
              <div
                key={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              {mockUser?.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {mockUser?.name || 'Demo User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {accountType === 'company' ? '🏢' : '👤'} {accountType}
              </div>
            </div>
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
                Dashboard Demo - {accountType === 'company' ? 'Company' : 'General User'}
              </h1>
              <div className="text-sm text-gray-500">
                Welcome, {mockUser?.name || 'Demo User'}!
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

// Import the widgets
import { AnalyticsCard, ESGScoreCard, ProjectCard } from '@/components/DashboardWidgets'

export default function DashboardDemo() {
  const [accountType, setAccountType] = useState('general')
  
  const mockUser = {
    name: accountType === 'company' ? 'Acme Corp' : 'John Doe',
    email: accountType === 'company' ? 'admin@acme.corp' : 'john.doe@example.com',
    accountType: accountType
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
    }
  ]

  const currentProjects = accountType === 'company' ? companyProjects : mockProjects

  return (
    <DemoDashboardLayout mockUser={mockUser}>
      <div className="space-y-8">
        {/* Account Type Toggle */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">Dashboard Demo Mode</h3>
              <p className="text-sm text-blue-700 mt-1">
                Switch between General User and Company account types to see different dashboard views.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setAccountType('general')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  accountType === 'general' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-blue-600 border border-blue-300'
                }`}
              >
                👤 General
              </button>
              <button
                onClick={() => setAccountType('company')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  accountType === 'company' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-purple-600 border border-purple-300'
                }`}
              >
                🏢 Company
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accountType === 'general' ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* ESG Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ESGScoreCard
              environmental={accountType === 'company' ? 82 : 78}
              social={accountType === 'company' ? 88 : 85}
              governance={accountType === 'company' ? 79 : 72}
              overall={accountType === 'company' ? 83 : 78}
            />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {accountType === 'company' ? 'Industry Benchmarking' : 'Recent Activity'}
              </h3>
              {accountType === 'company' ? (
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
                </div>
              ) : (
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {accountType === 'company' ? 'Company Initiatives' : 'Active Projects'}
            </h2>
            <button className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
              accountType === 'company' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
              {accountType === 'company' ? 'Launch Initiative' : 'Create Project'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
    </DemoDashboardLayout>
  )
}