import { useState, useCallback, useEffect } from 'react';
import { Player, Role, TeamSetup } from '../types';

export const useTeamComposition = (setup: TeamSetup | null) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [pickOrder, setPickOrder] = useState(1);

  useEffect(() => {
    if (setup && setup.requiredRoles.length > 0) {
      setCurrentRole(setup.isCustom ? 'UNKNOWN' : setup.requiredRoles[0]);
    }
  }, [setup]);

  const addPlayer = useCallback((player: Player, role: Role) => {
    const updatedPlayer = {
      ...player,
      role: setup?.isCustom ? 'UNKNOWN' : role,
      pickOrder: pickOrder,
    };
    setSelectedPlayers(prev => [...prev, updatedPlayer]);
    setPickOrder(prev => prev + 1);

    // For custom mode, always set currentRole to UNKNOWN if more slots available
    if (setup) {
      if (setup.isCustom) {
        setCurrentRole('UNKNOWN');
      } else {
        const filledRoles = new Set([...selectedPlayers, updatedPlayer].map(p => p.role));
        const nextRole = setup.requiredRoles.find(role => !filledRoles.has(role));
        setCurrentRole(nextRole || null);
      }
    }
  }, [setup, pickOrder, selectedPlayers]);

  const removePlayer = useCallback((playerId: string) => {
    setSelectedPlayers(prev => {
      const filtered = prev.filter(p => p.id !== playerId);
      // Reorder remaining players
      const reordered = filtered.map((player, idx) => ({
        ...player,
        pickOrder: idx + 1
      }));
      
      // Update current role to the next available role
      if (setup) {
        const filledRoles = new Set(reordered.map(p => p.role));
        const nextRole = setup.requiredRoles.find(role => !filledRoles.has(role));
        setCurrentRole(nextRole || null);
      }
      
      return reordered;
    });
    setPickOrder(prev => Math.max(1, prev - 1));
  }, [setup]);

  const resetTeam = useCallback(() => {
    setSelectedPlayers([]);
    setPickOrder(1);
    // Always set the first available role when resetting
    if (setup) {
      setCurrentRole(setup.requiredRoles[0]);
    }
  }, [setup]);

  const getAvailableRoles = useCallback((): Role[] => {
    if (!setup) return [];
    if (setup.isCustom) {
      // For custom mode, return UNKNOWN if there are available slots
      const availableSlots = setup.maxPlayers - selectedPlayers.length;
      // Return an array of UNKNOWN roles for the available slots
      return Array(availableSlots).fill('UNKNOWN');
    }
    const filledRoles = new Set(selectedPlayers.map(p => p.role));
    return setup.requiredRoles.filter(role => !filledRoles.has(role));
  }, [setup, selectedPlayers]);

  return {
    selectedPlayers,
    currentRole,
    pickOrder,
    addPlayer,
    removePlayer,
    resetTeam,
    getAvailableRoles
  };
}; 