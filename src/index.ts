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
