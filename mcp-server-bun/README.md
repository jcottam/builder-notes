# MCP Server with Bun

A Model Context Protocol (MCP) server built with [Bun](https://bun.sh), [Hono](https://hono.dev), and [mcp-handler](https://www.npmjs.com/package/mcp-handler). This server provides ASCII art generator accessible via HTTP transport.

## Installation

Install dependencies:

```bash
bun install
```

## Development

Run the development server with hot reloading:

```bash
bun run dev
```

The server will start on `http://localhost:3000`

## Using the MCP Server

### With MCP Clients

Configure your MCP client to connect to this server:

```json
{
  "mcpServers": {
    "remote-mcp-server": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Example Tool Calls

Once connected via an MCP client, you can call the ASCII art generator tool:

**Create ASCII Art:**

```json
{
  "name": "createAsciiArt",
  "arguments": {
    "text": "MCP Rocks!"
  }
}
```

Result:

```
  __  __  ____ ____                   _        _
 |  \/  |/ ___|  _ \   _ __ ___   ___| | _____| |
 | |\/| | |   | |_) | | '__/ _ \ / __| |/ / __| |
 | |  | | |___|  __/  | | | (_) | (__|   <\__ \_|
 |_|  |_|\____|_|     |_|  \___/ \___|_|\_\___(_)

```

## Docker Deployment

### Build the Docker image:

```bash
docker build -t mcp-server-bun .
```

### Run the container:

```bash
docker run -p 3000:3000 mcp-server-bun
```

## Technology Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript/TypeScript runtime
- **Web Framework**: [Hono](https://hono.dev) - Lightweight web framework
- **MCP Integration**: [mcp-handler](https://www.npmjs.com/package/mcp-handler) - MCP server handler for HTTP
- **Validation**: [Zod](https://zod.dev) - TypeScript-first schema validation
- **ASCII Art**: [figlet](https://www.npmjs.com/package/figlet) - ASCII art text generator

## Project Structure

```
mcp-server-bun/
├── src/
│   └── index.ts        # Main server and MCP tools
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── Dockerfile          # Docker build instructions
└── .dockerignore       # Docker ignore patterns
```
