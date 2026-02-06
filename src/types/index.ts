export interface GameInfo {
  version: string;
  time: number;
  evolution: number;
  playerCount: number;
}

export interface Player {
  name: string;
  online: boolean;
  playTime: number;
}

export interface ToolInput {
  [key: string]: unknown;
}
