export interface RconConnectionOptions {
  host: string;
  port: number;
  password: string;
  timeout?: number;
}

export interface RconResponse {
  body: string;
  id: number;
  type: number;
}
