import React from 'react';
import type { Order } from './App';

interface Props {
  orders: Order[];
  selectedStatus: 'all' | 'received' | 'in_cleaning' | 'ready' | 'delivered';
}

const statusLabel: Record<string, string> = {
  received: 'Received',
  in_cleaning: 'In Cleaning',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
};

export const OrdersList: React.FC<Props> = ({ orders, selectedStatus }) => {
  if (orders.length === 0) {
    return <div className="empty-state">No active orders.</div>;
  }

  const filteredOrders = orders.map(order => ({
    ...order,
    garments: selectedStatus === 'all'
      ? order.garments
      : order.garments.filter(g => g.status === selectedStatus)
  })).filter(order => order.garments.length > 0);

  if (filteredOrders.length === 0) {
    return <div className="empty-state">No garments match the selected status.</div>;
  }

  return (
    <div className="orders-list">
      {filteredOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span className="order-id">{order.id}</span>
            <span className="order-customer">{order.customerName}</span>
          </div>
          <div className="order-meta">
            <span>Created: {new Date(order.createdAt).toLocaleString()}</span>
            <span>{order.totalGarments ?? order.garments.length} garments</span>
          </div>
          <ul className="garments-list">
            {order.garments.map((g) => (
              <li key={g.id} className="garment-item">
                <span className="garment-name">{g.description}</span>
                <span className={`status-badge ${g.status}`}>
                  {statusLabel[g.status] ?? g.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
