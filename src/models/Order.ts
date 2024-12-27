// src/models/Order.ts
import mongoose, { Schema } from 'mongoose';
import { IOrder } from '@/types/order';

const orderSchema = new Schema<IOrder>({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  area: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked', 'delivered'],
    default: 'pending'
  },
  scheduledFor: { 
    type: String, 
    required: true 
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Partner',
    required: false
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  // Add indexes in the schema options instead
  indexes: [
    { orderNumber: 1 },
    { status: 1 },
    { area: 1 },
    // { assignedTo: 1 }
  ]
});

// Remove the separate index declarations
// orderSchema.index({ orderNumber: 1 });
// orderSchema.index({ status: 1 });
// orderSchema.index({ area: 1 });
// orderSchema.index({ assignedTo: 1 });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;