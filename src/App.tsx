import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LandingPage } from "./components/LandingPage"
import { ChatPage } from "./components/ChatPage"
import { LanguageProvider } from "./context/LanguageContext"
import { ConversationsProvider } from "./context/ConversationsContext"

function App() {
  return (
    <LanguageProvider>
      <ConversationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </ConversationsProvider>
    </LanguageProvider>
  )
}

export default App
