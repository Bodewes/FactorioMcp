import * as dotenv from 'dotenv';

dotenv.config();

interface RconConfig {
  host: string;
  port: number;
  password: string;
}

interface McpConfig {
  serverName: string;
}

interface AppConfig {
  rcon: RconConfig;
  mcp: McpConfig;
  logLevel: string;
  nodeEnv: string;
}

function validateConfig(): AppConfig {
  const host = process.env.FACTORIO_RCON_HOST;
  const port = process.env.FACTORIO_RCON_PORT;
  const password = process.env.FACTORIO_RCON_PASSWORD;
  const serverName = process.env.MCP_SERVER_NAME;

  if (!host || !port || !password) {
    throw new Error(
      'Missing required environment variables: FACTORIO_RCON_HOST, FACTORIO_RCON_PORT, FACTORIO_RCON_PASSWORD'
    );
  }

  return {
    rcon: {
      host,
      port: parseInt(port, 10),
      password,
    },
    mcp: {
      serverName: serverName || 'factorio-mcp',
    },
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

export const config = validateConfig();
