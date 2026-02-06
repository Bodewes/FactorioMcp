import { FactorioTool } from './types.js';

export const runLuaTool: FactorioTool = {
  definition: {
    name: 'run_lua',
    description: 'Execute Lua code in the Factorio environment',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Lua code to execute',
        },
        print_result: {
          type: 'boolean',
          description: 'Whether to return the result via rcon.print (default: true)',
        },
      },
      required: ['code'],
    },
  },

  handler: async (rconClient, args) => {
    const code = String(args.code || '');
    const printResult = args.print_result !== false;

    if (!code) {
      throw new Error('Lua code is required');
    }

    // Wrap code with rcon.print if requested
    let luaCommand = code;
    if (printResult && !code.includes('rcon.print')) {
      luaCommand = `rcon.print(tostring(${code}))`;
    }

    const result = await rconClient.execute(`/c ${luaCommand}`);
    return result || '(no output)';
  },
};
