import { FactorioTool } from './types.js';

export const getProductionTool: FactorioTool = {
  definition: {
    name: 'get_production',
    description: 'Get production statistics for the factory',
    inputSchema: {
      type: 'object',
      properties: {
        item: {
          type: 'string',
          description: 'Optional: specific item to get stats for (e.g., "iron-plate")',
        },
      },
    },
  },

  handler: async (rconClient, args) => {
    const item = String(args.item || 'iron-plate');
    const production = await rconClient.execute(
      `/c local stats = game.forces["player"].item_production_statistics; ` +
      `local input = stats.get_input_count("${item}"); ` +
      `local output = stats.get_output_count("${item}"); ` +
      `rcon.print("Produced: " .. output .. ", Consumed: " .. input)`
    );

    return `Production stats for '${item}':\n${production}`;
  },
};
