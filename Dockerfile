# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder

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
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server code
COPY server/ ./server/

# Copy scraped fallback data
COPY src/data/ ./src/data/

# Expose server port
EXPOSE 5000

# Health check endpoint for Dokploy
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start Application Server
CMD ["node", "server/index.js"]
