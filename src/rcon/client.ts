import { Logger } from '../utils/logger.js';
import { ConnectionError, CommandError } from '../utils/errors.js';
import { Socket } from 'net';

enum PacketType {
  RESPONSE_VALUE = 0,
  EXECCOMMAND = 2,
  AUTH_RESPONSE = 2,
  AUTH = 3,
}

interface RconMessage {
  id: number;
  type: PacketType;
  body: string | null;
}

export class FactorioRconClient {
  private socket: Socket | null = null;
  private logger: Logger;
  private packetId = 0;
  private connected = false;
  private timeout = 10000;

  constructor(
    private host: string,
    private port: number,
    private password: string
  ) {
    this.logger = new Logger('FactorioRconClient');
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.socket = new Socket();
      this.socket.setTimeout(this.timeout);

      this.socket.once('error', reject);
      this.socket.once('timeout', () => {
        reject(new ConnectionError('Connection timeout'));
      });

      this.socket.connect(this.port, this.host, async () => {
        this.socket?.removeListener('error', reject);
        
        try {
          this.logger.info('Authenticating to RCON server', {
            host: this.host,
            port: this.port,
          });
          
          this.packetId = 0;
          await this.sendPacket(this.packetId, PacketType.AUTH, this.password);
          
          const response = await this.receivePacket();
          
          if (response.type !== PacketType.AUTH_RESPONSE) {
            throw new ConnectionError('Invalid auth response type');
          }
          
          if (response.id === -1) {
            throw new ConnectionError('Invalid password');
          }
          
          if (response.id !== this.packetId) {
            throw new ConnectionError('Invalid response ID');
          }
          
          this.connected = true;
          this.logger.info('Successfully authenticated');
          resolve();
        } catch (error) {
          this.disconnect();
          reject(error);
        }
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.connected = false;
    this.logger.info('Disconnected from RCON server');
  }

  async execute(command: string): Promise<string> {
    if (!this.connected || !this.socket) {
      await this.connect();
    }

    const id = ++this.packetId;
    if (this.packetId >= 2147483647) {
      this.packetId = 0;
    }

    try {
      this.logger.debug('Executing command', { command, id });
      await this.sendPacket(id, PacketType.EXECCOMMAND, command);
      const response = await this.receivePacket();

      if (response.id !== id) {
        throw new CommandError(`Response ID mismatch: expected ${id}, got ${response.id}`);
      }

      if (response.type !== PacketType.RESPONSE_VALUE) {
        throw new CommandError(`Invalid response type: ${response.type}`);
      }

      const responseText = response.body ? response.body.trim() : '';
      
      // Check for Factorio error messages in the response
      if (responseText.includes('Cannot execute command') || 
          responseText.includes('Error:') ||
          responseText.match(/^Error /)) {
        throw new CommandError(`Factorio error: ${responseText}`);
      }

      this.logger.debug('Command executed successfully', { command, response: responseText });
      return responseText;
    } catch (error) {
      this.logger.error('Command execution failed', {
        command,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new CommandError(
        `Failed to execute command: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private sendPacket(id: number, type: PacketType, body: string): Promise<void> {
    if (!this.socket) {
      throw new ConnectionError('Not connected');
    }

    const bodyBuffer = Buffer.from(body, 'utf-8');
    const length = 4 + 4 + bodyBuffer.length + 2;
    
    const packet = Buffer.allocUnsafe(4 + length);
    let offset = 0;
    
    packet.writeInt32LE(length, offset);
    offset += 4;
    
    packet.writeInt32LE(id, offset);
    offset += 4;
    
    packet.writeInt32LE(type, offset);
    offset += 4;
    
    bodyBuffer.copy(packet, offset);
    offset += bodyBuffer.length;
    
    packet.writeUInt16LE(0, offset);

    return new Promise((resolve, reject) => {
      this.socket!.write(packet, (err) => {
        if (err) {
          reject(new CommandError(`Failed to send packet: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  private receivePacket(): Promise<RconMessage> {
    if (!this.socket) {
      throw new ConnectionError('Not connected');
    }

    return new Promise((resolve, reject) => {
      const socket = this.socket!;
      let buffer = Buffer.alloc(0);
      let expectedLength: number | null = null;

      const onData = (data: Buffer) => {
        buffer = Buffer.concat([buffer, data]);

        if (expectedLength === null && buffer.length >= 4) {
          expectedLength = buffer.readInt32LE(0);
        }

        if (expectedLength !== null && buffer.length >= 4 + expectedLength) {
          cleanup();
          
          try {
            const id = buffer.readInt32LE(4);
            const type = buffer.readInt32LE(8) as PacketType;
            
            const bodyLength = expectedLength - 10;
            let body: string | null = null;
            
            if (bodyLength > 0) {
              body = buffer.toString('utf-8', 12, 12 + bodyLength);
            }
            
            resolve({ id, type, body });
          } catch (error) {
            reject(new CommandError(`Failed to parse packet: ${error instanceof Error ? error.message : String(error)}`));
          }
        }
      };

      const onError = (error: Error) => {
        cleanup();
        reject(new CommandError(`Socket error: ${error.message}`));
      };

      const onTimeout = () => {
        cleanup();
        reject(new CommandError('Receive timeout'));
      };

      const onClose = () => {
        cleanup();
        reject(new ConnectionError('Connection closed'));
      };

      const cleanup = () => {
        socket.removeListener('data', onData);
        socket.removeListener('error', onError);
        socket.removeListener('timeout', onTimeout);
        socket.removeListener('close', onClose);
      };

      socket.on('data', onData);
      socket.once('error', onError);
      socket.once('timeout', onTimeout);
      socket.once('close', onClose);
    });
  }
}
