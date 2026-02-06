import { FactorioRconClient } from '../rcon/client.js';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolHandler {
  (rconClient: FactorioRconClient, args: Record<string, unknown>): Promise<string>;
}

export interface FactorioTool {
  definition: ToolDefinition;
  handler: ToolHandler;
}
