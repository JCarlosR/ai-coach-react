export function playNotificationSound() {
  const audio = new Audio('/notification.mp3')
  audio.volume = 0.3 // Set volume to 30% to not be too loud
  audio.play().catch(error => {
    console.error('Error playing sound:', error)
  })
} 