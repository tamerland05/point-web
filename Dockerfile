# Stage 1: Build the application
FROM node:22-alpine AS builder

# Аргументы для сборки, которые будут переданы в build-time
ARG VITE_MAPBOX_TOKEN
ARG VITE_GLITCHTIP_DSN
ARG VITE_POINT_API_FQDN

# Устанавливаем переменные окружения для процесса сборки
ENV VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN
ENV VITE_GLITCHTIP_DSN=$VITE_GLITCHTIP_DSN
ENV VITE_POINT_API_FQDN=$VITE_POINT_API_FQDN

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