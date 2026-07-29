import React from 'react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onNewOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  darkMode,
  setDarkMode,
  searchTerm,
  setSearchTerm,
  onNewOrder
}) => {
  const roles: UserRole[] = [
    'Super Admin',
    'Admin',
    'Project Coordinator',
    'Engineer',
    'Sales/User',
    'Viewer'
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Orders Management', icon: '📦' },
    { id: 'customers', label: 'Customers', icon: '🏢' },
    { id: 'engineers', label: 'Engineer Workload', icon: '👷' },
    { id: 'excel', label: 'Excel Import/Export', icon: '📑' },
    { id: 'email', label: 'Email Reports', icon: '📧' },
    { id: 'audit', label: 'Audit Trail', icon: '📜' }
  ];

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: 'var(--glass-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 1.5rem'
    }}>
      {/* Top bar with Brand, Role Selector & Utilities */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Brand logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            KI
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Kreativicon ISP
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Order & Project Management System
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: 1, maxW: '480px', margin: '0 2rem', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.5rem 1rem'
          }}>
            <span style={{ marginRight: '0.5rem', opacity: 0.6 }}>🔍</span>
            <input
              type="text"
              placeholder="Global Search (Customer, KI ID, Circuit ID, Order #, Engineer...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right side controls: Role switch, Theme toggle, New Order */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Role selector dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              style={{
                background: 'var(--bg-primary)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Theme"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>

          {/* Create New Order Button */}
          {currentRole !== 'Viewer' && (
            <button
              onClick={onNewOrder}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1.1rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'transform 0.2s'
              }}
            >
              <span>➕</span> New Order
            </button>
          )}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 0 0 0' }}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                border: 'none',
                background: isActive ? 'var(--bg-primary)' : 'transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                borderRadius: '8px 8px 0 0',
                borderBottom: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
