declare module 'rcon-srcds' {
  export interface RconOptions {
    host: string;
    port: number;
    password: string;
    timeout?: number;
  }

  export default class Rcon {
    constructor(options: RconOptions);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(command: string): Promise<string>;
  }
}
