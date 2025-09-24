export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="container text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          NextOpenImpact 4.0
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Building the future of positive impact through innovative technology and community-driven solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">
            Get Started
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}