'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export function ProfileSection() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)

  if (!session) return null

  const accountType = session.user?.accountType || 'general'
  const isCompany = accountType === 'company'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start space-x-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user?.name || 'User'}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                {session.user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isCompany ? 'Company Name' : 'Full Name'}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={session.user?.name || ''}
                  />
                ) : (
                  <p className="text-gray-900">{session.user?.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{session.user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <div className="flex items-center">
                  <span className="mr-2">{isCompany ? '🏢' : '👤'}</span>
                  <span className="capitalize text-gray-900">{accountType}</span>
                </div>
              </div>

              {isCompany && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    {isEditing ? (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Finance</option>
                        <option>Manufacturing</option>
                        <option>Education</option>
                        <option>Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">Technology</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                    {isEditing ? (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option>201-1000 employees</option>
                        <option>1000+ employees</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">11-50 employees</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    ) : (
                      <p className="text-gray-900">https://example.com</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: 'active' | 'pending'
}

export function TeamManagement() {
  const [showInviteForm, setShowInviteForm] = useState(false)
  
  // Mock team data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Project Manager',
      status: 'active'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'Developer',
      status: 'active'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      role: 'Analyst',
      status: 'pending'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Invite Member
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Invite Form */}
        {showInviteForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Invite Team Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select role</option>
                <option>Admin</option>
                <option>Project Manager</option>
                <option>Developer</option>
                <option>Analyst</option>
                <option>Viewer</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Members List */}
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{member.role}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {member.status}
                </span>
                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}