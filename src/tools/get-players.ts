import { FactorioTool } from './types.js';

export const getPlayersTool: FactorioTool = {
  definition: {
    name: 'get_players',
    description: 'Get list of online players and their status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  handler: async (rconClient) => {
    // Get detailed player information
    const playersList = await rconClient.execute('/players');
    const playerCount = await rconClient.execute('/c rcon.print(#game.players)');
    const connectedCount = await rconClient.execute('/c rcon.print(#game.connected_players)');

    return `Players:\n- Total: ${playerCount}\n- Connected: ${connectedCount}\n\n${playersList}`;
  },
};
