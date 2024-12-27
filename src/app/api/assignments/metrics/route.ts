// src/app/api/assignments/metrics/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Assignment from '@/models/Assignment';
import { IAssignmentMetrics } from '@/types';

export async function GET() {
  try {
    await connectDB();
    
    // Get all assignments
    const assignments = await Assignment.find({});
    
    // Calculate metrics
    const totalAssigned = assignments.length;
    const successfulAssignments = assignments.filter(a => a.status === 'success');
    const successRate = (successfulAssignments.length / totalAssigned) * 100;
    
    // Calculate average assignment time
    const successfulTimestamps = successfulAssignments.map(a => a.timestamp);
    const averageTime = calculateAverageTime(successfulTimestamps);
    
    // Get failure reasons
    const failureReasons = assignments
      .filter(a => a.status === 'failed')
      .reduce((acc: { reason: string; count: number; }[], curr) => {
        const reason = curr.reason || 'Unknown';
        const existing = acc.find(r => r.reason === reason);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ reason, count: 1 });
        }
        return acc;
      }, []);
    
    const metrics: IAssignmentMetrics = {
      totalAssigned,
      successRate,
      averageTime,
      failureReasons
    };
    
    return NextResponse.json(metrics);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch assignment metrics, error = ', err },
      { status: 500 }
    );
  }
}

function calculateAverageTime(timestamps: Date[]): number {
  if (timestamps.length === 0) return 0;
  
  const total = timestamps.reduce((sum, timestamp) => {
    return sum + timestamp.getTime();
  }, 0);
  
  return total / timestamps.length;
}