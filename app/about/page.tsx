export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            About NextOpenImpact 4.0
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              NextOpenImpact 4.0 is designed to empower organizations and individuals 
              to create meaningful, measurable positive impact in their communities and beyond.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">What's New in 4.0</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Modern Next.js 14 architecture with App Router</li>
              <li>Enhanced performance and SEO optimization</li>
              <li>Improved accessibility and responsive design</li>
              <li>Advanced impact tracking and analytics</li>
              <li>Seamless Vercel deployment integration</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">⚛️</div>
                <div className="font-medium">React 18</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-medium">Next.js 14</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-medium">Tailwind CSS</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium">TypeScript</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}