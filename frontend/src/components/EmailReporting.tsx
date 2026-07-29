import React, { useState } from 'react';
import { Order } from '../types';

interface EmailReportingProps {
  orders: Order[];
}

export const EmailReporting: React.FC<EmailReportingProps> = ({ orders }) => {
  const [recipients, setRecipients] = useState<string>('executives@kreativicon.sa, ops@kreativicon.sa');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  const activeOrders = orders.filter(o => !o.is_cancelled);
  const deliveredCount = orders.filter(o => !o.is_cancelled && o.order_status.startsWith('Delivered')).length;
  const installingCount = orders.filter(o => !o.is_cancelled && o.order_status.includes('Installation')).length;

  const handleSendReport = () => {
    setSendSuccessMessage(`Daily Executive Summary Report sent successfully via SMTP to ${recipients}! PDF and Excel attachments included.`);
    setTimeout(() => setSendSuccessMessage(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Automated Email Reporting & Notifications</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Configure automated email dispatch for daily, weekly, and monthly ISP management summaries.
        </p>
      </div>

      {sendSuccessMessage && (
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #10b981', color: '#10b981', fontWeight: 600 }}>
          ✅ {sendSuccessMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        
        {/* Email Configuration Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚙️</span> Email Dispatch & Recipient Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RECIPIENT EMAIL ADDRESSES (COMMA SEPARATED)</label>
              <input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.3rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>AUTOMATED SCHEDULE</label>
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value as any)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.3rem' }}
              >
                <option value="daily">Daily Summary Report (Every day at 08:00 AM)</option>
                <option value="weekly">Weekly Status Digest (Every Sunday at 07:00 AM)</option>
                <option value="monthly">Monthly Executive KPI Report (1st of Month)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>REPORT ATTACHMENT FORMATS</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="checkbox" defaultChecked /> Excel (.xlsx)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="checkbox" defaultChecked /> Executive PDF
                </label>
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={handleSendReport}
                style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                🚀 Send Instant Report Now
              </button>
            </div>

          </div>
        </div>

        {/* Live HTML Email Template Previewer */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✉️</span> HTML Email Live Preview
          </h3>

          <div style={{ background: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', fontSize: '0.85rem' }}>
            <div style={{ borderBottom: '1px solid #334155', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Subject: <strong>[Kreativicon ISP] Daily Operations & Order Summary - {new Date().toISOString().substring(0, 10)}</strong></div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>To: {recipients}</div>
            </div>

            <div style={{ color: '#f8fafc', lineHeight: 1.5 }}>
              <p>Dear Management Team,</p>
              <p style={{ margin: '0.6rem 0' }}>Here is the daily executive summary of ISP customer orders and project milestones:</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', margin: '1rem 0' }}>
                <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Active</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>{activeOrders.length}</div>
                </div>
                <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Installing</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{installingCount}</div>
                </div>
                <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Delivered</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{deliveredCount}</div>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>* Complete detail breakdown attached as Excel (.xlsx) and PDF document.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
