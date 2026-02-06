import { FactorioTool } from './types.js';

export const getEvolutionTool: FactorioTool = {
  definition: {
    name: 'get_evolution',
    description: 'Get current evolution factor and enemy statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  handler: async (rconClient) => {
    const evolution = await rconClient.execute('/c rcon.print(game.forces["enemy"].evolution_factor)');
    const killCount = await rconClient.execute('/c rcon.print(game.forces["enemy"].kill_count_statistics.get_input_count("character"))');

    return `Evolution:\n- Factor: ${evolution}\n- Player kills: ${killCount}`;
  },
};
