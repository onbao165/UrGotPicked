import React, { memo } from 'react'
import { Wheel as RouletteWheel } from 'react-custom-roulette'
import styles from './Wheel.module.css'

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
  // Create alternating colors for wheel segments
  const getBackgroundColors = (count: number) => {
    return Array(count)
      .fill('')
      .map((_, index) => {
        const ratio = index / count
        const primary = [16, 49, 29] // Dark industrial green
        const secondary = [0, 255, 178] // Toxic green (Urgot's theme)

        // Calculate color interpolation
        const r = Math.round(primary[0] + (secondary[0] - primary[0]) * ratio)
        const g = Math.round(primary[1] + (secondary[1] - primary[1]) * ratio)
        const b = Math.round(primary[2] + (secondary[2] - primary[2]) * ratio)

        return `rgba(${r}, ${g}, ${b})`
      })
  }

  const data = players.map((player) => ({
    option: player,
    style: {
      textColor: '#E7F6F2',
      fontFamily: 'Beaufort',
    },
  }))

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.wheelWrapper}>
        <RouletteWheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            onSpinComplete(players[prizeNumber])
          }}
          backgroundColors={getBackgroundColors(players.length)}
          textColors={['#FEFFB1']}
          outerBorderColor="transparent"
          outerBorderWidth={3}
          innerRadius={0}
          radiusLineColor="#EDFF7A"
          radiusLineWidth={3}
          fontSize={16}
          spinDuration={0.6}
          pointerProps={{
            src: 'images/indicator.png',
            style: {
              width: '5rem',
              height: '5rem',
              top: '2rem',
              right: '0.8rem',
            },
          }}
          disableInitialAnimation={true}
          perpendicularText={true}
        />
      </div>
    </div>
  )
}

export default memo(Wheel)
