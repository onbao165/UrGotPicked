import { ReactNode, useState, useEffect } from 'react'
import styles from './LoadingWrapper.module.css'

interface LoadingWrapperProps {
  children: ReactNode
  isLoading: boolean
  minLoadTime?: number
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  isLoading,
  minLoadTime = 500,
}) => {
  const [shouldRender, setShouldRender] = useState(isLoading)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, minLoadTime)

      return () => clearTimeout(timer)
    } else {
      setShouldRender(true)
    }
  }, [isLoading, minLoadTime])

  if (shouldRender) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.urgotLoader}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.toxicDrip}></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default LoadingWrapper
