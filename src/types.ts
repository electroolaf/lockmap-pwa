export interface Zuhaltung {
  id: number;
  position: number; // Current slider position (1 to maxPositions)
  status: 'unknown' | 'suspected' | 'confirmed';
  notes: string;
  isTesting: boolean;
}

export interface Session {
  id: string;
  name: string;
  createdAt: Date;
  zuhaltungenCount: number;
  positionsPerZuhaltung: number;
  zuhaltungen: Zuhaltung[];
  isActive: boolean;
  progress: number; // Number of confirmed zuhaltungen
}

export interface AppState {
  currentSession: Session | null;
  sessions: Session[];
  zuhaltungenCount: number;
  positionsPerZuhaltung: number;
  lockName: string;
}