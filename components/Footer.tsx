export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">NextOpenImpact 4.0</h3>
            <p className="text-gray-300">
              Building the future of positive impact through innovative technology and community-driven solutions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="/api/hello" className="text-gray-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Technology</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Next.js 14</li>
              <li className="text-gray-300">React 18</li>
              <li className="text-gray-300">TypeScript</li>
              <li className="text-gray-300">Tailwind CSS</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 NextOpenImpact 4.0. Built with Next.js and deployed on Vercel.
          </p>
        </div>
      </div>
    </footer>
  )
}