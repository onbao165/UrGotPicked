import React from 'react';
import { Player, Role, TeamSetup } from '../../types';
import styles from './TeamBanner.module.css';

interface TeamBannerProps {
  players: Player[];
  requiredRoles: Role[];
  maxPlayers: number;
  onRemovePlayer?: (playerId: string) => void;
  setup?: TeamSetup;
}

const TeamBanner: React.FC<TeamBannerProps> = ({
  players,
  requiredRoles,
  maxPlayers,
  onRemovePlayer,
  setup
}) => {
  const roleIcons = {
    TOP: '🗡️',
    JUNGLE: '🌲',
    MID: '🔮',
    ADC: '🏹',
    SUPPORT: '🛡️',
    UNKNOWN: '❓'
  };

  const renderSlot = (role: Role, index: number) => {
    let player: Player | undefined;
    
    if (setup?.isCustom) {
      // In custom mode, get player by index
      player = players[index];
    } else {
      // In normal mode, get player by role
      player = players.find(p => p.role === role);
    }

    return (
      <div key={`${role}-${index}`} className={styles.roleSlot}>
        <div className={styles.roleIcon}>{roleIcons[role]}</div>
        <div className={styles.roleLabel}>{role}</div>
        {player ? (
          <div className={styles.playerInfo}>
            <span className={styles.pickOrder}>#{player.pickOrder}</span>
            <span className={styles.playerName}>{player.name}</span>
            {onRemovePlayer && (
              <button
                className={styles.removeButton}
                onClick={() => onRemovePlayer(player!.id)}
                aria-label="Remove player"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div className={styles.emptySlot}>---</div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.bannerContainer}>
      <h2>Team Composition ({players.length}/{maxPlayers})</h2>
      <div className={styles.rolesContainer}>
        {requiredRoles.map((role, index) => renderSlot(role, index))}
      </div>
    </div>
  );
};

export default React.memo(TeamBanner); 