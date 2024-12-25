import mongoose, { Schema } from 'mongoose';
import { IDeliveryPartner } from '@/types/partner';

const partnerSchema = new Schema<IDeliveryPartner>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'inactive' 
  },
  currentLoad: { 
    type: Number, 
    default: 0,
    max: 3
  },
  areas: [{ type: String }],
  shift: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  metrics: {
    rating: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

const Partner = mongoose.models.Partner || mongoose.model<IDeliveryPartner>('Partner', partnerSchema);

export default Partner;