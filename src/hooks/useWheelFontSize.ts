import { useState, useEffect } from 'react'

export const useWheelFontSize = () => {
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setFontSize(20)
      } else {
        setFontSize(16)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return fontSize
} 