import { Socket } from 'net';
import { Logger } from '../utils/logger.js';
import { RconError } from '../utils/errors.js';

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

  constructor(
    private host: string,
    private port: number,
    private password: string,
    private timeout: number = 5000
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
        reject(new RconError('Connection timeout'));
      });

      this.socket.connect(this.port, this.host, async () => {
        this.socket?.removeListener('error', reject);
        
        try {
          // Send authentication
          this.packetId = 0;
          await this.sendPacket(this.packetId, PacketType.AUTH, this.password);
          
          // Receive auth response
          const response = await this.receivePacket();
          
          if (response.type !== PacketType.AUTH_RESPONSE) {
            throw new RconError('Invalid auth response type');
          }
          
          if (response.id === -1) {
            throw new RconError('Invalid password');
          }
          
          if (response.id !== this.packetId) {
            throw new RconError('Invalid response ID');
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
  }

  async execute(command: string): Promise<string | null> {
    if (!this.connected || !this.socket) {
      await this.connect();
    }

    const id = ++this.packetId;
    if (this.packetId >= 2147483647) {
      this.packetId = 0;
    }

    await this.sendPacket(id, PacketType.EXECCOMMAND, command);
    const response = await this.receivePacket();

    if (response.id !== id) {
      throw new RconError(`Response ID mismatch: expected ${id}, got ${response.id}`);
    }

    if (response.type !== PacketType.RESPONSE_VALUE) {
      throw new RconError(`Invalid response type: ${response.type}`);
    }

    return response.body ? response.body.trim() : null;
  }

  private sendPacket(id: number, type: PacketType, body: string): Promise<void> {
    if (!this.socket) {
      throw new RconError('Not connected');
    }

    const bodyBuffer = Buffer.from(body, 'utf-8');
    const length = 4 + 4 + bodyBuffer.length + 2; // id + type + body + 2 null bytes
    
    const packet = Buffer.allocUnsafe(4 + length);
    let offset = 0;
    
    // Packet length (excluding this field)
    packet.writeInt32LE(length, offset);
    offset += 4;
    
    // Packet ID
    packet.writeInt32LE(id, offset);
    offset += 4;
    
    // Packet type
    packet.writeInt32LE(type, offset);
    offset += 4;
    
    // Body
    bodyBuffer.copy(packet, offset);
    offset += bodyBuffer.length;
    
    // Two null bytes (one for body string terminator, one for packet terminator)
    packet.writeUInt16LE(0, offset);

    return new Promise((resolve, reject) => {
      this.socket!.write(packet, (err) => {
        if (err) {
          reject(new RconError(`Failed to send packet: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  private receivePacket(): Promise<RconMessage> {
    if (!this.socket) {
      throw new RconError('Not connected');
    }

    return new Promise((resolve, reject) => {
      const socket = this.socket!;
      let buffer = Buffer.alloc(0);
      let expectedLength: number | null = null;

      const onData = (data: Buffer) => {
        buffer = Buffer.concat([buffer, data]);

        // Read packet length (first 4 bytes)
        if (expectedLength === null && buffer.length >= 4) {
          expectedLength = buffer.readInt32LE(0);
        }

        // Check if we have the complete packet (4 bytes for length field + expectedLength)
        if (expectedLength !== null && buffer.length >= 4 + expectedLength) {
          cleanup();
          
          try {
            const id = buffer.readInt32LE(4);
            const type = buffer.readInt32LE(8) as PacketType;
            
            // Body is from offset 12 to end-2 (excluding two null bytes)
            const bodyLength = expectedLength - 10; // minus id(4) + type(4) + nulls(2)
            let body: string | null = null;
            
            if (bodyLength > 0) {
              body = buffer.toString('utf-8', 12, 12 + bodyLength);
            }
            
            resolve({ id, type, body });
          } catch (error) {
            reject(new RconError(`Failed to parse packet: ${error instanceof Error ? error.message : String(error)}`));
          }
        }
      };

      const onError = (error: Error) => {
        cleanup();
        reject(new RconError(`Socket error: ${error.message}`));
      };

      const onTimeout = () => {
        cleanup();
        reject(new RconError('Receive timeout'));
      };

      const onClose = () => {
        cleanup();
        reject(new RconError('Connection closed'));
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
