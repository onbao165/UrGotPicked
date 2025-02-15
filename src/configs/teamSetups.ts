import { SpinMode, TeamSetup } from '../types';

export const teamSetups: Record<SpinMode, TeamSetup> = {
  DUO: {
    mode: 'DUO',
    requiredRoles: ['ADC', 'SUPPORT'],
    maxPlayers: 2,
  },
  TRIO: {
    mode: 'TRIO',
    requiredRoles: ['TOP', 'JUNGLE', 'MID'],
    maxPlayers: 3,
  },
  FLEX: {
    mode: 'FLEX',
    requiredRoles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'],
    maxPlayers: 5,
  },
  CUSTOM: {
    mode: 'CUSTOM',
    requiredRoles: [],
    maxPlayers: 5,
  },
}; 