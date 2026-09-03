# Stage 1: Build Frontend Assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including devDependencies for Vite build)
RUN npm ci

# Copy full application code
COPY . .

# Build Vite React production bundle to /app/dist
RUN npm run build

# Stage 2: Production Server Runner
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server code
COPY server/ ./server/

# Copy scraped fallback data and assets
COPY src/data/ ./src/data/
COPY public/ ./public/

# Expose server ports (both 5000 and 3000 for Dokploy/Traefik compatibility)
EXPOSE 5000
EXPOSE 3000

# Resilient health check endpoint for Dokploy / Traefik
HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:5000/api/health || wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Start Application Server
CMD ["node", "server/index.js"]

