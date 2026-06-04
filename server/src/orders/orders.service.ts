import { Injectable } from '@nestjs/common';

export type GarmentStatus = 'received' | 'in_cleaning' | 'ready' | 'delivered';

export interface Garment {
  id: string;
  description: string;
  status: GarmentStatus;
}

export interface Order {
  id: string;
  customerName: string;
  createdAt: string; // ISO string
  garments: Garment[];
  totalGarments?: number;
}

// In-memory mock data to simulate a POS-like workflow
const ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'Alice Johnson',
    createdAt: new Date().toISOString(),
    garments: [
      { id: 'G-1', description: 'Blue Shirt', status: 'received' },
      { id: 'G-2', description: 'Black Trousers', status: 'in_cleaning' },
    ],
  },
  {
    id: 'ORD-1002',
    customerName: 'Bob Singh',
    createdAt: new Date().toISOString(),
    garments: [
      { id: 'G-3', description: 'Wedding Gown', status: 'ready' },
    ],
  },
];

@Injectable()
export class OrdersService {
  findAll(): Order[] {
    return ORDERS.map(order => ({
      ...order,
      totalGarments: order.garments.length
    }));
  }

  findOne(id: string): Order | undefined {
    const order = ORDERS.find((o) => o.id === id);
    if (order) {
      return { ...order, totalGarments: order.garments.length };
    }
    return undefined;
  }

  getGarmentStatusSummary(): Record<GarmentStatus, number> {
    const summary: Record<GarmentStatus, number> = {
      received: 0,
      in_cleaning: 0,
      ready: 0,
      delivered: 0,
    };
    for (const order of ORDERS) {
      for (const garment of order.garments) {
        summary[garment.status]++;
      }
    }
    return summary;
  }
}
