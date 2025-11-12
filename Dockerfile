# Multi-stage Dockerfile for Model Card Generator
# Optimized for Railway deployment

FROM node:20-alpine AS base

# Install schema dependencies and build
FROM base AS schema-builder
WORKDIR /app/packages/schema

# Copy schema package files
COPY packages/schema/package.json packages/schema/package-lock.json* ./
RUN npm ci

# Copy schema source and build
COPY packages/schema ./
RUN npm run build

# Install frontend dependencies
FROM base AS deps
WORKDIR /app/frontend

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# Build frontend
FROM base AS builder
WORKDIR /app

# Copy built schema package
COPY --from=schema-builder /app/packages/schema ./packages/schema

# Copy frontend dependencies
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

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
