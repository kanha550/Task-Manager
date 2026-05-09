FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start command
# For production with SQLite (not recommended), we use db push to ensure schema is synced
# For PostgreSQL, replace with: CMD npx prisma migrate deploy && npm start
CMD npx prisma db push && npm start
