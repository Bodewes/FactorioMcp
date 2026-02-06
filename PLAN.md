# Factorio MCP Server - Plan van Aanpak

## Project Overview
Een Model Context Protocol (MCP) server die communicatie mogelijk maakt tussen AI assistenten (zoals Claude) en het Factorio spel via de Factorio RCON (Remote Console) protocol.

## Doelstellingen

### Primaire Doelen
1. **RCON Communicatie**: Stabiele verbinding met Factorio via RCON protocol
2. **MCP Server Implementatie**: Volledige MCP server die tools exposed voor Factorio interactie
3. **Command Execution**: Mogelijkheid om Factorio console commands uit te voeren
4. **Game State Monitoring**: Informatie ophalen over de huidige game state
5. **Extensibiliteit**: Modulair ontwerp voor toekomstige uitbreidingen

### Secundaire Doelen
- Lua script integratie voor complexere operaties
- Real-time event monitoring
- Factory statistics en metrics
- Blueprint management
- Mod integratie

## Technische Stack

### Taal & Runtime
- **TypeScript**: Voor type-safety en moderne JavaScript features
- **Node.js**: Runtime environment
- **Bun/npm**: Package management

### Belangrijkste Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementatie
- `rcon-srcds`: RCON client voor Source engine (compatibel met Factorio)
- `zod`: Schema validatie voor tool parameters

### Development Tools
- ESLint & Prettier: Code quality
- TypeScript compiler: Type checking
- Vitest/Jest: Testing framework

## Architectuur

### Component Overzicht
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
- Connectie beheer met Factorio server
- Authentication
- Reconnection logic
- Error handling
- Connection pooling (indien nodig)

#### 2. MCP Server
- Tool registration
- Request handling
- Response formatting
- Error propagation

#### 3. Tool Implementations
- `execute_command`: Directe console commands
- `get_game_info`: Server info & statistics
- `get_players`: Online spelers lijst
- `get_evolution`: Evolution factor
- `run_lua`: Custom Lua code execution
- `get_research`: Research progress
- `get_production`: Production statistics

#### 4. Command Queue (optioneel)
- Rate limiting
- Command prioritization
- Batch operations

## Development Fases

### Fase 1: Project Setup & Basic Infrastructure (Week 1)
- [x] Project initialisatie
- [ ] TypeScript configuratie
- [ ] Package.json setup
- [ ] Basic project structuur
- [ ] Git repository setup
- [ ] README & documentatie opzet

### Fase 2: RCON Client (Week 1-2)
- [ ] RCON connection implementatie
- [ ] Authentication flow
- [ ] Basic command execution
- [ ] Error handling
- [ ] Connection tests
- [ ] Reconnection logic

### Fase 3: MCP Server Basis (Week 2)
- [ ] MCP SDK integratie
- [ ] Server setup & configuratie
- [ ] Basic tool registration
- [ ] Request/response handling
- [ ] Logging setup

### Fase 4: Core Tools (Week 2-3)
- [ ] `execute_command` tool
- [ ] `get_game_info` tool
- [ ] `get_players` tool
- [ ] Parameter validatie (Zod schemas)
- [ ] Tool testing

### Fase 5: Advanced Tools (Week 3-4)
- [ ] `run_lua` tool
- [ ] `get_evolution` tool
- [ ] `get_research` tool
- [ ] `get_production` tool
- [ ] Complexere Lua integraties

### Fase 6: Testing & Refinement (Week 4)
- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Performance testing
- [ ] Error scenario testing

### Fase 7: Documentation & Examples (Week 5)
- [ ] API documentatie
- [ ] Usage examples
- [ ] Configuration guide
- [ ] Troubleshooting guide
- [ ] Contributing guidelines

### Fase 8: Publishing & Distribution (Week 5-6)
- [ ] npm package setup
- [ ] Version tagging
- [ ] Release notes
- [ ] GitHub releases
- [ ] Community outreach

## Project Structuur

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

## Configuratie

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

## MCP Tools Specificatie

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

## Security Overwegingen

1. **RCON Password**: Veilig opslaan via environment variables
2. **Command Validation**: Valideren van gevaarlijke commands
3. **Rate Limiting**: Voorkomen van spam/abuse
4. **Lua Sandboxing**: Beperken van Lua capabilities (indien mogelijk)
5. **Network Security**: TLS/SSL voor productie (indien beschikbaar)

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

## Performance Overwegingen

1. **Connection Pooling**: Bij hoge request volumes
2. **Caching**: Voor frequently accessed data
3. **Async Operations**: Non-blocking command execution
4. **Timeout Management**: Voorkomen van lange hangs
5. **Memory Management**: Cleanup van resources

## Risico's & Mitigaties

| Risico | Waarschijnlijkheid | Impact | Mitigatie |
|--------|-------------------|--------|-----------|
| RCON protocol wijzigingen | Laag | Hoog | Version pinning, compatibility tests |
| Factorio crashes | Middel | Middel | Graceful error handling, reconnection |
| Performance problemen | Middel | Middel | Profiling, optimization, rate limiting |
| Security vulnerabilities | Laag | Hoog | Security audit, input validation |
| Network instability | Middel | Laag | Retry logic, timeouts |

## Success Criteria

### Minimum Viable Product (MVP)
- ✅ RCON connectie werkt stabiel
- ✅ Basis commands kunnen uitgevoerd worden
- ✅ MCP protocol correct geïmplementeerd
- ✅ Minimaal 3 werkende tools
- ✅ Documentatie voor basic usage

### Complete v1.0
- ✅ Alle geplande tools geïmplementeerd
- ✅ Comprehensive test coverage (>80%)
- ✅ Production-ready error handling
- ✅ Complete documentatie
- ✅ Published to npm

## Future Enhancements (Post v1.0)

1. **Web Dashboard**: Real-time monitoring interface
2. **Event Streaming**: Real-time game events via WebSocket
3. **Blueprint Library**: Manage & share blueprints
4. **Mod Support**: Integration with popular mods
5. **Multi-Server**: Support multiple Factorio instances
6. **GraphQL API**: Alternative to RCON for complex queries
7. **AI Assistant Tools**: Specialized tools for AI-driven gameplay

## Resources & Referenties

### Documentatie
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Factorio Console Commands](https://wiki.factorio.com/Console)
- [RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)
- [Factorio Lua API](https://lua-api.factorio.com/)

### Vergelijkbare Projecten
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

**Target Release Date**: 6 weken vanaf start

## Contact & Maintainers

TBD - Project lead identificeren

---

*Document versie: 1.0*  
*Laatst bijgewerkt: 6 februari 2026*
