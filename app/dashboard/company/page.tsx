'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthModal } from '@/lib/auth-modal-context'
import { DashboardLayout } from '@/components/DashboardLayout'

// Modular components for company dashboard sections
function CompanyHeader() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tesla, Inc.</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
              <span><strong>Ticker:</strong> TSLA</span>
              <span><strong>Sector:</strong> Automotive & Electric Vehicles</span>
              <span><strong>Location:</strong> Austin, Texas, USA</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            View Reports
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            Export Data
          </button>
        </div>
      </div>
    </div>
  )
}

function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">92</div>
          <div className="text-sm text-gray-600">ESG Score</div>
          <div className="text-xs text-green-600 mt-1">↗️ +5 pts YoY</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">95</div>
          <div className="text-sm text-gray-600">Environmental</div>
          <div className="text-xs text-green-600 mt-1">↗️ Industry Leading</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
          <div className="text-sm text-gray-600">Social</div>
          <div className="text-xs text-green-600 mt-1">↗️ +3 pts</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">87</div>
          <div className="text-sm text-gray-600">Governance</div>
          <div className="text-xs text-yellow-600 mt-1">↔️ Stable</div>
        </div>
      </div>
    </div>
  )
}

function ESGTrendsChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ESG Trends</h3>
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-sm">ESG Trends Chart</p>
          <p className="text-xs">Chart visualization will be integrated here</p>
        </div>
      </div>
    </div>
  )
}

function ImpactMetrics() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">8.4M</div>
          <div className="text-sm text-gray-600">Tons CO2 Avoided</div>
          <div className="text-xs text-green-600 mt-1">↗️ +2.1M this year</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">127,855</div>
          <div className="text-sm text-gray-600">Global Employees</div>
          <div className="text-xs text-green-600 mt-1">↗️ +15% growth</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">$96B</div>
          <div className="text-sm text-gray-600">Market Cap</div>
          <div className="text-xs text-green-600 mt-1">↗️ Sustainable growth</div>
        </div>
      </div>
    </div>
  )
}

function PeerComparison() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Peer Comparison</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tesla (TSLA)</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <span className="text-sm font-medium">92</span>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">You</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">General Motors (GM)</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '74%' }}></div>
            </div>
            <span className="text-sm font-medium">74</span>
            <span className="text-xs text-gray-600">Peer</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Ford Motor (F)</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '69%' }}></div>
            </div>
            <span className="text-sm font-medium">69</span>
            <span className="text-xs text-gray-600">Peer</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Industry Average</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-gray-400 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
            <span className="text-sm font-medium">67</span>
            <span className="text-xs text-gray-600">Baseline</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Overview() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h3>
      <div className="prose text-gray-600">
        <p className="mb-4">
          Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas. 
          Tesla designs and manufactures electric vehicles, battery energy storage systems, solar panels and solar roof tiles, 
          and related products and services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Highlights</h4>
            <ul className="space-y-1 text-sm">
              <li>• World&apos;s most valuable automaker</li>
              <li>• Leading electric vehicle manufacturer</li>
              <li>• Sustainable energy solutions provider</li>
              <li>• Advanced autonomous driving technology</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">ESG Focus Areas</h4>
            <ul className="space-y-1 text-sm">
              <li>• Carbon footprint reduction</li>
              <li>• Sustainable manufacturing</li>
              <li>• Employee diversity & inclusion</li>
              <li>• Ethical supply chain management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecentESGUpdates() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent ESG Updates</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-green-600 text-lg">🌱</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Carbon Neutral Manufacturing Milestone</p>
            <p className="text-xs text-gray-500 mt-1">Achieved carbon neutrality across all Tesla manufacturing facilities</p>
            <span className="text-xs text-gray-400">2 days ago</span>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-blue-600 text-lg">👥</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Diversity & Inclusion Report Published</p>
            <p className="text-xs text-gray-500 mt-1">Annual D&I report shows 40% increase in underrepresented groups</p>
            <span className="text-xs text-gray-400">1 week ago</span>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-purple-600 text-lg">🔋</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Battery Recycling Program Expansion</p>
            <p className="text-xs text-gray-500 mt-1">Expanded battery recycling program to 95% material recovery rate</p>
            <span className="text-xs text-gray-400">2 weeks ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ESGCertifications() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ESG Certifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-medium text-gray-900">LEED Platinum</div>
          <div className="text-sm text-gray-600">Manufacturing Facilities</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">⭐</div>
          <div className="font-medium text-gray-900">B Corp Certified</div>
          <div className="text-sm text-gray-600">Social & Environmental</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl mb-2">🌍</div>
          <div className="font-medium text-gray-900">ISO 14001</div>
          <div className="text-sm text-gray-600">Environmental Management</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl mb-2">🤝</div>
          <div className="font-medium text-gray-900">SA8000</div>
          <div className="text-sm text-gray-600">Social Accountability</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl mb-2">🔒</div>
          <div className="font-medium text-gray-900">SOC 2 Type II</div>
          <div className="text-sm text-gray-600">Data Security</div>
        </div>
        <div className="text-center p-4 bg-teal-50 rounded-lg">
          <div className="text-2xl mb-2">♻️</div>
          <div className="font-medium text-gray-900">Cradle to Cradle</div>
          <div className="text-sm text-gray-600">Circular Economy</div>
        </div>
      </div>
    </div>
  )
}

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

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header section with company info and action buttons */}
        <CompanyHeader />
        
        {/* Key Metrics section */}
        <KeyMetrics />
        
        {/* ESG Trends Chart section */}
        <ESGTrendsChart />
        
        {/* Impact Metrics section */}
        <ImpactMetrics />
        
        {/* Peer Comparison section */}
        <PeerComparison />
        
        {/* Overview section */}
        <Overview />
        
        {/* Recent ESG Updates section */}
        <RecentESGUpdates />
        
        {/* ESG Certifications section */}
        <ESGCertifications />
      </div>
    </DashboardLayout>
  )
}