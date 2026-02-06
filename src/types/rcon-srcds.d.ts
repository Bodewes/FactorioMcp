declare module 'rcon-srcds' {
  export interface RconOptions {
    host: string;
    port: number;
    password: string;
    timeout?: number;
  }

  export default class Rcon {
    constructor(options: RconOptions);
    authenticate(): Promise<void>;
    disconnect(): Promise<void>;
    execute(command: string): Promise<string>;
  }
}
