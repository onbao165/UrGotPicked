import { useState, useCallback } from 'react';
import { Player, Role, TeamSetup } from '../types';

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
            console.log(players);
            setPlayers(prev => [...prev, { name: playerToRemove.name, id: playerToRemove.id }]);
            removePlayer(playerId);
        }
    }, []);

    const handleResetTeam = useCallback((selectedPlayers: Player[], resetTeam: () => void) => {
        setPlayers(prev => [...prev, ...selectedPlayers]);
        resetTeam();
    }, []);

    const handleRapidPick = useCallback((
        players: Player[],
        setup: TeamSetup | null,
        addPlayer: (player: Player, role: Role) => void,
        availableRoles: Role[]
    ) => {
        if (!setup) return;

        const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
        const teamPlayers: Player[] = [];

        if (setup.isCustom) {
            // For custom mode, just add players with UNKNOWN role
            shuffledPlayers.slice(0, setup.maxPlayers).forEach((player) => {
                addPlayer(player, 'UNKNOWN');
                teamPlayers.push(player);
            });
        } else {
            // For normal modes, match players with roles
            const roles = [...availableRoles];
            shuffledPlayers.slice(0, availableRoles.length).forEach((player, index) => {
                addPlayer(player, roles[index]);
                teamPlayers.push(player);
            });
        }

        // Remove team players from pool
        setPlayers(prev => prev.filter(p => !teamPlayers.includes(p)));
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
        handleRemoveTeamPlayer,
        handleResetTeam,
        handleRapidPick
    };
}; 