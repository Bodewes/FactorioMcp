import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from './utils/logger.js';
import { config } from './utils/config.js';
import { FactorioRconClient } from './rcon/client.js';
import { allTools } from './tools/index.js';

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

    // Register tool list handler
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: allTools.map(tool => ({
          name: tool.definition.name,
          description: tool.definition.description,
          inputSchema: {
            type: 'object' as const,
            properties: tool.definition.inputSchema.properties,
            required: tool.definition.inputSchema.required,
          },
        })),
      };
    });

    // Register tool execution handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      logger.info('Tool called', { tool: request.params.name });

      const toolName = request.params.name;
      const tool = allTools.find(t => t.definition.name === toolName);

      if (!tool) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${toolName}`,
            },
          ],
        };
      }

      try {
        // Connect to RCON if not already connected
        if (!rconClient['socket'] || rconClient['socket'].destroyed) {
          logger.debug('Connecting to RCON server');
          await rconClient.connect();
        }

        // Execute the tool handler
        const result = await tool.handler(rconClient, request.params.arguments || {});

        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        logger.error(`Tool '${toolName}' execution failed`, {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });

    // Start server
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('Factorio MCP Server started successfully', {
      tools: allTools.length,
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down...');
      await rconClient.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Shutting down...');
      await rconClient.disconnect();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

main();
