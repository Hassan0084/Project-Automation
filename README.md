# 🚀 Kreativ Icon ISP Order & Project Management System

Production-ready full-stack enterprise web platform for ISP Microwave circuit orders, LOS surveys, customer directory management, field engineer dispatches, Excel workbook sync, and automated email reporting.

---

## 🌟 Key Platform Features

- **👑 Role-Based Access Control (RBAC)**:
  - **Super Admin (`hassan@kreativicon.com`)**: Master access across all 8 modules (Dashboard, Active Orders, Cancelled Orders, Customers, Engineers, Excel Engine, Email Reporting, System Audit Log) with project and user account creation.
  - **Viewer (`viewer@kreativicon.com`)**: Read-only inspection of operational tabs. Audit logs and edit forms are restricted.
  - **Field Engineer (`haroon@kreativicon.com`, `shukoor@kreativicon.com`)**: Access restricted to Dashboard and assigned projects only.

- **📊 Visual Executive Dashboard**:
  - Live KPI cards, STC vs Mobily operator share meter, workflow status breakdown, regional distribution, bandwidth allocation, and recent project quick views.

- **📅 Complete Connection Tracking**:
  - Full support for `CWO Date`, `Installation Start Date`, `Installation Complete Date`, and `Delivery Date` fields.

- **📑 Excel & CSV Engine**:
  - Seamless drag-and-drop import for `.xlsx` / `.xls` files and CSV exports.

---

## 🚀 Railway Deployment Guide (One-Click)

This repository is pre-configured with a root `Dockerfile` and `railway.json` for automated zero-configuration deployment on **Railway**.

### Steps:
1. Push this repository to GitHub or GitLab.
2. Log into [Railway.app](https://railway.app) and create a **New Project**.
3. Select **Deploy from GitHub repo** and choose this repository.
4. Add a **Postgres Service** to your Railway project.
5. Railway will automatically link `DATABASE_URL`, build the multi-stage Docker image, run migrations/seeds, and launch the platform on an HTTPS domain.

---

## 🐳 Local Docker Deployment

Run the complete full-stack environment locally using Docker Compose:

```bash
docker-compose up --build -d
```

Access the application at `http://localhost:8080`.

---

## 💻 Local Node.js Development

```bash
# Install dependencies
npm install

# Start Express server & React Vite frontend
npm run dev
```

---

## 🛠️ Stack Overview
- **Frontend**: Vite + React 18 + TypeScript + Vanilla CSS
- **Backend API**: Node.js + Express.js REST API
- **Database**: PostgreSQL (Production / Railway) with SQLite auto-fallback (Development)
- **Containerization**: Docker (Multi-stage build) & Docker Compose
