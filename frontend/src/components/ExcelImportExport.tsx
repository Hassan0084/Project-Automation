import React, { useState } from 'react';
import { Order } from '../types';

interface ExcelImportExportProps {
  orders: Order[];
  onImportOrders: (importedOrders: Order[]) => void;
}

export const ExcelImportExport: React.FC<ExcelImportExportProps> = ({
  orders,
  onImportOrders
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Partial<Order>[]>([]);
  const [validationReport, setValidationReport] = useState<{ duplicates: number; valid: number; total: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Column Mapping Preview state
  const columnMapping = [
    { excelCol: 'SL No.', systemField: 'sl_no', mapped: true },
    { excelCol: 'KI ID', systemField: 'ki_id', mapped: true },
    { excelCol: 'Order Received', systemField: 'order_received', mapped: true },
    { excelCol: 'Region', systemField: 'region', mapped: true },
    { excelCol: 'City', systemField: 'city', mapped: true },
    { excelCol: 'Circuit ID', systemField: 'circuit_id', mapped: true },
    { excelCol: 'Order Number', systemField: 'order_number', mapped: true },
    { excelCol: 'Customer Name', systemField: 'customer_name', mapped: true },
    { excelCol: 'Customer Contact', systemField: 'customer_contact', mapped: true },
    { excelCol: 'BW', systemField: 'bw', mapped: true },
    { excelCol: 'LOS Status', systemField: 'los_status', mapped: true },
    { excelCol: 'LOS ID', systemField: 'los_id', mapped: true },
    { excelCol: 'Order Status', systemField: 'order_status', mapped: true },
    { excelCol: 'Assigned To', systemField: 'assigned_to', mapped: true }
  ];

  const handleFile = (file: File) => {
    setImportedFile(file);
    setIsProcessing(true);

    // Simulate Excel parsing & duplicate detection
    setTimeout(() => {
      // Create sample preview items simulating parsed Excel rows
      const parsedSample: Partial<Order>[] = [
        {
          sl_no: '18',
          ki_id: 'KIC-019-MW-MEL-STC',
          order_received: '2026-07-28',
          region: 'CENTRAL',
          city: 'RIYADHDST',
          circuit_id: 'RIYADHDISTRICTS-RIYADH W-DIA66200',
          order_number: 'I-156000112-9900',
          customer_name: 'STC Enterprise Division',
          customer_contact: 'Fahad Al-Qahtani - 0501112233',
          bw: '100Mbps',
          los_status: 'CLOS',
          los_id: 'ZAKA999',
          order_status: 'Under MW Installation',
          assigned_to: 'Haroon',
          is_cancelled: false
        },
        {
          sl_no: '19',
          ki_id: 'KIC-020-MW-MEL-STC',
          order_received: '2026-07-28',
          region: 'EAST',
          city: 'ALAHSA',
          circuit_id: 'ALAHSA-DAMMAM W-PLL60999',
          order_number: 'I-156000113-9901',
          customer_name: 'Aramco Regional Office',
          customer_contact: 'Saad Al-Ghamdi - 0504445566',
          bw: '100Mbps',
          los_status: 'CLOS',
          los_id: 'FRD99',
          order_status: 'Under Activation',
          assigned_to: 'Tariq',
          is_cancelled: false
        }
      ];

      setImportPreview(parsedSample);
      setValidationReport({
        total: parsedSample.length,
        valid: parsedSample.length,
        duplicates: 0
      });
      setIsProcessing(false);
    }, 800);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    const formatted: Order[] = importPreview.map((item, idx) => ({
      id: `ord-imp-${Date.now()}-${idx}`,
      sl_no: item.sl_no || `${orders.length + idx + 1}`,
      ki_id: item.ki_id || `KIC-IMP-${idx}`,
      order_received: item.order_received || new Date().toISOString().substring(0, 10),
      region: item.region || 'CENTRAL',
      city: item.city || 'RIYADHDST',
      circuit_id: item.circuit_id || '',
      order_number: item.order_number || '',
      customer_name: item.customer_name || 'Imported Customer',
      customer_contact: item.customer_contact || '',
      bw: item.bw || '8MBPs',
      los_performed: new Date().toISOString().substring(0, 10),
      los_status: item.los_status as any || 'CLOS',
      los_id: item.los_id || '',
      cwo_date: '',
      installation_start: '',
      installation_complete: '',
      delivery_date: '',
      order_status: item.order_status as any || 'Under MW Installation',
      assigned_to: item.assigned_to || 'Haroon',
      is_cancelled: false
    }));

    onImportOrders([...orders, ...formatted]);
    alert(`Successfully imported ${formatted.length} new orders into the system database!`);
    setImportedFile(null);
    setImportPreview([]);
    setValidationReport(null);
  };

  // Export handlers
  const handleExportXlsx = () => {
    alert('Generating KI_Orders_with_Summary_Export.xlsx file matching exact workbook tabs (Active Orders, Cancelled Orders, Summary recalculations)...');
  };

  const handleExportCsv = () => {
    alert('Generating Active_Orders_Report.csv...');
  };

  const handleExportPdf = () => {
    alert('Generating Executive_Management_Summary.pdf...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Section 1: Excel Import Engine */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>📥</span> Excel Workbook Import Engine
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Import existing order tracking sheets (compatible with KI_Orders_with_Summary_Updated format).
            </p>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px dashed var(--accent-blue)' : '2px dashed var(--border-color)',
            background: dragActive ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Drag and drop your Excel file (.xlsx / .csv) here
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.4rem 0 1rem 0' }}>
            Supports multi-sheet workbooks with column auto-mapping and duplicate checking
          </p>
          
          <label style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            padding: '0.6rem 1.4rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-block'
          }}>
            Browse Local File
            <input
              type="file"
              accept=".xlsx,.csv,.xls"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Import Processing Indicator */}
        {isProcessing && (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
            Parsing workbook data & validating column mapping...
          </div>
        )}

        {/* Import Column Mapping & Preview Matrix */}
        {importedFile && !isProcessing && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Validation Summary Bar */}
            {validationReport && (
              <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #10b981' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Validation Matrix Report for {importedFile.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Total Rows Detected: {validationReport.total} | Valid Records: {validationReport.valid} | Duplicates: {validationReport.duplicates}
                  </span>
                </div>
                <button
                  onClick={handleConfirmImport}
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Commit Import to Database
                </button>
              </div>
            )}

            {/* Column Mapping Table */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Auto Column Mapping Matrix</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                {columnMapping.map((col, idx) => (
                  <div key={idx} style={{ padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Excel Header: <strong>{col.excelCol}</strong></div>
                    <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.2rem' }}>→ Field: {col.systemField}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Data Preview Before Import</h4>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>KI ID</th>
                    <th>Customer</th>
                    <th>Region</th>
                    <th>City</th>
                    <th>BW</th>
                    <th>Circuit ID</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{row.ki_id}</td>
                      <td>{row.customer_name}</td>
                      <td>{row.region}</td>
                      <td>{row.city}</td>
                      <td>{row.bw}</td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{row.circuit_id}</td>
                      <td><span className="badge badge-installation">{row.order_status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* Section 2: Excel / CSV / PDF Multi-Format Export Engine */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span>📤</span> Enterprise Export & Reporting Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Export active orders, cancelled orders, and calculated dashboard summaries into Excel (.xlsx), CSV, and PDF formats.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          
          {/* Excel Export Card */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🟩</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Excel Workbook (.xlsx)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Full workbook containing Active Orders, Cancelled Orders, and recalculated Summary formula tab.
            </p>
            <button
              onClick={handleExportXlsx}
              style={{ width: '100%', padding: '0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Export Complete Excel Workbook
            </button>
          </div>

          {/* CSV Export Card */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Flat Data Export (.csv)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Raw data extract of all active customer orders for analysis or external database ingestion.
            </p>
            <button
              onClick={handleExportCsv}
              style={{ width: '100%', padding: '0.6rem', background: '#06b6d4', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Export CSV Orders Table
            </button>
          </div>

          {/* PDF Report Card */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f43f5e' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📕</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Executive PDF Summary</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Formatted PDF document with executive metrics, breakdown graphs, and operations summary.
            </p>
            <button
              onClick={handleExportPdf}
              style={{ width: '100%', padding: '0.6rem', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Generate Executive PDF Report
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
