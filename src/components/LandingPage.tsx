import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Your AI Success Coach
          </h1>
          
          <p className="text-xl mb-12 text-gray-300">
            Transform your goals into achievements with personalized AI coaching. 
            Get expert guidance, accountability, and support on your journey to success.
          </p>

          <div className="space-y-8 mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Personalized Guidance</h3>
                <p className="text-gray-400">Get tailored advice and strategies that match your unique goals and challenges.</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
                <p className="text-gray-400">Access your AI coach anytime, anywhere. No scheduling needed.</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Data-Driven Insights</h3>
                <p className="text-gray-400">Track your progress and receive actionable insights to stay on course.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  )
} 