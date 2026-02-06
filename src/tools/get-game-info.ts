import { FactorioTool } from './types.js';

export const getGameInfoTool: FactorioTool = {
  definition: {
    name: 'get_game_info',
    description: 'Get current game information and statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  handler: async (rconClient) => {
    // Get game info using multiple commands
    const tick = await rconClient.execute('/c rcon.print(game.tick)');
    const speed = await rconClient.execute('/c rcon.print(game.speed)');
    const players = await rconClient.execute('/players count');

    return `Game Info:\n- Tick: ${tick || 'Unknown'}\n- Speed: ${speed || 'Unknown'}\n- Players: ${players || 'Unknown'}`;
  },
};
