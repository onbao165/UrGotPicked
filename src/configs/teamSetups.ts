import { SpinMode, TeamSetup } from '../types';

export const teamSetups: Record<SpinMode, TeamSetup> = {
  DUO: {
    mode: 'DUO',
    requiredRoles: ['ADC', 'SUPPORT'],
    maxPlayers: 2,
    isCustom: false,
  },
  TRIO: {
    mode: 'TRIO',
    requiredRoles: ['TOP', 'JUNGLE', 'MID'],
    maxPlayers: 3,
    isCustom: false,
  },
  FLEX: {
    mode: 'FLEX',
    requiredRoles: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'],
    maxPlayers: 5,
    isCustom: false,
  },
  CUSTOM: {
    mode: 'CUSTOM',
    requiredRoles: ['UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN'],
    maxPlayers: 5,
    isCustom: true,
  },
}; 