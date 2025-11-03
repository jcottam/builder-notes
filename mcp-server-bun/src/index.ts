import { Hono } from "hono";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import figlet from "figlet";

const app = new Hono();

// Create MCP handler
const handler = createMcpHandler(
  (server) => {
    server.tool(
      "createAsciiArt",
      "Create ASCII art from text using figlet",
      {
        text: z.string().describe("The text to convert to ASCII art"),
      },
      async ({ text }) => {
        return new Promise((resolve) => {
          figlet.text(
            text,
            {
              font: "Standard",
            },
            (err: Error | null, result?: string) => {
              if (err) {
                resolve({
                  content: [
                    {
                      type: "text",
                      text: `Error creating ASCII art: ${err.message}`,
                    },
                  ],
                });
              } else {
                resolve({
                  content: [{ type: "text", text: result || "" }],
                });
              }
            }
          );
        });
      }
    );
  },
  {},
  {
    basePath: "/",
    maxDuration: 60,
    verboseLogs: true,
  }
);

// Mount MCP handler on /mcp route (it handles transport internally)
app.all("/mcp/*", async (c) => {
  return await handler(c.req.raw);
});

// Keep the original welcome route
app.get("/", (c) => {
  return c.json({
    message: "Hono MCP Server - ASCII Art Generator",
    endpoints: {
      mcp: "/mcp",
      description: "MCP server with ASCII art generator using figlet",
    },
    tools: ["createAsciiArt"],
  });
});

export default app;
