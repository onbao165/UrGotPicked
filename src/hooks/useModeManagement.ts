import { useState, useCallback } from 'react';
import { Player, SpinMode, TeamSetup } from '../types';
import { teamSetups } from '../configs/teamSetups';

export const useModeManagement = () => {
  const [mode, setMode] = useState<SpinMode | null>(null);
  const [setup, setSetup] = useState<TeamSetup | null>(null);

  const handleModeSelect = useCallback((
    selectedMode: SpinMode,
    resetTeam: () => void
  ) => {
    setMode(selectedMode);
    setSetup(teamSetups[selectedMode]);
    resetTeam();
  }, []);

  const handleGoBack = useCallback((
    resetTeam: () => void,
    setPlayers: (players: Player[]) => void
  ) => {
    setMode(null);
    setSetup(null);
    resetTeam();
    setPlayers([]);
  }, []);

  return {
    mode,
    setup,
    handleModeSelect,
    handleGoBack
  };
}; 