import React from 'react';
import { Player, Role } from '../../types';
import styles from './TeamBanner.module.css';

interface TeamBannerProps {
  players: Player[];
  requiredRoles: Role[];
  maxPlayers: number;
  onRemovePlayer?: (playerId: string) => void;
}

const TeamBanner: React.FC<TeamBannerProps> = ({
  players,
  requiredRoles,
  maxPlayers,
  onRemovePlayer
}) => {
  const roleIcons = {
    TOP: '🗡️',
    JUNGLE: '🌲',
    MID: '🔮',
    ADC: '🏹',
    SUPPORT: '🛡️'
  };

  return (
    <div className={styles.bannerContainer}>
      <h2>Team Composition ({players.length}/{maxPlayers})</h2>
      <div className={styles.rolesContainer}>
        {requiredRoles.map((role) => {
          const player = players.find(p => p.role === role);
          return (
            <div key={role} className={styles.roleSlot}>
              <div className={styles.roleIcon}>{roleIcons[role]}</div>
              <div className={styles.roleLabel}>{role}</div>
              {player ? (
                <div className={styles.playerInfo}>
                  <span className={styles.pickOrder}>#{player.pickOrder}</span>
                  <span className={styles.playerName}>{player.name}</span>
                  {onRemovePlayer && (
                    <button
                      className={styles.removeButton}
                      onClick={() => onRemovePlayer(player.id)}
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
        })}
      </div>
    </div>
  );
};

export default React.memo(TeamBanner); 