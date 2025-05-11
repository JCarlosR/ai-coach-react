import { useEffect, useState } from 'react';
import { AuthService } from '../api/AuthService';
import confetti from 'canvas-confetti';

interface WelcomeMessageProps {
  onClose: () => void;
}

export function WelcomeMessage({ onClose }: WelcomeMessageProps) {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const user = AuthService.getUser();
    if (user?.name) {
      setUserName(user.name);
      
      const ticks = 60;
      const startVelocity = 30;
      const duration = (ticks / startVelocity) * 1000; // Calculate actual confetti duration
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          AuthService.clearJustLoggedIn();
          onClose();
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          startVelocity,
          spread: 360,
          ticks,
          zIndex: 0,
          particleCount,
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [onClose]);

  if (!userName) return null;

  const isFreshLogin = AuthService.isJustLoggedIn();
  const title = isFreshLogin ? `Welcome, ${userName}!` : 'Welcome back!';
  const message = isFreshLogin 
    ? "Let's start your journey to success" 
    : "Let's continue your journey to success";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-background p-8 rounded-lg shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
} 