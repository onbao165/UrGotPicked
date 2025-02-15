export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT' | 'UNKNOWN';

export interface Player {
  name: string;
  id: string;
  role?: Role;
  pickOrder?: number;
}

export type SpinMode = 'DUO' | 'TRIO' | 'FLEX' | 'CUSTOM';

export interface TeamSetup {
  mode: SpinMode;
  requiredRoles: Role[];
  maxPlayers: number;
  isCustom?: boolean;
}

export interface TeamComposition {
  players: Player[];
  currentRole: Role | null;
  pickOrder: number;
}  