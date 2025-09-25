const features = [
  {
    title: "Modern Architecture",
    description: "Built with Next.js 14 and the latest React features for optimal performance and developer experience.",
    icon: "🚀"
  },
  {
    title: "Scalable Design",
    description: "Designed to grow with your impact initiatives, from small projects to global movements.",
    icon: "📈"
  },
  {
    title: "Community Focused",
    description: "Open source and community-driven development for transparency and collaboration.",
    icon: "🤝"
  },
  {
    title: "Impact Tracking",
    description: "Built-in analytics and reporting to measure and showcase your positive impact.",
    icon: "📊"
  }
]

export function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Key Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create meaningful change in the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}