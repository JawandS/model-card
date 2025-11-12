# Multi-stage Dockerfile for Model Card Generator
# Optimized for Railway deployment

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json ./
COPY packages/schema/package.json ./packages/schema/
COPY frontend/package.json ./frontend/

# Install dependencies for all packages
RUN npm install && \
    cd packages/schema && npm install && \
    cd ../../frontend && npm install

# Build schema package
FROM base AS schema-builder
WORKDIR /app
COPY --from=deps /app/packages/schema/node_modules ./packages/schema/node_modules
COPY packages/schema ./packages/schema
RUN cd packages/schema && npm run build

# Build frontend
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=schema-builder /app/packages/schema ./packages/schema

# Copy frontend source
COPY frontend ./frontend

# Build Next.js app
WORKDIR /app/frontend
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy schema package (needed by frontend)
COPY --from=schema-builder /app/packages/schema ./packages/schema

# Copy built application
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "frontend/server.js"]
