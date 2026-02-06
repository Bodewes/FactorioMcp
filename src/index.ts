import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from './utils/logger.js';
import { config } from './utils/config.js';
import { FactorioRconClient } from './rcon/client.js';

const logger = new Logger('factorio-mcp');

async function main(): Promise<void> {
  try {
    logger.info('Starting Factorio MCP Server');
    logger.debug('Configuration loaded', {
      host: config.rcon.host,
      port: config.rcon.port,
    });

    // Initialize RCON client
    const rconClient = new FactorioRconClient(
      config.rcon.host,
      config.rcon.port,
      config.rcon.password
    );

    // Initialize MCP Server
    const server = new Server(
      {
        name: config.mcp.serverName,
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Register tool handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'execute_command',
            description: 'Execute a Factorio console command',
            inputSchema: {
              type: 'object' as const,
              properties: {
                command: {
                  type: 'string',
                  description: 'The console command to execute',
                },
              },
              required: ['command'],
            },
          },
          {
            name: 'get_game_info',
            description: 'Get current game information and statistics',
            inputSchema: {
              type: 'object' as const,
              properties: {},
            },
          },
          {
            name: 'get_players',
            description: 'Get list of online players and their status',
            inputSchema: {
              type: 'object' as const,
              properties: {},
            },
          },
          {
            name: 'run_lua',
            description: 'Execute Lua code in the Factorio environment',
            inputSchema: {
              type: 'object' as const,
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
          {
            name: 'get_evolution',
            description: 'Get current evolution factor and enemy statistics',
            inputSchema: {
              type: 'object' as const,
              properties: {},
            },
          },
          {
            name: 'get_research',
            description: 'Get current and queued research progress',
            inputSchema: {
              type: 'object' as const,
              properties: {},
            },
          },
          {
            name: 'get_production',
            description: 'Get production statistics for the factory',
            inputSchema: {
              type: 'object' as const,
              properties: {
                item: {
                  type: 'string',
                  description: 'Optional: specific item to get stats for (e.g., "iron-plate")',
                },
              },
            },
          },
        ],
      };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      logger.info('Tool called', { tool: request.params.name });

      if (request.params.name === 'execute_command') {
        const args = request.params.arguments as Record<string, unknown>;
        const command = args.command as string;
        if (!command) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: command parameter is required',
              },
            ],
          };
        }

        try {
          const result = await rconClient.execute(command);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          logger.error('Command execution failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
          };
        }
      }

      if (request.params.name === 'get_game_info') {
        try {
          // Get game info using multiple commands
          const tick = await rconClient.execute('/c rcon.print(game.tick)');
          const speed = await rconClient.execute('/c rcon.print(game.speed)');
          const players = await rconClient.execute('/players count');
          
          const info = {
            tick: tick || 'Unknown',
            speed: speed || 'Unknown',
            players: players || 'Unknown',
          };

          return {
            content: [
              {
                type: 'text',
                text: `Game Info:\n- Tick: ${info.tick}\n- Speed: ${info.speed}\n- Players: ${info.players}`,
              },
            ],
          };
        } catch (error) {
          logger.error('Failed to get game info', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Error getting game info: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
          };
        }
      }

      if (request.params.name === 'get_players') {
        try {
          // Get detailed player information
          const playersList = await rconClient.execute('/players');
          const playerCount = await rconClient.execute('/c rcon.print(#game.players)');
          const connectedCount = await rconClient.execute('/c rcon.print(#game.connected_players)');

          return {
            content: [
              {
                type: 'text',
                text: `Players:\n- Total: ${playerCount}\n- Connected: ${connectedCount}\n\n${playersList}`,
              },
            ],
          };
        } catch (error) {
          logger.error('Failed to get players', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Error getting players: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
          };
        }
      }

      if (request.params.name === 'run_lua') {
        try {
          const code = String(request.params.arguments?.code || '');
          const printResult = request.params.arguments?.print_result !== false;

          if (!code) {
            return {
              content: [
                {
                  type: 'text',
                  text: 'Error: Lua code is required',
                },
              ],
            };
          }

          // Wrap code with rcon.print if requested
          let luaCommand = code;
          if (printResult && !code.includes('rcon.print')) {
            luaCommand = `rcon.print(tostring(${code}))`;
          }

          const result = await rconClient.execute(`/c ${luaCommand}`);

          return {
            content: [
              {
                type: 'text',
                text: result || '(no output)',
              },
            ],
          };
        } catch (error) {
          logger.error('Lua execution failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Error executing Lua: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
          };
        }
      }

      if (request.params.name === 'get_evolution') {
        try {
          const evolution = await rconClient.execute('/c rcon.print(game.forces["enemy"].evolution_factor)');
          const killCount = await rconClient.execute('/c rcon.print(game.forces["enemy"].kill_count_statistics.get_input_count("character"))');
          
          return {
            content: [
              {
                type: 'text',
                text: `Evolution:\n- Factor: ${evolution}\n- Player kills: ${killCount}`,
              },
            ],
          };
        } catch (error) {
          logger.error('Failed to get evolution', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Error getting evolution: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
          };
        }
      }

      if (request.params.name === 'get_research') {
        try {
          const currentResearch = await rconClient.execute('/c local r = game.forces["player"].current_research; rcon.print(r and r.name or "none")');
          const progress = await rconClient.execute('/c rcon.print(game.forces["player"].research_progress)');
          
          return {
            content: [
              {
                type: 'text',
                text: `Research:\n- Current: ${currentResearch}\n- Progress: ${progress}`,
              },
            ],
          };
        } catch (error) {
          logger.error('Failed to get research', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Error getting research: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
          };
        }
      }

      if (request.params.name === 'get_production') {
        try {
          const item = String(request.params.arguments?.item || 'iron-plate');
          const production = await rconClient.execute(
            `/c local stats = game.forces["player"].item_production_statistics; ` +
            `local input = stats.get_input_count("${item}"); ` +
            `local output = stats.get_output_count("${item}"); ` +
            `rcon.print("Produced: " .. output .. ", Consumed: " .. input)`
          );
          
          return {
            content: [
              {
                type: 'text',
                text: `Production stats for '${item}':\n${production}`,
              },
            ],
          };
        } catch (error) {
          logger.error('Failed to get production', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Error getting production: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
          };
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${request.params.name}`,
          },
        ],
      };
    });

    // Connect and serve
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('Factorio MCP Server started successfully');
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
