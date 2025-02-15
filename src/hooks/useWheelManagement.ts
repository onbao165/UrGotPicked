import { useState, useCallback } from 'react';
import { TeamSetup, Player } from '../types';

export const useWheelManagement = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = useCallback((
    players: Player[], 
    selectedPlayers: Player[], 
    setup: TeamSetup | null
  ) => {
    if (!mustSpin && selectedPlayers.length !== setup?.maxPlayers) {
      const newPrizeNumber = Math.floor(Math.random() * players.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  }, [mustSpin]);

  return {
    mustSpin,
    setMustSpin,
    prizeNumber,
    setPrizeNumber,
    handleSpinClick,
  };
}; 