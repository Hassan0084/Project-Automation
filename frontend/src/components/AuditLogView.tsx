import React, { useState } from 'react';
import { AuditLogItem } from '../types';

interface AuditLogViewProps {
  logs: AuditLogItem[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match =
        log.user.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.target.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term);
      if (!match) return false;
    }
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Audit Log & System History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Complete historical audit trail of user access, status transitions, imports, and exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <input
            type="text"
            placeholder="Search Logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Engineer">Engineer</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.timestamp}</td>
                <td style={{ fontWeight: 700 }}>{log.user}</td>
                <td><span className="badge badge-twal" style={{ fontSize: '0.65rem' }}>{log.role}</span></td>
                <td style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{log.action}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{log.target}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.details}</td>
                <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
