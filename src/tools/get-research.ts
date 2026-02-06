import { FactorioTool } from './types.js';

export const getResearchTool: FactorioTool = {
  definition: {
    name: 'get_research',
    description: 'Get current and queued research progress',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  handler: async (rconClient) => {
    const currentResearch = await rconClient.execute('/c local r = game.forces["player"].current_research; rcon.print(r and r.name or "none")');
    const progress = await rconClient.execute('/c rcon.print(game.forces["player"].research_progress)');

    return `Research:\n- Current: ${currentResearch}\n- Progress: ${progress}`;
  },
};
