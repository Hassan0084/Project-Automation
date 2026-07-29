import React, { useState } from 'react';
import { Order, OrderStatus, UserRole } from '../types';

interface OrderManagementProps {
  orders: Order[];
  currentRole: UserRole;
  searchTerm: string;
  onSelectOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onNewOrder: () => void;
  onUpdateOrders: (updatedOrders: Order[]) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  currentRole,
  searchTerm,
  onSelectOrder,
  onEditOrder,
  onNewOrder,
  onUpdateOrders
}) => {
  // Filter States
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterCity, setFilterCity] = useState<string>('ALL');
  const [filterBw, setFilterBw] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterLos, setFilterLos] = useState<string>('ALL');
  const [filterEngineer, setFilterEngineer] = useState<string>('ALL');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusModal, setBulkStatusModal] = useState<boolean>(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<OrderStatus>('Under MW Installation');

  // Sorting
  const [sortField, setSortField] = useState<keyof Order>('sl_no');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    // Global Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match =
        order.ki_id.toLowerCase().includes(term) ||
        order.customer_name.toLowerCase().includes(term) ||
        order.order_number.toLowerCase().includes(term) ||
        order.circuit_id.toLowerCase().includes(term) ||
        (order.assigned_to && order.assigned_to.toLowerCase().includes(term)) ||
        (order.city && order.city.toLowerCase().includes(term)) ||
        (order.region && order.region.toLowerCase().includes(term));
      if (!match) return false;
    }

    if (filterRegion !== 'ALL' && order.region !== filterRegion) return false;
    if (filterCity !== 'ALL' && order.city !== filterCity) return false;
    if (filterBw !== 'ALL' && order.bw !== filterBw) return false;
    if (filterLos !== 'ALL' && order.los_status !== filterLos) return false;
    if (filterEngineer !== 'ALL') {
      if (filterEngineer === 'Unassigned' && order.assigned_to && order.assigned_to !== 'Unassigned' && order.assigned_to !== 'Pending Assignment') return false;
      if (filterEngineer !== 'Unassigned' && order.assigned_to !== filterEngineer) return false;
    }

    if (filterStatus !== 'ALL') {
      if (filterStatus === 'CLOS' && order.los_status !== 'CLOS') return false;
      if (filterStatus === 'Active' && order.is_cancelled) return false;
      if (filterStatus === 'Cancelled' && !order.is_cancelled) return false;
      if (filterStatus === 'Delivered' && !order.order_status.startsWith('Delivered')) return false;
      if (filterStatus === 'Installation' && !order.order_status.includes('Installation')) return false;
      if (filterStatus === 'Activation' && !order.order_status.includes('Activation')) return false;
      if (filterStatus === 'TWAL' && !order.order_status.includes('TWAL')) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sortedOrders.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleApplyBulkStatus = () => {
    const updated = orders.map(o => {
      if (selectedIds.includes(o.id)) {
        return {
          ...o,
          order_status: bulkTargetStatus,
          updated_at: new Date().toISOString()
        };
      }
      return o;
    });
    onUpdateOrders(updated);
    setSelectedIds([]);
    setBulkStatusModal(false);
  };

  // Helper for Status Badge styling
  const renderStatusBadge = (status: OrderStatus, isCancelled: boolean) => {
    if (isCancelled || status === 'Cancelled') {
      return <span className="badge badge-cancelled">Cancelled</span>;
    }
    if (status.startsWith('Delivered')) {
      return <span className="badge badge-delivered">{status}</span>;
    }
    if (status.includes('Installation')) {
      return <span className="badge badge-installation">{status}</span>;
    }
    if (status.includes('Activation')) {
      return <span className="badge badge-activation">{status}</span>;
    }
    if (status.includes('TWAL')) {
      return <span className="badge badge-twal">{status}</span>;
    }
    return <span className="badge badge-notset">{status || 'Not Yet Set'}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Order Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {sortedOrders.length} of {orders.length} orders
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {selectedIds.length > 0 && currentRole !== 'Viewer' && (
            <button
              onClick={() => setBulkStatusModal(true)}
              style={{
                background: 'var(--accent-purple)',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Bulk Action ({selectedIds.length})
            </button>
          )}

          {currentRole !== 'Viewer' && (
            <button
              onClick={onNewOrder}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              + Create New Order
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', alignItems: 'center' }}>
        
        {/* Region Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>REGION</label>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Regions</option>
            <option value="CENTRAL">CENTRAL</option>
            <option value="EAST">EAST</option>
            <option value="WEST">WEST</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>CITY</label>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Cities</option>
            <option value="RIYADHDST">RIYADHDST</option>
            <option value="QASSIM">QASSIM</option>
            <option value="RIYADH">RIYADH</option>
            <option value="ALAHSA">ALAHSA</option>
            <option value="HAIL">HAIL</option>
          </select>
        </div>

        {/* Bandwidth Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>BANDWIDTH</label>
          <select
            value={filterBw}
            onChange={(e) => setFilterBw(e.target.value)}
            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Bandwidths</option>
            <option value="100Mbps">100Mbps</option>
            <option value="25MBPs">25MBPs</option>
            <option value="20MBPs">20MBPs</option>
            <option value="8MBPs">8MBPs</option>
            <option value="6MBPs">6MBPs</option>
            <option value="4MBPs">4MBPs</option>
            <option value="1MBPs">1MBPs</option>
          </select>
        </div>

        {/* LOS Status Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>LOS SURVEY</label>
          <select
            value={filterLos}
            onChange={(e) => setFilterLos(e.target.value)}
            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All LOS Statuses</option>
            <option value="CLOS">CLOS (Completed)</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>WORKFLOW STATUS</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Orders Only</option>
            <option value="Installation">Under Installation</option>
            <option value="Activation">Under Activation</option>
            <option value="TWAL">Under TWAL Approval</option>
            <option value="Delivered">Delivered / Completed</option>
            <option value="Cancelled">Cancelled Orders</option>
          </select>
        </div>

        {/* Engineer Filter */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>ENGINEER</label>
          <select
            value={filterEngineer}
            onChange={(e) => setFilterEngineer(e.target.value)}
            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Engineers</option>
            <option value="Haroon">Haroon</option>
            <option value="Shukoor">Shukoor</option>
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>

        {/* Reset Filters */}
        <div style={{ alignSelf: 'end' }}>
          <button
            onClick={() => {
              setFilterRegion('ALL');
              setFilterCity('ALL');
              setFilterBw('ALL');
              setFilterStatus('ALL');
              setFilterLos('ALL');
              setFilterEngineer('ALL');
            }}
            style={{ width: '100%', padding: '0.45rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        </div>

      </div>

      {/* Main Data Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              {currentRole !== 'Viewer' && (
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === sortedOrders.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              <th>SL</th>
              <th onClick={() => { setSortField('ki_id'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
                KI ID {sortField === 'ki_id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Order Rec'd</th>
              <th>Region</th>
              <th>City</th>
              <th>Circuit ID</th>
              <th>Customer Name</th>
              <th>BW</th>
              <th>LOS Status</th>
              <th>Workflow Status</th>
              <th>Engineer</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id} style={{ opacity: order.is_cancelled ? 0.65 : 1 }}>
                {currentRole !== 'Viewer' && (
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                    />
                  </td>
                )}
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{order.sl_no}</td>
                <td>
                  <span
                    onClick={() => onSelectOrder(order)}
                    style={{ fontWeight: 800, color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {order.ki_id}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.order_received}</td>
                <td><span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>{order.region}</span></td>
                <td>{order.city}</td>
                <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{order.circuit_id}</td>
                <td style={{ fontWeight: 600 }}>{order.customer_name}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{order.bw}</td>
                <td>
                  {order.los_status === 'CLOS' ? (
                    <span className="badge badge-clos">CLOS</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.los_status || '-'}</span>
                  )}
                </td>
                <td>{renderStatusBadge(order.order_status, order.is_cancelled)}</td>
                <td>
                  {order.assigned_to ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>👷 {order.assigned_to}</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', italic: 'true' }}>Unassigned</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onSelectOrder(order)}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: 'none', color: '#3b82f6', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      View
                    </button>

                    {currentRole !== 'Viewer' && (
                      <button
                        onClick={() => onEditOrder(order)}
                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'var(--text-primary)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Status Update Modal */}
      {bulkStatusModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '400px', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Bulk Workflow Status Change</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Updating {selectedIds.length} selected orders to new workflow status:
            </p>

            <select
              value={bulkTargetStatus}
              onChange={(e) => setBulkTargetStatus(e.target.value as OrderStatus)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}
            >
              <option value="Under MW Installation">Under MW Installation</option>
              <option value="Under Activation">Under Activation</option>
              <option value="Under TWAL Approval">Under TWAL Approval</option>
              <option value="Delivered / CR Pending">Delivered / CR Pending</option>
              <option value="Delivered ">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setBulkStatusModal(false)}
                style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBulkStatus}
                style={{ background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Apply Status Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
