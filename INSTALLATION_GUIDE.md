# 📦 Enterprise Installation & Deployment Guide

## 1. Overview
The **Kreativ Icon ISP Order & Project Management System** is a full-stack web application designed for containerized cloud deployment on **Railway**, **Render**, **AWS ECS**, or self-hosted **Docker** environments.

---

## 2. Environment Variables

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Server HTTP listening port | `8080` |
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |

*Note: If `DATABASE_URL` is omitted, the application automatically uses a local SQLite database (`data/kreativicon.sqlite`), requiring zero setup.*

---

## 3. Railway Cloud Deployment
1. Connect your GitHub repository to [Railway](https://railway.app).
2. Railway detects `railway.json` and builds via the multi-stage `Dockerfile`.
3. Add a PostgreSQL database plugin in Railway. Railway automatically injects `DATABASE_URL`.
4. The backend automatically creates the database schema and seeds default accounts (`Hassan Saleem`, `Haroon`, `Shukoor`, `Viewer User`) and initial circuit orders upon first launch.

---

## 4. Docker Compose Deployment
```bash
docker-compose up -d --build
```
This spins up:
- Node.js Express + React Application Service (`:8080`)
- PostgreSQL 16 Alpine Database Service (`:5432`)

---

## 5. Verification
Open `http://localhost:8080` or your Railway domain to access the application.
