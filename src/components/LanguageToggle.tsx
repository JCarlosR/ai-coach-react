import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div className="inline-flex rounded-lg bg-gray-800 p-1">
      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
          language === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => language !== 'es' && toggleLanguage()}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
          language === 'es' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        ES
      </button>
    </div>
  )
} 