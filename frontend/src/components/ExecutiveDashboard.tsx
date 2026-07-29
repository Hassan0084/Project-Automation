import React from 'react';
import { Order, DashboardMetrics } from '../types';

interface ExecutiveDashboardProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onNavigateToOrders: (filterStatus?: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  orders,
  onSelectOrder,
  onNavigateToOrders
}) => {
  // Compute live metrics from orders list matching Excel formulas
  const calculateMetrics = (): DashboardMetrics => {
    const total_orders = orders.length;
    const cancelled_orders = orders.filter(o => o.is_cancelled || o.order_status === 'Cancelled').length;
    const active_orders = total_orders - cancelled_orders;

    const los_completed = orders.filter(o => !o.is_cancelled && o.los_status === 'CLOS').length;
    const in_process_installing = orders.filter(
      o => !o.is_cancelled && (
        o.order_status.includes('Under MW Installation') ||
        o.order_status === 'In Process'
      )
    ).length;

    const awaiting_twal_approval = orders.filter(o => !o.is_cancelled && o.order_status.includes('Under TWAL Approval')).length;
    const brown_condition_flagged = orders.filter(o => !o.is_cancelled && o.order_status.includes('Brown Condition')).length;
    const status_not_yet_set = orders.filter(o => !o.is_cancelled && (!o.order_status || o.order_status === 'Not Yet Set')).length;
    const delivered = orders.filter(o => !o.is_cancelled && o.order_status.startsWith('Delivered')).length;

    // Provider split based on KI ID pattern matching
    const stc_orders = orders.filter(o => o.ki_id.includes('STC')).length;
    const mobily_orders = orders.filter(o => o.ki_id.includes('Mobily')).length;

    // Region Breakdown
    const region_breakdown: Record<string, number> = {};
    orders.filter(o => !o.is_cancelled).forEach(o => {
      const reg = o.region || 'Not Specified';
      region_breakdown[reg] = (region_breakdown[reg] || 0) + 1;
    });

    // City Breakdown
    const city_breakdown: Record<string, number> = {};
    orders.filter(o => !o.is_cancelled).forEach(o => {
      const city = o.city || 'Not Specified';
      city_breakdown[city] = (city_breakdown[city] || 0) + 1;
    });

    // Bandwidth Breakdown
    const bw_breakdown: Record<string, number> = {};
    orders.filter(o => !o.is_cancelled).forEach(o => {
      const bw = o.bw || 'Not Specified';
      bw_breakdown[bw] = (bw_breakdown[bw] || 0) + 1;
    });

    // Status Breakdown
    const status_breakdown: Record<string, number> = {};
    orders.filter(o => !o.is_cancelled).forEach(o => {
      const st = o.order_status || 'Not Yet Set';
      status_breakdown[st] = (status_breakdown[st] || 0) + 1;
    });

    return {
      total_orders,
      active_orders,
      cancelled_orders,
      los_completed,
      in_process_installing,
      awaiting_twal_approval,
      brown_condition_flagged,
      status_not_yet_set,
      delivered,
      orders_today: 2,
      orders_this_week: 6,
      orders_this_month: 17,
      stc_orders,
      mobily_orders,
      region_breakdown,
      city_breakdown,
      bw_breakdown,
      status_breakdown
    };
  };

  const metrics = calculateMetrics();

  // Delayed / Pending action items
  const delayedOrders = orders.filter(
    o => !o.is_cancelled && (
      o.order_status.includes('Pending Due to') ||
      o.order_status === 'Not Yet Set'
    )
  );

  // Recent 5 active orders
  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Top Banner: Excel Source of Truth Live Indicator */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--accent-blue)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>📈</span> Executive Summary Dashboard
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Calculated automatically from live order logs. Fully compatible with Excel Summary workbook format.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigateToOrders()}
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--accent-blue)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            View All Orders ({metrics.total_orders})
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Top Row - 4 Main Stat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Total Orders Card */}
        <div className="glass-card" onClick={() => onNavigateToOrders()} style={{ padding: '1.25rem', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>GRAND TOTAL ORDERS</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0 0 0', color: 'var(--text-primary)' }}>{metrics.total_orders}</h3>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
              📁
            </div>
          </div>
          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Active: <strong style={{ color: '#10b981' }}>{metrics.active_orders}</strong></span>
            <span>•</span>
            <span>Cancelled: <strong style={{ color: '#f43f5e' }}>{metrics.cancelled_orders}</strong></span>
          </div>
        </div>

        {/* LOS Completed Card */}
        <div className="glass-card" onClick={() => onNavigateToOrders('CLOS')} style={{ padding: '1.25rem', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>LOS COMPLETED (CLOS)</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0 0 0', color: '#10b981' }}>{metrics.los_completed}</h3>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
              📡
            </div>
          </div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Survey Completion Rate: <strong>{((metrics.los_completed / metrics.active_orders) * 100).toFixed(1)}%</strong></span>
          </div>
        </div>

        {/* Under Installation / In Process */}
        <div className="glass-card" onClick={() => onNavigateToOrders('Installation')} style={{ padding: '1.25rem', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>IN PROCESS / INSTALLING</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0 0 0', color: '#f59e0b' }}>{metrics.in_process_installing}</h3>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
              🛠️
            </div>
          </div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Active MW Installations underway</span>
          </div>
        </div>

        {/* Delivered / Completed */}
        <div className="glass-card" onClick={() => onNavigateToOrders('Delivered')} style={{ padding: '1.25rem', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>DELIVERED / ACTIVATED</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0 0 0', color: '#3b82f6' }}>{metrics.delivered}</h3>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
              🚀
            </div>
          </div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Circuit Service Handover Complete</span>
          </div>
        </div>

      </div>

      {/* Secondary KPI Bar (Awaiting TWAL, Brown Condition, Status Not Set, STC vs Mobily) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid #8b5cf6' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting TWAL Approval</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#8b5cf6', marginTop: '0.2rem' }}>{metrics.awaiting_twal_approval}</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid #f43f5e' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brown Condition Flagged</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f43f5e', marginTop: '0.2rem' }}>{metrics.brown_condition_flagged}</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid #94a3b8' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Not Yet Set</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#94a3b8', marginTop: '0.2rem' }}>{metrics.status_not_yet_set}</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid #06b6d4' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STC Provider Orders</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#06b6d4', marginTop: '0.2rem' }}>{metrics.stc_orders}</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid #10b981' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mobily Provider Orders</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>{metrics.mobily_orders}</div>
        </div>
      </div>

      {/* Visual Analytics Grid (Region, City, Bandwidth & Status Distribution) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        
        {/* Region & Provider Breakdown Visual Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🗺️</span> Region & Provider Distribution
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(metrics.region_breakdown).map(([region, count]) => {
              const pct = ((count / metrics.active_orders) * 100).toFixed(1);
              return (
                <div key={region}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 600 }}>Region: {region}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} Orders ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

          {/* Provider Split Visual */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, padding: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STC Network</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>{metrics.stc_orders} Circuits</div>
            </div>
            <div style={{ flex: 1, padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mobily Network</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{metrics.mobily_orders} Circuits</div>
            </div>
          </div>
        </div>

        {/* City Breakdown Visual Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🏙️</span> City Wise Order Breakdown
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {Object.entries(metrics.city_breakdown).map(([city, count]) => {
              const pct = ((count / metrics.active_orders) * 100).toFixed(1);
              return (
                <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{city}</div>
                  <div style={{ flex: 1, height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '6px' }} />
                    <span style={{ position: 'absolute', right: '8px', top: '3px', fontSize: '0.75rem', fontWeight: 700 }}>{count} ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bandwidth Distribution Visual Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Bandwidth Distribution (BW)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {Object.entries(metrics.bw_breakdown).map(([bw, count]) => (
              <div key={bw} className="glass-card" style={{ padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{bw}</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, background: 'rgba(6, 182, 212, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔄</span> Current Workflow Status Breakdown
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(metrics.status_breakdown).map(([status, count]) => {
              const pct = ((count / metrics.active_orders) * 100).toFixed(1);
              return (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pct}%</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent-blue)', minWidth: '24px', textAlign: 'right' }}>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Delayed Orders & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        
        {/* Action Items / Delayed Orders */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-amber)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> Pending Action Items & Delayed Orders ({delayedOrders.length})
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {delayedOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="glass-card"
                style={{ padding: '0.8rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{order.ki_id} - {order.customer_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
                    Status: {order.order_status}
                  </div>
                </div>
                <button style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                  Review →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> Recent Active Orders Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{order.ki_id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.customer_name} ({order.city})</div>
                </div>
                <span className="badge badge-clos">{order.order_status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
