# Installation & Operations Guide

## Kreativicon ISP Order & Project Management System

This document provides step-by-step instructions for deploying and running the application in local development, staging, or production environments.

---

## Prerequisites

1. **Docker & Docker Compose** (Recommended for production):
   - Docker Engine v24+
   - Docker Compose v2+
2. **Native Environment (Optional)**:
   - Node.js v18+ & npm
   - PHP v8.2+ & Composer
   - PostgreSQL v15+

---

## Option 1: Docker Deployment (Recommended)

To spin up the entire application container stack (Frontend Web App, Laravel REST API, PostgreSQL database, Mailpit SMTP server):

```bash
# 1. Clone repository & enter workspace
cd "e:/Project Automation"

# 2. Build and launch Docker containers
docker-compose up -d --build

# 3. Access Application Services
# Frontend & App: http://localhost
# Mailpit Email UI: http://localhost:8025
# PostgreSQL DB: localhost:5432
```

---

## Option 2: Local Development Setup

### 1. Frontend Web App Setup

```bash
cd frontend
npm install
npm run dev
# App will run at http://localhost:3000
```

### 2. Laravel Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
# REST API will run at http://localhost:8000
```

---

## Database Seeding from Source of Truth

The database is pre-configured with the `OrderSeeder.php` class containing all 18 records extracted directly from `KI_Orders_with_Summary_Updated (4).xlsx`.

```bash
php artisan db:seed --class=OrderSeeder
```
