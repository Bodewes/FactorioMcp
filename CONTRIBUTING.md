# Contributing to Factorio MCP Server

Bedankt voor je interesse in het bijdragen aan Factorio MCP Server! We waarderen alle contributions, of het nu gaat om bug reports, feature requests, documentatie verbeteringen, of code contributions.

## 📋 Code of Conduct

Door deel te nemen aan dit project, ga je akkoord met onze Code of Conduct:
- Wees respectvol en inclusief
- Accepteer constructieve kritiek
- Focus op wat het beste is voor de community
- Toon empathie naar andere community leden

## 🐛 Bug Reports

### Voordat je een bug report indient:
1. Check of de bug al gerapporteerd is in [Issues](https://github.com/yourusername/factorio-mcp/issues)
2. Gebruik de laatste versie van de software
3. Verzamel relevante informatie over je omgeving

### Een goede bug report bevat:
- **Duidelijke titel**: Kort en descriptief
- **Beschrijving**: Wat verwachtte je vs. wat gebeurde er
- **Reproductie stappen**: Stap-voor-stap instructies
- **Environment**:
  - OS en versie
  - Node.js versie
  - Factorio versie
  - MCP server versie
- **Logs**: Relevante error messages of logs
- **Screenshots**: Indien van toepassing

**Template:**
```markdown
**Beschrijving:**
[Duidelijke beschrijving van de bug]

**Reproductie:**
1. Start de server met '...'
2. Voer command '...' uit
3. Zie error

**Verwacht gedrag:**
[Wat had er moeten gebeuren]

**Environment:**
- OS: Windows 11
- Node.js: v20.10.0
- Factorio: 1.1.104
- factorio-mcp: 1.0.0

**Logs:**
```
[paste relevante logs]
```
```

## 💡 Feature Requests

We waarderen nieuwe ideeën! Voor een feature request:

1. **Check bestaande requests**: Kijk of het al voorgesteld is
2. **Beschrijf het probleem**: Welk probleem lost dit op?
3. **Beschrijf de oplossing**: Hoe zie je het voor je?
4. **Alternatieven**: Heb je andere oplossingen overwogen?
5. **Context**: Waarom is dit belangrijk voor jou/de community?

## 🔧 Development Setup

### Prerequisites
- Node.js 18.0 of hoger
- Git
- Een Factorio server voor testing

### Setup stappen

1. **Fork en clone:**
```bash
git clone https://github.com/jouw-username/factorio-mcp.git
cd factorio-mcp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configureer environment:**
```bash
cp .env.example .env
# Edit .env met je Factorio server details
```

4. **Build:**
```bash
npm run build
```

5. **Run tests:**
```bash
npm test
```

## 🏗️ Development Workflow

### Branch Naming Convention
- `feature/beschrijving` - Nieuwe features
- `fix/beschrijving` - Bug fixes
- `docs/beschrijving` - Documentatie
- `refactor/beschrijving` - Code refactoring
- `test/beschrijving` - Test toevoegingen/fixes

### Commit Messages
Gebruik [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): beschrijving

[optionele body]

[optionele footer]
```

**Types:**
- `feat`: Nieuwe feature
- `fix`: Bug fix
- `docs`: Documentatie wijziging
- `style`: Code style wijziging (formatting)
- `refactor`: Code refactoring
- `test`: Test toevoegingen of wijzigingen
- `chore`: Build process of auxiliary tool wijzigingen

**Voorbeelden:**
```
feat(tools): add blueprint management tool
fix(rcon): handle connection timeout properly
docs(readme): update installation instructions
```

### Code Style

We gebruiken ESLint en Prettier voor code consistency:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

**Code Guidelines:**
- Gebruik TypeScript types, vermijd `any`
- Schrijf duidelijke comments voor complexe logic
- Follow single responsibility principle
- Schrijf tests voor nieuwe features
- Update documentatie bij API changes

### Testing

We verwachten tests voor nieuwe code:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Guidelines:**
- Unit tests voor individuele functies
- Integration tests voor inter-component interacties
- Minimal 80% code coverage voor nieuwe code
- Mock external dependencies (RCON, file system, etc.)

### Pull Request Process

1. **Update je branch:**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run checks:**
```bash
npm run lint
npm test
npm run build
```

3. **Push en create PR:**
```bash
git push origin feature/jouw-feature
```

4. **PR beschrijving moet bevatten:**
   - Wat doet deze PR?
   - Welke issue(s) lost het op?
   - Hoe heb je het getest?
   - Screenshots/logs indien relevant
   - Breaking changes (indien van toepassing)

5. **PR Checklist:**
   - [ ] Code builds zonder errors
   - [ ] Alle tests slagen
   - [ ] Nieuwe tests toegevoegd
   - [ ] Documentatie bijgewerkt
   - [ ] CHANGELOG.md bijgewerkt
   - [ ] Commits volgen conventional commits
   - [ ] Code is ge-lint en geformatteerd

### Review Process

- Minimaal 1 approval required
- Alle comments moeten addressed worden
- CI checks moeten groen zijn
- Maintainers kunnen wijzigingen voorstellen
- Be open to feedback!

## 📚 Documentatie

Documentatie verbeteringen zijn altijd welkom:

- **Code comments**: Voor complexe logic
- **API docs**: Voor public interfaces
- **README**: Voor setup en basic usage
- **Wiki**: Voor guides en tutorials
- **Examples**: Voor common use cases

## 🎨 Project Structuur

```
src/
├── index.ts              # Entry point
├── rcon/                 # RCON client implementation
│   ├── client.ts
│   ├── connection.ts
│   └── types.ts
├── tools/                # MCP tools
│   ├── index.ts
│   ├── execute-command.ts
│   └── ...
├── utils/                # Utilities
│   ├── logger.ts
│   ├── config.ts
│   └── errors.ts
└── types/                # TypeScript types
    └── index.ts

tests/
├── unit/
├── integration/
└── e2e/
```

## 🏆 Recognition

Contributors worden erkend in:
- README.md Contributors sectie
- Release notes
- GitHub contributors page

## ❓ Vragen?

- Open een [Discussion](https://github.com/yourusername/factorio-mcp/discussions)
- Join onze Discord (indien beschikbaar)
- Tag maintainers in issues

## 📜 License

Door bij te dragen, ga je akkoord dat je contributions gelicenseerd worden onder de MIT License.

---

Bedankt voor je bijdrage! 🎉
