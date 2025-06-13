# Stage 1: Build the application
FROM node:22-alpine AS builder

# Install pnpm from package.json
RUN npm i -g pnpm@10.2.0

# Set working directory
WORKDIR /app

# Copy all files. Use .dockerignore to exclude unnecessary files.
COPY . .

# Install all dependencies for the monorepo
RUN pnpm install --frozen-lockfile

# Build the main app. The root build script already filters for @point/main.
RUN pnpm build

# Stage 2: Serve the application with Caddy
FROM caddy:2-alpine

# Set the port to 8000
EXPOSE 8000

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Copy the built static files from the builder stage
COPY --from=builder /app/apps/main/dist /usr/share/caddy

# Command to run Caddy with the Caddyfile
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]