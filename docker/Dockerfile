# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat postgresql-client
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Production image, copy all the files and run nuxt
FROM base AS runner
WORKDIR /app

# Install postgresql-client for pg_isready command
RUN apk add --no-cache postgresql-client

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt

# Install pnpm
RUN npm install -g pnpm

# Copy built application
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copy start script
COPY docker/start.sh ./start.sh
RUN chmod +x ./start.sh

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://karaoke:karaoke@postgres:5432/karaoke"
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nuxt

# Start the application
CMD ["./start.sh"]
