import React from 'react';
import { Order } from '../types';

interface EngineerWorkloadProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const EngineerWorkload: React.FC<EngineerWorkloadProps> = ({
  orders,
  onSelectOrder
}) => {
  const engineers = [
    { name: 'Haroon', role: 'Senior MW Specialist', region: 'Central (Riyadh)', maxCapacity: 10 },
    { name: 'Shukoor', role: 'Field Deployment Engineer', region: 'Central (Qassim/Hail)', maxCapacity: 8 },
    { name: 'Tariq', role: 'Survey & LOS Specialist', region: 'East (Al-Ahsa/Dammam)', maxCapacity: 6 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Engineer Workload & Task Allocation</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Real-time workload capacity monitoring, field deployment tracking, and task assignment.
        </p>
      </div>

      {/* Engineer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {engineers.map(eng => {
          const assignedOrders = orders.filter(o => !o.is_cancelled && o.assigned_to === eng.name);
          const activeCount = assignedOrders.length;
          const capacityPct = Math.min(100, Math.round((activeCount / eng.maxCapacity) * 100));

          return (
            <div key={eng.name} className="glass-panel" style={{ padding: '1.25rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>👷 {eng.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{eng.role}</span>
                </div>
                <span className="badge badge-clos">{eng.region}</span>
              </div>

              {/* Workload Capacity Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Active Workload Capacity</span>
                  <span style={{ fontWeight: 700, color: capacityPct > 80 ? '#f43f5e' : '#10b981' }}>
                    {activeCount} / {eng.maxCapacity} Tasks ({capacityPct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${capacityPct}%`, height: '100%', background: capacityPct > 80 ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Assigned Orders List */}
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Assigned Circuits ({activeCount})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                {assignedOrders.length === 0 ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No active orders assigned currently.</span>
                ) : (
                  assignedOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="glass-card"
                      style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-blue)' }}>{order.ki_id}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.customer_name}</div>
                      </div>
                      <span className="badge badge-installation" style={{ fontSize: '0.65rem' }}>{order.order_status}</span>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
