import { describe, it, expect } from 'vitest';
import { config } from '../src/utils/config';

describe('Configuration', () => {
  it('should load configuration from environment', () => {
    expect(config).toBeDefined();
    expect(config.rcon).toBeDefined();
    expect(config.mcp).toBeDefined();
  });

  it('should have valid RCON configuration', () => {
    expect(config.rcon.host).toBeBefined();
    expect(config.rcon.port).toBeGreaterThan(0);
    expect(config.rcon.password).toBeDefined();
  });
});
