import React, { useEffect, useState } from 'react';
import { OrdersList } from './OrdersList';

const API_BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:3001/api';

export interface Garment {
  id: string;
  description: string;
  status: 'received' | 'in_cleaning' | 'ready' | 'delivered';
}

export interface Order {
  id: string;
  customerName: string;
  createdAt: string;
  garments: Garment[];
  totalGarments?: number;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'received', label: 'Received' },
  { value: 'in_cleaning', label: 'In Cleaning' },
  { value: 'ready', label: 'Ready for Pickup' },
  { value: 'delivered', label: 'Delivered' },
] as const;

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'received' | 'in_cleaning' | 'ready' | 'delivered'>('all');
  const [summary, setSummary] = useState<Record<Garment['status'], number> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrdersAndSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, summaryRes] = await Promise.all([
          fetch(`${API_BASE}/orders`, { signal: controller.signal }),
          fetch(`${API_BASE}/orders/summary`, { signal: controller.signal })
        ]);
        if (!ordersRes.ok) throw new Error(`HTTP ${ordersRes.status} on orders`);
        if (!summaryRes.ok) throw new Error(`HTTP ${summaryRes.status} on summary`);
        
        const ordersData = (await ordersRes.json()) as Order[];
        const summaryData = (await summaryRes.json()) as Record<Garment['status'], number>;
        
        setOrders(ordersData);
        setSummary(summaryData);
        setLoading(false);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Failed to load data');
        setLoading(false);
      }
    };

    fetchOrdersAndSummary();
    return () => controller.abort();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>QDC Dashboard</h1>
        <p>Real-time overview of orders and garment statuses</p>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading dashboard…</span>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <strong>Something went wrong — </strong>{error}
        </div>
      )}

      {!loading && !error && (
        <>
          {summary && (
            <div className="summary-grid">
              {Object.entries(summary).map(([status, count]) => (
                <div key={status} className={`summary-card ${status}`}>
                  <div className="label">{status.replace('_', ' ')}</div>
                  <div className="count">{count}</div>
                </div>
              ))}
            </div>
          )}

          <div className="filter-bar">
            <label htmlFor="statusFilter">Filter:</label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <OrdersList orders={orders} selectedStatus={selectedStatus} />
        </>
      )}
    </div>
  );
};
