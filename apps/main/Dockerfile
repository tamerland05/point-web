# Multi-stage build
# Stage 1: Build the application
FROM node:22.11.0-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.2.0

# Copy package manager files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY .npmrc ./

# Create directory structure and copy package.json files for dependency installation
RUN mkdir -p apps/main packages/ui packages/shared packages/typescript-config packages/i18n packages/tailwind-config packages/assets

COPY apps/main/package.json ./apps/main/
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/i18n/package.json ./packages/i18n/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/
COPY packages/assets/package.json ./packages/assets/

# Install dependencies (this layer will be cached if package.json files don't change)
RUN pnpm install --frozen-lockfile

# Copy source code (this will invalidate cache only when source changes)
COPY apps/ ./apps/
COPY packages/ ./packages/

# Build the main application
RUN pnpm run build --filter=@point/main

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/apps/main/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --from=builder /app/apps/main/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]