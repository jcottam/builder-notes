# MCP on Bun and Hono with mcp-handler

A Model Context Protocol (MCP) server built with [Bun](https://bun.sh), [Hono](https://hono.dev), and [mcp-handler](https://github.com/vercel/mcp-handler). Exposes a `createAsciiArt` tool over Streamable HTTP at `/mcp`.

Companion to the blog post: [MCP on Bun and Hono with mcp-handler](https://www.johnryancottam.com/notes/mcp-on-bun-and-hono-with-mcp-handler)

## Installation

Install dependencies:

```bash
bun add mcp-handler @modelcontextprotocol/sdk@1.26.0 zod
bun install
```

Pin the MCP SDK to 1.26.0 or later — earlier versions had a [known security issue](https://github.com/vercel/mcp-handler#installation).

## Development

Run the development server with hot reloading:

```bash
bun run dev
```

The MCP endpoint is available at `http://localhost:3000/mcp`.

## Run tests

Run the in-memory integration test suite (no port binding required):

```bash
bun test
```

These tests exercise the MCP initialize, tools/list, and tools/call flows via Hono's `app.request()` API. Use the MCP Inspector below for manual end-to-end verification with a real client.

## Test with MCP Inspector

Before wiring up Claude Code, Cursor, or another AI client, test the server with the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx @modelcontextprotocol/inspector
```

Connect to your local server, find the `createAsciiArt` tool, and call it with test inputs. Verify the response shape before involving an AI client.

## Connect Clients

### Streamable HTTP

Clients that support remote Streamable HTTP can connect with a URL:

```json
{
  "mcpServers": {
    "my-server": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Stdio-only clients

Some desktop apps expect a spawned process, not a URL. Use [mcp-remote](https://www.npmjs.com/package/mcp-remote) as a bridge:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/mcp"]
    }
  }
}
```

Config location varies by client:

- **Cursor**: Settings → MCP → Add server
- **Claude Code**: `~/.claude.json` under `mcpServers`

## Production

Switch the URL to your deployed server when you go to production. Add OAuth or token verification before exposing anything sensitive — see the handler's [authorization docs](https://github.com/vercel/mcp-handler/blob/main/docs/AUTHORIZATION.md).

## When to Skip mcp-handler

`mcp-handler` is the right default when you want HTTP/SSE MCP behind a web framework quickly. Reach for the [official MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) directly if you need stdio-only local tools, minimal dependencies, or you're learning the protocol from the ground up.

## Docker Deployment

### Build the Docker image

```bash
docker build -t mcp-server-bun .
```

### Run the container

```bash
docker run -p 3000:3000 mcp-server-bun
```

## Technology Stack

- **Runtime**: [Bun](https://bun.sh)
- **Web Framework**: [Hono](https://hono.dev)
- **MCP Integration**: [mcp-handler](https://github.com/vercel/mcp-handler)
- **Validation**: [Zod](https://zod.dev)
- **ASCII Art**: [figlet](https://www.npmjs.com/package/figlet)

## Project Structure

```
mcp-server-bun/
├── src/
│   └── index.ts        # Hono app and MCP tools
├── package.json
├── tsconfig.json
├── Dockerfile
└── .dockerignore
```

## Resources

- [Blog post: MCP on Bun and Hono with mcp-handler](https://www.johnryancottam.com/notes/mcp-on-bun-and-hono-with-mcp-handler)
- [Vercel mcp-handler on GitHub](https://github.com/vercel/mcp-handler)
- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
