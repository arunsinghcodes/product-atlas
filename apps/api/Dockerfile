# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace configs and workspace package declarations
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# Install dependencies across workspaces
RUN npm ci

# Copy API source
COPY apps/api ./apps/api

# Build NestJS app
WORKDIR /app/apps/api
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

RUN npm ci --omit=dev

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3001

WORKDIR /app/apps/api
CMD ["node", "dist/src/main.js"]
