import { useState, useCallback } from 'react';
import Wheel from '../../components/Wheel/Wheel';
import { Player, SpinMode, TeamSetup, Role } from '../../types';
import styles from './Home.module.css';
import TeamBanner from '../../components/TeamBanner/TeamBanner';
import { useTeamComposition } from '../../hooks/useTeamComposition';
import { Row, Col } from 'antd';

const teamSetups: Record<SpinMode, TeamSetup> = {
  DUO: {
    mode: 'DUO',
    requiredRoles: ['ADC', 'SUPPORT'],
    maxPlayers: 2
  },
  TRIO: {
    mode: 'TRIO',
    requiredRoles: ['TOP', 'JUNGLE', 'MID'],
    maxPlayers: 3
  },
  FLEX: {
    mode: 'FLEX',
    requiredRoles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'],
    maxPlayers: 5
  },
  CUSTOM: {
    mode: 'CUSTOM',
    requiredRoles: [],
    maxPlayers: 0
  }
};

const Home = () => {
  const [mode, setMode] = useState<SpinMode | null>(null);
  const [setup, setSetup] = useState<TeamSetup | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const {
    selectedPlayers,
    currentRole,
    addPlayer,
    removePlayer,
    resetTeam
  } = useTeamComposition(setup);

  const handleModeSelect = (selectedMode: SpinMode) => {
    setMode(selectedMode);
    setSetup(teamSetups[selectedMode]);
    resetTeam();
  };

  const handleAddPlayer = () => {
    if (!newPlayer.trim()) return;
    
    // Check if player name already exists
    const isDuplicate = [...players, ...selectedPlayers].some(
      p => p.name.toLowerCase() === newPlayer.toLowerCase()
    );
    
    if (isDuplicate) {
      return; // Don't add duplicate names
    }
    
    if (selectedRole) {
      const newTeamPlayer = { 
        name: newPlayer, 
        id: crypto.randomUUID(),
      };
      addPlayer(newTeamPlayer, selectedRole);
    } else {
      setPlayers([...players, { name: newPlayer, id: crypto.randomUUID() }]);
    }
    setNewPlayer('');
    setSelectedRole(null);
  };

  const handleRemoveWheelPlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleRemovePlayer = (playerId: string) => {
    const playerToRemove = selectedPlayers.find(p => p.id === playerId);
    if (playerToRemove) {
      setPlayers([...players, { name: playerToRemove.name, id: playerToRemove.id }]);
      removePlayer(playerId);
    }
  };

  const handleResetTeam = () => {
    setPlayers([...players, ...selectedPlayers.map(p => ({ name: p.name, id: p.id }))]);
    resetTeam();
  };

  const handleSpinComplete = useCallback((winner: string) => {
    setMustSpin(false);
    if (!setup || !currentRole) return;
    const winningPlayer = players.find(p => p.name === winner);
    if (!winningPlayer) return;

    // Remove the player first to prevent state inconsistency
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== winningPlayer.id));
    // Then add them to the team
    addPlayer(winningPlayer, currentRole);
  }, [players, setup, currentRole, addPlayer]);

  const handleSpinClick = () => {
    if (!mustSpin && selectedPlayers.length !== setup?.maxPlayers) {
      const newPrizeNumber = Math.floor(Math.random() * players.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleGoBack = () => {
    setMode(null);
    setSetup(null);
    resetTeam();
    setPlayers([]);
  };

  if (!mode) {
    return (
      <div className={styles.modeSelection}>
        <h1>Select Team Mode</h1>
        <div className={styles.modeButtons}>
          {Object.keys(teamSetups).map((setupMode) => (
            <button
              key={setupMode}
              onClick={() => handleModeSelect(setupMode as SpinMode)}
              className={styles.modeButton}
            >
              {setupMode}
            </button>
          ))}
        </div>
      </div>
    );
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
                onRemovePlayer={handleRemovePlayer}
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
                  onChange={(e) => setNewPlayer(e.target.value)}
                  placeholder="Enter summoner name..."
                  className={styles.input}
                />
                {setup && (
                  <select
                    value={selectedRole || ''}
                    onChange={(e) => setSelectedRole(e.target.value as Role || null)}
                    className={styles.roleSelect}
                  >
                    <option value="">Add to Wheel</option>
                    {setup.requiredRoles.map(role => (
                      <option 
                        key={role} 
                        value={role}
                        disabled={selectedPlayers.some(p => p.role === role)}
                      >
                        Add as {role}
                      </option>
                    ))}
                  </select>
                )}
                <button onClick={handleAddPlayer} className={styles.addButton}>
                  Add Summoner
                </button>
                <button
                  onClick={handleGoBack}
                  className={`${styles.button} ${styles.backButton}`}
                >
                  Go Back
                </button>
              </div>
              {players.length > 0 && (
                <div className={styles.wheelPlayers}>
                  <h3>Summoners in Wheel</h3>
                  <div className={styles.playersList}>
                    {players.map(player => (
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
                  players={players.map(p => p.name)}
                  onSpinComplete={handleSpinComplete}
                  mustSpin={mustSpin}
                  prizeNumber={prizeNumber}
                />
                <button
                  onClick={handleSpinClick}
                  disabled={mustSpin || selectedPlayers.length === setup.maxPlayers}
                  className={styles.spinButton}
                >
                  Spin the Wheel
                </button>
                <button 
                  onClick={handleResetTeam}
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
  );
};

export default Home; 