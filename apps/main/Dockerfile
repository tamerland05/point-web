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

# Copy all package.json files to install dependencies
COPY apps/main/package.json ./apps/main/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

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