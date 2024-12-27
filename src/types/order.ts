// src/types/order.ts
export interface IOrder {
    _id?: string;
    orderNumber: string;
    customer: {
      name: string;
      phone: string;
      address: string;
    };
    area: string;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    status: 'pending' | 'assigned' | 'picked' | 'delivered';
    scheduledFor: string;
    assignedTo?: string;
    totalAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
  }