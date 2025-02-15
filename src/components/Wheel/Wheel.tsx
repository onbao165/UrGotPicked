import React, { memo, useMemo, useCallback } from 'react'
import { Wheel as RouletteWheel } from 'react-custom-roulette'
import styles from './Wheel.module.css'
import { useWheelFontSize } from '../../hooks/useWheelFontSize'
import indicatorImage from '/images/indicator.png'

interface WheelProps {
  players: string[]
  onSpinComplete: (winner: string) => void
  mustSpin: boolean
  prizeNumber: number
}

const Wheel: React.FC<WheelProps> = ({
  players,
  onSpinComplete,
  mustSpin,
  prizeNumber,
}) => {
  const fontSize = useWheelFontSize()

  const getBackgroundColors = useMemo(() => {
    return Array(players.length)
      .fill('')
      .map((_, index) => {
        const ratio = index / players.length
        const primary = [16, 49, 29] // Dark industrial green
        const secondary = [0, 255, 178] // Toxic green (Urgot's theme)

        // Calculate color interpolation
        const r = Math.round(primary[0] + (secondary[0] - primary[0]) * ratio)
        const g = Math.round(primary[1] + (secondary[1] - primary[1]) * ratio)
        const b = Math.round(primary[2] + (secondary[2] - primary[2]) * ratio)

        return `rgba(${r}, ${g}, ${b})`
      })
  }, [players.length])

  const wheelData = useMemo(
    () =>
      players.map((player) => ({
        option: player,
        style: {
          textColor: '#E7F6F2',
          fontFamily: 'Beaufort',
        },
      })),
    [players],
  )

  const handleStopSpinning = useCallback(() => {
    onSpinComplete(players[prizeNumber])
  }, [onSpinComplete, players, prizeNumber])

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.wheelWrapper}>
        <RouletteWheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={handleStopSpinning}
          backgroundColors={getBackgroundColors}
          textColors={['#FEFFB1']}
          outerBorderColor="transparent"
          outerBorderWidth={3}
          innerRadius={0}
          radiusLineColor="#EDFF7A"
          radiusLineWidth={3}
          fontSize={fontSize}
          spinDuration={0.6}
          pointerProps={{
            src: indicatorImage,
          }}
          disableInitialAnimation={true}
          // perpendicularText={true}
        />
      </div>
    </div>
  )
}

export default memo(Wheel)
