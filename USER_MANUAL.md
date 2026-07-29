# User Manual & Role Workflows

## Kreativicon ISP Order & Project Management System

---

## User Roles & Capabilities

| Role | Access Level | Key Functions |
|---|---|---|
| **Super Admin** | Full System Access | User management, system configuration, global reporting, audit logs |
| **Admin** | Full Operational Access | Manage orders, manage customers, generate reports, import & export Excel |
| **Project Coordinator** | Operations Management | Create orders, update statuses, assign engineers, track progress |
| **Engineer** | Field Operations | View assigned orders, update installation progress, upload survey docs |
| **Sales / User** | Account Management | Create customers, log new orders, view own logged orders |
| **Viewer** | Read-Only | View dashboards, orders, and reports without editing capabilities |

---

## Core Modules & Workflows

### 1. Executive Dashboard
- **KPI Widget Cards**: Real-time calculated statistics matching Excel formulas (Total Orders, Active Orders, LOS Completed, In Process/Installing, Awaiting TWAL Approval, Delivered, Cancelled).
- **Interactive Visualizations**: Region distribution, city breakdown, bandwidth distribution (100Mbps to 1Mbps), provider split (STC vs Mobily).
- **Delayed Order Alert Banner**: Highlights orders requiring customer/provider resolution.

### 2. Order Management & Data Table
- Filter orders by Region, City, Bandwidth, LOS Status, Workflow Status, Engineer, and Priority.
- Perform multi-column search and sorting.
- Execute **Bulk Status Updates** for multiple selected orders simultaneously.
- View detailed timeline, upload supporting PDF/Image documents, and re-assign field engineers.

### 3. Excel Import & Export Engine
- **Excel Import**: Drag & drop existing Excel sheets (`KI_Orders_with_Summary_Updated (4).xlsx`). Review column mapping matrix, preview rows, and check duplicate KI IDs before committing to the system.
- **Exporting**: Export entire multi-sheet Excel workbooks (`Active Orders`, `Cancelled Orders`, `Summary`), CSV data tables, and formatted PDF executive reports.

### 4. Customer Directory
- View detailed profiles, national address, VAT registration numbers, contact numbers, and order history per customer account.

### 5. Automated Email Reporting
- Configure automated daily, weekly, or monthly digest emails.
- Preview live HTML email templates with embedded KPI cards and detail tables.
- Send instant manual email reports with attached PDF & Excel summaries.
