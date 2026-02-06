# Factorio MCP Server - Plan of Action

## Project Overview
A Model Context Protocol (MCP) server that enables communication between AI assistants (like Claude) and the Factorio game via the Factorio RCON (Remote Console) protocol.

## Objectives

### Primary Goals
1. **RCON Communication**: Stable connection with Factorio via RCON protocol
2. **MCP Server Implementation**: Complete MCP server exposing tools for Factorio interaction
3. **Command Execution**: Ability to execute Factorio console commands
4. **Game State Monitoring**: Retrieve information about the current game state
5. **Extensibility**: Modular design for future enhancements

### Secondary Goals
- Lua script integration for complex operations
- Real-time event monitoring
- Factory statistics and metrics
- Blueprint management
- Mod integration

## Technical Stack

### Language & Runtime
- **TypeScript**: For type-safety and modern JavaScript features
- **Node.js**: Runtime environment
- **npm/bun**: Package management

### Key Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `rcon-srcds`: RCON client for Source engine (compatible with Factorio)
- `zod`: Schema validation for tool parameters

### Development Tools
- ESLint & Prettier: Code quality
- TypeScript compiler: Type checking
- Vitest/Jest: Testing framework

## Architecture

### Component Overview
```
┌─────────────────────┐
│   AI Assistant      │
│   (Claude/etc)      │
└──────────┬──────────┘
           │ MCP Protocol
           │
┌──────────▼──────────┐
│   MCP Server        │
│  ┌───────────────┐  │
│  │ Tools Layer   │  │
│  ├───────────────┤  │
│  │ RCON Manager  │  │
│  ├───────────────┤  │
│  │ Command Queue │  │
│  └───────────────┘  │
└──────────┬──────────┘
           │ RCON Protocol
           │
┌──────────▼──────────┐
│   Factorio Server   │
│   (Game Instance)   │
└─────────────────────┘
```

### Core Modules

#### 1. RCON Manager
- Connection management with Factorio server
- Authentication
- Reconnection logic
- Error handling
- Connection pooling (if needed)

#### 2. MCP Server
- Tool registration
- Request handling
- Response formatting
- Error propagation

#### 3. Tool Implementations
- `execute_command`: Direct console commands
- `get_game_info`: Server info & statistics
- `get_players`: Online players list
- `get_evolution`: Evolution factor
- `run_lua`: Custom Lua code execution
- `get_research`: Research progress
- `get_production`: Production statistics

#### 4. Command Queue (optional)
- Rate limiting
- Command prioritization
- Batch operations

## Development Phases

### Phase 1: Project Setup & Basic Infrastructure ✅ COMPLETED
- [x] Project initialization
- [x] TypeScript configuration
- [x] Package.json setup
- [x] Basic project structure
- [x] Git repository setup
- [x] README & documentation setup

### Phase 2: RCON Client ✅ COMPLETED
- [x] RCON connection implementation (custom protocol based on factorio-rcon-py)
- [x] Authentication flow
- [x] Basic command execution
- [x] Error handling
- [x] Connection tests
- [x] Reconnection logic

### Phase 3: MCP Server Basics ✅ COMPLETED
- [x] MCP SDK integration
- [x] Server setup & configuration
- [x] Basic tool registration
- [x] Request/response handling
- [x] Logging setup (Pino to stderr)

### Phase 4: Core Tools 🔄 IN PROGRESS
- [x] `execute_command` tool
- [x] `get_game_info` tool
- [ ] `get_players` tool ← NEXT
- [x] Parameter validation (Zod schemas)
- [x] Tool testing

### Phase 5: Advanced Tools (Week 3-4)
- [ ] `run_lua` tool
- [ ] `get_evolution` tool
- [ ] `get_research` tool
- [ ] `get_production` tool
- [ ] Complex Lua integrations

### Phase 6: Testing & Refinement (Week 4)
- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Performance testing
- [ ] Error scenario testing

### Phase 7: Documentation & Examples (Week 5)
- [ ] API documentation
- [ ] Usage examples
- [ ] Configuration guide
- [ ] Troubleshooting guide
- [ ] Contributing guidelines

### Phase 8: Publishing & Distribution (Week 5-6)
- [ ] npm package setup
- [ ] Version tagging
- [ ] Release notes
- [ ] GitHub releases
- [ ] Community outreach

## Project Structure

```
factorio-mcp/
├── src/
│   ├── index.ts                 # Entry point & MCP server setup
│   ├── rcon/
│   │   ├── client.ts           # RCON client implementation
│   │   ├── connection.ts       # Connection management
│   │   └── types.ts            # RCON types
│   ├── tools/
│   │   ├── index.ts            # Tool registration
│   │   ├── execute-command.ts  # Command execution tool
│   │   ├── game-info.ts        # Game info tool
│   │   ├── players.ts          # Players tool
│   │   ├── lua.ts              # Lua execution tool
│   │   └── schemas.ts          # Zod validation schemas
│   ├── utils/
│   │   ├── logger.ts           # Logging utility
│   │   ├── config.ts           # Configuration management
│   │   └── errors.ts           # Custom error types
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── examples/
│   ├── basic-usage.md
│   └── advanced-scenarios.md
├── docs/
│   ├── api.md
│   ├── configuration.md
│   └── troubleshooting.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── package.json
├── tsconfig.json
├── .gitignore
├── .eslintrc.json
├── README.md
└── LICENSE
```

## Configuration

### Environment Variables
```
FACTORIO_RCON_HOST=localhost
FACTORIO_RCON_PORT=27015
FACTORIO_RCON_PASSWORD=your_password
MCP_SERVER_NAME=factorio-mcp
LOG_LEVEL=info
```

### Factorio Server Setup
1. Enable RCON in Factorio server settings
2. Set RCON password
3. Configure RCON port (default: 27015)
4. Ensure firewall allows connections

## MCP Tools Specification

### Tool: execute_command
```typescript
{
  name: "execute_command",
  description: "Execute a Factorio console command",
  inputSchema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The console command to execute"
      }
    },
    required: ["command"]
  }
}
```

### Tool: get_game_info
```typescript
{
  name: "get_game_info",
  description: "Get current game information and statistics",
  inputSchema: {
    type: "object",
    properties: {}
  }
}
```

### Tool: run_lua
```typescript
{
  name: "run_lua",
  description: "Execute Lua code in the Factorio environment",
  inputSchema: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "Lua code to execute"
      },
      print_result: {
        type: "boolean",
        description: "Whether to return the result",
        default: true
      }
    },
    required: ["code"]
  }
}
```

## Security Considerations

1. **RCON Password**: Safe storage via environment variables
2. **Command Validation**: Validate dangerous commands
3. **Rate Limiting**: Prevent spam/abuse
4. **Lua Sandboxing**: Restrict Lua capabilities (if possible)
5. **Network Security**: TLS/SSL for production (if available)

## Testing Strategy

### Unit Tests
- Individual tool functions
- RCON client methods
- Utility functions
- Error handling

### Integration Tests
- MCP server + tools
- RCON client + Factorio mock server
- End-to-end tool execution

### Manual Testing
- Real Factorio server testing
- Various game scenarios
- Performance under load
- Error recovery scenarios

## Performance Considerations

1. **Connection Pooling**: For high request volumes
2. **Caching**: For frequently accessed data
3. **Async Operations**: Non-blocking command execution
4. **Timeout Management**: Prevent long hangs
5. **Memory Management**: Resource cleanup

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|----------|
| RCON protocol changes | Low | High | Version pinning, compatibility tests |
| Factorio crashes | Medium | Medium | Graceful error handling, reconnection |
| Performance issues | Medium | Medium | Profiling, optimization, rate limiting |
| Security vulnerabilities | Low | High | Security audit, input validation |
| Network instability | Medium | Low | Retry logic, timeouts |

## Success Criteria

### Minimum Viable Product (MVP)
- ✅ RCON connection works stably
- ✅ Basic commands can be executed
- ✅ MCP protocol correctly implemented
- ✅ Minimum 3 working tools
- ✅ Documentation for basic usage

### Complete v1.0
- ✅ All planned tools implemented
- ✅ Comprehensive test coverage (>80%)
- ✅ Production-ready error handling
- ✅ Complete documentation
- ✅ Published to npm

## Future Enhancements (Post v1.0)

### Phase 9: Companion Mod (Optional Enhancement)
- [ ] Create Factorio companion mod for enhanced data access
- [ ] Implement custom MCP-optimized commands in Lua
- [ ] Add JSON-formatted output for structured data
- [ ] Real-time event monitoring hooks
- [ ] Advanced logistics network queries
- [ ] Production statistics aggregation
- [ ] Blueprint management endpoints
- [ ] Fallback to pure RCON when mod not installed

### Additional Features
1. **Web Dashboard**: Real-time monitoring interface
2. **Event Streaming**: Real-time game events via WebSocket
3. **Blueprint Library**: Manage & share blueprints
4. **Popular Mod Integration**: Support for Space Exploration, Krastorio2, etc.
5. **Multi-Server**: Support multiple Factorio instances
6. **GraphQL API**: Alternative to RCON for complex queries
7. **AI Assistant Tools**: Specialized tools for AI-driven gameplay

## Resources & References

### Documentation
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Factorio Console Commands](https://wiki.factorio.com/Console)
- [RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)
- [Factorio Lua API](https://lua-api.factorio.com/)

### Similar Projects
- factorio-server-manager
- factorio-rcon-py
- Source RCON libraries

### Community
- Factorio Discord
- Factorio Forums
- Reddit r/factorio

## Timeline

- **Week 1**: Setup & Infrastructure
- **Week 2**: RCON + MCP Basics
- **Week 3**: Core Tools Implementation
- **Week 4**: Testing & Refinement
- **Week 5**: Documentation & Polish
- **Week 6**: Release & Community

**Target Release Date**: 6 weeks from start

## Contact & Maintainers

TBD - Project lead to be identified

---

*Document version: 1.0*  
*Last updated: February 6, 2026*
