import React, { useState } from 'react';
import { Order, OrderStatus, UserRole } from '../types';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  currentRole: UserRole;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  currentRole,
  onUpdateOrder
}) => {
  if (!order) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'engineer'>('overview');
  const [newRemark, setNewRemark] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState(order.assigned_to || 'Haroon');
  const [uploadedFiles, setUploadedFiles] = useState(order.documents || []);

  const workflowSteps = [
    { label: 'New', status: 'New' },
    { label: 'Survey', status: 'Survey' },
    { label: 'Under Installation', status: 'Under MW Installation' },
    { label: 'LOS Visible', status: 'CLOS' },
    { label: 'Under Activation', status: 'Under Activation' },
    { label: 'Delivered', status: 'Delivered ' }
  ];

  const handleStatusChange = (newStatus: OrderStatus) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: currentRole,
      action: 'Status Updated',
      details: `Status updated to ${newStatus}`
    };

    const updated: Order = {
      ...order,
      order_status: newStatus,
      updated_at: new Date().toISOString(),
      history: [newActivity, ...(order.history || [])]
    };

    onUpdateOrder(updated);
  };

  const handleAssignEngineer = () => {
    const newActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: currentRole,
      action: 'Engineer Assigned',
      details: `Assigned engineer ${selectedEngineer}`
    };

    const updated: Order = {
      ...order,
      assigned_to: selectedEngineer,
      history: [newActivity, ...(order.history || [])]
    };

    onUpdateOrder(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type || 'application/octet-stream',
      uploaded_at: new Date().toISOString().substring(0, 10),
      uploaded_by: currentRole
    };

    const updatedDocs = [...uploadedFiles, newDoc];
    setUploadedFiles(updatedDocs);

    const updated: Order = {
      ...order,
      documents: updatedDocs
    };
    onUpdateOrder(updated);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '750px',
        height: '100vh',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{order.ki_id}</span>
              {order.is_cancelled ? (
                <span className="badge badge-cancelled">Cancelled</span>
              ) : (
                <span className="badge badge-clos">{order.order_status}</span>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Order #{order.order_number} | Circuit: {order.circuit_id}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '1.4rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Workflow Progress Stepper */}
        <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Workflow Progress Stepper</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', position: 'relative' }}>
            {workflowSteps.map((step, idx) => {
              const isCurrent = order.order_status.includes(step.status) || (step.status === 'CLOS' && order.los_status === 'CLOS');
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                    border: isCurrent ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    color: isCurrent ? '#fff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '0.7rem', marginTop: '0.4rem', color: isCurrent ? 'var(--accent-blue)' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 400 }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Tabs Header */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '0 1.5rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{ padding: '0.8rem 1.2rem', background: 'none', border: 'none', color: activeTab === 'overview' ? 'var(--accent-blue)' : 'var(--text-secondary)', borderBottom: activeTab === 'overview' ? '2px solid var(--accent-blue)' : 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            style={{ padding: '0.8rem 1.2rem', background: 'none', border: 'none', color: activeTab === 'documents' ? 'var(--accent-blue)' : 'var(--text-secondary)', borderBottom: activeTab === 'documents' ? '2px solid var(--accent-blue)' : 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            Documents ({uploadedFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            style={{ padding: '0.8rem 1.2rem', background: 'none', border: 'none', color: activeTab === 'timeline' ? 'var(--accent-blue)' : 'var(--text-secondary)', borderBottom: activeTab === 'timeline' ? '2px solid var(--accent-blue)' : 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            Activity Timeline
          </button>
          <button
            onClick={() => setActiveTab('engineer')}
            style={{ padding: '0.8rem 1.2rem', background: 'none', border: 'none', color: activeTab === 'engineer' ? 'var(--accent-blue)' : 'var(--text-secondary)', borderBottom: activeTab === 'engineer' ? '2px solid var(--accent-blue)' : 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            Engineer Assignment
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Customer Info Card */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Customer & Contact Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Name</span>
                    <div style={{ fontWeight: 700 }}>{order.customer_name}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Info</span>
                    <div style={{ fontWeight: 600 }}>{order.customer_contact}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Region / City</span>
                    <div style={{ fontWeight: 600 }}>{order.region} - {order.city}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bandwidth (BW)</span>
                    <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{order.bw}</div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications & Dates Card */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Technical Schedule & Milestone Dates</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order Received Date</span>
                    <div style={{ fontWeight: 600 }}>{order.order_received || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LOS Survey Date</span>
                    <div style={{ fontWeight: 600 }}>{order.los_performed || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LOS ID / Reference</span>
                    <div style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{order.los_id || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Installation Start Date</span>
                    <div style={{ fontWeight: 600 }}>{order.installation_start || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Installation Complete</span>
                    <div style={{ fontWeight: 600 }}>{order.installation_complete || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivery / Activation Date</span>
                    <div style={{ fontWeight: 700, color: '#10b981' }}>{order.delivery_date || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Remarks / Action Notes */}
              {order.remarks && (
                <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-blue)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>REMARKS / OPERATIONAL NOTES</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{order.remarks}</p>
                </div>
              )}

              {/* Status Update Quick Controls */}
              {currentRole !== 'Viewer' && (
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem' }}>UPDATE WORKFLOW STATUS</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleStatusChange('Under MW Installation')} style={{ padding: '0.4rem 0.8rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      Set: Under MW Installation
                    </button>
                    <button onClick={() => handleStatusChange('Under Activation')} style={{ padding: '0.4rem 0.8rem', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      Set: Under Activation
                    </button>
                    <button onClick={() => handleStatusChange('Under TWAL Approval')} style={{ padding: '0.4rem 0.8rem', background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      Set: Under TWAL Approval
                    </button>
                    <button onClick={() => handleStatusChange('Delivered / CR Pending')} style={{ padding: '0.4rem 0.8rem', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      Set: Delivered / CR Pending
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Tab 2: Documents */}
          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {currentRole !== 'Viewer' && (
                <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', border: '2px dashed var(--border-color)' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                    Upload supporting survey files, LOS reports, permission letters, or completion photos (PDF, PNG, JPG, DOCX, ZIP)
                  </p>
                  <label style={{
                    background: 'var(--accent-blue)',
                    color: '#fff',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}>
                    📁 Choose File to Attach
                    <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {uploadedFiles.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No attached documents for this order.</p>
                ) : (
                  uploadedFiles.map(doc => (
                    <div key={doc.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>📄</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{doc.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size} • Uploaded on {doc.uploaded_at} by {doc.uploaded_by}</div>
                        </div>
                      </div>
                      <button style={{ background: 'rgba(59, 130, 246, 0.15)', border: 'none', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                        Download
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* Tab 3: Activity Timeline */}
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(order.history || []).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No activity history logged yet.</p>
              ) : (
                (order.history || []).map(item => (
                  <div key={item.id} className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid var(--accent-blue)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.action}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.details}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'block', marginTop: '0.4rem' }}>By: {item.user}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Engineer Assignment */}
          {activeTab === 'engineer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Assign Field Engineer or Team</h4>
                
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>ASSIGNED ENGINEER</label>
                  <select
                    value={selectedEngineer}
                    onChange={(e) => setSelectedEngineer(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  >
                    <option value="Haroon">Haroon (Senior MW Specialist - Riyadh)</option>
                    <option value="Shukoor">Shukoor (Field Engineer - Qassim/Hail)</option>
                    <option value="Tariq">Tariq (Survey Engineer - East Region)</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                {currentRole !== 'Viewer' && (
                  <button
                    onClick={handleAssignEngineer}
                    style={{ background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save Engineer Assignment
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            Close Detail Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
