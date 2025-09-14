#!/bin/sh

echo "🚀 Starting Karaoke Application..."

# Set environment variables for production
export NODE_ENV=production
export DATABASE_URL="postgresql://karaoke:karaoke@postgres:5432/karaoke"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U karaoke; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "📊 Running database migrations..."
# Run Prisma migrations to create/update database schema
pnpm prisma migrate deploy

echo "✅ Database migrations completed"

echo "🎵 Starting Nuxt server..."
# Start the Nuxt application
exec node .output/server/index.mjs
