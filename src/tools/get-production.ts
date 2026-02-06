import { FactorioTool } from './types.js';

export const getProductionTool: FactorioTool = {
  definition: {
    name: 'get_production',
    description: 'Get production statistics for items (requires production statistics to be enabled)',
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
    
    // Try to get production statistics - this may not be available in all game versions
    try {
      const checkStats = await rconClient.execute(
        `/c if game.forces["player"].item_production_statistics then ` +
        `rcon.print("available") else rcon.print("unavailable") end`
      );
      
      if (checkStats === 'unavailable') {
        // Fallback: count entities producing this item
        const entityCount = await rconClient.execute(
          `/c local count = game.surfaces[1].count_entities_filtered({type="assembling-machine"}); ` +
          `rcon.print("Factory has " .. count .. " assembling machines")`
        );
        return `Production statistics not available in this Factorio version.\n${entityCount}`;
      }
      
      // Statistics are available
      const production = await rconClient.execute(
        `/c local stats = game.forces["player"].item_production_statistics; ` +
        `local input = stats.get_input_count("${item}"); ` +
        `local output = stats.get_output_count("${item}"); ` +
        `rcon.print("Produced: " .. output .. ", Consumed: " .. input)`
      );
      
      return `Production stats for '${item}':\n${production}`;
    } catch (error) {
      return `Unable to get production statistics: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
