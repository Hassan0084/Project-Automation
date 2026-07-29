# Multi-stage Dockerfile for Kreativicon ISP Order Management System

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production PHP Runtime Engine
FROM php:8.3-fpm-alpine
WORKDIR /var/www

# Install system dependencies
RUN apk add --no-gradient --no-cache \
    nginx \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip

# Copy Backend Files
COPY backend/ /var/www/
COPY --from=frontend-builder /app/frontend/dist /var/www/public_web

# Copy Nginx Configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80 3000

CMD ["sh", "-c", "nginx && php-fpm"]
