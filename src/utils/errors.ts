export class RconError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RconError';
  }
}

export class ConnectionError extends RconError {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

export class CommandError extends RconError {
  constructor(message: string) {
    super(message);
    this.name = 'CommandError';
  }
}

export class InvalidConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidConfigError';
  }
}
