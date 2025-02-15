import { useState, useCallback } from 'react';
import { Player, Role } from '../types';

export const usePlayerManagement = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayer, setNewPlayer] = useState('');
    const [duplicateError, setDuplicateError] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const isDuplicate = useCallback((playerName: string, selectedPlayers: Player[]) => {
        return [...players, ...selectedPlayers].some(
            (p) => p.name.toLowerCase() === playerName.toLowerCase()
        );
    }, [players]);

    const handleAddPlayer = useCallback((newPlayer: string, selectedRole: Role, addPlayer: (player: Player, role: Role) => void) => {
        if (!newPlayer.trim() || duplicateError) return;

        if (duplicateError) {
            return;
        }

        if (selectedRole) {
            const newTeamPlayer = {
                name: newPlayer,
                id: crypto.randomUUID(),
            };
            addPlayer(newTeamPlayer, selectedRole);
        } else {
            setPlayers(prev => [...prev, { name: newPlayer, id: crypto.randomUUID() }]);
        }
        setNewPlayer('');
        setSelectedRole(null);
    }, [newPlayer, duplicateError, selectedRole]);

    const handleRemoveWheelPlayer = useCallback((playerId: string) => {
        setPlayers(prev => prev.filter(p => p.id !== playerId));
    }, []);

    const handleRemoveTeamPlayer = useCallback((playerId: string, selectedPlayers: Player[], removePlayer: (playerId: string) => void) => {
        const playerToRemove = selectedPlayers.find(p => p.id === playerId);
        if (playerToRemove) {
            setPlayers([...players, { name: playerToRemove.name, id: playerToRemove.id }]);
            removePlayer(playerId);
        }
    }, []);

    return {
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
        handleRemoveTeamPlayer
    };
}; 