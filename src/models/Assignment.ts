// src/models/Assignment.ts
import mongoose from 'mongoose';
import { IAssignment, IAssignmentMetrics } from '@/types';


const assignmentSchema = new mongoose.Schema<IAssignment>({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: false
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success' , 'failed' , 'pending' , 'assigned' , 'picked' , 'delivered'],
    required: true
  },
  reason: {
    type: String,
    required: false
  }
});

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);

export default Assignment;