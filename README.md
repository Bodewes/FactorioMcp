# Factorio MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-green.svg)](https://modelcontextprotocol.io/)

Een Model Context Protocol (MCP) server die AI assistenten zoals Claude in staat stelt om te communiceren met Factorio servers via het RCON protocol.

## 🎮 Wat is dit?

Deze MCP server maakt het mogelijk voor AI assistenten om:
- Console commands uit te voeren in Factorio
- Game informatie en statistieken op te halen
- Lua code uit te voeren voor complexe operaties
- Speler informatie te monitoren
- Research progress te bekijken
- Production statistics te analyseren

## ✨ Features

- 🔌 **RCON Integratie**: Stabiele verbinding met Factorio servers via RCON
- 🛠️ **MCP Tools**: Uitgebreide set tools voor game interactie
- 🔒 **Veilig**: Secure authentication en input validatie
- 📊 **Real-time Data**: Live game state informatie
- 🧪 **Type-Safe**: Volledig gebouwd met TypeScript
- 🔄 **Auto-Reconnect**: Automatisch herstel bij verbindingsproblemen

## 📋 Vereisten

- Node.js 18.0 of hoger
- Een draaiende Factorio server met RCON enabled
- RCON wachtwoord van de Factorio server

## 🚀 Installatie

```bash
npm install factorio-mcp
```

Of met bun:

```bash
bun add factorio-mcp
```

## ⚙️ Configuratie

### Factorio Server Setup

1. Open je Factorio `server-settings.json`
2. Enable RCON en stel een wachtwoord in:

```json
{
  "rcon-port": 27015,
  "rcon-password": "your-secure-password"
}
```

3. Herstart de Factorio server

### MCP Server Configuratie

Creëer een `.env` bestand:

```env
FACTORIO_RCON_HOST=localhost
FACTORIO_RCON_PORT=27015
FACTORIO_RCON_PASSWORD=your-secure-password
MCP_SERVER_NAME=factorio-mcp
LOG_LEVEL=info
```

## 🎯 Gebruik

### Als Standalone Server

```bash
npx factorio-mcp
```

### In Claude Desktop

Voeg toe aan je `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "factorio": {
      "command": "npx",
      "args": ["factorio-mcp"],
      "env": {
        "FACTORIO_RCON_HOST": "localhost",
        "FACTORIO_RCON_PORT": "27015",
        "FACTORIO_RCON_PASSWORD": "your-secure-password"
      }
    }
  }
}
```

### Programmatisch

```typescript
import { FactorioMCPServer } from 'factorio-mcp';

const server = new FactorioMCPServer({
  rcon: {
    host: 'localhost',
    port: 27015,
    password: 'your-secure-password'
  }
});

await server.start();
```

## 🔧 Beschikbare Tools

### `execute_command`
Voer een Factorio console command uit.

```typescript
// Voorbeeld gebruik via AI assistant:
// "Execute the command /time to check the current game time"
```

### `get_game_info`
Krijg algemene informatie over de game.

```typescript
// "Get the current game information"
```

### `get_players`
Lijst alle online spelers.

```typescript
// "Show me all online players"
```

### `run_lua`
Voer custom Lua code uit in de Factorio environment.

```typescript
// "Run Lua code to check the evolution factor"
```

### `get_evolution`
Krijg de huidige evolution factor.

```typescript
// "What is the current evolution factor?"
```

### `get_research`
Bekijk de huidige research progress.

```typescript
// "Show current research progress"
```

### `get_production`
Analyseer production statistics.

```typescript
// "Get production statistics for the last hour"
```

## 📚 Voorbeelden

### Basis Command Execution

```
User: "What's the current game time in the Factorio server?"
AI: Gebruikt execute_command met /time
Response: "The game time is 14:23:45"
```

### Lua Script Execution

```
User: "Check how many iron plates are in storage"
AI: Gebruikt run_lua met custom script
Response: "There are 15,420 iron plates in storage"
```

### Production Analysis

```
User: "Analyze my iron production in the last hour"
AI: Gebruikt get_production
Response: "Iron production: 2,450 plates/hour..."
```

## 🏗️ Architectuur

```
┌─────────────────────┐
│   AI Assistant      │
│   (Claude/GPT)      │
└──────────┬──────────┘
           │ MCP Protocol
           │
┌──────────▼──────────┐
│  Factorio MCP       │
│  ├─ Tools Layer     │
│  ├─ RCON Manager    │
│  └─ Command Queue   │
└──────────┬──────────┘
           │ RCON
           │
┌──────────▼──────────┐
│  Factorio Server    │
└─────────────────────┘
```

## 🧪 Development

### Setup Development Environment

```bash
git clone https://github.com/yourusername/factorio-mcp.git
cd factorio-mcp
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## 🤝 Contributing

Contributions zijn welkom! Zie [CONTRIBUTING.md](CONTRIBUTING.md) voor details.

1. Fork het project
2. Creëer een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📝 Licentie

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - Voor het MCP framework
- [Factorio](https://factorio.com/) - Voor de geweldige game
- De Factorio community - Voor documentatie en support

## 📞 Support

- 🐛 [Issue Tracker](https://github.com/yourusername/factorio-mcp/issues)
- 💬 [Discussions](https://github.com/yourusername/factorio-mcp/discussions)
- 📖 [Documentation](https://github.com/yourusername/factorio-mcp/wiki)

## 🗺️ Roadmap

- [x] Basic RCON connectivity
- [x] Core MCP tools
- [ ] Advanced Lua integrations
- [ ] Blueprint management
- [ ] Multi-server support
- [ ] Web dashboard
- [ ] Real-time event streaming

## ⚠️ Disclaimer

Dit is een community project en is niet geaffilieerd met Wube Software (makers van Factorio).

---

Made with ❤️ for the Factorio community
