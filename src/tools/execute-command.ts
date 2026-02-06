import { FactorioTool } from './types.js';

export const executeCommandTool: FactorioTool = {
  definition: {
    name: 'execute_command',
    description: 'Execute a Factorio console command',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The console command to execute',
        },
      },
      required: ['command'],
    },
  },

  handler: async (rconClient, args) => {
    const command = String(args.command || '');

    if (!command) {
      throw new Error('Command is required');
    }

    const result = await rconClient.execute(command);
    return result || '(no output)';
  },
};
