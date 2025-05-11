import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from '../context/LanguageContext'
import { useConversations } from '../context/ConversationsContext'
import { LanguageToggle } from './LanguageToggle'
import { ChatClient } from "../api/ChatClient"
import { AuthService } from "../api/AuthService"
import { Conversation } from "../api/types"

const chatClient = new ChatClient()

const translations = {
  en: {
    title: 'Your AI Success Coach',
    subtitle: 'Transform your goals into achievements with personalized AI coaching. Get expert guidance, accountability, and support on your journey to success.',
    features: {
      guidance: {
        title: 'Personalized Guidance',
        description: 'Get tailored advice and strategies that match your unique goals and challenges.'
      },
      availability: {
        title: '24/7 Availability',
        description: 'Access your AI coach anytime, anywhere. Your coach is proactive.'
      },
      insights: {
        title: 'Data-Driven Insights',
        description: 'Track your progress and receive actionable insights to stay on course.'
      }
    },
    startButton: 'Start Now'
  },
  es: {
    title: 'Tu Coach de Éxito con IA',
    subtitle: 'Transforma tus objetivos en logros con coaching personalizado de IA. Obtén orientación experta, responsabilidad y apoyo en tu camino al éxito.',
    features: {
      guidance: {
        title: 'Orientación Personalizada',
        description: 'Obtén consejos y estrategias adaptados a tus objetivos y desafíos únicos.'
      },
      availability: {
        title: 'Disponibilidad 24/7',
        description: 'Accede a tu coach de IA en cualquier momento y lugar. Tu coach es proactivo.'
      },
      insights: {
        title: 'Análisis Basado en Datos',
        description: 'Monitorea tu progreso y recibe recomendaciones para mantenerte en el camino correcto.'
      }
    },
    startButton: 'Empieza Ahora'
  }
}

export function LandingPage() {
  const { language } = useLanguage()
  const { setConversations, setSelectedConversation } = useConversations()
  const t = translations[language]
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCode = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      
      if (code) {
        try {
          const response = await chatClient.exchangeCodeForToken(code)
          AuthService.setAuthData(response.access_token, response.user)
          AuthService.setJustLoggedIn(true)
          
          // Format and set conversations from the token response
          const formattedConversations: Conversation[] = response.conversations.map(conversationId => ({
            id: conversationId,
            title: "New Conversation",
            messages: []
          }))
          setConversations(formattedConversations)
          
          // Set the first conversation as selected
          if (formattedConversations.length > 0) {
            console.log('Setting selected conversation:', formattedConversations[0].id)
            setSelectedConversation(formattedConversations[0].id)
          }
          
          navigate('/chat')
        } catch (error) {
          console.error('Failed to exchange code for token:', error)
        }
      }
    }

    handleAuthCode()
  }, [navigate, setConversations])

  const handleStartClick = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/login`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>

          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          
          <p className="text-xl mb-12 text-gray-300">
            {t.subtitle}
          </p>

          <div className="space-y-8 mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{t.features.guidance.title}</h3>
                <p className="text-gray-400">{t.features.guidance.description}</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{t.features.availability.title}</h3>
                <p className="text-gray-400">{t.features.availability.description}</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{t.features.insights.title}</h3>
                <p className="text-gray-400">{t.features.insights.description}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartClick}
            className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
          >
            {t.startButton}
          </button>
        </div>
      </div>
    </div>
  )
} 