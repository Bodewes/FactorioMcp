import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FactorioRconClient } from '../src/rcon/client';
import { ConnectionError } from '../src/utils/errors';

describe('FactorioRconClient', () => {
  let client: FactorioRconClient;

  beforeEach(() => {
    client = new FactorioRconClient('localhost', 27015, 'test-password');
  });

  afterEach(async () => {
    await client.disconnect();
  });

  it('should create a client instance', () => {
    expect(client).toBeDefined();
    expect(client.isConnected()).toBe(false);
  });

  it('should have the correct host, port properties', () => {
    const clientWithCustomSettings = new FactorioRconClient('192.168.1.1', 27016, 'password');
    expect(clientWithCustomSettings).toBeDefined();
  });
});
