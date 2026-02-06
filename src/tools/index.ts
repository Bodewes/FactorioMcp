import { FactorioTool } from './types.js';
import { executeCommandTool } from './execute-command.js';
import { getGameInfoTool } from './get-game-info.js';
import { getPlayersTool } from './get-players.js';
import { runLuaTool } from './run-lua.js';
import { getEvolutionTool } from './get-evolution.js';
import { getResearchTool } from './get-research.js';
import { getProductionTool } from './get-production.js';

export const allTools: FactorioTool[] = [
  executeCommandTool,
  getGameInfoTool,
  getPlayersTool,
  runLuaTool,
  getEvolutionTool,
  getResearchTool,
  getProductionTool,
];

export * from './types.js';
