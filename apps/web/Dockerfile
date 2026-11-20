# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm ci

COPY apps/web ./apps/web

WORKDIR /app/apps/web
ARG VITE_API_BASE_URL=http://localhost:3001/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

