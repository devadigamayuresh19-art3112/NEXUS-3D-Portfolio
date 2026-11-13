import { useEffect, useState } from 'react'

const formatTime = (timeZone) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(new Date())

export default function useLocalTime(timeZone = 'Asia/Kolkata') {
  const [time, setTime] = useState(() => formatTime(timeZone))

  useEffect(() => {
    const timer = window.setInterval(
      () => setTime(formatTime(timeZone)),
      30_000,
    )

    return () => window.clearInterval(timer)
  }, [timeZone])

  return time
}
