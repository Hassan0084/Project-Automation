import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';

interface OrderFormModalProps {
  orderToEdit?: Order | null;
  onClose: () => void;
  onSave: (order: Order) => void;
  totalOrdersCount: number;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  orderToEdit,
  onClose,
  onSave,
  totalOrdersCount
}) => {
  const isEdit = !!orderToEdit;

  const [kiId, setKiId] = useState(
    orderToEdit?.ki_id || `KIC-0${totalOrdersCount + 1}-MW-MEL-STC`
  );
  const [orderNumber, setOrderNumber] = useState(orderToEdit?.order_number || '');
  const [circuitId, setCircuitId] = useState(orderToEdit?.circuit_id || '');
  const [customerName, setCustomerName] = useState(orderToEdit?.customer_name || '');
  const [customerContact, setCustomerContact] = useState(orderToEdit?.customer_contact || '');
  const [region, setRegion] = useState(orderToEdit?.region || 'CENTRAL');
  const [city, setCity] = useState(orderToEdit?.city || 'RIYADHDST');
  const [bw, setBw] = useState(orderToEdit?.bw || '8MBPs');
  const [losStatus, setLosStatus] = useState(orderToEdit?.los_status || 'CLOS');
  const [losId, setLosId] = useState(orderToEdit?.los_id || '');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(orderToEdit?.order_status || 'Under MW Installation');
  const [assignedTo, setAssignedTo] = useState(orderToEdit?.assigned_to || 'Haroon');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(orderToEdit?.priority || 'Medium');
  const [remarks, setRemarks] = useState(orderToEdit?.remarks || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !orderNumber) {
      alert('Please fill in Customer Name and Order Number.');
      return;
    }

    const savedOrder: Order = {
      id: orderToEdit?.id || `ord-${Date.now()}`,
      sl_no: orderToEdit?.sl_no || `${totalOrdersCount + 1}`,
      ki_id: kiId,
      order_received: orderToEdit?.order_received || new Date().toISOString().substring(0, 10),
      region,
      city,
      circuit_id: circuitId,
      order_number: orderNumber,
      customer_name: customerName,
      customer_contact: customerContact,
      bw,
      los_performed: orderToEdit?.los_performed || new Date().toISOString().substring(0, 10),
      los_status: losStatus as any,
      los_id: losId,
      cwo_date: orderToEdit?.cwo_date || '',
      installation_start: orderToEdit?.installation_start || '',
      installation_complete: orderToEdit?.installation_complete || '',
      delivery_date: orderToEdit?.delivery_date || '',
      order_status: orderStatus,
      assigned_to: assignedTo,
      is_cancelled: orderStatus === 'Cancelled',
      priority,
      remarks,
      updated_at: new Date().toISOString()
    };

    onSave(savedOrder);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', borderRadius: '12px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {isEdit ? `Edit Order (${orderToEdit.ki_id})` : 'Create New ISP Order'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>KI ID</label>
            <input
              type="text"
              value={kiId}
              onChange={(e) => setKiId(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ORDER NUMBER</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. I14977452579171"
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CUSTOMER NAME</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Company or Government Entity Name"
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CUSTOMER CONTACT</label>
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="Contact Person & Phone"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CIRCUIT ID</label>
            <input
              type="text"
              value={circuitId}
              onChange={(e) => setCircuitId(e.target.value)}
              placeholder="e.g. RIYADHDST-RIYADH DIAS11019"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>REGION</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            >
              <option value="CENTRAL">CENTRAL</option>
              <option value="EAST">EAST</option>
              <option value="WEST">WEST</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CITY</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            >
              <option value="RIYADHDST">RIYADHDST</option>
              <option value="QASSIM">QASSIM</option>
              <option value="RIYADH">RIYADH</option>
              <option value="ALAHSA">ALAHSA</option>
              <option value="HAIL">HAIL</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>BANDWIDTH (BW)</label>
            <select
              value={bw}
              onChange={(e) => setBw(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            >
              <option value="100Mbps">100Mbps</option>
              <option value="25MBPs">25MBPs</option>
              <option value="20MBPs">20MBPs</option>
              <option value="8MBPs">8MBPs</option>
              <option value="6MBPs">6MBPs</option>
              <option value="4MBPs">4MBPs</option>
              <option value="1MBPs">1MBPs</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>LOS ID</label>
            <input
              type="text"
              value={losId}
              onChange={(e) => setLosId(e.target.value)}
              placeholder="e.g. ZAKA160"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>WORKFLOW STATUS</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            >
              <option value="Under MW Installation">Under MW Installation</option>
              <option value="Under Activation">Under Activation</option>
              <option value="Under TWAL Approval">Under TWAL Approval</option>
              <option value="Delivered / CR Pending">Delivered / CR Pending</option>
              <option value="Delivered ">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Not Yet Set">Not Yet Set</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ASSIGNED ENGINEER</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            >
              <option value="Haroon">Haroon</option>
              <option value="Shukoor">Shukoor</option>
              <option value="Tariq">Tariq</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>REMARKS / NOTES</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.2rem' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '0.5rem 1.4rem', borderRadius: '6px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              {isEdit ? 'Update Order' : 'Create Order'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
