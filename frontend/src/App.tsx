import React, { useState, useEffect } from 'react';
import { Order, Customer, AuditLogItem, UserRole } from './types';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_AUDIT_LOGS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { OrderManagement } from './components/OrderManagement';
import { OrderDetailModal } from './components/OrderDetailModal';
import { OrderFormModal } from './components/OrderFormModal';
import { ExcelImportExport } from './components/ExcelImportExport';
import { CustomerModule } from './components/CustomerModule';
import { EngineerWorkload } from './components/EngineerWorkload';
import { EmailReporting } from './components/EmailReporting';
import { AuditLogView } from './components/AuditLogView';

export const App: React.FC = () => {
  // State
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);

  // Load from API on Mount
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: Order[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(() => console.log('Using local order state fallback'));

    fetch('/api/audit-logs')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((logs: AuditLogItem[]) => {
        if (Array.isArray(logs) && logs.length > 0) {
          setAuditLogs(logs);
        }
      })
      .catch(() => {});
  }, []);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Handlers
  const handleSaveOrder = async (savedOrder: Order) => {
    const exists = orders.some(o => o.id === savedOrder.id);
    let updatedList: Order[];
    if (exists) {
      updatedList = orders.map(o => o.id === savedOrder.id ? savedOrder : o);
      fetch(`/api/orders/${savedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedOrder)
      }).catch(() => {});
    } else {
      updatedList = [savedOrder, ...orders];
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedOrder)
      }).catch(() => {});
    }

    setOrders(updatedList);

    // Audit Log entry
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentRole,
      role: currentRole,
      action: exists ? 'Order Updated' : 'Order Created',
      target: savedOrder.ki_id,
      details: `${exists ? 'Updated details for' : 'Created new order'} ${savedOrder.customer_name}`,
      ip_address: '127.0.0.1'
    };
    setAuditLogs([newLog, ...auditLogs]);

    setIsNewOrderModalOpen(false);
    setOrderToEdit(null);
  };

  const handleUpdateOrders = (updatedList: Order[]) => {
    setOrders(updatedList);
  };

  const handleImportOrders = (importedList: Order[]) => {
    setOrders(importedList);
    fetch('/api/orders/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders: importedList })
    }).catch(() => {});

    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentRole,
      role: currentRole,
      action: 'Excel Import',
      target: 'Orders Database',
      details: `Bulk imported ${importedList.length} orders from Excel file`,
      ip_address: '127.0.0.1'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNewOrder={() => setIsNewOrderModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '0 1.5rem 2rem 1.5rem', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        
        {/* Module 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            orders={orders}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}

        {/* Module 2: Order Management */}
        {activeTab === 'orders' && (
          <OrderManagement
            orders={orders}
            currentRole={currentRole}
            searchTerm={searchTerm}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onEditOrder={(ord) => { setOrderToEdit(ord); setIsNewOrderModalOpen(true); }}
            onNewOrder={() => { setOrderToEdit(null); setIsNewOrderModalOpen(true); }}
            onUpdateOrders={handleUpdateOrders}
          />
        )}

        {/* Module 3: Customers */}
        {activeTab === 'customers' && (
          <CustomerModule
            customers={customers}
            orders={orders}
            onSelectCustomerOrders={(custName) => {
              setSearchTerm(custName);
              setActiveTab('orders');
            }}
          />
        )}

        {/* Module 4: Engineer Workload */}
        {activeTab === 'engineers' && (
          <EngineerWorkload
            orders={orders}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
          />
        )}

        {/* Module 5: Excel Import / Export */}
        {activeTab === 'excel' && (
          <ExcelImportExport
            orders={orders}
            onImportOrders={handleImportOrders}
          />
        )}

        {/* Module 6: Email Reports */}
        {activeTab === 'email' && (
          <EmailReporting orders={orders} />
        )}

        {/* Module 7: Audit Trail */}
        {activeTab === 'audit' && (
          <AuditLogView logs={auditLogs} />
        )}

      </main>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          currentRole={currentRole}
          onUpdateOrder={(updated) => {
            const newList = orders.map(o => o.id === updated.id ? updated : o);
            setOrders(newList);
            setSelectedOrder(updated);
            fetch(`/api/orders/${updated.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated)
            }).catch(() => {});
          }}
        />
      )}

      {/* Order Create / Edit Form Modal */}
      {isNewOrderModalOpen && (
        <OrderFormModal
          orderToEdit={orderToEdit}
          onClose={() => { setIsNewOrderModalOpen(false); setOrderToEdit(null); }}
          onSave={handleSaveOrder}
          totalOrdersCount={orders.length}
        />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.25rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-secondary)'
      }}>
        Kreativ Icon ISP Order & Project Management System © 2026. Production Ready • Powered by Express API & React Vite
      </footer>

    </div>
  );
};
