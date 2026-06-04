import React, { useEffect, useState } from 'react';
import { OrdersList } from './OrdersList';

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

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'received' | 'in_cleaning' | 'ready' | 'delivered'>('all');
  const [summary, setSummary] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchOrdersAndSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, summaryRes] = await Promise.all([
          fetch('http://localhost:3001/api/orders'),
          fetch('http://localhost:3001/api/orders/summary')
        ]);
        if (!ordersRes.ok) throw new Error(`HTTP ${ordersRes.status} on orders`);
        if (!summaryRes.ok) throw new Error(`HTTP ${summaryRes.status} on summary`);
        
        const ordersData = (await ordersRes.json()) as Order[];
        const summaryData = (await summaryRes.json()) as Record<string, number>;
        
        setOrders(ordersData);
        setSummary(summaryData);
      } catch (e: any) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndSummary();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>QDC Mini Dashboard</h1>
      <p>Simple view of active orders and garments.</p>
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <div style={{ width: '16px', height: '16px', border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>Loading...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!loading && !error && summary && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {Object.entries(summary).map(([status, count]) => (
            <div key={status} style={{ padding: '0.75rem 1rem', background: '#e0e7ff', borderRadius: '8px', border: '1px solid #c7d2fe', minWidth: '100px' }}>
              <div style={{ fontSize: '0.8rem', color: '#4f46e5', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#312e81' }}>{count}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="received">Received</option>
          <option value="in_cleaning">In Cleaning</option>
          <option value="ready">Ready for Pickup</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      {!loading && !error && <OrdersList orders={orders} selectedStatus={selectedStatus} />}
    </div>
  );
};
