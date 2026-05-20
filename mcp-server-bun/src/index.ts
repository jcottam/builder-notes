import { Hono } from "hono";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import figlet from "figlet";

const app = new Hono();

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "createAsciiArt",
      {
        title: "Create ASCII Art",
        description: "Create ASCII art from text using figlet",
        inputSchema: {
          text: z.string(),
        },
      },
      async ({ text }) => {
        const art = figlet.textSync(text);
        return {
          content: [{ type: "text", text: art }],
        };
      },
    );
  },
  {},
  { basePath: "/", maxDuration: 60 },
);

app.all("/mcp", async (c) => {
  return await handler(c.req.raw);
});

app.all("/mcp/*", async (c) => {
  return await handler(c.req.raw);
});

export default app;
