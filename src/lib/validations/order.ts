// src/lib/validations/order.ts
import { z } from 'zod';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const orderItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative')
});

export const orderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  customer: z.object({
    name: z.string().min(2, 'Customer name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters')
  }),
  area: z.string().min(1, 'Area is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  status: z.enum(['pending', 'assigned', 'picked', 'delivered']),
  scheduledFor: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  assignedTo: z.string().refine(val => !val || isValidObjectId(val), {
    message: 'Invalid partner ID format'
  }).optional(),
  totalAmount: z.number().min(0, 'Total amount cannot be negative')
});