import { Share2, LogOut, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const motivationalMessages = [
  "Every conversation is a step towards growth",
  "Your journey to self-improvement starts now",
  "Embrace the power of meaningful conversations",
  "Transform your thoughts into actions",
  "Each chat brings you closer to your goals",
  "Your growth journey is unique and valuable",
  "Every interaction is an opportunity to learn",
  "Take your time, progress at your own pace"
]

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setMessage(motivationalMessages[randomIndex]);
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-full flex items-center justify-between px-4 py-3">
      <div className="flex-1 flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-accent md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 text-center px-0 md:px-2">
        <p className="text-sm font-medium text-muted-foreground">
          "{message}"
        </p>
      </div>
      <div className="flex-1 flex justify-end gap-2">
        <button
          onClick={() => {}} // Share functionality to be implemented
          className="p-2 rounded-md hover:bg-accent"
          title="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-md hover:bg-accent"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
} 