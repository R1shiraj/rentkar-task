// src/types/index.ts
export interface IAssignment {
    _id?: string;
    orderId?: string;
    partnerId?: string;
    timestamp: Date;
    status: 'success' | 'failed' | 'pending' | 'assigned' | 'picked' | 'delivered';
    reason?: string;
  }
  
  export interface IAssignmentMetrics {
    totalAssigned: number;
    successRate: number;
    averageTime: number;
    failureReasons: {
      reason: string;
      count: number;
    }[];
  }
  