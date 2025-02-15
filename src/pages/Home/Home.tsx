import { useCallback } from 'react'
import Wheel from '../../components/Wheel/Wheel'
import { SpinMode, Role } from '../../types'
import styles from './Home.module.css'
import TeamBanner from '../../components/TeamBanner/TeamBanner'
import { useTeamComposition } from '../../hooks/useTeamComposition'
import { Row, Col } from 'antd'
import { useModeManagement } from '../../hooks/useModeManagement'
import { usePlayerManagement } from '../../hooks/usePlayerManagement'
import { useWheelManagement } from '../../hooks/useWheelManagement'
import { teamSetups } from '../../configs/teamSetups'
const Home = () => {
  const { mode, setup, handleModeSelect, handleGoBack } = useModeManagement()

  const {
    players,
    setPlayers,
    newPlayer,
    setNewPlayer,
    duplicateError,
    setDuplicateError,
    selectedRole,
    setSelectedRole,
    isDuplicate,
    handleAddPlayer,
    handleRemoveWheelPlayer,
    handleRemoveTeamPlayer,
  } = usePlayerManagement()

  const {
    mustSpin,
    setMustSpin,
    prizeNumber,
    handleSpinClick,
  } = useWheelManagement()

  const {
    selectedPlayers,
    currentRole,
    addPlayer,
    resetTeam,
    removePlayer,
    getAvailableRoles,
  } = useTeamComposition(setup)

  const handleSpinComplete = useCallback(
    (winner: string) => {
      setMustSpin(false)
      if (!setup || !currentRole) return

      const winningPlayer = players.find((p) => p.name === winner)
      if (!winningPlayer) return

      // Create updated state values FIRST
      const newPlayers = players.filter((p) => p.id !== winningPlayer.id)
      const newSelectedCount = selectedPlayers.length + 1
      const availableRoles = getAvailableRoles().filter(
        (role) => role !== currentRole,
      )
      // Update state in sequence
      setPlayers(newPlayers)
      addPlayer(winningPlayer, currentRole)

      // Check conditions using UPDATED values
      if (
        newPlayers.length === 1 &&
        newSelectedCount === setup.maxPlayers - 1
      ) {
        const lastPlayer = newPlayers[0]
        // Get available roles after the current player has been added
        // There should be exactly one role left
        if (availableRoles.length === 1) {
          const lastRole = availableRoles[0]
          setPlayers([])
          addPlayer(lastPlayer, lastRole)
        }
      }
    },
    [
      players,
      selectedPlayers,
      setup,
      currentRole,
      addPlayer,
      getAvailableRoles,
    ],
  )

  if (!mode) {
    return (
      <div className={styles.modeSelection}>
        <h1>Select Team Mode</h1>
        <div className={styles.modeButtons}>
          {Object.keys(teamSetups).map((setupMode) => (
            <button
              key={setupMode}
              onClick={() => handleModeSelect(setupMode as SpinMode, resetTeam)}
              className={styles.modeButton}
            >
              {setupMode}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>UrGotPicked</h1>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
          <div className={styles.bannerSection}>
            {setup && (
              <TeamBanner
                players={selectedPlayers}
                requiredRoles={setup.requiredRoles}
                maxPlayers={setup.maxPlayers}
                onRemovePlayer={(playerId) =>
                  handleRemoveTeamPlayer(playerId, selectedPlayers, removePlayer)
                }
              />
            )}
          </div>
        </Col>
        <Col xs={24} sm={24} md={14} lg={14} xl={14}>
          <div className={styles.wheelSection}>
            <div className={styles.playerManagement}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={newPlayer}
                  onChange={(e) => {
                    setNewPlayer(e.target.value)
                    setDuplicateError(isDuplicate(e.target.value, players))
                  }}
                  placeholder="Enter summoner name..."
                  className={`${styles.input} ${
                    duplicateError ? styles.inputError : ''
                  }`}
                />
                {duplicateError && (
                  <div className={styles.errorMessage}>✘ Already in pool</div>
                )}
                {setup && (
                  <select
                    value={selectedRole || ''}
                    onChange={(e) =>
                      setSelectedRole((e.target.value as Role) || null)
                    }
                    className={styles.roleSelect}
                  >
                    <option value="">Add to Wheel</option>
                    {setup.requiredRoles.map((role) => (
                      <option
                        key={role}
                        value={role}
                        disabled={selectedPlayers.some((p) => p.role === role)}
                      >
                        Add as {role}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() =>
                    handleAddPlayer(newPlayer, selectedRole as Role, addPlayer)
                  }
                  className={styles.addButton}
                >
                  Add Summoner
                </button>
                <button
                  onClick={() => handleGoBack(resetTeam, setPlayers)}
                  className={`${styles.button} ${styles.backButton}`}
                >
                  Go Back
                </button>
              </div>
              {players.length > 0 && (
                <div className={styles.wheelPlayers}>
                  <h3>Summoners in Wheel</h3>
                  <div className={styles.playersList}>
                    {players.map((player) => (
                      <div key={player.id} className={styles.playerItem}>
                        <span>{player.name}</span>
                        <button
                          onClick={() => handleRemoveWheelPlayer(player.id)}
                          className={styles.removeButton}
                          aria-label="Remove player"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {players.length > 1 && setup && (
              <>
                <Wheel
                  players={players.map((p) => p.name)}
                  onSpinComplete={handleSpinComplete}
                  mustSpin={mustSpin}
                  prizeNumber={prizeNumber}
                />
                <button
                  onClick={() =>
                    handleSpinClick(players, selectedPlayers, setup)
                  }
                  disabled={
                    mustSpin || selectedPlayers.length === setup.maxPlayers
                  }
                  className={styles.spinButton}
                >
                  Spin the Wheel
                </button>
                <button
                  onClick={resetTeam}
                  className={`${styles.button} ${styles.resetButton}`}
                >
                  Reset Team
                </button>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Home
