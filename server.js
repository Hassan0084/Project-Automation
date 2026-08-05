import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pg from 'pg';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ── DATABASE ABSTRACTION (PostgreSQL on Railway/Docker, SQLite fallback) ──
const isPg = Boolean(process.env.DATABASE_URL);
let pgPool = null;
let sqliteDb = null;

if (isPg) {
  console.log('Connecting to PostgreSQL database via DATABASE_URL...');
  pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });
} else {
  console.log('No DATABASE_URL set. Using local SQLite database (data/kreativicon.sqlite)...');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  sqliteDb = new sqlite3.Database(path.join(dataDir, 'kreativicon.sqlite'));
}

// Database helper wrapper for SQL execution
async function dbQuery(sql, params = []) {
  if (isPg) {
    // Convert ? parameters to $1, $2 for Postgres if needed
    let index = 1;
    const pgSql = sql.replace(/\?/g, () => `$${index++}`);
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  } else {
    return new Promise((resolve, reject) => {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) reject(err); else resolve(rows);
        });
      } else {
        sqliteDb.run(sql, params, function (err) {
          if (err) reject(err); else resolve({ id: this.lastID, changes: this.changes });
        });
      }
    });
  }
}

// ── INITIAL ORDERS SEED DATA ──
const SEED_ORDERS = [
  { id: 'ord-1', sl_no: '1', ki_id: 'KIC-001-MW-MEL-STC', order_received: '2026-07-02', region: 'CENTRAL', city: 'QASSIM', circuit_id: 'QASSIM-RIYADH DIAS11003', order_number: 'I14977452579171', customer_name: 'Fosam Limited Company', customer_contact: 'ابتسام اليامي - 553584472', bw: '20MBPs', los_performed: '2026-07-05', los_status: 'CLOS', los_id: '601-22-000', cwo_date: '2026-07-13', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under MW Installation', assigned_to: 'Haroon', is_cancelled: false, priority: 'High', remarks: 'Dispatched MW team for site installation.' },
  { id: 'ord-2', sl_no: '2', ki_id: 'KIC-002-MW-MEL-STC', order_received: '2026-07-02', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDST-RIYADH DIAS11019', order_number: 'I14977108106221', customer_name: 'Bunyan for Industry CompanySole Partnership', customer_contact: 'وليد الغامدي - 565577234', bw: '25MBPs', los_performed: '2026-07-05', los_status: 'CLOS', los_id: 'ZAKA160', cwo_date: '2026-07-13', installation_start: '2026-07-23', installation_complete: '2026-07-25', delivery_date: '2026-07-25', order_status: 'Delivered /CR Pending', assigned_to: 'Haroon', is_cancelled: false, priority: 'Medium', remarks: '' },
  { id: 'ord-3', sl_no: '3', ki_id: 'KIC-003-MW-MEL-STC', order_received: '2026-07-08', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDST-RIYADH DIAS11048', order_number: 'I14978406074781', customer_name: 'MINISTRY OF ISLAMIC AFFAIRS1', customer_contact: 'mutlatq mutlatq- 554141990', bw: '6MBPs', los_performed: '2026-07-09', los_status: 'CLOS', los_id: 'ZTMA001', cwo_date: '2026-07-19', installation_start: '2026-07-25', installation_complete: '2026-07-26', delivery_date: '2026-07-26', order_status: 'Delivered ', assigned_to: 'Shukoor', is_cancelled: false, priority: 'High', remarks: '' },
  { id: 'ord-4', sl_no: '4', ki_id: 'KIC-004-MW-MEL-STC', order_received: '2026-07-08', region: 'CENTRAL', city: 'QASSIM', circuit_id: 'QASSIM-RIYADH DIAS11007', order_number: 'I14978403932431', customer_name: 'MINISTRY OF ISLAMIC AFFAIRS1', customer_contact: 'mutlatq mutlatq- 554141990', bw: '6MBPs', los_performed: '2026-07-13', los_status: 'CLOS', los_id: 'ZBRA012', cwo_date: '2026-07-27', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under MW Installation', assigned_to: 'Haroon', is_cancelled: false, priority: 'Medium', remarks: '' },
  { id: 'ord-5', sl_no: '5', ki_id: 'KIC-005-MW-MEL-STC', order_received: '2026-07-10', region: 'CENTRAL', city: 'QASSIM', circuit_id: 'QASSIM-RIYADH W-DIA64771', order_number: 'I-154546342-0886', customer_name: 'NOURNET ISP 1', customer_contact: 'Atif Ahmad - 966504164527', bw: '8MBPs', los_performed: '2026-07-13', los_status: 'CLOS', los_id: 'ZBDA012', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under Activation', assigned_to: 'Unassigned', is_cancelled: false, priority: 'Medium', remarks: '' },
  { id: 'ord-6', sl_no: '6', ki_id: 'KIC-006-MW-MEL-STC', order_received: '2026-07-12', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDISTRICTS-RIYADH W-DIA64993', order_number: 'I-154915203-2128', customer_name: 'NOURNET ISP 1', customer_contact: 'Atif Ahmad - 966504164527', bw: '4MBPs', los_performed: '2026-07-13', los_status: 'CLOS', los_id: 'ZDAA055', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under Activation', assigned_to: 'Unassigned', is_cancelled: false, priority: 'Low', remarks: '' },
  { id: 'ord-7', sl_no: '7', ki_id: 'KIC-007-MW-MEL-STC', order_received: '2026-07-12', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDISTRICTS-RIYADH W-DIA64472', order_number: 'I-154001313-9084', customer_name: 'NOURNET ISP 1', customer_contact: 'Atif Ahmad - 966504164527', bw: '8MBPs', los_performed: '2026-07-13', los_status: 'CLOS', los_id: 'ZTMA001', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under TWAL Approval', assigned_to: 'Unassigned', is_cancelled: false, priority: 'High', remarks: '' },
  { id: 'ord-8', sl_no: '8', ki_id: 'KIC-008-MW-MEL-Mobily', order_received: '2026-07-21', region: 'CENTRAL', city: 'RIYADH', circuit_id: 'SIP Link 1-274297070922', order_number: '1001274298017320', customer_name: 'Life Care Medical Complex', customer_contact: '0573240869 منهاز', bw: '1MBPs', los_performed: '2026-07-21', los_status: 'CLOS', los_id: 'C6406', cwo_date: '2026-07-23', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Pending Due to Ip issues at Mobily End', assigned_to: 'Haroon', is_cancelled: false, priority: 'High', remarks: 'Pending resolution of IP pool assignment on Mobily core node.' },
  { id: 'ord-9', sl_no: '9', ki_id: 'KIC-009-MW-MEL-STC', order_received: '2026-07-16', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDISTRICTS-RIYADH W-DIA65540', order_number: 'I-155313238-4448', customer_name: 'NOURNET ISP 1', customer_contact: 'Atif Ahmad - 966504164527', bw: '8MBPs', los_performed: '2026-07-20', los_status: 'CLOS', los_id: 'ZAKA013', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under TWAL Approval', assigned_to: 'Unassigned', is_cancelled: false, priority: 'Medium', remarks: '' },
  { id: 'ord-10', sl_no: '10', ki_id: 'KIC-010-MW-MEL-STC', order_received: '2026-06-03', region: 'CENTRAL', city: 'RIYADH', circuit_id: 'RIYADH-RIYADH W-PLL62209', order_number: 'I-150409923-1673', customer_name: 'TAWAL', customer_contact: 'Muhanned Abusummah-- 0502897276', bw: '100Mbps', los_performed: '', los_status: 'CLOS', los_id: 'ZR4020', cwo_date: '', installation_start: '2026-07-20', installation_complete: '2026-07-20', delivery_date: '2026-07-20', order_status: 'Delivered / CR Pending', assigned_to: 'Haroon', is_cancelled: false, priority: 'High', remarks: '' },
  { id: 'ord-11', sl_no: '11', ki_id: 'KIC-011-MW-MEL-STC', order_received: '2026-06-03', region: 'CENTRAL', city: 'RIYADH', circuit_id: 'RIYADH-RIYADH W-PLL61594', order_number: 'I-149425327-9129', customer_name: 'TAWAL', customer_contact: 'Abdulrahman Balfaqih-- 0502897276', bw: '100Mbps', los_performed: '', los_status: 'CLOS', los_id: 'ZAKA953', cwo_date: '', installation_start: '2026-07-23', installation_complete: '', delivery_date: '', order_status: 'Under MW Installation / Pending Due to Permission Letter ', assigned_to: 'Haroon', is_cancelled: false, priority: 'High', remarks: 'Awaiting municipality permission letter for roof access.' },
  { id: 'ord-12', sl_no: '12', ki_id: 'KIC-012-MW-MEL-STC', order_received: '2026-06-03', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDISTRICTS-RIYADH W-PLL61621', order_number: 'I-149433405-9386', customer_name: 'TAWAL', customer_contact: 'Abdulrahman Balfaqih-- 0502897276', bw: '100Mbps', los_performed: '', los_status: 'CLOS', los_id: 'FRB04', cwo_date: '', installation_start: '2026-07-17', installation_complete: '2026-07-20', delivery_date: '2026-07-24', order_status: 'Delivered / CR Pending', assigned_to: 'Haroon', is_cancelled: false, priority: 'High', remarks: '' },
  { id: 'ord-13', sl_no: '13', ki_id: 'KIC-013-MW-MEL-STC', order_received: '2026-06-04', region: 'EAST', city: 'ALAHSA', circuit_id: 'ALAHSA-DAMMAM W-PLL60851', order_number: 'I-148474460-6471', customer_name: 'TAWAL', customer_contact: 'Muhanned Abusummah-- 0502897276', bw: '100Mbps', los_performed: '', los_status: 'CLOS', los_id: 'FRD12', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under MW Installation', assigned_to: 'Unassigned', is_cancelled: false, priority: 'High', remarks: '' },
  { id: 'ord-14', sl_no: '14', ki_id: 'KIC-014-MW-MEL-STC', order_received: '2026-07-19', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDISTRICTS-RIYADH W-DIA65578', order_number: 'I-155424122-6722', customer_name: 'NOURNET ISP 1', customer_contact: 'Atif--0504164527', bw: '8MBPS', los_performed: '2026-07-20', los_status: 'CLOS', los_id: 'FTR16', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under TWAL Approval', assigned_to: 'Unassigned', is_cancelled: false, priority: 'Medium', remarks: '' },
  { id: 'ord-15', sl_no: '15', ki_id: 'KIC-015-MW-MEL-STC', order_received: '2026-07-19', region: 'CENTRAL', city: 'RIYADHDST', circuit_id: 'RIYADHDISTRICTS-RIYADH W-DIA65586', order_number: 'I-155428046-6760', customer_name: 'NOURNET ISP 1', customer_contact: 'Atif--0504164527', bw: '8MBPS', los_performed: '2026-07-20', los_status: 'CLOS', los_id: 'FTR14', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Under TWAL Approval', assigned_to: 'Unassigned', is_cancelled: false, priority: 'Medium', remarks: '' },
  { id: 'ord-16', sl_no: '16', ki_id: 'KIC-016-MW-MEL-STC', order_received: '2026-07-26', region: 'CENTRAL', city: 'QASSIM', circuit_id: 'QASSIM-RIYADH W-DIA66191', order_number: 'I-155826101-8176', customer_name: 'NOURNET ISP 1 - NOURNET ISP - SC 1', customer_contact: 'Atif--0504164527', bw: '8MBPS', los_performed: '', los_status: '', los_id: '689-00-101', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Not Yet Set', assigned_to: 'Unassigned', is_cancelled: false, priority: 'Low', remarks: '' },
  { id: 'ord-17', sl_no: '17', ki_id: 'KIC-017-MW-MEL-STC', order_received: '2026-07-26', region: 'CENTRAL', city: 'HAIL', circuit_id: 'HAIL-RIYADH W-DIA66171', order_number: 'I-155792125-7075', customer_name: 'NOURNET ISP 1 - NOURNET ISP - SC 1', customer_contact: 'Atif--0504164527', bw: '8MBPS', los_performed: '', los_status: '', los_id: 'ZHAA035', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Not Yet Set', assigned_to: 'Unassigned', is_cancelled: false, priority: 'Low', remarks: '' },
  { id: 'ord-18', sl_no: '1', ki_id: 'KIC-018-MW-MEL-STC', order_received: '2026-07-16', region: 'CENTRAL', city: 'RIYADH', circuit_id: 'RIYADH-RIYADH W-DIA65391', order_number: 'I-155156872-9273', customer_name: 'NOURNET ISP 1', customer_contact: 'Atif Ahmad - 966504164527', bw: '8MBPs', los_performed: '2026-07-20', los_status: 'CLOS', los_id: 'ZAKA013', cwo_date: '', installation_start: '', installation_complete: '', delivery_date: '', order_status: 'Cancelled', assigned_to: 'Unassigned', is_cancelled: true, priority: 'Low', remarks: 'Cancelled by customer before survey deployment.' }
];

const SEED_USERS = [
  { id: 'usr-1', name: 'Hassan Saleem', role: 'Super Admin', email: 'hassan@kreativicon.com' },
  { id: 'usr-2', name: 'Haroon', role: 'Engineer', email: 'haroon@kreativicon.com' },
  { id: 'usr-3', name: 'Shukoor', role: 'Engineer', email: 'shukoor@kreativicon.com' },
  { id: 'usr-4', name: 'Viewer User', role: 'Viewer', email: 'viewer@kreativicon.com' }
];

// ── SCHEMA MIGRATION & DATA SEEDING ──
async function initDb() {
  try {
    if (isPg) {
      await dbQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          role VARCHAR(64) NOT NULL,
          email VARCHAR(128) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(64) PRIMARY KEY,
          sl_no VARCHAR(32),
          ki_id VARCHAR(128) NOT NULL,
          order_received VARCHAR(64),
          region VARCHAR(64),
          city VARCHAR(64),
          circuit_id VARCHAR(128),
          order_number VARCHAR(128),
          customer_name VARCHAR(256),
          customer_contact VARCHAR(256),
          bw VARCHAR(64),
          los_performed VARCHAR(64),
          los_status VARCHAR(64),
          los_id VARCHAR(64),
          cwo_date VARCHAR(64),
          installation_start VARCHAR(64),
          installation_complete VARCHAR(64),
          delivery_date VARCHAR(64),
          order_status VARCHAR(128),
          assigned_to VARCHAR(128),
          is_cancelled BOOLEAN DEFAULT FALSE,
          priority VARCHAR(32) DEFAULT 'Medium',
          service_type VARCHAR(128) DEFAULT 'Microwave Link',
          remarks TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id VARCHAR(64) PRIMARY KEY,
          timestamp VARCHAR(64),
          user_name VARCHAR(128),
          role VARCHAR(64),
          action VARCHAR(128),
          target VARCHAR(128),
          details TEXT,
          ip_address VARCHAR(64)
        );
      `);
    } else {
      await dbQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await dbQuery(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          sl_no TEXT,
          ki_id TEXT NOT NULL,
          order_received TEXT,
          region TEXT,
          city TEXT,
          circuit_id TEXT,
          order_number TEXT,
          customer_name TEXT,
          customer_contact TEXT,
          bw TEXT,
          los_performed TEXT,
          los_status TEXT,
          los_id TEXT,
          cwo_date TEXT,
          installation_start TEXT,
          installation_complete TEXT,
          delivery_date TEXT,
          order_status TEXT,
          assigned_to TEXT,
          is_cancelled INTEGER DEFAULT 0,
          priority TEXT DEFAULT 'Medium',
          service_type TEXT DEFAULT 'Microwave Link',
          remarks TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await dbQuery(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY,
          timestamp TEXT,
          user_name TEXT,
          role TEXT,
          action TEXT,
          target TEXT,
          details TEXT,
          ip_address TEXT
        );
      `);
    }

    // Seed users if empty
    const existingUsers = await dbQuery(`SELECT COUNT(*) as count FROM users`);
    const uCount = Number(existingUsers[0]?.count || 0);
    if (uCount === 0) {
      for (const u of SEED_USERS) {
        await dbQuery(`INSERT INTO users (id, name, role, email) VALUES (?, ?, ?, ?)`, [u.id, u.name, u.role, u.email]);
      }
      console.log('✅ Users table seeded with initial accounts.');
    }

    // Seed orders if empty
    const existingOrders = await dbQuery(`SELECT COUNT(*) as count FROM orders`);
    const oCount = Number(existingOrders[0]?.count || 0);
    if (oCount === 0) {
      for (const o of SEED_ORDERS) {
        await dbQuery(`
          INSERT INTO orders (
            id, sl_no, ki_id, order_received, region, city, circuit_id, order_number, customer_name, customer_contact,
            bw, los_performed, los_status, los_id, cwo_date, installation_start, installation_complete, delivery_date,
            order_status, assigned_to, is_cancelled, priority, remarks
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          o.id, o.sl_no, o.ki_id, o.order_received, o.region, o.city, o.circuit_id, o.order_number, o.customer_name, o.customer_contact,
          o.bw, o.los_performed || '', o.los_status || '', o.los_id || '', o.cwo_date || '', o.installation_start || '', o.installation_complete || '', o.delivery_date || '',
          o.order_status, o.assigned_to, isPg ? o.is_cancelled : (o.is_cancelled ? 1 : 0), o.priority || 'Medium', o.remarks || ''
        ]);
      }
      console.log('✅ Orders table seeded with 18 initial circuit orders.');
    }

    console.log('🚀 Database initialization & schema verification complete.');
  } catch (err) {
    console.error('❌ Database Initialization Error:', err);
  }
}

// ── REST API ROUTES ──

// GET /api/orders
app.get('/api/orders', async (req, res) => {
  try {
    const rows = await dbQuery(`SELECT * FROM orders ORDER BY sl_no ASC, created_at DESC`);
    const normalized = rows.map(r => ({
      ...r,
      is_cancelled: Boolean(r.is_cancelled === true || r.is_cancelled === 1 || r.is_cancelled === 'true')
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  try {
    const o = req.body;
    const id = o.id || 'ord-' + Date.now();
    await dbQuery(`
      INSERT INTO orders (
        id, sl_no, ki_id, order_received, region, city, circuit_id, order_number, customer_name, customer_contact,
        bw, los_performed, los_status, los_id, cwo_date, installation_start, installation_complete, delivery_date,
        order_status, assigned_to, is_cancelled, priority, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, o.sl_no || '', o.ki_id, o.order_received || '', o.region || 'CENTRAL', o.city || '', o.circuit_id || '', o.order_number || '', o.customer_name || '', o.customer_contact || '',
      o.bw || '', o.los_performed || '', o.los_status || '', o.los_id || '', o.cwo_date || '', o.installation_start || '', o.installation_complete || '', o.delivery_date || '',
      o.order_status || 'Under MW Installation', o.assigned_to || 'Unassigned', isPg ? Boolean(o.is_cancelled) : (o.is_cancelled ? 1 : 0), o.priority || 'Medium', o.remarks || ''
    ]);

    // Log Audit Event
    await dbQuery(`
      INSERT INTO audit_logs (id, timestamp, user_name, role, action, target, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'audit-' + Date.now(),
      new Date().toISOString().replace('T', ' ').substring(0, 19),
      o.created_by || 'Super Admin',
      'Super Admin',
      'Order Created',
      o.ki_id,
      `Created new project order for ${o.customer_name}`,
      req.ip || '127.0.0.1'
    ]);

    res.status(201).json({ success: true, id, order: o });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const o = req.body;
    await dbQuery(`
      UPDATE orders SET
        sl_no = ?, ki_id = ?, order_received = ?, region = ?, city = ?, circuit_id = ?, order_number = ?,
        customer_name = ?, customer_contact = ?, bw = ?, los_performed = ?, los_status = ?, los_id = ?,
        cwo_date = ?, installation_start = ?, installation_complete = ?, delivery_date = ?,
        order_status = ?, assigned_to = ?, is_cancelled = ?, priority = ?, remarks = ?
      WHERE id = ?
    `, [
      o.sl_no || '', o.ki_id, o.order_received || '', o.region || 'CENTRAL', o.city || '', o.circuit_id || '', o.order_number || '',
      o.customer_name || '', o.customer_contact || '', o.bw || '', o.los_performed || '', o.los_status || '', o.los_id || '',
      o.cwo_date || '', o.installation_start || '', o.installation_complete || '', o.delivery_date || '',
      o.order_status || 'Under MW Installation', o.assigned_to || 'Unassigned', isPg ? Boolean(o.is_cancelled) : (o.is_cancelled ? 1 : 0), o.priority || 'Medium', o.remarks || '',
      id
    ]);

    // Log Audit Event
    await dbQuery(`
      INSERT INTO audit_logs (id, timestamp, user_name, role, action, target, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'audit-' + Date.now(),
      new Date().toISOString().replace('T', ' ').substring(0, 19),
      o.updated_by || 'Super Admin',
      'Super Admin',
      'Order Updated',
      o.ki_id,
      `Updated details for ${o.ki_id} (${o.customer_name})`,
      req.ip || '127.0.0.1'
    ]);

    res.json({ success: true, order: o });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/import
app.post('/api/orders/import', async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) return res.status(400).json({ error: 'Expected array of orders' });

    // Truncate and replace
    await dbQuery(`DELETE FROM orders`);
    for (const o of orders) {
      await dbQuery(`
        INSERT INTO orders (
          id, sl_no, ki_id, order_received, region, city, circuit_id, order_number, customer_name, customer_contact,
          bw, los_performed, los_status, los_id, cwo_date, installation_start, installation_complete, delivery_date,
          order_status, assigned_to, is_cancelled, priority, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        o.id || 'xl-' + Date.now() + '-' + Math.random(), o.sl_no || '', o.ki_id || 'IMPORT', o.order_received || '', o.region || 'CENTRAL', o.city || '', o.circuit_id || '', o.order_number || '', o.customer_name || '', o.customer_contact || '',
        o.bw || '', o.los_performed || '', o.los_status || '', o.los_id || '', o.cwo_date || '', o.installation_start || '', o.installation_complete || '', o.delivery_date || '',
        o.order_status || 'Under MW Installation', o.assigned_to || 'Unassigned', isPg ? Boolean(o.is_cancelled) : (o.is_cancelled ? 1 : 0), o.priority || 'Medium', o.remarks || ''
      ]);
    }

    await dbQuery(`
      INSERT INTO audit_logs (id, timestamp, user_name, role, action, target, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'audit-' + Date.now(),
      new Date().toISOString().replace('T', ' ').substring(0, 19),
      'Super Admin',
      'Super Admin',
      'Excel Bulk Import',
      'Orders Table',
      `Imported ${orders.length} orders from Excel workbook`,
      req.ip || '127.0.0.1'
    ]);

    res.json({ success: true, count: orders.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users
app.get('/api/users', async (req, res) => {
  try {
    const users = await dbQuery(`SELECT * FROM users ORDER BY created_at ASC`);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users
app.post('/api/users', async (req, res) => {
  try {
    const { name, role, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and Email are required' });
    const id = 'usr-' + Date.now();
    await dbQuery(`INSERT INTO users (id, name, role, email) VALUES (?, ?, ?, ?)`, [id, name, role || 'Engineer', email]);
    
    await dbQuery(`
      INSERT INTO audit_logs (id, timestamp, user_name, role, action, target, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'audit-' + Date.now(),
      new Date().toISOString().replace('T', ' ').substring(0, 19),
      'Super Admin',
      'Super Admin',
      'User Account Created',
      name,
      `Created new account for ${name} (${role})`,
      req.ip || '127.0.0.1'
    ]);

    res.status(201).json({ id, name, role: role || 'Engineer', email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/audit-logs
app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await dbQuery(`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100`);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SERVE STATIC FRONTEND BUILD (Production Mode) ──
const frontendDist = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  console.log('Serving frontend static files from frontend/dist...');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
} else {
  // If frontend is running separately or in standalone single-file mode
  const indexHtml = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexHtml)) {
    app.get('/', (req, res) => res.sendFile(indexHtml));
  }
}

// ── START SERVER ──
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Kreativ Icon ISP System Server listening on port ${PORT}`);
    console.log(`👉 Access URL: http://localhost:${PORT}`);
    console.log(`===================================================`);
  });
});
