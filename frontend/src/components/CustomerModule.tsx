import React, { useState } from 'react';
import { Customer, Order } from '../types';

interface CustomerModuleProps {
  customers: Customer[];
  orders: Order[];
  onSelectCustomerOrders: (customerName: string) => void;
}

export const CustomerModule: React.FC<CustomerModuleProps> = ({
  customers,
  orders,
  onSelectCustomerOrders
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Customer Directory & Accounts</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Managing {customers.length} registered enterprise and ISP accounts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search Customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredCustomers.map(customer => {
          const customerOrders = orders.filter(o => o.customer_name.toLowerCase().includes(customer.name.toLowerCase()) || customer.name.toLowerCase().includes(o.customer_name.toLowerCase()));
          return (
            <div key={customer.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{customer.name}</h3>
                  <span className="badge badge-clos">{customerOrders.length} Orders</span>
                </div>
                
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>{customer.company_name}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div>👤 Contact: <strong style={{ color: 'var(--text-primary)' }}>{customer.contact_person}</strong> ({customer.mobile})</div>
                  <div>📍 Location: {customer.city}, {customer.region}</div>
                  <div>🆔 National Address: <span style={{ fontFamily: 'monospace' }}>{customer.national_address}</span></div>
                  <div>🏛️ VAT #: <span style={{ fontFamily: 'monospace' }}>{customer.vat_number}</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  style={{ flex: 1, padding: '0.4rem', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  View Details
                </button>
                <button
                  onClick={() => onSelectCustomerOrders(customer.name)}
                  style={{ flex: 1, padding: '0.4rem', background: 'rgba(59, 130, 246, 0.15)', border: 'none', color: '#3b82f6', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  View Orders ({customerOrders.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedCustomer.name}</h3>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.875rem' }}>
              <div><strong>Company Name:</strong> {selectedCustomer.company_name}</div>
              <div><strong>Contact Person:</strong> {selectedCustomer.contact_person} ({selectedCustomer.mobile})</div>
              <div><strong>Email:</strong> {selectedCustomer.email}</div>
              <div><strong>Address:</strong> {selectedCustomer.address}</div>
              <div><strong>Region & City:</strong> {selectedCustomer.region} - {selectedCustomer.city}</div>
              <div><strong>National Address:</strong> {selectedCustomer.national_address}</div>
              <div><strong>VAT Registration:</strong> {selectedCustomer.vat_number}</div>
              <div><strong>Account Notes:</strong> {selectedCustomer.notes}</div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedCustomer(null)}
                style={{ padding: '0.5rem 1.2rem', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
