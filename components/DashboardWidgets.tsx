interface AnalyticsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: string
  description?: string
}

export function AnalyticsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description 
}: AnalyticsCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColor}`}>
              {changeType === 'positive' ? '↗️' : changeType === 'negative' ? '↘️' : '→'} {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface ESGScoreCardProps {
  environmental: number
  social: number
  governance: number
  overall: number
}

export function ESGScoreCard({ environmental, social, governance, overall }: ESGScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const scores = [
    { label: 'Environmental', value: environmental, color: 'bg-green-500' },
    { label: 'Social', value: social, color: 'bg-blue-500' },
    { label: 'Governance', value: governance, color: 'bg-purple-500' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">🌍</span>
        <h3 className="text-lg font-semibold text-gray-900">ESG Score</h3>
      </div>
      
      <div className={`text-center mb-4 p-4 rounded-lg ${getScoreColor(overall)}`}>
        <div className="text-3xl font-bold">{overall}</div>
        <div className="text-sm">Overall Score</div>
      </div>

      <div className="space-y-3">
        {scores.map((score) => (
          <div key={score.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{score.label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${score.color}`}
                  style={{ width: `${score.value}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-8">{score.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProjectCardProps {
  name: string
  status: 'active' | 'completed' | 'pending'
  progress: number
  description: string
  impact: string
  dueDate?: string
}

export function ProjectCard({ name, status, progress, description, impact, dueDate }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-green-600">
          <span className="mr-1">🌱</span>
          {impact}
        </div>
        {dueDate && (
          <div className="text-gray-500">
            Due: {dueDate}
          </div>
        )}
      </div>
    </div>
  )
}