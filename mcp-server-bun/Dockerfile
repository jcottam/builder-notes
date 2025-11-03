# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into a temp directory
# This will be cached unless package.json changes
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy production dependencies
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Production stage
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /app/src ./src
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/tsconfig.json .

# Expose the port (Bun default is 3000)
EXPOSE 3000

# Set user for security (Bun image includes a bun user)
USER bun

# Run the application
ENTRYPOINT [ "bun", "run", "src/index.ts" ]

