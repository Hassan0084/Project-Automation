# Multi-stage Dockerfile for Kreativicon ISP Order Management System

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Node.js Server
FROM node:20-alpine AS production
WORKDIR /app

# Copy package manifests & install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy server application & compiled frontend dist
COPY server.js ./
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY index.html ./
COPY kreativ_icon_logo.png ./

# Set environment defaults
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "server.js"]
