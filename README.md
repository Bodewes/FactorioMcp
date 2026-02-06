# Factorio MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-green.svg)](https://modelcontextprotocol.io/)

A Model Context Protocol (MCP) server that enables AI assistants like Claude to communicate with Factorio servers via the RCON protocol.

## 🎮 What is this?

This MCP server enables AI assistants to:
- Execute console commands in Factorio
- Retrieve game information and statistics
- Execute Lua code for complex operations
- Monitor player information
- View research progress
- Analyze production statistics

## ✨ Features

- 🔌 **RCON Integratie**: Stabiele verbinding met Factorio servers via RCON
- 🛠️ **MCP Tools**: Uitgebreide set tools voor game interactie
- 🔒 **Veilig**: Secure authentication en input validatie
- 📊 **Real-time Data**: Live game state informatie
- 🧪 **Type-Safe**: Volledig gebouwd met TypeScript
- 🔄 **Auto-Reconnect**: Automatisch herstel bij verbindingsproblemen

## 📋 Requirements

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

1. Open your Factorio `server-settings.json`
2. Enable RCON and set a password:

```json
{
  "rcon-port": 27015,
  "rcon-password": "your-secure-password"
}
```

3. Restart the Factorio server

### MCP Server Configuration

Create an `.env` file:

```env
FACTORIO_RCON_HOST=localhost
FACTORIO_RCON_PORT=27015
FACTORIO_RCON_PASSWORD=your-secure-password
MCP_SERVER_NAME=factorio-mcp
LOG_LEVEL=info
```

## 🎯 Usage

### Development (Local Testing)

For local development and testing, this project includes a `mcp.json` configuration:

```bash
# Build the project first
npm run build

# The mcp.json is ready to use with MCP clients
# It references the built dist/index.js file
```

Your MCP client can now use the configuration from `mcp.json` to connect to this server.

### As Standalone Server

```bash
npx factorio-mcp
```

### In Claude Desktop

Add to your `claude_desktop_config.json`:

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

### Programmatically

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

## 🔧 Available Tools

### `execute_command`
Execute a Factorio console command.

```typescript
// Voorbeeld gebruik via AI assistant:
// "Execute the command /time to check the current game time"
```

### `get_game_info`
Get general information about the game.

```typescript
// "Get the current game information"
```

### `get_players`
List all online players.

```typescript
// "Show me all online players"
```

### `run_lua`
Execute custom Lua code in the Factorio environment.

```typescript
// "Run Lua code to check the evolution factor"
```

### `get_evolution`
Get the current evolution factor.

```typescript
// "What is the current evolution factor?"
```

### `get_research`
View current research progress.

```typescript
// "Show current research progress"
```

### `get_production`
Analyze production statistics.

```typescript
// "Get production statistics for the last hour"
```

## 📚 Examples

### Basic Command Execution

```
User: "What's the current game time in the Factorio server?"
AI: Uses execute_command with /time
Response: "The game time is 14:23:45"
```

### Lua Script Execution

```
User: "Check how many iron plates are in storage"
AI: Uses run_lua with custom script
Response: "There are 15,420 iron plates in storage"
```

### Production Analysis

```
User: "Analyze my iron production in the last hour"
AI: Uses get_production
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

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - For the MCP framework
- [Factorio](https://factorio.com/) - For the amazing game
- The Factorio community - For documentation and support

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

This is a community project and is not affiliated with Wube Software (creators of Factorio).

---

Made with ❤️ for the Factorio community
