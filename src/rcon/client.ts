// @ts-ignore - rcon-srcds doesn't have TypeScript declarations
import Rcon from 'rcon-srcds';
import { Logger } from '../utils/logger.js';
import { ConnectionError, CommandError } from '../utils/errors.js';

export class FactorioRconClient {
  private rcon: InstanceType<typeof Rcon> | null = null;
  private host: string;
  private port: number;
  private password: string;
  private logger: Logger;
  private timeout: number = 5000;

  constructor(host: string, port: number, password: string) {
    this.host = host;
    this.port = port;
    this.password = password;
    this.logger = new Logger('RconClient');
  }

  async connect(): Promise<void> {
    try {
      this.logger.info('Connecting to RCON server', {
        host: this.host,
        port: this.port,
      });

      this.rcon = new Rcon({
        host: this.host,
        port: this.port,
        password: this.password,
        timeout: this.timeout,
      });

      await this.rcon.authenticate(this.password);
      this.logger.info('Connected to RCON server');
    } catch (error) {
      this.logger.error('Failed to connect to RCON server', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new ConnectionError(
        `Failed to connect to RCON server: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.rcon) {
        await this.rcon.disconnect();
        this.rcon = null;
        this.logger.info('Disconnected from RCON server');
      }
    } catch (error) {
      this.logger.error('Error disconnecting from RCON server', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async execute(command: string): Promise<string> {
    if (!this.rcon) {
      await this.connect();
    }

    if (!this.rcon) {
      throw new ConnectionError('RCON client not initialized');
    }

    try {
      this.logger.debug('Executing command', { command });
      const response = await this.rcon.execute(command);
      this.logger.debug('Command executed successfully', { command, response });
      return response;
    } catch (error) {
      this.logger.error('Command execution failed', {
        command,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new CommandError(
        `Failed to execute command "${command}": ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  isConnected(): boolean {
    return this.rcon !== null;
  }
}
