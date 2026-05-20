import { describe, expect, test } from "bun:test";
import type { Hono } from "hono";
import app from "./index";

function parseSseMessage(body: string) {
  const dataLine = body.split("\n").find((line) => line.startsWith("data: "));
  if (!dataLine) throw new Error("No SSE data line in response");
  return JSON.parse(dataLine.slice("data: ".length));
}

async function mcpRequest(
  honoApp: Hono,
  method: string,
  params: unknown,
  id = 1,
) {
  return honoApp.request("/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
}

describe("MCP server", () => {
  test("initialize returns protocol version and server info", async () => {
    const res = await mcpRequest(app, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test", version: "1.0.0" },
    });

    expect(res.status).toBe(200);

    const body = parseSseMessage(await res.text());
    expect(body.result.protocolVersion).toBe("2024-11-05");
    expect(body.result.serverInfo).toBeDefined();
  });

  test("tools/list includes createAsciiArt", async () => {
    const res = await mcpRequest(app, "tools/list", {});

    expect(res.status).toBe(200);

    const body = parseSseMessage(await res.text());
    const tool = body.result.tools.find(
      (t: { name: string }) => t.name === "createAsciiArt",
    );

    expect(tool).toBeDefined();
    expect(tool.title).toBe("Create ASCII Art");
    expect(tool.description).toBe("Create ASCII art from text using figlet");
  });

  test("tools/call createAsciiArt returns ASCII art", async () => {
    const res = await mcpRequest(app, "tools/call", {
      name: "createAsciiArt",
      arguments: { text: "Hi" },
    });

    expect(res.status).toBe(200);

    const body = parseSseMessage(await res.text());
    expect(body.result.content[0].type).toBe("text");
    expect(body.result.content[0].text.length).toBeGreaterThan(0);
  });

  test("GET / returns 404", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(404);
  });

  test("GET /mcp returns 405", async () => {
    const res = await app.request("/mcp");
    expect(res.status).toBe(405);
  });
});
