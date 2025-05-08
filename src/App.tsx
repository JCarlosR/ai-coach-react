import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LandingPage } from "./components/LandingPage"
import { ChatPage } from "./components/ChatPage"
import { LanguageProvider } from "./context/LanguageContext"

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
